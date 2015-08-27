/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.controller.Base360Controller");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.controller.Base360Controller", {

	getTargetAggregation: function(){
		return "content";
	},
	getControl :function(){
		
	},
	getTargetBinding: function(){
		var oControl = this.getControl();
		if(oControl){
			return this.getControl().getBinding(this.getTargetAggregation());
		}
		return undefined;
	}

});