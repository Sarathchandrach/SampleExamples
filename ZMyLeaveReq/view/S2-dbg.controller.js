/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.emp.myleaverequests.view.S2", {

	extHookChangeFooterButtons: null,	
	extHookTimeAccountCollection : null,
	
	onInit : function() {

		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		this.entitlementTableCntrl = this.byId("entitlemntTble");		
		this.templateCntrl = this.byId("LRS2_LISTITEM");

		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);
	},
	
	_handleRouteMatched : function(){
		sap.ca.ui.utils.busydialog.requireBusyDialog();		
		var _this = this;		
		hcm.emp.myleaverequests.utils.DataManager.getTimeAccountCollection(function(response) {			
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			
			/**
	     * @ControllerHook Modify the TimeAccountCollection response
	     * This hook method can be used to modify the TimeAccountCollection
	     * It is called when the method getTimeAccountCollection in DataManager executes
	     * @callback hcm.emp.myleaverequests.view.S2~extHookTimeAccountCollection
	     * @param {object} TimeAccountCollection Object
	     * @return {object} TimeAccountCollection Object
	     */
			if(this.extHookTimeAccountCollection) {
				response = this.extHookTimeAccountCollection(response);
			};
			
		  _this.entitlementTableCntrl.setModel(new sap.ui.model.json.JSONModel(response));		   
		  _this.entitlementTableCntrl.bindItems("/TimeAccountCollection", _this.templateCntrl);
		}, function(objResponse) {
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				hcm.emp.myleaverequests.utils.UIHelper.errorDialog(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
		});
	},

	getHeaderFooterOptions : function() {
		var objHdrFtr = {
			sI18NFullscreenTitle : "LR_TITLE_BALANCE_VIEW",
			onBack: jQuery.proxy(function() {
				//Check if a navigation to master is the previous entry in the history
				var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("home"));
				if (sDir === "Backwards") {
					window.history.go(-1);
				} else {
					//we came from somewhere else - create the master view
					this.oRouter.navTo("home");
				}
			}, this)
		};
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.myleaverequests.view.S2~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	return objHdrFtr;
	}
});