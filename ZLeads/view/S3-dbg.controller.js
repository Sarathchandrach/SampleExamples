/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cus.crm.lead.util.formatter");
jQuery.sap.require("cus.crm.lead.util.schema");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("cus.crm.lead.util.Util");


sap.ca.scfld.md.controller.BaseDetailController
.extend(
		"cus.crm.lead.view.S3",
		{
			Origins : [],
			Priorities : [],
			QualificationsLevels : [],
			bAcceptLead : false,
			bRejectLead : false,
			sHeaderGuid : "",
			nLeads : 0,
			bAppLaunched : true,
			navToOtherApp : false,
			partnerFunctionMap : {},
			partnerDeterminationMap : {},
			//['json>fullName','json>contactID'],formatter : 'cus.crm.lead.util.formatter.formatDescription'
			accountListItemTemplate : new sap.m.ObjectListItem(	{title : '{json>name1}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>accountID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>accountID}'})),
		    
		    
		    contactListItemTemplate : new sap.m.ObjectListItem({title : '{json>fullName}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>contactID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>contactID}'})),
			
		    
		
			employeeListItemTemplate : new sap.m.ObjectListItem({title : '{json>fullName}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>employeeID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>employeeID}'})),
			onInit : function() {
				this.fullScreenMode = false;
				// execute the onInit for the base class
				// BaseDetailController
				sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
				.call(this);
				
				//using css padding alone 
				jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.lead.css.Leads",".css"),"sap-ui-theme-sap.crm");
				
				//i18n models and resource bundles
				this.oI18nModel = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel;
				this.oResourceBundle = this.oI18nModel.getResourceBundle();
			
				
				//odata model 
				this.oModel = this.getView().getModel();
				
				//changing the model to json to make s3 view independent of s2 view
				this.getView().setModel(new sap.ui.model.json.JSONModel());
				 
				//add custom data to the participants tab, the s3Controller 
				this.byId('salesteam').addCustomData(new sap.ui.core.CustomData({key : 'controller', value : this}));
				
				//TODO : interoperability 
				this.sBackendVersion = cus.crm.lead.util.schema
				._getServiceSchemaVersion(this.oModel,
						"Lead");
		        this.oVersioningModel = new sap.ui.model.json.JSONModel({});
				this._loadVersionSpecificUI(this.sBackendVersion);			
				//fragments - contact dialog & change logs 
				this.contactF4Fragment  =  new sap.ui.xmlfragment(this.createId("contactF4_S3"), 'cus.crm.lead.fragment.ContactF4', this);
				this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
				this.contactF4Fragment.setModel(this.oI18nModel,'i18n');
				  	
			     this.changeLogFragment = new sap.ui.xmlfragment(this.createId("changeLog_S3"), 'cus.crm.lead.fragment.ChangeLog', this);
				 this.changeLogFragment.setModel(new sap.ui.model.json.JSONModel());
				 this.changeLogFragment.setModel(this.oI18nModel,'i18n');
				  	
					
				  	
				//setting named json models - for individual tabs of icon tab filter - salesteam, info, products & header
				this.byId('salesteam').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('info').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('Product_Tab').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('S3_Header').setModel(new sap.ui.model.json.JSONModel(),"json");
				
				
				/*this.byId('ChangeLog').setModel(new sap.ui.model.json.JSONModel(),"json");*/
				
				//setting a named json model
				this.getView().setModel(new sap.ui.model.json.JSONModel(),"json");
				
				var oFileUpload = this.byId('fileupload');
				var sUrlParams = this.getView().getModel().sUrlParams;
				//if upload enabled, must set xsrf token
				//and the base64 encodingUrl service for IE9 support!
				if (oFileUpload.getUploadEnabled()) {
				oFileUpload.setXsrfToken(this.getXsrfToken());
				oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams
				: ''));
				}
			
				//navigation pattern match callback - detail pattern for s3
				this.oRouter
				.attachRouteMatched(
						this.routeMatched, this);

				
			
				
			},
			
			/**
			* gets the Xsrf token if it exists, if not, request it explicitly
			**/
			getXsrfToken: function() {
			var sToken = this.oModel.getHeaders()['x-csrf-token'];
			if (!sToken) {
			this.oModel.refreshSecurityToken(
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
			
			
			_loadVersionSpecificUI : function(sBackendVersion){
							
				if(parseFloat(sBackendVersion) >= 2){
					//Wave 4 and above
	 			    this._loadWave4UI();
				}
                
				else{
					//Wave 3 and below
					 this._loadWave3UI();
				}
				
				
			},
		
		   _loadWave3UI : function(){
			 
			   //i18n text key for sales team
			   this.oVersioningModel.getData().sParticipantsNoDataTextKey  = 'NO_CONTACTS';
			   this.oVersioningModel.getData().setHeaderTextForParticipants = jQuery.proxy(function(response) {},this);
			   //sales team tab - add contact button that allows to add contacts to the sales team
			   this.byId('salesTeam').insertContent(new sap.m.Button({
				   text : "{i18n>ADDCONTACT}",
				   icon : "sap-icon://add",
				   press : jQuery.proxy(this.addContact,this),
				   type : "Transparent",
			   }),0);
		   },
		   
		   _loadWave4UI : function(){
			 
			   //i18n text key for participants
			   this.oVersioningModel.getData().sParticipantsNoDataTextKey  = 'NO_PARTICIPANTS1';
			   this.oVersioningModel.getData().setHeaderTextForParticipants = jQuery.proxy(function(response) {
				   
				   this.byId('salesteam').getHeaderToolbar().getContent()[0].setText(this.oResourceBundle.getText('PARTICIPANTS',[response.data.SalesTeam.results.length]));
					
			   },this);
			   //employee responsible to be added at the object header 
			   this.byId('S3_Header').addAggregation("attributes",new  sap.m.ObjectAttribute(
					                                              {  text : "{json>/EmployeeResponsibleName}",
					                                            	 active : true,
					                                            	 press :  jQuery.proxy(this.onEmpBusCardLaunch,this),
					                                            	 customData : [new sap.ui.core.CustomData({key : "PartnerNumber", value : "{json>/EmployeeResponsibleNumber}"}),
					                                            	               new sap.ui.core.CustomData({key : "PartnerFunctionCode", value : "00000014"}),
					                                            	 			   new sap.ui.core.CustomData({key : "Image", value : "{json>/ContactImgSrc}"}),
					                                            	 			   new sap.ui.core.CustomData({key : "Imager", value : "{json>/ImgSrc}"}),
					                                            	             ]
					                                                
					                                              }));
			   
			  //participants tab - add contact button now becomes the add participants - a title "Participants (count)" gets added    
			   this.byId('salesteam').setHeaderToolbar(new sap.m.Toolbar({
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
		
			/* Add Note handling:Changes in Notes Tab with the FeedInput control*/
			_handleAddNote : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				if (sValue) {
			    var that = this;	
				var oModel = this.oModel;
				var headerGuid = this.byId('info').getModel('json').getData().Guid;
				var oEntry = {
						HeaderGuid : headerGuid,
						Content : sValue

				};
				
				oModel.create('/LeadNotes',
						oEntry,
						null,
						jQuery.proxy(function() {
						    var that = this;
							oModel.read( that.sPath, null, [ "$expand=Notes" ],true, function(odata,response){
								
								that.byId('listItem').setModel(new sap.ui.model.json.JSONModel({LeadNotes : odata.Notes.results}),"json");
								
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


			selectedTab : function(oControlEvent) {

				
				var oModel = this.oModel;
				//   
				var tab_selection = oControlEvent.getSource().getSelectedKey();

								var that = this;
								
								
				// EXTENSION POINT 
				/**
				* @ControllerHook extHookCustomTabSelectHandler is the controller hook that provides for extension of newly added custom tabs
				* 
				* @callback sap.ca.scfld.md.controller.BaseDetailController~extHookCustomTabSelectHandler
				* 
				* @param {string}
				*            tab_selection
				* @return {void}
				*/
				if (this.extHookCustomTabSelectHandler){
				       this.extHookCustomTabSelectHandler(tab_selection);
					}
				var that = this;
				if (tab_selection == "Product") {
										}
				
	//Changes in Notes Tab  with the FeedInput control-On Tab selection
				if (tab_selection == "Notes") {
					
					this.byId("listItem").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
					this.byId('listItem').getModel('json').setData({LeadNotes : []});
				
								
					oModel.read(
							this.sPath,
							null,
							[ "$expand=Notes" ],
							true,
							jQuery.proxy(function(odata, response) {
								var tab = this.getView().byId("listItem");
								var jsonModel = new sap.ui.model.json.JSONModel();
							var	data = {LeadNotes : response.data.Notes.results};
							if(data.LeadNotes.length == 0)
							{
							that.byId("listItem").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_NOTES'));
							}
							
												
							jsonModel.setData(data);
								tab.setModel(jsonModel,"json")
								   
								  

							},this),
							jQuery.proxy(function(oError){
								
								this.handleErrors(oError);
							},this));
				}


				if (tab_selection == "Attachment") {

					
					var headerGuid = this.byId('info').getModel('json').getData().Guid;

                    // get the list to set the post url param   
                    var that = this.getView();
                    var file = that.byId("fileupload");
                    if(file.getEditMode() == true){
                    	
                    	file.setEditMode(false);
                    }
                    
                    //refresh to get xcsrf Token
                    oModel.refreshSecurityToken();
                    
                    // get token
                    var oModelHeaders = oModel.getHeaders();
                    file.setXsrfToken(oModelHeaders['x-csrf-token']);
                    
                    // remove - from guid
                    var nheaderGuid = headerGuid.replace(/-/g, '');
                    //set custom header
                    file.setCustomHeader("slug",nheaderGuid);

					oModel.read(this.sPath,null,[ "$expand=Attachments" ],true,
							function(odata, response) {

								var data = {LeadsAttachments : [] };
								var length = response.data.Attachments.results.length;
								var i;
								for (i = 0; i < length; i++) {
									var value = response.data.Attachments.results[i];
									var attachmentUrl = response.data.Attachments.results[i].Url;
									var URL = value.__metadata.media_src ;
								//	URL = URL.replace(/^https:\/\//i, 'http://');
									var o = {
											name : value.Name,
											size : value.fileSize,
											url :  (attachmentUrl === "") ? URL : attachmentUrl,
											uploadedDate :cus.crm.lead.util.formatter.formatDate(value.CreatedAt),
											contributor : value.CreatedBy,
											fileExtension : cus.crm.lead.util.formatter.mimeTypeFormatter(value.MimeType),
											fileId : value.DocumentID , 
											media_src : value.__metadata.media_src
									};
									data.LeadsAttachments.push(o);
								}

								that.byId('fileupload').setModel(new sap.ui.model.json.JSONModel(data));
							},jQuery.proxy(this.handleErrors,this));

				}
			// when parties involved is selected
				if (tab_selection == "Team") {
					var	data;
					var oLogo = [];
					var that =this;
					if(parseFloat(this.sBackendVersion) >= 2.0){
						//partner determination only vaild from wave 4 onwards
						
						
					if(parseFloat(this.sBackendVersion) >= 4){
						//the game changes a bit from wave 7 onwards
						var oUTIL = cus.crm.lead.util.Util;
						if(oUTIL.getPartnerFunctions() === null){
							oUTIL.fetchPartnerFunctions(this.oModel);
						}
						
						this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
					}	
					else{
						//wave 4 and above - uptill wave 6
					if(!this.partnerDeterminationMap[this.transactionType]){
						
						this.oModel.read("LeadPartnerFctTypes",null,["TransactionType='" + this.transactionType +"'"],false,jQuery.proxy(function(odata,response){
		            		
		            		this.partnerDeterminationMap[this.transactionType] = response.data.results;
		            	},this),jQuery.proxy(function(oError){
		            		
		            		this.handleErrors(oError);
		            	},this));
					
					}
					this.partnerFunctionMap = {};
					}
					}
					this.byId("salesteam").setNoDataText(this.oResourceBundle.getText('LOADING_TEXT'));
					this.byId('salesteam').getModel('json').setData({LeadSalesTeamSet : []});
					oModel.read(this.sPath,null,[ "$expand=SalesTeam" ], true,
							function(odata, response) {
								var tab = that.getView().byId("salesteam");
								var jsonModel = new sap.ui.model.json.JSONModel();
								
								data = { LeadSalesTeamSet : response.data.SalesTeam.results };
								
								that.oVersioningModel.getData().setHeaderTextForParticipants(response);
							 if(data.LeadSalesTeamSet.length == 0)
								{
								
								that.byId("salesteam").setNoDataText(that.oResourceBundle.getText(that.oVersioningModel.getData().sParticipantsNoDataTextKey));
								}
							 
							 var aBatchReads = [];
							
							 	for(var i = 0; i<data.LeadSalesTeamSet.length; i++)
							 		{
							 		var accountID = data.LeadSalesTeamSet[i].PartnerNumber ; 
							 		var sPath = "/AccountCollection('" + accountID + "')?$expand=Logo";
							 		oLogo[i]=  "sap-icon://person-placeholder";
							 		aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       
							 		
							 			
							 		};
							
							 		oModel.addBatchReadOperations(aBatchReads);
									oModel.submitBatch(jQuery.proxy(function(oResponses){
										for(var j = 0; j<data.LeadSalesTeamSet.length; j++)
										{
											if(oResponses.__batchResponses[j].data && oResponses.__batchResponses[j].data.Logo && oResponses.__batchResponses[j].data.Logo.__metadata.media_src   )
											{  var oMetadata = oResponses.__batchResponses[j].data.Logo.__metadata.media_src ? oResponses.__batchResponses[j].data.Logo.__metadata.media_src : "sap-icon://person-placeholder";
											var  URl = oMetadata;
											oLogo[j] = URl.toString();
											}

											data.LeadSalesTeamSet[j].ImgSrc = oLogo[j];	
										}

										jsonModel.setData(data);
										tab.setModel(jsonModel,"json");

									},this),jQuery.proxy(function(oError){

															sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));


																},this),true);});	
				}
			},

			getParticipants : function(){

				var	data;
				var oLogo = [];
				var that =this;
				this.partnerFunctionMap = {};
				this.byId("salesteam").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				this.byId('salesteam').getModel('json').setData({LeadSalesTeamSet : []});
				this.oModel.read(this.sPath,null,[ "$expand=SalesTeam" ], true,
						function(odata, response) {
					
					        that.bindS3Header(response.data);
							var tab = that.getView().byId("salesteam");
							var jsonModel = new sap.ui.model.json.JSONModel();
						
							
							data = { LeadSalesTeamSet : response.data.SalesTeam.results };
							that.oVersioningModel.getData().setHeaderTextForParticipants(response);
						 if(data.LeadSalesTeamSet.length == 0)
							{
							
							that.byId("salesteam").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));
							}
						 
						 var aBatchReads = [];
						
						 	for(var i = 0; i<data.LeadSalesTeamSet.length; i++)
						 		{
						 		var accountID = data.LeadSalesTeamSet[i].PartnerNumber ; 
						 		var sPath = "/AccountCollection('" + accountID + "')?$expand=Logo";
						 		oLogo[i]=  "sap-icon://person-placeholder";
						 		aBatchReads.push(that.oModel.createBatchOperation(sPath,"GET"));       
						 		
						 			
						 		};
						
						 		that.oModel.addBatchReadOperations(aBatchReads);
								that.oModel.submitBatch(jQuery.proxy(function(oResponses){
									for(var j = 0; j<data.LeadSalesTeamSet.length; j++)
									{
										if(oResponses.__batchResponses[j].data && oResponses.__batchResponses[j].data.Logo && oResponses.__batchResponses[j].data.Logo.__metadata.media_src   )
										{  var oMetadata = oResponses.__batchResponses[j].data.Logo.__metadata.media_src ? oResponses.__batchResponses[j].data.Logo.__metadata.media_src : "sap-icon://person-placeholder";
										var  URl = oMetadata;
										oLogo[j] = URl.toString();
										}
										

										data.LeadSalesTeamSet[j].ImgSrc = oLogo[j];	
									}

									jsonModel.setData(data);
									tab.setModel(jsonModel,"json");

								},this),jQuery.proxy(function(oError){

														sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));


															},this),true);});	
			
			},
			onUploadFile : function(oResponse){
				
				var oFile ;
				if (oResponse.getParameters() && oResponse.getParameters().d)
					oFile = oResponse.getParameters().d;
					else
					oFile= oResponse.getParameters();
				
                //get uloaded data
              //  var oFile = oResponse.getParameter("d");
                //in url replace https to http
                if(oFile.__metadata.media_src)
                    var URL = oFile.__metadata.media_src;
    				else 
    				var URL = oFile.url;
               // URL = URL.replace(/^https:\/\//i, 'http://');
                
                //date in correct formate
                var date = parseInt((oFile.CreatedAt).substr(6));
                var fName = decodeURIComponent(oFile.Name);
                

                //set the object
                var object = {
                       
                              "fileExtension" :cus.crm.lead.util.formatter.mimeTypeFormatter(oFile.MimeType),
                              "contributor" : oFile.CreatedBy,
                              "uploadedDate" :cus.crm.lead.util.formatter.formatDate(new Date(date)),
                              "name": fName,
                              "url": URL,
                              "size": oFile.fileSize,
                              "fileId" : oFile.DocumentID,
                             
                       
                };
                              
                
                //commit change
                this.byId('fileupload').commitFileUpload(object);
                
                },
                
                onDeleteFile: function(oEvent){
                	 
                	var Parameters = oEvent.getParameters();
                      var URL = Parameters.media_src;
                      var removStartVal;
                      if(!URL)
                   removStartVal = Parameters.url.split("(").pop();
                      else 
                    	  removStartVal = URL.split("(").pop();
                      var sPath = "LeadAttachments(";
                      var url = sPath + removStartVal ;
                      this.oModel.remove(url);
                     //removing the file from the UI
                      this.byId('fileupload').removeFile(Parameters.fileId);
                
                	
                },
			
			
			onAttachmentSelected : function(oEvent) {
				var selectedAttachment = oEvent
				.getParameter('listItem').getBindingContext()
				.getObject();
				var win = window.open(
						selectedAttachment.__metadata.media_src,
				'_blank');
				win.focus();

			},

			onEmployeeLaunchheader : function(oEvent)
			{ 
				var contactId = oEvent.getSource().data("PartnerNumber");
				var sPath = "/AccountCollection('" + contactId + "')";
		    	var  oLogo=  "sap-icon://person-placeholder";
		    	 
		    	var oModel = this.oModel;
		    	oModel.read(sPath, null, ["$expand=Logo"], false, function (odata, response) {
		            jQuery.sap.log.info("oData account response");
		            if (odata.Logo && odata.Logo.__metadata) {

		                var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src: "sap-icon://person-placeholder";

		                var URl = oMetadata.replace(/^https:\/\//i, 'http://'); 
		                oLogo = URl.toString();

		            }

		        });

		       var oModel = this.oModel;

				var accountId = this.byId('info').getModel('json').getData().ProspectNumber;
				var event = oEvent.getSource();
				//var PartnerFunctionCode = oEvent.getSource().data("PartnerFunctionCode");
				var Image = oLogo;
		        
				if (accountId && contactId) {
					this.AccountId = accountId;
					this.ContactId = contactId;
					
					var sPath = "/ContactCollection(accountID='"+accountId+"',contactID='"+contactId+"')?$expand=WorkAddress,Account,Account/MainAddress,Account/MainContact,Account/MainContact/WorkAddress";
					 
					var aBatchReads = [];
					
						aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       



					oModel.addBatchReadOperations(aBatchReads);
					
					
					oModel.submitBatch(jQuery.proxy(function(oResponses){
						
						var data = { Value : "" } ;
						data.Value = oResponses.__batchResponses[0].data ; 
						
						
						var fnCallbackNavPara = jQuery.proxy(function(oEvent){
							 
							var oNavConfig = {};
							oNavConfig.target = {};
							oNavConfig.target.semanticObject = "ContactPerson";
							oNavConfig.target.action = "MyContacts";
							oNavConfig.params = { accountID : this.AccountId,
												 contactID : this.ContactId, };
							this.navToOtherApp = true;
							 	
							return oNavConfig;
                           
                        
						
                        
						 
					 },this);
						
						
						
						if(data.Value.Account){     
						if(data.Value.Account.MainContact){
							if(data.Value.Account.MainContact.WorkAddress){
								if(data.Value.WorkAddress){
									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
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
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : Image,
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//Only Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(oEvent.getSource());
									}                                                                                                      
								}
								//work address is null and check main address
								else{

									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//work address and Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,

												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									} 


								}

							}
							//main contact's work address is null and check work address and main address
							else{
								if(data.Value.WorkAddress){

									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
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
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//main contact's work address is null and  Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}                                                                                                      


								}
								//work address is null and main contacts work address is also null , check for main address
								else{


									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//main contacts work address is null and work address and Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,

												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									} 



								}
							}

						}
						//account != null and maincontact is null and so is main contact's work address and work address and main address

						//main contact's work address is null and check work address and main address
						else{
							if(data.Value.WorkAddress){

								if(data.Value.Account.MainAddress){
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
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
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",
												companyphone : data.Value.Account.MainAddress.phone,
											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								}
								//Only Mainaddress is null
								else{
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,
											contactmobile : data.Value.WorkAddress.mobilePhone,
											contactphone : data.Value.WorkAddress.phone,
											contactemail : data.Value.WorkAddress.email,
											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",

											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								}                                                                                                      


							}
							//
							else{


								if(data.Value.Account.MainAddress){
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,
											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											companyaddress : data.Value.Account.MainAddress.address,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",
												companyphone : data.Value.Account.MainAddress.phone,

											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								}
								//work address and Mainaddress is null
								else{
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,

											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",


											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								} 



							}
						}

					}
						
						else {
							sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT_IS_NULL_S3'));
						}
							
					},this),jQuery.proxy(
							function(oError){

								//sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));	
								sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));

							},this),true);
					
					
				}
				
				else
					{
					sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));	
					
					}
			},
			onEmpBusCardLaunch : function(oEvt){
				
				if (oEvt.getSource().data("PartnerNumber") !== '') {
					var sPath = "/EmployeeCollection('" + oEvt.getSource().data("PartnerNumber") + "')";
					var sURLparameters = "$expand=WorkAddress,Company,Photo";
							
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
							var oMetadata = cus.crm.lead.util.formatter.formatPhotoUrl(odata.Photo.__metadata.media_src);
							oPhoto = cus.crm.lead.util.formatter.urlConverter(oMetadata);
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
			
			onEmployeeLaunch : function(oEvent) {
				
				if(oEvent.getSource().data("PartnerFunctionCode") === "00000014"){
					this.onEmpBusCardLaunch(oEvent);
					return;
				}
				
				
				var oModel = this.oModel;

				var accountId = this.byId('info').getModel('json').getData().ProspectNumber;
				var event = oEvent.getSource();

				var contactId = oEvent.getSource().data("PartnerNumber");
				var PartnerFunctionCode = oEvent.getSource().data("PartnerFunctionCode");
				var Image = oEvent.getSource().data("Image");

				if (PartnerFunctionCode == "00000015") {
					var    data;
					if (accountId && contactId) {
						
						this.AccountId = accountId;
						this.ContactId = contactId;
						
						var sPath = "/ContactCollection(accountID='"+accountId+"',contactID='"+contactId+"')?$expand=WorkAddress,Account,Account/MainAddress,Account/MainContact,Account/MainContact/WorkAddress";
						 
						var aBatchReads = [];
						
							aBatchReads.push(oModel.createBatchOperation(sPath,"GET"),o);       



						oModel.addBatchReadOperations(aBatchReads);
						
						
						oModel.submitBatch(jQuery.proxy(function(oResponses){
							
							var data = { Value : "" } ;
							data.Value = oResponses.__batchResponses[0].data ; 
							
							var fnCallbackNavPara = jQuery.proxy(function(oEvent){
								 
								var oNavConfig = {};
								oNavConfig.target = {};
								oNavConfig.target.semanticObject = "ContactPerson";
								oNavConfig.target.action = "MyContacts";
								oNavConfig.params = { accountID : this.AccountId,
													 contactID : this.ContactId, };
								this.navToOtherApp = true;
								 	
								return oNavConfig;
	                           
							 
						 },this);
							
							
							if(data.Value.Account){     
							if(data.Value.Account.MainContact){
								if(data.Value.Account.MainContact.WorkAddress){
									if(data.Value.WorkAddress){
										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
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
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : Image,
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//Only Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactmobile : data.Value.WorkAddress.mobilePhone,
													contactphone : data.Value.WorkAddress.phone,
													contactemail : data.Value.WorkAddress.email,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(oEvent.getSource());
										}                                                                                                      
									}
									//work address is null and check main address
									else{

										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													companyaddress : data.Value.Account.MainAddress.address,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//work address and Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,

													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										} 


									}

								}
								//main contact's work address is null and check work address and main address
								else{
									if(data.Value.WorkAddress){

										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
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
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//main contact's work address is null and  Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactmobile : data.Value.WorkAddress.mobilePhone,
													contactphone : data.Value.WorkAddress.phone,
													contactemail : data.Value.WorkAddress.email,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}                                                                                                      


									}
									//work address is null and main contacts work address is also null , check for main address
									else{


										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													companyaddress : data.Value.Account.MainAddress.address,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//main contacts work address is null and work address and Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,

													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										} 



									}
								}

							}
							//account != null and maincontact is null and so is main contact's work address and work address and main address

							//main contact's work address is null and check work address and main address
							else{
								if(data.Value.WorkAddress){

									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
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
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//Only Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}                                                                                                      


								}
								//
								else{


									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,

												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//work address and Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,

												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",


												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									} 



								}
							}

						}
							else{
							sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT_IS_NULL_S3'));
							}
						},this),jQuery.proxy(
								function(oError){

									//sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));
									sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));


								},this),true);
						
						
					}
					
					else
						{
						sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));	
						
						}
					
				}
				
				
				else if (PartnerFunctionCode == "00000021") {
					this.accountNum = accountId;
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
					
						
				}

				//Nither a contact or account
				else {

					sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('BCARD_ONLY_FOR_CONTACTS'));
				}

			},

		onLogChange : function(oEvent) {
				/*var appImpl = sap.ca.scfld.md.app.Application.getImpl();
				var oModel = this.oModel;
				var data;
				this.changeLogFragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'))
				this.changeLogFragment.getModel().setData({LeadChangeDocs : []});
				var that = this;
				oModel.read(
						that.sPath,
						null,
						[ "$expand=ChangeDocs" ],
						true,
						function(odata, response) {
							
								data  = {LeadChangeDocs : response.data.ChangeDocs.results};
								that.changeLogFragment.getModel().setData(data)
								if(data.LeadChangeDocs.length == 0){ 
									that.changeLogFragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_LOG'))
								}

						},jQuery.proxy(this.handleErrors,this));
				*/
				this.changeLogFragment.open(oEvent);

			},

			onCancelLogChange : function(oEvent) {

				this.changeLogFragment.close();

			},
			
			
			showContactF4 : function(oEvent)
			{
				
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];
				var searchText = this.contactF4Fragment.getSubHeader().getContentLeft()[0].getValue();
				if(this.HeaderObject.ProspectNumber != "")
					{
					toolbar.setVisible(true);
				     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + this.HeaderObject.ProspectName);
				     this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
				     this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,
				    		   ["$filter=substringof'" + searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
				    		 {
				    	        this.contactF4Fragment.getModel('json').setData({ 
				                            ContactCollection : response.data.results 	        		
				    	        });
				    	        if(response.data.results.length === 0)
				    	        	  this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    	      
				    		 },this),jQuery.proxy(function(oError)
				    	        {
				    	        	this.contactF4Fragment.getModel('json').setData({
				    	        		
				    	        		ContactCollection : []
				    	        	});
				    	        	this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    	        },this));
				
				    	 
				    		 }
				    
				else
					{
				    toolbar.setVisible(false);
				    this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
				    this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
				    		 {
				    	      
				    	  this.contactF4Fragment.getModel('json').setData({ 
		                      ContactCollection : response.data.results 	        		
			        });
				    	  if(response.data.results.length === 0)
				    	  this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    		 },this),jQuery.proxy(function(oError)
				    	        {
				    			  this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    	        	
				    	        },this));
				    
					}
				
				//this.byId('dialogContactF4').open();
				
				this.contactF4Fragment.open();
				
				
				
			},
			
			addContact: function(){
				
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];
				var Lead_Data =this.byId('info').getModel('json').getData();
				if(Lead_Data.ProspectNumber != "")
					{
					toolbar.setVisible(true);
				     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + Lead_Data.ProspectName);
				     
				     this.oModel.read("/AccountCollection(accountID='" + Lead_Data.ProspectNumber + "')/Contacts",null,null,true,jQuery.proxy(function(odata,response)
				    		 {
				    	        this.contactF4Fragment.getModel('json').setData({ 
				                            ContactCollection : response.data.results 	        		
				    	        });
				    	      
				    		 },this),jQuery.proxy(function(oError)
				    	        {
				    	        	this.contactF4Fragment.getModel('json').setData({
				    	        		
				    	        		ContactCollection : []
				    	        	});
				    	        	
				    	        },this));
				
				    		 }
				    
				else
					{
				    toolbar.setVisible(false);
				    this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
				    		 {
				    	      
				    	  this.contactF4Fragment.getModel('json').setData({ 
		                      ContactCollection : response.data.results 	        		
			        });
				    	     
				    		 },this),function(oError)
				    	        {
				    	        	
				    	        	
				    	        });
				    
					}
				
				//this.byId('dialogContactF4').open();
				
				this.contactF4Fragment.open();
				
			},
			
			searchParticipants  : function(){
			    var selectParticipants = this.participantsF4Fragment.getContent()[0];
			    this.participantsF4Fragment.getBeginButton().setEnabled(false);
			    selectParticipants.fireChange({selectedItem : selectParticipants.getSelectedItem()});
			},
			onPartnerFunctionChange : function(oEvent){
			 
			    this.checkMinMaxRules(null);
			   
				var curPartnerFunctionCategory = oEvent.getParameter('selectedItem').getKey();
				var curPartnerFunctionName = oEvent.getParameter('selectedItem').getText();
				var searchText = this.participantsF4Fragment.getContent()[1].getValue();
				 this.participantsF4Fragment.getBeginButton().setEnabled(false);
				this.participantsF4Fragment.getContent()[2].setNoDataText(this.oResourceBundle.getText("LOADING"));
				this.participantsF4Fragment.getContent()[1].setPlaceholder(this.oResourceBundle.getText('SEARCH_PARTICIPANTS'));
				switch(curPartnerFunctionCategory){
			
				case "0005" : 
				case "0008" :	 
			         //Employee Responsible partner function - fire Employees Collection 
					this.oModel.read("EmployeeCollection",null, ["$filter=substringof('" + searchText + "',fullName)" ],false,jQuery.proxy(function(odata,response){
						
						this.participantsF4Fragment.getModel('json').getData().Employees = response.data.results;
						this.participantsF4Fragment.getModel('json').updateBindings();
						this.participantsF4Fragment.getContent()[2].bindItems("json>/Employees",this.employeeListItemTemplate,null,[]);
					},this),jQuery.proxy(function(oError){},this));
					break;
					
				case "0007" : 
					//Contact partner function - fire Contact collection
	            this.oModel.read("ContactCollection",null, ["$filter=substringof('" + searchText + "',fullName)"],false,jQuery.proxy(function(odata,response){
						
						this.participantsF4Fragment.getModel('json').getData().Contacts = response.data.results;
						this.participantsF4Fragment.getModel('json').updateBindings();
						this.participantsF4Fragment.getContent()[2].bindItems("json>/Contacts",this.contactListItemTemplate,null,[]);
					},this),jQuery.proxy(function(oError){},this));
					break;
					
				default : 	
				  
					 //fire Account Collection 
	            this.oModel.read("AccountCollection",null, [ "$filter=substringof('" + searchText + "',name1)"],false,jQuery.proxy(function(odata,response){
						
						this.participantsF4Fragment.getModel('json').getData().Accounts = response.data.results;
						this.participantsF4Fragment.getModel('json').updateBindings();
						this.participantsF4Fragment.getContent()[2].bindItems("json>/Accounts",this.accountListItemTemplate,null,[]);
					},this),jQuery.proxy(function(oError){},this));
					break;
				}
				
				this.participantsF4Fragment.getContent()[2].setNoDataText(this.oResourceBundle.getText("NO_PARTICIPANTS"));
				
				
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
				
			
			getCountForPartnerFunction : function(sPartnerFunctionCode){
				
				var count = 0;
				var participantsCollection  = this.byId('salesteam').getModel('json').getData().LeadSalesTeamSet;
				
				for(var i = 0; i<participantsCollection.length;i++){
					if(participantsCollection[i].PartnerFunctionCode === sPartnerFunctionCode){
						count++;
					}
					
				}
				
				return count;
			},
			
			checkMinMaxRules : function(oEvent){
			    
				//to check if a participant of specific participant type is already added
                var currentPartnerFunctionCode = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionCode;
                var currentPartnerFunctionName= this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionName;
                var oldItems = this.byId('salesteam').getModel('json').oData.LeadSalesTeamSet;
               
                if(oEvent){
                       var selectedItemName = oEvent.getParameters().listItem.getTitle();
                    var selectedItem=oEvent.getParameters().listItem.data("ID");
                                
                for ( var i = 0; i < oldItems.length; i++)
                {
                if (oldItems[i].PartnerNumber == selectedItem && oldItems[i].PartnerFunctionCode == currentPartnerFunctionCode)
                {
                       sap.m.MessageToast.show(this.oResourceBundle.getText('PARTICIPANT_EXISTS',[selectedItemName,currentPartnerFunctionName]),{
                              duration : 3500});
                       oEvent.getParameters().listItem.setSelected(false);
                       return;
                }
                }
                   
                }
				//checks the selection in the participants list against the customizing for the partner function
				var numberSelected = this.participantsF4Fragment.getContent()[2].getSelectedItems().length;
				var oCurrentRule = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject();
				var numberInParticipantsTab = this.getCountForPartnerFunction(oCurrentRule.PartnerFunctionCode);
				
				if(numberSelected + numberInParticipantsTab > oCurrentRule.CountHigh){
					//Too many participants for the current partner function
					if(oEvent){
					oEvent.getParameters().listItem.setSelected(false);
					}
					if(oCurrentRule.CountHigh === 1){
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_MANY_PARTICIPANTS_1',[oCurrentRule.CountHigh]),{
							duration : 3500
						});
					}
					else{
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_MANY_PARTICIPANTS',[oCurrentRule.CountHigh]),{
							duration : 3500
						});
					}
					this.enableAddParticipantsButton();
					return;
				}
				if(numberSelected + numberInParticipantsTab < oCurrentRule.CountLow){
					//Too few participants for the current partner function
					
					if(oCurrentRule.CountLow === 1){
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_FEW_PARTICIPANTS',[oCurrentRule.CountLow]),{
							duration : 3500
						});
					}
					else{
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_FEW_PARTICIPANTS',[oCurrentRule.CountLow]),{
							duration : 3500
						});
					}
					this.enableAddParticipantsButton();
					return;
					
				}
				this.enableAddParticipantsButton();
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
				var sPath = ["LeadSalesTeamSet(HeaderGuid=guid'",this.headerGuid,"',PartnerNumber='",oCurrentPartner.PartnerNumber,"',PartnerFunctionCode='",oCurrentPartner.PartnerFunctionCode,"')"].join("");
				
				this.oModel.remove(sPath,null,jQuery.proxy(function(){
					
					this.getParticipants();
					this.getDataForDetailScreen(false);
					this.oModel.refresh();
					
				},this),jQuery.proxy(function(oError){
					
					
					this.handleErrors(oError);
					
				},this));
				
				
			},
			getRuleForPartnerFunction : function(sPartnerFunctionCode){
				
				for(var i = 0; i < this.partnerDeterminationMap[this.transactionType].length; i++){
					if(this.partnerDeterminationMap[this.transactionType][i].PartnerFunctionCode === sPartnerFunctionCode){
						return this.partnerDeterminationMap[this.transactionType][i];
					}
				}
				return null;
			},
    showParticipantsF4: function(){
				var selectParticipants;
	            if(!this.participantsF4Fragment){
	            	this.participantsF4Fragment  =  new sap.ui.xmlfragment(this.createId("participantsF4_S3"), 'cus.crm.lead.fragment.ParticipantsF4', this);
					this.participantsF4Fragment.setModel(new sap.ui.model.json.JSONModel({}),"json");
					this.participantsF4Fragment.setModel(this.oI18nModel,'i18n');
					
					//attach change event 
					var selectParticipants = this.participantsF4Fragment.getContent()[0]; 
					selectParticipants.attachChange(null,this.onPartnerFunctionChange,this);
					
	            }
	            
	            selectParticipants = this.participantsF4Fragment.getContent()[0];
	             this.participantsF4Fragment.getBeginButton().setEnabled(false);
	            //bind the customizing of partner functions 
				this.participantsF4Fragment.getModel('json').getData().PartnerFunctions = this.partnerDeterminationMap[this.transactionType];
                this.participantsF4Fragment.getModel('json').updateBindings();
               
                if(selectParticipants.getItems().length > 0){
	            selectParticipants.setSelectedItem(selectParticipants.getItems()[0]);
	            selectParticipants.fireChange({selectedItem : selectParticipants.getItems()[0]});
	            }
				this.participantsF4Fragment.open();
				
			},
			addParticipants : function(){
			    
			
				this.oModel.clearBatch();
				var changeSet = [];
				var currentPartnerFunctionCode = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionCode;
				var headerGuid =  this.byId('info').getModel('json').getData().Guid;
				var items = this.participantsF4Fragment.getContent()[2].getSelectedItems();
				var oEntry;
				
				for(var i = 0; i<items.length;i++){
					    oEntry = {
					    		HeaderGuid : headerGuid,
					    		PartnerNumber : items[i].data("ID"),
					    	    PartnerFunctionCode : currentPartnerFunctionCode
					    
					    };
			    		    
				      	changeSet.push(this.oModel.createBatchOperation("LeadSalesTeamSet","POST",oEntry,null));
				}
				
				if(changeSet.length > 0){
					this.oModel.addBatchChangeOperations(changeSet);
					this.oModel.submitBatch(jQuery.proxy(function(oResponses){
						
						this.getParticipants();
						this.getDataForDetailScreen(false);
						this.participantsF4Fragment.getContent()[2].removeSelections();
						this.participantsF4Fragment.getContent()[1].clear();
						this.participantsF4Fragment.close();
				       
						this.handleAddParticipantsBatchResponses(oResponses);
						
					},this),jQuery.proxy(function(oError){
						
						this.handleErrors(oError);
						
					},this));
				}
			},

			setContact : function(oEvent)
			{
				
				var oModel = this.oModel;
				this.oSelectedContact = oEvent.getParameter('listItem').getBindingContext('json').getObject();
				
				var headerGuid = this.byId('info').getModel('json').getData().Guid;

				
				
				oModel.refreshSecurityToken();
				oModel.update("LeadSalesTeamSet(PartnerNumber='"+this.oSelectedContact.contactID+"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+headerGuid+"')",{

					HeaderGuid  : headerGuid,
					PartnerNumber : this.oSelectedContact.contactID,
					PartnerFunctionCode : '00000015'

				},{
					fnSuccess : jQuery.proxy(function()
					{	
                        this.contactF4Fragment.getSubHeader().getContentLeft()[0].clear();
						var	data;
						var oLogo = [];
						var that =this;
						this.getParticipants();
						cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);


					},this),
					
					fnError : jQuery.proxy(function (oError){
						if(oError.response.statusCode === 412){
                      		 
                      		 cus.crm.lead.util.Util.show412ErrorDialog(this,
                      	jQuery.proxy(function(){
                      			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this); 
                      		 },this));
                      		 
                      		 return;
                      	 }
                           this.handleErrors(oError);
					},this),
					bMerge : true


				});
				this.contactF4Fragment.getContent()[0].removeSelections();
				this.contactF4Fragment.close();
				 
			},
					closeToolbar : function(oEvent)
			{
				
				this.contactF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
				this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
				this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
						{
					       this.contactF4Fragment.getModel('json').setData({
					    	   ContactCollection :  response.data.results
					    	   });
					       if(response.data.results.length === 0)
					    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
					    	   
						},this),
						jQuery.proxy(function(oError)
						{
							this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
							this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
							 
						},this));
							
			},
			
		
			closeContactF4 : function(oEvent)
			{	
				
				this.contactF4Fragment.close();
				this.contactF4Fragment.getSubHeader().getContentLeft()[0].clear();
			},
			closeParticipantsF4 : function(oEvent)
			{
				this.participantsF4Fragment.getContent()[2].removeSelections();
				this.participantsF4Fragment.getContent()[1].clear();
				this.participantsF4Fragment.close();
			},


			searchContact : function(oEvent)
			{
			    var searchText;
			    var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
			    toolbar.setVisible(false);
			    var oEventParameters = oEvent.getParameters();
			    if(oEventParameters.hasOwnProperty("newValue"))
			    	{
			    	searchText = oEventParameters.newValue;
			    	if(searchText.length < 4)
			    		return;
			    	}
			    else
			    	searchText = oEventParameters.query;
				this.contactF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
				this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
			    this.oModel.read("ContactCollection",null,{"filter" : "fullName eq '"+searchText+"'"},true,jQuery.proxy(function(odata,response)
						{
					       this.contactF4Fragment.getModel('json').setData({
					    	   ContactCollection :  response.data.results
					    	   });
					       if(response.data.results.length === 0)
					    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
						},this),
						jQuery.proxy(function(oError)
						{
							this.contactF4Fragment.getModel('json').setData({
								
								ContactCollection : []
								
							});
							 this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
						},this));
				
			},
			
			cliked : function(oEvent) {

				var acID = this.getView().byId("acsheet2");

				acID.openBy(oEvent.getSource());

			},

			onEdit : function() {
				var ctx = this.sPath;
				var ctx1 = this.byId('info').getModel('json').getData().Guid;
				
				var that = this;
				
				var oModel = this.oModel;
				
				this.sBackendVersion = cus.crm.lead.util.schema._getServiceSchemaVersion(this.oModel,"Lead");
				
				if(parseFloat(this.sBackendVersion) >= 3){
				oModel.read("EditAuthorizationCheck", null, {
					ObjectGuid :oModel.formatValue(ctx1,
					"Edm.Guid")},
						false, function(oData, resp){
							if(resp.data.EditAuthorizationCheck.ActionSuccessful == "X"){
								if(!that.fullScreenMode)
								{
								that.oRouter.navTo("edit", {
									contextPath : ctx
								}, !jQuery.device.is.phone);
								
								}
							else
								{
								that.oRouter.navTo("editFullScreen", {
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
					that.oRouter.navTo("edit", {
						contextPath : ctx
					}, !jQuery.device.is.phone);
					
					}
				else
					{
					that.oRouter.navTo("editFullScreen", {
						contextPath : ctx
					}, !jQuery.device.is.phone);
					
					}
				}
				
					},
			_refresh : function(channel, eventType, data) {
				sap.ca.scfld.md.controller.BaseDetailController.prototype._refresh
				.apply(this, [ channel, eventType, data ]);

			
			},

			onAccept : function() {
				
				sap.ca.ui.dialog.confirmation.open({
					question :this.oResourceBundle.getText('CONFIRM_LEAD_ACCEPT',[this.byId('info').getModel('json').getData().Description]),
					title : this.oResourceBundle.getText('S3_POSITIVE'),
					confirmButtonLabel : this.oResourceBundle.getText('OK')  	
					
				},jQuery.proxy(this.acceptLead,this));
				

		},

			acceptLead :function(oResult) {
				if(oResult.isConfirmed ===false)
					return;
				this.oModel.bRefreshAfterChange = true;
				this.bAcceptLead = true;
				
				var oModel = this.oModel;
				var id = this.byId('info').getModel('json').getData().Id;
			//	this.s2Controller.byId('list').getBinding('items').attachChange(this.s2Controller.leadAccepted,this.s2Controller);
				
				oModel.create("AcceptLead", null,
						{
					success : 
					        jQuery.proxy(function() {
					        	
					        	   
					        		this.oModel.bRefreshAfterChange = false;	
					        		this.oModel.refresh();
						            this.byId('accept').setVisible(false);
					 	            this.byId('reject').setVisible(false);
						            this.byId('edit').setVisible(true);
						            this.getDataForDetailScreen(true);

					                 },this),
					error :                  
					       jQuery.proxy(function(oError) {
						                 this.handleErrors(oError);
						                 this.bAcceptLead  = false;
						                 this.oModel.bRefreshAfterChange = false;
					                    },this),
					async : true,
					urlParameters : ["ObjectId='" + id + "'"]
						}
				);
			},

			onReject : function() {
				sap.ca.ui.dialog.confirmation.open({
					question :this.oResourceBundle.getText('CONFIRM_LEAD_REJECT',[this.byId('info').getModel('json').getData().Description]),
					title : this.oResourceBundle.getText('S3_NEGATIVE'),
					confirmButtonLabel : this.oResourceBundle.getText('OK')  	
					
				},jQuery.proxy(this.rejectLead,this));
			
			},

			rejectLead : function(oResult) {
				if(oResult.isConfirmed ===false)
					return;
				this.oModel.bRefreshAfterChange = true;
				this.bRejectLead = true;
				
				var oModel = this.oModel;
				var id = this.byId('info').getModel('json').getData().Id;
			//	this.s2Controller.byId('list').getBinding('items').attachChange(this.s2Controller.leadRejected,this.s2Controller);
				oModel.create("RejectLead",null,
						{
					success : jQuery.proxy(function() {
					        this.oModel.refresh();
							this.oModel.bRefreshAfterChange = false;
							
					},this),
					error :jQuery.proxy(function(oError) {
						this.handleErrors(oError);
						this.bRejectLead = false;
						 this.oModel.bRefreshAfterChange = false;	
					},this),
					async : true,
					urlParameters : ["ObjectId='" + id + "'"]
						}
				);

			},
			cancelPopupAccept : function() {
				this.byId("accept1").close();
			},

			cancelPopupReject : function() {
				this.byId("reject1").close();
			},
			navToEmpty : function() {
				this.oRouter.navTo("noData");
			},

			onBeforeRendering : function()
			{
				
				
				this.getView().getModel('controllers').getData().s3Controller = this;
			
				if( this.byId('info') && this.byId('info').getModel('json'))
					{
					var oHeader = this.byId('info').getModel('json').getData();
					
				if( oHeader.SystemStatusCode == 'I1002' && oHeader.EmployeeResponsibleNumber === this.EmployeeForUser){
					this.byId('accept').setVisible(true);
					this.byId('reject').setVisible(true);
					this.byId('edit').setVisible(false); 
				

				}
				else /*if( this.byId('info').getModel('json').getData().SystemStatusCode == 'I1003')*/{
					this.byId('accept').setVisible(false);
					this.byId('reject').setVisible(false);
					this.byId('edit').setVisible(true);
				

				}
				
					}
			},
             navBack : function(oEvent)
             {
            	 
            	 this.oRouter.navTo("master");
            	 
             },
             
             handleErrors : function(oError)
             {
            	// sap.ca.ui.utils.busydialog.releaseBusyDialog();
            	 jQuery.sap.log.error(JSON.stringify(oError));
            	 if(oError.hasOwnProperty("message") && oError.hasOwnProperty("response")){
            	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : oError.message,
					    details: (typeof oError.response.body == "string") ? oError.response.body : JSON.parse(oError.response.body).error.message.value
					},function(oResult){});
		    	
            	 }
            	 
             },
            handleCustomizationBatchResponses : function(oResponses)
            {
            
            	var errorMessage = "";
                var errorTitle = "";
            	var bFail = false;
            	if(oResponses.__batchResponses[0].statusCode === "200"){
					this.Origins = oResponses.__batchResponses[0].data.results;
					this.Origins.splice(0, 0, {
						LanguageCode : "",
						OriginCode : "",
						OriginText : ""
					});
					}
					else{
						
						bFail = true;
						errorTitle = oResponses.__batchResponses[0].statusText;
						errorMessage = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value +"\n";						
						this.Origins.push([{
							LanguageCode : "",
							OriginCode : "",
							OriginText : ""
							
						}]);
					}
						
					if(oResponses.__batchResponses[1].statusCode === "200"){
					this.Priorities = oResponses.__batchResponses[1].data.results;
					this.Priorities.splice(0, 0, {
						LanguageCode : "",
						PriorityCode : "",
						PriorityText : ""
					});
					}
					else
						{
						
						   bFail = true;
						   errorTitle = oResponses.__batchResponses[1].statusText;
						   errorMessage = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value +"\n";
						   this.Priorities.push([{
						    	
						    	LanguageCode : "",
						    	PriorityCode : "",
						    	PriorityText : ""
						    	
						    }]);
						
						}
					if(oResponses.__batchResponses[2].statusCode === "200"){
					this.QualificationsLevels = oResponses.__batchResponses[2].data.results;
					this.QualificationsLevels.splice(0,
							0, {
						LanguageCode : "",
						QualificationCode : "",
					});
					}
					else 
						{
						   bFail = true;
						   errorTitle = oResponses.__batchResponses[2].statusText;
						   errorMessage = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value +"\n";
						    this.QualificationsLevels.push([{
						    	
						    	LanguageCode : "",
						    	QualificationCode : ""
						    	
						    }]);
						 
						}
				
					if(bFail){
						// sap.ca.ui.utils.busydialog.releaseBusyDialog();
	            	 jQuery.sap.log.error(errorMessage);
	            	  sap.ca.ui.message.showMessageBox({
						    type: sap.ca.ui.message.Type.ERROR,
						    message : errorTitle,
						    details: errorMessage
						},function(oResult){});
					}
            	
            	
            },
            handleExpandBatchResponse : function(oResponses)
            {
            	
            	
            	
            	
            },
            
            getDataForDetailScreen : function(bShowInfoTab)
            {
            	
            	//if the app is launched read the data for drop downs - customzing data
            //	var prospectNumber = this.oModel.getContext("/" + sPath).getObject().ProsectNumber;
            	
            	
            	if(parseFloat(this.sBackendVersion) >= 4){
            		var s4Controller = this.getView().getModel("controllers").getData().s4Controller;
            		
            		if(s4Controller && s4Controller.bSuccessSave){
            			delete s4Controller.bSuccessSave;
            		}
            		else{
            			//fetch ETag if we are not navigating into this page from the edit page
            			
            			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
            		}
            	}
            	if(this.bAppLaunched)
            		{
            	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Origins","GET")]);
            	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Priorities","GET")]);
            	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("QualificationsLevels","GET")]);
 	            	   if(this.sBackendVersion >= 4.0){
 	            		  this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("EmployeeForUserSet","GET")]);
 	            		  
 	            	   }
 	            	   else{
 	            		  this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("EmployeeForUser","GET")]);
 	            	   }
            	       
            	//expand products
            	this.oModel.addBatchReadOperations([this.oModel.createBatchOperation(this.sPath+"?$expand=Products,ChangeDocs","GET")]);
            	
            	
            	if(parseFloat(this.sBackendVersion)  >= 4){
            		var oUTIL = cus.crm.lead.util.Util;
           		  if(oUTIL.getPartnerFunctions() === null){
           			  this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("PartnerFunctions","GET")]);
           		  }
            	}
            	
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

            	this.oModel.submitBatch(jQuery.proxy(this.handleBatchResponses,this),jQuery.proxy(this.handleErrors,this));
                this.bAppLaunched = false;
            		}
            	else
            		this.oModel.read(this.sPath,null,["$expand=Products,ChangeDocs"],true,jQuery.proxy(function(odata,response)
            				{
            			           this.bindInfoAndProducts(response.data,bShowInfoTab);
            			
            				},this),jQuery.proxy(this.handleErrors,this));
            	
            	// EXTENSION POINT 
				/**
				 * @ControllerHook extHookGetAdditionalData is the controller hook to fetch additional data and bind it in the 
				 *                 detail screen. 
				 * 
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookGetAdditionalData
				 * 
				 * @return {void}
				 */
				if (this.extHookGetAdditionalData){
					this.extHookGetAdditionalData();
				}
            	
            },
            
            handleBatchResponses : function(oResponses)
            {
            	//batch responses from initial launch of s3 view
            	var bFail = false;
                var errorTitle= "";
                var errorMessage= "";
               
            		this.bAppLaunched = false;
                	if(oResponses.__batchResponses[0].statusCode === "200"){
    					this.Origins = oResponses.__batchResponses[0].data.results;
    					this.Origins.splice(0, 0, {
    						LanguageCode : "",
    						OriginCode : "",
    						OriginText : ""
    					});
    					}
    					else{
    						
    						bFail = true;
    						errorTitle = oResponses.__batchResponses[0].statusText;
    						errorMessage = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value +"\n";						
    						this.Origins.push([{
    							LanguageCode : "",
    							OriginCode : "",
    							OriginText : ""
    							
    						}]);
    					}
    						
    					if(oResponses.__batchResponses[1].statusCode === "200"){
    					this.Priorities = oResponses.__batchResponses[1].data.results;
    					this.Priorities.splice(0, 0, {
    						LanguageCode : "",
    						PriorityCode : "",
    						PriorityText : ""
    					});
    					}
    					else
    						{
    						
    						   bFail = true;
    						   errorTitle = oResponses.__batchResponses[1].statusText;
    						   errorMessage = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value +"\n";
    						   this.Priorities.push([{
    						    	
    						    	LanguageCode : "",
    						    	PriorityCode : "",
    						    	PriorityText : ""
    						    	
    						    }]);
    						
    						}
    					if(oResponses.__batchResponses[2].statusCode === "200"){
    					this.QualificationsLevels = oResponses.__batchResponses[2].data.results;
    					this.QualificationsLevels.splice(0,
    							0, {
    						LanguageCode : "",
    						QualificationCode : "",
    					});
    					}
    					else 
    						{
    						   bFail = true;
    						   errorTitle = oResponses.__batchResponses[2].statusText;
    						   errorMessage = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value +"\n";
    						    this.QualificationsLevels.push([{
    						    	
    						    	LanguageCode : "",
    						    	QualificationCode : ""
    						    	
    						    }]);
    						 
    						}
    					if(oResponses.__batchResponses[3].statusCode === "200"){
    						if(this.sBackendVersion >= 4.0){
    							this.EmployeeForUser = oResponses.__batchResponses[3].data.results[0].EmployeeResponsibleNumber;
    						}
    						else{
    							this.EmployeeForUser = oResponses.__batchResponses[3].data.EmployeeForUser.EmployeeResponsibleNumber;
    						}
        					
        					}
        					else 
        						{
        						   bFail = true;
        						   errorTitle = oResponses.__batchResponses[3].statusText;
        						   errorMessage = JSON.parse(oResponses.__batchResponses[3].response.body).error.message.value +"\n";
        						    this.QualificationsLevels.push([{
        						    	
        						    	LanguageCode : "",
        						    	QualificationCode : ""
        						    	
        						    }]);
        						 
        						}
    					if(bFail){
    						// sap.ca.ui.utils.busydialog.releaseBusyDialog();
    	            	// jQuery.sap.log.error(JSON.stringify(oError));
    	            	  sap.ca.ui.message.showMessageBox({
    						    type: sap.ca.ui.message.Type.ERROR,
    						    message : errorTitle,
    						    details: errorMessage
    						},function(oResult){var i = 0;i++;});
    					}
    			  if(oResponses.__batchResponses[4].hasOwnProperty("data"))
            	     this.bindInfoAndProducts(oResponses.__batchResponses[4].data,true);
    			  else
    				  this.handleErrors(oResponses.__batchResponses[4]);
    			  
    			  
    			  if(parseFloat(this.sBackendVersion) >= 4){
    			  if(oResponses.__batchResponses[5] && oResponses.__batchResponses[5].hasOwnProperty("data")){
    				  
    				   var oUTIL = cus.crm.lead.util.Util;
    				   oUTIL.aggregatePartnerFunctions(oResponses.__batchResponses[5].data.results);
    				   this.partnerDeterminationmap  =  oUTIL.getPartnerFunctions();
    				   
    			  }
    			  else{
    				  this.handleErrors(oResponses.__batchResponses[5]);
    			  }
    			  }
    			// EXTENSION POINT 
    				/**
    				 * @ControllerHook extHookHandleBatchResponses extHookHandleBatchResponses is the controller
					 *                 hook to handle the response of additional customizing fetch during application launch 
    				 * 
    				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookHandleBatchResponses
    				 * 
    				 * @param {object}
    				 *            oResponses
    				 * @return {void}
    				 */
    				if (this.extHookHandleBatchResponses){
    					this.extHookHandleBatchResponses(oResponses);
    				}
             
            },
            
            bindS3Header : function(data){
            	
            	var s3Header = this.byId('S3_Header');
            	   var sPath = "/AccountCollection('" + data.ProspectNumber + "')";
                  	var oLogo=  "sap-icon://person-placeholder";
   		            this.oModel.read(sPath, null, ["$expand=Logo"], false, function (odata, response) {
   		                jQuery.sap.log.info("oData account response");
   		                if (odata.Logo && odata.Logo.__metadata) {
   		                   
   		                    var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src: "sap-icon://person-placeholder";
   		                    
   		                   /* var URl = oMetadata.replace(/^https:\/\//i, 'http://');*/ 
   		                    oLogo = oMetadata.toString();
   		                  
   		                }
   		                data.ImgSrc = oLogo;
   		                if(s3Header && s3Header.getModel('json'))
   	                    	s3Header.getModel('json').setData(data);
   		              
   		         
   		            },jQuery.proxy(this.handleErrors,this));
            },
            bindInfoAndProducts : function(data,bShowInfoTab)
            {
            	//bind data fetched to info, products tab and header too 
            	
            	var infoTab = this.byId('info');
            	var productsTab = this.byId('Product_Tab');
            	
            	//save the header guid at the controller level
            	this.headerGuid = data.Guid;
            	
            	//save the transaction type of the lead at the controller level as well
            	this.transactionType = data.ProcessType;
            	
            	if(infoTab && infoTab.getModel('json'))
            		infoTab.getModel('json').setData(data);
            
            	if(productsTab && productsTab.getModel('json'))
            		productsTab.getModel('json').setData({Products : data.Products.results});
            	
            	//if there aren't any results, hide the products tab
            	if(data.Products.results.length === 0)
            		this.byId('icntab').getItems()[1].setVisible(false);
            	else
            		this.byId('icntab').getItems()[1].setVisible(true);
            	
            	if(data.ChangeDocs.results.length === 0)
            		this.byId('changelog').setVisible(false);
            	else{
            		this.byId('changelog').setVisible(true);
            		this.changeLogFragment.getModel().setData({LeadChangeDocs : data.ChangeDocs.results});
            	}
            
            		this.setFooterButtons(this.byId('info').getModel('json').getData());
            		
            		if(bShowInfoTab){
            		this.setDefaultTabToInfo();
            		}
            		this.bindS3Header(data);
            			//  sap.ca.ui.utils.busydialog.releaseBusyDialog();

            },
            
        	getBackFunction: function(){
				if (this.fullScreenMode)
					return function(){window.history.back(1);};
				else
					return undefined;
			},

            
            getS4Controller : function()
            {
            	//needed for s4 Controllers reference
            	if(!sap.ca.scfld.md.app.Application.getImpl().hasOwnProperty("oSplitContainer"))
            		return null;
            	var detailPages = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getDetailPages();
                if(detailPages.length > 0)
                	{
                	
                	    var i;
                	    for(i=0;i<detailPages.length;i++)
                	    	if(detailPages[i].getViewName() == "cus.crm.lead.view.S4")
                	    		return detailPages[i].getController();
                	
                	}
                return null;

            },
            
            setDefaultTabToInfo : function()
            {
            	//always default the tab to info whenever the s3 view loads
            	var oTabContainer = this.byId('icntab');
				if(oTabContainer && oTabContainer.getItems().length > 0){								
					
					if (oTabContainer.getSelectedKey() !== "info")
						oTabContainer.setSelectedKey("Info");
					oTabContainer.setExpanded(true);
				
				}
            	
            	
            },
            
            setFooterButtons : function(oHeader)
            {
            	
	            //control footer buttons for accept/reject scenario
				if (oHeader.SystemStatusCode == 'I1002' && oHeader.EmployeeResponsibleNumber === this.EmployeeForUser) {
					this.byId('accept').setVisible(true);
					this.byId('reject').setVisible(true);
					this.byId('edit').setVisible(false);
					

				} else {
					this.byId('accept').setVisible(false);
					this.byId('reject').setVisible(false);
					this.byId('edit').setVisible(true);
					

				}

            	
            	
            	
            	
            	
            },
           routeMatched  : function(oEvent) {
				
        	   
        	 
				if (oEvent.getParameter("name") === "detail") {
					//if(!jQuery.device.is.phone)
					
					   this.oRouter.detachRouteMatched(this.routeMatched,this);
				      if(this.navToOtherApp)
				        {
				    	  this.navToOtherApp = false;
				    	
				    	  return;
				        }
					//if s4 controller is not null, some actions need to be done based on actions in s4View
					var s4Controller = this.getS4Controller();
					
					if(s4Controller && s4Controller.bCancel)
						{
						    s4Controller.bCancel = false;
						    this.setDefaultTabToInfo();
						    return;
						}
					if(s4Controller && s4Controller.bEmployeeUpdateSuccess){
						s4Controller.bEmployeeUpdateSuccess = false;
						this.oModel.refresh();
						
					}
					//avoiding needless roundtrips if the details page changes
					this.byId('S3_Header').setIcon("sap-icon://person-placeholder");
					
					//sPath stored at s3 controller for further reference
					this.sPath = oEvent.getParameter("arguments").contextPath;
					
					//loading data for s3View
					//sap.ca.ui.utils.busydialog.requireBusyDialog();
					
						
					this.getDataForDetailScreen(true);
				
					
			
				}
				
				else 
					
					
					if (oEvent.getParameter("name") === "display") {
						//if(!jQuery.device.is.phone)
						this.fullScreenMode = true;
						
						this.byId('detailPage').setShowNavButton(true);
						
						
						   this.oRouter.detachRouteMatched(this.routeMatched,this);
					      if(this.navToOtherApp)
					        {
					    	  this.navToOtherApp = false;
					    	
					    	  return;
					        }
						//if s4 controller is not null, some actions need to be done based on actions in s4View
						var s4Controller = this.getS4Controller();
						
						if(s4Controller && s4Controller.bCancel)
							{
							    s4Controller.bCancel = false;
							    this.setDefaultTabToInfo();
							    return;
							}
						if(s4Controller && s4Controller.bEmployeeUpdateSuccess){
							s4Controller.bEmployeeUpdateSuccess = false;
							this.oModel.refresh();
							
						}
						//avoiding needless roundtrips if the details page changes
						this.byId('S3_Header').setIcon("sap-icon://person-placeholder");
						
						//sPath stored at s3 controller for further reference
						this.sPath = oEvent.getParameter("arguments").contextPath;
						
						//loading data for s3View
						//sap.ca.ui.utils.busydialog.requireBusyDialog();
						
							
						this.getDataForDetailScreen(true);
					
						
				
					}
					
			},
			onRenameFile : function(oEventData)
            {
                           
                            var newFileName = oEventData.getParameters().newFilename;
                                var fileId  = oEventData.getParameters().fileId;
                                var obj = {
                                                           
                                                            "newFileName" : newFileName + "",
                                                            "fileId"  : fileId +""
                                                           
                                };
                             
                                
                                
                                var Parameters = oEventData.getParameters();
                                            var URL = Parameters.media_src;
                           
                                            var removStartVal;
                                            if(!URL)
                                         removStartVal = Parameters.url.split("(").pop();
                                            else 
                                          	  removStartVal = URL.split("(").pop();
                                            var sPath = "LeadAttachments(";
                                            var url = sPath + removStartVal;
                                            this.oModel.setHeaders(obj);
                                            this.oModel
                                            .addBatchChangeOperations([ this.oModel
                                                                            .createBatchOperation(
                                                                                                            url, "PUT",obj,null) ]);
                                           
                                           
                                            /*var oParams = {};
                                            oParams.fnSuccess = function(){ alert("Update successful");  };
                                            oParams.fnError = function(){alert("Update failed");};
                                           
                                            this.oModel.setHeaders(obj);
                                            this.oModel.update(url,obj,oParams);
                               this.onSaveClicked();
                              
                               */
                           
                                           
                              // this.onSaveClicked();
                               
                                
                           
            },
           
            onSaveClicked : function(forceSave) {
                  //save to server here and determine success
                   this.oModel.submitBatch();

                  var ETagStr = null;
                  if(forceSave)
                	  ETagStr = "*";
                  var success = true;
           
                  var fileUploadControl = this.byId("fileupload");
           
                  if (success) {
                     fileUploadControl.commitPendingRenames();
                  } else {
                     fileUploadControl.abandonPendingRenames();
                  }
              },
              
              handleAddParticipantsBatchResponses : function(oResponses){
            	     var errorMessage = "";
            	     var bFail = false;
            	     if(oResponses.__batchResponses[0].hasOwnProperty("__changeResponses")){
                     var aChangeSetResponses = oResponses.__batchResponses[0].__changeResponses;
                     
                        for(var i = 0; i < aChangeSetResponses.length;i++){
                        	if(parseInt(aChangeSetResponses[i]) >= 400 ){
                        		bFail = true;
                        		errorMessage += (aChangeSetResponses[i].response.body).error.message.value +"\n";
                        	}
                        }
                        
                        if(bFail){
                        	  sap.ca.ui.message.showMessageBox({
          					    type: sap.ca.ui.message.Type.ERROR,
          					    message : this.oResourceBundle.getText('PARTIAL_SAVE'),
          					    details: errorMessage
          					},function(){});

                        }
            	     }
                     
                     
              },
              onAccountBusCardLaunch : function(oEvt){

					var accountId = oEvt.getSource().data("PartnerNumber");
					var Image = oEvt.getSource().data("Image");
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
					
						
				
              }
              
                  
			
			
            
		
		});
