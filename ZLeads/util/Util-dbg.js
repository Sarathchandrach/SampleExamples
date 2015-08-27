/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.lead.util.Util");

cus.crm.lead.util.Util ={
refreshHeaderETag : function(sPath,oController){
	 
	 var oModel = oController.oModel;
	 
	 if(oModel.getContext("/" + sPath)){
	        oModel.deleteCreatedEntry(oModel.getContext("/" + sPath));	 
	 }
	 	 oModel.createBindingContext("/"+ sPath,null,function(oContext){
			 
			 //dispatch the latest object to S3 view as well
			 var oData = oContext.getObject();
			 var oControllersModel = oController.getView().getModel("controllers");
			 var oS3Controller = oControllersModel.getProperty("/s3Controller");
			 
			 if(oS3Controller){
				 oS3Controller.bindS3Header(oData);
			 }
			 
		 },true);
	 },
	 
	 show412ErrorDialog : function(oController,fnOKCallback){
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
			},fnOKCallback);
		},
		
		mPartnerDetermination : null,
		getPartnerFunctions : function(){
			return this.mPartnerDetermination;
		},
		
		
		aggregatePartnerFunctions : function(aFunctions){
			
			if(this.mPartnerDetermination === null){
				this.mPartnerDetermination = {};
			}
		     for(var i =0 ; i < aFunctions.length;i++){
		    	
		    	 if(!this.mPartnerDetermination[aFunctions[i].TransactionType]){
		    		 this.mPartnerDetermination[aFunctions[i].TransactionType] = [];
		    	 }
		    	 this.mPartnerDetermination[aFunctions[i].TransactionType].push(aFunctions[i]);
		     }
		},
		
		fetchPartnerFunctions : function(oModel){
			
			oModel.read("PartnerFunctions",null,null,false,function(oData,response){
				
				cus.crm.lead.util.Util.aggregatePartnerFunctions(oData.results);
				
			},function(oError){
				cus.crm.lead.util.Util.handleErrors(oError);
			});
		},
		
		handleErrors : function(oError)
		{
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			jQuery.sap.log.error(JSON.stringify(oError));
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message : oError.message,
				details: JSON.parse(oError.response.body).error.message.value
			},function(oResult){});
		},
	 
};