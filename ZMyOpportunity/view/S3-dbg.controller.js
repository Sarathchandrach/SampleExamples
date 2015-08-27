/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*jQuery.sap.require("sap.collaboration.components.fiori.feed.Component");
jQuery.sap.require("sap.collaboration.components.fiori.feed.dialog.Component");
jQuery.sap.require("sap.collaboration.components.fiori.sharing.Component");
jQuery.sap.require("sap.collaboration.components.fiori.sharing.dialog.Component");*/

jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("sap.m.MessageBox");

jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("cus.crm.opportunity.util.Util");

sap.ca.scfld.md.controller.BaseDetailController
		.extend(
				"cus.crm.opportunity.view.S3",
				{
					SalesStages : [],
					Priorities : [],
					UserStatuses : [],
					Currencies : [],
					ContactCollection : [],
					EmployeeCollection : [],
					prospect_number : "",
					response : [],
					opportunity_number : "",
					bAppLaunched : true,
					guid : undefined,
					partnerFunctionMap : {},
					mPartnerImgSrc : {},
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

						 this.fullScreenMode = false;
						
						
						// execute the onInit for the base class
						// BaseDetailController

						sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
								.call(this);
						
		

						// this.getView().getModel('controllers').getData().s3Controller
						// = this;
						this.oModel = this.getView().getModel();
						
						//i18n models and resource bundles
						this.oI18nModel = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel;
						this.oResourceBundle = this.oI18nModel.getResourceBundle();
						
						
						//initialize account information
						this.sProspectNumber = "";
						this.sProspectImageSrc = "";
						
						jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(
								"cus.crm.opportunity.css.Opportunity", ".css"),
								"sap-ui-theme-sap.crm");
						this.contactF4Fragment = new sap.ui.xmlfragment(this
								.createId("contact_F4_S3"),
								'cus.crm.opportunity.view.ContactF4', this);
						this.changeLogFragment = new sap.ui.xmlfragment(this
								.createId("change_Log_S3"),
								'cus.crm.opportunity.view.ChangeLog', this);
						this.changeLogFragment
								.setModel(new sap.ui.model.json.JSONModel());
						this.changeLogFragment
								.setModel(this.oI18nModel, 'i18n');
  
						//error message fragment
						this.showErrorMsgFragment = new sap.ui.xmlfragment(this
								.createId("show_Error_Msg_Fragment"),
								'cus.crm.opportunity.view.ShowErrorMsg', this);
						this.showErrorMsgFragment
								.setModel(new sap.ui.model.json.JSONModel());
						this.showErrorMsgFragment
								.setModel(this.oI18nModel, 'i18n');
						// setting named json models - for individual tabs of
						// icon tab filter - salesteam, info, products & header
//						this.byId('salesTeam').setModel(
//								new sap.ui.model.json.JSONModel(), "json");
//						this.byId('info').setModel(
//								new sap.ui.model.json.JSONModel(), "json");
//						this.byId('Product_Tab').setModel(
//								new sap.ui.model.json.JSONModel(), "json");
//						this.byId('S3_Header').setModel(
//								new sap.ui.model.json.JSONModel(), "json");

                       //for backend error message handling
						
						this.showErrorMsgFragment.getContent()[0].setModel(
								new sap.ui.model.json.JSONModel(), "json");
						this.byId('Sales_Team').addCustomData(new sap.ui.core.CustomData({key : 'controller', value :this}));
						/*
						 * this.byId('ChangeLog').setModel(new
						 * sap.ui.model.json.JSONModel(),"json");
						 */
						// setting a named json model
						this.getView().setModel(
								new sap.ui.model.json.JSONModel(), "json");

						this.oRouter.attachRouteMatched(
								this.detailRouteMatched, this);

						// Footer options are now handled in the controller
						var that = this;
						this.oHeaderFooterOptions = {};


							
						
						this.oHeaderFooterOptions3UI = {


								oEditBtn : {
									sI18nBtnTxt : "EDIT",
									onBtnPressed : function(evt) {
										that.onEdit();
									},
									bEnabled : true, // default true
								},

								buttonList : [
																										

							    //Follow_Up button in Opportunity footer		    
//							    { sI18nBtnTxt : "FOLLOW_UP",
//							    	visible : false,
//							    	  	onBtnPressed: function(evt) {
//							    		that.handleOpen(evt);
//							    	},
//							    },
							 ],
							 

								oJamOptions : {
									// to get share on JAM
									oShareSettings : {
										object : {
											id : "",
											share : ""
										}
									},
									fGetShareSettings : function() {
										var description = that.byId('info')
												.getModel('json').getData().Description;
										var url = document.URL;
										return {

											object : {
												id : url,
												share : "Opportunity:"
														+ description,
												display : that._getShareDisplay(),

											}
										};
									},

									// Discuss on JAM
									oDiscussSettings : {
										object : {
											id : "",
											share : ""
										}
									},
									fGetDiscussSettings : function() {
										var oppr_id = that.byId('info').getModel(
												'json').getData().Id;
										var url = document.URL;
										return {
											oDataServiceUrl : "/sap/opu/odata/sap/SM_INTEGRATION_SRV/",
											feedType : "object",
											object : {
												id : that._getDiscussID(),
												type : that._getDiscussType(),
												name : "OpportunityID:" + oppr_id,
												ui_url : url
											// "http://ldcigm6.wdf.sap.corp:50033/sap/bc/ui5_ui5/sap/crm_opprtnty/noShellIndex.html#/detail/Opportunities(guid'"
											// + headerGuid + "')"
											},
										};
									},
								},
							};
						
				//removing headerfooteroptions for account
						
						this.oHeaderFooterOptions4UI = {

							
								oEditBtn : {
									sI18nBtnTxt : "EDIT",
									onBtnPressed : function(evt) {
										that.onEdit();
									},
									bEnabled : true, // default true
								},

								
								buttonList : [
																										

							    //Follow_Up button in Opportunity footer		    
							    { sI18nBtnTxt : "FOLLOW_UP",
							    	visible : false,
							    	  	onBtnPressed: function(evt) {
							    		that.handleOpen(evt);
							    	},
							    }
							    
							  
							 ],
							 

								oJamOptions : {
									// to get share on JAM
									oShareSettings : {
										object : {
											id : "",
											share : ""
										}
									},
									fGetShareSettings : function() {
										var description = that.byId('info')
												.getModel('json').getData().Description;
										var url = document.URL;
										return {

											object : {
												id : url,
												share : "Opportunity:"
														+ description,
												display : that._getShareDisplay(),

											}
										};
									},

									// Discuss on JAM
									oDiscussSettings : {
										object : {
											id : "",
											share : ""
										}
									},
									fGetDiscussSettings : function() {
										var oppr_id = that.byId('info').getModel(
												'json').getData().Id;
										var url = document.URL;
										return {
											oDataServiceUrl : "/sap/opu/odata/sap/SM_INTEGRATION_SRV/",
											feedType : "object",
											object : {
												id : that._getDiscussID(),
												type : that._getDiscussType(),
												name : "OpportunityID:" + oppr_id,
												ui_url : url
											// "http://ldcigm6.wdf.sap.corp:50033/sap/bc/ui5_ui5/sap/crm_opprtnty/noShellIndex.html#/detail/Opportunities(guid'"
											// + headerGuid + "')"
											},
										};
									},
								},
							};
						//TODO : interoperability  	
						 this.sBackendVersion = cus.crm.opportunity.util.schema
							._getServiceSchemaVersion(this.oModel,
							"Opportunity");
						 
						this.oVersioningModel = new sap.ui.model.json.JSONModel({});
						
						//Hiding Document history tab for wave6 and below
						if(parseFloat(this.sBackendVersion) < 4){
							this.byId('tab_transactionHistory').setVisible(false);
						this.byId('opportunityTotalNetValue_Label').setVisible(false);
						this.byId('opportunityTotalNetValue_Text').setVisible(false);
						}
						
						this._loadVersionSpecificUI(this.sBackendVersion);
						
						var oFileUpload = this.byId('fileupload');
						var sUrlParams = this.getView().getModel().sUrlParams;
						//if upload enabled, must set xsrf token
						//and the base64 encodingUrl service for IE9 support!
						if (oFileUpload.getUploadEnabled()) {
						oFileUpload.setXsrfToken(this.getXsrfToken());
						oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams
						: ''));
						}
						
						//set empty account icon to place holder 
						this.mPartnerImgSrc[""]  = "sap-icon://person-placeholder";
						//EXTENSION POINT to hide partner images
						/**
						 * @ControllerHook extHookHideAccountImage is the controller hook  that provides option to hide/show all the Business partner images
						 *                                   
						 * @callback cus.crm.opportunity.S3.controller~extHookHideAccountImage
						 * @return {boolean}
						 */
						if (this.extHookHideAccountImage){
							this.bHideImage = this.extHookHideAccountImage();
						
						}
						
					},
					
					/**
					* gets the Xsrf token if it exists, if not, request it explicitly
					**/
					getXsrfToken: function() {
					var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
					if (!sToken) {
					this.getView().getModel().refreshSecurityToken(
					function(e, o) {
					sToken = o.headers['x-csrf-token'];
					},
					function() {
					sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: 'Could not get XSRF token',
					details: ''
					});
					},
					false);
					
					}
					
					return sToken;
					},
					
					_getBackFunction: function(){
						if (this.fullScreenMode)
							return function(){window.history.back(1);};
						else
							return undefined;
					},

					onBeforeRendering : function() {

						this.getView().getModel("controllers").getData().s3Controller = this;
					},

					
					 _loadVersionSpecificUI : function(sBackendVersion){	
						//Interoperability for Sales Area Tab	
						 if(parseFloat(sBackendVersion) >= 4){
								this.byId("tab_salesarea").setVisible(true);
							}
							else{
								this.byId("tab_salesarea").setVisible(false);
							}	
						 if(parseFloat(sBackendVersion) >= 2){
								 this._loadWave4UI();
								 if(!this.fullScreenMode)
								 this.oHeaderFooterOptions=this.oHeaderFooterOptions4UI;
								 else 
							     this.oHeaderFooterOptions = this.oHeaderFooterOptions4UI;
									
							}
							 	
							else{
							  	 this._loadWave3UI();
								 this.oHeaderFooterOptions=this.oHeaderFooterOptions3UI;
						 	 }
						 
						 
						 if(parseFloat(sBackendVersion) >= 4){
							 
							 this.oHeaderFooterOptions.buttonList.push(  //message button in Opportunity footer		
									    {
											sI18nBtnTxt : "ERROR_MESSAGE",
											sId : "errorMsg",
											onBtnPressed : jQuery.proxy(
		                                            this.onErrorMsg, this),
											bEnabled : false, // default true
										});
						 }
								
					},	
						 	
					_loadWave3UI : function(){	

						// i18n text key for sales team
						this.oVersioningModel.getData().sParticipantsNoDataTextKey  = 'NO_CONTACTS';	
						this.oVersioningModel.getData().setHeaderTextForParticipants = jQuery.proxy(function(response) {},this);	
						// sales team tab - add contact button that allows to add contacts to the
						// sales team
						this.byId('salesTeam').insertContent(new sap.m.Button({	
							text : "{i18n>ADDCONTACT}",	
							icon : "sap-icon://add",	
							press : jQuery.proxy(this.addContact,this),	
							type : "Transparent",}),0);	
					},	
						    	
					_loadWave4UI : function(){	

						// i18n text key for participants
						this.oVersioningModel.getData().sParticipantsNoDataTextKey  = 'NO_PARTICIPANTS1';	
						this.oVersioningModel.getData().setHeaderTextForParticipants = jQuery.proxy(
								function(response)  {	
									this.byId('Sales_Team').getHeaderToolbar().getContent()[0].setText(this.oResourceBundle.getText('PARTICIPANTS',[response.data.SalesTeam.results.length]));	

								},this);	
						// employee responsible to be added at the object header
						this.byId('opportunityHeader').addAggregation("attributes",new  sap.m.ObjectAttribute(	
								{  text : "{json>/EmployeeResponsibleName}",	
									active : true,	
									press :  jQuery.proxy(this.onEmpBusCardLaunch,this),	
									customData : [new sap.ui.core.CustomData({key : "PartnerNumber", value : "{json>/EmployeeResponsibleNumber}"
									}),	

									new sap.ui.core.CustomData({key : "PartnerFunctionCode", value : "00000014"}),	

									new sap.ui.core.CustomData({key : "Image", value : "{json>/ContactImgSrc}"}),	

									new sap.ui.core.CustomData({key : "Imager", value : "{json>/ImgSrc}"}),	

									]	                }));	

						// participants tab - add contact button now becomes the add participants -
						// a title "Participants (count)" gets added
						this.byId('Sales_Team').setHeaderToolbar(new sap.m.Toolbar({	
							content : [new sap.m.Label(),	
							           new sap.m.ToolbarSpacer(),	
							           new sap.m.Button({	
							        	   text : "",	
							        	   icon : "sap-icon://add",	
							        	   type : "Transparent",	
							        	   press : jQuery.proxy(this.showParticipantsF4,this)	
							           })]	
						}));	


					},
  // Displays Follow up action sheet when click on Follow Up button
				    
				    handleOpen : function(oEvent) {
				    	
				    	this.appointmentFlag = false;
				    	this.oppFlag = false;
				    	this.taskFlag = false;
				    
				    		  var that=this;
				       	      this._actionSheet = new sap.m.ActionSheet({
				    	      // title: "Choose Your Action",
				    	      showCancelButton: true,
				    	      placement: sap.m.PlacementType.Top,
				    	      
				    	  // Adding create an appointment / task buttons
				    	      
				    	      buttons: [
				    	        new sap.m.Button({
				    	        text : this
				    			.getView().getModel("i18n")
				    			.getProperty("CREATE_APPOINTMENT"),
				    	        press: function(evt) {
				    				
				    	     	        that.navToAppointmentDialog(evt);
				    	     	        
				    			},
				    	        
				    	        }),
				    	        new sap.m.Button({
				    	         text: this
				    			.getView().getModel("i18n")
				    			.getProperty("CREATE_TASK"),
				    			  press: function(evt) {
				      				
				    				  	that.navToTaskDialog(evt);
				  			},
				    	        
				    	        }),
				    	        
				    	        new sap.m.Button({
					    	         text: this
						    			.getView().getModel("i18n")
						    			.getProperty("CREATE_OPPORTUNITY"),
					    			  press: function(evt) {
					    				  that.navToOpptDialog(evt);
					    				 
										
					  			},
					    	        
					    	        }),
				    	      
				    	      ]
				    	       
				    	    });
				    	     
				       	  //EXTENSION POINT to be able to extend follow up action list
								/**
								 * @ControllerHook extHookHandleOpen is the controller hook that provides for extension of newly added follow up buttons.
								 *                                   
								 * @callback cus.crm.opportunity.S3.controller~extHookHandleOpen
								 * @param {object}
								 *           oControlEvent
								 * @return {void}
								 */
								if (this.extHookHandleOpen){
									this.extHookHandleOpen(oEvent);
								}
				    	
				    	 this._actionSheet.openBy(oEvent.getSource());
				    	
				    	 
				    	 
				    	 
				    	 
			  },
				    
				    
				 // Appointment Process Type Dialog when click on create an appointment
				    
				    navToAppointmentDialog : function(oEvent) {
				    	
						 var oModel = this.getView().getModel();
						 var oHeader = this.oModel.getContext("/" + this.sPath).getObject();
						// this.headerGuid = oHeader.Guid;
						// this.transactionType = oHeader.ProcessType;
						
						 var oGuid = this.byId('info').getModel('json').getData().Guid;
						 var oTransType = this.byId('info').getModel('json').getData().ProcessType;
						var data1;
						oModel.read("AppFollowupTransTypes?Guid='"+ oGuid + "'&TransactionType='"+oTransType+"'",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
						{ 
				             data1 = {
				            		 ProcessTypes : resp.data.results
						    };
				            
						});
						this.appointmentFlag=true;
						if(data1.ProcessTypes.length == 0)
						{
							 sap.ca.ui.message.showMessageBox({
						            type: sap.ca.ui.message.Type.ERROR,
						            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('followupfailure')
						            
						        });
						
						}
					else if(data1.ProcessTypes.length==1)
							{
							this.onlyOneAppointmentProcessType=true;
							this.processType = data1.ProcessTypes[0].ProcessTypeCode;
							this.processTypeDesc = data1.ProcessTypes[0].Description;
							this.privateFlag = data1.ProcessTypes[0].PrivateFlag;
							this.selectProcess();
							
							}
						else
							{
							this.oActionSheet = sap.ui.xmlfragment(
									"cus.crm.opportunity.view.ProcessTypeDialog",
							
									this);
							this.oActionSheet.setModel(this.getView().getModel(
							"i18n"), "i18n");
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.setData(data1);
					        this.oActionSheet.setModel(jsonModel,"json");
					     
					     
							this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
							this.oActionSheet._list.setGrowingScrollToLoad(true);
							
						
							this.oActionSheet._dialog.setVerticalScrolling(true);
						
							this.oActionSheet.open();
							}
						
						
						
					// setting appointment flag to navigate to Appointment application	
						
						
				    },
					
				    //search in process type dialog
					searchProcess : function(oEvent){
						var sValue = oEvent.getParameter("value");
						if (sValue !== undefined) {
							// apply the filter to the bound items, and the Select Dialog will update
							oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
						}
					},
					
					 navToOpptDialog : function(oEvent) {
					    	
							var oModel = this.getView().getModel();
							 var oGuid = this.byId('info').getModel('json').getData().Guid;
							 var oTransType = this.byId('info').getModel('json').getData().ProcessType;
							var data1 = null;
							oModel.read("OpptFollowupTransTypes?Guid=guid'"+ oGuid + "'&TransactionType='"+oTransType+"'",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
							{ 
	                             data1 = {
											ProcessTypes : resp.data.results
							    };
	                            
							});
							this.oppFlag = true;
							if(data1.ProcessTypes.length == 0)
							{
								 sap.ca.ui.message.showMessageBox({
							            type: sap.ca.ui.message.Type.ERROR,
							            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('followupfailure')
							            
							        });
							
							}
							else if(data1.ProcessTypes.length==1)
							{
							this.onlyOneProcessType=true;
							this.processType = data1.ProcessTypes[0].ProcessTypeCode;
							this.processTypeDesc = data1.ProcessTypes[0].Description;
							this.selectProcess();
							
							}
						else
							{
							
							
							this.oActionSheet = sap.ui.xmlfragment(
									"cus.crm.opportunity.view.ProcessTypeDialog",
							
									this);
							this.oActionSheet.setModel(this.getView().getModel(
							"i18n"), "i18n");
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.setData(data1);
	                        this.oActionSheet.setModel(jsonModel,"json");
							this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
							this.oActionSheet._list.setGrowingScrollToLoad(true);
							this.oActionSheet._dialog.setVerticalScrolling(true);
							this.oActionSheet.open();
							
							}
				    },
					
					// Task Process Type Dialog when click on create a task button
				    
				    navToTaskDialog : function(oEvent) {
				    	
						 var oModel = this.getView().getModel();
						 
						 
						 var oGuid = this.byId('info').getModel('json').getData().Guid;
						 var oTransType = this.byId('info').getModel('json').getData().ProcessType;
						var data1;
						oModel.read("TaskFollowupTransTypes?Guid='"+ oGuid + "'&TransactionType='"+oTransType+"'",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
						{ 
				             data1 = {
				            		 ProcessTypes : resp.data.results
						    };
				            
						}); 
						 
				
						
						
						this.taskFlag=true;
						if(data1.ProcessTypes.length == 0)
						{
							 sap.ca.ui.message.showMessageBox({
						            type: sap.ca.ui.message.Type.ERROR,
						            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('followupfailure')
						            
						        });
						
						}
						else if(data1.ProcessTypes.length==1)
						{
							this.onlyOneTaskProcessType=true;
							this.processType = data1.ProcessTypes[0].ProcessTypeCode;
							this.processTypeDesc = data1.ProcessTypes[0].Description;
							this.selectProcess();
						}
						else
						{
							/*this.oActionSheet = sap.ui.xmlfragment(
									"cus.crm.opportunity.view.ProcessTypeDialog",
							
									this);
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.setData(data1);
				        this.oActionSheet.setModel(jsonModel,"json");
				     
				     
						this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
						this.oActionSheet._list.setGrowingScrollToLoad(true);
						
					
						this.oActionSheet._dialog.setVerticalScrolling(true);
					
						this.oActionSheet.open();*/

							this.oActionSheet = sap.ui.xmlfragment(
									"cus.crm.opportunity.view.ProcessTypeDialog",
							
									this);
							this.oActionSheet.setModel(this.getView().getModel(
							"i18n"), "i18n");
							var jsonModel = new sap.ui.model.json.JSONModel();
							jsonModel.setData(data1);
	                        this.oActionSheet.setModel(jsonModel,"json");
							this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
							this.oActionSheet._list.setGrowingScrollToLoad(true);
							this.oActionSheet._dialog.setVerticalScrolling(true);
							this.oActionSheet.open();
							
						
					// setting appointment flag to navigate to Appointment application	
						
						
						}
				    },
					
					
					selectProcess : function(oEvent) {
						
						//  Getting context path
						
						var headerGuid = this.byId('info').getModel('json').getData().Guid;
						var sPath = "/Opportunities(guid'" + headerGuid + "')";
						
									
						
						 // common parameters from opportunity to appointment
						//console.log("title="+this.byId('opportunityHeader').getModel('json').getData().Description);
						var opportunityId = this.byId('info').getModel('json').getData().Id;
						var status = this.byId('info').getModel('json').getData().UserStatusText;
						var StartDate = this.byId('info').getModel('json').getData().StartDate;
						var AccountId = this.byId('opportunityHeader').getModel('json').getData().ProspectNumber;
						var AccountName = this.byId('opportunityHeader').getModel('json').getData().ProspectName;
						var ContactId = this.byId('opportunityHeader').getModel('json').getData().MainContactId;
						var ContactName = this.byId('opportunityHeader').getModel('json').getData().MainContactName;
						var title=this.byId('opportunityHeader').getModel('json').getData().Description;
						var previousGuid = this.byId('opportunityHeader').getModel('json').getData().Guid ; 
						var EmpName = this.byId('opportunityHeader').getModel('json').getData().EmployeeResponsibleName ;
						var EmpNumber = this.byId('opportunityHeader').getModel('json').getData().EmployeeResponsibleNumber ;
						//var processTypeDescription = this.byId('opportunityHeader').getModel('json').getData().ProcessTypeDescription ;

						//console.log("AccountName"+AccountName+ "ContactName"+ContactName+"opportunity_id"+opportunityId+"status"+status+"StartDate"+StartDate+"ClosingDate"+ClosingDate);
						if(!(this.onlyOneAppointmentProcessType || this.onlyOneTaskProcessType||this.onlyOneProcessType) )
							
								{
								var selectedItem = oEvent.getParameter("selectedItem");
								if (selectedItem) {
									this.processType= selectedItem.data("ProcessTypeCode");
									this.processTypeDesc = selectedItem.data("ProcessTypeDescription");
									this.privateFlag = selectedItem.data("PrivateFlag");
								}
								}
						
					
						//	console.log("window location" + this.processType);
					//	console.log("window location" + oEvent);
				   
						//	var aItemPaths = this.getView().getBindingContext().sPath.substr(1);      
						
						

				    	// *XNav* (1) obtain cross app navigation interface         
				    	var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;         
				    	this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");           
				    	//console.log("window location" +this.appointmentFlag);
				    
				        if(this.oppFlag)
				        	{
				        	 var ctx = this.byId('info').getModel('json').getData().Guid;
				        	    var route = "createFollowup";
				        	    if(this.fullScreenMode)
				        		    route = "fulScrOpptFollowup";
								this.oRouter.navTo(route, {
									contextPath : ctx,
									processType : this.processType,
									
								}, !jQuery.device.is.phone);
				        	
								this.oppFlag=false;
								/*var message = sap.ca.scfld.md.app.Application
								.getImpl().getResourceBundle()
								.getText(
								"followupsuccess");
							     sap.m.MessageToast.show(message, {
								   closeOnBrowserNavigation : false
							});*/
				        	}
				    	
				    	
				    	
				        else if(this.appointmentFlag){
				    		
				       	// *XNav (2) generate cross application link         
				    	var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
				    		target: { 
				    		//	semanticObject : "Appointment", 
				    		//action: "myAppointments"
				    			semanticObject : "Appointment", 
				    			action: "myAppointments"
				    		},
				    		// TODO
				    		// appSpecificRoute : ""
				    		params : { 
				    			"createFromOppt" : "X",
				    		//	"AccountName" : AccountName,
				    		//	"ContactName" : ContactName,
				    			"processType"  	 : this.processType,
				    			"selectprocess_oEvent" : oEvent,
				    			"opportunityId":opportunityId,
				    			"StartDate":StartDate,
				    			"title":title,               
				    			"prevGuid" : previousGuid,
				    		//	"processTypeDescription" : this.processTypeDesc , 
				    			"AccountID" : AccountId,
			        			"ContactID" : ContactId,
			        			"EmpID"    : EmpNumber , 
			        		//	"EmpName" : EmpName,
			        		//	"privateFlag" : this.privateFlag
				    			
				    			// "itemPaths" : aItemPaths
				    		}
				    	}) || "";           
				    	
				    	this.appointmentFlag=false;
				    	this.onlyOneAppointmentProcessType=false;
				    	//Navigate to the target         
				    	window.location = toApp ;
				    	/*var message = sap.ca.scfld.md.app.Application
						.getImpl().getResourceBundle()
						.getText(
						"followupsuccess");
					     sap.m.MessageToast.show(message, {
						   closeOnBrowserNavigation : false
					});*/
							    	
				    	}
				    		
				    	else if(this.taskFlag)
				    		{
				    		// *XNav (2) generate cross application link         
				        	var toApp = this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ 
				        		target: { 
				        			//semanticObject : "Appointment", 
				        			//action: "myAppointments"
				        			semanticObject : "Task", 
				        			action: "manageTasks"
				        		},                                                                                                     
				        		params : { 
				        			"createFromOppt" : "X",
				        			"AccountId" : AccountId,
				        		//	"AccountName" : AccountName,
				        			"ContactId" : ContactId,
				        		//	"ContactName" : ContactName,
				        			"processType"  	 : this.processType,
				        			"opportunityId":opportunityId,
				        			"title":title,
				        			"opportunityGuid" : previousGuid,
				        		//	"ProcessTypeDescription" : this.processTypeDesc
				        			// "itemPaths" : aItemPaths
				        		},
				        		appSpecificRoute : [ "&",
														"newTask",
														this.processType ]
														.join("/")
				        	}) || "";           
				        	
				        	this.taskFlag=false;
				        	this.onlyOneTaskProcessType=false;
				        	//Navigate to the target         
				        	window.location = toApp ; 
				        	//
				        	/*var message = sap.ca.scfld.md.app.Application
							.getImpl().getResourceBundle()
							.getText(
							"followupsuccess");
						     sap.m.MessageToast.show(message, {
							   closeOnBrowserNavigation : false
						});*/
				    		
				    		}
				 
				    },
					

					
					
					/*navToTasks : function(oEvent) {
						// var aItemPaths = this._getSelectedItemPaths();

						// *XNav* (1) obtain cross app navigation interface
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						this.oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");

						// *XNav (2) generate cross application link
						var toApp = this.oCrossAppNavigator
								&& this.oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Task",
										action : "manageTasks"
									},
									params : {
										"createFromNote" : "X",

									}
								}) || "";

						// Navigate to the target
						window.location = toApp;
					},

					navToAppointments : function(oEvent) {
						var headerGuid = this.byId('info').getModel('json')
								.getData().Guid
						var sPath = "/Opportunities(guid'" + headerGuid + "')";
						// var aItemPaths =
						// this.getView().getBindingContext().sPath.substr(1);

						// *XNav* (1) obtain cross app navigation interface
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						this.oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");

						// *XNav (2) generate cross application link
						var toApp = this.oCrossAppNavigator
								&& this.oCrossAppNavigator.hrefForExternal({
									target : {
										semanticObject : "Appointment",
										action : "myAppointments"
									},
									params : {
										"createFromNote" : "X",
									// "itemPaths" : aItemPaths
									}
								}) || "";

						// Navigate to the target
						window.location = toApp;
					},
*/
					getS4Controller : function() {
						
						return this.getView().getModel('controllers').getData().s4Controller;

					},

					setDefaultTabToInfo : function() {
						// always default the tab to info whenever the s3 view
						// loads
						var oTabContainer = this.byId('icntab');
						if (oTabContainer
								&& oTabContainer.getItems().length > 0) {
							if (oTabContainer.getSelectedKey() !== "info")
								oTabContainer.setSelectedKey("Info");
							oTabContainer.setExpanded(true);
						}
					},

					isMainScreen : function() {
						return false;
					},

					_getDiscussID : function() {
						var url = document.createElement('a');
						url.href = this.getView().getModel().sServiceUrl;
						var headerGuid = this.byId('info').getModel('json')
								.getData().Guid;
						var sPath = "/Opportunities(guid'" + headerGuid + "')";
						return url.pathname + sPath;
					},

					_getDiscussType : function() {
						var url = document.createElement('a');
						url.href = this.getView().getModel().sServiceUrl;
						return url.pathname + "/$metadata#Opportunities";
					},

					_getShareDisplay : function() {
						var desc = this.byId('info').getModel('json').getData().Description;
						var volume = this.byId('info').getModel('json')
								.getData().ExpectedSalesVolume;
						var currencyCode = this.byId('info').getModel('json')
								.getData().CurrencyCode;
						var prospectname = this.byId('info').getModel('json')
								.getData().ProspectName;
						var clDate = cus.crm.opportunity.util.Formatter
								.dateFormatter(this.byId('info').getModel(
										'json').getData().ClosingDate);
						var usertext = this.byId('info').getModel('json')
								.getData().UserStatusText;
						var object = new sap.m.ObjectListItem({
							title : desc,
							number : volume,
							numberUnit : currencyCode,
							attributes : [ new sap.m.ObjectAttribute({
								text : prospectname
							}), new sap.m.ObjectAttribute({
								text : clDate
							}) ],
							firstStatus : new sap.m.ObjectStatus({
								text : usertext
							}),
						});
						return object;

					},

					/*
					 * Initialize scaffolding buttons
					 */
					getHeaderFooterOptions : function() {
						
						//add bookmark (save as tile) settings
						this.oHeaderFooterOptions.oAddBookmarkSettings = {
								icon :  "sap-icon://Fiori2/F0004"
						};
						if (
								 this.oRouter._oRouter._prevMatchedRequest
										.indexOf('detailonly/') > -1
								&& sap.ui.core.routing.History.getInstance()._iHistoryPosition > 0) {
							this.oHeaderFooterOptions.onBack = jQuery.proxy(
									function(oEvent) {
										this._navBack();
									}, this);
						}
						
						
						if(jQuery.device.is.phone && !this.fullScreenMode)
							this.oHeaderFooterOptions.onBack =  this._getBackFunction();
						else 
							if(jQuery.device.is.phone && this.fullScreenMode)
								this.oHeaderFooterOptions.onBack = this._getBackFunction();
							else if(!jQuery.device.is.phone && this.fullScreenMode)
								this.oHeaderFooterOptions.onBack = this._getBackFunction();
							else 
								this.oHeaderFooterOptions.onBack = null;
						
						
						
						//this.oHeaderFooterOptions.onBack = (jQuery.device.is.phone || this.fullScreenMode) ?  this._getBackFunction() : null  ;
						this.extendHeaderFooterOptions(this.oHeaderFooterOptions);
						return this.oHeaderFooterOptions;
					},

					extendHeaderFooterOptions : function(oHeaderFooterOptions) {
					},

					navToSubview : function() {
						
						this.oRouter.navTo("subDetail",
								{
									contextPath : this.getView()
											.getBindingContext().sPath
											.substr(1)
								}, !jQuery.device.is.phone);
						
						
						
					},
					navToEmpty : function() {
						this.oRouter.navTo("noData", {
							viewTitle : "DETAIL_TITLE",
							languageKey : "NO_ITEMS_AVAILABLE"
						});
					},

					/* Calling Expand based on selected tab */
					selectedTab : function(oControlEvent) {
						var oModel = this.getView().getModel();
						var tab_selection = oControlEvent.getSource().getSelectedKey();
						if (this.byId('info').getModel('json'))
							var headerGuid = this.byId('info').getModel('json')
									.getData().Guid;
						var sPath = "/Opportunities(guid'" + headerGuid + "')";

						//EXTENSION POINT to be able to extend added tabs
						/**
						 * @ControllerHook extHookSelectedTab is the controller hook that provides for extension of newly added custom tabs.
						 *                                   
						 * @callback cus.crm.opportunity.S3.controller~extHookSelectedTab
						 * @param {object}
						 *           oControlEvent
						 * @return {void}
						 */
						if (this.extHookSelectedTab){
							this.extHookSelectedTab(oControlEvent);
						}
						
						var bSkip = false;
						/**
						 * @ControllerHook extHookSkipTab is the controller hook that helps to decide if the standard delivered code needs to execute if a tab is selected
						 *                                   
						 * @callback cus.crm.opportunity.S3.controller~extHookSkipTab
						 * @param {object}
						 *           oControlEvent
						 * @return {boolean}
						 */
						if (this.extHookSkipTab){
							bSkip = this.extHookSkipTab(oControlEvent);
						}
						/* When Note tab is selected */
						if (tab_selection == "Notes" && !bSkip) {
							this.notesTabSelected();
						}
						/* When Sales team tab is selected */
						if (tab_selection == "Parties Involved" && !bSkip) {
							this.participantsTabSelected();
						}
						/* When Sales team tab is selected */
						if (tab_selection == "Competitors" && !bSkip) {
							
							this.competitorsTabSelected();
						}

						/* When attachemnt tab is selected */
						if (tab_selection == "Attachments" && !bSkip) {
							this.attachmentsTabSelected();
						}
						
						/* When Transaction History tab is selected */
						if (tab_selection == "TransactionHistory" && !bSkip) {
							this.txHistoryTabSelected();
						}
						
						
					},

					navigateDocHistory : function(oEvent) {
						var transactionID = oEvent.getSource().getText();
						var ObjectType = "";
						var sGuid = "";

						for (var i = 0; i < this.newResult.length; i++) {
							if (transactionID == this.newResult[i].TransactionId) {
								ObjectType = this.newResult[i].ObjectType;
								sGuid = this.newResult[i].Guid;
								break;
							}
						}

						// Inter app navigation
						var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
						this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
						
			            if (ObjectType === "BUS2000111") { //Opportunity
			          	  
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

					/* Add Note handling:Changes in Notes Tab with the FeedInput control */
					_handleAddNote : function(oEvent) {	
					var sText = oEvent.getParameter("value");
						if (sText) {
							var that = this;
							var oModel = this.getView().getModel();							
							var headerGuid = this.byId('info').getModel('json')
									.getData().Guid;
							var oEntry = {
								HeaderGuid : headerGuid,
								Content : sText
							};							
							oModel.create(
											'/OpportunityNotesSet',
											oEntry,
											null,
											jQuery.proxy(function() {
											    var that = this;
												oModel.read( that.sPath, null, [ "$expand=Notes" ],true, function(odata,response){
													
													that.byId('listItem').setModel(new sap.ui.model.json.JSONModel({OpportunityNotesSet: odata.Notes.results}),"json");
													
													});											
												
											},this),
							
											function(oMessage) {
												that.displayResponseErrorMessage(
																oMessage,
																sap.ca.scfld.md.app.Application
																		.getImpl()
																		.getResourceBundle()
																		.getText(
																				'SAVE_FAILED'));
											});
						}
						},
											
					displayResponseErrorMessage : function(oMessage,
							sDefaultMessage) {
						var sMessage;
						if (oMessage.response) {
							sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
						}
					    sap.m.MessageToast.show(sMessage || sDefaultMessage);
					},
					
					onFileUploadFailed : function(e) {
						
						 var responseString = e.getParameters().response.jqXHR.responseText;
						 var json = JSON.parse(responseString);
						 
				        sap.ca.ui.message.showMessageBox({
				            type: sap.ca.ui.message.Type.ERROR,
				            message: json.error.message.value
				            
				        });
				   },

					// Handle the response once file is uploaded
					onUploadFile : function(oResponse) {
						// get uloaded data
						var oFile ;
						if (oResponse.getParameters() && oResponse.getParameters().d)
							oFile = oResponse.getParameters().d;
							else
							oFile= oResponse.getParameters();
					//	var oFile = oResponse.getParameter("d");
						// in url replace https to http
						var URL;
						if(oFile.__metadata.media_src)
						 URL = oFile.__metadata.media_src;
						else 
							URL = oFile.url;

						// date in correct formate
						var date = parseInt((oFile.CreatedAt).substr(6));

						var fName = decodeURIComponent(oFile.Name);
						// set the object
						// NLUN - CodeScan Changes - Global Variables
						var object = {

							"fileExtension" : cus.crm.opportunity.util.Formatter
									.mimeTypeFormatter(oFile.MimeType),
							"contributor" : oFile.CreatedBy,
							"uploadedDate" : 
									new Date(date),
							"name" : fName,
							"url" : cus.crm.opportunity.util.Formatter.urlConverter(URL),
							"size" : oFile.fileSize,
							"fileId" : oFile.DocumentId,
							"media_src" : oFile.__metadata.media_src,
						};

						// commit change
						this.byId('fileupload').commitFileUpload(object);
					},

					changeToString : function(val) {
						// val=val.replace(/\+/g, '%20');
						var str = val.split("%");
						var cval = str[0];
						for ( var i = 1; i < str.length; i++) {
							cval += String.fromCharCode(parseInt(str[i]
									.substring(0, 2), 16))
									+ str[i].substring(2);
						}
						return cval;
					},

					// On click of Edit
					onEdit : function() {
						var ctx1 = this.byId('info').getModel('json').getData().Guid;
						var ctx = "Opportunities(guid'" + ctx1 + "')" ;
						
						var that = this;
						
						var oModel = this.oModel;
						
						this.sBackendVersion = cus.crm.opportunity.util.schema._getServiceSchemaVersion(this.oModel,"Opportunity");
						
						if(parseFloat(this.sBackendVersion) >= 3){
						oModel.read("EditAuthorizationCheck", null, {
							ObjectGuid :oModel.formatValue(ctx1,
							"Edm.Guid")},
								false, function(oData, resp){
									if(resp.data.EditAuthorizationCheck.ActionSuccessful == "X"){
										if(!that.fullScreenMode)
										{
										  that.oRouter.navTo("subDetail", {
										   contextPath : ctx
									     }, !jQuery.device.is.phone);}
								         else 
										{
								        	that.oRouter.navTo("edit", {
											contextPath : ctx
										}, !jQuery.device.is.phone);								
										} 
									}
									else{
										sap.ca.ui.message.showMessageBox({
											type : sap.ca.ui.message.Type.ERROR,
											message : resp.data.EditAuthorizationCheck.Message,
											details : null
										});
									}		
								},null);
						}
						else{
							if(!that.fullScreenMode)
							{
							  that.oRouter.navTo("subDetail", {
							   contextPath : ctx
						     }, !jQuery.device.is.phone);}
					         else 
							{
					        	that.oRouter.navTo("edit", {
								contextPath : ctx
							}, !jQuery.device.is.phone);								
							} 
						}
						
					},

					// On Log Change
					onLogChange : function(oEvent) {
						var oModel = this.getView().getModel();
						var data;
						var headerGuid = this.byId('info').getModel('json')
								.getData().Guid;
						var sPath = "/Opportunities(guid'" + headerGuid + "')";
						this.changeLogFragment.getContent()[0]
								.setNoDataText(sap.ca.scfld.md.app.Application
										.getImpl().getResourceBundle().getText(
												'LOG_CHANGE'));
						this.changeLogFragment.setModel(oEvent.getSource()
								.getModel("i18n"), "i18n");
						this.changeLogFragment.getModel().setData({
							OpportunitySalesTeamSet : []
						});
						var that = this;
						oModel
								.read(
										sPath,
										null,
										[ "$expand=ChangeDocs" ],
										true,
										function(odata, response) {

											data = {
												OpportunityChangeDocs : response.data.ChangeDocs.results
											};
											that.changeLogFragment.getModel()
													.setData(data);
											if (data.OpportunityChangeDocs.length == 0) {
												that.changeLogFragment
														.getContent()[0]
														.setNoDataText(sap.ca.scfld.md.app.Application
																.getImpl()
																.getResourceBundle()
																.getText(
																		'NOLOGCHANGE'));
											}

										});

						this.changeLogFragment.open(oEvent);

					},

					// Cancel of change log
					onCancelLogChange : function(oEvent) {
						this.changeLogFragment.close();

					},
					
					onEmpBusCardLaunch : function(oEvt){

						if (oEvt.getSource().data("PartnerNumber") !== '') {
							var sPath = "/EmployeeCollection('" + oEvt.getSource().data("PartnerNumber") + "')";
							var sURLparameters;
							if(!this.bHideImage){
							    sURLparameters = "$expand=WorkAddress,Company,Photo";
							}else{
								sURLparameters = "$expand=WorkAddress,Company";
							}
							var oSource = oEvt.getSource();
							var that = this;
							this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
								jQuery.sap.log.info("oData employee response");

								// initializing the attributes used for the business card
								var oTitle = that.oResourceBundle.getText("EMPLOYEE");
								var oEmployeeMobile = "";
								var oEmployeePhone = "";
								var oEmployeeEmail = "";
								var oEmployeeDepartment = "";
								var oCompanyAddress = "";
								var oCompanyName = "";
								var oEmployeeName = "";
								var oPhoto = " ";

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
									var oMetadata = cus.crm.opportunity.util.Formatter.formatPhotoUrl(odata.Photo.__metadata.media_src);
									oPhoto = cus.crm.opportunity.util.Formatter.urlConverter(oMetadata);
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

					onEmployeeLaunchheader : function(oEvent) {
						var contactId = oEvent.getSource().data("PartnerNumber");
						var sPath = "/AccountCollection('" + contactId + "')";
						var oLogo = "sap-icon://person-placeholder";

						var oModel2 = this.getView().getModel();
						if(!this.bHideImage){
						oModel2
								.read(
										sPath,
										null,
										[ "$expand=Logo" ],
										false,
										function(odata, response) {
											jQuery.sap.log
													.info("oData account response");
											if (odata.Logo
													&& odata.Logo.__metadata) {
												var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src
														: "sap-icon://person-placeholder";
												//var URl = oMetadata.replace(
												//		/^https:\/\//i,
													//	'http://');
												oLogo = oMetadata.toString();
											}

										});

						var Image = oLogo;
						}else{
							var Image = " ";
							
						}
						var oModel = this.getView().getModel();
						var accountId = this.byId('info').getModel('json')
								.getData().ProspectNumber;
						var event = oEvent.getSource();
						var PartnerFunctionCode = oEvent.getSource() 
								.data("PartnerFunctionCode");
						
						if (accountId && contactId) {

							this.AccountId = accountId;
							this.ContactId = contactId;

							var sPath = "/ContactCollection(accountID='"
									+ accountId
									+ "',contactID='"
									+ contactId
									+ "')?$expand=WorkAddress,Account,Account/MainAddress,Account/MainContact,Account/MainContact/WorkAddress" ;

							var aBatchReads = [];

							aBatchReads.push(oModel.createBatchOperation(sPath,
									"GET"));

							oModel.addBatchReadOperations(aBatchReads);

							oModel
									.submitBatch(
											jQuery
													.proxy(
															function(oResponses) {

																var data = {
																	Value : ""
																};
																data.Value = oResponses.__batchResponses[0].data;

																var fnCallbackNavPara = jQuery
																		.proxy(
																				function(
																						oEvent) {

																					var oNavConfig = {};
																					oNavConfig.target = {};
																					oNavConfig.target.semanticObject = "ContactPerson";
																					//oNavConfig.target.action = "MyContacts";
																					oNavConfig.target.action = "MyContacts&/display/ContactCollection(contactID='" + this.ContactId + "',accountID='" + this.AccountId + "')";
																					/*oNavConfig.params = {
																						accountID : this.AccountId,
																						contactID : this.ContactId,
																					};*/
																					
																					this.navToOtherApp = false;

																					return oNavConfig;

																				},
																				this);

																if (data.Value.Account) {
																	if (data.Value.Account.MainContact) {
																		if (data.Value.Account.MainContact.WorkAddress) {
																			if (data.Value.WorkAddress) {
																				if (data.Value.Account.MainAddress) {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactmobile : data.Value.WorkAddress.mobilePhone,
																						contactphone : data.Value.WorkAddress.phone,
																						contactemail : data.Value.WorkAddress.email,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						companyaddress : data.Value.Account.MainAddress.address,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : Image,
																							companyphone : data.Value.Account.MainAddress.phone,
																							maincontactname : data.Value.Account.MainContact.fullName,
																							maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																							maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																							maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}
																				// Only
																				// Mainaddress
																				// is
																				// null
																				else {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactmobile : data.Value.WorkAddress.mobilePhone,
																						contactphone : data.Value.WorkAddress.phone,
																						contactemail : data.Value.WorkAddress.email,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",

																							maincontactname : data.Value.Account.MainContact.fullName,
																							maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																							maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																							maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(oEvent
																									.getSource());
																				}
																			}
																			// work
																			// address
																			// is
																			// null
																			// and
																			// check
																			// main
																			// address
																			else {

																				if (data.Value.Account.MainAddress) {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						companyaddress : data.Value.Account.MainAddress.address,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",
																							companyphone : data.Value.Account.MainAddress.phone,
																							maincontactname : data.Value.Account.MainContact.fullName,
																							maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																							maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																							maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}
																				// work
																				// address
																				// and
																				// Mainaddress
																				// is
																				// null
																				else {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,

																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						beforeExtNav : fnCallbackNavPara,

																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",

																							maincontactname : data.Value.Account.MainContact.fullName,
																							maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																							maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																							maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}

																			}

																		}
																		// main
																		// contact's
																		// work
																		// address
																		// is
																		// null
																		// and
																		// check
																		// work
																		// address
																		// and
																		// main
																		// address
																		else {
																			if (data.Value.WorkAddress) {

																				if (data.Value.Account.MainAddress) {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactmobile : data.Value.WorkAddress.mobilePhone,
																						contactphone : data.Value.WorkAddress.phone,
																						contactemail : data.Value.WorkAddress.email,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						companyaddress : data.Value.Account.MainAddress.address,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",
																							companyphone : data.Value.Account.MainAddress.phone,
																							maincontactname : data.Value.Account.MainContact.fullName,

																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}
																				// main
																				// contact's
																				// work
																				// address
																				// is
																				// null
																				// and
																				// Mainaddress
																				// is
																				// null
																				else {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactmobile : data.Value.WorkAddress.mobilePhone,
																						contactphone : data.Value.WorkAddress.phone,
																						contactemail : data.Value.WorkAddress.email,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						beforeExtNav : fnCallbackNavPara,

																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",

																							maincontactname : data.Value.Account.MainContact.fullName,

																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}

																			}
																			// work
																			// address
																			// is
																			// null
																			// and
																			// main
																			// contacts
																			// work
																			// address
																			// is
																			// also
																			// null
																			// ,
																			// check
																			// for
																			// main
																			// address
																			else {
																				if (data.Value.Account.MainAddress) {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						companyaddress : data.Value.Account.MainAddress.address,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",
																							companyphone : data.Value.Account.MainAddress.phone,
																							maincontactname : data.Value.Account.MainContact.fullName,

																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}
																				// main
																				// contacts
																				// work
																				// address
																				// is
																				// null
																				// and
																				// work
																				// address
																				// and
																				// Mainaddress
																				// is
																				// null
																				else {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,

																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						beforeExtNav : fnCallbackNavPara,

																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",

																							maincontactname : data.Value.Account.MainContact.fullName,

																							maincontactemailsubj : "Automatic Mail for Maincontact",
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}

																			}
																		}

																	}
																	// account
																	// != null
																	// and
																	// maincontact
																	// is null
																	// and so is
																	// main
																	// contact's
																	// work
																	// address
																	// and work
																	// address
																	// and main
																	// address

																	// main
																	// contact's
																	// work
																	// address
																	// is null
																	// and check
																	// work
																	// address
																	// and main
																	// address
																	else {
																		if (data.Value.WorkAddress) {

																			if (data.Value.Account.MainAddress) {
																				var oEmpConfig = {
																					title : "Contact",
																					name : data.Value.fullName,
																					imgurl : Image,
																					department : data.Value.department,
																					contactmobile : data.Value.WorkAddress.mobilePhone,
																					contactphone : data.Value.WorkAddress.phone,
																					contactemail : data.Value.WorkAddress.email,
																					contactemailsubj : "App Genrated Mail",
																					companyname : data.Value.Account.name1,
																					companyaddress : data.Value.Account.MainAddress.address,
																					beforeExtNav : fnCallbackNavPara,
																					// optional:
																					// if
																					// the
																					// following
																					// attributes
																					// are
																					// provided
																					// - a
																					// link
																					// to
																					// company
																					// card
																					// is
																					// available
																					companycard : {
																						title : "Account",
																						imgurl : "sap-icon://person-placeholder",
																						companyphone : data.Value.Account.MainAddress.phone,
																					}
																				};

																				// call
																				// 'Business
																				// Card'
																				// reuse
																				// component
																				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																						oEmpConfig);
																				oEmployeeLaunch
																						.openBy(event);
																			}
																			// Only
																			// Mainaddress
																			// is
																			// null
																			else {
																				var oEmpConfig = {
																					title : "Contact",
																					name : data.Value.fullName,
																					imgurl : Image,
																					department : data.Value.department,
																					contactmobile : data.Value.WorkAddress.mobilePhone,
																					contactphone : data.Value.WorkAddress.phone,
																					contactemail : data.Value.WorkAddress.email,
																					contactemailsubj : "App Genrated Mail",
																					companyname : data.Value.Account.name1,
																					beforeExtNav : fnCallbackNavPara,

																					// optional:
																					// if
																					// the
																					// following
																					// attributes
																					// are
																					// provided
																					// - a
																					// link
																					// to
																					// company
																					// card
																					// is
																					// available
																					companycard : {
																						title : "Account",
																						imgurl : "sap-icon://person-placeholder",

																					}
																				};

																				// call
																				// 'Business
																				// Card'
																				// reuse
																				// component
																				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																						oEmpConfig);
																				oEmployeeLaunch
																						.openBy(event);
																			}

																		}
																		//
																		else {
																			if (data.Value.Account.MainAddress) {
																				var oEmpConfig = {
																					title : "Contact",
																					name : data.Value.fullName,
																					imgurl : Image,
																					department : data.Value.department,
																					contactemailsubj : "App Genrated Mail",
																					companyname : data.Value.Account.name1,
																					companyaddress : data.Value.Account.MainAddress.address,
																					beforeExtNav : fnCallbackNavPara,
																					// optional:
																					// if
																					// the
																					// following
																					// attributes
																					// are
																					// provided
																					// - a
																					// link
																					// to
																					// company
																					// card
																					// is
																					// available
																					companycard : {
																						title : "Account",
																						imgurl : "sap-icon://person-placeholder",
																						companyphone : data.Value.Account.MainAddress.phone,

																					}
																				};

																				// call
																				// 'Business
																				// Card'
																				// reuse
																				// component
																				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																						oEmpConfig);
																				oEmployeeLaunch
																						.openBy(event);
																			}
																			// work
																			// address
																			// and
																			// Mainaddress
																			// is
																			// null
																			else {
																				var oEmpConfig = {
																					title : "Contact",
																					name : data.Value.fullName,
																					imgurl : Image,
																					department : data.Value.department,

																					contactemailsubj : "App Genrated Mail",
																					companyname : data.Value.Account.name1,
																					beforeExtNav : fnCallbackNavPara,

																					// optional:
																					// if
																					// the
																					// following
																					// attributes
																					// are
																					// provided
																					// - a
																					// link
																					// to
																					// company
																					// card
																					// is
																					// available
																					companycard : {
																						title : "Account",
																						imgurl : "sap-icon://person-placeholder",

																					}
																				};

																				// call
																				// 'Business
																				// Card'
																				// reuse
																				// component
																				var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																						oEmpConfig);
																				oEmployeeLaunch
																						.openBy(event);
																			}
																		}
																	}

																} else {
																	sap.m.MessageToast
																			.show(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'NOT_IN_MAIN_CONTACT'));
																}
															}, this),
											jQuery
													.proxy(
															function(oError) {
																sap.m.MessageToast
																		.show(sap.ca.scfld.md.app.Application
																				.getImpl()
																				.getResourceBundle()
																				.getText(
																						'NOT_IN_MAIN_CONTACT'));
															}, this), true);
						}

						else {
							sap.m.MessageToast
									.show(sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText('NOT_IN_MAIN_CONTACT'));
						}
					},

					onEmployeeLaunch : function(oEvent) {
						var oModel = this.getView().getModel();
						var accountId = this.byId('info').getModel('json')
								.getData().ProspectNumber;
						var event = oEvent.getSource();
						var contactId = oEvent.getSource().data("PartnerNumber");
						var PartnerFunctionCode = oEvent.getSource()
								.data("PartnerFunctionCode");
						var Image;
						if(!this.bHideImage){
							var Image = oEvent.getSource().data("Image");
						}else
						var Image = " ";
						if (PartnerFunctionCode == "00000015") {
							var data;
							if (accountId && contactId) {
								this.AccountId = accountId;
								this.ContactId = contactId;

								var sPath = "/ContactCollection(accountID='" + accountId + "',contactID='"+ contactId+"')?$expand=" +
										"WorkAddress,Account,Account/MainAddress,Account/MainContact,Account/MainContact/WorkAddress";

								var aBatchReads = [];

								aBatchReads.push(oModel.createBatchOperation(
										sPath, "GET"));

								oModel.addBatchReadOperations(aBatchReads);

								oModel
										.submitBatch(
												jQuery
														.proxy(
																function(
																		oResponses) {

																	var data = {
																		Value : ""
																	};
																	data.Value = oResponses.__batchResponses[0].data;

																	var fnCallbackNavPara = jQuery
																			.proxy(
																					function(
																							oEvent) {

																						var oNavConfig = {};
																						oNavConfig.target = {};
																						oNavConfig.target.semanticObject = "ContactPerson";
																						//oNavConfig.target.action = "MyContacts";
																						oNavConfig.target.action = "MyContacts&/display/ContactCollection(contactID='" + this.ContactId + "',accountID='" + this.AccountId + "')";
																						/*oNavConfig.params = {
																							accountID : this.AccountId,
																							contactID : this.ContactId,
																						};*/
																						this.navToOtherApp = true;

																						this.oRouter
																								.detachRouteMatched(
																										this.detailRouteMatched,
																										this);
																						return oNavConfig;

																					},
																					this);

																	if (data.Value.Account) {
																		if (data.Value.Account.MainContact) {
																			if (data.Value.Account.MainContact.WorkAddress) {
																				if (data.Value.WorkAddress) {
																					if (data.Value.Account.MainAddress) {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,
																							contactmobile : data.Value.WorkAddress.mobilePhone,
																							contactphone : data.Value.WorkAddress.phone,
																							contactemail : data.Value.WorkAddress.email,
																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							companyaddress : data.Value.Account.MainAddress.address,
																							beforeExtNav : fnCallbackNavPara,
																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : Image,
																								companyphone : data.Value.Account.MainAddress.phone,
																								maincontactname : data.Value.Account.MainContact.fullName,
																								maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																								maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																								maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}
																					// Only
																					// Mainaddress
																					// is
																					// null
																					else {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,
																							contactmobile : data.Value.WorkAddress.mobilePhone,
																							contactphone : data.Value.WorkAddress.phone,
																							contactemail : data.Value.WorkAddress.email,
																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							beforeExtNav : fnCallbackNavPara,

																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",

																								maincontactname : data.Value.Account.MainContact.fullName,
																								maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																								maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																								maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(oEvent
																										.getSource());
																					}
																				}
																				// work
																				// address
																				// is
																				// null
																				// and
																				// check
																				// main
																				// address
																				else {

																					if (data.Value.Account.MainAddress) {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,
																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							companyaddress : data.Value.Account.MainAddress.address,
																							beforeExtNav : fnCallbackNavPara,
																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",
																								companyphone : data.Value.Account.MainAddress.phone,
																								maincontactname : data.Value.Account.MainContact.fullName,
																								maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																								maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																								maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}
																					// work
																					// address
																					// and
																					// Mainaddress
																					// is
																					// null
																					else {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,

																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							beforeExtNav : fnCallbackNavPara,

																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",

																								maincontactname : data.Value.Account.MainContact.fullName,
																								maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
																								maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
																								maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}
																				}
																			}
																			// main
																			// contact's
																			// work
																			// address
																			// is
																			// null
																			// and
																			// check
																			// work
																			// address
																			// and
																			// main
																			// address
																			else {
																				if (data.Value.WorkAddress) {

																					if (data.Value.Account.MainAddress) {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,
																							contactmobile : data.Value.WorkAddress.mobilePhone,
																							contactphone : data.Value.WorkAddress.phone,
																							contactemail : data.Value.WorkAddress.email,
																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							companyaddress : data.Value.Account.MainAddress.address,
																							beforeExtNav : fnCallbackNavPara,
																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",
																								companyphone : data.Value.Account.MainAddress.phone,
																								maincontactname : data.Value.Account.MainContact.fullName,

																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}
																					// main
																					// contact's
																					// work
																					// address
																					// is
																					// null
																					// and
																					// Mainaddress
																					// is
																					// null
																					else {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,
																							contactmobile : data.Value.WorkAddress.mobilePhone,
																							contactphone : data.Value.WorkAddress.phone,
																							contactemail : data.Value.WorkAddress.email,
																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							beforeExtNav : fnCallbackNavPara,

																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",

																								maincontactname : data.Value.Account.MainContact.fullName,

																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}

																				}
																				// work
																				// address
																				// is
																				// null
																				// and
																				// main
																				// contacts
																				// work
																				// address
																				// is
																				// also
																				// null
																				// ,
																				// check
																				// for
																				// main
																				// address
																				else {

																					if (data.Value.Account.MainAddress) {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,
																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							companyaddress : data.Value.Account.MainAddress.address,
																							beforeExtNav : fnCallbackNavPara,
																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",
																								companyphone : data.Value.Account.MainAddress.phone,
																								maincontactname : data.Value.Account.MainContact.fullName,

																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}
																					// main
																					// contacts
																					// work
																					// address
																					// is
																					// null
																					// and
																					// work
																					// address
																					// and
																					// Mainaddress
																					// is
																					// null
																					else {
																						var oEmpConfig = {
																							title : "Contact",
																							name : data.Value.fullName,
																							imgurl : Image,
																							department : data.Value.department,

																							contactemailsubj : "App Genrated Mail",
																							companyname : data.Value.Account.name1,
																							beforeExtNav : fnCallbackNavPara,

																							// optional:
																							// if
																							// the
																							// following
																							// attributes
																							// are
																							// provided
																							// - a
																							// link
																							// to
																							// company
																							// card
																							// is
																							// available
																							companycard : {
																								title : "Account",
																								imgurl : "sap-icon://person-placeholder",

																								maincontactname : data.Value.Account.MainContact.fullName,

																								maincontactemailsubj : "Automatic Mail for Maincontact",
																							}
																						};

																						// call
																						// 'Business
																						// Card'
																						// reuse
																						// component
																						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																								oEmpConfig);
																						oEmployeeLaunch
																								.openBy(event);
																					}
																				}
																			}

																		}
																		// account
																		// !=
																		// null
																		// and
																		// maincontact
																		// is
																		// null
																		// and
																		// so is
																		// main
																		// contact's
																		// work
																		// address
																		// and
																		// work
																		// address
																		// and
																		// main
																		// address

																		// main
																		// contact's
																		// work
																		// address
																		// is
																		// null
																		// and
																		// check
																		// work
																		// address
																		// and
																		// main
																		// address
																		else {
																			if (data.Value.WorkAddress) {

																				if (data.Value.Account.MainAddress) {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactmobile : data.Value.WorkAddress.mobilePhone,
																						contactphone : data.Value.WorkAddress.phone,
																						contactemail : data.Value.WorkAddress.email,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						companyaddress : data.Value.Account.MainAddress.address,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",
																							companyphone : data.Value.Account.MainAddress.phone,
																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}
																				// Only
																				// Mainaddress
																				// is
																				// null
																				else {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactmobile : data.Value.WorkAddress.mobilePhone,
																						contactphone : data.Value.WorkAddress.phone,
																						contactemail : data.Value.WorkAddress.email,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						beforeExtNav : fnCallbackNavPara,

																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",

																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}

																			}
																			//
																			else {

																				if (data.Value.Account.MainAddress) {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,
																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						companyaddress : data.Value.Account.MainAddress.address,
																						beforeExtNav : fnCallbackNavPara,
																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",
																							companyphone : data.Value.Account.MainAddress.phone,

																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}
																				// work
																				// address
																				// and
																				// Mainaddress
																				// is
																				// null
																				else {
																					var oEmpConfig = {
																						title : "Contact",
																						name : data.Value.fullName,
																						imgurl : Image,
																						department : data.Value.department,

																						contactemailsubj : "App Genrated Mail",
																						companyname : data.Value.Account.name1,
																						beforeExtNav : fnCallbackNavPara,

																						// optional:
																						// if
																						// the
																						// following
																						// attributes
																						// are
																						// provided
																						// - a
																						// link
																						// to
																						// company
																						// card
																						// is
																						// available
																						companycard : {
																							title : "Account",
																							imgurl : "sap-icon://person-placeholder",

																						}
																					};

																					// call
																					// 'Business
																					// Card'
																					// reuse
																					// component
																					var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
																							oEmpConfig);
																					oEmployeeLaunch
																							.openBy(event);
																				}

																			}
																		}

																	} else {
																		sap.m.MessageToast
																				.show(sap.ca.scfld.md.app.Application
																						.getImpl()
																						.getResourceBundle()
																						.getText(
																								'NOT_IN_MAIN_CONTACT'));
																	}

																}, this),
												jQuery
														.proxy(
																function(oError) {

																	sap.m.MessageToast
																			.show(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'NOT_IN_MAIN_CONTACT'));

																}, this), true);

							}

							else {
								sap.m.MessageToast
										.show(sap.ca.scfld.md.app.Application
												.getImpl().getResourceBundle()
												.getText('NOT_IN_MAIN_CONTACT'));

							}

						}

						else if (PartnerFunctionCode == "00000021") {
							this.accountNum = accountId;
							if (accountId) {
								var sPath = "AccountCollection(accountID='"
										+ accountId
										+ "')?$expand=MainAddress,MainContact/WorkAddress,MainContact";

								var aBatchReads = [];
								var that = this;

								aBatchReads.push(oModel.createBatchOperation(
										sPath, "GET"));

								oModel.addBatchReadOperations(aBatchReads);

								oModel
										.submitBatch(
												jQuery
														.proxy(
																function(
																		oResponses) {

																	var oMainContact = {
																		Value : ""
																	};
																	oMainContact.Value = oResponses.__batchResponses[0].data;

																	var fnCallbackNavParaComp = jQuery
																			.proxy(
																					function(
																							oEvent) {

																						var oNavConfig = {};
																						oNavConfig.target = {};
																						oNavConfig.target.semanticObject = "Account";
																						oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + this.accountNum + "')";
//																						oNavConfig.params = {
//																							accountID : this.accountNum
//																						};
																						this.navToOtherApp = true;
																						this.oRouter
																								.detachRouteMatched(
																										this.detailRouteMatched,
																										this);

																						return oNavConfig;

																					},
																					this);

																	if (oMainContact.Value.MainContact) {
																		if (oMainContact.Value.MainContact.WorkAddress)

																		{
																			if (oMainContact.Value.MainAddress) {

																				var oCompanycard = {
																					title : "Account",
																					imgurl : Image,
																					companyname : oMainContact.Value.name1,
																					companyphone : oMainContact.Value.MainAddress.phone,
																					companyaddress : oMainContact.Value.MainAddress.address,
																					maincontactname : oMainContact.Value.MainContact.fullName,
																					maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
																					maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
																					maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
																					maincontactemailsubj : "Automatic Mail for Maincontact",
																					beforeExtNav : fnCallbackNavParaComp,
																				};

																				var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
																						oCompanycard);
																				oCompanyLaunch
																						.openBy(event);
																			}

																			else {

																				var oCompanycard = {
																					title : "Account",
																					imgurl : Image,
																					companyname : oMainContact.Value.name1,

																					maincontactname : oMainContact.Value.MainContact.fullName,
																					maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
																					maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
																					maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
																					maincontactemailsubj : "Automatic Mail for Maincontact",
																					beforeExtNav : fnCallbackNavParaComp,
																				};
																				var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
																						oCompanycard);
																				oCompanyLaunch
																						.openBy(event);

																			}

																		}

																		else {
																			if (oMainContact.Value.MainAddress) {
																				var oCompanycard = {
																					title : "Account",
																					imgurl : Image,
																					companyname : oMainContact.Value.name1,
																					companyphone : oMainContact.Value.MainAddress.phone,
																					companyaddress : oMainContact.Value.MainAddress.address,
																					maincontactname : oMainContact.Value.MainContact.fullName,
																					beforeExtNav : fnCallbackNavParaComp,
																				};

																				var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
																						oCompanycard);
																				oCompanyLaunch
																						.openBy(event);
																			} else {
																				var oCompanycard = {
																					title : "Account",
																					imgurl : Image,
																					companyname : oMainContact.Value.name1,
																					maincontactname : oMainContact.Value.MainContact.fullName,
																					beforeExtNav : fnCallbackNavParaComp,
																				};
																				var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
																						oCompanycard);
																				oCompanyLaunch
																						.openBy(event);
																			}
																		}

																	} else {
																		if (oMainContact.Value.MainAddress) {
																			var oCompanycard = {
																				title : "Account",
																				imgurl : Image,
																				companyname : oMainContact.Value.name1,
																				companyphone : oMainContact.Value.MainAddress.phone,
																				companyaddress : oMainContact.Value.MainAddress.address,
																				beforeExtNav : fnCallbackNavParaComp,
																			};
																			var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
																					oCompanycard);
																			oCompanyLaunch
																					.openBy(event);
																		} else {
																			var oCompanycard = {
																				title : "Account",
																				imgurl : Image,
																				companyname : oMainContact.Value.name1,
																				beforeExtNav : fnCallbackNavParaComp,
																			};
																			var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
																					oCompanycard);
																			oCompanyLaunch
																					.openBy(event);
																		}
																	}

																}, this),
												jQuery
														.proxy(
																function(oError) {
																	sap.m.MessageToast
																			.show(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'ERROR'));
																}, this), true);
							} else {
								sap.m.MessageToast
										.show(sap.ca.scfld.md.app.Application
												.getImpl().getResourceBundle()
												.getText('ACCOUNT_IS_NULL'));
							}
						}

						// Nither a contact or account
						else {
							sap.m.MessageToast
									.show(sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText('NOT_CONTACT_OR_ACCOUNT'));
						}
					},

					/* Open the Attachment in browser */
					onAttachmentSelected : function(oEvent) {
						var selectedAttachment = oEvent
								.getParameter('listItem').getBindingContext()
								.getObject();
						var win = window.open(
								selectedAttachment.__metadata.media_src,
								'_blank');
						win.focus();

					},
					
					getRuleForPartnerFunction : function(sPartnerFunctionCode){
						
						for(var i = 0; i < this.partnerDeterminationMap[this.transactionType].length; i++){
						if(this.partnerDeterminationMap[this.transactionType][i].PartnerFunctionCode === sPartnerFunctionCode){
								return this.partnerDeterminationMap[this.transactionType][i];
							}
						}
						return null;
					},
					getCountForPartnerFunction : function(sPartnerFunctionCode){
						
						var count = 0;
						var participantsCollection  = this.byId('Sales_Team').getModel('json').getData().OpportunitySalesTeamSet;
						
						for(var i = 0; i<participantsCollection.length;i++){
							if(participantsCollection[i].PartnerFunctionCode === sPartnerFunctionCode){
								count++;
							}
							
						}
						
						return count;
					},
					
					
                 enableAddParticipantsButton : function(){
                	 
                	 var participantsList =  this.participantsF4Fragment.getContent()[2];
                	 if(participantsList.getSelectedItems().length > 0){
		            	   this.participantsF4Fragment.getBeginButton().setEnabled(true);
		               }
		               else{
		            	   this.participantsF4Fragment.getBeginButton().setEnabled(false);
		               }
                 },
					
					
					searchParticipants  : function(){
					    var selectParticipants = this.participantsF4Fragment.getContent()[0];
					    this.participantsF4Fragment.getBeginButton().setEnabled(false);
					    selectParticipants.fireChange({selectedItem : selectParticipants.getSelectedItem()});
					},
					onPartnerFunctionChange : function(oEvent){
							
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

						}

						if(oEvent.getSource()
								.getBindingContext('json')){
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].setMode("SingleSelectLeft");
							
						}
						var aPartnerTypes = this.participantsF4MultiselectFragment
						.getModel("json").getProperty(
								"/PartnerFunctions"), oNavCont = this.participantsF4MultiselectFragment
						.getContent()[0];
						if(!aPartnerTypes)
							aPartnerTypes=this.partnerDeterminationMap[this.transactionType];
		                 
						var enter=false;
						var iIndex;
						var iIndexStatus=false;
						
						if(this.participantsF4MultiselectFragment
								.getModel("SelectedPartnerCategoryTemp1")){
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
						if(this.iIndexStatus){
							iIndex=this.IndexValue;
						}else{
						oSelectPartnerTypeContext =this.selectedBuffer.getBindingContext("json");
						}
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
							  if(this.iIndexStatus){
								  iIndex=this.IndexValue;
							  }else{
							  oSelectPartnerTypeContext =this.selectedBuffer.getBindingContext("json");}
							  
							    }else if(dummy){
							    	
							    	
							    	
							    }
							    else if(this.participantsF4MultiselectFragment.getContent()[0]
								.getPages()[1].getContent()[0].getMode() == "SingleSelectLeft"){
							    	this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getSubHeader().getContentLeft()[0].clear();
							    	if(oEvent.getSource()
											.getBindingContext('json')){
							    	var oCurrentPartner = oEvent.getSource()
									.getBindingContext('json').getObject();
							    	this.oCurrentPartnerBuffer=oCurrentPartner;
							    	this.itemToDelete=oCurrentPartner;
							    	}else{
							    		
							    		oCurrentPartner=this.oCurrentPartnerBuffer;
							    		enter=true;
							    	}
							
							
							if (!this.participantsF4MultiselectFragment
									.getModel("PartnersBasedOnType")) {
								this.participantsF4MultiselectFragment.setModel(
										new sap.ui.model.json.JSONModel(),
										"PartnersBasedOnType");
							}
							var partner = this.partnerDeterminationMap[this.transactionType];
							var partnerCategory;
							var partnerFunctionName;
							for ( var k = 0; k < partner.length; k++) {
								if (partner[k].PartnerFunctionCode == oCurrentPartner.PartnerFunctionCode) {
									partnerCategory = partner[k].PartnerFunctionCategory;
									partnerFunctionName = partner[k].PartnerFunctionName;
								}

							}
							for ( var k = 0; k < aPartnerTypes.length; k++) {
								if(partnerCategory==aPartnerTypes[k].PartnerFunctionCategory){
									
								iIndex=k;
								this.IndexValue=k;
								this.iIndexStatus=true;
								}
								toolBar=true;
								
							}
							    	
							    	
							    	
								}else{
									this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getSubHeader().getContentLeft()[0].clear();
							  this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
							  var oSelectedItem = oEvent.getParameter("listItem");
							  this.selectedBuffer=oSelectedItem;
							  oSelectPartnerTypeContext = oSelectedItem
								.getBindingContext("json");
							  toolBar=true;
							  
						  }
						
						
						
							
							
							
							
						
						
						this.accountId=this.byId('info').getModel('json')
						.getData().ProspectNumber;
						this.accountName = this.byId('opportunityHeader').getModel('json').getData().ProspectName;
					var sSelectedPartnerCategoryAndParticipants = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategory");
			        var sSelectedPartnerCategoryAndParticipantsTemp = this.participantsF4MultiselectFragment
					.getModel("SelectedPartnerCategoryTemp");
		            
			       
			        if (!this.participantsF4MultiselectFragment
							.getModel("PartnersBasedOnType")) {
						this.participantsF4MultiselectFragment.setModel(
								new sap.ui.model.json.JSONModel(),
								"PartnersBasedOnType");
					}
			        
			        
			       

			        	 if(!this.iIndexStatus)
						iIndex = aPartnerTypes
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
								}
								else if(this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()&&searchText){
									
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
							
								if (this.participantsF4MultiselectFragment
										.getContent()[0]
										.getPages()[1]
										.getContent()[0]
										.getMode() == "SingleSelectLeft") {
									this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].setShowNavButton(false);
									this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getFooter().getContentRight()[0].setEnabled(false);
									var aPartnersBasedOnType = this.participantsF4MultiselectFragment
									.getContent()[0]
									.getPages()[1]
									.getContent()[0]
									.getItems();
									
									
									var key=this.oCurrentPartnerBuffer.PartnerNumber;
									for ( var int2 = 0; int2 < aPartnersBasedOnType.length; int2++) {
										if(aPartnersBasedOnType[int2].getDescription()==key){
											aPartnersBasedOnType[int2].setSelected(true);
											
											
										}
										
										
									}
									
									
									
									
								
								}else{
							
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
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getContent()[0].setText("Filtered By Account ID :"+this.accountName);
							this.oModel.read("AccountCollection('"+this.accountId+"')/Contacts",	null, null, false, fnSuccess,
									fnError);
							}
							else if(this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()&&searchText){
								
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
							if (this.participantsF4MultiselectFragment
									.getContent()[0]
									.getPages()[1]
									.getContent()[0]
									.getMode() == "SingleSelectLeft") {
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].setShowNavButton(false);
								this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getFooter().getContentRight()[0].setEnabled(false);
								
								var aPartnersBasedOnType = this.participantsF4MultiselectFragment
								.getContent()[0]
								.getPages()[1]
								.getContent()[0]
								.getItems();
								
								
								var key=this.oCurrentPartnerBuffer.PartnerNumber;
								for ( var int2 = 0; int2 < aPartnersBasedOnType.length; int2++) {
									if(aPartnersBasedOnType[int2].getDescription()==key){
										aPartnersBasedOnType[int2].setSelected(true);
										
										
									}
									
									
								}
								
								
								
								
							
							}else{
						
						
						
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
												
												if((toolBar&&this.sBackendVersion==4)||((searchText.length>0&&this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible())&&this.sBackendVersion==4)){
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
//							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().setVisible(true);
//								this.oModel.read("/AccountCollection",	null, '$top=200&$filter=substringof(%27'+encodeURIComponent(searchText)+'%27,fullName)', false, fnSuccess,
//										fnError);
							
								if (this.participantsF4MultiselectFragment
										.getContent()[0]
										.getPages()[1]
										.getContent()[0]
										.getMode() == "SingleSelectLeft") {
									this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].setShowNavButton(false);
									this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getFooter().getContentRight()[0].setEnabled(false);
									
									var aPartnersBasedOnType = this.participantsF4MultiselectFragment
									.getContent()[0]
									.getPages()[1]
									.getContent()[0]
									.getItems();
									
									
									var key=this.oCurrentPartnerBuffer.PartnerNumber;
									for ( var int2 = 0; int2 < aPartnersBasedOnType.length; int2++) {
										if(aPartnersBasedOnType[int2].getDescription()==key){
											aPartnersBasedOnType[int2].setSelected(true);
											
											
										}
										
										
									}
									
									
									
									
								
								}else{
						
						
						this.participantsF4MultiselectFragment
						.getContent()[0].getPages()[1]
						.getContent()[0].destroyItems();
				
				
				
				if((toolBar&&this.sBackendVersion==4)||(this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getContent()[0].getInfoToolbar().getVisible()&&this.sBackendVersion==4)){
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
								}
								break;
				
						}
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].setTitle(this.oResourceBundle.getText('PARTNERS')+" "+aPartnerTypes[iIndex]["PartnerFunctionName"]);
				        
			        
			        oNavCont._sSelectedPartnerCategory = aPartnerTypes[iIndex]["PartnerFunctionName"];
			        oNavCont._sSelectedPartnerCategoryCode = aPartnerTypes[iIndex]["PartnerFunctionCategory"];
					
					oNavCont.to(this.participantsF4MultiselectFragment
							.getContent()[0].getPages()[1]);
					if(this.participantsF4MultiselectFragment
							.getContent()[0]
					.getPages()[1]
					.getContent()[0]
					.getMode() == "SingleSelectLeft")
					this.participantsF4MultiselectFragment.open();
					
					
				},
					bindS3Header : function(data) {
						 
                        var s3Header = this.byId('opportunityHeader');
                        var sPath = "/AccountCollection('"
                                      + data.ProspectNumber + "')";
                        var oLogo = "sap-icon://person-placeholder";
                        
                        var oJSONModel = s3Header.getModel("json");
                        var oData = oJSONModel.oData;
                        var that = this;
                        if(!this.bHideImage){
                        if(this.sProspectNumber !== data.ProspectNumber || !this.mPartnerImgSrc[this.sProspectNumber]){
                        	
                        this.sProspectNumber = data.ProspectNumber;
                     
                        if(this.sProspectNumber !== ""){
                        this.oModel.read(sPath,null,[ "$expand=Logo" ],false,function(odata, response) {
                                                          jQuery.sap.log.info("oData account response");
                                                          if (odata.Logo&& odata.Logo.__metadata) {
                                                                 var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src: "sap-icon://person-placeholder";
                                                                        /* var URl = oMetadata.replace(/^https:\/\//i, 'http://');*/
                                                                 oLogo = oMetadata.toString();
                                                          }
                                                         
                                                         
                                                     
                                                    },
                                                    jQuery.proxy(this.handleErrors, this));
                        
                        }
                        data.ImgSrc = oLogo;
                        this.mPartnerImgSrc[this.sProspectNumber] = oLogo;
                       
                        }
                        else{
                            data.ImgSrc = this.mPartnerImgSrc[this.sProspectNumber];
                      }
                      	}
					else{
						
						data.ImgSrc = " ";
					}
                        if (s3Header&& s3Header.getModel('json')){
                            s3Header.getModel('json').setData(data);
                        }
                        //deep merge of jsons
                        delete data.Products;
                         oData = jQuery.extend(true,{},oData,data);
                         oJSONModel.oData = oData;
                         oJSONModel.updateBindings();
                        
                 },

					getParticipants : function() {

						var data;
						var oLogo = [];
						var that = this;
						this.partnerFunctionMap = {};
						this.byId("Sales_Team").setNoDataText(
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												'LOADING_TEXT'));
						this.byId('Sales_Team').getModel('json').setData({
							OpportunitySalesTeamSet : []
						});
						this.oModel
								.read(
										this.sPath,
										null,
										[ "$expand=SalesTeam,Competitors" ],
										false,
										function(odata, response) {

											that.bindS3Header(response.data);
											var tab = that.getView().byId(
													"Sales_Team");
											var jsonModel = new sap.ui.model.json.JSONModel();

											data = {
												OpportunitySalesTeamSet : response.data.SalesTeam.results
											};
											that.byId('Sales_Team')
													.getHeaderToolbar()
													.getContent()[0]
													.setText(that.oResourceBundle
															.getText(
																	'PARTICIPANTS',
																	[ response.data.SalesTeam.results.length ]));
											if (data.OpportunitySalesTeamSet.length == 0) {

												that
														.byId("Sales_Team")
														.setNoDataText(
																sap.ca.scfld.md.app.Application
																		.getImpl()
																		.getResourceBundle()
																		.getText(
																				'NO_CONTACTS'));
											}

											var aBatchReads = [];
											var mBatchIndexes = {};
											var index = 0;
											for ( var i = 0; i < data.OpportunitySalesTeamSet.length; i++) {
												var accountID = data.OpportunitySalesTeamSet[i].PartnerNumber;

												var sPath = "/AccountCollection('"
														+ accountID
														+ "')?$expand=Logo";
												oLogo[i] = "sap-icon://person-placeholder";

												if (!that.mPartnerImgSrc[accountID]
														&& accountID !== "") {
													aBatchReads
															.push(that.oModel
																	.createBatchOperation(
																			sPath,
																			"GET"));
													mBatchIndexes[index] = i;
													index++;
												} else {
													data.OpportunitySalesTeamSet[i].ImgSrc = that.mPartnerImgSrc[accountID];
												}
											}
											;

											that.oModel
													.addBatchReadOperations(aBatchReads);
											that.oModel
													.submitBatch(
															jQuery
																	.proxy(
																			function(
																					oResponses) {

																				for ( var j = 0; j < index; j++) {
																					if (!oResponses.__batchResponses[j]
																							.hasOwnProperty("data")) {
																						oLogo[j] = "sap-icon://person-placesholder";
																					} else {
																						if (oResponses.__batchResponses[j].data
																								&& oResponses.__batchResponses[j].data.Logo
																								&& oResponses.__batchResponses[j].data.Logo.__metadata.media_src) {

																							var oMetadata = oResponses.__batchResponses[j].data.Logo.__metadata.media_src ? oResponses.__batchResponses[j].data.Logo.__metadata.media_src
																									: "sap-icon://person-placeholder";
																							var URl = oMetadata;
																							oLogo[j] = URl
																									.toString();
																						}
																					}

																					data.OpportunitySalesTeamSet[mBatchIndexes[j]].ImgSrc = oLogo[j];
																					that.mPartnerImgSrc[data.OpportunitySalesTeamSet[mBatchIndexes[j]].PartnerNumber] = oLogo[j];
																				}

																			},
																			this),
															jQuery.proxy(
																	function() {
																	}, this),
															false);

											jsonModel.setData(data);
											tab.setModel(jsonModel, "json");

											// also bind the competitors!

											if (response.data.Competitors
													&& response.data.Competitors.results) {
												if (response.data.Competitors.results.length === 0) {
													that.byId('tab_competitor')
															.setVisible(false);
												} else {
													that.byId('tab_competitor')
															.setVisible(true);
												}

												var oModel = that.byId(
														'competitors')
														.getModel('json');
												if (oModel) {
													oModel.oData.OpportunityCompetitors = response.data.Competitors.results;
													oModel.updateBindings();

												} else {
													that
															.byId('competitors')
															.setModel(
																	new sap.ui.model.json.JSONModel(
																			{
																				OpportunityCompetitors : response.data.Competitors.results
																			}),
																	'json');
												}

											}

										});
						if(parseFloat(this.sBackendVersion) >= 4){
								this.refreshMsgLog(true);
						}
						if(this.release)
							sap.ca.ui.utils.busydialog.releaseBusyDialog();
						this.release=false;

					},
					
					addParticipants : function() {
						 
                        this.oModel.clearBatch();
                        var changeSet = [];
                        var currentPartnerFunctionCode = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionCode;
                        var headerGuid = this.byId('info').getModel('json').getData().Guid;
                        var items = this.participantsF4Fragment.getContent()[2].getSelectedItems();
                        var oEntry;
                        
                        for ( var i = 0; i < items.length; i++) {
                               oEntry = {
                                      HeaderGuid : headerGuid,
                                      PartnerNumber : items[i].data("ID"),
                                      PartnerFunctionCode : currentPartnerFunctionCode
                               };
                               changeSet.push(this.oModel.createBatchOperation("OpportunitySalesTeamSet", "POST", oEntry,null));
                        }

                        if (changeSet.length > 0) {
                               this.oModel.addBatchChangeOperations(changeSet);
                               this.oModel.submitBatch(jQuery.proxy(function(oResponses) {
                                      this.getParticipants();
                                      this.participantsF4Fragment.getContent()[2].removeSelections();
                                      this.participantsF4Fragment.getContent()[1].clear();
                                      this.participantsF4Fragment.close();

                                      // If the partner function of the added participant is "Contact Person",
                					  // then notify listeners for event that contact has been added
                					  if(currentPartnerFunctionCode === "00000015")
                						  sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "contactAdded", {
              							  contextPath : "Opportunities(guid'" + headerGuid + "')"
              						  });

                               }, this),
                               jQuery.proxy(function(oError) {
                                      this.handleErrors(oError);
                               }, this));
                        }
                 },

                
              onDeleteParticipant : function(oEvent){
	               
            	 var oCurrentPartner = oEvent.getSource().getBindingContext('json').getObject();
    	    	var oCurrentRule = this.getRuleForPartnerFunction(oCurrentPartner.PartnerFunctionCode);
    	    	if(this.getCountForPartnerFunction(oCurrentPartner.PartnerFunctionCode) - 1 < oCurrentRule.CountLow){
    	    		
    	    		if(oCurrentRule.CountLow === 1){
    	    		 sap.ca.ui.message.showMessageToast(this.oResourceBundle.getText('MUST_HAVE_PARTICIPANTS_1',[oCurrentRule.CountLow]));
    	    		}
    	    		else{
    	    			 sap.ca.ui.message.showMessageToast(this.oResourceBundle.getText('MUST_HAVE_PARTICIPANTS',[oCurrentRule.CountLow]));	
    	    		}
    	    		 return;
    	    	}
  				var headerGuid=this.byId('info').getModel('json').getData().Guid;
  				var sPath = ["OpportunitySalesTeamSet(HeaderGuid=guid'",headerGuid,"',PartnerNumber='",oCurrentPartner.PartnerNumber,"',PartnerFunctionCode='",oCurrentPartner.PartnerFunctionCode,"')"].join("");
  				
  				this.oModel.remove(sPath,null,jQuery.proxy(function(){
  					
  					this.getParticipants();
  					this.oModel.refresh();

  					// If the partner function of the deleted partner is "Contact Person",
  					// then notify listeners for event that contact has been deleted
  					if(oCurrentPartner && oCurrentPartner.PartnerFunctionCode === "00000015")
  						sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "contactDeleted", {
							contextPath : "Opportunities(guid'" + headerGuid + "')"
						});
  					
  				},this),jQuery.proxy(function(oError){
  					
  					this.handleErrors(oError);
  					
  				},this));
  				
  				
  			},
  			      getChangeable : function(sPartnerFunctionCode){
  			    	  
  			    	  for(var i = 0; i < this.partnerDeterminationMap[this.transactionType].length; i++){
  			    		  
  			    		  if(this.partnerDeterminationMap[this.transactionType].PartnerFunctionCode === sPartnerFunctionCode){
  			    			  
  			    			  return this.partnerDeterminationMap[this.transactionType].ChangeableFlag;
  			    		  }
  			    		  
  			    	  }
  			    	  
  			    	  return true;
  			    	  
  			      },
					showParticipantsF4 : function(){
						this.iIndexStatus=false;

						var selectParticipants;
						if (!this.participantsF4MultiselectFragment) {
							this.participantsF4MultiselectFragment = new sap.ui.xmlfragment(
									this.createId("participantsF4_S3"),
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
							// selectParticipants.attachChange(null,this.onPartnerFunctionChange,this);

						}
						

						// the customizing of partner functions
						selectParticipants = this.participantsF4MultiselectFragment
								.getContent()[0];
						this.participantsF4MultiselectFragment.getModel('json')
								.getData().PartnerFunctions = this.partnerDeterminationMap[this.transactionType];
						this.participantsF4MultiselectFragment.getModel('json')
								.updateBindings();
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[0].getContent()[0].bindItems("json>/PartnerFunctions",this.oPartnerFunctionsTemplate,null,[]);
						selectParticipants.getPages()[1].getContent()[0]
								.setMode("MultiSelect");
						var countInfo = this.participantsF4MultiselectFragment
								.getContent()[0].getPages()[0].getContent()[0]
								.getItems();
						if (countInfo.length > 0)
							for ( var k = 0; k < countInfo.length; k++) {
								countInfo[k].setInfo(" ");
								countInfo[k].setSelected(false);
							}

						
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].setShowNavButton(true);
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getFooter().getContentRight()[0].setEnabled(true);
						
						this.participantsF4MultiselectFragment.open();

					},
					closeParticipantsF4 : function(oEvent)
					{
						
						this.participantsF4Fragment.getContent()[1].clear();
						this.participantsF4Fragment.getContent()[2].removeSelections();
						this.participantsF4Fragment.close();
					},

					/* Contact F4 */
					addContact : function(oEvent) {
						var oModel = this.getView().getModel();
						this.contactF4Fragment.getContent()[0]
								.removeSelections();
						this.contactF4Fragment
								.setModel(new sap.ui.model.json.JSONModel());
						this.contactF4Fragment.setModel(this.getView()
								.getModel("i18n"), "i18n");
						this.contactF4Fragment.getContent()[0]
								.setNoDataText(sap.ca.scfld.md.app.Application
										.getImpl().getResourceBundle().getText(
												'LOADING_TEXT'));
						var toolbar = this.contactF4Fragment.getContent()[0]
								.getInfoToolbar();
						var toolbarLabel = toolbar.getContent()[0];
						toolbar.setVisible(false);
						this.contactF4Fragment.getSubHeader().getContentLeft()[0]
								.setValue("");
						var opportunity_Data = this.byId('info').getModel(
								'json').getData();
						this.opportunity_number = opportunity_Data.ProspectNumber;
						this.contactF4Fragment.open();
						var jsonModel = new sap.ui.model.json.JSONModel();
						this.contactF4Fragment.setModel(jsonModel, "json");
						if (this.opportunity_number != ""
								&& this.opportunity_number != undefined) {
							toolbar.setVisible(true);
							toolbarLabel
									.setText(sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText('FILTER')
											+ " "
											+ opportunity_Data.ProspectName);
							oModel
									.read(
											"/AccountCollection(accountID='"
													+ this.opportunity_number
													+ "')/Contacts",
											null,
											null,
											true,
											jQuery
													.proxy(
															function(odata,
																	response) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{
																					ContactCollection : response.data.results
																				});
																if (response.data.results.length === 0)
																	this.contactF4Fragment
																			.getContent()[0]
																			.setNoDataText(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'NO_CONTACTS'));

															}, this),
											jQuery
													.proxy(
															function(oError) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{
																					ContactCollection : []
																				});
																this.contactF4Fragment
																		.getContent()[0]
																		.setNoDataText(sap.ca.scfld.md.app.Application
																				.getImpl()
																				.getResourceBundle()
																				.getText(
																						'NO_CONTACTS'));
															}, this));

						} else {
							toolbar.setVisible(false);
							this.contactF4Fragment.getModel('json').setData({
								ContactCollection : []
							});
							this.contactF4Fragment.getContent()[0]
									.setNoDataText(sap.ca.scfld.md.app.Application
											.getImpl().getResourceBundle()
											.getText('LOADING_TEXT'));
							oModel
									.read(
											"ContactCollection",
											null,
											null,
											true,
											jQuery
													.proxy(
															function(odata,
																	response) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{
																					ContactCollection : response.data.results
																				});
																if (response.data.results.length === 0)
																	this.contactF4Fragment
																			.getContent()[0]
																			.setNoDataText(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'NO_CONTACTS'));
															}, this),
											jQuery
													.proxy(
															function(oError) {
																this.contactF4Fragment
																		.getContent()[0]
																		.setNoDataText(sap.ca.scfld.md.app.Application
																				.getImpl()
																				.getResourceBundle()
																				.getText(
																						'NO_CONTACTS'));

															}, this));
						}
					},

					/* Set contact to text field */
					setContact : function(oEvent) {
						var oModel = this.getView().getModel();
						this.oSelectedContact = oEvent.getSource()
								.getSelectedItem().getBindingContext("json")
								.getObject();
						var accountId = this.byId('info').getModel('json')
								.getData().ProspectNumber;
						var headerGuid = this.byId('info').getModel('json')
								.getData().Guid;
						var that = this;
						oModel.refreshSecurityToken();
						oModel
								.update(
										"OpportunitySalesTeamSet(PartnerNumber='"
												+ this.oSelectedContact.contactID
												+ "',PartnerFunctionCode='00000015',HeaderGuid=guid'"
												+ headerGuid + "')",
										{
											HeaderGuid : headerGuid,
											PartnerNumber : this.oSelectedContact.contactID,
											PartnerFunctionCode : '00000015'
										},
										{
											fnSuccess : jQuery.proxy(function(){
												this.getParticipants();
											},this),
											fnError : function(oError) {
												this.handleErrors(oError);
											},
											bMerge : true

										});
						this.contactF4Fragment.getContent()[0]
								.removeSelections();
						var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData({
							ContactCollection : []
						});
						this.contactF4Fragment.setModel(jsonModel, "json");
						this.contactF4Fragment.close();

					},
					
					
					/*Closing toolbar in contact F4*/
					closeToolbar : function(oEvent) {
						var toolbar = this.contactF4Fragment.getContent()[0]
								.getInfoToolbar();
						var olist = this.contactF4Fragment.getContent()[0];
						toolbar.setVisible(false);
						olist.getBinding("items").aFilters = [];
						olist.getBinding("items").sFilterParams = "";
						olist.getBinding("items").refresh();
						this.contactF4Fragment.getModel('json').setData({
							ContactCollection : []
						});
						olist.setNoDataText(sap.ca.scfld.md.app.Application
								.getImpl().getResourceBundle().getText(
										'LOADING_TEXT'));
						this
								.getView()
								.getModel()
								.read(
										"ContactCollection",
										null,
										null,
										true,
										jQuery
												.proxy(
														function(odata,
																response) {
															this.contactF4Fragment
																	.getModel(
																			'json')
																	.setData(
																			{
																				ContactCollection : response.data.results
																			});
															if (response.data.results.length === 0)
																this.contactF4Fragment
																		.getContent()[0]
																		.setNoDataText(sap.ca.scfld.md.app.Application
																				.getImpl()
																				.getResourceBundle()
																				.getText(
																						'NO_CONTACTS'));
														}, this),
										jQuery
												.proxy(
														function(oError) {
															this.contactF4Fragment
																	.getContent()[0]
																	.setNoDataText(sap.ca.scfld.md.app.Application
																			.getImpl()
																			.getResourceBundle()
																			.getText(
																					'NO_CONTACTS'));
														}, this));
					},
					
					onRenameFile : function(oEventData)
					{
						
						var newFileName = oEventData.getParameters().newFilename;
					    var fileId  = oEventData.getParameters().fileId;
					    var obj = {
					    		
					    		"newFileName" : newFileName + "",
					    		"fileId"  : fileId +""
					    		
					    };
					  
					    
					    var headerGuid = this.byId('info').getModel('json').getData().Guid;
					    var Parameters = oEventData.getParameters();
					    var URL;
					   if(Parameters.media_src)						
						 URL = Parameters.media_src;
					   else
						   URL = Parameters.url;
						var removStartVal = URL.split("(").pop();
						
						//var removStartVal = URL.split("(").pop();
						var sPath = "OpportunityAttachments(";
						var url = sPath + removStartVal;
						this.oModel.setHeaders(obj);
						this.oModel
						.addBatchChangeOperations([ this.oModel
								.createBatchOperation(
										url, "PUT",obj,null) ]);
						
								    
						
					},
					
					onSaveClicked : function() {
					      //save to server here and determine success
				var	 aBatch;
				
				
				this.oModel.submitBatch();
				
				  
					      var success = true;
					 
					      var fileUploadControl = this.byId("fileupload");
					 
					      if (success) {
					         fileUploadControl.commitPendingRenames();
					      } else {
					         fileUploadControl.abandonPendingRenames();
					      }
					  },
					
					


					closeContactF4 : function(oEvent) {
						var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData({
							ContactCollection : []
						});
						this.contactF4Fragment.setModel(jsonModel, "json");
						this.contactF4Fragment.close();
					},

					searchContact : function(oEvent) {
						var sValue = oEvent.getParameter("query");
						this.contactF4Fragment.getContent()[0]
								.setNoDataText(sap.ca.scfld.md.app.Application
										.getImpl().getResourceBundle().getText(
												'LOADING_TEXT'));
						var toolbar = this.contactF4Fragment.getContent()[0]
								.getInfoToolbar();
						if (toolbar.getVisible() === false) {
							this
									.getView()
									.getModel()
									.read(
											"ContactCollection",
											null,
											[ "$filter=substringof('" + sValue
													+ "'" + ",fullName)" ],
											true,
											jQuery
													.proxy(
															function(odata,
																	response) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{
																					ContactCollection : response.data.results
																				});
																if (response.data.results.length === 0)
																	this.contactF4Fragment
																			.getContent()[0]
																			.setNoDataText(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'NO_CONTACTS'));

															}, this),
											jQuery
													.proxy(
															function(oError) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{

																					ContactCollection : []
																				});
																this.contactF4Fragment
																		.getContent()[0]
																		.setNoDataText(sap.ca.scfld.md.app.Application
																				.getImpl()
																				.getResourceBundle()
																				.getText(
																						'NO_CONTACTS'));

															}, this));
						} else {
							var accountId = this.byId('info').getModel('json')
									.getData().ProspectNumber;
							this
									.getView()
									.getModel()
									.read(
											"/AccountCollection(accountID='"
													+ accountId + "')/Contacts",
											null,
											[ "$filter=substringof('" + sValue
													+ "'" + ",fullName)" ],
											true,
											jQuery
													.proxy(
															function(odata,
																	response) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{
																					ContactCollection : response.data.results
																				});
																if (response.data.results.length === 0)
																	this.contactF4Fragment
																			.getContent()[0]
																			.setNoDataText(sap.ca.scfld.md.app.Application
																					.getImpl()
																					.getResourceBundle()
																					.getText(
																							'NO_CONTACTS'));

															}, this),
											jQuery
													.proxy(
															function(oError) {
																this.contactF4Fragment
																		.getModel(
																				'json')
																		.setData(
																				{

																					ContactCollection : []
																				});
																this.contactF4Fragment
																		.getContent()[0]
																		.setNoDataText(sap.ca.scfld.md.app.Application
																				.getImpl()
																				.getResourceBundle()
																				.getText(
																						'NO_CONTACTS'));

															}, this));
						}

					},
						handleErrors : function(oError) {
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						jQuery.sap.log.error(JSON.stringify(oError));
						sap.ca.ui.message
								.showMessageBox(
										{
											type : sap.ca.ui.message.Type.ERROR,
											message : oError.message,
											details : JSON
													.parse(oError.response.body).error.message.value
										}, function(oResult) {
											
										});

					},

					getDataForDetailScreen : function(bShowInfoTab) {

						//if the app is launched read the data for drop downs - customzing data
						//	var prospectNumber = this.oModel.getContext("/" + sPath).getObject().ProsectNumber;
						
						
						
						
						var sExpandEntities = "$expand=Products,ChangeDocs,Competitors";
						
						if(parseFloat(this.sBackendVersion) >= 4){
							sExpandEntities += ",OpportunityLogSet";

							
							var s4Controller = this.getView().getModel("controllers").getData().s4Controller;
							
							if(s4Controller && s4Controller.bSuccessSave){
								//no need to fetch eEtag no successSave as s4Controller already handles it
								delete s4Controller.bSuccessSave;
								
							}
							else{
								
								//fetch ETag in an asynchronous call -either when there is a normal detail page load or when there is save fail in s4Controller
								cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath,this);
							}
							
						}
						if (this.bAppLaunched) {
							this.oModel
									.addBatchReadOperations([ this.oModel
											.createBatchOperation(
													"SalesStages", "GET") ]);
							this.oModel
									.addBatchReadOperations([ this.oModel
											.createBatchOperation("Priorities",
													"GET") ]);
							this.oModel
									.addBatchReadOperations([ this.oModel
											.createBatchOperation(
													"UserStatuses", "GET") ]);
							this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Currencies","GET")]);

							//expand products
							
							
							this.oModel
									.addBatchReadOperations([ this.oModel
											.createBatchOperation(
													this.sPath
															+ "?"+ sExpandEntities,
													"GET") ]);
							
							 if(parseFloat(this.sBackendVersion) >= 4){
	                            	this.oModel.addBatchReadOperations([this.oModel.createBatchOperation(this.sPath,"GET")]);
	                            	
	                            	var mPartnerFunctions  = cus.crm.opportunity.util.Util.getPartnerFunctions();
	                            	if(!mPartnerFunctions){
	                            		
	                            		this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("PartnerFunctions","GET")])
	                            	}
	                            }
							//EXTENSION POINT to be able to fetch additional customizing data
							/**
							 * @ControllerHook extHookGetAdditonalCustomizing is the controller hook  that provides for fetching of additional customizing values from the backend during 
							 *                 launch of the application. The response can be handled by the controller hook extHookHandleBatchResponses. 
							 *                                   
							 * @callback cus.crm.opportunity.S3.controller~extHookGetAdditionalCustomizing
							 * @return {void}
							 */
							if (this.extHookGetAdditionalCustomizing){
								this.extHookGetAdditionalCustomizing();
							
							}
							this.oModel.submitBatch(jQuery.proxy(
									this.handleBatchResponses, this), jQuery
									.proxy(this.handleBatchErrors, this));
							
						} else
							this.oModel
									.read(
											this.sPath,
											null,
											[sExpandEntities],
											true,
											jQuery
													.proxy(
															function(odata,
																	response) {
																this
																		.bindInfoAndProducts(response.data,bShowInfoTab);

															}, this), jQuery
													.proxy(this.handleErrors,
															this));
						
						
						//EXTENSION POINT to be able to extend drop down data- customizing data
						/**
						 * @ControllerHook extHookGetDataForDetailScreen is the controller hook to fetch additional data and bind it in the 
						 *                 detail screen. 
						 *                                   
						 * @callback cus.crm.opportunity.S3.controller~extHookGetDataForDetailScreen
						 * return {void}
						 */
						if (this.extHookGetDataForDetailScreen){
							this.extHookGetDataForDetailScreen();
						}
			
						
					
						

					},

					handleBatchResponses : function(oResponses) {
						//batch responses from initial launch of s3 view
						var bFail = false;
						var errorTitle;
						var errorMessage;
						var that = this;
						this.bAppLaunched = false;
						if (oResponses.__batchResponses[0].statusCode === "200") {
							that.SalesStages = oResponses.__batchResponses[0].data.results;

						} else {

							bFail = true;
							errorTitle = oResponses.__batchResponses[0].statusText;
							errorMessage = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value + "\n";

						}

						if (oResponses.__batchResponses[1].statusCode === "200") {
							that.Priorities = oResponses.__batchResponses[1].data.results;

						} else {

							bFail = true;
							errorTitle = oResponses.__batchResponses[1].statusText;
							errorMessage = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value + "\n";

						}
						if (oResponses.__batchResponses[2].statusCode === "200") {
							that.UserStatuses = oResponses.__batchResponses[2].data.results;

						} 
						
						else {
							bFail = true;
							errorTitle = oResponses.__batchResponses[2].statusText;
							errorMessage = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value + "\n";

						}
						if(oResponses.__batchResponses[3].statusCode === "200"){
							that.Currencies = oResponses.__batchResponses[3].data.results;
						
						}
						else 
							{
							   bFail = true;
							   errorTitle = oResponses.__batchResponses[3].statusText;
							   errorMessage = JSON.parse(oResponses.__batchResponses[3].response.body).error.message.value + "\n";
							   
							 
							}
						if (bFail) {
							// sap.ca.ui.utils.busydialog.releaseBusyDialog();
							// jQuery.sap.log.error(JSON.stringify(oError));
							sap.ca.ui.message.showMessageBox({
								type : sap.ca.ui.message.Type.ERROR,
								message : errorTitle,
								details : errorMessage
							}, function(oResult) {
								var i = 0;
								i++;
							});
						}
						if (oResponses.__batchResponses[4]
								.hasOwnProperty("data"))
							this
									.bindInfoAndProducts(oResponses.__batchResponses[4].data,true);
						else
							this.handleErrors(oResponses.__batchResponses[4]);
						
						
						if(parseFloat(this.sBackendVersion) >= 4){
							if (oResponses.__batchResponses[5]
							.hasOwnProperty("data")){
						
						this._saveETag(oResponses.__batchResponses[5].data.Etag);
					}
					else
						this.handleErrors(aResponses.__batchResponses[5]);
							
							
							if(oResponses.__batchResponses[6] && oResponses.__batchResponses[6].hasOwnProperty("data")){
								var oUTIL = cus.crm.opportunity.util.Util;
								oUTIL.aggregatePartnerFunctions(oResponses.__batchResponses[6].data.results);
								this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
							}
							
							else{
								this.handleErrors(oResponses.__batchResponses[6]);
							}
							
					
						}
						
						//EXTENSION POINT to be able to set the response of extended drop down values
						/**
						 * @ControllerHook extHookHandleBatchResponses is the controller
						 *                 hook to handle the response of additional customizing fetch during application launch.
						 *                                   
						 * @callback cus.crm.opportunity.S3.controller~extHookHandleBatchResponses
						 * @param {object}
						*         null
						 * @return {void}
						 */
						if (this.extHookHandleBatchResponses){
							this.extHookHandleBatchResponses(oResponses);				
						}
						
						
						

					},

					bindInfoAndProducts : function(data,bShowInfoTab) {

						var infoTab = this.byId('info');
				       	var productsTab = this.byId('Product_Tab');
				       	var s3Header = this.byId('S3_Header');
				       	var oJSONModel = this.getView().getModel("json");
				       	if(parseFloat(this.sBackendVersion) < 4){
							this.byId('opportunityTotalNetValue_Label').setVisible(false);
							this.byId('opportunityTotalNetValue_Text').setVisible(false);
						}
				       	
				        //displaying error message
				     //2q compatible
				  	   var sTitle = this.oResourceBundle.getText('ERROR_MESSAGE');
				       	var LogsTab = this.showErrorMsgFragment.getContent()[0];
				       	var oData = oJSONModel.oData;
				     this.transactionType = s3Header.getModel('json').getData().ProcessType;  	
				       
				     
				       	if(productsTab){
				       		oData.Products = data.Products.results;
				       	}
				       		
				       	oJSONModel.updateBindings();
				      //displaying error message count
				          // adding version control
				    
					 if(this.sBackendVersion>=4){
				       	if(LogsTab && LogsTab.getModel('json')){
				       		LogsTab.getModel('json').setData({OpportunityLogSet : data.OpportunityLogSet.results});
				      	    var omsgCount = data.OpportunityLogSet.results.length;
				      	  //2q compatible
					      	var msgTitle = this.oResourceBundle.getText( "ERROR_MESSAGE_TITLE", omsgCount);
					      	  this.showErrorMsgFragment.setTitle(msgTitle);
				       	}
					 }
             			//if there aren't any results, hide the products tab
						if(data.Products && data.Products.results){
				       	if (data.Products.results.length === 0){
							this.byId('tab_product').setVisible(false);
				       	}
						else{
							this.byId('tab_product').setVisible(true);
						}
						}
						if(data.ChangeDocs && data.ChangeDocs.results){
						if (data.ChangeDocs.results.length === 0){
							this.byId("log").setVisible(false);
						}
						else{
							this.byId("log").setVisible(true);
						}
						}
						
						if(data.Competitors && data.Competitors.results){
						if (data.Competitors.results.length === 0)
							this.byId('tab_competitor').setVisible(false);
						else
							this.byId('tab_competitor').setVisible(true);
						}
						
						//for error message button  enable/disable
				          // adding version control
				    
					 if(this.sBackendVersion>=4){
						if(data.OpportunityLogSet && data.OpportunityLogSet.results){
							if (data.OpportunityLogSet.results.length === 0){
							
						     	this.setBtnEnabled("errorMsg",false);
							}
							else{
								this.setBtnEnabled("errorMsg",true);
							}
							}
					 }
						if(bShowInfoTab){
							this.setDefaultTabToInfo();
						}
						
						this.bindS3Header(data);
		
					},
					onDeleteFile : function(oEvent) {
						var Parameters = oEvent.getParameters();
						var URL;
						if(Parameters.media_src)
						 URL = Parameters.media_src;
						else
							URL = Parameters.url ; 
						
						var removStartVal = URL.split("(").pop();
						var sPath = "OpportunityAttachments(";
						var url = sPath + removStartVal;
						this.oModel.remove(url);
						//removing the file from the UI
						this.byId('fileupload').removeFile(Parameters.fileId);
					},
					detailRouteMatched : function(oEvent) {

						if (oEvent.getParameter("name") === "detail"
								|| oEvent.getParameter("name") === "detailonly") {
							
							this.fullScreenMode = false ; 
							
							
							//have this map empty at start
                            this.mPartnerImgSrc = {};
							if (this.navToOtherApp) {
								this.navToOtherApp = false;

								return;
							}
							//if s4 controller is not null, some actions need to be done based on actions in s4View
							var s4Controller = this.getS4Controller();
							if (s4Controller && s4Controller.bCancel &&!this.bAppLaunched) {
								s4Controller.bCancel = false;
								this.setDefaultTabToInfo();
								return;
							}
							
							if(s4Controller && s4Controller.bEmployeeUpdateSuccess){
							
								this.oModel.refresh();
								
							}

							//avoiding needless roundtrips if the details page changes
							this.byId('opportunityHeader').setIcon(
									"sap-icon://person-placeholder");

							this.sPath = oEvent.getParameter("arguments").contextPath;
							
							

							this.getDataForDetailScreen(true);

							if(this.bAppLaunched){
								this.bAppLaucnhed = false;
							}

						}
						
						if (oEvent.getParameter("name") === "display"
						) {
                       this.fullScreenMode = true;
                       this.oHeaderFooterOptions = this.oHeaderFooterOptions4UI ; 
						if (this.navToOtherApp) {
							this.navToOtherApp = false;

							return;
						}
						//if s4 controller is not null, some actions need to be done based on actions in s4View
						var s4Controller = this.getS4Controller();
						if (s4Controller && s4Controller.bCancel) {
							s4Controller.bCancel = false;
							this.setDefaultTabToInfo();
							return;
						}
						
						if(s4Controller && s4Controller.bEmployeeUpdateSuccess){
						
							this.oModel.refresh();
							
						}

						//avoiding needless roundtrips if the details page changes
						this.byId('opportunityHeader').setIcon(
								"sap-icon://person-placeholder");

						this.sPath = oEvent.getParameter("arguments").contextPath;

						this.getDataForDetailScreen(true);

						
						
						

					}
						

					},
					//Search in Sales Area pop up
					searchSalesArea : function(oEvent) {
						var sValue = oEvent.getParameter("query").toLowerCase();
						var salesAreaList=this.salesareaF4Fragment.getContent()[0].getModel("SalesArea").getProperty("/SalesAreaList").results;
						
						var searchPush= new Array();
						var init=new Array();
						for ( var k = 0; k < salesAreaList.length; k++) {
							
						//	if(salesAreaList[k].SalesOrganizationText.substring(0,sValue.length)==sValue||salesAreaList[k].DistrubutionChannelText.substring(0,sValue.length)==sValue||salesAreaList[k].DivisionText.substring(0,sValue.length)==sValue){
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

					//show sales area f4 help (open and load) after entering account id and Search in Sales Area 
					showSalesAreaF4 : function(oEvent)
					{
						
						var accountId = this.byId('opportunityHeader').getModel('json').getData().ProspectNumber;
						var accountName = this.byId('opportunityHeader').getModel('json').getData().ProspectName;
						
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
						
						toolbar.setVisible(false);
						if(accountId !== "")
						{
							toolbar.setVisible(true);
							toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + accountName);	
							this.oModel.read("/SalesAreas",null,["$filter=ProspectNumber eq '"+ accountId + "'"],true,jQuery.proxy(function(odata,response) {
							
								this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
								this.salesareaF4Fragment.getModel('json').setData({ 
									SalesAreaCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
								});
								//Search in Sales Area pop up
								if (!this.salesareaF4Fragment
										.getModel("SalesArea")) {
									this.salesareaF4Fragment.setModel(
											new sap.ui.model.json.JSONModel(),
											"SalesArea");
								}
							var	salesArea = this.salesareaF4Fragment.getContent()[0].getModel("SalesArea");
								salesArea.setProperty("/SalesAreaList",response.data);
								
								
							    this.salesareaF4Fragment.getModel('json').updateBindings();
							},this),jQuery.proxy(function(oError)
									{
								this.salesareaF4Fragment.getModel('json').setData({
									SalesAreaCollection : []
								});
								this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
									},this));
						 }
					     else{
					    	 toolbar.setVisible(false);
					    	 this.salesareaF4Fragment.getModel('json').setData({SalesAreaCollection: []});
						     this.salesareaF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
						    this.oModel.read("SalesAreas ",null,["$filter=substringof('"+this.byId('salesorganization_Text').getText()+"')"],true,jQuery.proxy(function(odata,response)
						    		 {
						    	  this.salesareaF4Fragment.getModel('json').setData({ 
						    		  SalesAreaCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
					                    });
						    	   	this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));     
						    		 },this),jQuery.proxy(function(oError)
						    	        {
						                	this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
						    	        	
						    	        },this));
					     }
							
							this.salesareaF4Fragment.open();
						
					},

					closeSalesAreaF4 : function(oEvent)
					{
						//Search in Sales Area pop up
						if(this.salesareaF4Fragment.getContent()[0].getModel("SalesArea")){
							
							this.salesareaF4Fragment.getContent()[0].getModel("SalesArea").destroy();
						}
						if(this.salesareaF4Fragment !== undefined){
							this.salesareaF4Fragment.close();
						if(this.salesareaF4Fragment.getSubHeader().getContentLeft()[0].getValue()!="")
							this.salesareaF4Fragment.getSubHeader().getContentLeft()[0].setValue("");
						}
					},

					setSalesArea : function(oEvent) {
						//Search in Sales Area pop up
						if(this.salesareaF4Fragment.getContent()[0].getModel("SalesArea")){
													
													this.salesareaF4Fragment.getContent()[0].getModel("SalesArea").destroy();
												}
						
						this.oSelectedContact = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
						
						this.acc_salesorgid = this.oSelectedContact.SalesOrganizationId;
						this.acc_salesorgdesc = this.oSelectedContact.SalesOrganizationText;
						var salesorganization = cus.crm.opportunity.util.Formatter.formatSalesOrganization(this.acc_salesorgdesc, this.acc_salesorgid);
						this.getView().byId("salesorganization_Text").setText(salesorganization);
						
						this.acc_dischaid = this.oSelectedContact.DistrubutionChannelId;
						this.acc_dischadesc = this.oSelectedContact.DistrubutionChannelText;
						var distributionchannel = cus.crm.opportunity.util.Formatter.formatDistributionChannel(this.acc_dischadesc, this.acc_dischaid);
						this.getView().byId("distributionchannel_Text").setText(distributionchannel);

						this.acc_divid = this.oSelectedContact.DivisionId;
						this.acc_divdesc = this.oSelectedContact.DivisionText;
						var division = cus.crm.opportunity.util.Formatter.formatDivision(this.acc_divdesc, this.acc_divid);
						this.getView().byId("division_Text").setText(division);

	//In line Edit Save
						 this.oModel.clearBatch();
	                        var changeSet = [];	  
	                        var info = this.getView().byId('info');
							var headerGuid = info.getModel('json').getData().Guid;
	                        this.salesareaF4Fragment.getContent()[0].getSelectedItems();
	                        var oEntry;
	                        
	                     oEntry = {
	                       	                 Guid : headerGuid,
	                       	                SalesOrganization: this.acc_salesorgid,
	                            			SalesOrganizationDescription: this.acc_salesorgdesc,
	                        				DistributionChannel: this.acc_dischaid,
	                        				DistributionChannelDescription: this.acc_dischadesc,
	                        				Division: this.acc_divid,
	                        				DivisionDescription: this.acc_divdesc,
	                               };
	                       	                         
	                       	                         	

	                       	                            this.oModel.update("Opportunities(guid'"+headerGuid+"')", oEntry,{
	                       	                               fnSuccess : 	jQuery.proxy(function(oResponses) {
	 	              	                                      this.salesareaF4Fragment.getContent()[0].removeSelections();
	 	              	                                      this.salesareaF4Fragment.close(); 
	 	              	                                      cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath,this);
	 	              	                               }, this),
	 	              	                               
	 	              	                                 fnError : jQuery.proxy(function(oError) {
	 	              	                                	 
	 	              	                                	 if(oError.response.statusCode === 412){
	 	              	                                		 
	 	              	                                		 cus.crm.opportunity.util.Util.show412ErrorDialog(this,
	 	              	                                	jQuery.proxy(function(){
	 	              	                                			cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath,this); 
	 	              	                                		 },this));
	 	              	                                		 
	 	              	                                		 return;
	 	              	                                	 }
		              	                                      this.handleErrors(oError);
	 		              	                               }, this),
	 		              	                               
	 		              	                               bMerge : true
	                       	                            
	                       	                            });
	              	        

						this.closeSalesAreaF4(oEvent);
						this.refreshMsgLog(true);
					},
					
					onAccountBusCardLaunch  : function(oEvt){


						var accountId = oEvt.getSource().data("PartnerNumber");
						var Image;
						if(!this.bHideImage){
							Image = oEvt.getSource().data("Image");
						}else{
						    Image=" ";
						}
						var oModel = this.oModel;
						var event = oEvt.getSource();
						if (accountId)  
						{
						var sPath = "AccountCollection(accountID='"+ accountId + "')?$expand=MainAddress,MainContact/WorkAddress,MainContact" ; 
						 
						var aBatchReads = [];
						
						
							aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       



						oModel.addBatchReadOperations(aBatchReads);
						
						
						oModel.submitBatch(jQuery.proxy(function(oResponses){
							
							var oMainContact = { Value : "" } ;
							oMainContact.Value = oResponses.__batchResponses[0].data ;
							
								
							var fnCallbackNavParaComp = jQuery.proxy(function(oEvent){
								 
									var oNavConfig = {};
									oNavConfig.target = {};
									oNavConfig.target.semanticObject = "Account";
									oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + accountId + "')";
									//oNavConfig.params = { accountID : accountId };
									this.navToOtherApp = true;
									 	
									return oNavConfig;
		                           
	                  		 
							 },this); 
							 

						
							
							
							if (oMainContact.Value.MainContact) 
							{	
								if (oMainContact.Value.MainContact.WorkAddress) 

								{   
									if(oMainContact.Value.MainAddress) {

										var oCompanycard = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : Image,
												companyname : oMainContact.Value.name1,
												companyphone : oMainContact.Value.MainAddress.phone,
												companyaddress : oMainContact.Value.MainAddress.address,
												maincontactname : oMainContact.Value.MainContact.fullName,
												maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
												maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
												maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
												maincontactemailsubj : "Automatic Mail for Maincontact",
											    beforeExtNav:fnCallbackNavParaComp,
										};

										var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
												oCompanycard);
										oCompanyLaunch.openBy(event);
									} 

									else {

										var oCompanycard = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : Image,
												companyname : oMainContact.Value.name1,

												maincontactname : oMainContact.Value.MainContact.fullName,
												maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
												maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
												maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
												maincontactemailsubj : "Automatic Mail for Maincontact",
												beforeExtNav:fnCallbackNavParaComp,
										};
										var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
												oCompanycard);
										oCompanyLaunch.openBy(event);

									}

								}	

								else
								{
									if(oMainContact.Value.MainAddress) {

										var oCompanycard = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : Image,
												companyname : oMainContact.Value.name1,
												companyphone : oMainContact.Value.MainAddress.phone,
												companyaddress : oMainContact.Value.MainAddress.address,
												maincontactname : oMainContact.Value.MainContact.fullName,
												beforeExtNav:fnCallbackNavParaComp,

										};

										var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
												oCompanycard);
										oCompanyLaunch.openBy(event);



									}

									else {

										var oCompanycard = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : Image,
												companyname : oMainContact.Value.name1,
												maincontactname : oMainContact.Value.MainContact.fullName,
												beforeExtNav:fnCallbackNavParaComp,

										};

										var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
												oCompanycard);
										oCompanyLaunch.openBy(event);


									}


								}

							}

							else {

								if(oMainContact.Value.MainAddress) {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											companyphone : oMainContact.Value.MainAddress.phone,
											companyaddress : oMainContact.Value.MainAddress.address,
											beforeExtNav:fnCallbackNavParaComp,

									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);



								}
								else  {



									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											beforeExtNav:fnCallbackNavParaComp,


									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);
								}


							}

						},this),jQuery.proxy(
								function(oError){

									sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));
									
								},this),true);

					} 
						
							
					
	              
					},
					

					/*Changes in Notes Tab with the FeedInput control- On Tab selection*/
					notesTabSelected : function(){

						var oModel = this.getView().getModel();
											
						this.byId("listItem").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
						this.byId('listItem').getModel('json').oData.OpportunityNotesSet = [];
						this.byId('listItem').getModel('json').updateBindings();
					
									
						oModel.read(
								this.sPath,
								null,
								[ "$expand=Notes" ],
								true,
								jQuery.proxy(function(odata, response) {
									var tab = this.getView().byId("listItem");
								    var oJSONModel = tab.getModel("json");
								    var oData = oJSONModel.oData;
								    oData.OpportunityNotesSet = response.data.Notes.results;
								if(oData.OpportunityNotesSet.length == 0)
								{
								this.byId("listItem").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NONOTES'));
								}
									oJSONModel.updateBindings();				
									  

								},this),
								jQuery.proxy(function(oError){
									
									this.handleErrors(oError);
								},this));

					
					},
					
					participantsTabSelected : function(){

						var data1;
						var oLogo = [];
						var that = this;
						var oModel = this.oModel;
						var sPath = this.sPath;
						this.byId("Sales_Team").setNoDataText((this.oResourceBundle.getText('LOADING_TEXT')));
					if(parseFloat(this.sBackendVersion) >= 2.0)	{
						this.partnerFunctionMap = {};
						//this.transactionType = this.oModel.getContext("/" + this.sPath).getObject().ProcessType;
						
						
						if(parseFloat(this.sBackendVersion) >= 4){
							
							
							var oUTIL = cus.crm.opportunity.util.Util;
							
							if(oUTIL.getPartnerFunctions() === null){
								oUTIL.fetchPartnerFunctions(this.oModel);
								
							}
							
							this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
						}
						
						else{
						var s3Header = this.byId('S3_Header');
						this.transactionType = s3Header.getModel('json').getData().ProcessType;
						if(!this.partnerDeterminationMap[this.transactionType]){
							
							
							this.oModel.read("OpptPartnerFctTypes",null,["TransactionType='" + this.transactionType +"'"],false,jQuery.proxy(function(odata,response){
			            			
			            		this.partnerDeterminationMap[this.transactionType] = response.data.results;
			            	},this),jQuery.proxy(function(oError){},this));
						
						}
						
						}
					}
					
					
					
						this.oModel
								.read(
										this.sPath,
										null,
										[ "$expand=SalesTeam" ],
										true,
										function(odata, response) {
											var tab = that.getView().byId(
													"Sales_Team");
											var oJSONModel = tab.getModel("json");
											var oData = oJSONModel.oData;
											// NLUN - CodeScan Changes -
											// Global variables
											that.oVersioningModel.getData().setHeaderTextForParticipants(response);
											oData.OpportunitySalesTeamSet = response.data.SalesTeam.results;
										
											that.oVersioningModel.getData().setHeaderTextForParticipants(response);

											if (oData.OpportunitySalesTeamSet.length == 0) {
												that.byId("Sales_Team").setNoDataText
												(that.oResourceBundle.getText(that.oVersioningModel.getData().sParticipantsNoDataTextKey));
												}

											var aBatchReads = [];

										if(!that.bHideImage){ 
											for ( var i = 0; i < oData.OpportunitySalesTeamSet.length; i++) {
												var partnerID = oData.OpportunitySalesTeamSet[i].PartnerNumber;
												var sPath = "/AccountCollection('"
														+ partnerID
														+ "')?$expand=Logo";
												oLogo[i] = "sap-icon://person-placeholder";
												aBatchReads
														.push(oModel
																.createBatchOperation(
																		sPath,
																		"GET"));
											}
											;
											oModel
													.addBatchReadOperations(aBatchReads);
											oModel
													.submitBatch(
															jQuery
																	.proxy(
																			function(
																					oResponses) {
																				for ( var j = 0; j < oData.OpportunitySalesTeamSet.length; j++) {
																					if(!oResponses.__batchResponses[j].hasOwnProperty("data")){
																						oLogo[j] = "sap-icon://person-placeholder";
																					}
																					else{
																					if (oResponses.__batchResponses[j].data) {
																						if (oResponses.__batchResponses[j].data.Logo
																								&& oResponses.__batchResponses[j].data.Logo.__metadata.media_src) {
																							var oMetadata = oResponses.__batchResponses[j].data.Logo.__metadata.media_src ? oResponses.__batchResponses[j].data.Logo.__metadata.media_src
																									: "sap-icon://person-placeholder";
																							var URl = oMetadata;
																							oLogo[j] = URl
																									.toString();
																						}
																					}
																					}
																					oData.OpportunitySalesTeamSet[j].ImgSrc = oLogo[j];
																					that.mPartnerImgSrc[oData.OpportunitySalesTeamSet[j].PartnerNumber] = oLogo[j];
																				}

																			oJSONModel.updateBindings();

																			},
																			this),
															jQuery
																	.proxy(
																			function(
																					oError) {
																				sap.m.MessageToast
																						.show(sap.ca.scfld.md.app.Application
																								.getImpl()
																								.getResourceBundle()
																								.getText(
																										'ERROR'));
																			},
																			this),
															true);
											}else{
												
												 for ( var i = 0; i < oData.OpportunitySalesTeamSet.length; i++) {
													 oData.OpportunitySalesTeamSet[i].ImgSrc = " ";
                                           	  }
												 oJSONModel.updateBindings();
											}

										});
					
					},
					
					competitorsTabSelected : function(){

                        var oModel = this.oModel;
                        var sPath = this.sPath;
						var data1;
						var oLogo = [];
						var that = this;
						this.byId("competitors").setNoDataText(
								sap.ca.scfld.md.app.Application.getImpl()
										.getResourceBundle().getText(
												'LOADING_TEXT'));
						this.oModel
								.read(
										this.sPath,
										null,
										[ "$expand=Competitors" ],
										true,
										function(odata, response) {
											var tab = that.getView().byId(
													"competitors");
											var oJSONModel = tab.getModel("json");
											var oData = oJSONModel.oData;
											// NLUN - CodeScan Changes -
											// Global variables
											oData.OpportunityCompetitors = response.data.Competitors.results;
										

											if (oData.OpportunityCompetitors.length == 0) {
												that
														.byId("competitors")
														.setNoDataText(
																sap.ca.scfld.md.app.Application
																		.getImpl()
																		.getResourceBundle()
																		.getText(
																				'NOCOMPETITORS'));
											}
											if(!that.bHideImage){

											for ( var i = 0; i < oData.OpportunityCompetitors.length; i++) {
												var accountID = oData.OpportunityCompetitors[i].PartnerNumber;
												var sPath = "/AccountCollection('"
														+ accountID + "')";
												oLogo[i] = "sap-icon://person-placeholder";
												oModel
														.read(
																sPath,
																null,
																[ "$expand=Logo" ],
																false,
																function(
																		odata,
																		response) {
																	jQuery.sap.log
																			.info("oData account response");
																	if (odata.Logo
																			&& odata.Logo.__metadata) {
																		// defaul
																		// account
																		// log
																		// tbd
																		var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src
																				: "sap-icon://person-placeholder";
																		// oLogo
																		// =
																		// cus.crm.opportunity.util.Formatter.urlConverter(oMetadata);
																		var URl = oMetadata;
																		oLogo[i] = URl
																				.toString();
																	}
																});
												oData.OpportunityCompetitors[i].ImgSrc = oLogo[i];
											}
											}
											else{
												
												for ( var i = 0; i < oData.OpportunityCompetitors.length; i++) {
                                          		oLogo[i] = " ";
                                          	  }
												
											}
											
											;

											oJSONModel.updateBindings();
										});
					
					},
					
					attachmentsTabSelected : function(){

						var info = this.getView().byId('info');
						var headerGuid = info.getModel('json').getData().Guid;
                        var oModel = this.oModel;
                        var sPath = this.sPath;
						// get the list to set the post url param
						var that = this.getView();
						var file = that.byId("fileupload");
						if (file.getEditMode() === true)
							file.setEditMode(false);
						// refresh to get xcsrf Token
						oModel.refreshSecurityToken();
						// get token
						var oModelHeaders = oModel.getHeaders();
						file.setXsrfToken(oModelHeaders['x-csrf-token']);

						// remove - from guid
						var nheaderGuid = headerGuid.replace(/-/g, '');
						// set custom header
						file.setCustomHeader("slug", nheaderGuid);

						oModel
								.read(
										sPath,
										null,
										[ "$expand=Attachments" ],
										true,
										function(odata, response) {
											var data = {
												OpportunityAttachments : []
											};
											var length = response.data.Attachments.results.length;
											// NLUN - CodeScan Changes -
											// Global variables
											for ( var i = 0; i < length; i++) {
												
												var value = response.data.Attachments.results[i];
												var attachmentUrl = response.data.Attachments.results[i].Url;
												var URL = value.__metadata.media_src;
												
												if(attachmentUrl == "")
													attachmentUrl = URL;
												
												
												
												var o = {
													name : value.Name,
													size : value.fileSize,
													url :  cus.crm.opportunity.util.Formatter.urlConverter(attachmentUrl),
													uploadedDate : 
															value.CreatedAt,
													contributor : value.CreatedBy,
													fileExtension : cus.crm.opportunity.util.Formatter
															.mimeTypeFormatter(value.MimeType),
													fileId : value.DocumentId,
													media_src : value.__metadata.media_src

												};
												data.OpportunityAttachments
														.push(o);
											}

											that
													.byId('fileupload')
													.setModel(
															new sap.ui.model.json.JSONModel(
																	data));

										});

					
					},
					
					txHistoryTabSelected : function(){
                        
						var oModel = this.oModel;
						var headerGuid = this.byId('info').getModel('json').getData().Guid;
						var sPath = "/Opportunities(guid'" + headerGuid
						+ "')/DocumentHistory";
						var that = this;
						oModel.read(
										sPath,
										null,
										null,
										true,
										jQuery.proxy(function(odata,response) {
															
															this.newResult = response.data.results;
															var tab = that
																	.getView()
																	.byId(
																			"DocHistory_Tab");
															
															var oJSONModel = tab.getModel("json");
															var oData = oJSONModel.oData;
															oData.OpportunityDocHistory = response.data.results;
															oJSONModel.updateBindings();
													
														}, this),jQuery.proxy(function(oError){this.handleErrors(oError)},this));
					
					},
					
					_saveETag : function(sETag){
						this.sETag = sETag;
					},
					
					//for displaying error message
					onErrorMsg : function(oEvent){
						this.showErrorMsgFragment.open();
					},
					onOKParticipantDialog : function(oEvent) {

						//Check depending on mode,Multi Select:Is to Add Partners,Songle Select For Edit in Item Level
						if (this.participantsF4MultiselectFragment.getContent()[0]
								.getPages()[1].getContent()[0].getMode() == "MultiSelect") {

							if (this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp")) {
								this.oModel.clearBatch();
								var changeSet = [];
								var headerGuid = this.byId('info').getModel(
										'json').getData().Guid;
								var oEntry;

								var aPartnerTypes = this.participantsF4MultiselectFragment
										.getModel("json").getProperty(
												"/PartnerFunctions");
								for ( var int2 = 0; int2 < aPartnerTypes.length; int2++) {

									if (this.participantsF4MultiselectFragment
											.getModel(
													"SelectedPartnerCategoryTemp")
											.getProperty(
													"/"
															+ aPartnerTypes[int2].PartnerFunctionName)) {

										var items = this.participantsF4MultiselectFragment
												.getModel(
														"SelectedPartnerCategoryTemp")
												.getProperty(
														"/"
																+ aPartnerTypes[int2].PartnerFunctionName);

										for ( var i = 0; i < items.length; i++) {
											oEntry = {
												HeaderGuid : headerGuid,
												PartnerNumber : items[i].key,
												PartnerFunctionCode : aPartnerTypes[int2].PartnerFunctionCode
											};
											changeSet
													.push(this.oModel
															.createBatchOperation(
																	"OpportunitySalesTeamSet",
																	"POST",
																	oEntry,
																	null));
										}

									}
								}

								if (changeSet.length > 0) {
									sap.ca.ui.utils.busydialog.requireBusyDialog();
									this.release=true;
									this.oModel
											.addBatchChangeOperations(changeSet);
									this.oModel
											.submitBatch(
													jQuery
															.proxy(
																	function(
																			oResponses) {

																		if (this.participantsF4MultiselectFragment
																				.getModel("SelectedPartnerCategoryTemp")) {

																			this.participantsF4MultiselectFragment
																					.getModel(
																							"SelectedPartnerCategoryTemp")
																					.destroy();
																		}
																		this
																				.getParticipants();

																	}, this),
													jQuery
															.proxy(
																	function(
																			oError) {
																		this
																				.handleErrors(oError);
																	}, this));
								}
							}
						} else {
							var itemSelected=this.participantsF4MultiselectFragment
							.getContent()[0].getPages()[1].getContent()[0].getSelectedItem();
							
							
								sap.ca.ui.utils.busydialog.requireBusyDialog();
								this.release=true;
								

								var oCurrentPartner = this.itemToDelete;
								var oCurrentRule = this
										.getRuleForPartnerFunction(oCurrentPartner.PartnerFunctionCode);

								var partner = this.partnerDeterminationMap[this.transactionType];
								var partnerCategory;
								for ( var k = 0; k < partner.length; k++) {
									if (partner[k].PartnerFunctionCode == oCurrentPartner.PartnerFunctionCode) {
										partnerCategory = partner[k].PartnerFunctionCategory;
									}

								}
								var countLow = oCurrentRule.CountLow;
								if (this.participantsF4MultiselectFragment
										.getContent()[0]._sSelectedPartnerCategoryCode != partnerCategory) {

									if (this
											.getCountForPartnerFunction(oCurrentPartner.PartnerFunctionCode) - 1 < countLow) {

										if (countLow === 1) {
											sap.ca.ui.message
													.showMessageToast(this.oResourceBundle
															.getText(
																	'MUST_HAVE_PARTICIPANTS_1',
																	[ countLow ]));
										} else {
											sap.ca.ui.message
													.showMessageToast(this.oResourceBundle
															.getText(
																	'MUST_HAVE_PARTICIPANTS',
																	[ countLow ]));
										}
										return;
									}
								}

								var headerGuid = this.byId('info').getModel(
										'json').getData().Guid;
								var sPath = [
										"OpportunitySalesTeamSet(HeaderGuid=guid'",
										headerGuid, "',PartnerNumber='",
										oCurrentPartner.PartnerNumber,
										"',PartnerFunctionCode='",
										oCurrentPartner.PartnerFunctionCode,
										"')" ].join("");

//								this.oModel.remove(sPath,null,jQuery.proxy(function() {
//									this.getParticipants();this.oModel.refresh();
//
//																	if (oCurrentPartner&& oCurrentPartner.PartnerFunctionCode === "00000015")
//																		sap.ui.getCore().getEventBus().publish(
//																						"cus.crm.opportunity",
//																						"contactDeleted",
//																						{
//																							contextPath : "Opportunities(guid'"
//																									+ headerGuid
//																									+ "')"
//																						});
//
//																}, this),
//												jQuery.proxy(function(oError) {
//
//													this.handleErrors(oError);
//
//												}, this));

								this.oModel.clearBatch();
								var changeSet = [];
								var headerGuid = this.byId('info').getModel(
										'json').getData().Guid;
								var oEntry;
								var partnerFunctionCode = this.participantsF4MultiselectFragment
										.getContent()[0]._sSelectedPartnerCategoryCode;

								var aPartnerTypes = this.participantsF4MultiselectFragment
										.getModel("json").getProperty(
												"/PartnerFunctions");
								
								
								var partneFunctionCodeValue;
								for ( var int3 = 0; int3 < aPartnerTypes.length; int3++) {
									if(aPartnerTypes[int3].PartnerFunctionCategory==partnerFunctionCode){
										partneFunctionCodeValue=aPartnerTypes[int3].PartnerFunctionCode;
									
									}
								}
								oEntry = {
									HeaderGuid : headerGuid,
									PartnerNumber : itemSelected
											.getDescription(),
									PartnerFunctionCode : partneFunctionCodeValue
								};
								if(itemSelected
										.getDescription()){
								this.oModel.addBatchChangeOperations([this.oModel
																		.createBatchOperation(
																				"OpportunitySalesTeamSet",
																				"POST", oEntry, null)]);
								
								this.oModel.addBatchChangeOperations([this.oModel
																		.createBatchOperation(
																				sPath,
																				"DELETE")]);
									
									

								    
									this.oModel
											.addBatchChangeOperations(changeSet);
									this.oModel.submitBatch(jQuery.proxy(
											function(oResponses) {

												this.getParticipants();

											}, this), jQuery.proxy(function(
											oError) {
										this.handleErrors(oError);
									}, this));
									
								}
							

							

						}
						this.participantsF4MultiselectFragment.close();
						var oNavCont = this.participantsF4MultiselectFragment
								.getContent()[0];
						oNavCont.to(this.participantsF4MultiselectFragment
								.getContent()[0].getPages()[0]);
						
						

					
					},
					getCountForPartnerFunctionCode : function(
							sPartnerFunctionCode) {

						var count = 0;
						var participantsCollection = this.byId('Sales_Team')
								.getModel('json').getData().OpportunitySalesTeamSet;

						for ( var i = 0; i < participantsCollection.length; i++) {
							var partner = this.partnerDeterminationMap[this.transactionType];
							var partnerCategory;
							for ( var k = 0; k < partner.length; k++) {
								if (partner[k].PartnerFunctionCode == participantsCollection[i].PartnerFunctionCode) {
									partnerCategory = partner[k].PartnerFunctionCategory;
								}

							}
							if (partnerCategory === sPartnerFunctionCode) {
								count++;
							}

						}

						return count;
					},
					onSelectParticipantMinMax : function(oEvent) {

						
						
						this.unSelect="";
						// Reading Selected Items Count
						if (this.lastSelectedItem == oEvent.getParameters().listItem
								.getDescription())
							this.lastSelectedItem = oEvent.getParameters().listItem
									.getDescription();

						var PartnerFunctionCode, index, currentPartnerFunctionCode, currentPartnerFunctionName;
						if (this.participantsF4MultiselectFragment.getContent()[0]
								.getPages()[1].getContent()[0].getMode() == "MultiSelect") {

							currentPartnerFunctionCode = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0].getContent()[0]
									.getSelectedItem()
									.getBindingContext('json').getObject().PartnerFunctionCode;
							currentPartnerFunctionName = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0].getContent()[0]
									.getSelectedItem()
									.getBindingContext('json').getObject().PartnerFunctionName;
							if(this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp"))
							
			         				if(!oEvent.getParameters().selected){
			         					var itemUnchecked=oEvent.getParameters().listItem.getDescription();
			         					var items = this.participantsF4MultiselectFragment
										.getModel("SelectedPartnerCategoryTemp")
										.getProperty("/" + currentPartnerFunctionName);

								for ( var k = 0; k < items.length; k++) {
									if (items[k].key == itemUnchecked) {
										this.participantsF4MultiselectFragment
												.getModel("SelectedPartnerCategoryTemp")
												.getProperty(
														"/" + currentPartnerFunctionName)
												.splice(k, 1);
									}
								}
								}
							
							
							
							

							var selectParticipants = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0].getContent()[0];
							index = selectParticipants
									.indexOfItem(selectParticipants
											.getSelectedItem());
							if (index > -1)
								var selectedPartnerFunction = this.participantsF4MultiselectFragment
										.getModel('json').getData().PartnerFunctions[index];

							PartnerFunctionCode = selectedPartnerFunction.PartnerFunctionCategory;

						}

						var oldItems = this.byId('Sales_Team').getModel('json').oData.OpportunitySalesTeamSet;
						var partner = this.partnerDeterminationMap[this.transactionType];
						var competitor=true;
						for ( var x = 0; x < oldItems.length; x++) {
							if(oldItems[x].PartnerFunctionText=="Competitor")
								competitor=false;
								
							
						}
						if(this.byId('tab_competitor'))
						var competitorList=this.byId('tab_competitor').getModel('json').getData();
						if(competitor)
						for ( var y = 0; y < competitorList.Competitors.results.length; y++) {
							
							for ( var k = 0; k < partner.length; k++) {
								if(partner[k].PartnerFunctionName=="Competitor"){
									
									oldItems.push({
										PartnerName:competitorList.Competitors.results[y].PartnerName,
										PartnerNumber:competitorList.Competitors.results[y].PartnerNumber,
										PartnerFunctionText:"Competitor",
										PartnerDetermineProcedure: partner[k].PartnerDetermineProcedure,
										PartnerFunctionCategory: partner[k].PartnerFunctionCategory,
										PartnerFunctionCode: partner[k].PartnerFunctionCode});
									
								competitor=false;
								}
								}
						}
						
						if(competitor)
						this.oModel
						.read(
								this.sPath,
								null,
								[ "$expand=Competitors" ],
								false,
								jQuery
										.proxy(
												function(odata,
														response) {
													
													
													for ( var j = 0; j < odata.Competitors.results.length; j++) {
														
														
														for ( var k = 0; k < partner.length; k++) {
															if(partner[k].PartnerFunctionName=="Competitor"){
																
																oldItems.push({
																	PartnerName:odata.Competitors.results[j].PartnerName,
																	PartnerNumber:odata.Competitors.results[j].PartnerNumber,
																	PartnerFunctionText:"Competitor",
																	PartnerDetermineProcedure: partner[k].PartnerDetermineProcedure,
																	PartnerFunctionCategory: partner[k].PartnerFunctionCategory,
																	PartnerFunctionCode: partner[k].PartnerFunctionCode});
																};
																
																
																
															}
															
															
														}
														
														
														
													
													
													

												}, this), jQuery
										.proxy(this.handleErrors,
												this));
			
					

						if (oEvent) {
							var selectedItemName = oEvent.getParameters().listItem
									.getTitle();
							var selectedItem = oEvent.getParameters().listItem
									.getDescription();

							if (this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[1].getContent()[0]
									.getMode() == "SingleSelectLeft") {

								PartnerFunctionCode = this.participantsF4MultiselectFragment
										.getContent()[0]._sSelectedPartnerCategoryCode;
								this.participantsF4MultiselectFragment
										.getModel('json').getData().PartnerFunctions = this.partnerDeterminationMap[this.transactionType];

								var PartnerFunctionList = this.participantsF4MultiselectFragment
										.getModel('json').getData().PartnerFunctions;
								for ( var k = 0; k < PartnerFunctionList.length; k++) {
									if (PartnerFunctionList[k].PartnerFunctionCategory == PartnerFunctionCode)
										index = k;

								}

							}

							for ( var i = 0; i < oldItems.length; i++) {

								var partner = this.partnerDeterminationMap[this.transactionType];
								var partnerCategory;
								for ( var k = 0; k < partner.length; k++) {
									if (partner[k].PartnerFunctionCode == oldItems[i].PartnerFunctionCode) {
										partnerCategory = partner[k].PartnerFunctionCategory;
									}

								}

								if (oldItems[i].PartnerNumber == selectedItem
										&& partnerCategory == PartnerFunctionCode) {
									this.unSelect="unselect";
									sap.m.MessageToast
											.show(
													this.oResourceBundle
															.getText(
																	'PARTICIPANT_EXISTS',
																	[
																			selectedItemName,
																			currentPartnerFunctionName ]),
													{
														duration : 3500
													});

									oEvent.getParameters().listItem
											.setSelected(false);

									return;
								}
							}

						}

						var numberInParticipantsTab = this
								.getCountForPartnerFunctionCode(PartnerFunctionCode);

						

						// Reading Min And Max Values
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
									.getProperty("/" + currentPartnerFunctionName))
							numberOfSelecteditems=this.participantsF4MultiselectFragment
							.getModel("SelectedPartnerCategoryTemp")
							.getProperty("/" + currentPartnerFunctionName).length;
						}
						if( this.participantsF4MultiselectFragment
								.getContent()[0].getPages()[1].getContent()[0].getMode()=="MultiSelect"){

						if (numberOfSelecteditems + numberInParticipantsTab >= CountHigh) {
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
						}else {
							this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getFooter().getContentRight()[0].setEnabled(true);
						}

					
					},
					onCancelParticipantDialog : function(oEvent) {
						if (this.participantsF4MultiselectFragment.getContent()[0]
								.getPages()[1].getContent()[0].getMode() != "SingleSelectLeft") {
							// To Remove Focus On Selected
							if (this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[1].getId() == oEvent
									.getSource().getParent().getParent()
									.getId()) {

								this.participantsF4MultiselectFragment
										.getContent()[0].getPages()[0]
										.getContent()[0].getSelectedItem()
										.setSelected(false);

							}

							// To Remove Temp Data
							if (this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp")) {

								this.participantsF4MultiselectFragment
										.getModel("SelectedPartnerCategoryTemp")
										.destroy();
							}
						} else {

							if (this.participantsF4MultiselectFragment
									.getModel("PartnersBasedonType")) {

								this.participantsF4MultiselectFragment
										.getModel("PartnersBasedonType")
										.destroy();
							}

						}

						var oNavCont = this.participantsF4MultiselectFragment
								.getContent()[0];
						oNavCont.to(this.participantsF4MultiselectFragment
								.getContent()[0].getPages()[0]);
						this.participantsF4MultiselectFragment.close();
					},
					onNavBack : function(oEvent) {
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[1].getSubHeader().getContentLeft()[0].clear();

						if (this.participantsF4MultiselectFragment.getContent()[0]
								.getPages()[1].getContent()[0].getMode() != "SingleSelectLeft") {

							var sSelectedCategory = this.participantsF4MultiselectFragment
									.getContent()[0]._sSelectedPartnerCategory;

							// Storing Temp Values
							var oSelectedPartnerModel;
							if (this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp")) {
								
							
							oSelectedPartnerModel = this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp");
							}
//							var oListPartner = this.participantsF4MultiselectFragment
//									.getContent()[0].getPages()[1].getContent()[0], aEmployeeIds = [];
//
//							for ( var i = 0; i < oListPartner
//									.getSelectedItems().length; i++) {
//								aEmployeeIds.push({
//									key : oListPartner.getSelectedItems()[i]
//											.getDescription(),
//									value : oListPartner.getSelectedItems()[i]
//											.getTitle()
//								});
//							}
//							oSelectedPartnerModel.setProperty("/"
//									+ sSelectedCategory, aEmployeeIds);
							// Set the count
							var count = 0;
							if(this.participantsF4MultiselectFragment
									.getModel("SelectedPartnerCategoryTemp"))
							if(oSelectedPartnerModel.getProperty("/"+sSelectedCategory))
							count =count+oSelectedPartnerModel.getProperty("/"+sSelectedCategory).length;
							
							
							var oListPartnerFct = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0].getContent()[0];
							if (count != 0) {
								oListPartnerFct.getSelectedItem()
										.setInfo(count);
							} else if (oListPartnerFct.getSelectedItem()) {
								oListPartnerFct.getSelectedItem().setInfo(" ");
							}
							oListPartnerFct.getSelectedItem()
									.setSelected(false);

							// navigate to search page
							var oNavCont = this.participantsF4MultiselectFragment
									.getContent()[0];
							oNavCont._sSelectedPartnerCategoryAndParticipants = oSelectedPartnerModel;
							oNavCont.to(this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0]);
							// }
						} else {
							var countInfo = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0].getContent()[0]
									.getItems();
							if (countInfo.length > 0)
								for ( var k = 0; k < countInfo.length; k++) {
									countInfo[k].setInfo(" ");
									countInfo[k].setSelected(false);
								}
							var sSelectedCategory = this.participantsF4MultiselectFragment
									.getContent()[0]._sSelectedPartnerCategoryText;

							if (this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[1].getContent()[0]
									.getSelectedItem()) {

								var selectedItem = this.participantsF4MultiselectFragment
										.getContent()[0].getPages()[1]
										.getContent()[0].getSelectedItem();
								this.participantsF4MultiselectFragment
										.getContent()[0].getPages()[1]
										.getContent()[0].getSelectedItem()
										.setSelected(false);

							}

							if (this.participantsF4MultiselectFragment
									.getContent()[0].PartnerKey
									&& !selectedItem) {

								var selectedItem = this.participantsF4MultiselectFragment
										.getContent()[0].PartnerKey;
							}
							var selectParticipants = this.participantsF4MultiselectFragment
									.getContent()[0];
							this.participantsF4MultiselectFragment.getModel(
									'json').getData().PartnerFunctions = this.partnerDeterminationMap[this.transactionType];
							this.participantsF4MultiselectFragment.getModel(
									'json').updateBindings();

							var partnersList = this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0].getContent()[0]
									.getItems();
							for ( var k = 0; k < partnersList.length; k++) {
								partnersList[k].setSelected(false);
							}

							var oNavCont = this.participantsF4MultiselectFragment
									.getContent()[0];
							oNavCont.PartnerKey = selectedItem;
							oNavCont.to(this.participantsF4MultiselectFragment
									.getContent()[0].getPages()[0]);

						}

					},

					closeErrorMsg : function(oEvent) {
						this.showErrorMsgFragment.close();
					},
					
refreshMsgLog: function(bShowInfoTab){
						
						this.oModel
						.read(
								this.sPath,
								null,
								[ "$expand=Products,ChangeDocs,Competitors,OpportunityLogSet" ],
								true,
								jQuery
										.proxy(
												function(odata,
														response) {
													this
															.bindInfoAndProducts(response.data);

												}, this), jQuery
										.proxy(this.handleErrors,
												this));
			
					}

					
					
					
				});
