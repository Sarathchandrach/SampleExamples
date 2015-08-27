/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S4Notes", {

    onInit : function() {
    	this.oRouter.attachRouteMatched(this.handleNavTo, this);

    },
    handleNavTo : function(oEvent){
    	if (oEvent.getParameter("name") === "AccountNotes") {	
    		var oView = this.getView();
//           Unused variables
//			var contextPath = oEvent.getParameter("arguments").contextPath;
//			var oPage = this.byId("page");
    		var oModel = this.getView().getModel();
    		var sPath = '/' + oEvent.getParameter("arguments").contextPath;
    		var context = new sap.ui.model.Context(oModel, '/' + oEvent.getParameter("arguments").contextPath);
    		var fnBindViewContext = function(){
    			oView.setBindingContext(context);
    		}
    		oModel.createBindingContext(sPath, "", {expand: 'Notes'},fnBindViewContext,true);
    	}
    },
    handleNavBack: function(oEvent){
    	window.history.back();
   	
	}	
	
});
