/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.myaccounts.controller.Base360Controller");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("cus.crm.myaccounts.util.Constants");
jQuery.sap.require("cus.crm.myaccounts.util.Util");

cus.crm.myaccounts.controller.Base360Controller.extend("cus.crm.myaccounts.view.S2", {

    onInit : function() {
	// execute the onInit for the base class BaseDetailController
	cus.crm.myaccounts.controller.Base360Controller.prototype.onInit.call(this);
	this.resourceBundle = this.oApplicationFacade.getResourceBundle();

	// Settings
	var oMasterModel = new sap.ui.model.json.JSONModel({
	    isRefreshing : false,
	    searchValue : "",
	    selectedKey : "MyAccount",
	    threshold : this.getThreshold(),
	    items : [ {
		text : this.resourceBundle.getText("MY_ACCOUNT"),
		key : "MyAccount"
	    }, {
		text : this.resourceBundle.getText("ALL_ACCOUNTS"),
		key : "All"
	    } ]
	});
	
	var oModel = this.getView().getModel(); 
	oModel.forceNoCache(true);
	
	this.getView().setModel(oMasterModel, "config");
	this.oRouter.attachRouteMatched(this.handleNavTo, this);
	
	this.backendSupportsCreate = cus.crm.myaccounts.util.Util.getServiceSchemaVersion(oModel, "AccountCollection") > 0;

    },
    destroy : function() {
	var oBinding = this.getTargetBinding();
	oBinding.detachChange(this._fnOnBindingChange);
    },
    handleNavTo : function(oEvent) {
		if (oEvent.getParameter("name") === "mainPage") {
        	var oArguments = oEvent.getParameter("arguments");
        	if (oArguments.filterState === "All")
        		this.getView().getModel('config').setProperty("/selectedKey", "All");
        	else
        		this.getView().getModel('config').setProperty("/selectedKey", "MyAccount"); 
        }
		
		if (oEvent.getParameter("name") === "S2" || oEvent.getParameter("name") === "mainPage") {
		    jQuery.sap.log.info("My accounts nav to " + oEvent.getParameter("name"));
		    // workaround to fix the pull to refresh that does not go
		    jQuery.sap.delayedCall(2000, this, function() {
			this.byId("myPullToRefresh").hide();
		    });
		    this._bindGrowingTileContainer();
		}
    },
    _bindGrowingTileContainer : function() {
    	if (!this.getView().byId("myOverviewTile"))
    		return;
		var oGrowingTile = this.getControl(), oBinding, aOptions;
		oGrowingTile.setGrowingThreshold(this.getThreshold()).setGrowing(true);
		oGrowingTile.bindAggregation("content", {
		    path : '/AccountCollection',
		    filters : this._getFilters(),
		    parameters : {
			expand : 'MainContact,Classification,MainAddress,Logo,AccountFactsheet',
			// select all account attributes (*), and some special attribute of the other entities 
			select : '*,MainContact,Classification,MainAddress,Logo,AccountFactsheet/opportunityVolume,AccountFactsheet/revenueCurrentYear,AccountFactsheet/lastContact,AccountFactsheet/nextContact'	
		    },
		    template : this.getView().byId("myOverviewTile").clone(),
		});
		this._fnOnBindingChange = jQuery.proxy(this.onBindingChange, this);
		oBinding = this.getTargetBinding();
		oBinding.attachChange(this._fnOnBindingChange);
		aOptions = this._getHeaderFooterOptions();
		this.setHeaderFooterOptions(aOptions);
    },

    /**
     * @Override getControl
     */
    getControl : function() {
	return this._getTileContainer();
    },
    /**
     * @Override getTargetAggregation
     */
    getTargetAggregation : function() {
	return "content";
    },

    _getTileContainer : function() {
	return this.byId("tileContainer");
    },
    /**
     * check if filter on my account is set
     */
    _isMyAccount : function() {
	var key = this.getView().getModel('config').getProperty("/selectedKey");
	return (key === "MyAccount") ? true : false;
    },

    /**
     * determines whether search (triggered by search field) is performed on
     * backend or frontend (frontend being default behavior).
     */
    isBackendSearch : function() {
	return true;
    },

    /**
     * @Override contains the server filter
     */
    applyBackendSearchPattern : function(sFilterPattern, oBinding) {
	var filters = this._getFilters(),
	// HACK: Remove initial filter (Status = New) which is by default
	// concatenated (or) to custom filters
	oBinding = this.getControl().getBinding(this.getTargetAggregation());

	oBinding.aApplicationFilters = [];
	// update master list binding
	oBinding.filter(filters);
    },
    onTileTap : function(oEvent) {
	// var title = oEvent.getSource().getTitle();
	this.oRouter.navTo("detail", {
	    contextPath : oEvent.getSource().getBindingContext().sPath.replace('/', "")
	});
    },
    openBusinessCard : function(oEvent) {
	var oEmpData = {};
	// get control that triggeres the BusinessCard
	if (oEvent) {
	    var oSource = oEvent.oSource;
	    if (oSource) {
		var oContext = oSource.getBindingContext();
		if (oContext) {
		    oEmpData = {
			name : oContext.getProperty("MainContact/fullName"),
			imgurl : this.photoUrlFormatter(oContext.getProperty("MainContact/Photo/__metadata/media_src")),
			department : oContext.getProperty("MainContact/department"),
			mobilephone : oContext.getProperty("MainContact/WorkAddress/mobilePhone"),
			officephone : oContext.getProperty("MainContact/WorkAddress/phone"),
			email : oContext.getProperty("MainContact/WorkAddress/email"),
			companyname : oContext.getProperty("MainContact/company"),
			companyaddress : oContext.getProperty("MainContact/WorkAddress/address")
		    };
		    // call 'Business Card' reuse component
		    var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpData);
		    oEmployeeLaunch.openBy(oEvent.getParameters());
		}

	    }
	}
    },

    logoUrlFormatter : function(mediaUrl) {
	return mediaUrl ? mediaUrl : "sap-icon://factory";
    },

    photoUrlFormatter : function(mediaUrl) {
	   if (mediaUrl) {
		   return cus.crm.myaccounts.util.formatter.getRelativePathFromURL(mediaUrl);
		}	
		else {	
			return "sap-icon://person-placeholder";
		}

    },

    _getHeaderFooterOptions : function() {
	// Update master Page title with total list items count
	// var nbItems = this.getList().getItems().length;
	// var oPage = this.getView().byId("page");
	var oController = this;
	var aButtonList = [];
	
	if(this.backendSupportsCreate){
		aButtonList.push({
			sI18nBtnTxt:"BUTTON_ADD",
			onBtnPressed:function (oEvent) {
				oController._addAccount(oEvent);
			}});
	}
	
	return {
		buttonList : aButtonList,
	    oFilterOptions : {
		aFilterItems : this.getView().getModel('config').getProperty("/items"),
		sSelectedItemKey : this.getView().getModel('config').getProperty("/selectedKey"),
		onFilterSelected : function(sKey) {
		    jQuery.sap.log.info(sKey + " has been selected");
		    oController.getView().getModel('config').setProperty("/selectedKey", sKey);
		    oController.handleFilter();
		}
	    },
	    oAddBookmarkSettings : {
		icon : "sap-icon://Fiori2/F0002"
	    }

	};
    },
    
    _addAccount: function(oEvent){
    	var that = this;
    	var aCategories =  this._getPossibleAccountCategories();
    	var aButtons = [];
    	for(var i in aCategories){
    		switch (aCategories[i]){
    			case cus.crm.myaccounts.util.Constants.accountCategoryCompany:
    				aButtons.push(new sap.m.Button({ text: this.resourceBundle.getText("CORPORATE_ACCOUNT"), press : function() {that._navigateToCreateScreen(cus.crm.myaccounts.util.Constants.accountCategoryCompany);} }));
    				break;
    			case cus.crm.myaccounts.util.Constants.accountCategoryPerson:
    				aButtons.push(new sap.m.Button({ text: this.resourceBundle.getText("INDIVIDUAL_ACCOUNT"), press : function() {that._navigateToCreateScreen(cus.crm.myaccounts.util.Constants.accountCategoryPerson);} }));
    				break;
    			case cus.crm.myaccounts.util.Constants.accountCategoryGroup:
    				aButtons.push(new sap.m.Button({ text: this.resourceBundle.getText("ACCOUNT_GROUP"), press : function() {that._navigateToCreateScreen(cus.crm.myaccounts.util.Constants.accountCategoryGroup);} }));
    				break;
    		}
    	}
    		
    	if(!this.oCreateAccountActionSheet){
    		this.oCreateAccountActionSheet = new sap.m.ActionSheet("AddAccountActionSheet", {
    			buttons: aButtons,
    			placement: sap.m.PlacementType.Top,
    		});
    	}
    		
    	this.oCreateAccountActionSheet.openBy(oEvent.getSource());
    },
    
    _getPossibleAccountCategories: function(){
    	return [cus.crm.myaccounts.util.Constants.accountCategoryCompany, cus.crm.myaccounts.util.Constants.accountCategoryPerson, cus.crm.myaccounts.util.Constants.accountCategoryGroup];
    },
    
    _navigateToCreateScreen: function(accountCategory){
		var oParameter;
		oParameter = {
			accountCategory:accountCategory,
		};
		this.oRouter.navTo("new", oParameter, false);
    },

    handleFilter : function() {
		var filters = this._getFilters(),
		// HACK: Remove initial filter (Status = New) which is by default
		// concatenated (or) to custom filters
		listBinding = this.getTargetBinding();
	
		listBinding.aApplicationFilters = [];
		// update master list binding
		listBinding.filter(filters);
		
		this._setFilterInURL();
    },
    
    _setFilterInURL:function () {
        var oParameter = {};
        oParameter.filterState = this.getView().getModel('config').getProperty("/selectedKey");
    	this.oRouter.navTo("mainPage", oParameter, true);
    },

    _getFilters : function() {
	var filters = [], sValue = this.getView().getModel("config").getProperty("/searchValue"), isMyAccounts = this._isMyAccount();
	if (sValue && sValue.length > 0) {
	    filters.push(new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sValue));
	}
	// add filter from Filters
	filters.push(new sap.ui.model.Filter("isMyAccount", sap.ui.model.FilterOperator.EQ, isMyAccounts));
	return filters;

    },

    refreshList : function(oEvent) {
	// workaround to fix the pull to refresh that does not go
	jQuery.sap.delayedCall(2000, this, function() {
	    this.byId("myPullToRefresh").hide();
	});
	var oControl = this.getControl(), isRefreshing = this.getView().getModel("config").getProperty("/isRefreshing"), oBinding = oControl.getBinding(this.getTargetAggregation()), fReceivedHandler = jQuery.proxy(function() {
	    this.getView().getModel("config").setProperty("/isRefreshing", false);
	    oBinding.detachDataReceived(fReceivedHandler);
	    sap.ca.ui.utils.busydialog.releaseBusyDialog();
	}, this), fRequestedHandler = jQuery.proxy(function() {
	    this.getView().getModel("config").setProperty("/isRefreshing", true);
	    sap.ca.ui.utils.busydialog.requireBusyDialog();
	    oBinding.detachDataRequested(fRequestedHandler);
	}, this), sValue;

	oBinding.attachDataRequested(fRequestedHandler);
	oBinding.attachDataReceived(fReceivedHandler);
	if (this.isBackendSearch() && !isRefreshing) {
	    sValue = this.getView().getModel("config").getProperty("/searchValue");
	    this.applyBackendSearchPattern(sValue, oBinding);
	}

    },

    onBindingChange : function() {
	var sI18NHeaderTitle = this._isMyAccount() ? "MY_ACCOUNT_TITLE" : "ALL_ACCOUNTS_TITLE", iCount = 0, oBinding = this.getTargetBinding();

	if (oBinding) {
	    iCount = oBinding.getLength();
	}
	(iCount > 0) ? this._oControlStore.oTitle.setText(this.resourceBundle.getText(sI18NHeaderTitle, iCount)) : this._oControlStore.oTitle.setText(this.resourceBundle.getText("FULLSCREEN_TITLE"));
    },

    getThreshold : function() {
	if (jQuery.device.is.phone) {
	    return 3;
	} else {
	    return 10;
	}
    }

});
