/*
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
