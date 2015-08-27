/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.message.message");		
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.DatePicker");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("cus.crm.opportunity.util.Util");
jQuery.sap.require("cus.crm.opportunity.util.Util");
sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.opportunity.view.S4", {

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
		EMPLOYEE : "",
		BASKET : "",   
	},
	bBasketUpdate : false,
	Currencies : [],
	bNavOnUpdate : false,
	contactF4Fragment : {},
//	employeeF4Fragment :{},
	WinStatusCode: "",
	LostStatusCode: "",
	controller:"",
	OldvolumeValue:"",
	OldcosValue:"",
	ContactCollection : [],
	EmployeeCollection : [],
	s3Controller_contact :"",
	currencyMessage:"",
	bCancel : false,
	onInit : function()
	{
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		//jQuery.sap.includeStyleSheet("./css/Opportunity.css");
		
		//this.getView().getModel('controllers').getData().s4Controller = this;
		var bRTL = sap.ui.getCore().getConfiguration().getRTL();
		var sCss = (bRTL) ? "OpportunityRTL" : "Opportunity";
		
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.opportunity.css." + sCss,".css"),"sap-ui-theme-sap.crm");
		
		 this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle() ;
		 this.oI18nModel=sap.ca.scfld.md.app.Application.getImpl().AppI18nModel;
		this.oModel = this.getView().getModel();
		this.getView().setModel(new sap.ui.model.json.JSONModel(),"json");
		this.oAppImplementation = sap.ca.scfld.md.app.Application.getImpl();
		this.oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},new sap.ui.core.Locale(this.oAppImplementation.getResourceBundle().sLocale));
		
		this.contactF4Fragment  =  new sap.ui.xmlfragment(this.createId("contactF4"), 'cus.crm.opportunity.view.ContactF4', this);
		this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
		this.contactF4Fragment.setModel(this.oI18nModel,'i18n');
//		this.employeeF4Fragment  =  new sap.ui.xmlfragment(this.createId("employeeF4_S5"), 'cus.crm.opportunity.view.EmployeeF4', this);
//		this.employeeF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
//		this.employeeF4Fragment.setModel(this.oI18nModel,'i18n');
		//Handle Routing
		this.oRouter.attachRouteMatched(jQuery.proxy(function(oEvent)
				{
			if (oEvent.getParameter("name") === "subDetail") 
			{   
				sap.ca.ui.utils.busydialog.requireBusyDialog();
				this.sPath = oEvent.getParameter("arguments").contextPath;
				this.bindEditView(false);
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
			}
			else if( oEvent.getParameter("name") === "edit")
				{ this.fullScreenMode = true;
				  this.sPath = oEvent.getParameter("arguments").contextPath;
				sap.ca.ui.utils.busydialog.requireBusyDialog();
				this.bindEditView(false);
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				
				
				}
				},this));
		
		
		

		//Prevent manual entry in Date
		this.byId('datePickerEndDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
				{
			 this.setValueState(sap.ui.core.ValueState.None);
				},this.byId('datePickerEndDate')));

		this.byId('datePickerStartDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
				{
			  this.setValueState(sap.ui.core.ValueState.None);
				},this.byId('datePickerStartDate')));

		//Show contact F4 on Enter
		/*this.byId('inputMainContact').attachBrowserEvent("keyup",function(oEvent){ 
            //keycode for enter is 13
            if(oEvent.keyCode === 13)
            {
                  this.showContactF4();
            }},this);
		
        this.byId('inputEmpResponsible').attachBrowserEvent("keyup",function(oEvent){ 
                //keycode for enter is 13
                if(oEvent.keyCode === 13)
                {
                      this.showEmployeeF4();
                }},this
		);*/
		
		//Date validation
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
		
		this.byId('productBasketEdit').setModel(new sap.ui.model.json.JSONModel());
		this.byId('currency').setModel(new sap.ui.model.json.JSONModel());

		// Chance of success should get filled based on stage selected
		var that = this.getView();
		this.getView().byId('stages').attachChange( null, function(oEvent){
			if(that.byId('userStatus').getSelectedKey()!=that.getController().WinStatusCode && that.byId('userStatus').getSelectedKey()!=that.getController().LostStatusCode )	
			{	
				var data=this.getModel('json').getData();
				var newValue = oEvent.getParameter("newValue");
				var length = data.SalesStages.length;
				// NLUN - CodeScan Changes - Global Variables
				for (var i=0; i<length;i++){
					if  (data.SalesStages[i].SalesStageCode === oEvent.getParameter("selectedItem").getKey()){
						that.byId("chanceOfSuccess").setValue( Number(data.SalesStages[i].ChanceOfSuccess));
						that.byId('wtVol').setText(cus.crm.opportunity.util.Formatter.weightedvolume((that.byId('expectedSalesVolume')).getValue(),
								(that.byId('chanceOfSuccess')).getValue(),
								(that.byId('currency')).getValue()));
						break;
					}

				}
			}
		});

		//Chance of Success based on userStatus
		this.getView().byId('userStatus').attachChange( null, function(oEvent){
			var newValue = oEvent.getParameter("newValue");
			if  (that.getController().WinStatusCode === oEvent.getParameter("selectedItem").getKey()){
				that.byId("chanceOfSuccess").setValue( 100);
				that.byId('wtVol').setText(cus.crm.opportunity.util.Formatter.weightedvolume((that.byId('expectedSalesVolume')).getValue(),
						(that.byId('chanceOfSuccess')).getValue(),
						(that.byId('currency')).getValue()));

			}
			if  (that.getController().LostStatusCode === oEvent.getParameter("selectedItem").getKey()){
				that.byId("chanceOfSuccess").setValue(0);
				that.byId('wtVol').setText(cus.crm.opportunity.util.Formatter.weightedvolume((that.byId('expectedSalesVolume')).getValue(),
						(that.byId('chanceOfSuccess')).getValue(),
						(that.byId('currency')).getValue()));
			}
		});
		
		//interoperability with various backend versions 
		this.sBackendVersion = cus.crm.opportunity.util.schema
				._getServiceSchemaVersion(this.oModel,
				"Opportunity");	       
		this.oVersioningModel = new sap.ui.model.json.JSONModel({BackendSchemaVersion : this.sBackendVersion});	
		this.oVersioningModel.updateBindings();
		this.getView().setModel(this.oVersioningModel,"versioning");
	},
	
	
	
	onBeforeRendering : function(){
		
		this.getView().getModel("controllers").getData().s4Controller = this;
		
		this.s3Controller = this.getView().getModel('controllers').getData().s3Controller;
		
		if(this.s3Controller){
		this.s3Controller.s4Controller = this;
		this.s3Controller_contact = this.s3Controller;
		
		}
		//saving refernce of s4 controller in s2 controller as well
		 var s2Controller = this.getView().getModel('controllers').getData().s2Controller;
		 
		 if(s2Controller){
			 
		 s2Controller.s4Controller = this;
		//saving reference of s2 controller over here in s4
		 this.s2Controller = s2Controller;
		 }
		 
	},
	
	bindBatchResponses : function(aResponses){
		     
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
	
	bindHeaderFormsAndProducts : function(data){
		
		this.HeaderObject = data;
		this.headerGuid = data.Guid;;
		this.userStatusCode = data.UserStatusCode;
		this.HeaderObject = data;
		this.headerGuid = data.Guid;;
		this.userStatusCode = data.UserStatusCode;
		this.UserStatuses = data.UserStatuses; 
		
		//this.oSelectedAccount.accountID = s3Object.Header.ProspectNumber;
		this.byId('description').setValue(data.Description); 
		//filling account id if account name is empty - for edit page
		this.byId('account').setText(data.ProspectName);
		if(data.ProspectName==="")
			this.byId('account').setText(data.ProspectNumber);
		this.byId('inputEmpResponsible').setValue(data.EmployeeResponsibleName);
		
		this.byId('expectedSalesVolume').setValue(data.ExpectedSalesVolume);
		this.byId('opportunityTotalNetValue_Text_S4').setText(cus.crm.opportunity.util.Formatter.totalexpectednetValue(data.TotalExpectedNetValue,data.CurrencyCode));
		this.byId('id').setText(data.Id);
		this.byId('opportunityType').setText(data.ProcessTypeDescriptionLong);
		this.byId('chanceOfSuccess').setValue(cus.crm.opportunity.util.Formatter.texttonumber(data.ChanceOfSuccess));
		this.byId('datePickerStartDate').setValue(this.formatDate(data.StartDate));//Formatting the dates
		this.byId('datePickerEndDate').setValue(this.formatDate(data.ClosingDate));
		
		this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
		this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
		this.byId('datePickerStartDate').fireChange(this.byId('datePickerStartDate'));
		this.byId('datePickerEndDate').fireChange( this.byId('datePickerEndDate'));
		this.byId('currency').setValue(data.CurrencyCode);
		this.byId('switch').setState(data.ForecastRelevance);
		this.byId('wtVol').setText(cus.crm.opportunity.util.Formatter.weightedvolume((data.ExpectedSalesVolume),Number(data.ChanceOfSuccess),data.CurrencyCode));
		//this.byId('dialogContactF4').setModel(oModel);
		this.byId('inputMainContact').setValue(data.MainContactName);
		this.oSelectedContact.contactID = data.MainContactId;
	    this.oSelectedContact.fullName = data.MainContactName;
		
		  //employee responsible - valid only since backend schema version 2.0 	
	    if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion)  >= 2.0){	

	    	this.byId('inputEmpResponsible').setValue(data.EmployeeResponsibleName);	
	    	this.oSelectedAccount.accountID = data.ProspectNumber;	
	    	this.oSelectedEmployee.employeeID = data.EmployeeResponsibleNumber;	
	    }	
		 
		//this.oSelectedEmployee.employeeID = s3Object.Header.EmployeeResponsibleNumber;
	    this.oSelectedEmployee.fullName = data.EmployeeResponsibleName;

		this.OldcosValue=this.byId('chanceOfSuccess').getValue();
		this.OldvolumeValue =this.byId('expectedSalesVolume').getValue();

		//setting up dropdowns 
        var oJsonModel = this.getView().getModel("json");
     
        oJsonModel.oData.UserStatuses = data.UserStatuses;
        oJsonModel.oData.Priorities = data.Priorities;
        oJsonModel.oData.SalesStages = data.SalesStages;
        
        //Products basket Binding
        oJsonModel.oData.Products = data.Products;
        
        oJsonModel.updateBindings();
        
        
        this.byId('userStatus').setSelectedKey(data.UserStatusCode);
		this.byId('priority').setSelectedKey(data.PriorityCode);
		this.byId('stages').setSelectedKey(data.SalesStageCode);
/*		//Removal of salesarea details in edit
		this.acc_salesorgid_old = data.SalesOrganization;
		this.acc_salesorgdesc_old = data.SalesOrganizationDescription;
		this.acc_salesorgid_new = data.SalesOrganization;
		this.acc_salesorgdesc_new = data.SalesOrganizationDescription;
		var salesorganization = cus.crm.opportunity.util.Formatter.formatSalesOrganization(this.acc_salesorgdesc_old, this.acc_salesorgid_old);
		this.getView().byId("salesorganization_Text").setText(salesorganization);
		
		this.acc_dischaid_old = data.DistributionChannel;
		this.acc_dischadesc_old = data.DistributionChannelDescription;
		this.acc_dischaid_new = data.DistributionChannel;
		this.acc_dischadesc_new = data.DistributionChannelDescription;
		var distributionchannel = cus.crm.opportunity.util.Formatter.formatDistributionChannel(this.acc_dischadesc_old, this.acc_dischaid_old);
		this.getView().byId("distributionchannel_Text").setText(distributionchannel);

		this.acc_divid_old = data.Division;
		this.acc_divdesc_old = data.DivisionDescription;
		this.acc_divid_new = data.Division;
		this.acc_divdesc_new = data.DivisionDescription;
		var division = cus.crm.opportunity.util.Formatter.formatDivision(this.acc_divdesc_old, this.acc_divid_old);
		this.getView().byId("division_Text").setText(division);*/

		/*Disable the Add product button when status is WON/Lost*/
		if(this.byId('userStatus').getSelectedKey()===this.WinStatusCode || this.byId('userStatus').getSelectedKey()===this.LostStatusCode ){
			this.byId('ProductButton').setVisible(false);
		}
		else
			this.byId('ProductButton').setVisible(true);
		
	    
	},
	
	_filterDropDownsByProcessType : function(oDropDownsData,sProcessType){
	   //status dropdown
		
		//set userstatus
		var aStatuses = [];
		var statusLength = oDropDownsData.UserStatuses.length;
		for(var i = 0;i< statusLength;i++){
			if (oDropDownsData.UserStatuses[i].ProcessType === sProcessType){
				aStatuses.push(oDropDownsData.UserStatuses[i]);
				this.StatusProfile = oDropDownsData.UserStatuses[i].StatusProfile;
				if (oDropDownsData.UserStatuses[i].BusinessTransaction === "WINN"){
					this.WinStatusCode =  oDropDownsData.UserStatuses[i].UserStatusCode ;
				}
				if (oDropDownsData.UserStatuses[i].BusinessTransaction === "LOST"){
					this.LostStatusCode =  oDropDownsData.UserStatuses[i].UserStatusCode ;
				}
			}
		}
		
	     var oEmptyUserStatus = 	 {
             	BusinessTransaction: "",
            	LanguageCode: "",
            	ProcessType: sProcessType,
            	StatusProfile: "",
            	UserStatusCode: "",
            	UserStatusText: "",
            };
		
	     aStatuses.splice(0,0,oEmptyUserStatus);
	     
	     
	     var oEmptyPriority =  {
	          	  LanguageCode: "",
	        	  PriorityCode: "",
	        	  PriorityText: "",
	          };
	        oDropDownsData.Priorities.splice(0,0,oEmptyPriority);
	       
	    var aSalesStages = [];
	    var length = oDropDownsData.SalesStages.length;
	    
	    for(var i = 0 ; i < length; i++){
	    	if(oDropDownsData.SalesStages[i].ProcessType === sProcessType){
	    		aSalesStages.push(oDropDownsData.SalesStages[i]);
	    	}
	    }
	        var oEmptySalesStage = {
					ChanceOfSuccess: "",
					LanguageCode: "",
					ProcessType: sProcessType,
					SalesStageCode: "",
					SalesStageDescription: "",
					SalesStageOrder: "",
				};
	        
	        
	        aSalesStages.splice(0,0,oEmptySalesStage);
	           
	     oDropDownsData.UserStatuses = aStatuses;
	     oDropDownsData.SalesStages = aSalesStages;
	 	
	
	},
	
	handleBatchRead : function(aResponses){

		//batch responses from initial launch of s3 view
		var data = {};
		var oDropDownsData = {};
		var bFail = false;
		var errorTitle;
		var errorMessage;
		var that = this;
		this.bAppLaunched = false;
		if (aResponses.__batchResponses[0].statusCode === "200") {
			oDropDownsData.SalesStages = aResponses.__batchResponses[0].data.results;

		} else {

			bFail = true;
			errorTitle = aResponses.__batchResponses[0].statusText;
			errorMessage = JSON.parse(aResponses.__batchResponses[0].response.body).error.message.value + "\n";

		}

		if (aResponses.__batchResponses[1].statusCode === "200") {
			oDropDownsData.Priorities = aResponses.__batchResponses[1].data.results;

		} else {

			bFail = true;
			errorTitle = aResponses.__batchResponses[1].statusText;
			errorMessage = JSON.parse(aResponses.__batchResponses[1].response.body).error.message.value + "\n";

		}
		if (aResponses.__batchResponses[2].statusCode === "200") {
			oDropDownsData.UserStatuses = aResponses.__batchResponses[2].data.results;

		} 
		
		else {
			bFail = true;
			errorTitle = aResponses.__batchResponses[2].statusText;
			errorMessage = JSON.parse(aResponses.__batchResponses[2].response.body).error.message.value + "\n";

		}
		if(aResponses.__batchResponses[3].statusCode === "200"){
			this.Currencies = aResponses.__batchResponses[3].data.results;
			this.byId("currency").setModel(new sap.ui.model.json.JSONModel({Currencies : this.Currencies}),"json");
		}
		else 
			{
			   bFail = true;
			   errorTitle = aResponses.__batchResponses[3].statusText;
			   errorMessage = JSON.parse(aResponses.__batchResponses[3].response.body).error.message.value + "\n";
			   
			 
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
		if (aResponses.__batchResponses[4]
				.hasOwnProperty("data")){
			
			data = aResponses.__batchResponses[4].data;
			
			var oProducts = data.Products;
			delete data.Products;
			data.Products = this._cloneProducts({Products : oProducts.results}).Products;
			
		}
		else
			this.handleErrors(aResponses.__batchResponses[4]);
		
		
		this._filterDropDownsByProcessType(oDropDownsData, data.ProcessType);
		
		data.UserStatuses = oDropDownsData.UserStatuses;
		data.Priorities = oDropDownsData.Priorities;
		data.SalesStages = oDropDownsData.SalesStages;
		
		this.bindHeaderFormsAndProducts(data);
		
	},

	bindEditView : function(bRefreshPage)
	{   
		var s3Controller;
		
		s3Controller = this.getView().getModel('controllers').getData().s3Controller;
		if(parseFloat(this.sBackendVersion) <4){
			this.byId('opportunityTotalNetValue_Label_S4').setVisible(false);
			this.byId('opportunityTotalNetValue_Text_S4').setVisible(false);
		}
		
		if(s3Controller === null || bRefreshPage){
			//bookmarking scenario of the edit page
			
			//always keep the delete buffer to empty
			this.deleteBuffer = [];
			this.BackendProducts = {};
			
			if(s3Controller === null && parseFloat(this.sBackendVersion) >= 4 && !bRefreshPage){
				//fetch eTag in an asynchronous call;
				cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath,this);
			}
			this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("SalesStages", "GET")]);
			this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Priorities","GET")]);
			this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("UserStatuses", "GET")]);
			this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Currencies","GET")]);
    	    //expand products
	        this.oModel.addBatchReadOperations([ this.oModel.createBatchOperation(this.sPath+"?$expand=Products,ChangeDocs,Competitors","GET") ]);	
	        
	        this.oModel.submitBatch(jQuery.proxy(this.handleBatchRead,this),function(oError){},true);
	        
	        return;
		}
		//always keep the delete buffer to empty
		this.deleteBuffer = [];
		this.BackendProducts = {};
		
	    this._saveETag(s3Controller.sETag);
		this.controller = s3Controller;
		var data = s3Controller.byId("info").getModel("json").getData();
		var oDropDownsData = {
				UserStatuses : JSON.parse(JSON.stringify(s3Controller.UserStatuses)),
				Priorities :   JSON.parse(JSON.stringify(s3Controller.Priorities)),
				SalesStages :  JSON.parse(JSON.stringify(s3Controller.SalesStages))
		};
		this._filterDropDownsByProcessType(oDropDownsData,data.ProcessType);
		
		data.UserStatuses = oDropDownsData.UserStatuses;
		data.Priorities =   oDropDownsData.Priorities;
		data.SalesStages =  oDropDownsData.SalesStages;
		
		var oProducts = s3Controller.byId('Product_Tab').getModel('json').getData();
	
		if(oProducts && oProducts.hasOwnProperty("Products")){
		     var oProductsClone; 
		     
		     if(oProducts.Products){
			
			  oProductsClone = JSON.parse(JSON.stringify(oProducts));
           		
			 for(var i=0;i< oProductsClone.Products.length;i++)
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
		}
		
		
		this.bindHeaderFormsAndProducts(data);
		this.byId("currency").setModel(new sap.ui.model.json.JSONModel({Currencies : this.Currencies}),"json");
		this.Currencies = s3Controller.Currencies;
		this.ContactCollection = s3Controller.ContactCollection;
		this.EmployeeCollection = s3Controller.EmployeeCollection;

		var expandEntities = "Statuses";	
		
		 //EXTENSION POINT
		   var detailController = this.getDetailController();
		   /**
			 * @ControllerHook extHookBindAdditionalFields is the controller hook that provide for setting values for additional fields
			 *                 from the detail screen that can be modified in the edit screen. The customer can access the data of the detail
			 *                 page by calling the getDetailController function.
			 *                 The customer can access the data of the detail page by calling the getDetailController
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookBindAdditionalFields
			 * @param {object}
			 *           detailController
			 * @return {void}
			 */
		  if (this.extHookBindAdditionalFields){
				this.extHookBindAdditionalFields(detailController);
			}
		
		
		
	},



//	on cancel in Edit
	onCancel : function()
	{
		if(this._checkDataLoss()){	
			sap.ca.ui.dialog.confirmation.open({	
				question : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),	
				title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),	
				confirmButtonLabel : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')     
			},jQuery.proxy(this.datalossDismissed,this));
		}

		else //simulating continue of dataloss dimisss - simlar to cancelling without any ch
		 this.datalossDismissed({isConfirmed : true});
		this.oModel.clearBatch();
			 },	
			 
  datalossDismissed : function(oResult){	      
	    if(oResult.isConfirmed){
	    	
	    	 var s3Controller = this.getDetailController();
	    	 if(s3Controller === null){
				 window.history.go(-1);
				 return;
			 }
	    	 
			 this.deleteBuffer = [];	
			 var ctx = "Opportunities(guid'" + this.headerGuid +"')";
			 this.bCancel = true;
			 if(!jQuery.device.is.phone){
				 
				
				 if(!this.fullScreenMode){
		     	 this.oRouter.navTo("detail", {
					 contextPath : ctx },!jQuery.device.is.phone);
				 }
				 else {
					 this.oRouter.navTo("display", {
						 contextPath : ctx },!jQuery.device.is.phone); 
				 }
		        
	    }
			 else{
				 
				 
				 this._navBack();
			 }
			
	    } },

	//validate and change the volume
	chanceOfSuccessChanged : function(oEvent)
	{
		var newValue = oEvent.getParameter('newValue'); 
		var pattern = /[^0-9.]/;
		if(pattern.test(newValue) === false)
		{
			if(newValue.split(".").length > 2)  //error
			{
				oEvent.getSource().setValue(this.OldcosValue);
				//oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			}
			else // no error 
			{
				this.OldcosValue = newValue;
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}

		}
		else //error 
		{
			//oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
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
				//oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);

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
	//called on descirption change 
	descriptionChanged : function(oEvent)
	{
		var descriptionField = this.byId('description');
		if(oEvent.getParameter('newValue').length > 40)
		{
			descriptionField.setValueState(sap.ui.core.ValueState.Error);
		}
		else
			descriptionField.setValueState(sap.ui.core.ValueState.None);
	},
	
pageNeedsUpdate : function(){
		
		//Fixing the chance of success if oppo win or lost
	
        this.oModel.clearBatch();
        
                
       var nBackendVersion = parseFloat(this.sBackendVersion);
       var oETag = null;
        //INTEROP CHECK - send {sETag : null} 
        	
			if(nBackendVersion >= 4.0){
				oETag = {sETag : null};
			}
			
         if  (this.WinStatusCode === this.byId('userStatus').getSelectedKey()){
			this.getView().byId("chanceOfSuccess").setValue( 100);

		}
		if  (this.LostStatusCode === this.byId('userStatus').getSelectedKey()){
			this.getView().byId("chanceOfSuccess").setValue(0);

		}
		this.requestNumber = 0;
		this.bBasketUpdate = false;
		this.changeSetMapping = {
				HEADER : "",
				CONTACT: "",
				EMPLOYEE :"",
				STATUS : "",
				BASKET : ""
				
					
		};
		var changeSet = []; 
		var headerGuid = this.headerGuid;
		var basketData = this.byId('productBasketEdit').getModel("json").getData();
		var oModel = this.oModel;
		var that  = this;
		//Store the new values
		
		//EXTENSION POINT
		//initializing the changeset to an empty array. Add oData requests to this changeSet array
		changeSet = [];
		//Your custom field might be updated by another oData request
		this.changeSetMapping.CUSTOM_UPDATE_REQUEST = "";
		
		//since this is the first request to be sent in the $batch, the request number is intialized to zero. Increment it on every request being added to changeSet
		this.requestNumber = 0;
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
		
		var tempEntry = {
				Guid : headerGuid,        
				Description : this.byId('description').getValue(),
				ExpectedSalesVolume : this.byId('expectedSalesVolume').getValue(),
				CurrencyCode :  this.byId('currency').getValue(),
				ChanceOfSuccess : this.byId('chanceOfSuccess').getValue(),
				StartDate : this.getDateTimeStampFromDatePicker(this.byId('datePickerStartDate')),
				ClosingDate :  this.getDateTimeStampFromDatePicker(this.byId('datePickerEndDate')),
				//EmployeeRespName : this.byId('inputEmpResponsible').getValue(),
				SalesStageCode : this.byId('stages').getSelectedKey(),
				UserStatusCode : this.byId('userStatus').getSelectedKey(),
				PriorityCode : this.byId('priority').getSelectedKey(),
				ForecastRelevance : this.byId('switch').getState(),
/*             //Removal of salesarea details in edit
				SalesOrganization: this.acc_salesorgid_new,
				SalesOrganizationDescription: this.acc_salesorgdesc_new,
				DistributionChannel: this.acc_dischaid_new,
				DistributionChannelDescription: this.acc_dischadesc_new,
				Division: this.acc_divid_new,
				DivisionDescription: this.acc_divdesc_new,*/
		};

		var entry = { };
		
		var key;	
		var needsUpdate = false;
          
		//Compare all in loop
		for(key in tempEntry)
		{
			switch(key){
			case "Guid"        :        entry[key] = tempEntry[key];
			                            break;
			case "StartDate"   :
			case "ClosingDate" :
									    if(!this._areDatesSame(this.HeaderObject[key],tempEntry[key])){
   								    		  entry[key] = tempEntry[key];
									    	  needsUpdate = true;
									    }    
			                            break;
			case "ChanceOfSuccess" : 
										if(Number(this.HeaderObject[key]) !== Number(tempEntry[key])){
											entry[key] = tempEntry[key];
											needsUpdate = true;
										}
										break;
			
			case "ExpectedSalesVolume" :  if(this.HeaderObject[key] !== tempEntry[key]){
				                                  entry[key] = tempEntry[key];
				                                  if(!entry.hasOwnProperty("CurrencyCode")){
				                                	  entry["CurrencyCode"] = tempEntry["CurrencyCode"];
				                                  }
				                                  
				                                  needsUpdate = true;
		                                    }
											break;
/*          //Removal of salesarea details in edit
			case "SalesOrganization" :
			case "SalesOrganizationDescription" :
			case "DistributionChannel" :
			case "DistributionChannelDescription" :
			case "Division" :
			case "DivisionDescription" :
										  sales area
										  if(this.HeaderObject[key] !== tempEntry[key] || bForceUpdate){
											  if(!entry.hasOwnProperty("SalesOrganization")){
							              	    entry["SalesOrganization"] = this.acc_salesorgid_new;
							              	    entry["SalesOrganizationDescription"] = this.acc_salesorgdesc_new;
							              	    entry["DistributionChannel"] = this.acc_dischaid_new;
							              	    entry["DistributionChannelDescription"] = this.acc_dischadesc_new;
							              	    entry["Division"] = this.acc_divid_new;
							              	    entry["DivisionDescription"] = this.acc_divdesc_new;
							              	    needsUpdate = true;
							                  }
										  }
										  break;
*/				
			default  :                 if(this.HeaderObject[key] !== tempEntry[key]){

											entry[key] = tempEntry[key];
											needsUpdate = true;
										 }
			
			
			}
		}			
			
		
		if(this._hasUserStatusChanged() || this._hasMainContactChanged() || this._hasEmployeeChanged()){
			needsUpdate = true;
		}
		
		  /**
		 * @ControllerHook extHookAddCustomHeaderFields is the controller hook that provides for adding additional fields that are part of the opportunity header.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomHeaderFields
		 * @param {object}
		 *          entry
		 * @return {boolean}
		 */
		if (this.extHookAddCustomHeaderFields){
			needsUpdate = needsUpdate ||  this.extHookAddCustomHeaderFields(entry);
		}
        	

		//if value is changed
		if(needsUpdate === true)
		{
			
			this.changeSetMapping.HEADER = this.requestNumber;
			this.requestNumber++;
			changeSet.push(oModel.createBatchOperation("Opportunities(guid'"+headerGuid+"')","MERGE",entry,oETag));
		}
		else
			this.changeSetMapping.HEADER = "";

		//only when status is changed
		if(this._hasUserStatusChanged())
		{
			//first search for the correct status profile
			this.changeSetMapping.STATUS = this.requestNumber;
			this.requestNumber++;
			var entry;
			var statusProfile;
			var j,tempLength;
			statusProfile = this.StatusProfile; 
			entry = {
					HeaderGuid : headerGuid,
					StatusProfile : statusProfile,
					UserStatusCode : this.byId('userStatus').getSelectedKey()
			};
			changeSet.push(oModel.createBatchOperation("OpportunityStatuses(StatusProfile='"+statusProfile+"',UserStatusCode='"+this.byId('userStatus').getSelectedKey()+"',HeaderGuid=guid'"+headerGuid+"')","MERGE"
					,entry,oETag));
		}
		else
			this.changeSetMapping.STATUS = "";

		
		if(!this._isContactFilledProperly()){
			return;
		}
		
		//updating main contact 
		if(this._hasMainContactChanged()){
			
			var url = "";
			var payload = {};
			
			if(this.byId('inputMainContact').getValue() === ""){
				url = "OpportunitySalesTeamSet(PartnerNumber='"+ "" +"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+this.headerGuid+"')";
				payload = {
						HeaderGuid : this.headerGuid,
						PartnerFunctionCode : "00000015",
						PartnerNumber : "",
						MainPartner : true
					};
			}
			else{
				url = "OpportunitySalesTeamSet(PartnerNumber='"+this.oSelectedContact.contactID+"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+this.headerGuid+"')";
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
			this.changeSetMapping.CONTACT = "";
		
		
		//updating employee responsible 
		  //updating employee responsible - only relevant from wave 4 onwards
		if(parseFloat(this.sBackendVersion) >= 2.0){
			
	    if(this._hasEmployeeChanged()){
	    	
	    	var url; 
	    	var payload = {};
	    	if(this.byId('inputEmpResponsible').getValue() === ""){
	    		url = "OpportunitySalesTeamSet(PartnerNumber='"+"',PartnerFunctionCode='00000014',HeaderGuid=guid'"+this.headerGuid+"')";
	    		payload = {
	    				HeaderGuid : this.headerGuid,
	    	    		PartnerFunctionCode : "00000014",
	    	    		PartnerNumber : "",
	    	    		MainPartner : true
	    		};
	    	}
	    	else{
	    		url ="OpportunitySalesTeamSet(PartnerNumber='"+this.oSelectedEmployee.employeeID+"',PartnerFunctionCode='00000014',HeaderGuid=guid'"+this.headerGuid+"')";
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
					ProductId : this.deleteBuffer[i].ProductId,
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
			
		//	oModel.addBatchChangeOperations([oModel.createBatchOperation("OpportunityProducts(HeaderGuid=guid'"+this.deleteBuffer[i].HeaderGuid+"',ItemGuid=guid'"+this.deleteBuffer[i].ItemGuid+"')","MERGE",entry,null)]);
		changeSet.push(oModel.createBatchOperation("OpportunityProducts(HeaderGuid=guid'"+this.deleteBuffer[i].HeaderGuid+"',ItemGuid=guid'"+this.deleteBuffer[i].ItemGuid+"')","MERGE",entry,oETag));
		}

		//Update of products - modify existing products, create added products
		var basketData = this.byId('productBasketEdit').getModel("json").getData();
		
		var changedBasket = this.byId('productBasketEdit').getItems();
		var i,length = 0,j;
		if(basketData.Products)
			length = basketData.Products.length;
		// NLUN - CodeScan Changes - Debugger statement should not be in the productive code
//		debugger;
		for(i=0;i<length;i++)
		{
			if(basketData.Products[i].Backend === "X")
			{
				//Search the BackendProducts if the update really needs to go through
				var oOldEntry = this.BackendProducts[basketData.Products[i].ItemGuid];
				var oNewEntry = basketData.Products[i];
				var bValue = false;
//				var val, index;
				
//				var cells = changedBasket[i].getCells();
//				for(j = 0; j < cells.length; j++){
//					if(cells[j].data("field") === "QUANTITY"){
//						 index = j;
//						var oNewQuantity = cells[j].getContent()[0];
//						val = parseFloat(oNewQuantity.getValue()) + "";
//						break;
//					}
//				}
//				
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
				
				var entry = {
						HeaderGuid : basketData.Products[i].HeaderGuid,
						ItemGuid : basketData.Products[i].ItemGuid,
						ProductGuid : basketData.Products[i].ProductGuid,
						ProcessingMode : "B"
				};
								
				if(oOldEntry.Quantity !== oNewEntry.Quantity)
				{
					this.bBasketUpdate = true;
					bValue = true;
					entry['Quantity'] =  oNewEntry.Quantity;
				}
				
				if(oOldEntry.TotalExpectedNetValue !== oNewEntry.TotalExpectedNetValue){
					this.bBasketUpdate = true;
					bValue = true;
					entry['TotalExpectedNetValue'] =  oNewEntry.TotalExpectedNetValue;
					
				} 
				

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
				
				if(bValue == true){
				changeSet.push(oModel.createBatchOperation("OpportunityProducts(HeaderGuid=guid'"+basketData.Products[i].HeaderGuid+"',ItemGuid=guid'"+basketData.Products[i].ItemGuid+"')",
							"MERGE",entry,oETag));
				}
				
			}

			else if(basketData.Products[i].Backend === "")
			{
				this.bBasketUpdate = true;
				var entry = {
						HeaderGuid : basketData.Products[i].HeaderGuid,
						ItemGuid :  "00000000-0000-0000-0000-000000000001",
						ProductId : basketData.Products[i].ProductId,
						Quantity : (basketData.Products[i].Quantity === "") ? "0" :  basketData.Products[i].Quantity,
						TotalExpectedNetValue :  (basketData.Products[i].TotalExpectedNetValue === "") ? "0" : basketData.Products[i].TotalExpectedNetValue  ,
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
				
				changeSet.push(oModel.createBatchOperation("OpportunityProducts","POST",entry,null));
			}
		}


		if(this.bBasketUpdate === true)
		{
			
			this.changeSetMapping.BASKET = this.requestNumber;
			this.requestNumber++;
		}
		else
			this.changeSetMapping.BASKET = "";
		//oModel.addBatchChangeOperations(changeSet);

		if(changeSet.length > 0){
			oModel.addBatchChangeOperations(changeSet);
			return true;
		}
			
	
		return false;
		
		
	},

	//Edit save 
	onEditSave : function(){
		//Form validation
		var oModel = this.oModel;
		oModel.bRefreshAfterChange = false;
		
		if(this.validateDates()===false)
		return;	
		if(this.validateEditPage() === false)
		{sap.ca.ui.message.showMessageToast(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MANDAT_FIELD'));
		return ;
		}
		if(this.validateCurrency()===true){

			sap.ca.ui.dialog.confirmation.open({
				question :this.currencyMessage,
				title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),
				confirmButtonLabel : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')   
			
			},jQuery.proxy(this.dataConfirm,this));
		}
		else
			this.dataConfirm({isConfirmed : true});
		

		
		
	},
	dataConfirm :function(oResult)
	{
		 if(oResult.isConfirmed){
		
		var oModel = this.oModel;
		if(this._checkDataLoss()){
		  var that1  = this;
		  this.pageNeedsUpdate();
		     if(this.requestNumber > 0)			
		        {
		    	 	// Here we need to disable the save button to prevent multi-click issue.
					this.setBtnEnabled("saveButton",false);
					sap.ca.ui.utils.busydialog.requireBusyDialog();
					var x = oModel.submitBatch(function(oResponses){
		
						that1.handleBatchResponses(oResponses);
		
					},
					function(oError){
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						that1.setBtnEnabled("saveButton",true);			
						
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('SAVE_FAILED'),							
						});												
					},true
					);
		         }
		 }
		 /*else
			 return;*/
		 
		 else{
			 this.datalossDismissed({isConfirmed : true});
			 this.oModel.clearBatch();
		 }
		 }
	},


	handleBatchResponses : function(oResponses)
	{
		var statuses = [];
		var responseObject;
		var bHeaderUpdateSuccess = false;
		var bStatusUpdateSuccess = false;
		var bPartialUpdate = false;
		var bFail = false;
		var b412Error = false;
		var errorMessage ="";
		this.bEmployeeUpdateSuccess = false;
		var length = oResponses.__batchResponses.length;
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
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
				statuses.push(responseObject.statusText);
				bFail = true;
				errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
				if(parseInt(responseObject.statusCode) === 412){
					b412Error = true;
				}
				
			}	
			else
			{
				this.HeaderObject.Description = this.byId('description').getValue();
				this.HeaderObject.StartDate =this.byId('datePickerStartDate').getDateValue();
				this.HeaderObject.ClosingDate = this.byId('datePickerEndDate').getDateValue();
				this.HeaderObject.SalesStageDescription = this.byId('stages').getSelectedItem().getText();
				this.HeaderObject.SalesStageCode = this.byId('stages').getSelectedKey();
				this.HeaderObject.PriorityText = this.byId('priority').getSelectedItem().getText();
				this.HeaderObject.PriorityCode = this.byId('priority').getSelectedKey();
				this.HeaderObject.ExpectedSalesVolume = this.byId('expectedSalesVolume').getValue();
				this.HeaderObject.ChanceOfSuccess = this.byId('chanceOfSuccess').getValue();
				this.HeaderObject.CurrencyCode = this.byId('currency').getValue();
				this.HeaderObject.ForecastRelevance = this.byId('switch').getState();
/*				//Removal of salesarea details in edit
				this.HeaderObject.SalesOrganization = this.acc_salesorgid_old;
				this.HeaderObject.SalesOrganizationDescription = this.acc_salesorgdesc_old;
				this.HeaderObject.DistributionChannel = this.acc_dischaid_old;
				this.HeaderObject.DistributionChannelDescription = this.acc_dischadesc_old;
				this.HeaderObject.Division = this.acc_divid_old;
				this.HeaderObject.DivisionDescription = this.acc_divdesc_old;
*/				
				bHeaderUpdateSuccess = true;
				bPartialUpdate=true;
			}
		}
		if(this.changeSetMapping.STATUS !== "")
		{
			responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.STATUS];
			if(parseInt(responseObject.statusCode) < 400 )
			{
				this.HeaderObject.UserStatusCode = this.byId('userStatus').getSelectedKey();
				this.HeaderObject.UserStatusText = this.byId('userStatus').getSelectedItem().getText();
				bStatusUpdateSuccess = true;
				bPartialUpdate=true;
				
			}
			else
			{
				statuses.push(responseObject.statusText);
				bFail  = true;
				errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
				if(parseInt(responseObject.statusCode) === 412){
					b412Error = true;
				}
			}
		}
		if(this.changeSetMapping.CONTACT !== "")
		{
			responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.CONTACT];
			if(parseInt(responseObject.statusCode) >= 400 )
			{
				statuses.push(responseObject.statusText);
				bFail  = true;
				errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
				if(parseInt(responseObject.statusCode) === 412){
					b412Error = true;
				}
			}
			else
			{
				bPartialUpdate = true;
				this.HeaderObject.MainContactId = this.oSelectedContact.contactID;
				this.HeaderObject.MainContactName = this.oSelectedContact.fullName;
			}
		}
		//relevant only for backend schema versions >= 2.0 	
		if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2.0){
			if(this.changeSetMapping.EMPLOYEE !== "")
			{
				responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.EMPLOYEE];
				if(parseInt(responseObject.statusCode) >= 400 )
				{
					//main contact update failure - push error text into statuses array
					statuses.push(responseObject.statusText);
					bFail  = true;
					errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
					this.oSelectedEmployee.employeeID = this.HeaderObject.EmployeeResponsibleNumber;
					this.oSelectedEmployee.fullName = this.HeaderObject.EmployeeResponsibleName;
					if(parseInt(responseObject.statusCode) === 412){
						b412Error = true;
					}

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
			var i;
			var length = oResponses.__batchResponses[0].__changeResponses.length;
			
			for(i = this.changeSetMapping.BASKET;i<length;i++)
			{
			
				responseObject = oResponses.__batchResponses[0].__changeResponses[i];
				if(parseInt(responseObject.statusCode) >= 400 )
				{
					statuses.push(responseObject.statusText);
					bFail  = true;
					errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
					if(parseInt(responseObject.statusCode) === 412){
						b412Error = true;
					}
				}
				else
					bPartialUpdate = true;

			}
			
		}
		
		
		if(b412Error === true){
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
			},jQuery.proxy(function(){
				this._refreshOpportunity();
			},this));
			
			return;
		}
		
			if(bPartialUpdate && bFail)
			{
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('PARTIAL_SAVE'),
					details: errorMessage
				},function(){});
				return;
			}
			if(!bPartialUpdate && bFail)
			{
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('SAVE_FAILED'),
					details: errorMessage
				},function(){});
				return;
			}
		}
		else{
			if(this._is412Error(oResponses)){
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
				},jQuery.proxy(function(){
					this._refreshOpportunity();
					
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
		
		if(bHeaderUpdateSuccess || bStatusUpdateSuccess)
			this.refreshHeaderList();

		if(bFail)
		{
			this.bSuccessSave = false;
			
			{
				//save failed
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('SAVE_FAILED'),
					details: errorMessage
				},function(){});
			}
		}
		else
		{
			var ctx = "Opportunities(guid'"+this.headerGuid+"')";

			this.bSuccessSave = true;
			// Notify listeners for the event that opportunity has been changed.
			sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "opportunityChanged", {
				contextPath : ctx
			});
            
			sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('OPP_SAVED'),{
				closeOnBrowserNavigation : false
			}); 
			this.bNavOnUpdate = true;
			
			var s3Controller = this.getDetailController();
			
			if(s3Controller === null){
				window.history.go(-1);
				return;
			}
			if(!jQuery.device.is.phone)
				{
				if(!this.fullScreenMode)
				this.oRouter.navTo("detail", {
					contextPath : ctx },!jQuery.device.is.phone);
				
				else
					this.oRouter.navTo("display", {
						contextPath : ctx },!jQuery.device.is.phone);	
				}
			else
				this._navBack();
			
			
		}
		
	    if(parseFloat(this.sBackendVersion) >= 4){
	       //refresh eTag		
			cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath,this);
	    }
	
	},

	refreshHeaderList : function()
	{
		 var sPath = "/" + "Opportunities(guid'" + this.headerGuid + "')";
		   var item = this.getItemFromSPath(sPath);
		   if(!item){
			 //better refresh the model when we are not able to update the list item from the client side
			   this.oModel.refresh();
			   return;
		   }
		   if(!this.s2Controller){
			   return;
		   }
		   
		   //also update the toolbar text if opportunity filter exists on the master list
		   if(this.s2Controller.opportunityID || this.s2Controller.nGuid){
		
			   this.s2Controller.desc = this.HeaderObject["Description"];
		   	   this.s2Controller.byId("labelInfo").setText(this.s2Controller.desc);
		   
		   }  
		   var key;
		   var data = item.getBindingContext().getObject();
		   for(key in this.HeaderObject){
			   data[key] = this.HeaderObject[key];
		   }
		   this.s2Controller.getList().updateItems();
	//	s2Controller.getView().getModel().refresh();
	}, 
	
	 getItemFromSPath : function(sPath)
	   {
		   if(!this.s2Controller){
			   return null;
		   }
		   var items = this.s2Controller.getList().getItems();
		   var i;
		   var context = this.oModel.getContext(sPath);
		   for(i=0;i<items.length;i++){
			   if(context === items[i].getBindingContext()){
		           return items[i];
			   }
		   }
		   return null;
	   },

	   onAddProduct : function(oEvent){

			
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


	validateEditPage : function()
	{
		var check_error = false;
		
		if(this.byId('description').getValue() === ""){
			this.byId('description').setValueState(sap.ui.core.ValueState.Error);
			check_error = true; 
		}


		if(this.byId('expectedSalesVolume').getValue() === ""){
			this.byId('expectedSalesVolume').setValue(0);

		}

		if(this.byId('description').getValueState() === sap.ui.core.ValueState.Error)
			check_error = true; 
		if((this.byId('datePickerStartDate').getValueState() === sap.ui.core.ValueState.Error) || (this.byId('datePickerEndDate').getValueState() === sap.ui.core.ValueState.Error)){
			check_error = true;
		}

		if(this.byId('chanceOfSuccess').getValueState() === sap.ui.core.ValueState.Error)
			check_error = true; 
		if(this.byId('expectedSalesVolume').getValueState() === sap.ui.core.ValueState.Error)
			check_error = true; 
		if(this.byId('datePickerEndDate').getValue() === ""){
			this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.Error);
			check_error = true;   
		}
		
		if(this.validateProductBasket() === false){
			check_error = true;
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
			   			check_error = true;
			   		}
			   	}
		
		if (check_error == true ){
			return false;
		}
		
		return true;	
	},
	
	validateProductBasket : function(){
	
		var items = this.byId('productBasketEdit').getItems();
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
	validateCurrency : function(){
		var currLenght = this.Currencies.length ;
		var bReturnError = true;
		var currencyInput = this.getView().byId("currency").getValue().trim();
		currencyInput = 		currencyInput.toLocaleUpperCase();
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


	validateDates : function(){
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
	quantityChanged : function(oEvent)
	{
		var data = oEvent.getSource().getBindingContext("json").getObject();
		var newValue = oEvent.getParameter('newValue'); 
		var pattern = /[^0-9.]/;
		var listItem = oEvent.getSource().getParent().getParent();
		if(pattern.test(newValue) === false)
		{
			if(newValue.split(".").length > 2)  //error
			{
				data.Quantity = data.OldValue;
				oEvent.getSource().setValue(data.Quantity);
			}
			else // no error 
			{
				data.OldValue = newValue;
				data.Quantity = newValue;
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				var tempValue = newValue;
				if(newValue === "")
					tempValue = "0";
				var unitPriceCell = null;
				var totalNetValCell = null;
				var cells = listItem.getCells();
				//do a sweep on cells to get the unit price cell and the net value cell
				for(var i = 0; i < cells.length; i++){
					if(cells[i].data("field") === "NETVALUE"){
						unitPriceCell = cells[i];
					}
					
					if(cells[i].data("field") === "TOTALNETVALUE"){
						totalNetValCell = cells[i];
					}
				}
				
				if(unitPriceCell && totalNetValCell){
				var unitPrice = unitPriceCell.getNumber();
				if(unitPrice === ""){
					// NLUN - CodeScan Changes - Global variables

					var setUnitPrice = "0";
					
					//listItem.getCells()[3].setText("" + parseFloat(tempValue)*parseFloat(setUnitPrice));
				}else

					totalNetValCell.setNumber("" + parseFloat(tempValue)*parseFloat(unitPrice));
			}
			}
		}
		else //error 
		{
			data.Quantity = data.OldValue;
			oEvent.getSource().setValue(data.Quantity);
		}
	},

	onCancelDialog : function(oEvent)
	{
		this.oAddProductsFragment.close();
		this.oAddProductsFragment.getContent()[0].removeSelections();	
	},
    enableProductsAddButton : function(oEvent){
    	
       if(this.oAddProductsFragment.getContent()[0].getSelectedItems().length > 0){
    	   this.oAddProductsFragment.getBeginButton().setEnabled(true);
       }
       else{
    	   this.oAddProductsFragment.getBeginButton().setEnabled(false);
       }
    },
	onAddDialog : function(oEvent)
	{
		var oProductList = this.oAddProductsFragment.getContent()[0];
		var oSelectedItems = oProductList.getSelectedItems(); 
		var headerGuid = this.headerGuid;
		var productBasketData = {
				Products : []
		};

		var data = this.byId('productBasketEdit').getModel("json").getData();
		if(data && data.hasOwnProperty("Products"))
			productBasketData.Products = data.Products;
		// var headerGuid = this.headerGuid;
		var i = 0;
		var length = oSelectedItems.length;
		var oListItem;
		for (i = 0; i < length; i++) {
			oListItem = oSelectedItems[i];
			var tempObject = oListItem.getBindingContext("json").getObject();

			var pushObject = {
					HeaderGuid: headerGuid,	
					ItemGuid : "",
					ProcessingMode : "",
					ProductGuid : tempObject.ProductGuid,
					ProductId : tempObject.ProductId,
					ProductName : tempObject.ProductDescription,
					Quantity : "1",
					Unit : tempObject.Unit,
					Backend : "",
					OldValue : "1",
					TotalExpectedNetValue: ""

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
		this.byId('productBasketEdit').getModel("json").updateBindings();
		oProductList.removeSelections();
		oEvent.getSource().getParent().close();
	},

	deleteProduct : function(oEvent)
	{
		var data = oEvent.getSource().getModel("json").getData();
		var product = oEvent.getSource().getBindingContext("json").getObject();
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
		this.byId('productBasketEdit').getModel("json").updateBindings();

	},

	formatDate : function(inputDateValue)
	{
		if(inputDateValue === "" || inputDateValue === null || inputDateValue === undefined)
			return "";
		var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},locale);
		return formatter.format(inputDateValue);
	},

	//Handling contact f4 help (open and load)
	showContactF4 : function(oEvent)
	{
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
        //var searchstrng = Text[0].trimRight();
        var searchstrng = Text[0].replace(/\s+$/,"");
        this.contactF4Fragment.getSubHeader().getContentLeft()[0].setValue(searchstrng);
		var opportunity_Data =this.HeaderObject;
		this.contactF4Fragment.open();
		var jsonModel = new sap.ui.model.json.JSONModel();
		this.contactF4Fragment.setModel(jsonModel,"json");
		if(opportunity_Data.ProspectNumber !== "")
		{
			toolbar.setVisible(true);
			if(opportunity_Data.ProspectName !== ""){
			toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + opportunity_Data.ProspectName);	
			}
			else{
				toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + opportunity_Data.ProspectNumber);
			}
			this.oModel.read("/AccountCollection(accountID='" + opportunity_Data.ProspectNumber + "')/Contacts",null,["$filter=substringof('"+this.byId('inputMainContact').getValue()+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
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
     else{
    	 toolbar.setVisible(false);
    	 this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
	     this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
	    this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
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
	
/* 
    //Removal of salesarea details in edit
	closeSalesAreaF4 : function(oEvent)
	{
		if(this.salesareaF4Fragment !== undefined)
			this.salesareaF4Fragment.close();
	},

	setSalesArea : function(oEvent) {
		
		this.oSelectedContact = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
		
		this.acc_salesorgid_new = this.oSelectedContact.SalesOrganizationId;
		this.acc_salesorgdesc_new = this.oSelectedContact.SalesOrganizationText;
		var salesorganization = cus.crm.opportunity.util.Formatter.formatSalesOrganization(this.acc_salesorgdesc_new, this.acc_salesorgid_new);
		this.getView().byId("salesorganization_Text").setText(salesorganization);
		
		this.acc_dischaid_new = this.oSelectedContact.DistrubutionChannelId;
		this.acc_dischadesc_new = this.oSelectedContact.DistrubutionChannelText;
		var distributionchannel = cus.crm.opportunity.util.Formatter.formatDistributionChannel(this.acc_dischadesc_new, this.acc_dischaid_new);
		this.getView().byId("distributionchannel_Text").setText(distributionchannel);

		this.acc_divid_new = this.oSelectedContact.DivisionId;
		this.acc_divdesc_new = this.oSelectedContact.DivisionText;
		var division = cus.crm.opportunity.util.Formatter.formatDivision(this.acc_divdesc_new, this.acc_divid_new);
		this.getView().byId("division_Text").setText(division);

		this.salesareaF4Fragment.getContent()[0].removeSelections();
		this.closeSalesAreaF4(oEvent);
	},
	
	//show sales area f4 help (open and load) after entering account id
	showSalesAreaF4 : function(oEvent)
	{
		
		var accountId = this.HeaderObject.ProspectNumber;
		var accountName = this.HeaderObject.ProspectName;

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

		if(accountId !== "")
		{
			toolbar.setVisible(true);
			toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + accountName);	
			this.oModel.read("/SalesAreas",null,["$filter=ProspectNumber eq '"+ accountId + "'"],true,jQuery.proxy(function(odata,response) {
			
				this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
				this.salesareaF4Fragment.getModel('json').setData({ 
					SalesAreaCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
				});
			    this.salesareaF4Fragment.getModel('json').updateBindings();
			},this),jQuery.proxy(function(oError)
					{
				this.salesareaF4Fragment.getModel('json').setData({
					SalesAreaCollection : []
				});
				this.salesareaF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
					},this));
			
			this.salesareaF4Fragment.open();
		}
	},
	*/
	//Handling employee f4 help (open and load)
	showEmployeeF4 : function(oEvent)
	{
		 //throw the employee f4 dialog 
	
		if(!this.employeeF4Fragment){	
			this.employeeF4Fragment  =  new sap.ui.xmlfragment(this.createId("employeeF4"), 'cus.crm.opportunity.view.EmployeeF4', this);  	
			//employeeF4 is backed  by json model 
			this.employeeF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");	
			this.employeeF4Fragment.setModel(this.oI18nModel,'i18n');
		}

		
		
//		this.employeeF4Fragment.getContent()[0].removeSelections();
//		this.employeeF4Fragment.setModel(new sap.ui.model.json.JSONModel());
//		this.employeeF4Fragment.setModel(this.controller.getView().getModel(
//		"i18n"), "i18n");
		
		this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
		var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
		
		var toolbarLabel = toolbar.getContent()[0];
		toolbar.setVisible(false);
		var searchtxt = this.byId('inputEmpResponsible')._lastValue;
        var Text = searchtxt.split('/'); 
        var searchstrng = Text[0].replace(/\s+$/,"");
        this.employeeF4Fragment.getSubHeader().getContentLeft()[0].setValue(searchstrng);
		var opportunity_Data = this.HeaderObject;
		this.employeeF4Fragment.open();
		var jsonModel = new sap.ui.model.json.JSONModel();
		this.employeeF4Fragment.setModel(jsonModel,"json");
		if(opportunity_Data.ProspectNumber !== "")
		{
			toolbar.setVisible(true);
			if(opportunity_Data.ProspectName !== ""){
			toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + opportunity_Data.ProspectName);
			}
			else{	
			toolbarLabel.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER') + " " + opportunity_Data.ProspectNumber);
			}
			this.oModel.read("/AccountCollection(accountID='" + opportunity_Data.ProspectNumber + "')/EmployeeResponsibles",null,["$filter=substringof('"+this.byId('inputEmpResponsible').getValue()+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
			
				this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
				this.employeeF4Fragment.getModel('json').setData({ 
					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
				});
			
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
	     this.oModel.read("EmployeeCollection",null,["$filter=substringof('"+this.byId('inputEmpResponsible').getValue()+"'"+",fullName)"],true,jQuery.proxy(function(odata,response)
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
	},


	closeContactF4 : function(oEvent)
	{
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData({ContactCollection : []});
		this.contactF4Fragment.setModel(jsonModel,"json");
		this.contactF4Fragment.close();
	},
	closeEmployeeF4 : function(oEvent)
	{
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData({EmployeeCollection : []});
		this.employeeF4Fragment.setModel(jsonModel,"json");
		this.employeeF4Fragment.close();
	},

	setContact : function(oEvent)
	{
		this.oSelectedContact = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
		if(this.oSelectedContact.fullName !== "")
			this.byId('inputMainContact').setValue(this.oSelectedContact.fullName);
		else 
			this.byId('inputMainContact').setValue(this.oSelectedContact.contactID);
		this.contactF4Fragment.getContent()[0].removeSelections();
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData({ContactCollection : []});
		this.contactF4Fragment.setModel(jsonModel,"json");
		this.contactF4Fragment.close();

	},
	setEmployee : function(oEvent)
	{
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
	searchContact : function(oEvent)
	{
		var sValue = oEvent.getParameter("query");
		this.contactF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
		var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
		if(toolbar.getVisible()===false){
			this.oModel.read("ContactCollection",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
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
			this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
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
			this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/EmployeeResponsibles",null,["$filter=substringof('"+sValue+"'"+",fullName)"],true,jQuery.proxy(function(odata,response) {
			
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
		this.oModel.read("ContactCollection",null,["$filter=substringof('" + searchText + "',fullName)" ],true,jQuery.proxy(function(odata,response)
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
		this.oModel.read("EmployeeCollection",null,["$filter=substringof('" + searchText + "',fullName)" ],true,jQuery.proxy(function(odata,response)
				{
			this.employeeF4Fragment.getModel('json').setData({ 
				EmployeeCollection : response.data.results 	        		
			});
					
			if(response.data.results.length === 0)
				this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_EMPLOYEE'));     
				},this),jQuery.proxy(function(oError)
						{
					this.employeeF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_EMPLOYEE'));

						},this));
		
	},

	//open and load of currency
	showCurrencyF4 : function(){
		this.oActionSheet = sap.ui.xmlfragment(
				"cus.crm.opportunity.view.CurrencySelectDialog",
				this);
		this.oActionSheet.setModel(this.getView().getModel(
		"i18n"), "i18n");
		var oModel = this.oModel;
		var jsonModel = new sap.ui.model.json.JSONModel();
		var data1;
		oModel.read("Currencies",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
				{ data1 = {
						Currencies : resp.data.results
				};
				});
		jsonModel.setData(data1);
		this.oActionSheet.setModel(jsonModel,"json");
		this.oActionSheet.open();
	},

	//set currency
	setCurrency : function(oEvent) {

		var selectedItem = oEvent.getParameter("selectedItem");
		this.byId('currency').setValue(selectedItem.data("CurrencyKey"));

	},

	//search currency
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

	//Close currency dialog
	closeCurrencyF4 : function(oEvent) {

		this.byId('dialogCurrencyF4').close();
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
			aFilters.push("$filter=substringof('" + sQuery  + "',ProductDescription)");
		}
		this.oModel.read("Products",null,aFilters,true,jQuery.proxy(function(odata,response){
			
			if(response.data.results.length === 0)
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
			this.oAddProductsFragment.getModel('json').setData({Products : response.data.results});
			
			
		},this),jQuery.proxy(function(oError){
			
			this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));
			
		},this));
	},
	
getDateTimeStampFromDatePicker : function(datePicker){
		
	 //always return UTC date
	  var labelDate = $('#' + datePicker.getIdForLabel()).val();
	  
	  if(labelDate === ""){
		  return null;	
	  }
	  var currentDate = this.oDateFormatter.parse(labelDate);
	  var year = currentDate.getFullYear();
	  var month = currentDate.getMonth();
	  var day = currentDate.getDate();
	  return new Date(Date.UTC(year,month,day));

			
	},
	getDetailController : function(){
		
		return this.getView().getModel('controllers').getData().s3Controller;
	},
	onBack : function(){
		this.onCancel();
	},
	
	dataLossOnBack : function(oResult){
		if(oResult.isconfirmed){
			this.oRouter._navBack();
		}
	},
	
	getHeaderFooterOptions : function(){
		
		var fnBack;
		var s3Controller = this.getDetailController();
		if(jQuery.device.is.Phone || (this.fullScreenMode &&  s3Controller === null)){
			fnBack = jQuery.proxy(this.onBack,this);
		}
		else{
			fnBack = null;
		}
	   	return {
	   		onBack : fnBack,
			sI18NDetailTitle : this.oResourceBundle.getText('EDIT_TITLE'),
			buttonList : [{sI18nBtnTxt : "SAVE",
							sId:"saveButton",
							onBtnPressed : jQuery.proxy(this.onEditSave,this)
							},
							{
							   sI18nBtnTxt : 'CANCEL',
							   onBtnPressed : jQuery.proxy(this.onCancel,this)
								
							}],
	   	     bSuppressBookmarkButton : true
			
	   	};
	   	
	},
	
	isMainScreen : function(){
		return false;
	},
	
	handleErrors : function(oError){
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
     
     _checkDataLoss : function(){
    	 
    	 var headerGuid = this.headerGuid;
    	 var tempEntry = {
 				Guid : headerGuid,        
 				Description : this.byId('description').getValue(),
 				ExpectedSalesVolume : this.byId('expectedSalesVolume').getValue(),
 				CurrencyCode :  this.byId('currency').getValue(),
 				ChanceOfSuccess : this.byId('chanceOfSuccess').getValue(),
 				StartDate : this.getDateTimeStampFromDatePicker(this.byId('datePickerStartDate')),
 				ClosingDate :  this.getDateTimeStampFromDatePicker(this.byId('datePickerEndDate')),
 				//EmployeeRespName : this.byId('inputEmpResponsible').getValue(),
 				SalesStageCode : this.byId('stages').getSelectedKey(),
 				UserStatusCode : this.byId('userStatus').getSelectedKey(),
 				PriorityCode : this.byId('priority').getSelectedKey(),
 				ForecastRelevance : this.byId('switch').getState(),
 	/*          //Removal of salesarea details in edit
				SalesOrganization: this.acc_salesorgid_new,
				SalesOrganizationDescription: this.acc_salesorgdesc_new,
				DistributionChannel: this.acc_dischaid_new,
				DistributionChannelDescription: this.acc_dischadesc_new,
				Division: this.acc_divid_new,
				DivisionDescription: this.acc_divdesc_new,*/
 		};
    	 
    	var key;
    	var entry = {};
    	//Compare all in loop
 		for(key in tempEntry)
 		{
 			switch(key){
 			
 			case "StartDate"   :
 			case "ClosingDate" :
 									    if(!this._areDatesSame(this.HeaderObject[key],tempEntry[key])){
    								    		 
 									    	return true;
 									    }    
 			                            break;
 			case "ChanceOfSuccess" : 
 										if(Number(this.HeaderObject[key]) !== Number(tempEntry[key])){
 											
 											return true;
 										}
 										break;
 			
 			case "ExpectedSalesVolume" :  if(this.HeaderObject[key] !== tempEntry[key]){
 				                                 return true;
 		                                    }
 			default  :                 if(this.HeaderObject[key] !== tempEntry[key]){
 										 		
 											return true;
 										 }
 			
 			
 			}
     }
         
 		if (this.extHookAddCustomHeaderFields){
			  var bValue =  this.extHookAddCustomHeaderFields(entry);
			  
			  if(bValue){
				  return true;
			  }
		}
 		if(this.userStatusCode !== this.byId('userStatus').getSelectedKey()){
 			return true;
 		}
 		   
 		if(this.HeaderObject.MainContactId !== this.oSelectedContact.contactID || 
				this.HeaderObject.MainContactName !== this.byId('inputMainContact').getValue()){
 		    return true;
 		}
 		
 		if(parseFloat(this.sBackendVersion) >= 2.0){
			
 		    if(this.HeaderObject.EmployeeResponsibleNumber !== this.oSelectedEmployee.employeeID ||
 		    	this.HeaderObject.EmployeeResponsibleName !== this.byId('inputEmpResponsible').getValue()){
 		    	return true;
 		    }
 		}
 		
 		//Deletion of products happening
 		if(this.deleteBuffer.length > 0){
 			return true;
 		}
 		
 		var basketData = this.byId('productBasketEdit').getModel('json').getData();
 		
 		var length = basketData.Products.length;
 		
 		for(var i = 0; i < length ; i++){
 			
 			if(basketData.Products[i].Backend === "X"){
			//Search the BackendProducts if the update really needs to go through
			var oOldEntry = this.BackendProducts[basketData.Products[i].ItemGuid];
			var oNewEntry = basketData.Products[i];
			var bValue = false;
			
			if(oOldEntry.Quantity !== oNewEntry.Quantity)
			{
				return true;
			}
			
			if(oOldEntry.TotalExpectedNetValue !== oNewEntry.TotalExpectedNetValue){
				return true;
			} 
			
		
			if (this.extHookCheckDeltaOnProductEntry){
			    bValue =  this.extHookCheckDeltaOnProductEntry(oOldEntry,oNewEntry);
			    if(bValue){
			    	return true;
			    }
			}
 			}
 			else{
 				return true;
 			}
		
 		}
 		return false;
     },
     
     _updateDeleteBuffer : function(){
    	 
    	 var aProducts = this.byId('productBasketEdit').getModel('json').getData().Products;
        for(var i = 0; i < this.deleteBuffer.length; i++){
            var bFound = false;
        	for(var j = 0; j < aProducts.length; j++){
        		if(this.deleteBuffer[i].ItemGuid === aProducts[i].ItemGuid){
        			bFound = true;
        			break;
        		}
        	}
        	
        	if(!bFound){
        		this.deleteBuffer.splice(i,1);
        	    i--;
        	}
        	
        }
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
                 			var employeeInput = this.getView().byId("inputEmpResponsible");
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
                                                            	
                          	this.byId('inputEmpResponsible').setValue(oemployee.fullName);
        				    this.employeeName = oemployee.fullName;                				    
        				    this.oSelectedEmployee.employeeID = oemployee.employeeID;             				    
        				                                  
                                         				    
                          },
                          
                          
                          onEmployeeInputFieldChanged: function(oEvent) {
                         	 this.byId('inputEmpResponsible').setValueState(sap.ui.core.ValueState.None);
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
                                  		
    	// code for 4 letter search in Currency field                               		
                                  		
                                  		
                                  		liveSearchCurrency : function(oEvent){

                                  			var sVal = oEvent.getParameter("value");

                                  			if (sVal.length == 0 || (sVal && sVal.length > 3)) {
                                  			var filters = new sap.ui.model.Filter([
                                  					new sap.ui.model.Filter("CurrencyText",
                                  					sap.ui.model.FilterOperator.Contains,
                                  					sVal)], false);
                                  			oEvent.getParameter("itemsBinding").filter([filters]);


                                  			}


                                  			},
                                  			
                                  			_saveETag : function(sETag){
                                  				this.sETag = sETag;
                                  			},
                                  			
                                  			_refreshOpportunity : function(){
                                  				this.bindEditView(true);
                                  				
                                  				if(parseFloat(this.sBackendVersion) >= 4){
                                  				cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath,this);
                                  				}
                                  			},
                                  			
                                  			_is412Error : function(oResponses){
                                  			
                                  				for(var i = 0 ; i < oResponses.__batchResponses.length;i++){
                                  					if(oResponses.__batchResponses[i].response.statusCode === "412"){
                                  						return true;
                                  					}
                                  				}
                                  				return false;
                                  			},
                                  			
                                  			
                                  			
                                  			_hasUserStatusChanged : function(){
                                  				return (this.userStatusCode !== this.byId('userStatus').getSelectedKey());
                                  			},
                                  			
                                  			_isContactFilledProperly : function(){
                                  			//Check if contact is filled correctly
                                  				if(this.byId("inputMainContact").getValue()!= this.oSelectedContact.fullName){
                                  					if(this.byId("inputMainContact").getValue()!=""){
                                  					this.showContactF4();
                                  					this.requestNumber = 0;
                                  					this.oModel.clearBatch();
                                  					return false;
                                  					}
                                  					
                                  				}
                                  				
                                  				return true;
                                  			},
                                  			
                                  			_hasMainContactChanged : function(){
                                  			return (this.HeaderObject.MainContactId !== this.oSelectedContact.contactID || 
                                				this.HeaderObject.MainContactName !== this.byId('inputMainContact').getValue());
                                  			},
                                  			
                                  			_hasEmployeeChanged : function(){
                                  				return (this.HeaderObject.EmployeeResponsibleNumber !== this.oSelectedEmployee.employeeID ||
                                  		    	this.HeaderObject.EmployeeResponsibleName !== this.byId('inputEmpResponsible').getValue());
                                  			}
                                  			
                              		
     
     
});











