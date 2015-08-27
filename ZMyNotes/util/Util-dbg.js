/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.util.Util");

cus.crm.notes.util.Util = {
	
 refreshHeaderETag : function(sPath,oController){
	 
	 var oModel = oController.oModel;
	 
	 if(oModel.getContext("/" + sPath)){
	        oModel.deleteCreatedEntry(oModel.getContext("/" + sPath));	 
	 }
	 	 oModel.createBindingContext("/"+ sPath,null,function(oContext){
			 
			 //dispatch the latest object to S3 view as well
			
			 
		 },true);
	 },
	 
	show412ErrorDialog : function(oController,fnOKCallback){
		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
		},fnOKCallback);
	} 
	 
 
};