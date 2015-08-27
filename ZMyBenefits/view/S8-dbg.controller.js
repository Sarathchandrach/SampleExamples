/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S8", {
	

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S8 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,


    onInit: function() {
        // execute the onInit for the base class
        // BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
        
        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "Unenrolled") {
            	hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
            	
            	oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				
				var _this = this;
			
				var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				var indexVal = contextPath.split("/")[1];
				
				var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
            	
				if (benefitsPlancollection) {
					
					var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	
					
					var objHeader= _this.byId("MB_UE_HEADER");
								    							
					 objHeader.setTitle(curntBnftPlan.PlanTypeText);
					 
					 _this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);					 
					 _this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
				}
            }
            
        }, this);
        
        var oView = this.getView();
        //    var IconTabFilter = new sap.m.IconTabFilter
            this.oTabBar = oView.byId("TabContainer");
            /**
             * @ControllerHook Initialize the custom tabs
             * added by the extension application.
             * This hook method can be used to initialize additional tabs of the tab bar from code.
             * It is called during S8 view initialization.  The controller extension should obtain   
             * references to the new tabs, which can be used later in the configureAdditionalTabs 
             * hook method.
             * @callback hcm.emp.mybenefits.view.S8~extHookInitAdditionalTabs
             * @param {object} oTabBar - contains the tab bar object.
             * @return {void}
             */
            if (this.extHookInitAdditionalTabs) {
            	this.extHookInitAdditionalTabs(this.oTabBar);
            }
    },

    onSenderPress: function(oEvent) {
        var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
        sap.m.URLHelper.redirect(path, true);
    },

    getHeaderFooterOptions: function() {
    	var objHdrFtr = {
                sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
                oAddBookmarkSettings: {
                    title: this.resourceBundle.getText("MB_APP_TITLE"),        
                    icon:"sap-icon://family-care"
                }
        	};
        	/**
             * @ControllerHook Modify the footer buttons
             * This hook method can be used to add and change buttons for the detail view footer
             * It is called when the decision options for the detail item are fetched successfully
             * @callback hcm.emp.mybenefits.view.S8~extHookChangeFooterButtons
             * @param {object} objHdrFtr-Header Footer Object
             * @return {object} objHdrFtr-Header Footer Object
             */
        	
        	if (this.extHookChangeFooterButtons) {
        		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        	};
        	
            //Note:Back button issue
            /*,
                   onBack: jQuery.proxy(function() {
                    //Check if a navigation to master is the previous entry in the history
                    var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                    if (sDir === "Backwards") {
                        window.history.go(-1);
                    } else {
                        //we came from somewhere else - create the master view
                        this.oRouter.navTo("master");
                    }
                }, this)*/
              //Note: End Back button issue
            
        	
            return objHdrFtr;
        }

});
