/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.payslip.view.S3", {
	
//	Controller Hook method definitions	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,

    onInit: function() {
        //execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);    
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		
		this.oRouter.attachRouteMatched(this.handleRouteMatched,this); 
	    
//		model bound to selection
	    this.jsonModel = new sap.ui.model.json.JSONModel();
	    this.getView().setModel(this.jsonModel,"NewModel");
	    
    },

//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    handleRouteMatched :function(oEvent){
    	  var view = this.getView();
    	  var itemModel = null;
    	
		if (oEvent.getParameter("name") === "detail") {
			var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
			view.setBindingContext(context);
			
			var pdfProp = this.getPdfUrl(context);
			
			itemModel = {};
	        itemModel.EndDate = pdfProp.EndDate;
	        itemModel.SEQUENCENUMBER= pdfProp.SEQUENCENUMBER;
	        itemModel.PDFPayslipUrl= pdfProp.PDFPayslipUrl;	        
	        this.jsonModel.setData(itemModel);
	        
//			this.getView().byId('PDF_CTRL').setProperty("src", pdfProp.PDFPayslipUrl);
			
			this.oApplicationImplementation.defineDetailHeaderFooter(this);
		}
    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    
//    refresh :function(channelId, eventId, data){
//
//		if (data && data.context) {
//
//			// set context of selected master object
//			this.getView().setBindingContext(data.context);
//			var pdfProp = this.getPdfUrl(data.context);//get the context with proper url and other properties
////			this.jsonModel.setData(context);
////			$(".embedPdf").attr("src", pdfProp.PDFPayslipUrl);
//
//			this.getView().byId('PDF_CTRL').setProperty("src", pdfProp.PDFPayslipUrl);
////			sap.ui.getCore().applyChanges();
//		}    	
//    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
   
    getPdfUrl : function(context) {
        
        var pdfProp = {};
        if(context.getProperty("")){ //If navigation is from master S2 screen then selected list item will have context.__metadata
        	pdfProp.PDFPayslipUrl = context.getProperty("").__metadata.uri.replace("Payslips", "PDFPayslips") + "/$value";
        	pdfProp.SEQUENCENUMBER = context.getProperty("").SEQUENCENUMBER;
        	pdfProp.EndDate = context.getProperty("").EndDate;
        }
        else //when direct # url is used to load S3
        	pdfProp.PDFPayslipUrl = (context.getModel().sServiceUrl + context.sPath).replace("Payslips", "PDFPayslips") + "/$value";        

        //Replacing '' with escape character for URL call: PersonnelAssignment='00000000'
        pdfProp.PDFPayslipUrl = pdfProp.PDFPayslipUrl.replace("'","&#39;");
        pdfProp.PDFPayslipUrl = pdfProp.PDFPayslipUrl.replace("'","&#39;");
        
        if (jQuery.sap.getUriParameters().get("local")) {
            var a = window.location.href.indexOf("index.html");
            var c = null;
            if (a > -1) {
                c = window.location.href.substring(0, a);
            } else {
            	var origin = window.location.protocol + "//" 
            	+ window.location.hostname + (window.location.port ? ':'
            	+ window.location.port : '');
                c = origin + window.location.pathname;
            }
            var e = pdfProp.PDFPayslipUrl.indexOf("http://") > -1 ? pdfProp.PDFPayslipUrl.replace("http://", "proxy/http/") : pdfProp.PDFPayslipUrl.replace("https://", "proxy/https/");
            pdfProp.PDFPayslipUrl = c + e;
        }
        
        return pdfProp;
       
    },
    
 // Formatter for concatenating string in the View    
    stringFormatter: function(){
        var str = "";
        
        for(var i=0; i<arguments.length; i++){
        	str = str + " " + arguments[i]; 
        }
        return str;
     },
   //Number Formatter for amount
     numberFormat: function(number){
     	try {
 			if (!isNaN(parseFloat(number)) && isFinite(number)) {
 				var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
 				return numberFormatter.format(number);
 			}
 		} catch (e) {
 			jQuery.sap.log.warning(number+" couldn't be formatted to Number","numberFormat in S3 Controller","Payslip");
 		}
 		return number;
     },
     numberFormatter:function(){
    	 if(arguments.length>1)
    		 arguments[1] = this.numberFormat(arguments[1]);
    	 var str = "";
         for(var i=0; i<arguments.length; i++){
         	str = str + " " + arguments[i]; 
         }
         return str;
     },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    /**
     * Uncomment if you need to navigate to a subdetail view
     *
     */
    /*
    navToSubview: function(){
        this.oRouter.navTo("subDetail", {
            contextPath : this.getView().getBindingContext().sPath.substr(1) // Remove initial /
        });
    }
    */
    
//	navToEmpty : function() {                                                                               
//		this.oRouter.navTo("noData");                                                                    
//	},
	
    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
    	var that = this;
    	var objHdrFtr =  {
            	
            	oAddBookmarkSettings : {
            		title : that.resourceBundle.getText("DISPLAY_NAME_DETAILS"),  
            		icon: "sap-icon://travel-expense-report"// //Fiori2/F0395
            		},

            };
    	
    	/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.payslip.view.S3~extHookChangeFooterButtons
         * @param {object} objHdrFtr-Header Footer Object
         * @return {object} objHdrFtr-Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	 return objHdrFtr;
    },

});
