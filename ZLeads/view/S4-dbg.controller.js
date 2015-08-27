/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("sap.ca.ui.message.message");	
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.DatePicker");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("cus.crm.lead.util.formatter");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("cus.crm.lead.util.schema");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("cus.crm.lead.util.Util");
sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.lead.view.S4",{	
	//
	
	deleteBuffer : [],//to manage the objects that are to be deleted in the backend
	headerGuid : 0,
	userStatusCode : 0,
	UserStatuses : [],
	HeaderObject : {},
	accountObject : {},
    oSelectedAccount : {},
	oSelectedContact : {
		contactID : ""
	},
	oSelectedEmployee : {
		employeeID : ""
	},
	oMainPartner : {
		PartnerNumber : ""
	},
	currentDescription : "",
	currentQuantity : "",
	BackendProducts : {},
	requestNumber : 0,
	changeSetMapping : { HEADER : "",
		                 STATUS : "",
		                 CONTACT : "",
		                 BASKET : "",
	},	
	bBasketUpdate : false,
	bNavOnUpdate : false,
	oModel : {},
	sentStartDate : null,	
	sentEndDate : null,
    bHeaderUpdateSuccess : false,
    bStatusUpdateSuccess : false,	
    bContactUpdateSuccess : false,
    bCancel : false,
   onInit : function()
	{
	  
	   
	   
	sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.lead.css.Leads",".css"),"sap-ui-theme-sap.crm.lead");
		
	
	 
	//custom data for datepickers
	 this.byId('datePickerStartDate').addCustomData(new sap.ui.core.CustomData({key : "OldValue"}));
	 this.byId('datePickerEndDate').addCustomData(new sap.ui.core.CustomData({key : "OldValue"}));
	 
	 
	 this.oModel = this.getView().getModel();
	 
	 //interoperability with various backend versions 
	 var sBackendVersion = cus.crm.lead.util.schema._getServiceSchemaVersion(this.oModel,"Lead");
	 this.sBackendVersion = sBackendVersion;
	 this.oVersioningModel = new sap.ui.model.json.JSONModel({BackendSchemaVersion : sBackendVersion});
	 this.oVersioningModel.updateBindings();
	 this.getView().setModel(this.oVersioningModel,"versioning");
	 
	 //the entire view is backed by jsonmodel
	 this.getView().setModel(new sap.ui.model.json.JSONModel(),"json");
	 
	  //saving references of application implementation, i18n model and resource bundle for fast access   
	  this.oAppImpl = sap.ca.scfld.md.app.Application.getImpl();
	  this.oI18nModel = this.oAppImpl.AppI18nModel;
	  this.oResourceBundle = this.oI18nModel.getResourceBundle();
	  
	  //date formatter for this controller - locale specific formatting of dates
	  this.oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},new sap.ui.core.Locale(this.oAppImpl.getResourceBundle().sLocale));
	  
	  
	  	
	  //callback for "edit" pattern
	  this.oRouter.attachRouteMatched(jQuery.proxy(function(oEvent)
			  {
		  if (oEvent.getParameter("name") === "edit" )
			  {
			  this.fullScreenMode = false;
			  this.sPath = oEvent.getParameter('arguments').contextPath;
			       // all data from s3 screen is bound here 
		           this.bindEditView(false);
		         
			  }
		  
		  else if( oEvent.getParameter("name") === "editFullScreen")
			  {
			  this.sPath = oEvent.getParameter('arguments').contextPath;
			  this.fullScreenMode = true;
			  this.bindEditView(false);
			  }
		  
			  },this));
			  
	  
	  //change events for date pickers
	  this.byId('datePickerEndDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
			  {
		 
		       this.setValueState(sap.ui.core.ValueState.None);	        	  
			  },this.byId('datePickerEndDate')));
	  
	  this.byId('datePickerStartDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
			  {
		      
		           this.setValueState(sap.ui.core.ValueState.None);   
			  },this.byId('datePickerStartDate')));
	  
	  this.byId('datePickerEndDate').attachChange(null,function(oEvent){
		  
		  var dateString= oEvent.getParameter('newYyyymmdd');
		  if(dateString !== null){
		  var tempDate = new Date(parseInt(dateString.substr(0,4)),
				                  parseInt(dateString.substr(4,2) - 1),
				                  parseInt(dateString.substr(6,2)));
	     this.byId('datePickerEndDate').setValue(this.oDateFormatter.format(tempDate));   
		  }
		 this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
		 this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
		  
	  },this);
	  this.byId('datePickerStartDate').attachChange(null,function(oEvent){
		  this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
		  this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
		  
		  var dateString= oEvent.getParameter('newYyyymmdd');
		  
		  if(dateString !== null){
		  var tempDate = new Date(parseInt(dateString.substr(0,4)),
				                  parseInt(dateString.substr(4,2) - 1),
				                  parseInt(dateString.substr(6,2)));
		this.byId('datePickerStartDate').setValue(this.oDateFormatter.format(tempDate));  
		  }
	  },this);
	  
	 
	  //MainContact responds to enter/return key press
	  this.byId('inputMainContact').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent){
		  
		          if(oEvent.keyCode === 13){
		        	  this.showContactF4({});
		          }
		          else{
		        	  
		          }
		  
	  },this));
	  
	  //employee field responds too!
	  this.byId('inputEmpResponsible').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent){
		    
		     if(oEvent.keyCode === 13){
		    	 this.showEmployeeF4({});
		     }
		  
	  },this));
	  //json model for product basket
	   this.byId('productBasketEdit').getModel('json').setSizeLimit(500);
	   //  this.oTableFragment.setModel(new sap.ui.model.json.JSONModel());
	   // this.oTableFragment.getModel().setSizeLimit(500);
	
	   //json models for dropdowns 
//	  this.byId('selectOrigin').setModel(new sap.ui.model.json.JSONModel(),"json");
//	  this.byId('selectPriority').setModel(new sap.ui.model.json.JSONModel(),"json");
//	  this.byId('selectQualification').setModel(new sap.ui.model.json.JSONModel(),"json");
//	  this.byId('selectStatus').setModel(new sap.ui.model.json.JSONModel(),'json');
//	  this.byId('selectStatus').mBindingInfos['items'].path = "/Statuses"; //workaround
	  this.bNav = false;
	   
	 
	},
	
	onBeforeRendering : function(){
		
		this.getView().getModel('controllers').getData().s4Controller = this;
		
		
		 //saving a reference of s3 controller 
		 this.s3Controller = this.getView().getModel('controllers').getData().s3Controller;
		 
		 //saving of reference of s4 controller in s3 controller 
		 if(this.s3Controller){
		 this.s3Controller.s4Controller = this;
		 }
		//saving refernce of s4 controller in s2 controller as well
		
		 
		 var s2Controller = this.getView().getModel('controllers').getData().s2Controller;
		 if(s2Controller){
		
			 s2Controller.s4Controller = this;
			 //saving reference of s2 controller over here in s4
			 this.s2Controller = s2Controller;
		 }
		
		
	},
	
	onCancel : function()
	{

        // check if pageNeeds update - throw data loss pop-up if it is the case
		if(this.pageNeedsUpdate()){
	   
	    		
		 sap.ca.ui.dialog.confirmation.open({
	 			question :this.oResourceBundle.getText('DATA_LOSS'),
	 			title : this.oResourceBundle.getText('WARNING'),
	 			confirmButtonLabel : this.oResourceBundle.getText('CONTINUE')  	
	 			
	 		},jQuery.proxy(this.datalossDismissed,this));
		 
		}
		else //simulating continue of dataloss dismiss - simlar to cancelling without any changes made in the page
              this.datalossDismissed({isConfirmed : true});	
		
		//always clear the batch constructed by pageNeedsUpdate
		this.oModel.clearBatch();
			
	
	
	},
     datalossDismissed : function(oResult){
		
		//if the user discards changes clear all buffers in s4 controler
		if(oResult.isConfirmed){
		
	    //clearing buffers
	    this.deleteBuffer = [];
		
	    var s3Controller = this.getDetailController();
	    
	    if(s3Controller === null){
	    	window.history.go(-1);
	    	return;
	    }
	    // user selected cancel - navigate to s3 screen
		this.bCancel = true;
		
		
		
		var ctx = "Leads(guid'" + this.headerGuid +"')";
		
		  
		 this.oRouter.attachRouteMatched(this.s3Controller.routeMatched,this.s3Controller);	
		  
		
		if(!jQuery.device.is.phone){
			  
			  		if(!this.fullScreenMode)
                this.oRouter.navTo("detail", {contextPath : ctx },true);
			  		else  this.oRouter.navTo("display", {contextPath : ctx },true);
		}
		
		else
		   this._navBack();
	       
		}
		
		
	},
	
	handleBatchReads : function(aResponses){

    	//batch responses from initial launch of s3 view
		var data = {};
    	var bFail = false;
        var errorTitle= "";
        var errorMessage= "";
        
    		
        	if(aResponses.__batchResponses[0].statusCode === "200"){
				this.Origins = aResponses.__batchResponses[0].data.results;
				this.Origins.splice(0, 0, {
					LanguageCode : "",
					OriginCode : "",
					OriginText : ""
				});
				}
				else{
					
					bFail = true;
					errorTitle = aResponses.__batchResponses[0].statusText;
					errorMessage = JSON.parse(aResponses.__batchResponses[0].response.body).error.message.value +"\n";						
					this.Origins.push([{
						LanguageCode : "",
						OriginCode : "",
						OriginText : ""
						
					}]);
				}
				
        	
        	
				if(aResponses.__batchResponses[1].statusCode === "200"){
				this.Priorities = aResponses.__batchResponses[1].data.results;
				this.Priorities.splice(0, 0, {
					LanguageCode : "",
					PriorityCode : "",
					PriorityText : ""
				});
				}
				else
					{
					
					   bFail = true;
					   errorTitle = aResponses.__batchResponses[1].statusText;
					   errorMessage = JSON.parse(aResponses.__batchResponses[1].response.body).error.message.value +"\n";
					   this.Priorities.push([{
					    	
					    	LanguageCode : "",
					    	PriorityCode : "",
					    	PriorityText : ""
					    	
					    }]);
					
					}
				if(aResponses.__batchResponses[2].statusCode === "200"){
				this.QualificationsLevels = aResponses.__batchResponses[2].data.results;
				this.QualificationsLevels.splice(0,
						0, {
					LanguageCode : "",
					QualificationCode : "",
				});
				}
				else 
					{
					   bFail = true;
					   errorTitle = aResponses.__batchResponses[2].statusText;
					   errorMessage = JSON.parse(aResponses.__batchResponses[2].response.body).error.message.value +"\n";
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
				
				
		  if(aResponses.__batchResponses[3].hasOwnProperty("data")){
    	      data  = aResponses.__batchResponses[3].data;
    	      var aProducts = data.Products.results;
    	      var aStatuses = data.Statuses.results;
    	      delete data.Products;
    	      delete data.Statuses;
    	      data.Products = this._cloneProducts({Products : aProducts}).Products;
    	      data.Statuses = aStatuses;
    	      data.Origins = this.Origins;
			  data.Priorities = this.Priorities;
			  data.QualificationsLevels = this.QualificationsLevels;
    	      this.bindHeaderFormsExceptMainContact(data, false);
		  }
		  else
			  this.handleErrors(aResponses.__batchResponses[3]);
		  
	
	},
	
	
	getDetailController : function()
	{
		//get controller for detail page - utility function
		return this.getView().getModel('controllers').getData().s3Controller;
	},
	
	_cloneProducts : function(oProducts){
		var oProductsClone;
		
		if(oProducts.Products){
		
		oProductsClone = JSON.parse(JSON.stringify(oProducts));
		for(var i= 0;i<oProductsClone.Products.length;i++)
     	{
     	 if(oProductsClone.Products[i].ProductGuid === null)
     		 oProductsClone.Products[i].Backend = "CATEGORY";
          else
     	     oProductsClone.Products[i].Backend = "X";
     	  oProductsClone.Products[i].OldValue = oProductsClone.Products[i].Quantity;
     	  this.BackendProducts[oProductsClone.Products[i].ItemGuid] = JSON.parse(JSON.stringify(oProductsClone.Products[i]));
     	}
		}
		else{
			oProductsClone = {Products : []};
		}
		return oProductsClone;
	},
	
	bindEditView : function(bRefreshPage)
	{
		//this is where all the data needed to for edit page from detail page is bound
	
     //make all buffers empty 
	 this.deleteBuffer = [];     //delete buffer holds products that are to be deleted in the backend
	 this.BackendProducts = {};  //BackendProducts is a json as an associative array - holds original quantity of products coming from backend
	 
	 
	 
      var s3Controller = this.getDetailController();
      
      if(s3Controller === null || bRefreshPage){
    	  
    	  
    	  
    	  if(s3Controller == null && parseFloat(this.sBackendVersion) >= 4 && !bRefreshPage){
    		  //normal load of edit page in bookmarking scenario!! need to fetch eTag 
    		  cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
    	  }
           this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Origins","GET")]);
	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Priorities","GET")]);
	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("QualificationsLevels","GET")]);
	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("/" + this.sPath+"?$expand=Products,ChangeDocs,Statuses","GET")]);
	       
	       
	       this.oModel.submitBatch(jQuery.proxy(this.handleBatchReads,this),jQuery.proxy(this.handleErrors,this),true);
    
    	  return;
      }
      
		 //save Lead with Etag
      this._saveETag(s3Controller.sETag);
	 //binding starts from here
	 
        
      //entities to be expanded in s4 view if the data is not already fetched in s3 view. By default statuses is expanded everytime
      var expandEntities = "Statuses";	
      var data = s3Controller.byId('info').getModel('json').getData();
           
       data.Origins = s3Controller.Origins;
       data.Priorities = s3Controller.Priorities;
       data.QualificationsLevels = s3Controller.QualificationsLevels;
       
       
      //check if product basket data is already fetched in s3 view
	  var oProductsData = s3Controller.byId('Product_Tab').getModel('json').getData();
	  if(oProductsData && oProductsData.hasOwnProperty("Products"))
		 {
		    var oProductsClone;
		    if(oProductsData.Products){
		    oProductsClone = JSON.parse(JSON.stringify(oProductsData));
		   var i;
		   for(i=0;i<oProductsClone.Products.length;i++)
        	{
        	 if(oProductsClone.Products[i].ProductGuid === null)
        		 oProductsClone.Products[i].Backend = "CATEGORY";
             else
        	     oProductsClone.Products[i].Backend = "X";
        	  oProductsClone.Products[i].OldValue = oProductsClone.Products[i].Quantity;
        	  this.BackendProducts[oProductsClone.Products[i].ItemGuid] = JSON.parse(JSON.stringify(oProductsClone.Products[i]));
        	}
		    }
		    else{
		    	oProductsClone = {Products : []};
		    }
		data.Products = oProductsClone.Products;   
        //this.byId('productBasketEdit').getModel('json').setData(oProductsClone);
		
		}
	   
	else
		expandEntities += ",Products";
	var oSalesTeamData = s3Controller.byId('salesteam').getModel('json').getData();
		
	      var oModel = this.oModel;
		   var sPath = "Leads(guid'" + s3Controller.byId('info').getModel('json').getData().Guid + "')";
		   oModel.read(sPath,null,["$expand="+expandEntities],true,jQuery.proxy(function(odata,response)
				   {
			        
			        if(expandEntities.indexOf("Products") !== -1)
			        	{
			        var oProductsClone =  this._cloneProducts({Products : response.data.Products.results});
			        data.Products = oProductsClone.Products;
			        	}
			        data.Statuses = response.data.Statuses.results;
			        this.byId('selectStatus').getModel('json').setData({Statuses : response.data.Statuses.results});
			        this.byId('selectStatus').setSelectedKey(this.HeaderObject.UserStatusCode);
			        this.UserStatuses = response.data.Statuses.results;	
			        
			        
			        this.bindHeaderFormsExceptMainContact(data,false);
			        
				   },this));
		   
		   

		     
		   //EXTENSION POINT
		   var detailController = this.getDetailController();
		   /**
			 * @ControllerHook extHookBindAdditionalFields is the controller hook that provide for setting values for additional fields
			 *                 from the detail screen that can be modified in the edit screen. The customer can access the data of the detail
			 *                 page by calling the getDetailController function.
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookBindAdditionalFields
			 * @param {object}
			 *           detailController
			 * @return {void}
			 */
		  if (this.extHookBindAdditionalFields){
				this.extHookBindAdditionalFields(detailController);
			}
		
	},
	
	pageNeedsUpdate : function(){
		
		
		//pageNeedsUpdate checks for any changed fields in the edit page - returns true if update needed, else false
		
		//clear all changesetMappings for batch initially
		this.changeSetMapping.BASKET = "";
		this.changeSetMapping.HEADER = "";
		this.changeSetMapping.CONTACT = "";
		this.changeSetMapping.STATUS = "";
		this.changeSetMapping.EMPLOYEE = "";
		this.bBasketUpdate = false;
		this.oSentStartDate  = null;
		this.oSentEndDate = null;
		
		//empty changeset intially
		var changeSet = []; 
		var headerGuid = this.headerGuid;
	
	
		
		var oModel = this.oModel;  
		this.requestNumber = 0;
		
		//Etag implementation
		var nBackendVersion = cus.crm.lead.util.schema
				._getServiceSchemaVersion(this.oModel,
				"Lead");
		var oETag = null;
		// Inter-operability check - send {sETag : null} 
		if(nBackendVersion >= 4.0){
			oETag = {sETag : null };	
		}
					
		 /**
		 * @ControllerHook extHookCheckDeltaAndFrameRequests is the controller hook that provides for sending additional update requests to the
		 *                 backend with the delivered updates which are on the header, status, employee responsible (wave 4 and above), and the product basket. 
		 *                 The customer can check for changed fields and send update requests only for the fields that have actually been changed.  
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookCheckDeltaAndFrameRequests
		 * @param {object} changeSet
		 * @return {void}
		 */
		if (this.extHookCheckDeltaAndFrameRequests){
			this.extHookCheckDeltaAndFrameRequests(changeSet);
		}
		//construct the json from form fields using value getter functions
var tempEntry = {
        Guid : headerGuid,        
        Description : this.byId('inputName').getValue(),
        OriginCode : this.byId('selectOrigin').getSelectedKey(),
        QualificationCode : this.byId('selectQualification').getSelectedKey(),
        PriorityCode : this.byId('selectPriority').getSelectedKey(),
        StartDate : ($('#' + this.byId('datePickerStartDate').getIdForLabel()).val() !== "" ) ? 
        		         this.getDateTimeStampFromDatePicker(this.byId('datePickerStartDate')) : null,
        EndDate : ($('#' + this.byId('datePickerEndDate').getIdForLabel()).val() !== "" ) ?
        		          this.getDateTimeStampFromDatePicker(this.byId('datePickerEndDate')) : null
        };
    var entry = { Guid : headerGuid};
    
//compare the fields with the original HeaderObject and frame the entry to be sent as payload for header update
 
 var key;	
 var needsUpdate = false;
 
 for(key in tempEntry)
	 {
	     if(key === "StartDate" || key === "EndDate")
	    	 {
	    	 //check conditions on dates - if the dates should be updated on the backend 
	    	     if(!this._areDatesSame(this.HeaderObject[key],tempEntry[key]))
	    	    	 {
	    	    	 entry[key] = tempEntry[key];
	    	    	 if(key === "StartDate"){
	    	    		 this.oSentStartDate = tempEntry[key];
	    	    	 }
	    	    	 else{
	    	    		 this.oSentEndDate = tempEntry[key];
	    	    	 }
	    	    	 needsUpdate = true;	
	    	    	 }
	    	 }
	     else
	    	 {
	    	 
	    	  if(this.HeaderObject[key] !== tempEntry[key])
	    	   {
	    	     entry[key] = tempEntry[key];
	    	     needsUpdate = true;
	    	   }
	    	 }
	     
	 };
	 
	 if(this._hasUserStatusChanged() || this._hasMainContact() || this._hasEmployeeChanged()){
		 needsUpdate = true;
	 }
	 
	 var bCustomFieldsChanged = false;
	 /**
		 * @ControllerHook extHookAddCustomHeaderFields is the controller hook that provides for adding additional fields that are part of the opportunity header.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomHeaderFields
		 * @param {object}
		 *          entry
		 * @return {boolean}
		 */
		if (this.extHookAddCustomHeaderFields){
		    bCustomFieldsChanged =   this.extHookAddCustomHeaderFields(entry);
		}
		
	 //header needs update - frame requestnumber and batch changeset
	 if(needsUpdate || bCustomFieldsChanged)
		 {
		 
	          this.changeSetMapping.HEADER = this.requestNumber;
	          this.requestNumber++;
        	 changeSet.push(oModel.createBatchOperation("Leads(guid'"+headerGuid+"')","MERGE",entry,oETag));
		 }
	 else
		 //no updated required for header
		 this.changeSetMapping.HEADER = "";
		 
    //updating user status
    if(this._hasUserStatusChanged())
    	{
    	//first search for the correct status profile
    	this.changeSetMapping.STATUS = this.requestNumber;
    	this.requestNumber++;
    	var entry;
    	var statusProfile;
        var j,tempLength;
        tempLength = this.UserStatuses.length;
        for(j=0;j<tempLength;j++)
        	if(this.UserStatuses[j].UserStatusCode === this.userStatusCode)
        		{
        		  statusProfile = this.UserStatuses[j].StatusProfile; 
        		   break;
        		}
       //status profile found, now frame payload, changeset and request number
     	entry = {
			
			HeaderGuid : headerGuid,
			StatusProfile : statusProfile,
			UserStatusCode : this.byId('selectStatus').getSelectedKey()
	};
      	changeSet.push(oModel.createBatchOperation("LeadStatuses(StatusProfile='"+statusProfile+"',UserStatusCode='"+this.byId('selectStatus').getSelectedKey()+"',HeaderGuid=guid'"+headerGuid+"')","MERGE"
     			       ,entry,oETag));
    	}
    else
    	//no update required for status
    	this.changeSetMapping.STATUS = "";
    
    
    //updating main contact 
    if(this._hasMainContact()){
        	
        	  var url = "";
        	  var payload = {};
        	  if(this.byId('inputMainContact').getValue() === ""){
        		  url = "LeadSalesTeamSet(PartnerNumber='"+ "" +"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+this.headerGuid+"')";
        		  payload = { 
        	    		HeaderGuid : this.headerGuid,
        	    		PartnerFunctionCode : "00000015",
        	    		PartnerNumber : "",
        	    		MainPartner : true
        	      };
        	  }
        	  else{
        		url =   "LeadSalesTeamSet(PartnerNumber='"+this.oSelectedContact.contactID+"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+this.headerGuid+"')";
        		 payload = { 
         	    		HeaderGuid : this.headerGuid,
         	    		PartnerFunctionCode : "00000015",
         	    		PartnerNumber : this.oSelectedContact.contactID,
         	    		MainPartner : true
         	      };
        	  }
        	   this.changeSetMapping.CONTACT = this.requestNumber;
        	   this.requestNumber++;
        	
        	   changeSet.push(oModel.createBatchOperation(url,
        			       "MERGE",payload,oETag));
        	   
        }
        else
        	//no update required for main contact
        	this.changeSetMapping.CONTACT = "";
    
    //updating employee responsible 
    //relevant only for backend versions 2.0 and above
    if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2.0){

		
	    if(this._hasEmployeeChanged()){
	    	
	    	var url; 
	    	var payload = {};
	    	if(this.byId('inputEmpResponsible').getValue() === ""){
	    		url = "LeadSalesTeamSet(PartnerNumber='"+"',PartnerFunctionCode='00000014',HeaderGuid=guid'"+this.headerGuid+"')";
	    		payload = {
	    				HeaderGuid : this.headerGuid,
	    	    		PartnerFunctionCode : "00000014",
	    	    		PartnerNumber : "",
	    	    		MainPartner : true
	    		};
	    	}
	    	else{
	    		url ="LeadSalesTeamSet(PartnerNumber='"+this.oSelectedEmployee.employeeID+"',PartnerFunctionCode='00000014',HeaderGuid=guid'"+this.headerGuid+"')";
	    		payload = {
	    				HeaderGuid : this.headerGuid,
	    	    		PartnerFunctionCode : "00000014",
	    	    		PartnerNumber : this.oSelectedEmployee.employeeID,
	    	    		MainPartner : true
	    		};
	    		
	    	}
	    	   this.changeSetMapping.EMPLOYEE = this.requestNumber;
	    	   this.requestNumber++;
	    	
	    	              changeSet.push(oModel.createBatchOperation(url,
	    			       "MERGE",payload,oETag));
	    }
	    else
	    	//no update required for employee responsible
	    	this.changeSetMapping.EMPLOYEE = "";
	    
		
    }

    //Delete of products
    var i;
   
    for(i=0;i<this.deleteBuffer.length;i++)
    	{
    	    
    	   this.bBasketUpdate = true;
    	    var entry = {
    	    		HeaderGuid : this.deleteBuffer[i].HeaderGuid,
    	    		ItemGuid : this.deleteBuffer[i].ItemGuid,
    	    		ProductGuid : this.deleteBuffer[i].ProductGuid,
    	    		ProcessingMode : "D"
    	    		
    	    };
    	  
    	    /**
			 * @ControllerHook extHookAddCustomColumnsForProductDelete is the controller hook that provides for adding new columns
			 *                 during deletion of products from the product basket.
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomColumnsForProductDelete
			 * @param {object} entry
			 * @param {object} deleteBuffer[i] 
			 */
			if (this.extHookAddCustomColumnsForProductDelete){
				  this.extHookAddCustomColumnsForProductDelete(entry,this.deleteBuffer[i]);
			}  
    	    // oModel.addBatchChangeOperations([oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+this.deleteBuffer[i].HeaderGuid+"',ItemGuid=guid'"+this.deleteBuffer[i].ItemGuid+"')","MERGE",entry,null)]);
    	changeSet.push(oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+this.deleteBuffer[i].HeaderGuid+"',ItemGuid=guid'"+this.deleteBuffer[i].ItemGuid+"')","MERGE",entry,null));//,oETag);    	
    	}
   
   
    //Update of products - modify existing products, create added products
    var basketData = this.byId('productBasketEdit').getModel('json').getData();
    //var basketData = this.oTableFragment.getModel().getData();
    	
    var i,length;
    length = basketData.Products.length;
   
    for(i=0;i<length;i++)
       {
    	if(basketData.Products[i].Backend === "X")
    		{
    		  //Search the BackendProducts if the update really needs to go through
    		    var oOldEntry = this.BackendProducts[basketData.Products[i].ItemGuid];
    		    var oNewEntry = basketData.Products[i];
    		    var bValue = false;
    		   
    		    /**
				 * @ControllerHook extHookCheckDeltaOnProductEntry is the controller hook that provides for checking of fields in the product entry that have changed
				 *                 from the original entry before they are edited.
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookCheckDeltaOnProductEntry
				 * @param {object} oOldEntry
				 * @param {object} oNewEntry   
				 * @return {boolean}     
				 */
				if (this.extHookCheckDeltaOnProductEntry){
				    bValue =  this.extHookCheckDeltaOnProductEntry(oOldEntry,oNewEntry);
				}    
    		    
				if(oOldEntry.Quantity !== oNewEntry.Quantity || bValue)
    		    	 {
    		    	 this.bBasketUpdate = true;
    		    	   var entry = {
	    	                         	HeaderGuid : basketData.Products[i].HeaderGuid,
	    	                         	ItemGuid : basketData.Products[i].ItemGuid,
	    	                         	ProductGuid : basketData.Products[i].ProductGuid,
	    	                         	Quantity : basketData.Products[i].Quantity,
	    	                         	ProcessingMode : "B"
	    		
                        };
    		    	   
    		    	   /**
      					 * @ControllerHook extHookAddCustomColumnsForProductModify is the controller hook that provides for adding new columns 
					     *                 during modification of products in the product basket.
      					 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomColumnsForProductModify
      					 * @param {object} entry
      					 * @param {object} oNewEntry         
      					 */
      					if (this.extHookAddCustomColumnsForProductModify){
      					      this.extHookAddCustomColumnsForProductModify(entry,oNewEntry);
      					}			
      //  oModel.addBatchChangeOperations([oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+basketData.Products[i].HeaderGuid+"',ItemGuid=guid'"+basketData.Products[i].ItemGuid+"')",
        		//  "MERGE",entry,null)]);
    		    	   changeSet.push(oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+basketData.Products[i].HeaderGuid+"',ItemGuid=guid'"+basketData.Products[i].ItemGuid+"')",
    		    		        		  "MERGE",entry,oETag));
    		    	 }
       }
    	else if(basketData.Products[i].Backend === "")
    		{
    		 this.bBasketUpdate = true;
    		 var entry = {
    		    		HeaderGuid : basketData.Products[i].HeaderGuid,
    		    		ItemGuid : "00000000-0000-0000-0000-000000000001",
    		    		ProductId : basketData.Products[i].ProductId,
    		    		Quantity : basketData.Products[i].Quantity,
    		    		Unit : basketData.Products[i].Unit,
    		    		ProcessingMode : "A"
    		    		
    		    };
    		 
    		 /**
				 * @ControllerHook extHookAddCustomColumnsForProductCreate is the controller hook that provides for adding new columns
				 *                 during creation of products in the product basket.
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomColumnsForProductCreate
				 * @param {object} entry
				 * @param {object} basketData.Products[i]         
				 */
				if (this.extHookAddCustomColumnsForProductCreate){
					 this.extHookAddCustomColumnsForProductCreate(entry,basketData.Products[i]);
				}
    		 changeSet.push(oModel.createBatchOperation("LeadProducts","POST",entry,oETag));
    		// oModel.addBatchChangeOperations([oModel.createBatchOperation("LeadProducts","POST",entry,null)]);
    		
    		}
       }
    
    
    if(this.bBasketUpdate === true)
    	{
    	//set the request number for product basket update
    	 this.changeSetMapping.BASKET = this.requestNumber;
    	 
         this.requestNumber++;
    	}
    else
    	//no changes required for product basket
    	this.changeSetMapping.BASKET = "";
    //oModel.addBatchChangeOperations(changeSet);
    if(changeSet.length > 0){
    	oModel.addBatchChangeOperations(changeSet);
    	return true;
    }      //some update needs to happen - header, status, main contact, employee responsible or product basket
    	
   
    
    return false;       //page needs no update
		
		
	
	},
	
	//ETag check on save
		_saveETag : function(sETag){
			this.sETag = sETag;
		},
		
		_refreshLead : function(){
			this.bindEditView(true);
			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
		},
		
		_is412Error : function(oResponses){
		
			for(var i = 0 ; i < oResponses.__batchResponses.length;i++){
				if(oResponses.__batchResponses[i].response.statusCode === "412"){
					return true;
				}
			}
			return false;
		},
		
	onSave : function(sETag){
		
	    
		//save only if if all data is validated 
		if(this.validateEditPage() === false)
			return;
		
		//pageNeedsUpdate frames the batch and changesets here.
		  //this.pageNeedsUpdate();
		if(this.pageNeedsUpdate()){
		  
    if(this.requestNumber > 0)       //page needs update
    	{
    	//sap.ca.ui.utils.busydialog.requireBusyDialog();
         //disable the save button until response from server
    	 //this.byId('buttonSaveLead').setEnabled(false);
    	this._oControlStore.oButtonListHelper.aButtons[0].oButton.setEnabled(false);
          this.oModel.submitBatch(jQuery.proxy(function(oResponses){
    	
        	//batch accepted - handle responses
    	   this.handleBatchResponses(oResponses);
    	
    	
    },this),
    jQuery.proxy(function(oError)
    {       
        	 // this.byId('buttonSaveLead').setEnabled(true); //enable the save button on response
    	this._oControlStore.oButtonListHelper.aButtons[0].oButton.setEnabled(true);
        	var sMessage; 
				if (oError.response) {
			//		sMessage = jQuery.parseJSON(oError.response.body).error.message.value;
				}
        	  sap.ca.ui.message.showMessageBox({
        		    type: sap.ca.ui.message.Type.ERROR,
        		    message: oError.message,
        		    details : "" +oError.response.body,
        		}, function(){});
    	
    },this),true
    
    		);
    	}	
	 
		}
		else{
			this.datalossDismissed({isConfirmed : true});	
			
			//always clear the batch constructed by pageNeedsUpdate
			this.oModel.clearBatch();
		}
	},
	
	showProductDialog : function()
	{
		 if(!this.oAddProductsFragment){
			 //initialize products fragment and it's models for once
			 this.oAddProductsFragment = new sap.ui.xmlfragment(this.createId("addProducts"),'cus.crm.lead.fragment.AddProducts',this);
			 this.oAddProductsFragment.setModel(new sap.ui.model.json.JSONModel(),"json");
			 this.oAddProductsFragment.setModel(this.oI18nModel,'i18n');
		 }
		//for loading text 
		 this.oAddProductsFragment.getBeginButton().setEnabled(false);
		this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oAddProductsFragment.getModel('json').setData({Products :[]});
		
		//read products and set no data text appropriately
		this.oModel.read("Products",null,null,true,jQuery.proxy(function(odata,response){
			
			if(response.data.results.length === 0)
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PRODUCTS'));
			this.oAddProductsFragment.getModel("json").setData({Products : response.data.results});
			
		},this),function(oError){
			
			
			
		});   
		
		 this.oAddProductsFragment.open();
		
		
	},
	
	closeProductDialog : function()
	{
		//remove any selections in the product list
		this.oAddProductsFragment.close();
		this.oAddProductsFragment.getContent()[0].removeSelections();
		//this.oAddProductsFragment.getSubHeader().getContentLeft()[0].clear();
		
	},
	
	
	addProductsToBasket : function()
	{
		
		var oProductList = this.oAddProductsFragment.getContent()[0];
		var oSelectedItems = oProductList.getSelectedItems();
		var productBasketData ={Products : []};
		var data = this.byId('productBasketEdit').getModel('json').getData();
		//var data = this.oTableFragment.getModel().getData();
		if(data && data.hasOwnProperty("Products"))
			productBasketData.Products = data.Products;
		var headerGuid = this.headerGuid;
		var i = 0;
		var length = oSelectedItems.length;
		var oListItem;
		for(i = 0;i<length;i++)
			{
			   oListItem = oSelectedItems[i]; 
			   var tempObject = oListItem.getBindingContext('json').getObject();
			   //frame the json to be added to the json model of the product basket
			    var pushObject = {
			    		
			    		    HeaderGuid: headerGuid,
			    			ItemGuid: "",
			    			ProcessingMode: "",
			    			ProductGuid: tempObject.ProductGuid,
			    			ProductId: tempObject.ProductId,
			    			ProductName: tempObject.ProductDescription,
			    			Quantity: "1",	//quantity is defaulted to 1
			    			Unit : tempObject.Unit,
			                Backend : "",   //this is a product added from client so the backend flag is ""
			                OldValue : "1"  //keep the old value in sync with the current value
			    };
			   
                 /**
				 * @ControllerHook extHookExtendProductEntry is the controller hook that provides for addition of extra fields to the product entry.
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookExtendProductEntry
				 * @param {object} pushObject
				 * @param {object} tempObject       
				 */
				if (this.extHookExtendProductEntry){
				     this.extHookExtendProductEntry(pushObject,tempObject);
				}
			    productBasketData.Products.push(pushObject);
			 
			}
		
		this.byId('productBasketEdit').getModel('json').updateBindings();
		//this.byId('productBasketEdit').getModel().updateBindings();
		//this.oTableFragment.getModel().setData(productBasketData);
		
		this.oAddProductsFragment.close();
		this.oAddProductsFragment.getContent()[0].removeSelections();
		//this.oAddProductsFragment.getSubHeader().getContentLeft()[0].clear();
		
	},
	
	deleteProduct : function(oEvent)
	{
		var data = oEvent.getSource().getModel('json').getData();
		var product = oEvent.getSource().getBindingContext('json').getObject();
		var i;
		var length = data.Products.length;
		
		
		
		for(i=0;i<length;i++)
			if(product == data.Products[i])
				{
				      data.Products.splice(i,1);
				     
				     if(product.Backend === "X")
				       this.deleteBuffer.push(product);
				      break;
				  
				}
	this.byId('productBasketEdit').getModel('json').updateBindings();
		//this.oTableFragment.getModel().setData(data);
		
	},
	formatDate : function(inputDateValue)
	{
		
		if(inputDateValue === "" || inputDateValue === null || inputDateValue === undefined)
			return "";
		var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},locale);
		return formatter.format(inputDateValue);
	

	},
	filterProducts : function(oEvent)
	{
		//filter products based on Product description
        this.oAddProductsFragment.getBeginButton().setEnabled(false);
		this.oAddProductsFragment.getContent()[0].removeSelections();
		this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oAddProductsFragment.getModel('json').setData({Products : []});
		this.oModel.read("Products",null,["$filter=ProductDescription eq '"+ oEvent.getParameter('query') + "'"],true,jQuery.proxy(function(odata,response){
			
			if(response.data.results.length === 0)
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PRODUCTS'));
			this.oAddProductsFragment.getModel('json').setData({Products : response.data.results});
			
			
		},this),function(oError){
			
			
		});
		
		
	},
	
	getDateTimeStampFromDatePicker : function(datePicker)
	{
	 	  //convert date from locale specific format to YYYY-MM-DDTXX:XX:XX
	 	  var labelDate = $('#' + datePicker.getIdForLabel()).val();
	 	  var currentDate = this.oDateFormatter.parse(labelDate);
	 	  var year = currentDate.getFullYear();
	 	  var month = currentDate.getMonth();
	 	  var day = currentDate.getDate();
	 	  return new Date(Date.UTC(year,month,day));
	 	 
		
	},
	showAccountF4 : function(oEvent)
	{
		 var appImpl = sap.ca.scfld.md.app.Application.getImpl();
		  var oModel = this.oModel;
		  this.byId('dialogAccountF4').setModel(oModel);
		this.byId('dialogAccountF4').open();
	},
	
	showContactF4 : function(oEvent)
	{
		//throw the contact f4 dialog
		if(!this.contactF4Fragment){
			 //contactF4 is backed  by json model
			  this.contactF4Fragment  =  new sap.ui.xmlfragment(this.createId("contactF4"), 'cus.crm.lead.fragment.ContactF4', this);
			  this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
			  this.contactF4Fragment.setModel(this.oI18nModel,'i18n');
		}
		var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
		var toolbarLabel = toolbar.getContent()[0];
		this.contactF4Fragment.getSubHeader().getContentLeft()[0].setValue(this.byId('inputMainContact').getValue());
		if(this.HeaderObject.ProspectNumber != "")
			{
			//if there is an account for the lead, show filtered by account in the toolbar
			toolbar.setVisible(true);
		     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + this.HeaderObject.ProspectName);
		     this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
		     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		     this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,["$filter=substringof('" + 
	    	      this.byId('inputMainContact').getValue() + "',fullName)"],false,jQuery.proxy(function(odata,response)
		    			    		    		        		   
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
			//no account assigned to the lead, hiding the filtered by toolbar
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
	showEmployeeF4 : function(oEvent)
	{
	
		
		//throw the employee f4 dialog
		
		if(!this.employeeF4Fragment){
			 this.employeeF4Fragment  =  new sap.ui.xmlfragment(this.createId("employeeF4"), 'cus.crm.lead.fragment.EmployeeF4', this);  
				//employeeF4 is backed  by json model
				  this.employeeF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
				  this.employeeF4Fragment.setModel(this.oI18nModel,'i18n');
		}
		var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
		var toolbarLabel = toolbar.getContent()[0];
		
		var aFilters = [];
		var sText = this.byId('inputEmpResponsible').getValue();
		var aSplit = sText.split('/'); 
        var sSearchText = aSplit[0].replace("/\s+$/","");
        this.employeeF4Fragment.getSubHeader().getContentLeft()[0].setValue(sSearchText);
		
        if(sSearchText !== ""){
        	aFilters.push("$filter=substringof('" + sSearchText + "',fullName)");
        }
		if(this.HeaderObject.ProspectNumber != "")
			{
			//if there is an account for the lead, show filtered by account in the toolbar
			toolbar.setVisible(true);
		     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + this.HeaderObject.ProspectName);
		     this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
		     this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		     this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/EmployeeResponsibles",null,aFilters,true,jQuery.proxy(function(odata,response)
		    		
		    		 {
	    	    	  this.employeeF4Fragment.getModel('json').setData({ 
	  					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
	  				});
		    	        	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
		    	      
		    		 },this),jQuery.proxy(function(oError)
		    	        {
		    	        	this.employeeF4Fragment.getModel('json').setData({
		    	        		
		    	        		EmployeeCollection : []
		    	        	});
		    	        	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
		    	        	
		    	        },this));
		    	 
		    		 }
		    
		else
			{
			//no account assigned to the lead, hiding the filtered by toolbar
		    toolbar.setVisible(false);
		    this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
		     this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		    this.oModel.read("EmployeeCollection",null,aFilters,true,jQuery.proxy(function(odata,response)
		    		 {
		    	      
		    	this.employeeF4Fragment.getModel('json').setData({ 
					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
				});
		    	  
	    	        	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));     
		    		 },this),jQuery.proxy(function(oError)
		    	        {
		                	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
		    	        	
		    	        },this));
		    
			}
		
			
		this.employeeF4Fragment.open();
		
		
		
	},

	closeAccountF4 : function(oEvent)
	{
		
		this.byId('dialogAccountF4').close();
	},
	closeContactF4 : function(oEvent)
	{	
		
		this.contactF4Fragment.close();
	},
	closeEmployeeF4 : function(oEvent)
	{
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData({EmployeeCollection : []});
		this.employeeF4Fragment.setModel(jsonModel,"json");
		this.employeeF4Fragment.close();
	},
	
	setAccount : function(oEvent)
	{
		
		
		 var appImpl = sap.ca.scfld.md.app.Application.getImpl();
		 var oModel = this.oModel;
		 this.oSelectedAccount = oEvent.getParameter('listItem').getBindingContext().getObject();
		 
		this.byId('inputAccount').setValue(this.oSelectedAccount.name1);
	
		this.byId('accountList').removeSelections();
		this.byId('dialogAccountF4').close();
		
	},
	setContact : function(oEvent)
	{

		//contact selected from contactF4
		 this.oSelectedContact = oEvent.getParameter('listItem').getBindingContext('json').getObject();
		 if(this.oSelectedContact.fullName !== ""){
			 this.byId('inputMainContact').setValue(this.oSelectedContact.fullName);
		 }
	    else {
	        this.oSelectedContact.fullName = this.oSelectedContact.contactID;
	    	this.byId('inputMainContact').setValue(this.oSelectedContact.contactID);
	    }
			
	   	 this.contactF4Fragment.getContent()[0].removeSelections();
		 this.contactF4Fragment.close();
		 
	
	},
	setEmployee : function(oEvent)
	{
		//contact selected from employeeF4
		this.oSelectedEmployee = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
		if(this.oSelectedEmployee.fullName !== "")
			this.byId('inputEmpResponsible').setValue(this.oSelectedEmployee.fullName);
		else 
			this.byId('inputEmpResponsible').setValue(this.oSelectedEmployee.employeeID);
		this.employeeF4Fragment.getContent()[0].removeSelections();
		 var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData({EmployeeCollection : []});
			this.employeeF4Fragment.setModel(jsonModel,"json");
			this.employeeF4Fragment.close();
	},
	searchAccount : function(oEvent)
	{
		var filter = new sap.ui.model.Filter("name1","EQ",oEvent.getParameter('query'));
	    this.byId('accountList').bindAggregation('items',"/AccountCollection",this.byId("accountListItem"),null,filter);	
		
	},
	
	searchContact : function(oEvent)
	{

		//search contacts based on contacts' full name
	    var searchText;
	    var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
	    var oEventParameters = oEvent.getParameters();
	    if(oEventParameters.hasOwnProperty("newValue"))
	    	{
	    	searchText = oEventParameters.newValue;
	    	if(searchText.length < 4)
	    		return;
	    	}
	    else
	    	searchText = oEventParameters.query;
		
	    this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
		this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
	    
	    if(toolbar.getVisible() === true && this.HeaderObject.ProspectNumber !== ""){
	    	
	    	this.oModel.read("AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,["$filter=substringof('"+
	    	     searchText + "',fullName)" ],true,jQuery.proxy(function(odata,response)
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
	    	
	    }
	    
	    else{
	    	toolbar.setVisible(false);
	    	this.oModel.read("ContactCollection",null,["$filter=substringof('" +searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
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
	    	
	    	
	    	
	    }
		
		    	 
		
	
	},
	searchEmployee : function(oEvent)
	{
		  var searchText;
		    var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
		    var oEventParameters = oEvent.getParameters();
		    if(oEventParameters.hasOwnProperty("newValue"))
		    	{
		    	searchText = oEventParameters.newValue;
		    	if(searchText.length < 4)
		    		return;
		    	}
		    else
		    	searchText = oEventParameters.query;
		    
		    this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
			this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		    var sUrl;
			if(toolbar.getVisible() === false){
				sUrl = "EmployeeCollection";
			}
			else{
				sUrl = "/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/EmployeeResponsibles";
			}
			this.oModel.read(sUrl,null,["$filter=substringof('" +searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
					{
		        	this.employeeF4Fragment.getModel('json').setData({ 
					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
				});
				       
				    	   this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
					},this),
					jQuery.proxy(function(oError)
					{
						this.employeeF4Fragment.getModel('json').setData({
							
							EmployeeCollection : []
							
						});
						this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
					},this));
			    	 
	},
	closeToolbar : function(oEvent)
	{

		//filtered by toolbar closed - trigger blank search of contacts
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
					this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				},this));
		
		
	
	},
	closeEmpToolbar : function(oEvent)
	{
		//filtered by toolbar closed - trigger blank search of employees
		this.employeeF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
		this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
		this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		var sText = this.employeeF4Fragment.getSubHeader().getContentLeft()[0].getValue();
		var filter = (sText.length > 0) ? ["$filter=substringof('" + sText +  "',fullName)"] : null;
		this.oModel.read("EmployeeCollection",null,filter,true,jQuery.proxy(function(odata,response)
				{
			this.employeeF4Fragment.getModel('json').setData({ 
				EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
			});
			      
			    	   this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
				},this),
				jQuery.proxy(function(oError)
				{
					this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
				},this));
		
	},
	closeParticipantsToolbar : function(oEvent)
	{
		//filtered by toolbar closed - trigger blank search of participants
		this.participantsF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
		this.participantsF4Fragment.getModel('json').setData({AccountCollection : []});
		this.participantsF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oModel.read("AccountCollection",null,null,true,jQuery.proxy(function(odata,response)
				{
			       this.participantsF4Fragment.getModel('json').setData({
			    	   AccountCollection :  response.data.results
			    	   });
			       if(response.data.results.length === 0)
			    	   this.participantsF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PARTICIPANTS'));
				},this),
				jQuery.proxy(function(oError)
				{
					this.participantsF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PARTICIPANTS'));
				},this));
		
	},
	
	descriptionChanged : function(oEvent)
	{
		//description of lead should not exceed 40 chars
		var descriptionField = this.byId('inputName');
		if(oEvent.getParameter('newValue').length > 40)
			{
			    descriptionField.setValueState(sap.ui.core.ValueState.Error);
			    
			
			}
		else
			  descriptionField.setValueState(sap.ui.core.ValueState.None);
	    
		
	},
	quantityChanged : function(oEvent)
	{
		//quantity should involve only numbers
		var data = oEvent.getSource().getBindingContext('json').getObject();
		var newValue = oEvent.getParameter('newValue'); 
		var pattern = /[^0-9.]/;
		if(pattern.test(newValue) === false)
			{
			       if(newValue.split(".").length > 2)  //error
			    	   {
			    	      //  oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			    	      data.Quantity = data.OldValue;
			    	      oEvent.getSource().setValue(data.Quantity);
			    	   }
			       else // no error 
			    	   {
			    	      data.OldValue = newValue;
			    	      data.Quantity = newValue;
			    	    //  oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			    	   
			    	   }
			
			}
		else //error 
			{
			 //oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			data.Quantity = data.OldValue;
  	      oEvent.getSource().setValue(data.Quantity);
			}
		
		
	},
   validateEditPage : function()
   {

	   //date validations for edit page - called on save
	   var datePickerStart = this.byId('datePickerStartDate');
	   var datePickerEnd = this.byId('datePickerEndDate');
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
               message: this.oI18nModel.getResourceBundle().getText('JUNK_DATE')
             });
		 
		  
		   }
	 
	  //invalid end date
	   if(labelEnd !== "" && (this.oDateFormatter.parse(labelEnd)   === null))
	   {
	      bInvalidDates = true;
		   sap.ca.ui.message.showMessageBox({
               type: sap.ca.ui.message.Type.ERROR,
               message: this.oI18nModel.getResourceBundle().getText('JUNK_DATE')
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
               message: this.oI18nModel.getResourceBundle().getText('INVALID_DATE')
             });
		    
		   datePickerStart.setValueState(sap.ui.core.ValueState.Error);
		   datePickerEnd.setValueState(sap.ui.core.ValueStateError);
		   return false;
		   
		   }
	   
	   if(this.oSelectedContact.fullName !== this.byId('inputMainContact').getValue()
			     && this.byId('inputMainContact').getValue() !== ""){
				  
				  this.showContactF4({});
				    return false;  
			  }
	   
	   //EXTENSION POINT
	   /**
		 * @ControllerHook extHookValidateAdditionalFields is the controller hook that provides for the custom validations that can be implemented to validate additional fields.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookValidateAdditionalFields
		 * @return {boolean}
		 */
		if (this.extHookValidateAdditionalFields){
		   	var bValue = this.extHookValidateAdditionalFields(); 
		   		if(!bValue){
		   			return false;
		   		}
		   	}
	   
	   return true;		
	   
	   
	   
   
   },
   
   handleBatchResponses : function(oResponses)
   {

	   //handle all the responses received from the batch
	   var statuses = [];  //array of error texts to be shown to the user
	   var responseObject;
	   this.bHeaderUpdateSuccess = false;
	   this.bStatusUpdateSuccess = false;
	   this.bContactUpdateSuccess = false;
	   this.bEmployeeUpdateSuccess = false;
	   var bPartialUpdate = false;
	   var bFail = false;
	   var bBasketFail = false;
	   var errorMessage ="";
	   var b412Error = false;
	   //this.byId('buttonSaveLead').setEnabled(true);
	   this._oControlStore.oButtonListHelper.aButtons[0].oButton.setEnabled(true);
	   if(oResponses.__batchResponses[0].hasOwnProperty("__changeResponses")){
		   
		   /**
			 * @ControllerHook extHookHandleResponsesForCustomUpdates is the controller hook that provides for custom handling of the responses for the custom updates. The oResponses argument contains the responses for all the requests that are framed.
			 *                 The specific response can be identified by using the changeSetMapping number as an index in the oResponses array.
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookHandleResponsesForCustomUpdates
			 * @param {object}
			 *          oResponses
			 * @return {void}
			 */
			if (this.extHookHandleResponsesForCustomUpdates){
				this.extHookHandleResponsesForCustomUpdates(oResponses);
			}
		   
	   if(this.changeSetMapping.HEADER !== "")
		   {
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.HEADER];
		       
		        if(parseInt(responseObject.statusCode) >= 400)
		          {
		          //header update failure - push error text into statuses array
		           statuses.push(responseObject.statusText);
		           bFail = true;
		           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
		           if(parseInt(responseObject.statusCode) === 412){
						b412Error = true;
					}
		           this.bindHeaderFormsExceptMainContact(true);
              
	        	   }
		        else	
		        	{
		        	//header update success - refresh new values in HeaderObject 
		        	   this.HeaderObject.Description = this.byId('inputName').getValue();
		        	   if(this.oSentStartDate !== null){
		        		   if(this.oSentStartDate === "0000-00-00T00:00:00")
		        			   this.HeaderObject.StartDate = null;
		        		   else
		        			   this.HeaderObject.StartDate = new Date(this.oSentStartDate);
		        		   
		        	   }
		        	   
		        	   if(this.oSentEndDate !== null){
		        		   if(this.oSentEndDate === "0000-00-00T00:00:00")
		        			   this.HeaderObject.EndDate = null;
		        		   else
		        			   this.HeaderObject.EndDate = new Date(this.oSentEndDate);
		        		   
		        	   }
		        	   
		        	   this.HeaderObject.OriginText = this.byId('selectOrigin').getSelectedItem().getText();
		        	   this.HeaderObject.OriginCode = this.byId('selectOrigin').getSelectedKey();
		        	   this.HeaderObject.PriorityText = this.byId('selectPriority').getSelectedItem().getText();
		        	   this.HeaderObject.PriorityCode = this.byId('selectPriority').getSelectedKey();
		        	   this.HeaderObject.QualificationCode = this.byId('selectQualification').getSelectedKey();
		        	   this.HeaderObject.QualificationText = this.byId('selectQualification').getSelectedItem().getText();
		               bPartialUpdate = true;    	   
		        	   this.bHeaderUpdateSuccess = true;
		        	 
		        	   
		        
		        	}
		   }
	   if(this.changeSetMapping.STATUS !== "")
		   {
		   
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.STATUS];
		  
	        if(parseInt(responseObject.statusCode) < 400 )
	          {
	        	
	        	//status update success - maintain updated status in HeaderObject
	        	 this.HeaderObject.UserStatusCode = this.byId('selectStatus').getSelectedKey();
	        	   this.HeaderObject.UserStatusText = this.byId('selectStatus').getSelectedItem().getText();
	        	   
	        	    this.bStatusUpdateSuccess = true;
	        	    bPartialUpdate = true;
	          }
	        else
	        	{
	        	//status update failure  - push error text into statuses array
	        	 statuses.push(responseObject.statusText);
		           bFail  = true;
		           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
		           if(parseInt(responseObject.statusCode) === 412){
						b412Error = true;
					}
		           //revert 
		           this.byId('selectStatus').setSelectedKey(this.HeaderObject.UserStatusCode);
	        	  
	        	}
		   
		   }
	   if(this.changeSetMapping.CONTACT !== "")
		   {
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.CONTACT];
	        if(parseInt(responseObject.statusCode) >= 400)
	          {
	        	//main contact update failure - push error text into statuses array
	           statuses.push(responseObject.statusText);
	           bFail  = true;
	           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
	           if(parseInt(responseObject.statusCode) === 412){
					b412Error = true;
				}
	           this.oSelectedContact.contactID = this.HeaderObject.MainContactId;
	           this.oSelectedContact.fullName = this.HeaderObject.MainContactName;
	          }
	        else
	        	{
	        	//main contact update success  - maintain updated contact in HeaderObject
	        	 bPartialUpdate = true;
	        	    this.HeaderObject.MainContactId = this.oSelectedContact.contactID;
	        	    this.HeaderObject.MainContactName = this.oSelectedContact.fullName;
	        	    this.byId('inputMainContact').setValue(this.HeaderObject.MainContactName);
	        	    this.bContactUpdateSuccess = true;
	        	  
	        	}
		   
		   }
	   //relevant only for backend schema versions >= 2.0
	   if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2.0){
	   if(this.changeSetMapping.EMPLOYEE !== "")
	   {
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.EMPLOYEE];
        if(parseInt(responseObject.statusCode) >= 400)
          {
        	//main contact update failure - push error text into statuses array
           statuses.push(responseObject.statusText);
           bFail  = true;
           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
           if(parseInt(responseObject.statusCode) === 412){
				b412Error = true;
			}
           this.oSelectedEmployee.employeeID = this.HeaderObject.EmployeeResponsibleNumber;
           this.oSelectedEmployee.fullName = this.HeaderObject.EmployeeResponsibleName;
           
          }
        else
        	{
        	//main contact update success  - maintain updated contact in HeaderObject
        	 bPartialUpdate = true;
        	    this.HeaderObject.EmployeeResponsibleNumber = this.oSelectedEmployee.employeeID;
        	    this.HeaderObject.EmployeeResponsibleName = this.oSelectedEmployee.fullName;
        	    this.byId('inputMainContact').setValue(this.HeaderObject.EmployeeResponsibleName);
        	    this.bEmployeeUpdateSuccess = true;
        	   
        	  
        	}
	   
	   }
	   }
	   if(this.changeSetMapping.BASKET !== "")
		   {
		 //  length = oResponses.__batchResponses[this.changeSetMapping.BASKET].__changeResponses.length;
		   var i;
		   var length = oResponses.__batchResponses[0].__changeResponses.length; //length of batch responses array
		  //handling batch responses of product basket - always span from changeSetMapping.BASKET to end of the batch responses array
		   for(i = this.changeSetMapping.BASKET ;i < length;i++)
		        	{
		        	
		    	
			   responseObject = oResponses.__batchResponses[0].__changeResponses[i];
		        	if(parseInt(responseObject.statusCode) >= 400)
		              {
		        		//individual update failed - push error text into statuses array
			           statuses.push(responseObject.statusText);
			           bFail  = true;
			           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
			           if(parseInt(responseObject.statusCode) === 412){
							b412Error = true;
						}
			           bBasketFail = true;
			          }
		        	else
		        		//individual update succeeded
		        		bPartialUpdate = true;
		        	
		        	}
		      //sap.ca.ui.utils.busydialog.releaseBusyDialog();
		      
		      if(bPartialUpdate && bFail) //partial success
		    	  {
		    	     if(bBasketFail) 
  		    	       this.fetchProductsOnFail();
		    	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : this.oI18nModel.getResourceBundle().getText('PARTIAL_SAVE'),
					    details: errorMessage
					},function(){});
		    	  return;
		    	  }
		      if(!bPartialUpdate && bFail) //all updates failed
		      {
		    	  if(bBasketFail)
		    	     this.fetchProductsOnFail();
		    	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : this.oI18nModel.getResourceBundle().getText('SAVE_FAILED'),
					    details: errorMessage
					},function(){});
		    	  return;
		    	  }
		   
		   
		   }
	   }
	   else{
		   if(this._is412Error(oResponses)){
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
				},jQuery.proxy(function(){
					this._refreshLead();
					//this.oModel.refresh();
				},this));
				return;
			}
		   bPartialUpdate = true;
		   bFail = true;
		   sap.ca.ui.message.showMessageBox({
			    type: sap.ca.ui.message.Type.ERROR,
			    message : this.oI18nModel.getResourceBundle().getText('SAVE_FAILED'),
			    details: JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value
			},function(){});
		   return; 
	   }
	   
	     if(bPartialUpdate && !bFail)  //all updates succeeded  
		   {
	    	 
	    	 //if any header fields are updated - refresh the corresponding list item
		     if((this.bHeaderUpdateSuccess || this.bStatusUpdateSuccess || this.bContactUpdateSuccess) && !this.bEmployeeUpdateSuccess)
		         this.refreshListItem();
		     
		     
		     this.bSuccessSave = true;
		   sap.ca.ui.message.showMessageToast(this.oAppImpl.getResourceBundle().getText('LEAD_SAVED')); 
		   this.bNavOnUpdate = true;
		   var ctx = "Leads(guid'"+this.headerGuid+"')";

		   // Notify listeners for the event that lead has been changed.
		   sap.ui.getCore().getEventBus().publish("cus.crm.leads", "leadChanged", {
				contextPath : ctx
			});

		   var s3Controller = this.getDetailController();
		   
		   if(s3Controller === null){
			   window.history.go(-1);
			   return;
		   }
		   
		   this.oRouter.attachRouteMatched(this.s3Controller.routeMatched,this.s3Controller);  
		   
		   
		   if(!jQuery.device.is.phone){
			 
			 if(!this.fullScreenMode)
		     this.oRouter.navTo("detail",{ contextPath : ctx},true);
			 else
				 this.oRouter.navTo("display",{ contextPath : ctx},true);	 
		     
		   }
		    else
		      this._navBack();
		   
		  
		   }
	     
	     //Refresh ETag	on Merge	
			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
   
   },
   refreshListItem : function()
   {
	   
	   var sPath = "/" + "Leads(guid'" + this.headerGuid + "')";
	   var item = this.getItemFromSPath(sPath);
	   if(!item){
		   this.oModel.refresh();
		   return;
	   }
	   if(!this.s2Controller){
		   return;
	   }
	   
	   if(!this.s2Controller.getList().getSelectedItem()){
		   this.oModel.refresh();
		   return;
	   }
	   var data = this.s2Controller.getList().getSelectedItem().getBindingContext().getObject();
	   var key;
	   for(key in this.HeaderObject)
		   data[key] = this.HeaderObject[key];
	   
	   this.s2Controller.getList().updateItems();
	   
   },
   startDateChanged : function(oEvent)
   {
	   this.byId('datePickerStartDate').setValue(this.byId('datePickerStartDate').getCustomData()[1].getValue());
   },
   fetchProductsOnFail : function()
   {
	   //always clean up the delete buffer
	   this.deleteBuffer = []; 

	   this.oModel.read("Leads(guid'"+this.headerGuid+"')",null,["$expand=Products"],true,
					jQuery.proxy(function(odata, response) {
				//var tab = that.byId(
					//	"productBasketEdit");
				//var jsonModel = new sap.ui.model.json.JSONModel();
				
			var	oProductsClone = {
					Products : response.data.Products.results
				};
			 var length = oProductsClone.Products.length;
			 var i;
			//cleaning up the BackendProducts associative json-array
			 this.BackendProducts = {};
			    for(i=0;i<length;i++)
			    	{
			    	 if(oProductsClone.Products[i].ProductGuid === null)
			    		 oProductsClone.Products[i].Backend = "CATEGORY";
			         else
			    	     oProductsClone.Products[i].Backend = "X";
			    	  oProductsClone.Products[i].OldValue = oProductsClone.Products[i].Quantity;
			    	  this.BackendProducts[oProductsClone.Products[i].ItemGuid] = JSON.parse(JSON.stringify(oProductsClone.Products[i]));
			    	}
			  // this.oTableFragment.getModel().setData(s3ObjectClone);
			    var oData = this.byId('productsBasketEdit').getModel('json').getData();
			    
			    oData.Products = oProductsClone.Products;
			    
			    this.byId('productBasketEdit').getModel('json').updateBindings();

			},this));
	  
	   
   },
   
   getItemFromSPath : function(sPath)
   {
	   //search for s2 list item from sPath
	   if(!this.s2Controller){
		   return null;
	   }
	   var items = this.s2Controller.getList().getItems();
	   var i;
	   var context = this.oModel.getContext(sPath);
	   for(i=0;i<items.length;i++)
		   if(context === items[i].getBindingContext())
	           return items[i];
	   
	   return null;
   },
   
   bindHeaderFormsExceptMainContact : function(data,bExceptMainContact)
   {

	 	this.HeaderObject = data;
	 	
	 	if(typeof this.HeaderObject["StartDate"] === "string"){
	 		this.HeaderObject["StartDate"] = new Date(this.HeaderObject["StartDate"]);
	 	}
	 	
	 	if(typeof this.HeaderObject["EndDate"] === "string"){
	 		this.HeaderObject["EndDate"] = new Date(this.HeaderObject["EndDate"]);
	 	}
		this.headerGuid = data.Guid;
		this.userStatusCode = data.UserStatusCode;
		
		if(bExceptMainContact === false)
			{
	    	this.currentDescription = data.Description;
		    this.oSelectedContact.contactID = data.MainContactId;
		    this.oSelectedContact.fullName = data.MainContactName;
		    this.byId('inputMainContact').setValue(data.MainContactName);
			}
		
		//setting values for editable fields
	    this.byId('inputName').setValue(data.Description);  
	    this.byId('inputAccount').setText(data.ProspectName);
	    this.byId('textLeadId').setText(data.Id);
	    this.byId('leadTypetext').setText(data.ProcessTypeDescription);
	    //dates
	    this.byId('datePickerStartDate').setValue(this.formatDate(data.StartDate));  //Formatting the dates
	    this.byId('datePickerEndDate').setValue(this.formatDate(data.EndDate));
	    this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
	    this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
	    
	   //employee responsible - valid only since backend schema version 2.0
	    if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion)  >= 2.0){
	    
	    	this.byId('inputEmpResponsible').setValue(data.EmployeeResponsibleName);
	        this.oSelectedAccount.accountID = data.ProspectNumber;
		    this.oSelectedEmployee.employeeID = data.EmployeeResponsibleNumber;
	    }
	  
	    //setting the campaign field 
	    if(this.HeaderObject.CampaignId !== "")
	    	{
	    	     if(this.HeaderObject.CampaignDescription !== "")
	    	    	 this.byId('textCampaign').setValue(this.HeaderObject.CampaignDescription);
	    	     else
	    	    	 this.byId('textCampaign').setValue(this.HeaderObject.CampaignId);
	    	}
	    

	    //setting appropriate values for the dropdown from the le	ad header
//	    this.byId('selectOrigin').getModel('json').setData(s3Object);
//	    this.byId('selectPriority').getModel('json').setData(s3Object);
//	    this.byId('selectQualification').getModel('json').setData(s3Object);
	    
	    var oJsonModel = this.getView().getModel("json");
	    
	    oJsonModel.oData = JSON.parse(JSON.stringify(data));
	    
	    oJsonModel.updateBindings();
	    
	    this.UserStatuses = data.Statuses;
	    this.byId('selectOrigin').setSelectedKey(data.OriginCode);
	    this.byId('selectPriority').setSelectedKey(data.PriorityCode);
	    this.byId('selectQualification').setSelectedKey(data.QualificationCode);
	    this.byId('selectStatus').setSelectedKey(data.UserStatusCode);
		//this.getView().getModel().setData(s3Object);
       
   
   },
   getHeaderFooterOptions : function(){
	   
	   var fnBack;
	   var s3Controller = this.getDetailController();
	   if(jQuery.device.is.phone || (this.fullScreenMode &&  s3Controller === null)){
		   fnBack = jQuery.proxy(this.onBack,this);
	   }
	   else{
		   fnBack = null;
	   }
	   	return {
	   		onBack : fnBack,
			sI18NDetailTitle : this.oResourceBundle.getText('EDIT'),
			oEditBtn : {
				sI18nBtnTxt : "SAVE",
				onBtnPressed : jQuery.proxy(this.onSave,this)
			},
			buttonList : [{
							   sI18nBtnTxt : 'CANCEL',
							   onBtnPressed : jQuery.proxy(this.onCancel,this)
								
							}],
	   	     bSuppressBookmarkButton : true
			
	   	};
	   	
	},
	
	onBack : function(){
		this.onCancel();
	},
	enableProductsAddButton : function(oEvent){
    	
	       if(this.oAddProductsFragment.getContent()[0].getSelectedItems().length > 0){
	    	   this.oAddProductsFragment.getBeginButton().setEnabled(true);
	       }
	       else{
	    	   this.oAddProductsFragment.getBeginButton().setEnabled(false);
	       }
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
        
        _areDatesSame : function(oDate1,oDate2){
        	
        	if(oDate1 === null && oDate2 === null){
        		return true;
        	}
             if(!(oDate1 instanceof Date && oDate2 instanceof Date)){
            	 return false;
             }
	      
            //compare only DD MM YYYY
             if(oDate1.getDate() !== oDate2.getDate()){
            	 return false;
              }
             
             if(oDate1.getMonth() !== oDate2.getMonth()){
            	 return false;
             }
             
             if(oDate1.getFullYear() !== oDate2.getFullYear()){
            	 return false;
             }
       
             return true;
        },
        
        _hasUserStatusChanged : function(){
        	return (this.userStatusCode !== this.byId('selectStatus').getSelectedKey());
        },
        
        _hasMainContact : function(){
        return (this.HeaderObject.MainContactId !== this.oSelectedContact.contactID 
            || this.HeaderObject.MainContactName !== this.byId('inputMainContact').getValue());
        },
        
        _hasEmployeeChanged : function(){
        	return (this.HeaderObject.EmployeeResponsibleNumber !== this.oSelectedEmployee.employeeID ||
        	    	this.HeaderObject.EmployeeResponsibleName !== this.byId('inputEmpResponsible').getValue());
        }
   
    
   
  	
});
