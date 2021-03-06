/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.opportunity.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.opportunity.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD",{
		"name": "Master Detail Sample",
		"version" : "1.5.7",
		"library" : "cus.crm.opportunity",
		"includes" : [ 
		],  
		"dependencies" : { 
			"libs" : [ 
				"sap.m",
				"sap.me"
			],  
			"components" : [ 
			], 
			
		},
		"config" : {
			
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" :   "SHELL_TITLE",
			 "icon":"sap-icon://Fiori2/F0012",
			 "favIcon":"./resources/sap/ca/ui/themes/base/img/favicon/F0012_My_Opportunities.ico",
			 "homeScreenIconPhone":"./resources/sap/ca/ui/themes/base/img/launchicon/F0012__My_Opportunities/57_iPhone_Desktop_Launch.png",
			 "homeScreenIconPhone@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0012__My_Opportunities/114_iPhone-Retina_Web_Clip.png",
			 "homeScreenIconTablet":"./resources/sap/ca/ui/themes/base/img/launchicon/F0012__My_Opportunities/72_iPad_Desktop_Launch.png",
			 "homeScreenIconTablet@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0012__My_Opportunitiess/144_iPad_Retina_Web_Clip.png",
			 "startupImage320x460":"./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
			 "startupImage640x920":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
			 "startupImage640x1096":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
			 "startupImage768x1004":"./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
			 "startupImage748x1024":"./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
			 "startupImage1536x2008":"./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
			 "startupImage1496x2048":"./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
			
			
			
			
		},
		
		"viewPath" : "cus.crm.opportunity.view",
		"detailPageRoutes" :{  
            "detail" : {
            			"pattern" : "detail/{contextPath}",
            			"view" : "S3"
            },
		    "subDetail"  :  {
		    	         "pattern" : "subDetail/{contextPath}",
		    	         "view"  : "S4"
		    	 
		    },
		    "create"  :  {
   	         "pattern" : "create/{contextPath}/{processType}",
   	         "view"  : "S5"
   	 
   },
   "createFollowup"  :  {
	         "pattern" : "createFollowup/{contextPath}/{processType}",
	         "view"  : "S5"
	        	 
   },
            "noData" : {
            	         "pattern"  : "noData",
            	         "viewPath" : "sap.ca.scfld.md.view",
            	         "view"    :  "empty"
             }   
       
          },
          
          
          "fullScreenPageRoutes" : {  
	        	"fullScreen"  : {
	        		"view":"MainSplitContainer",
					"viewPath":"sap.ca.scfld.md.view",
					"targetControl":"fioriContent",
					"targetAggregation":"pages",
					"pattern":"_neverusethispattern_",              
	         	},
				
				"display": {
					pattern : "display/{contextPath}",
					view : "S3",
				},
				"edit" : {
					pattern : "edit/{contextPath}",
					view : "S4",
					
				},
				"fulScrCreateFollowup"  :  {
			         pattern : "fulScrCreateFollowup/{contextPath}/{processType}",
			         view  : "S5",
			        	 
		   },
		   "fulScrOpptFollowup"  :  {
		         pattern : "fulScrOpptFollowup/{contextPath}/{processType}",
		         view  : "S5",
		        	 
	   },
		   "FollowupFromTask"  :  {
		         pattern : "followupfromtask/{contextPath}/{processType}",
		         view  : "S5",
		        	 
	   },
	         	
	        }
          
        
    }),
   
	/**
	 * Initialize the application 
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
	  var oViewData = {component: this};
    this.oMainView = sap.ui.view({
          viewName : "cus.crm.opportunity.Main",
          type : sap.ui.core.mvc.ViewType.XML,
          viewData : oViewData
        });
      
      this.oMainView.setModel(new sap.ui.model.json.JSONModel({
    	  
    	  s2Controller : null,
    	  s3Controller : null,
    	  s4Controller : null,
    	  s5Controller : null,
    	  
      }),"controllers");
      var oModel = new sap.ui.model.json.JSONModel();
		
		var oComponentData = this.getComponentData();
		if (oComponentData) {
			jQuery.sap.log.info("app started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
			oModel.setData(this.createStartupParametersData(oComponentData.startupParameters || {}));
		}
		this.oMainView.setModel(oModel, "startupParameters");

		return this.oMainView;
	},

	createStartupParametersData : function(oComponentData) {
		// convert the raw componentData into a model that is consumed by the UI
		var aParameters = [];
		if (oComponentData) {
			for ( var sKey in oComponentData) {
				aParameters.push({
					key : sKey,
					value : oComponentData[sKey].toString()
				});
			}
		}
		return {
			"parameters" : aParameters
		};
	}

	
	
  
});
