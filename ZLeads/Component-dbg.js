/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.lead.Component");
//jQuery.sap.require("sap.ui.core.UIComponent");
//jQuery.sap.require("sap.ushell.services.sap.ca.navigation.AppNavigator");
//jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
//jQuery.sap.require("cus.crm.lead.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.lead.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD",{
		"name": "Master Detail Sample",
		"version" : "1.5.4",
		"library" : "cus.crm.lead",
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
			 "icon":"sap-icon://Fiori2/F0014",
			 "favIcon":"./resources/sap/ca/ui/themes/base/img/favicon/F0014_My_Leads.ico",
			 "homeScreenIconPhone":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/57_iPhone_Desktop_Launch.png",
			 "homeScreenIconPhone@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/114_iPhone-Retina_Web_Clip.png",
			 "homeScreenIconTablet":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/72_iPad_Desktop_Launch.png",
			 "homeScreenIconTablet@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/144_iPad_Retina_Web_Clip.png",
			 "startupImage320x460":"./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
			 "startupImage640x920":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
			 "startupImage640x1096":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
			 "startupImage768x1004":"./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
			 "startupImage748x1024":"./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
			 "startupImage1536x2008":"./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
			 "startupImage1496x2048":"./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
			
			
			
			
		},
		
		"viewPath" : "cus.crm.lead.view",
		"detailPageRoutes" :{  
            "detail" : {
            			"pattern" : "detail/{contextPath}",
            			"view" : "S3"
            },
		    "edit"  :  {
		    	         "pattern" : "edit/{contextPath}",
		    	         "view"  : "S4"
		    	 
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
				"editFullScreen" : {
					pattern : "editFullScreen/{contextPath}",
					view : "S4",
					
				}
	         	
	        }
        
    }),
   
	/**
	 * Initialize the application 
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
	  var oViewData = {component: this};

    var oMainView = sap.ui.view({
      viewName : "cus.crm.lead.Main",
      type : sap.ui.core.mvc.ViewType.XML,
      viewData : oViewData
    });
    
    oMainView.setModel(new sap.ui.model.json.JSONModel({
    	s2Controller : null,
    	s3Controller : null,
    	s4Controller : null
    }),"controllers");
    return oMainView;
	}
  
});