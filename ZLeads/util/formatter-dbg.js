/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.lead.util.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

cus.crm.lead.util.formatter = {
		
		
		formatDate : function(dateObj)
		{
			if(dateObj){
				
		  		/*var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd-MMM-yyyy", style: "short"}); 
		  		var date = oDateFormat.format(dateObj);
		  		return date;*/
		  		var oLocale = sap.ui.getCore().getConfiguration().getLocale();
		  	    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({style:"medium"} ,oLocale); 
	            return oDateFormat.format(new Date(dateObj));
		  }
		  else
			  return dateObj;
		},
		
		

		
		mimeTypeFormatter : function(value) {

		       switch (value)
		       {
		              case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		              case 'application/vnd.ms-powerpoint':                  
		                     return 'pptx';
		                     break;
		              case 'application/msword':
		              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		                     return 'doc';
		                     break;
		              case 'application/vnd.ms-excel':
		              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		                     return 'xls';
		                     break;               
		              case 'image/jpeg':
		              case 'image/png':
		              case 'image/tiff':
		              case 'image/gif':          
		                     return 'jpg';
		                     break;
		              case 'application/pdf':    
		                     return 'pdf';
		                     break;
		              case 'text/plain':   
		                     return 'txt';
		                     break;
		              default:
		                     return 'unknown';    
		       }
		},
		

		formatDescription : function(sText,sDescription)
		{
			
			return sText + "  " + sDescription;
			
		},
		
		
		formatSearchPlaceHolder : function(sText)
		{
			return sText;
			
		},
		
		formatQuantityField : function(oValue)
		{
			
			if(oValue === null)
				return false;
			
			return true;
			
		},
		
		formatDeleteButton : function(oValue)
		{
			
			if(oValue === null)
				return false;
			
			return true;
			
		},
		formatProdClassification : function(oValue)
		{
			var oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
			if(oValue !== null)
				return oResourceBundle.getText('PRODUCT');
			else
				return oResourceBundle.getText('CATEGORY');
			
			
			
		},
		formatProductName : function(oValue)
		{
			
			if(oValue !== null)
				return this.getBindingContext('json').getObject().ProductName;
			return this.getBindingContext('json').getObject().ProductCategory;
			
		},
		formatProductNameJson : function(oValue)
		{
			
			if(oValue !== null)
				return this.getBindingContext('json').getObject().ProductName;
			return this.getBindingContext('json').getObject().ProductCategory;
			
		},
		formatProdClassificationJson : function(oValue)
		{
			var oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
			if(oValue !== null)
				return oResourceBundle.getText('PRODUCT');
			else
				return oResourceBundle.getText('CATEGORY');
			
			
			
		},
		PARTNERFUNCTION_Label : function(sText){
			
			return  " "+ " : " +"  " + sText;
		},
		
		//for change log
		formatChangeLog : function (value, value1, val3) {
	        // NLUN - CodeScan Changes - Global variable
	        var val;
	        if (value1 === "X") {
	        	val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_ON",[val3]);
	        }
	        else if ((value === "X")) {
	        	val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_OFF",[val3]);
	        }
	        else{
	        	if(value1 === " "){
	        		val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM_NULL",[val3,value1]);
	        	}
	        	else{
	        		val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM",[val3, value, value1]);
	        	}
	        }
	        return val;

	    },
		
		showNavButton : function()
		{
			
			return sap.ca.scfld.md.app.Application.getImpl().bIsPhone;
			
		},
		formatUnit : function(oValue)
		{
			this.addStyleClass("UnitPadding");
			this.addStyleClass(".UnitPadding");
			return oValue;
			
			
			
		},
		
		formatQuantity : function (value, unit) {
			
			return sap.ca.ui.model.format.NumberFormat.getInstance().format(value)+" "+ unit;
	    	
	    },
	    formatCampaign : function(sCampaignId,sCampaignDescription)
	    {
	    	if(sCampaignDescription === "")
	    		return sCampaignId;
	    	
	    	return sCampaignDescription;
	    	
	    	
	    	
	    },
     formatAddMoreProductsText : function(sAddMoreProductsText){
	    	
	    	if(jQuery.device.is.phone)
	    		return "";
	    	
	    	return  sAddMoreProductsText;
	    	
	    },
	    
	    formatParticipantDelete : function(sPartnerFunctionCode){
	    	
	    	
	    	var s3Controller = this.getParent().getParent().data("controller");
	    	
	    	//check backend schema versioning - if it is less than 2.0 the visibility should be false
	    	if(parseFloat(s3Controller.sBackendVersion)   < 2)
	    		return false;
			
	    	var oPartnerFunctionRule = s3Controller.getRuleForPartnerFunction(sPartnerFunctionCode);
			
			if(oPartnerFunctionRule === null){
				return false;
			}
			
			/*if(!s3Controller.partnerFunctionMap.hasOwnProperty(sPartnerFunctionCode)){
			      s3Controller.partnerFunctionMap[sPartnerFunctionCode] = 1;	
			}
			else{
				
				  s3Controller.partnerFunctionMap[sPartnerFunctionCode]++;
			}
			
			if(!oPartnerFunctionRule.ChangeableFlag && s3Controller.partnerFunctionMap[sPartnerFunctionCode] >  oPartnerFunctionRule.CountHigh){
				
				return true;
			}
			
	        if(!oPartnerFunctionRule.ChangeableFlag && s3Controller.partnerFunctionMap[sPartnerFunctionCode] <=  oPartnerFunctionRule.CountHigh){
				
				return false;
			}*/
			
			 if(!oPartnerFunctionRule.ChangeableFlag){
				 return false;
			 }
			
			
			return true;
	    	
	    },
	    
	    formatEmployeeRespField : function(sBackendVersion){
	       	
	    	if(parseInt(sBackendVersion) < 2){
	    		return false;
	    	}
	    	
	    	return true;
	    },
	    formatPhotoUrl : function(mediaUrl) {
			return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
		},
		urlConverter : function(value) {

			var sapServer = jQuery.sap.getUriParameters().get("sap-server");
			var sapHost = jQuery.sap.getUriParameters().get("sap-host");
			var sapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
			var sapClient = jQuery.sap.getUriParameters().get("sap-client");
			var oUriString;
								
			var oUri = URI(value);
			var sCurrentProtocol = location.protocol.replace(':','');
			if (sCurrentProtocol !== oUri.protocol()) {
					oUri.protocol(sCurrentProtocol);
			}
			if (sapServer) {
				oUri.addSearch('sap-server', sapServer);
			}
			if (sapHost) {
				oUri.addSearch('sap-host', sapHost);		
			}
			if (sapHostHttp) {
				oUri.addSearch('sap-host-http', sapHostHttp);
			}
			if (sapClient) {
				oUri.addSearch('sap-client', sapClient);		
			}
			oUriString = oUri.toString();
			if (oUriString == "") {
				value = value.replace("https", "http");
				return value;
			}
			else {
				return oUri.toString();
			}
				
		},
		
		formatBusinessCardCaller : function(sPartnerName){
			
		var s3Controller = this.getParent().getParent().getParent().data("controller");
	    var sPartnerFunctionCode = this.getBindingContext('json').getObject().PartnerFunctionCode;
			switch (sPartnerFunctionCode){
			case  '00000014' :
				                this.attachPress(s3Controller.onEmpBusCardLaunch,s3Controller);
		    break;
			case  '00000015' :
			case  '00000021' :	
			   this.attachPress(s3Controller.onEmployeeLaunch,s3Controller);
				break;
		    default : 
		    	this.attachPress(s3Controller.onAccountBusCardLaunch,s3Controller);
			}
			
			
		return sPartnerName;	
		}
	    
	    
		
		
		
		
};