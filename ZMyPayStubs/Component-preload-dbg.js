jQuery.sap.registerPreloadedModules({
"name":"hcm/emp/payslip/Component-preload",
"version":"2.0",
"modules":{
	"hcm/emp/payslip/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("hcm.emp.payslip.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
jQuery.sap.require("hcm.emp.payslip.Configuration");
                                                     



// new Component
sap.ca.scfld.md.ComponentBase.extend("hcm.emp.payslip.Component", {
	

	metadata: sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		
		"name": "My Paystubs", //F0395
		"version": "1.4.2",
		"library": "hcm.emp.payslip",
		"includes": [],
		"dependencies": {
			"libs": ["sap.m", "sap.me"],
			"components": []
		},
		
		"config": {
			"titleResource": "DISPLAY_NAME",
			"resourceBundle": "i18n/i18n.properties",
			"icon": "sap-icon://travel-expense-report",// //Fiori2/F0395
			"favIcon": "./resources/sap/ca/ui/themes/base/img/favicon/My_Pay_Stubs.ico",
			"homeScreenIconPhone": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Pay_Stubs/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Pay_Stubs/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Pay_Stubs/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2": "./resources/sap/ca/ui/themes/base/img/launchicon/My_Pay_Stubs/144_iPad_Retina_Web_Clip.png",
		},
	
		// Navigation related properties
		masterPageRoutes: {
			"master": {
				"pattern": ":scenarioId:",
				"view": "hcm.emp.payslip.view.S2"
			}
		},
		
		detailPageRoutes: {
			"detail": {
				"pattern": "detail/{contextPath}",
				"view": "hcm.emp.payslip.view.S3"
			},
			"detail_p": {
				"pattern": "detail_p/{contextPath}",
				"view": "hcm.emp.payslip.view.S3_Phone"
			}
		},
	}),
	
	
	
	
//	metadata : {
//		"name": "Master Detail Sample",
//		"version" : "1.0.0",
//		"library" : "hcm.emp.payslip",
//		"includes" : [],  
//		"dependencies" : { 
//			"libs" : [ "sap.m","sap.me"	],  
//			"components" : []
//		},			
//		"routing" : {
//			
//			"config" : {
//				"viewType" : "XML",
//				"viewPath" : "hcm.emp.payslip.view",
//				"targetControl" : "MainSplitContainer",
//				"targetAggregation" : "detailPages",
//				"viewLevel": undefined,
//				"clearTarget" : false
//			},
//			
//			"routes" : [{
//				"pattern" : "", // will be the url and from has to be provided in the data
//				"view" : "MainSplitContainer",
//				"name" : "masterDetail",
//				"viewPath" : "sap.ca.scfld.md.view",
//				"targetControl" : "fioriContent", // This is the control in which the new view will be placed  
//				"targetAggregation" : "pages", // This is the aggregation in which the new view will be placed 
//				
//					"subroutes" : [{
//						
//						"pattern" : "", // will be the url and from has to be provided in the data
//						"view" : "S2",
//						"name" : "master", // name used for listening or navigating to this route
//						"targetAggregation" : "masterPages",
//						"viewLevel" : 0,  
//					}, 
//					{
//	                    "pattern": "detail/{from}/:context:",
//	                    "view": "S3",
//	                    "name": "detail",
//	                    "viewLevel": 1
//			            
//					},
//					
//					{
//                        "pattern": "noData",
//                        "viewPath": "sap.ca.scfld.md.view",
//                        "view": "empty",                      
//                        "name": "noData",
//                        "viewLevel": 1,
//					}
//
//					
//					]				
//					
//			}]
//		}
//	}, 	
	

	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {component: this};

		return sap.ui.view({
			viewName : "hcm.emp.payslip.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},                                                                                                                    

//    init : function() {
//            sap.ui.core.UIComponent.prototype.init.apply(this, arguments); // calls createContent (among others)
//
//            this.getRouter().attachRouteMatched(this._handleRouteMatched);
//
//            // this component should automatically initialize the router!
//            this.getRouter().initialize();
//    },

//	_handleRouteMatched : function (evt) {
//	
//	        var oApp = evt.getParameter("targetControl");
//	        
//	        if (!(oApp instanceof sap.m.NavContainer || oApp instanceof sap.m.SplitContainer)) {
//	                return;
//	        }
//	
//	        // close open popovers
//	        if (sap.m.InstanceManager.hasOpenPopover()) {
//	                sap.m.InstanceManager.closeAllPopovers();
//	        }
//	
//	        // close open dialogs
//	        if (sap.m.InstanceManager.hasOpenDialog()) {
//	                sap.m.InstanceManager.closeAllDialogs();
//	        }
//	
//	        // navigate to the view in nav container
//	        var oView = evt.getParameter("view");
//	        var iViewLevel = evt.getParameter("config").viewLevel;
//	        
//	        var bNextPageIsMaster = (oApp instanceof sap.m.SplitContainer) && !!oApp.getMasterPage(oView.getId()) ;
//	        
//	        var oHistory = sap.ui.core.routing.History.getInstance();
//	        
//	        var bBack;
//	        
//	        if(iViewLevel === undefined || this._iCurrentViewLevel === undefined || iViewLevel === this._iCurrentViewLevel){
//	                bBack = oHistory.getDirection() === "Backwards";
//	        } else {
//	                bBack = (iViewLevel !== undefined && iViewLevel < this._iCurrentViewLevel);
//	        }
//	        
//	        if (bBack) {
//	                // insert previous page if not in nav container yet
//	                var oPreviousPage = oApp.getPreviousPage(bNextPageIsMaster);
//	                if (!oPreviousPage || oPreviousPage.getId() !== oView.getId()) {
//	                        oApp.insertPreviousPage(oView.getId());
//	                }
//	                oApp.backToPage(oView.getId());
//	        } else {
//	                oApp.to(oView.getId());
//	        }
//	
//	        this._iCurrentViewLevel = iViewLevel;
//	}
	
});

},
	"hcm/emp/payslip/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.payslip.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "SRA006_SRV",
                masterCollection: "Payslips",
                serviceUrl: "/sap/opu/odata/sap/SRA006_SRV/",
                isDefault: true,
                mockedDataSource: "/hcm.emp.payslip/model/metadata.xml"
            }
        ]
    },
    
//    oRouteConfig:{        
//        isMaster: function (sPageId) {
//	        // if there are more master views we could have a list of masters to check against
//            return "S2" === sPageId;
//        },
//        viewName: function (sPageId) {
//            return "hcm.emp.payslip" + ".view." + sPageId;
//        },
//        viewType: "XML",
//        transition: "slide",
//        routes : [{
//			pattern : "", // will be the url and from has to be provided in the data
//			viewId : "S2",
//			name : "master", // name used for listening or navigating to this route
//			isHome : true,
//            containerName: "split",
//            parentRoute: "md",
//		}, {
//			pattern : "detail/{from}/:context:", // will be the url and from has to be provided in the data
//			viewId : "S3",
//			name : "detail",// name used for listening or navigating to this route
//            containerName: "split",
//            parentRoute: "master",
//		}]
//    },
   

    getServiceParams: function () {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function () {
        return this.oServiceParams.serviceList;
    },


    getMasterKeyAttributes : function() {
        return ["Id"];
    }

});

},
	"hcm/emp/payslip/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.emp.payslip.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('hcm.emp.payslip', this);
		jQuery.sap.require("sap.ca.ui.model.type.Date");
	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}	
	
});
},
	"hcm/emp/payslip/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="hcm.emp.payslip.Main"\n\tdisplayBlock="true"\n\theight="100%">\n\t<NavContainer\n\t\tid="fioriContent"\n\t\tshowHeader="false">\n\t</NavContainer>\n</core:View>\n',
	"hcm/emp/payslip/controls/EmbedPdf.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.EmbedPdf");
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.ui.core.RenderManager");

sap.ui.core.Control.extend("hcm.emp.payslip.controls.EmbedPdf", { metadata:{

    // ---- object ----
    properties:{
        "src":{type:"string", group:"Misc"},
        "noPluginMessage":{type:"string", group:"Misc"}
    }
}});

hcm.emp.payslip.controls.EmbedPdf.prototype.exit = function () {
    if ($.browser.msie) {
        $('.embedPdf').remove();
    }
};

hcm.emp.payslip.controls.EmbedPdf.prototype.init = function () {
    if ($.browser.msie) {
        $('.embedPdf').remove();
    }
};

},
	"hcm/emp/payslip/controls/EmbedPdfRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.EmbedPdfRenderer");

hcm.emp.payslip.controls.EmbedPdfRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 *
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
hcm.emp.payslip.controls.EmbedPdfRenderer.render = function(oRenderManager, oControl){
    // convenience variable
    var rm = oRenderManager;

 // write the HTML into the render manager
    rm.write("<iframe ");
    rm.writeControlData(oControl);    
    rm.write("src='");  
    rm.write(oControl.getSrc());  
    rm.write("#view=fitH'");    
    rm.addClass("embedPdf"); 
    rm.writeClasses();    
    rm.addStyle("width", "99.6%"); // at 100% the scrollbar is clipped
    rm.addStyle("height", "76%");
    rm.writeStyles();
    rm.write("type='application/pdf'");
    rm.write(">");
    //rm.write("<param name=\"zoom\" value=\"85%\" />");
    //rm.write(oControl.getNoPluginMessage());
    rm.write("</iframe>");


};


},
	"hcm/emp/payslip/controls/PDFViewer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.PDFViewer");
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.ui.core.RenderManager");

sap.ui.core.Control.extend("hcm.emp.payslip.controls.PDFViewer", { metadata:{

    // ---- object ----
    properties:{
        "src":{type:"string", group:"Misc"},
        "errorMessage":{type:"string", group:"Misc"},
        "setPdfData":{type:"string", group:"Misc"}
    },
    events:{
        "begin":{},
        "complete":{}
    }
}});

hcm.emp.payslip.controls.PDFViewer.prototype.exit = function () {
    jQuery.sap.log.debug("exit "+this.getSrc());
    this.UnloadPdf();
    this.ClearPdfData();
};

hcm.emp.payslip.controls.PDFViewer.prototype.Show = function (loader) {

    // no need to test empty source
    var sourceURL = this.getSrc();
    if (null==sourceURL || sourceURL.length==0) {
        return;
    }
    // no need to reload the pdf if we already have it
    if (!this._pdfData) {
        // load the pdf
        this.fireBegin();
        loader.LoadPdf(sourceURL, jQuery.proxy(this.setPdfData, this), jQuery.proxy(this.showErrorMessage, this));
    } else {
        // just render the pdf
        this.RenderPdf();
    }
};

hcm.emp.payslip.controls.PDFViewer.prototype.ClearPdfData = function() {
    this._pdfData = null;
};

hcm.emp.payslip.controls.PDFViewer.prototype.UnloadPdf = function () {

    if (this._pdf != null) {
        jQuery.sap.log.debug("UnloadPdf " + this.getSrc());
        this._pdf.destroy();
        this._pdf = null;

        $(this.getDomRef()).empty();
    }
};

hcm.emp.payslip.controls.PDFViewer.prototype.setPdfData = function (data) {

    this._pdfData = data;
    this.RenderPdf();
};

hcm.emp.payslip.controls.PDFViewer.prototype.showErrorMessage = function (responseText) {

    // get response
    var errorResponse = (null!=responseText) ? null : JSON.parse(responseText);
    // show error
//    hcm.emp.payslip.Service.showError(this.getErrorMessage(), errorResponse);TODO
};


hcm.emp.payslip.controls.PDFViewer.prototype.RenderPdf = function() {
//    jQuery.sap.measure.start(sap.hcm.payslip.utils.PerfUtils.getStartId(sap.hcm.payslip.utils.PerfUtils.RenderPdf));

    var id = this.getDomRef(), that = this, contextArray = [];
    jQuery.sap.log.debug("RenderPdf "+this.getSrc());

    if (id.childNodes != null && id.childNodes.length > 0) {
        // The control is already rendered
        setTimeout(function() {
            jQuery.sap.log.debug("The control is already rendered");
            that.fireComplete();
        }, 500);

        return;
    }

        var pdfPath = jQuery.sap.getModulePath("hcm.emp.payslip") + "/ext/pdfjs/pdf.js";//com.sap.kelley.getAppContainer().getDescriptor("Payslip").getPdfPath();
//    if (sap.ui.core.AppCacheBuster && !jQuery.sap.getUriParameters().get("local")) {
//        pdfPath = sap.ui.core.AppCacheBuster.convertURL(pdfPath);
//    }
        
    jQuery.sap.require("hcm.emp.payslip.ext.pdfjs.pdf");
    if (PDFJS.workerSrc != pdfPath) {
        PDFJS.workerSrc =  pdfPath;
    }

    // Fetch the PDF document from the URL using promices
    PDFJS.getDocument(this._pdfData).then(function getPdfForm(pdf) {
        // Rendering all pages starting from first
        that._pdf = pdf;
        var viewer = id, pageNumber = 1;
        that.renderPage(viewer, pdf, pageNumber++, function pageRenderingComplete() {

            // check for last page
            if (pageNumber > pdf.numPages) {
                jQuery.sap.log.debug("renderPage complete");
                that.fireComplete();
//                jQuery.sap.measure.end(sap.hcm.payslip.utils.PerfUtils.getEndId(sap.hcm.payslip.utils.PerfUtils.RenderPdf));
                return; // All pages rendered
            }

            // continue rendering of the next page
            jQuery.sap.log.debug("render another page");
            that.renderPage(viewer, pdf, pageNumber++, pageRenderingComplete);

        }, contextArray);
    });
};


hcm.emp.payslip.controls.PDFViewer.prototype.renderPage = function(div, pdf, pageNumber, callback) {
    pdf.getPage(pageNumber).then(function(page) {
        jQuery.sap.log.debug("renderingPage "+pageNumber);
        var containerWidth, viewportWithoutZoom, viewportWidth, factor, scale, viewport;

        scale = 2;

        // check for valid page
        if (null==div.offsetParent || null==div.offsetParent.clientWidth)  {
            jQuery.sap.log.debug("invalid offsetParent");
            return;
        }

        containerWidth = div.offsetParent.clientWidth;
        viewportWithoutZoom = page.getViewport(1);
        viewportWidth = viewportWithoutZoom.width;
        factor = jQuery.device.is.phone ? 1 : containerWidth / viewportWidth;
        viewport = page.getViewport(scale * factor);

        var pageDisplayWidth = viewport.width;
        var pageDisplayHeight = viewport.height;

        var pageDivHolder = document.createElement('div');
        pageDivHolder.className = 'pdfpage';

        if (jQuery.device.is.phone) {
            pageDivHolder.style.width = pageDisplayWidth + 'px';
            pageDivHolder.style.height = pageDisplayHeight + 'px';

        } else {
            pageDivHolder.style.width = pageDisplayWidth / scale + 'px';
            pageDivHolder.style.height = pageDisplayHeight / scale + 'px';
        }

        div.appendChild(pageDivHolder);

        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = pageDisplayWidth;
        canvas.height = pageDisplayHeight;

        if (jQuery.device.is.phone) {
            canvas.style.width = pageDisplayWidth + 'px';
            canvas.style.height = pageDisplayHeight + 'px';

        } else {
            canvas.style.width = pageDisplayWidth / scale + 'px';
            canvas.style.height = pageDisplayHeight / scale + 'px';
        }

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).then(function() {
            pageDivHolder.appendChild(canvas);
            callback();
        });
    });
};


},
	"hcm/emp/payslip/controls/PDFViewerRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.PDFViewerRenderer");

hcm.emp.payslip.controls.PDFViewerRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 *
 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
hcm.emp.payslip.controls.PDFViewerRenderer.render = function(oRenderManager, oControl){
    // convenience variable
    var rm = oRenderManager;

    // write the HTML into the render manager
    rm.write("<div");
    rm.writeControlData(oControl);
    rm.addStyle("width", "100%");
    rm.addStyle("height", "100%");
    rm.writeStyles();
    rm.write(">");
    rm.write("</div>");
};


},
	"hcm/emp/payslip/controls/ZoomableScrollContainer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.ZoomableScrollContainer");

sap.m.ScrollContainer.extend("hcm.emp.payslip.controls.ZoomableScrollContainer", { metadata:{

    // ---- object ----
    publicMethods:[
        // methods
    ],

    // ---- control specific ----
    library:"sap.m",
    properties:{
        "zoomable":{type:"boolean", group:"Misc", defaultValue:true},
        "initialScale":{type:"float", group:"Misc", defaultValue:1},
        "minScale":{type:"float", group:"Misc", defaultValue:1},
        "maxScale":{type:"float", group:"Misc", defaultValue:4}
    },
    events:{

    }
}});


hcm.emp.payslip.controls.ZoomableScrollContainer.prototype.init = function() {
    sap.m.ScrollContainer.prototype.init.apply(this);

};

hcm.emp.payslip.controls.ZoomableScrollContainer.prototype.onAfterRendering = function() {

    var fnCallback = this.getScrollDelegate().onAfterRendering;

    var fScale = this.getInitialScale();
    var fMin = this.getMinScale();
    var fMax = this.getMaxScale();
    var bZoomable = this.getZoomable();


    this.getScrollDelegate().onAfterRendering = function(){
        fnCallback.call(this);
        if(!!this._scroller){
        	this._scroller.scale = fScale;
        	if(!!this._scroller.options){
        		this._scroller.options.zoom = bZoomable;
                this._scroller.options.zoomMin = fMin;
                this._scroller.options.zoomMax = fMax;
                this._scroller.options.onZoom = function(oEvent) {
                    // "this" is the scroller
                };
                this._scroller.options.onZoomStart = function(oEvent) {
                };
        	}
        	if(!!this._scroller.zoom){
        		   this._scroller.zoom(0, 0, fScale);
        	}
        }
    };
};



//
hcm.emp.payslip.controls.ZoomableScrollContainer.prototype.resetContent = function() {
    this.$().append(this.getContent()[0].$());
    this.getScrollDelegate()._scroller.refresh();
};


},
	"hcm/emp/payslip/controls/ZoomableScrollContainerRenderer.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.ZoomableScrollContainerRenderer");
jQuery.sap.require("sap.ui.core.Renderer");
jQuery.sap.require("sap.m.ScrollContainerRenderer");

/**
 * @class ZoomableScrollContainer renderer. 
 * @static
 */
hcm.emp.payslip.controls.ZoomableScrollContainerRenderer = sap.ui.core.Renderer.extend(sap.m.ScrollContainerRenderer);

},
	"hcm/emp/payslip/i18n/i18n.properties":'#Translatable strings for the Payslip application\n# __ldi.translation.uuid=8bd66c80-3a5a-11e3-aa6e-0800200c9a66\n# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT: this is the title for the master section\nMASTER_TITLE=Pay Stubs ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Pay Stub\n\n#XTIT: Application name\nDISPLAY_NAME=My Paystubs \n\n#XTIT: Title for pay slip list\nDISPLAY_NAME_LIST=Pay Stubs ({0})\n\n#XTIT: Title for pay slip details\nDISPLAY_NAME_DETAILS=Pay Stub\n\n#XBUT: Show current selection as PDF in another window\nOPEN_AS_PDF=Open as PDF\n\n#XFLD: Payment type\nPAYSLIP_BONUS_PAYMENT=Bonus Payment\n#XFLD: Payment type\nPAYSLIP_CORRECTION_ACCOUNTING=Correction Accounting\n#XFLD: Payment type\nPAYSLIP_MANUAL_CHECK=Manual Check\n#XFLD: Payment type\nPAYSLIP_REGULAR=Regular Payroll Run\n#XFLD: Payment type\nPAYSLIP_ADDITIONAL=Additional Payment\n\n#XFLD: No Payslip to display in the list\nNO_PAYSLIP=No Data Available\n\n#XFLD: Take home pay\nTAKE_HOME_PAY=Take home pay in\n#XFLD: Employee ID\nEMPLOYEE_ID=Employee ID\n#XFLD: Employee Position\nEMPLOYEE_POSITION=Position\n#XFLD: Payslip deduction amount\nPAYSLIP_DEDUCTIONS=Deductions\n#XFLD: Payslip gross pay amount\nPAYSLIP_GROSSPAY=Gross Pay\n\n#XTIT: Title for maximum PDFs selected\nMAX_SELECTION_TITLE=Maximum Selection\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\nMAX_SELECTION_MESSAGE=You may not select more than {0} pay stubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of pay stubs\n\n#YMSG: Fallback message for list service error (used if server message is not available)\nPDF_SERVICE_ERR_MESSAGE=Could not obtain the PDF of the pay stub\n\n#XTIT: Title for new PFD window {0}:End date of pay stub\nPDF_WINDOW_TITLE=Pay Stub_{0}\n\n#XTIT: Fallback message for EmbedPdfViewer\nNO_PDF_PLUGIN_INSTALLED=You need to install a PDF reader in order to view pay stubs\n\n#XFLD: Message displayed in the list while loading the list of payslips\nLOADING_PAYSLIP=Loading',
	"hcm/emp/payslip/i18n/i18n_ar.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0631\\u0627\\u062A\\u0628\\u064A\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=\\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=\\u0641\\u062A\\u062D \\u0643\\u0645\\u0644\\u0641 PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=\\u062F\\u0641\\u0639\\u0629 \\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0623\\u0629\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=\\u0645\\u062D\\u0627\\u0633\\u0628\\u0629 \\u062A\\u0635\\u062D\\u064A\\u062D\\u064A\\u0629\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=\\u0634\\u064A\\u0643 \\u064A\\u062F\\u0648\\u064A\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=\\u062A\\u0634\\u063A\\u064A\\u0644 \\u0643\\u0634\\u0641 \\u0631\\u0648\\u0627\\u062A\\u0628 \\u0639\\u0627\\u062F\\u064A\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=\\u062F\\u0641\\u0639\\u0629 \\u0625\\u0636\\u0627\\u0641\\u064A\\u0629\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=\\u0635\\u0627\\u0641\\u064A \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 \\u0641\\u064A\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=\\u0627\\u0644\\u0645\\u0646\\u0635\\u0628\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=\\u0627\\u0644\\u0627\\u0633\\u062A\\u0642\\u0637\\u0627\\u0639\\u0627\\u062A\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u062F\\u0641\\u0639\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=\\u0627\\u0644\\u062D\\u062F \\u0627\\u0644\\u0623\\u0642\\u0635\\u0649 \\u0644\\u0644\\u062A\\u062D\\u062F\\u064A\\u062F\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=\\u0644\\u0627 \\u064A\\u0645\\u0643\\u0646\\u0643 \\u062A\\u062D\\u062F\\u064A\\u062F \\u0623\\u0643\\u062B\\u0631 \\u0645\\u0646 {0} \\u0645\\u0646 \\u0642\\u0633\\u0627\\u0626\\u0645 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0642\\u0627\\u0626\\u0645\\u0629 \\u0628\\u0627\\u0644\\u0642\\u0633\\u0627\\u0626\\u0645\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=\\u062A\\u0639\\u0630\\u0631 \\u0627\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u0645\\u0644\\u0641 PDF \\u0644\\u0644\\u0642\\u0633\\u064A\\u0645\\u0629\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=\\u0642\\u0633\\u064A\\u0645\\u0629 \\u0627\\u0644\\u0631\\u0627\\u062A\\u0628 {0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u064A\\u0644\\u0632\\u0645 \\u062A\\u062B\\u0628\\u064A\\u062A \\u0642\\u0627\\u0631\\u0626 \\u0645\\u0644\\u0641\\u0627\\u062A PDF \\u0644\\u0639\\u0631\\u0636 \\u0627\\u0644\\u0642\\u0633\\u0627\\u0626\\u0645\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n',
	"hcm/emp/payslip/i18n/i18n_cs.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=V\\u00FDplatn\\u00ED p\\u00E1sky ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=V\\u00FDplatn\\u00ED p\\u00E1ska\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Moje v\\u00FDplatn\\u00ED p\\u00E1sky\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=V\\u00FDplatn\\u00ED p\\u00E1sky ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=V\\u00FDplatn\\u00ED p\\u00E1ska\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Otev\\u0159\\u00EDt jako PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Platba p\\u0159\\u00EDplatku\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Opravn\\u00E9 \\u00FA\\u010Dtov\\u00E1n\\u00ED\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Manu\\u00E1ln\\u00ED kontrola\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Pravideln\\u00FD b\\u011Bh z\\u00FA\\u010Dtov\\u00E1n\\u00ED mezd a plat\\u016F\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Dopl\\u0148kov\\u00E1 platba\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Nejsou k dispozici \\u017E\\u00E1dn\\u00E1 data\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Platba netto\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=ID zam\\u011Bstnance\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Pozice\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Sr\\u00E1\\u017Eky\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Platba brutto\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maxim\\u00E1ln\\u00ED v\\u00FDb\\u011Br\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Nem\\u016F\\u017Eete vybrat v\\u00EDce ne\\u017E {0} v\\u00FDplatn\\u00EDch p\\u00E1sek\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat seznam v\\u00FDplatn\\u00EDch p\\u00E1sek\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Nelze z\\u00EDskat PDF v\\u00FDplatn\\u00ED p\\u00E1sky\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=V\\u00FDplatn\\u00ED p\\u00E1ska_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Chcete-li zobrazit v\\u00FDplatn\\u00ED p\\u00E1sky, mus\\u00EDte nainstalovat program pro \\u010Dten\\u00ED PDF\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Zav\\u00E1d\\u00ED se...\r\n',
	"hcm/emp/payslip/i18n/i18n_da.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=L\\u00F8nspecifikationer ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=L\\u00F8nspecifikation\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Mine l\\u00F8nspecifikationer\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=L\\u00F8nspecifikationer ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=L\\u00F8nspecifikation\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=\\u00C5bn som PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Bonusudbetaling\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Korrektionsafregning\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Manuel kontrol\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Regul\\u00E6r afregning\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Till\\u00E6gsbetaling\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Ingen data disponible\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Nettol\\u00F8n i\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=Medarbejder-ID\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Position\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Fradrag\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Bruttol\\u00F8n\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maks. selektion\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Du m\\u00E5 ikke v\\u00E6lge mere end {0} l\\u00F8nspecifikationer\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Liste over l\\u00F8nspecifikationer kunne ikke hentes\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=PDF for l\\u00F8nspecifikation kunne ikke hentes\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=L\\u00F8nspecifikation_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=En PDF-l\\u00E6ser skal installered, for at vise l\\u00F8nspecifikationer\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Indl\\u00E6ser...\r\n',
	"hcm/emp/payslip/i18n/i18n_de.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Entgeltnachweise ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Entgeltnachweis\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Meine Entgeltnachweise\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Entgeltnachweise ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Entgeltnachweis\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Als PDF \\u00F6ffnen\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Bonuszahlung\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Korrekturabrechnung\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Scheck\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Regul\\u00E4re Abrechnung\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Zusatzzahlung\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Keine Daten vorhanden\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Nettoentgelt in\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=Mitarbeiternummer\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Planstelle\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Abz\\u00FCge\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Bruttoentgelt\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maximale Auswahl\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Sie k\\u00F6nnen maximal {0} Entgeltnachweise ausw\\u00E4hlen\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Entgeltnachweisliste kann nicht abgerufen werden\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=PDF f\\u00FCr den Entgeltnachweis kann nicht abgerufen werden\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Entgeltnachweis_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Installieren Sie einen PDF-Reader, um Entgeltnachweise anzuzeigen\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Laden ...\r\n',
	"hcm/emp/payslip/i18n/i18n_en.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Paystubs ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Paystub\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=My Paystubs\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Paystubs ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Paystub\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Open as PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Bonus Payment\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Correction Accounting\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Manual Check\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Regular Payroll Run\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Additional Payment\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=No Data Available\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Take Home Pay in\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=Employee ID\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Position\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Deductions\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Gross Pay\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maximum Selection\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=You may not select more than {0} paystubs\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Could not obtain the list of paystubs\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Could not obtain the PDF of paystub\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Paystub_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=You need to install a PDF reader to view paystubs\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Loading...\r\n',
	"hcm/emp/payslip/i18n/i18n_en_US_sappsd.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=[[[\\u01A4\\u0105\\u0177 \\u015C\\u0163\\u0171\\u0183\\u015F ({0})]]]\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=[[[\\u01A4\\u0105\\u0177 \\u015C\\u0163\\u0171\\u0183]]]\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=[[[\\u039C\\u0177 \\u01A4\\u0105\\u0177\\u015F\\u0163\\u0171\\u0183\\u015F ]]]\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=[[[\\u01A4\\u0105\\u0177 \\u015C\\u0163\\u0171\\u0183\\u015F ({0})]]]\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=[[[\\u01A4\\u0105\\u0177 \\u015C\\u0163\\u0171\\u0183]]]\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=[[[\\u014E\\u03C1\\u0113\\u014B \\u0105\\u015F \\u01A4\\u010E\\u0191]]]\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=[[[\\u0181\\u014F\\u014B\\u0171\\u015F \\u01A4\\u0105\\u0177\\u0271\\u0113\\u014B\\u0163]]]\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=[[[\\u0108\\u014F\\u0157\\u0157\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u1000\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u012F\\u014B\\u011F]]]\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=[[[\\u039C\\u0105\\u014B\\u0171\\u0105\\u013A \\u0108\\u0125\\u0113\\u010B\\u0137]]]\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=[[[\\u0158\\u0113\\u011F\\u0171\\u013A\\u0105\\u0157 \\u01A4\\u0105\\u0177\\u0157\\u014F\\u013A\\u013A \\u0158\\u0171\\u014B]]]\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=[[[\\u1000\\u018C\\u018C\\u012F\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A \\u01A4\\u0105\\u0177\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=[[[\\u0143\\u014F \\u010E\\u0105\\u0163\\u0105 \\u1000\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=[[[\\u0162\\u0105\\u0137\\u0113 \\u0125\\u014F\\u0271\\u0113 \\u03C1\\u0105\\u0177 \\u012F\\u014B]]]\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u012C\\u010E]]]\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=[[[\\u01A4\\u014F\\u015F\\u012F\\u0163\\u012F\\u014F\\u014B]]]\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=[[[\\u010E\\u0113\\u018C\\u0171\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F]]]\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=[[[\\u0122\\u0157\\u014F\\u015F\\u015F \\u01A4\\u0105\\u0177]]]\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=[[[\\u039C\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B]]]\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=[[[\\u0176\\u014F\\u0171 \\u0271\\u0105\\u0177 \\u014B\\u014F\\u0163 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0271\\u014F\\u0157\\u0113 \\u0163\\u0125\\u0105\\u014B {0} \\u03C1\\u0105\\u0177 \\u015F\\u0163\\u0171\\u0183\\u015F]]]\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u012F\\u015F\\u0163 \\u014F\\u0192 \\u03C1\\u0105\\u0177 \\u015F\\u0163\\u0171\\u0183\\u015F]]]\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u014F\\u0183\\u0163\\u0105\\u012F\\u014B \\u0163\\u0125\\u0113 \\u01A4\\u010E\\u0191 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u0177 \\u015F\\u0163\\u0171\\u0183]]]\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=[[[\\u01A4\\u0105\\u0177 \\u015C\\u0163\\u0171\\u0183_]]]{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=[[[\\u0176\\u014F\\u0171 \\u014B\\u0113\\u0113\\u018C \\u0163\\u014F \\u012F\\u014B\\u015F\\u0163\\u0105\\u013A\\u013A \\u0105 \\u01A4\\u010E\\u0191 \\u0157\\u0113\\u0105\\u018C\\u0113\\u0157 \\u012F\\u014B \\u014F\\u0157\\u018C\\u0113\\u0157 \\u0163\\u014F \\u028B\\u012F\\u0113\\u0175 \\u03C1\\u0105\\u0177 \\u015F\\u0163\\u0171\\u0183\\u015F]]]\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F]]]\r\n',
	"hcm/emp/payslip/i18n/i18n_en_US_saptrc.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=vjWn3ouDEHm1DPHl3TG6sg_Pay Stubs ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=RX6biNaR7N3vNAP+jCol7g_Pay Stub\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=2ZvzlTXLdzhb8UvuoFuKhQ_My Paystubs \r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=IqULoRjWbgiw7vbQXbXlrg_Pay Stubs ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=R0xVTVsNDL18i2La6Akilw_Pay Stub\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=RzKnjwwCAUfAuL9Po+WalA_Open as PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=PmvM7H208jYuxFV5kt9B4w_Bonus Payment\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=bItNhdYLQbFmWVHDcbrmlg_Correction Accounting\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=kzTKkN0/8RyV2cACA5Av0Q_Manual Check\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=IuwdJ40zSPCNGP+Eu6XMxg_Regular Payroll Run\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Y3+UDZ7eLkN7hAOCf3M2Cg_Additional Payment\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=cM88G3xgbfz8D92/OmG9Gg_No Data Available\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=NuQtjukwB2yyF8NXyfKOFg_Take home pay in\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=paJLbzUkRCvY7KOXUCNx6w_Employee ID\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=V9OMyG01bPID/CsFazEh+g_Position\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=ngY41eHDSFP7WAtyG9Z4Dw_Deductions\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=4kCK4MC9rtgFcP1mvCtSlw_Gross Pay\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=+qnyKjyBb9KzCsFHKAdZuQ_Maximum Selection\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=oisTiM1Zmwupk0wTGSye+Q_You may not select more than {0} pay stubs\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=z3E+tTFmYNJqF3mVhqFZPQ_Could not obtain the list of pay stubs\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=TwJ6Djcs1pDrWvL9ee90bg_Could not obtain the PDF of the pay stub\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=G1P9MITddr+dXSUsG3FCyQ_Pay Stub_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=t56/52+nknZxacKNCFwU+Q_You need to install a PDF reader in order to view pay stubs\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=hmvQ1TNkOxyUA1sKn/I+Bg_Loading\r\n',
	"hcm/emp/payslip/i18n/i18n_es.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Recibos de n\\u00F3minas ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Recibo de n\\u00F3mina\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Mis recibos de n\\u00F3minas\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Recibos de n\\u00F3minas ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Recibo de n\\u00F3mina\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Abrir como PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Pago de primas\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Contabilidad de correcci\\u00F3n\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Verificaci\\u00F3n manual\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=C\\u00E1lculo de n\\u00F3mina ordinaria\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Pago suplementario\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=No existen datos\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Remuneraci\\u00F3n neta\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=ID de empleado\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Posici\\u00F3n\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Deducciones\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Pago bruto\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Selecci\\u00F3n m\\u00E1xima\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=No puede seleccionar m\\u00E1s de {0} recibos de n\\u00F3minas\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=No se ha podido obtener la lista de recibos de n\\u00F3minas\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=No se ha podido obtener el PDF del recibo de n\\u00F3mina\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Recibo de n\\u00F3minas_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Necesita instalar un lector de PDF para visualizar recibos de n\\u00F3minas\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Cargando...\r\n',
	"hcm/emp/payslip/i18n/i18n_fr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Bulletins de paie ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Bulletin de paie\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Mes bulletins de paie\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Bulletins de paie ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Bulletin de paie\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Ouvrir en tant que PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Versement de la prime\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Paie de correction\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Ch\\u00E8que manuel\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Paie normale\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Paiement compl\\u00E9mentaire\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Aucune donn\\u00E9e disponible\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Salaire net en\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=ID du salari\\u00E9\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Poste\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Retenues\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Salaire brut\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=S\\u00E9lection maximale\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Ne s\\u00E9lectionnez pas plus de {0} bulletins de paie.\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der \\u00E0 la liste des bulletins de paie\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Impossible d\'acc\\u00E9der au PDF du bulletin de paie\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Bulletin de paie_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Vous devez installer un programme de lecture de documents PDF pour afficher les bulletins de paie.\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Chargement...\r\n',
	"hcm/emp/payslip/i18n/i18n_hu.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=J\\u00F6vedelemigazol\\u00E1sok ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=J\\u00F6vedelemigazol\\u00E1s\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Saj\\u00E1t j\\u00F6vedelemigazol\\u00E1sok\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=J\\u00F6vedelemigazol\\u00E1sok ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=J\\u00F6vedelemigazol\\u00E1s\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Megnyit\\u00E1s PDF-k\\u00E9nt\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=B\\u00F3nuszfizet\\u00E9s\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Korrekt\\u00FAraelsz\\u00E1mol\\u00E1s\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=K\\u00E9zi ellen\\u0151rz\\u00E9s\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Rendes b\\u00E9rsz\\u00E1mfejt\\u00E9s\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Kieg\\u00E9sz\\u00EDt\\u0151 kifizet\\u00E9s\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Nem \\u00E1ll rendelkez\\u00E9sre adat\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Nett\\u00F3 fizet\\u00E9s\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=Dolgoz\\u00F3azonos\\u00EDt\\u00F3\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Poz\\u00EDci\\u00F3\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Levon\\u00E1sok\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Brutt\\u00F3 fizet\\u00E9s\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maxim\\u00E1lis kiv\\u00E1laszt\\u00E1s\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Nem v\\u00E1laszthat ki t\\u00F6bb mint {0} j\\u00F6vedelemigazol\\u00E1st\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a j\\u00F6vedelemigazol\\u00E1sok list\\u00E1j\\u00E1t\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Nem siker\\u00FClt lek\\u00E9rni a j\\u00F6vedelemigazol\\u00E1s PDF-j\\u00E9t\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=J\\u00F6vedelemigazol\\u00E1s_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=A j\\u00F6vedelemigazol\\u00E1sok megtekint\\u00E9s\\u00E9hez telep\\u00EDtenie kell egy PDF-olvas\\u00F3t\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Bet\\u00F6lt\\u00E9s...\r\n',
	"hcm/emp/payslip/i18n/i18n_it.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Buste paga ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Busta paga\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Le mie buste paga\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Buste paga ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Busta paga\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Apri come PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Pagamento bonus\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Contabilit\\u00E0 di rettifica\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Controllo manuale\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Esecuzione regolare del calcolo della retribuzione\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Pagamento integrativo\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Nessun dato disponibile\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Retribuzione netta in\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=ID dipendente\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Posizione\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Trattenute\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Retribuzione lorda\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Selezione massima\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Non \\u00E8 consentito selezionare pi\\u00F9 di {0} buste paga\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Impossibile ottenere la lista di buste paga\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Impossibile ottenere il PDF della busta paga\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Busta paga_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u00C8 necessario installare un lettore PDF per visualizzare le buste paga\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=In caricamento...\r\n',
	"hcm/emp/payslip/i18n/i18n_iw.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u05EA\\u05DC\\u05D5\\u05E9 \\u05E9\\u05DB\\u05E8\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=\\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05D4\\u05E9\\u05DB\\u05E8 \\u05E9\\u05DC\\u05D9\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=\\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8 ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=\\u05EA\\u05DC\\u05D5\\u05E9 \\u05E9\\u05DB\\u05E8\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=\\u05E4\\u05EA\\u05D7 \\u05DB-PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=\\u05EA\\u05E9\\u05DC\\u05D5\\u05DD \\u05D1\\u05D5\\u05E0\\u05D5\\u05E1\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=\\u05D7\\u05E9\\u05D1\\u05D5\\u05E0\\u05D0\\u05D5\\u05EA \\u05EA\\u05D9\\u05E7\\u05D5\\u05DF\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=\\u05D1\\u05D3\\u05D9\\u05E7\\u05D4 \\u05D9\\u05D3\\u05E0\\u05D9\\u05EA\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=\\u05D4\\u05E4\\u05E2\\u05DC\\u05EA \\u05DE\\u05E9\\u05DB\\u05D5\\u05E8\\u05EA \\u05E8\\u05D2\\u05D9\\u05DC\\u05D4\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=\\u05EA\\u05E9\\u05DC\\u05D5\\u05DD \\u05E0\\u05D5\\u05E1\\u05E3\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=\\u05D0\\u05D9\\u05DF \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=\\u05E9\\u05DB\\u05E8 \\u05E0\\u05D8\\u05D5 \\u05D1-\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05E2\\u05D5\\u05D1\\u05D3\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=\\u05DE\\u05E9\\u05E8\\u05D4\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=\\u05E0\\u05D9\\u05DB\\u05D5\\u05D9\\u05D9\\u05DD\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=\\u05E9\\u05DB\\u05E8 \\u05D1\\u05E8\\u05D5\\u05D8\\u05D5\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=\\u05D1\\u05D7\\u05D9\\u05E8\\u05D4 \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05DC\\u05D9\\u05EA\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=\\u05D0\\u05D9\\u05DF \\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05DC\\u05D1\\u05D7\\u05D5\\u05E8 \\u05D9\\u05D5\\u05EA\\u05E8 \\u05DE-{0} \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E8\\u05E9\\u05D9\\u05DE\\u05EA \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05D4\\u05E9\\u05DB\\u05E8\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E9\\u05D9\\u05D2 \\u05D0\\u05EA \\u05D4-PDF \\u05E9\\u05DC \\u05EA\\u05DC\\u05D5\\u05E9 \\u05D4\\u05E9\\u05DB\\u05E8\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=\\u05EA\\u05DC\\u05D5\\u05E9 \\u05E9\\u05DB\\u05E8_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u05E2\\u05DC\\u05D9\\u05DA \\u05DC\\u05D4\\u05EA\\u05E7\\u05D9\\u05DF \\u05E7\\u05D5\\u05E8\\u05D0 PDF \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05EA\\u05DC\\u05D5\\u05E9\\u05D9 \\u05E9\\u05DB\\u05E8\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n',
	"hcm/emp/payslip/i18n/i18n_ja.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u7D66\\u4E0E\\u660E\\u7D30 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u7D66\\u4E0E\\u660E\\u7D30\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=\\u7D66\\u4E0E\\u660E\\u7D30\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=\\u7D66\\u4E0E\\u660E\\u7D30 ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=\\u7D66\\u4E0E\\u660E\\u7D30\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=PDF \\u3067\\u958B\\u304F\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=\\u30DC\\u30FC\\u30CA\\u30B9\\u652F\\u7D66\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=\\u4FEE\\u6B63\\u8A08\\u7B97\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=\\u30DE\\u30CB\\u30E5\\u30A2\\u30EB\\u5C0F\\u5207\\u624B\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=\\u6708\\u4F8B\\u7D66\\u4E0E\\u8A08\\u7B97\\u5B9F\\u884C\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=\\u4E00\\u6642\\u652F\\u7D66\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=\\u5229\\u7528\\u53EF\\u80FD\\u30C7\\u30FC\\u30BF\\u306A\\u3057\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=\\u30CD\\u30C3\\u30C8\\u652F\\u7D66\\u984D\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=\\u5F93\\u696D\\u54E1 ID\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=\\u30DD\\u30B8\\u30B7\\u30E7\\u30F3\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=\\u63A7\\u9664\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=\\u30B0\\u30ED\\u30B9\\u652F\\u7D66\\u984D\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=\\u6700\\u5927\\u9078\\u629E\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=\\u9078\\u629E\\u3067\\u304D\\u308B\\u7D66\\u4E0E\\u660E\\u7D30\\u306F\\u6700\\u5927 {0} \\u4EF6\\u3067\\u3059\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=\\u7D66\\u4E0E\\u660E\\u7D30\\u306E\\u4E00\\u89A7\\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=\\u7D66\\u4E0E\\u660E\\u7D30\\u306E PDF \\u3092\\u53D6\\u5F97\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=\\u7D66\\u4E0E\\u660E\\u7D30_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u7D66\\u4E0E\\u660E\\u7D30\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F PDF \\u30EA\\u30FC\\u30C0\\u3092\\u30A4\\u30F3\\u30B9\\u30C8\\u30FC\\u30EB\\u3059\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n',
	"hcm/emp/payslip/i18n/i18n_no.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=L\\u00F8nsslipper ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=L\\u00F8nnsslipp\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Mine l\\u00F8nnsslipper\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=L\\u00F8nsslipper ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=L\\u00F8nnsslipp\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=\\u00C5pne som PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Bonusutbetaling\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Korrigeringsavregning\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Sjekk\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Ordin\\u00E6r l\\u00F8nnsavregning\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Tilleggsbetaling\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Ingen tilgjengelige data\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Nettol\\u00F8nn i\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=Medarbeider-ID\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Stilling\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Fradrag\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Bruttol\\u00F8nn\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maks. utvalg\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Du kan ikke velge mer enn {0} l\\u00F8nnsslipper\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Kan ikke hente liste over l\\u00F8nnsslipper\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Kan ikke hente PDF for l\\u00F8nnsslipp\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=L\\u00F8nnsslipp_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Du m\\u00E5 installere en PDF-leser for \\u00E5 vise l\\u00F8nnsslipper\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Laster ...\r\n',
	"hcm/emp/payslip/i18n/i18n_pl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Zestawienia wynagrodzenia ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Zestawienie wynagrodzenia\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Moje zestawienia wynagrodzenia\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Zestawienia wynagrodzenia ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Zestawienie wynagrodzenia\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Otw\\u00F3rz jako PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=P\\u0142atno\\u015B\\u0107 dodatkowa\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Rozliczenie korekty\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=R\\u0119czny czek\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=Regularny przebieg rozliczania listy p\\u0142ac\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Dodatkowa p\\u0142atno\\u015B\\u0107\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Brak danych\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Wynagrodzenie netto w\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=ID pracownika\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Pozycja\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Potr\\u0105cenia\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Wynagrodzenie brutto\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Maksymalny wyb\\u00F3r\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Nie mo\\u017Cesz wybra\\u0107 wi\\u0119cej ni\\u017C {0} zestawie\\u0144 wynagrodzenia\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 listy zestawie\\u0144 wynagrodze\\u0144\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=Nie mo\\u017Cna by\\u0142o uzyska\\u0107 pliku PDF zestawienia wynagrodzenia\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Zestawienie wynagrodzenia_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Aby przegl\\u0105da\\u0107 zestawienia wynagrodze\\u0144, musisz zainstalowa\\u0107 aplikacj\\u0119 PDF reader\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Wczytywanie...\r\n',
	"hcm/emp/payslip/i18n/i18n_pt.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Comprovantes de remunera\\u00E7\\u00E3o ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Comprovante de remunera\\u00E7\\u00E3o\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=Meus comprovantes de remunera\\u00E7\\u00E3o\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=Comprovantes de remunera\\u00E7\\u00E3o ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=Comprovante de remunera\\u00E7\\u00E3o\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=Abrir como PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Pagamento de b\\u00F4nus\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=Liquida\\u00E7\\u00E3o da corre\\u00E7\\u00E3o\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Cheque\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=C\\u00E1lculo regular da folha de pagamento\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Pagamento adicional\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Nenhum dado dispon\\u00EDvel\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Sal\\u00E1rio l\\u00EDquido\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=ID do funcion\\u00E1rio\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Posi\\u00E7\\u00E3o\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Dedu\\u00E7\\u00F5es\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Pagamento bruto\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Sele\\u00E7\\u00E3o m\\u00E1xima\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=Voc\\u00EA n\\u00E3o pode selecionar mais de {0} comprovantes de remunera\\u00E7\\u00E3o\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter lista de comprovantes de remunera\\u00E7\\u00E3o\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=N\\u00E3o foi poss\\u00EDvel obter PDF do comprovante de remunera\\u00E7\\u00E3o\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Comprovante de remunera\\u00E7\\u00E3o_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=Voc\\u00EA deve instalar um leitor de PDF para exibir comprovantes de remunera\\u00E7\\u00E3o\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Carregando...\r\n',
	"hcm/emp/payslip/i18n/i18n_ru.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0438 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=\\u041C\\u043E\\u0438 \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0438 ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=\\u0412\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=\\u041E\\u0442\\u043A\\u0440. \\u043A\\u0430\\u043A PDF\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=\\u0411\\u043E\\u043D\\u0443\\u0441\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=\\u041A\\u043E\\u0440\\u0440\\u0435\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u043E\\u0447\\u043D\\u044B\\u0439 \\u0440\\u0430\\u0441\\u0447\\u0435\\u0442\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=\\u0420\\u0443\\u0447\\u043D\\u0430\\u044F \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0430\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=\\u0420\\u0435\\u0433\\u0443\\u043B\\u044F\\u0440\\u043D\\u044B\\u0439 \\u0440\\u0430\\u0441\\u0447\\u0435\\u0442\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=\\u0414\\u043E\\u043F\\u043E\\u043B\\u043D\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u0430\\u044F \\u0432\\u044B\\u043F\\u043B\\u0430\\u0442\\u0430\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=\\u041D\\u0435\\u0442 \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0445 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=\\u041E\\u043F\\u043B\\u0430\\u0442\\u0430 \\u043D\\u0435\\u0442\\u0442\\u043E \\u0432\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=\\u0418\\u0434. \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u044F\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=\\u0412\\u044B\\u0447\\u0435\\u0442\\u044B\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=\\u041F\\u043B\\u0430\\u0442\\u0435\\u0436 \\u0431\\u0440\\u0443\\u0442\\u0442\\u043E\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0432\\u044B\\u0431\\u043E\\u0440\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=\\u0412\\u044B\\u0431\\u043E\\u0440 \\u0431\\u043E\\u043B\\u0435\\u0435 {0} \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0435\\u0439 \\u043D\\u0435\\u0434\\u043E\\u043F\\u0443\\u0441\\u0442\\u0438\\u043C\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0441\\u043F\\u0438\\u0441\\u043E\\u043A \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0435\\u0439\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043F\\u043E\\u043B\\u0443\\u0447\\u0438\\u0442\\u044C \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u044C \\u0432 PDF\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=Paystub_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0435\\u0434\\u043E\\u043C\\u043E\\u0441\\u0442\\u0435\\u0439 \\u043D\\u0435\\u043E\\u0431\\u0445\\u043E\\u0434\\u0438\\u043C\\u043E \\u0443\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u043E\\u0433\\u0440\\u0430\\u043C\\u043C\\u0443 \\u0434\\u043B\\u044F \\u0447\\u0442\\u0435\\u043D\\u0438\\u044F PDF\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n',
	"hcm/emp/payslip/i18n/i18n_tr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u00DCcret pusulalar\\u0131 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u00DCcret pusulas\\u0131\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=\\u00DCcret pusulalar\\u0131m\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=\\u00DCcret pusulalar\\u0131 ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=\\u00DCcret pusulas\\u0131\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=PDF olarak a\\u00E7\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=Prim \\u00F6demesi\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=D\\u00FCzeltme muhasebesi\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=Man\\u00FCel kontrol\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=D\\u00FCzenli bordro \\u00E7al\\u0131\\u015Ft\\u0131rmas\\u0131\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=Ek \\u00F6deme\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=Veri mevcut de\\u011Fil\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=Net maa\\u015F\\:\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=\\u00C7al\\u0131\\u015Fan tan\\u0131t\\u0131c\\u0131s\\u0131\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=Pozisyon\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=Kesintiler\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=Br\\u00FCt \\u00F6deme\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=Azami se\\u00E7im\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE={0} \\u00FCcret pusulas\\u0131ndan fazlas\\u0131n\\u0131 se\\u00E7emezsiniz\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=\\u00DCcret pusulalar\\u0131 listesi al\\u0131namad\\u0131\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=\\u00DCcret pusulas\\u0131n\\u0131n PDF\'i al\\u0131namad\\u0131\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=\\u00DCcret pusulas\\u0131_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u00DCcret pusulalar\\u0131n\\u0131 g\\u00F6r\\u00FCnt\\u00FClemek i\\u00E7in PDF Reader kurman\\u0131z gerekli\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=Y\\u00FCkleniyor...\r\n',
	"hcm/emp/payslip/i18n/i18n_zh_CN.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u5DE5\\u8D44\\u5355 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u5DE5\\u8D44\\u5355\r\n\r\n#XTIT: Application name\r\nDISPLAY_NAME=\\u6211\\u7684\\u5DE5\\u8D44\\u5355\r\n\r\n#XTIT: Title for pay slip list\r\nDISPLAY_NAME_LIST=\\u5DE5\\u8D44\\u5355 ({0})\r\n\r\n#XTIT: Title for pay slip details\r\nDISPLAY_NAME_DETAILS=\\u5DE5\\u8D44\\u5355\r\n\r\n#XBUT: Show current selection as PDF in another window\r\nOPEN_AS_PDF=\\u4EE5 PDF \\u683C\\u5F0F\\u6253\\u5F00\r\n\r\n#XFLD: Payment type\r\nPAYSLIP_BONUS_PAYMENT=\\u5956\\u91D1\\u652F\\u4ED8\r\n#XFLD: Payment type\r\nPAYSLIP_CORRECTION_ACCOUNTING=\\u4FEE\\u6B63\\u4F1A\\u8BA1\\u6838\\u7B97\r\n#XFLD: Payment type\r\nPAYSLIP_MANUAL_CHECK=\\u624B\\u52A8\\u68C0\\u67E5\r\n#XFLD: Payment type\r\nPAYSLIP_REGULAR=\\u5E38\\u89C4\\u5DE5\\u8D44\\u6838\\u7B97\\u8FD0\\u884C\r\n#XFLD: Payment type\r\nPAYSLIP_ADDITIONAL=\\u9644\\u52A0\\u4ED8\\u6B3E\r\n\r\n#XFLD: No Payslip to display in the list\r\nNO_PAYSLIP=\\u6CA1\\u6709\\u53EF\\u7528\\u6570\\u636E\r\n\r\n#XFLD: Take home pay\r\nTAKE_HOME_PAY=\\u5B9E\\u5F97\\u5DE5\\u8D44\r\n#XFLD: Employee ID\r\nEMPLOYEE_ID=\\u5458\\u5DE5\\u6807\\u8BC6\r\n#XFLD: Employee Position\r\nEMPLOYEE_POSITION=\\u804C\\u4F4D\r\n#XFLD: Payslip deduction amount\r\nPAYSLIP_DEDUCTIONS=\\u6263\\u51CF\r\n#XFLD: Payslip gross pay amount\r\nPAYSLIP_GROSSPAY=\\u603B\\u5DE5\\u8D44\r\n\r\n#XTIT: Title for maximum PDFs selected\r\nMAX_SELECTION_TITLE=\\u6700\\u5927\\u9009\\u62E9\r\n#YMSG: Message for Maximum PDFs selected {0}: Maximum PDFs selected\r\nMAX_SELECTION_MESSAGE=\\u6700\\u591A\\u53EA\\u80FD\\u9009\\u62E9 {0} \\u4E2A\\u5DE5\\u8D44\\u5355\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nLIST_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6\\u5DE5\\u8D44\\u5355\\u5217\\u8868\r\n\r\n#YMSG: Fallback message for list service error (used if server message is not available)\r\nPDF_SERVICE_ERR_MESSAGE=\\u65E0\\u6CD5\\u83B7\\u53D6 PDF \\u683C\\u5F0F\\u7684\\u5DE5\\u8D44\\u5355\r\n\r\n#XTIT: Title for new PFD window {0}:End date of pay stub\r\nPDF_WINDOW_TITLE=\\u5DE5\\u8D44\\u5355_{0}\r\n\r\n#XTIT: Fallback message for EmbedPdfViewer\r\nNO_PDF_PLUGIN_INSTALLED=\\u5FC5\\u987B\\u5B89\\u88C5 PDF \\u9605\\u8BFB\\u5668\\u624D\\u80FD\\u67E5\\u770B\\u5DE5\\u8D44\\u5355\r\n\r\n#XFLD: Message displayed in the list while loading the list of payslips\r\nLOADING_PAYSLIP=\\u52A0\\u8F7D\\u4E2D...\r\n',
	"hcm/emp/payslip/utils/PdfLoader.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.utils.PdfLoader");

hcm.emp.payslip.utils.PdfLoader = function(){
    this.sUrl = null;
    this.sState = "idle";
    this.oRequester = null;
    this.fOnSuccess = null;
    this.fOnFailure = null;
};

hcm.emp.payslip.utils.PdfLoader.prototype.LoadPdf = function (url, onSuccess, onFailure) {

    jQuery.sap.log.debug("PdfLoader::LoadPdf " + url);

    if (url==this.sUrl) {
        jQuery.sap.log.debug("PdfLoader::LoadPdf already loading " + url);
    }
    else {

        // cancel previous request
        if (null!=this.oRequester) {
            jQuery.sap.log.debug("PdfLoader::abort " + this.sUrl);
            this.oRequester.abort();
        }

        this.sUrl = url;
        this.fOnSuccess = onSuccess;
        this.fOnFailure = onFailure;

        // new request
        this.LoadPdfData(jQuery.proxy(this.onComplete, this));
    }
};

hcm.emp.payslip.utils.PdfLoader.prototype.LoadPdfData = function(onComplete) {

//    jQuery.sap.measure.start(hcm.emp.payslip.utils.PerfUtils.getStartId(hcm.emp.payslip.utils.PerfUtils.LoadPdfData)); TODO: uncomment later
    jQuery.sap.log.debug("PdfLoader::LoadPdfData " + this.sUrl);
    this.sState = "loading";

    this.oRequester = new XMLHttpRequest();
    this.oRequester.open("GET", this.sUrl);
    this.oRequester.setRequestHeader("Accept-Language", sap.ui.getCore().getConfiguration().getLanguage());
    this.oRequester.responseType = "arraybuffer";
    this.oRequester.onload = function () {
        onComplete();
    };

    this.oRequester.send();
};

hcm.emp.payslip.utils.PdfLoader.prototype.onComplete = function () {

    jQuery.sap.log.debug("PdfLoader::onComplete " + this.sUrl);
    this.sState = "loaded";

    try {
        if (this.oRequester.status == 200 || this.oRequester.status == 0) {
            var pdfData = this.oRequester.response;
//            jQuery.sap.measure.end(hcm.emp.payslip.utils.PerfUtils.getEndId(hcm.emp.payslip.utils.PerfUtils.LoadPdfData)); TODO
            if (null!=this.fOnSuccess) {
                this.fOnSuccess(pdfData);
            }
        } else {
            if (null != this.fOnFailure) {
                this.fOnFailure(this.oRequester.responseText);
            }
        }
    }
    catch (error) {
        if (null != this.fOnFailure)
            this.fOnFailure(null);
    }

    this.oRequester = null;
};
},
	"hcm/emp/payslip/utils/PerfUtils.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.utils.PerfUtils");
//hcm.emp.payslip.utils.PerfUtils.getMeasurements();
hcm.emp.payslip.utils.PerfUtils = {

    MASTER_INIT : "hcm.emp.payslip.utils.MASTER_INIT",
    DETAIL_INIT : "hcm.emp.payslip.utils.DETAIL_INIT",
    PaystubLoading : "hcm.emp.payslip.utils.PaystubLoading",
    afterZoomableScrollContainerRendering : "hcm.emp.payslip.utils.afterZoomableScrollContainerRendering",
    onGetListSuccess : "hcm.emp.payslip.utils.onGetListSuccess",
    onListSelect : "hcm.emp.payslip.utils.onListSelect",
    RenderPdf : "hcm.emp.payslip.utils.RenderPdf",
    getPdfUrl: "hcm.emp.payslip.utils.getPdfUrl",
    lazyRoundNumber : "hcm.emp.payslip.utils.lazyRoundNumber",
    updateModel : "hcm.emp.payslip.utils.updateModel",
    LoadPdfData : "hcm.emp.payslip.utils.LoadPdfData",
    getDocument : "hcm.emp.payslip.utils.getDocument",
    showBusyCursor : "hcm.emp.payslip.utils.showBusyCursor",
    hideBusyCursor : "hcm.emp.payslip.utils.hideBusyCursor",
    openApplication : "hcm.emp.payslip.utils.openApplication",
    MasterView : "hcm.emp.payslip.utils.MasterView",
    DetailView : "hcm.emp.payslip.utils.DetailView",

    _mCounter:{},
    getMeasurements : function(){
        var aMeasures = jQuery.sap.measure.getAllMeasurements();
        var aOutputs = [];
        for( var i in aMeasures){
            var oMeasure = aMeasures[i];
            var oOutput = {
                "id" : oMeasure.id,
                "info" : (oMeasure.info ? oMeasure.info : ''),
                "start" : oMeasure.start.toString(),
                "end" : oMeasure.end.toString(),
                "time"  : oMeasure.time,
                "duration" : oMeasure.duration
            }
            aOutputs.push(oOutput);
        };
        var sOutput = JSON.stringify(aOutputs);
        return sOutput;
    },
    getStartId:function(id){
        if(hcm.emp.payslip.utils.PerfUtils._mCounter[id]==undefined){
            hcm.emp.payslip.utils.PerfUtils._mCounter[id]=-1;
        }
        hcm.emp.payslip.utils.PerfUtils._mCounter[id]++;
        return id +" ("+hcm.emp.payslip.utils.PerfUtils._mCounter[id]+")";
    },
    getEndId:function(id){
        if(hcm.emp.payslip.utils.PerfUtils._mCounter[id]==undefined){
            hcm.emp.payslip.utils.PerfUtils._mCounter[id]=0;
        }
        return id +" ("+hcm.emp.payslip.utils.PerfUtils._mCounter[id]+")";
    }
};


},
	"hcm/emp/payslip/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.emp.payslip.view.S2", {

    onInit : function() {
        // execute the onInit for the base class ScfldMasterController
        sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);
        
        this._page = this.getView().byId("PAYSLIP_MASTER_PAGE");
        
        if (jQuery.device.is.phone) {
            this.getView().addEventDelegate({onBeforeShow : jQuery.proxy(this.onBeforeShow , this)}, this);
        }
        
        
        
    },
    
    onBeforeShow : function () {

        if (this._lastScrollY != null) {
            this._page.scrollTo(this._lastScrollY ,10);
        }
    },
	/**
	 * @override
	 *
	 * @param oItem
	 * @param sFilterPattern
	 * @returns {*}
	 */
    
    applySearchPatternToListItem:function(oItem, sFilterPattern) {
        if (sFilterPattern == "") {
            return true;
        }
        //uncomment to search in oModel data Note: may mislead user!
        /*var oIteshellata = oItem.getBindingContext(this.sModelName).getProperty();
        for (var sKey in oIteshellata) {
            var sValue = oIteshellata[sKey];
            // if (sValue instanceof Date) {
            // //just for the filter take each number as string
            // sValue = sValue.getDate() + "." +
            // sValue.getMonth() + "." + sValue.getFullYear();
            // }
            if (typeof sValue == "string") {
                if (sValue.toLowerCase().indexOf(sFilterPattern) != -1) {
                    return true;
                }
            }
        }*/
        // if nothing found in unformatted data, check UI
        // elements
        if ((oItem.getIntro() && oItem.getIntro().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getTitle() && oItem.getTitle().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getNumber() && oItem.getNumber().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getNumberUnit() && oItem.getNumberUnit().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getFirstStatus() && oItem.getFirstStatus().getText().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getSecondStatus() && oItem.getSecondStatus().getText().toLowerCase().indexOf(sFilterPattern) != -1)) {
            return true;
        }
        // last source is attribute array
        var aAttributes = oItem.getAttributes();
        for (var j = 0; j < aAttributes.length; j++) {
            if (aAttributes[j].getText().toLowerCase().indexOf(sFilterPattern) != -1) {
                return true;
            }
        }
        return false;
    },
	
	getHeaderFooterOptions : function() {
		return {
			sI18NMasterTitle : "DISPLAY_NAME_LIST"
	//		onEditPress : function() {
	//			jQuery.sap.log.info("master list: edit pressed");
	//		}
		};
	},
	
    setListItem: function(oItem) {
    	
    	var oList = this.getList();
    	 
        oList.removeSelections();

        oItem.setSelected(true);
        oList.setSelectedItem(oItem, true);
        
        
        if(jQuery.device.is.desktop){
        this.oRouter.navTo("detail", {   
            from: oItem.getTitle(),
            contextPath: oItem.getBindingContext().sPath.substr(1)
        },!jQuery.device.is.phone);
        
        }
        else{
        	this.oRouter.navTo("detail_p", {   
                from: oItem.getTitle(),
                contextPath: oItem.getBindingContext().sPath.substr(1)
            },!jQuery.device.is.phone);
        }

        // tell detail to update
//        sap.ui.getCore().getEventBus().publish("app", "RefreshDetail", {
//            context:  oItem.getBindingContext()
//        });
    },
    
    //Number Formatter for amount
    numberFormat: function(number){
    	try {
			if (!isNaN(parseFloat(number)) && isFinite(number)) {
				var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
				return numberFormatter.format(number);
			}
		} catch (e) {
			jQuery.sap.log.warning(number+" couldn't be formatted to Number","numberFormat in S2 Controller","Payslip");
		}
		return number;
    }
});
},
	"hcm/emp/payslip/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n\n<core:View xmlns:core="sap.ui.core"\nxmlns="sap.m" controllerName="hcm.emp.payslip.view.S2">\n<!--<Page id="page" title="{i18n>DISPLAY_NAME_LIST}">-->\n<Page id="PAYSLIP_MASTER_PAGE" title="{i18n>DISPLAY_NAME_LIST}">\n\t<content>\n\t\t<List id="list" items="{/Payslips}" threshold="15" growingThreshold="15" growing="true" noDataText="{i18n>NO_PAYSLIP}" \n\t\t\t\t\t mode="{device>/listMode}" select="_handleSelect">\n\t\t\t\t\t <!--mode="{device>/listMode}" selectionChange="_handleSelect">-->\n\t\t <!--<items> -->\n\t\t\t<ObjectListItem title="{ path:\'EndDate\', type:\'sap.ca.ui.model.type.Date\', formatOptions : { style:\'medium\', UTC: true} }" \n\t\t\t\t\t\t\tshowMarkers="false" markFlagged="false" markFavorite="false" \n\t\t\t\t\t\t\tintro="{PayrollDescription}" numberUnit="{Currency}" \n\t\t\t\t\t\t\tnumber="{ path:\'Amount\', formatter:\'.numberFormat\' }" \n\t\t\t\t\t\t\tcounter="0" press="_handleItemPress" type="{device>/listItemType}">\n\t\t\t\t<attributes>\n              \t\t<ObjectAttribute id="MPS_PER_ASSIGN" text="{PersonnelAssignment}" />\n              \t\t<!-- extension added to add fields in list item -->\t\n                \t<core:ExtensionPoint name="extS2ListItem"></core:ExtensionPoint>\n            \t</attributes>\n\n            </ObjectListItem>\n\t\t <!--</items> -->\n\t\t</List>\n\t</content>\n\t\n\t<footer id="MPS_MASTER_FOOTER">\n\t\t\t<Bar id="MPS_MASTER_FOOTER_BAR" translucent="true">\n\t\t\t<contentLeft>\n\t\t\t\t<Button icon="sap-icon://action-settings"/>\n\t\t\t</contentLeft>\n\t\t\t</Bar>\n\t</footer>\n</Page>\n</core:View>\n',
	"hcm/emp/payslip/view/S3.controller.js":function(){/*
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

},
	"hcm/emp/payslip/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View  \n\t \n\txmlns="sap.m" \n\tcontrollerName="hcm.emp.payslip.view.S3"\n\txmlns:me="sap.me" \n\txmlns:core="sap.ui.core"\n\txmlns:ctrl="hcm.emp.payslip.controls"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n\t>\n\t\n\t<Page class="sapUiFioriObjectPage" title="{i18n>DISPLAY_NAME_DETAILS}" enableScrolling="false" id="PAGE_DETAILS"  >\n\t\t<content>\n\t\t\t<ObjectHeader title="{path:\'PayDate\', type:\'sap.ca.ui.model.type.Date\', formatOptions : { style:\'medium\', UTC: true}}" number="{path:\'Amount\', formatter:\'.numberFormat\'}"\n\t\t\t numberUnit= "{parts: [{path: \'i18n>TAKE_HOME_PAY\'},{path: \'Currency\'}], formatter:\'.stringFormatter\'}">\n\t\t\t\t<attributes>\t\n\t\t\t\t\t<ObjectAttribute id="EMPLOYEE_ID" text="{parts: [{path: \'i18n>EMPLOYEE_ID\'},{path: \'PersonnelAssignment\'}], formatter:\'.stringFormatter\'}" />     \n                    <ObjectAttribute id="EMPLOYEE_POSITION" text="{parts: [{path: \'i18n>EMPLOYEE_POSITION\'},{path: \'Position\'}], formatter:\'.stringFormatter\'}" />\n\t\t\t\t\t\t\t\t   \n\t\t\t\t</attributes>\n\t\t\t\t<statuses>\n\t\t\t   \t\t<ObjectStatus id="MPS_DEDUCTIONS" text="{parts: [{path: \'i18n>PAYSLIP_DEDUCTIONS\'},{path: \'Deduction\'},{path: \'Currency\'}], formatter:\'.numberFormatter\'}" state="Error" />\n\t\t\t   \t\t<ObjectStatus id="MPS_GROSSPAY" text="{parts: [{path: \'i18n>PAYSLIP_GROSSPAY\'},{path: \'GrossPay\'},{path: \'Currency\'}], formatter:\'.numberFormatter\'}" state="Success" />\t   \t\t\t   \t\t\n        \t\t</statuses>\n        \t\t <!-- extension point for additional fields in header -->\t\n        \t\t <core:ExtensionPoint name="extS3Header"></core:ExtensionPoint>\n       \t\t</ObjectHeader>   \n\n\t\t\t<ctrl:EmbedPdf id="PDF_CTRL" noPluginMessage="{i18n>NO_PDF_PLUGIN_INSTALLED}" src="{NewModel>/PDFPayslipUrl}"></ctrl:EmbedPdf>\n\t\n\t\t</content>\t\t\n\t\t<footer id="MPS_DETAIL_FOOTER">\n\t\t<Bar id="MPS_DETAIL_FOOTER_BAR" translucent="true"/>\n\t\t</footer>\n\t</Page>\n</core:View>\n',
	"hcm/emp/payslip/view/S3_Phone.controller.js":function(){/*
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

},
	"hcm/emp/payslip/view/S3_Phone.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View \t \n\txmlns="sap.m" \n\tcontrollerName="hcm.emp.payslip.view.S3_Phone"\n\txmlns:me="sap.me" \n\txmlns:core="sap.ui.core"\n\txmlns:ctrl="hcm.emp.payslip.controls"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n\t>\n\t\t<Page class="sapUiFioriObjectPage" title="{i18n>DISPLAY_NAME_DETAILS}" enableScrolling="false" id="PAGE_DETAILS_PHONE"  >\n\t\t<content>\n\t\t\t<ObjectHeader title="{path:\'PayDate\', type:\'sap.ca.ui.model.type.Date\', formatOptions : { style:\'medium\', UTC: true}}" number="{path:\'Amount\', formatter:\'.numberFormat\'}" numberUnit="{Currency}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute id="EMPLOYEE_ID" text="{parts: [{path: \'i18n>EMPLOYEE_ID\'},{path: \'PersonnelAssignment\'}], formatter:\'.stringFormatter\'}" />     \n                    <ObjectAttribute id="EMPLOYEE_POSITION" text="{parts: [{path: \'i18n>EMPLOYEE_POSITION\'},{path: \'Position\'}], formatter:\'.stringFormatter\'}" />\t\t\t   \n\t\t\t\t</attributes>\n\t\t\t\t<statuses>\n\t\t\t   \t\t<ObjectStatus id="MPS_DEDUCTIONS" text="{parts: [{path: \'i18n>PAYSLIP_DEDUCTIONS\'},{path: \'Deduction\'},{path: \'Currency\'}], formatter:\'.numberFormatter\'}" state="Error" />\n\t\t\t   \t\t<ObjectStatus id="MPS_GROSSPAY" text="{parts: [{path: \'i18n>PAYSLIP_GROSSPAY\'},{path: \'GrossPay\'},{path: \'Currency\'}], formatter:\'.numberFormatter\'}" state="Success" />\t   \t\t\t   \t\t\n        \t\t</statuses>\n        \t\t <!-- extension point for additional fields in header -->\n                <core:ExtensionPoint name="extS3PhoneHeader"></core:ExtensionPoint>\n\t\t   \t</ObjectHeader>\n\t\t\t<VBox id="PAYSLIP_BUSY_CURSOR_CONTAINER" visible="false" width="100%" alignItems="Center">\n\t\t\t \t<BusyIndicator id="PAYSLIP_BUSY_CURSOR" size="40px" class="payslipBusyCursor"></BusyIndicator>\n\t\t\t</VBox>\n\t\t\t<ctrl:ZoomableScrollContainer id="PAYSLIP_PDF_VIEWER_CONTAINER" \n\t\t\t   height = "95%" width = "95%" vertical = "true" class="payslipPdf"\n\t\t\t   initialScale= "{NewModel>/initialScale}" minScale="{NewModel>/minScale}" maxScale="{NewModel>/maxScale}">\t\n\t\t\t   \n\t\t\t   <ctrl:PDFViewer id="PDF_VIEWER_CTRL"  errorMessage="{i18n>PDF_SERVICE_ERR_MESSAGE}"\n\t\t\t   begin="showBusyCursor"  complete="hideBusyCursor" src="{NewModel>/PDFPayslipUrl}">\n\t\t\t   \n\t\t\t   </ctrl:PDFViewer>\t\t  \n\t\t\t\t   \t\t\t   \n\t\t\t</ctrl:ZoomableScrollContainer>\n\t\n\t\t</content>\t\t\n\t\t<footer id="MPS_DETAIL_FOOTER">\n\t\t<Bar id="MPS_DETAIL_FOOTER_BAR" translucent="true"/>\n\t\t</footer>\n\t</Page>\n\t\n\t</core:View>'
}});
