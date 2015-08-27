/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.payslip.utils.PdfLoader");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.payslip.view.S3_Phone", {
	
//	Controller Hook method definitions	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,
	
	extHookChangeFooterButtons: null,
    onInit: function() {
        //execute the onInit for the base class BaseDetailController
        sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);    
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        
		this.oRouter.attachRouteMatched(this.handleRouteMatched,this); 
		
	    // pdf loader
	    this.oPfdLoader = new hcm.emp.payslip.utils.PdfLoader();
	    
	    // model bound to selection
	    this.jsonModel = new sap.ui.model.json.JSONModel();
	    this.getView().setModel(this.jsonModel,"NewModel");
	    
	    this._zoomableScrollContainer = this.getView().byId("PAYSLIP_PDF_VIEWER_CONTAINER");
	    this._busy = this.getView().byId("PAYSLIP_BUSY_CURSOR_CONTAINER");
		
	    // add delegates
	    this._zoomableScrollContainer.addEventDelegate({onAfterRendering: jQuery.proxy(this.afterZoomableScrollContainerRendering,this)}, this);

	    this._pdfViewer = this._zoomableScrollContainer.getContent()[0];

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
 			jQuery.sap.log.warning(number+" couldn't be formatted to Number","numberFormat in S3_Phone Controller","Payslip");
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
     * Handler for ZoomScrollContainer Rendering
     */
   afterZoomableScrollContainerRendering : function() {
        this._zoomableScrollContainer.getDomRef().style.marginLeft = "2.5%";
        this._pdfViewer.UnloadPdf();
        this._pdfViewer.ClearPdfData();
        this._pdfViewer.Show(this.oPfdLoader);
    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    showBusyCursor: function(){
    	setTimeout(jQuery.proxy(function() {
            if (null!=this._busy)
                this._busy.setVisible(true);
        }, this), 0);
    	
    },
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    hideBusyCursor: function(){
    	 setTimeout(jQuery.proxy(function() {
    	        if (null!=this._busy)
    	            this._busy.setVisible(false);
    	    }, this), 0);
    },
	
	
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    handleRouteMatched :function(oEvent){
    	  var view = this.getView();
    	  var itemModel = null;
    	
		if (oEvent.getParameter("name") === "detail_p") {
			var context = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + oEvent.getParameter("arguments").contextPath);
			view.setBindingContext(context);
			
			var pdfProp = this.getPdfUrl(context);			
			
			itemModel = {};
			itemModel.initialScale = jQuery.device.is.phone ? 1/4 : 1;
	        itemModel.minScale = jQuery.device.is.phone ? 1/4 : 1;
	        itemModel.maxScale = jQuery.device.is.phone ? 2 : 3;
			
	        itemModel.EndDate = pdfProp.EndDate;
	        itemModel.SEQUENCENUMBER= pdfProp.SEQUENCENUMBER;
	        itemModel.PDFPayslipUrl= pdfProp.PDFPayslipUrl;	        
	        this.jsonModel.setData(itemModel);
	        
	        
//			this._zoomableScrollContainer.setProperty("initialScale", jQuery.device.is.phone ? 1/4 : 1 );
//			this._zoomableScrollContainer.setProperty("minScale", jQuery.device.is.phone ? 1/4 : 1);
//			this._zoomableScrollContainer.setProperty("maxScale", jQuery.device.is.phone ? 2 : 3 );	
			this._zoomableScrollContainer.invalidate();		    

//			view.byId('PDF_VIEWER_CTRL').setProperty("src", pdfProp.PDFPayslipUrl);
//			this.setBtnEnabled("PAYSLIP_DETAIL_BTN_OPEN_PDF", itemModel != null);  // enable open button
			
			this.oApplicationImplementation.defineDetailHeaderFooter(this);
		}
    },		
	
	
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
        //pdfProp.PDFPayslipUrl = pdfProp.PDFPayslipUrl.replace("'","&#39;");
        //pdfProp.PDFPayslipUrl = pdfProp.PDFPayslipUrl.replace("'","&#39;");
        
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
//----------------------------------------------------------------------------------------------------------------------------------------------------------    
    onOpenPDFClicked : function (evt) {

        // open in new window
    	  jQuery.sap.log.info("open pdf pressed");
        var endDate = new Date(Date.parse(this.jsonModel.oData.EndDate));
        var month = ("0" + (endDate.getMonth()+1)).slice(-2);
        var day =  ("0" + endDate.getDate()).slice(-2);
        var year = endDate.getFullYear();
        var dateString = month + '.' + day + '.' + year;
//
        var newWindow = window.open(this.jsonModel.oData.PDFPayslipUrl , "_blank");
//
//        // set title window
        newWindow.onload = jQuery.proxy(function() {
            newWindow.document.title = this.resourceBundle.getText('PDF_WINDOW_TITLE', [dateString]);;
        }, this);
    },
    
//	navToEmpty : function() {                                                                               
//		this.oRouter.navTo("noData");                                                                    
//	},
	
    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
//----------------------------------------------------------------------------------------------------------------------------------------------------------
    getHeaderFooterOptions: function() {
    	var that = this;
    	
    	var objHdrFtr = {
            	
            	buttonList : [{
            		sId : "PAYSLIP_DETAIL_BTN_OPEN_PDF",
    				sI18nBtnTxt : "OPEN_AS_PDF",
    				bEnabled : true,
    				onBtnPressed : function(evt) {
    					that.onOpenPDFClicked(evt);
                    }
    			}],
            	
            	oAddBookmarkSettings : {
            		title : that.resourceBundle.getText("DISPLAY_NAME_DETAILS"),  
            		icon: "sap-icon://travel-expense-report"// //Fiori2/F0395
            		},

            };
    	/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.payslip.view.S3_Phone~extHookChangeFooterButtons
         * @param {object} objHdrFtr-Header Footer Object
         * @return {object} objHdrFtr-Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	 return objHdrFtr;
    },	
	
});
