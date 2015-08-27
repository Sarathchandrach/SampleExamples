/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");

// NLUN - CodeScan Changes - Global variable / Bad definition
cus.crm.opportunity.util.Formatter = {
    Date: function (oValue) {
    	if(oValue){
    		return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "short"}).format(oValue);
    	}
    	else {
    		return "";
    	}
    },

    currencycode: function (value1) {
    	if(value1){
    		return  sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("UNWEIGHTED_VOLUME_IN",[value1]);
    	}
    	else{
    		return "";
    	}
    },

    statusState: function (value) {

        if (value) {
            if (value == "E0001") {
                return "None";
            }
            if (value == "E0002") {
                return "Warning";
            }
            if (value == "E0003") {
                return "Success";
            }
            if (value == "E0004") {
                return "Error";
            }

        }
        else
            return "None";
    },

    quantity: function (value, value2) {
    	//return sap.ca.ui.model.format.NumberFormat.getInstance().format(value)+" "+ value2;
    	//maybe quantityformatter is even better 
    	
    	var val = cus.crm.opportunity.util.Formatter.formatQuantityEdit(value, value2);
    	return val+" "+ value2;
    },
    
    formatQuantityEdit: function (value, value2) {
    	if(value % 1 == 0)
    		return sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(value, value2, "0");
    	else
    		return sap.ca.ui.model.format.QuantityFormat.FormatQuantityStandard(value, value2, "3");
    },
 
    weightedvolume: function (value, value1, value2) {
        var val = value * value1 * 1.00 / 100.00;
        return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(val , value2 );
        //if you don't want any decimals  return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(val , value2, 0);
    },
    
    totalexpectednetValue: function(value, value1)
    {
    	return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(value , value1 );
    },


    formatDescription: function (sText, sDescription) {
        return sText + " : " + sDescription;
    },
    concatenateNameAndId: function (sText, sDescription) {
        return sText + " " + sDescription;
    },   

    volumeFormatter: function (value, currency) {
    	
    	if(parseFloat(value) <= 0){
    		return "";
    	}
    	return sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(value , currency );
    },


    dateFormatter: function (oValue) {
   	if(oValue === "" || oValue === null || oValue === undefined)
		return "";
   	
   	if(!(oValue instanceof Date)){
   		 oValue = new Date(oValue);
   	}
   	
  // 	oValue.setMinutes(oValue.getTimezoneOffset());
   	
	var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
	var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},locale);
	return  formatter.format(oValue);
   	 
   },
   dateFormatterMaster: function (oValue) {
	   	if(oValue === "" || oValue === null || oValue === undefined)
			return "";
	   	
	   	if(!(oValue instanceof Date)){
	   		 oValue = new Date(oValue);
	   	}
	   	
	  // 	oValue.setMinutes(oValue.getTimezoneOffset());
	   	
		var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},locale);
		return  sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText('CLOSE_DATE')+ ": " +formatter.format(oValue);
	   	 
	   },



   texttonumber: function (value) {
   	return Number(value);

   },
   
   infotexttonumber: function (value) {
	   	return Number(value) + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PERCENTAGE_SIGN") ;

	   },

    checkValue: function (value, value1, val3) {
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


    forecast: function (value) {
        if (value === "X"){
            return true;
        }
        else
        {
            return false;
        }
    },


    mimeTypeFormatter: function (value) {

        switch (value) {
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
    resetFooterContentRightWidth: function (oController) {
    	// BTHI - Formatter scan : this file should be in the controller not in the formatter file
        var oPage = oController.getView().getContent()[0];
        var rightBar = jQuery.sap.byId(oPage.getFooter().getId() + "-BarRight");
        var iRBWidth = rightBar.outerWidth(true);
        if (iRBWidth > 0) {
            oController.iRBWidth = iRBWidth;
        }
        if (rightBar.width() === 0 && oController.iRBWidth) {
            jQuery.sap.log.info('Update footer contentRight Width=' + oController.iRBWidth);
            rightBar.width(oController.iRBWidth);
        }

    },

    truncateVolume: function(sValue, sCurrency){
    	if(sValue > 0 ){
            return sap.ca.ui.model.format.AmountFormat.FormatAmountShort(sValue , sCurrency );
    	}
    	return "";
    },

//    pictureUrlFormatter: function (accountID) {
//        var URl;
//        var container = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer;
//
//        var oModel = container.getCurrentMasterPage().getModel();
//
//        //else
//        //var oModel = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getDetailPages()[0].getController().byId('Sales_Team').getModel();
//
//
//        var oLogo = "sap-icon://person-placeholder";
//
//
//        if (accountID != "" && accountID != undefined) {
//            var sPath = "/AccountCollection('" + accountID + "')";
//            var that = this;
//
//
//            oModel.read(sPath, null, ["$expand=Logo"], false, function (odata, response) {
//                jQuery.sap.log.info("oData account response");
//                if (odata.Logo && odata.Logo.__metadata) {
//                    // defaul account log tbd
//                    var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src: "sap-icon://person-placeholder";
//                    //oLogo = cus.crm.opportunity.util.Formatter.urlConverter(oMetadata);
//                    URl = oMetadata.replace(/^https:\/\//i, 'http://');
//                    oLogo = URl.toString();
//
//                }
//                ;
//
//            });
//            return oLogo;
//        }
//        else {
//            return oLogo;
//        }
//    },

    getRelativePathFromURL : function(absoluteURL){
		var url =  document.createElement('a');
		url.href = absoluteURL;
		if(url.pathname.substring(0, 1) == "/")
			return url.pathname;
		else
			return "/" + url.pathname;
	},
	
    urlConverter: function (value) {
        var sapServer = jQuery.sap.getUriParameters().get("sap-server");
        var sapHost = jQuery.sap.getUriParameters().get("sap-host");
        var sapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
        var sapClient = jQuery.sap.getUriParameters().get("sap-client");
        var oUriString;

       var oUri = URI(location.protocol + "//" + location.hostname + (location.port ? ':'+location.port: '') + cus.crm.opportunity.util.Formatter.getRelativePathFromURL(value));
        var sCurrentProtocol = location.protocol.replace(':', '');
        if (sCurrentProtocol !== oUri.protocol())
            oUri.protocol(sCurrentProtocol);

        if (sapServer)
            oUri.addSearch('sap-server', sapServer);

        if (sapHost)
            oUri.addSearch('sap-host', sapHost);

        if (sapHostHttp)
            oUri.addSearch('sap-host-http', sapHostHttp);

        if (sapClient)
            oUri.addSearch('sap-client', sapClient);

        oUriString = oUri.toString();
        if (oUriString == "") {
            value = value.replace("https", "http");
            return value;
        }
        else {
            return oUri.toString();
        }
        ;

    },
    
    salesteamplacement : function(value)
    {
    	return "  " + " : " + "  " + value ;
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
	formatAddMoreProductsText : function(sText){
		
		if(jQuery.device.is.phone)
			return "";
		
		return sText;
		
		
	},
	formatParticipant : function(sPartnerFunctionCode){
		
		var s3Controller = this.getParent().getParent().data("controller");
		
		//check backend schema versioning - if it is less than 2.0 the visibility should be false 
		var dataServiceVersion= parseFloat(s3Controller.sBackendVersion);
		if(dataServiceVersion < 2)	
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
	
	formatParticipantDelete : function(sPartnerFunctionCode){
    	
    	
    	var s3Controller = this.getParent().getParent().data("controller");
    	
    	//check backend schema versioning - if it is less than 2.0 the visibility should be false
    	if(parseFloat(s3Controller.sBackendVersion)   < 2)
    		return false;
		
    	var oPartnerFunctionRule = s3Controller.getRuleForPartnerFunction(sPartnerFunctionCode);
		
		if(oPartnerFunctionRule === null){
			return false;
		}
		
	/*	if(!s3Controller.partnerFunctionMap.hasOwnProperty(sPartnerFunctionCode)){
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
		}
		*/
	    
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
	//filling account id if account name is empty - for view page
	 formatProspect:function(prospect_name,prospect_number)
	    {
	    	if(prospect_name==="")
	    		return prospect_number;
	    	return prospect_name;
	    },
	    formatBusinessCardCaller : function(sPartnerName,sPartnerNumber){
			
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
				
				
			return (sPartnerName === "") ? sPartnerNumber : sPartnerName;	
			},
			formatPhotoUrl : function(mediaUrl) {
				return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
			},
			/*urlConverter : function(value) {

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
					
			},*/
			formatAccountF4Description : function(accountID, city, country){
				
				var sReturn = accountID;
				
				if(city){
					sReturn += " / " + city;
					if(country){
						sReturn += ", " + country; 
					}
					
				}
				else{
					if(country){
						sReturn += " / " + country;
					}
					
				}
				
				return sReturn;
			}	,
			getAccountF4Title : function(fullName){
				var text = " ";
				
				if (fullName){
					text = fullName;
				}
				return text;
			},
			
			removeMarginInPhone : function(sImgSrc){
				
				if(jQuery.device.is.phone){
					this.addStyleClass("removeMargin");
				}
				return sImgSrc;
			},
			
			addLayoutPadding : function(bPhone){
				if(bPhone){
					this.addStyleClass("ImagePaddingMobile");
				}
				else{
					this.addStyleClass("ImagePadding");
				}
				
				return true;
			},
			
			formatPartnerName : function(sPartnerName,sPartnerNumber){
				return (sPartnerName === "") ? sPartnerNumber : sPartnerName;
			},
			
			FormatDocHistory: function (value) {
		        if (value === "BUS2000111" || value === "BUS2000125" || value === "BUS2000126" || value ==="BUS2000108"){
		        	return true;
		        }
		        else
		        {
		            return false;
		        }
		    },
			
			notesDateFormatter: function (oValue) {
				   	if(oValue === "" || oValue === null || oValue === undefined)
						return "";
				   	
				   	if(!(oValue instanceof Date)){
				   		 oValue = new Date(oValue);
				   	}
				   	
				   	oValue.setMinutes(oValue.getTimezoneOffset());
				   	
					var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
					var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},locale);
					return formatter.format(oValue);
				   	 
				   },
				   
				   
				   formatSalesOrganization : function(SalesOrganizationDescription, SalesOrganizationId){
					   var SalesOrganization = "";
					   if(SalesOrganizationId != undefined && SalesOrganizationId != "")
					   {
						   SalesOrganization = SalesOrganizationDescription + " (" + SalesOrganizationId + ")";
					   }
					   return SalesOrganization;
				   },
			
				   formatDistributionChannel : function(DistributionChannelDescription, DistributionChannelId){
					   var DistributionChannel = "";
					   if(DistributionChannelId != undefined && DistributionChannelId != "")
					   {
						   DistributionChannel = DistributionChannelDescription + " (" + DistributionChannelId + ")";
					   }
					   return DistributionChannel;
				   },
			
				   formatDivision : function(DivisionDescription, DivisionId){
					   var Division = "";
					   if(DivisionId != undefined &&  DivisionId != "")
					   {
						   Division = DivisionDescription + " (" + DivisionId + ")";
					   }
					   return Division;
				   },
				   
				   formatForecastText : function(bForecastRelevance){
					  if(bForecastRelevance){
						  return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("ON");
					  }
					  else{
						  return sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("OFF");
					  }
				   },
				   
				   
				   formatMobileIconVisibility : function(sMobileNumber){
					
					   if(sMobileNumber === ""){
						 return false;
					   }
					 
					 return true;
				   }

		    

};

