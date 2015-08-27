/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("cus.crm.lead.util.formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("cus.crm.lead.util.schema");
jQuery.sap.require("cus.crm.lead.util.Util");

sap.ca.scfld.md.controller.ScfldMasterController.extend("cus.crm.lead.view.S2", {
	
	numberOfLeads: 0,
	sPath : "",
	bAppLaunched : false,
	accountID: undefined, 
	bFilterOpen : false,

	onInit : function() {
		
		// execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.BaseMasterController.prototype.onInit.call(this);
		
		var view = this.getView();
		var self = this;
		
		//Get accountID query parameter
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var myComponent = sap.ui.component(sComponentId);
		this.oModel = this.byId('list').getModel();
	
		if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
			jQuery.sap.log.debug("startup parameters are " + JSON.stringify(myComponent.getComponentData().startupParameters));
			if (undefined != myComponent.getComponentData().startupParameters.accountID) {
				this.accountID = myComponent.getComponentData().startupParameters.accountID[0]; //this.accountID is the contextual filter from accounts app
			}
			else if(myComponent.getComponentData().startupParameters.leadID != null){
				this.leadID = myComponent.getComponentData().startupParameters.leadID[0];
			}
		}
		this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle(); 
		var oList = this.getList();
		this.oShowSheet = sap.ui.xmlfragment(this
				.createId("showLeadFragment"),
				"cus.crm.lead.view.showMaxHit",
		
				this);
		
		this.oAppImpl = sap.ca.scfld.md.app.Application.getImpl();
		 this.oTemplate = oList.getItems()[0].clone();
		var afilters = this.getFilters(); //dynamic filters
		oList.bindAggregation("items" , {path:'/Leads' , template :this.oTemplate, filters:afilters });       
		var oModel = this.getView().getModel();
		oModel.bRefreshAfterChange = false;
		// register success handler
		var successHandler = function(oEvent) {
			
			if(this.accountID !== undefined)
			   {
				var oListBinding = this.getList().getBinding('items');
				if(oListBinding && oListBinding.getLength() > 0)
				   this.setAccountName();
				else
					this.accountID = undefined;
			   }
			
			var numberOfLeads = this.getList().getBinding('items').getLength();
			if (typeof cus.crm.myaccounts !== 'undefined' && typeof cus.crm.myaccounts.NavigationHelper !== 'undefined' 
			&& typeof cus.crm.myaccounts.NavigationHelper.qty !== 'undefined'){
				if (cus.crm.myaccounts.NavigationHelper.qty >  numberOfLeads && typeof this.accountID  !== 'undefined'){					
					sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("LIST_FILTERED_BY_MYITEMS", [numberOfLeads,cus.crm.myaccounts.NavigationHelper.qty]));
				};
			//Not needed again. Clear the variable
			cus.crm.myaccounts.NavigationHelper.qty = undefined;
			};			
		};
		if(this.oModel)
	    	this.oModel.attachRequestCompleted(jQuery.proxy(successHandler, this));
		
		 this.oPopOverSort = this.byId('popoverSorter');
		 this.oPopOverFilter=this.byId('popoverFilter');
		
		 this.sFilterSelectedItemKey = "ALL";
		 this.sSortSelectedItemKey = "EndDate";
		 this.sBackendVersion = cus.crm.lead.util.schema._getServiceSchemaVersion(this.oModel,"Lead");
	 	},
	 	
	 	onBeforeRendering : function(){
	 		
	 		this.getView().getModel('controllers').getData().s2Controller = this;
	 	},

getFilters : function(){
    var filters = [];
      if (undefined != this.accountID){
          filters.push(new sap.ui.model.Filter("ProspectNumber", sap.ui.model.FilterOperator.EQ,  this.accountID ));  
      }
      if (undefined != this.leadID){
		  filters.push(new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ,  this.leadID ));
	  }
      
      return filters;
},  
showPopupforsort : function(oEvent) {
  this.oPopOverSort.setModel(oEvent.getSource().getModel());
  this.oPopOverSort.openBy(oEvent.getSource());
 
},

showPopupforfilter : function(oEvent){
  this.oPopOverFilter.setModel(oEvent.getSource().getModel());
  this.oPopOverFilter.openBy(oEvent.getSource());
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
onShow : function(oEvent) {
	var that=this;
	var oModel = this.getView().getModel();
	 var maxHitData;
	 // RetrieveMaxHit offline 
	oModel.read((parseFloat(this.sBackendVersion) >= 4) ? "RetrieveMaxHitSet" : "RetrieveMaxHit",null,null,false,function(oData,resp) 
	{ 
		maxHitData = {
				  RetrieveMaxHit : ((parseFloat(that.sBackendVersion) >= 4) ? oData.results[0] : resp.data.RetrieveMaxHit)
	    };
		
        
	});
	this.oldValue = maxHitData.RetrieveMaxHit.MaxHitNumber;
	
	this.oShowSheet.setModel(this.getView().getModel(
	"i18n"), "i18n");
	var jsonModel = new sap.ui.model.json.JSONModel();
	jsonModel.setData(maxHitData);
    this.oShowSheet.setModel(jsonModel,"showJson");
	
	this.oShowSheet.open();
	
	
},


closeShow :function(oEvent) {

	this.oShowSheet.close();	
},

saveMaxHit :function(oEvent){


var oModel = this.getView().getModel();
	var value=this.oShowSheet.getContent()[1].getValue();

if(value != this.oldValue)
	
	
	oModel.create("UpdateMaxHit", null,
			{
			success : 
			        jQuery.proxy(function() {
			        
			           
			        this.oModel.bRefreshAfterChange = false; 
			        this.oModel.refresh();
			           
			                },this),
			error :                  
			      jQuery.proxy(function(oError) {
			                this.handleErrors(oError);
			               
			                this.oModel.bRefreshAfterChange = false;
			                    },this),
			async : true,
			urlParameters : ["MaxHitNumber='" + value + "'"]
			}
			);

	
this.oShowSheet.close();
},



getHeaderFooterOptions : function() {
  var that = this;
  var self = this.getView();
  var oListItems = this.getList().getItems();
  var numberOfLeads = 0;
  if(this.getList().getBinding('items'))
     numberOfLeads = this.getList().getBinding('items').getLength();
  var oHeaderFooterOptions= {
    onBack : jQuery.proxy(this.onBack,this),
    sI18NMasterTitle : this.oApplicationFacade.getResourceBundle().getText("MASTER_TITLE",numberOfLeads),
    oSortOptions : {
      sSelectedItemKey : this.sSortSelectedItemKey,
      aSortItems : [  {
          text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ClosingDateAscending'),
          key : "EndDate"
   },{
       text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ClosingDateDescending'),
       key : "EndDate2"
 },{
            text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('AccountAscending'),
            key : "ProspectName"
     },
      {
          text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('AccountDescending'),
          key : "ProspectName2"
   }, {
            text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('StatusAscending'),
            key : "UserStatusText"
     },
     {
         text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('StatusDescending'),
         key : "UserStatusText2"
  }
   ],               //sSelectedItemKey : " ",
                  onSortSelected : function(key) {
                    
                    that.applySort(key);
                    that.sSortSelectedItemKey = key;
                    
                  } 
            },
              
            oFilterOptions : {
              sSelectedItemKey : this.sFilterSelectedItemKey,
              aFilterItems : [{
            	  text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ALL'),
                  key : "ALL"
             }, {
            	 text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('OPEN'),
                 key : "I1002"
                    
             }],
            
          	onFilterSelected : jQuery.proxy(function(sKey) {
              var aFilters = [];
              this.sFilterSelectedItemKey = sKey;
              this.getList().setNoDataText(this.oResourceBundle.getText('LOADING'));
              aFilters = this.getFilters();
              var searchPattern = this._oControlStore.oMasterSearchField.getValue();
              
              if(searchPattern && searchPattern.length > 0)
                aFilters.push(new sap.ui.model.Filter("Description","EQ",searchPattern));
              if(sKey === "I1002"){
        		  aFilters.push(new sap.ui.model.Filter("UserStatusText","EQ","I1002"));
        		  this.bFilterOpen = true;
        	  }
        	  else
        		  this.bFilterOpen = false;
              var oBinding = this.getList().getBinding('items');
              oBinding.aApplicationFilters = [aFilters];
              //oBinding.filter(aFilters);
              this.oAppImpl.oMHFHelper.refreshList(this);
        
       },this)
             

   },
   aAdditionalSettingButtons : [{
		sI18nBtnTxt:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LIST_SETTING'),
		sId : "BTN_SHOW",
		sIcon : "sap-icon://settings",
		onBtnPressed : function(sKey) {
			jQuery.proxy(that.onShow(sKey), this);
		}
		},
		]
  };
  /**
   * @ControllerHook extHookGetHeaderFooterOptions is the
   *                 controller hook where the
   *                 headerFooterOptions can be extended.
   *                 Attributes like master list title,
   *                 filters can be defined in addition to
   *                 the existing headerFooterOptions
   * 
   * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetHeaderFooterOptions
   * @param {object}
   *            oHeaderFooterOptions
   * @return {void}*/
  if(this.extHookGetHeaderFooterOptions){
   this.extHookGetHeaderFooterOptions(oHeaderFooterOptions);
  }
	return oHeaderFooterOptions;
},	

  applySort : function(key){
    if (key==="ProspectName2" || key==="UserStatusText2" || key==="EndDate2"){
      if (key==="ProspectName2"){
      key = "ProspectName";
      }
      else if (key==="UserStatusText2"){
      key = "UserStatusText";
      }
      else
        key = "EndDate";
      var oSorter = new sap.ui.model.Sorter(key,true, false);
    }
    else
    var oSorter = new sap.ui.model.Sorter(key,false, false);
  

this.getView().byId('list').getBinding("items").aSorters = [];
this.getView().byId('list').getBinding("items").aSorters = [ oSorter ];
this.getView().byId('list').getBinding("items")
    .sort(oSorter);
 
},



onSort : function(oEvent){
  this.oPopOverSort.setModel(oEvent.getSource().getModel());
  this.oPopOverSort.openBy(oEvent.getSource());
},

onFilter : function(oEvent){
  this.oPopOverFilter.setModel(oEvent.getSource().getModel());
  this.oPopOverFilter.openBy(oEvent.getSource());
},

  /**
   * @override
   *
   * @param oItem
   * @param sFilterPattern
   * @returns {*}
   */
   /**
   * @override
   */  
 isBackendSearch : function(){
  // sap.ca.scfld.md.controller.BaseMasterController.prototype.applyBackendSearchPattern.call(this);
   return true;
 },

  applyBackendSearchPattern :function(sFilterPattern,oBinding){
	  this.getList().setNoDataText(this.oResourceBundle.getText('LOADING'));
    var aFilters = [];
    aFilters = this.getFilters();
    oBinding.aApplicationFilters = [];
    if(this.bFilterOpen)
      aFilters.push(new sap.ui.model.Filter("UserStatusText",sap.ui.model.FilterOperator.EQ,"I1002"));
    
    if(sFilterPattern && sFilterPattern.length > 0)
      aFilters.push(new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,sFilterPattern));
   // if(sFilterPattern!=""){
    oBinding.aApplicationFilters = [];   
		oBinding.filter(aFilters);
		
//    }
    
    	
 
 
},
 

applyFilterPatternToListItem : function(oItems,sFilterPattern){
 // oItem.getBindingContext().getProperty();
  var aListItems = this.getList().getItems();
  if (sFilterPattern.toUpperCase() == "ALL")
    {
    for(var i =0;i<aListItems.length;i++){
      aListItems[i].setVisible(true);
    }
   // sap.ca.scfld.md.controller.BaseMasterController.prototype.setListItem.call(aListItems[0]);
    this.setListItem(aListItems[0]);
    }
  
  
  
    else{
    	var  counter;
      for(var i =0;i<aListItems.length;i++){
           var visibility = this.searchFilterPattern(aListItems[i], sFilterPattern) ;
           if (visibility == true){
              counter = i;
           }
           aListItems[i].setVisible(visibility);
    }
      this.setListItem(aListItems[counter]);
      //sap.ca.scfld.md.controller.BaseMasterController.prototype.setListItem.call(aListItems[counter]);
  }
  
  //sap.ca.scfld.md.controller.BaseMasterController.prototype.setListItem.call(aListItems);
},

	/**
	 * Overrrides scaffolding setListItem
	 */
	setListItem : function(oItem){
		if(!this.bAppLaunched){
			this.prevItem = oItem;
			
		}
	    
			this.oItem = oItem;
		this.getList().removeSelections();
		if(this.prevItem)
		  this.getList().setSelectedItem(this.prevItem);
		
	   var currentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
	   var editController = this.getView().getModel('controllers').getData().s4Controller;
	   if(this.bAppLaunched && currentDetailPage && editController && (editController.getView() === currentDetailPage))
		   {
		    //we are in the edit page 
		    var s4Controller = this.getS4Controller();
		     if(s4Controller && s4Controller.pageNeedsUpdate())
		    	 {
		    	 sap.ca.ui.dialog.confirmation.open({
		 			question :this.oResourceBundle.getText('DATA_LOSS'),
		 			title : this.oResourceBundle.getText('WARNING'),
		 			confirmButtonLabel : this.oResourceBundle.getText('CONTINUE')  	
		 			
		 		},jQuery.proxy(this.datalossDismissed,this));
		 			
		 		 return;
		    	 }
		   }
		
	   this.goToDetailPage(oItem);
	   
	},
	goToDetailPage : function(oItem){

		if(oItem === undefined)
			return;
		
		this.prevItem = oItem;
		   var oList=this.getList();
		      oList.removeSelections();
		      oItem.setSelected(true);
		      oList.setSelectedItem(oItem,true);
		      this.sPath = oItem.getBindingContext().sPath;
		      if(this.bAppLaunched && this.getS3Controller())
		         this.oRouter.attachRouteMatched(this.getS3Controller().routeMatched,this.getS3Controller());
		      this.oRouter.navTo("detail", {
		        contextPath : oItem.getBindingContext().sPath.substr(1)
		      }, !jQuery.device.is.phone);
		
		
		
	},
	datalossDismissed : function(oResult){
		var s4Controller = this.getS4Controller();
    	
    	this.getList().getModel().clearBatch();
    	if(oResult.isConfirmed === false){
    		if(this.prevItem)
    		  this.getList().setSelectedItem(this.prevItem);
    		return;
    	}
    		
    	if(s4Controller)
    		s4Controller.deleteBuffer = [];
    	this.goToDetailPage(this.oItem);
		
		
	},
	
	
searchFilterPattern : function(oItem, sFilterPattern) {
 
  
  var oIteshellata = oItem.getBindingContext().getProperty();
  if (oIteshellata.SystemStatusCode.toUpperCase() == sFilterPattern.toUpperCase())
      {
        return true;
      }
  else
     return false;
},

applySortPatternToListItem : function(sSortPattern){
  
   var aListItems = this.getList().getItems();
   if (sSortPattern == "Status")
     {
     for(var i=0;i<aListItems.length;i++)
     {
       for(var j=0;j<aListItems.length-i-1;j++)
        {
           if(aListItems[j].getBindingContext().getProperty().UserStatusText<aListItems[j+1].getBindingContext().getProperty().UserStatusText)
               {
                   var tmp = aListItems[j];
                   aListItems[j] = aListItems[j+1];
                   aListItems[j+1] = tmp;
                   
               }
        }
     }
     for(var i=0;i<aListItems.length;i++)
       {
         this.getList().addItem(aListItems[i]);
       }  
     
     this.setListItem(aListItems[0]);
         }
   else if (sSortPattern == "Account")
           {
        for(var i=0;i<aListItems.length;i++)
     {
       for(var j=0;j<aListItems.length-i-1;j++)
        {
           if(aListItems[j].getBindingContext().getProperty().ProspectName.toString()<aListItems[j+1].getBindingContext().getProperty().ProspectName.toString())
               {
                   var tmp = aListItems[j];
                   aListItems[j] = aListItems[j+1];
                   aListItems[j+1] = tmp;
                   
               }
        }
     }
     for(var i=0;i<aListItems.length;i++)
       {
         this.getList().addItem(aListItems[i]);
       }  
     this.setListItem(aListItems[0]);
           }
   
   else if (sSortPattern == "Closing Date")
     {
      for(var i=0;i<aListItems.length;i++)
     {
       for(var j=0;j<aListItems.length-i-1;j++)
        {
           if(aListItems[j].getBindingContext().getProperty().EndDate<aListItems[j+1].getBindingContext().getProperty().EndDate)
               {
                   var tmp = aListItems[j];
                   aListItems[j] = aListItems[j+1];
                   aListItems[j+1] = tmp;
                   
               }
        }
     }
     for(var i=0;i<aListItems.length;i++)
       {
         this.getList().addItem(aListItems[i]);
       }  
     
     this.setListItem(aListItems[0]);
     
   }
    
 },
sortbyGroup : function(oEvent) {
  var item = oEvent.getParameters().listItem;
 if (item.getTitle() == "Closing Date") {
      /*var sSortPattern = item.getTitle();
      this.applySortPatternToListItem(sSortPattern);*/
      this.sortClosingDate();
  }
  else if (item.getTitle()== "Status"){
    this.sortStatus();
  }
  else if (item.getTitle()== "Account"){
    this.sortAccount();
  }
  
},

sortClosingDate : function() {
  this.applySort("Closing Date");
},

sortStatus : function() {
  this.applySort("Status");
},

sortAccount : function() {
  this.applySort("Account");
},

groupItems : function(contact) {
  // if we are grouping by customer name, then use the full customer name, otherwise group by first letter
  return this.currentSort.sPath==="CustomerName" ? contact.getProperty("CustomerName") : contact.getProperty(this.currentSort.sPath).charAt(0);
},
leadRejected : function()
{
    var s3Controller = this.getView().getModel('controllers').getData().s3Controller;
    if(s3Controller && s3Controller.bRejectLead)
    	{
    	    var items = this.byId('list').getItems();
    	    if(items.length > 0){
    	    	this.setListItem(items[0]);
    	    	s3Controller.bRejectLead = false;
    	    }
    	    else if(s3Controller.nLeads === 1){
    	    	  this.oRouter.navTo("noData", {viewTitle:"DETAIL_TITLE", languageKey:"NO_ITEMS_AVAILABLE"});
    	    	  s3Controller.bRejectLead = false;  
    	    }
    	}
    if(s3Controller && s3Controller.bRejectLead == false)
      this.byId('list').getBinding('items').detachChange(this.leadRejected,this);

},
leadAccepted : function()
{
    var s3Controller = this.getView().getModel('controllers').getData().s3Controller;
    if(s3Controller && s3Controller.bAcceptLead)
    	{
    	    var items = this.byId('list').getItems();
    	    if(items.length > 0)
    	    	{
    	    	var oModel = this.byId('list').getModel();
    	    	 var sPath = "/" + "Leads(guid'" + s3Controller.sHeaderGuid + "')";
    	    	 var context  = this.byId('list').getModel().getContext(sPath);
    	    	 var i;
    	    	 s3Controller.byId('info').getModel('json').setData(JSON.parse(JSON.stringify(oModel.getData(sPath))));
    	    	}
    	    	
    	       	
    	}
    if(s3Controller && s3Controller.bAcceptLead == false)
      this.byId('list').getBinding('items').detachChange(this.leadAccepted,this);

},
editSaved : function()
{
	var i;
	var detailPages;
	
     	var s4Controller = this.getView().getModel('controllers').getData().s4Controller;
     	
     	if(s4Controller.bNavOnUpdate === true)
     		{
     	
     	
     	var sPath = "/" + "Leads(guid'" + s4Controller.headerGuid + "')";	        	
     	var oModel = this.byId('list').getModel();
     	var context = oModel.getContext(sPath);	        	
     	var items = this.byId('list').getItems();
     	
     	for(i=0;i<items.length;i++){
     		
     		if(context === items[i].getBindingContext()) {
     			items[i].setSelected(true);
     		//	this.byId('list').setSelectedItem(items[i],true);
     			if(jQuery.device.is.phone)
     		    	this.setListItem(items[i]);
     			s4Controller.bNavOnUpdate = false;
     			
     		}
     	
     }
     		}
      if(s4Controller.bNavOnUpdate === false)
    	   this.byId('list').getBinding('items').detachChange(this.editSaved,this);


},
getS3Controller : function()
{
	return this.getView().getModel('controllers').getData().s3Controller;
},
getS4Controller : function()
{
	return this.getView().getModel('controllers').getData().s4Controller;
},

onDataLoaded : function()
{
if(!this.bAppLaunched){	
	//attaching leadsRefreshed as callback whenever the list gets refreshed,filtered,searched
	 this.getList().getBinding('items').attachChange(this.leadsRefreshed,this); 
	 
	 //selectDetail selects ths first element of the list if any, shows empty view otherwise - only on app launch
	 //this._selectDetail();
	 
	 //app has launched  - all one time operations are prevented from further execution with an if check upon this attribute
	 this.bAppLaunched = true;
}
 


},

leadsRefreshed : function()
{
 //get s3Controller - for accept/reject lead scenarios 	
  var s3Controller = this.getS3Controller();
	if(s3Controller !== null)
		{
		
		   // get the data from s2 view and bind it to the s3 view - instead of fetching separately for the s3 view again
		   //for accept lead scenario
		   if(s3Controller.bAcceptLead === true)
			   {
			           var sPath = "/" + s3Controller.sPath;
			            var data = JSON.parse(JSON.stringify(this.oModel.getContext(sPath).getObject()));
			           s3Controller.byId('info').getModel('json').setData(data);
			           s3Controller.bAcceptLead = false;
			   }
		   //for reject lead scenario
		   if(s3Controller.bRejectLead === true)
			   {
			      if(this.getList().getItems().length > 0){
		    	   this.setListItem(this.getList().getItems()[0]);
		           s3Controller.bRejectLead = false; 
			      }
			   }
		
		}
	
	 //if there are no items found - either by filtering/searching - display the no data text for the list
     if(this.getList().getBinding('items').getLength() === 0){
    	 this.getList().setNoDataText(this.oResourceBundle.getText('NO_LEAD_ERROR'));
    	 
    	 //navigate to empty view only on contextual filter - accountID    	 
    	 if(this.accountID !== undefined)
    		 this.navToEmptyView();
    	 
    	 
     }
     else
    	 {
    	 //checking the possibility of a selected list item with an empty detail page - changing to detail page if so
    	 var item = this.getList().getSelectedItem();
    	 if(item && this.getSplitContainer().getCurrentDetailPage().sViewName === "sap.ca.scfld.md.view.empty")
    		 {
    		     if(!jQuery.device.is.phone && this.getS3Controller())
    		    	 this.oRouter.attachRouteMatched(this.getS3Controller().routeMatched,this.getS3Controller());
    		     this.oRouter.navTo("detail",{contextPath : item.getBindingContext().sPath.substr(1)},!jQuery.device.is.phone);
    		 
    		 }
           	 
    	 }


},
navToEmptyView : function() {
    
	//happens only when there is no data to display from the backend, and an empty result returned on a contextual filter/search
	
	 if(this.s4Controller)
 	{
 	    if(this.s4Controller.bNavOnUpdate && (this.s4Controller.bHeaderUpdateSuccess || 
 	    		this.s4Controller.bContactUpdateSuccess || this.s4Controller.bUserUpdateSuccess))
 	      {
 	    	this.s4Controller.bNavOnUpdate = false;
 	    	this.bHeaderUpdateSuccess = this.bStatusUpdateSuccess = this.bContactUpdateSuccess = false;
 	    	
 	      }
 	
 	return;
 	}
    this.getList().setNoDataText(this.oResourceBundle.getText('NO_LEAD_ERROR'));
    this.oRouter.navTo("noData");
			},
			
closeToolbar : function(oEvent){
				
				var aFilters = [];
				this.byId('toolbarAccountInfo').setVisible(false);
				this.accountID = undefined;
				this.getList().getBinding('items').aApplicationFilters = [];
				aFilters = this.getFilters();
				
				if(this.bFilterOpen)
					aFilters.push(new sap.ui.model.Filter("UserStatusText","EQ","I1002"));
				
				var searchPattern = this._oControlStore.oMasterSearchField.getValue();
			    if(searchPattern && searchPattern.length > 0)
			      aFilters.push(new sap.ui.model.Filter("Description","EQ",searchPattern));
				
				this.getList().getBinding('items').aApplicationFilters = aFilters;
				this.oAppImpl.oMHFHelper.refreshList(this);
			},

setAccountName : function(){
					this.byId('toolbarAccountInfo').setVisible(true);   
					this.byId('labelAccountInfo').setText(this.oResourceBundle.getText('FILTER_BY') + " " + this.getList().getItems()[0].getBindingContext().getObject().ProspectName);	
				
			},
applyFilterFromContext : function(sContext){
		//to allow bookmarking for growing list		
	          // if(!jQuery.device.is.phone)
	           this.sContext = sContext;
	    
	           var list = this.getList();
	   		if(list.attachUpdateFinished){
	   	       list.attachUpdateFinished(null,this.onGrowingFinished,this);
	   		}
	             if(this.getS3Controller())
	        	   this.oRouter.attachRouteMatched(this.getS3Controller().routeMatched,this.getS3Controller());
				this.oRouter.navTo("detail",{contextPath : sContext.substr(1)},!jQuery.device.is.phone);
			},
			
			onBack : function(oEvent){
				var currentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
				var editController = this.getView().getModel('controllers').getData().s4Controller;
				
				if(currentDetailPage && editController && (editController.getView() === currentDetailPage)){
					 if(editController.pageNeedsUpdate())
			    	 {
						 this.getList().getModel().clearBatch();	 
			    	 sap.ca.ui.dialog.confirmation.open({
			    		 	question :sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),
							title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),
							confirmButtonLabel : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')  	
			 			
			 		},jQuery.proxy(this.dataLossForExit,this));
			 			
			 		 return;
			    	 }
				}
				window.history.back(1);
			},
			
			dataLossForExit : function(oResult){
				if(oResult.isConfirmed === true){
				       window.history.back(1);
			}
			
			},
			onGrowingFinished : function(oEvent){
				if(this.sContext){
					var list = this.getList();
					var items = list.getItems();
					for(var i = 0; i < items.length; i++){
						if(this.sContext === items[i].getBindingContextPath()){
							items[i].setSelected(true);
							this.sContext = null;	
							list.detachUpdateFinished(this.onGrowingFinished,this);
							this.prevItem = items[i];
						}
						else{
						items[i].setSelected(false);
						}
					}
				}
			}
	
});