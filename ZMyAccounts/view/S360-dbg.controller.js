/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("cus.crm.myaccounts.util.Util");


//Used for Cross Navigation to Leads, Opportunities, Tasks and Appointments
cus.crm.myaccounts.NavigationHelper = {};

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S360", {
    MODEL_360 : "cus.crm.myaccounts.s360",
	
	onInit : function() {		 
	   sap.ui.getCore().setModel(this.getView().getModel(),
			   cus.crm.myaccounts.view.S360.MODEL_360);
		this.oRouter.attachRouteMatched(this.handleNavTo, this);
		
		this.backendSupportsEdit = cus.crm.myaccounts.util.Util.getServiceSchemaVersion(this.getView().getModel(), "AccountCollection") > 0;
	},
	
	onAfterRendering: function(){
        $('.sapCRMmyAccountsHeader .sapMFlexItem').attr("style","float:left");
    },
	
	handleNavTo : function(oEvent){
		var oModel =  sap.ui.getCore().getModel(cus.crm.myaccounts.view.S360.MODEL_360);
		if (oEvent.getParameter("name") === "detail") {	
			var oController = this;
			var oView = this.getView();
			var sPath = '/' + oEvent.getParameter("arguments").contextPath;
			var context = new sap.ui.model.Context(oModel, '/' + oEvent.getParameter("arguments").contextPath);
			var fnBindViewContext = function(){
				oView.setModel(oModel);
				oView.setBindingContext(context);
				var oOptions=oController._getHeaderFooterOptions();
				oController.setHeaderFooterOptions(oOptions);
			};
			oModel.createBindingContext(sPath, "",
				{expand: 'AccountFactsheet,AccountFactsheet/Attachments,Logo,AccountFactsheet/Opportunities,AccountFactsheet/Notes,AccountFactsheet/Contacts,AccountFactsheet/Contacts/WorkAddress,AccountFactsheet/Leads,AccountFactsheet/Tasks,Classification,MainAddress,EmployeeResponsible,EmployeeResponsible/WorkAddress'}
				,fnBindViewContext
				,true
			);			
		}
		if (oEvent.getParameter("name") === "S2") {
			this.getView().setModel(new sap.ui.model.json.JSONModel());
		}
	},

	_getSelectedText: function (){
		var oAccount = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);
		var text=cus.crm.myaccounts.util.formatter.AccountNameFormatter(oAccount.fullName, oAccount.name1 )+"\n";
		
		var oMainAddress = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath+"/MainAddress");
		if (oMainAddress)
			text+=oMainAddress.address;

		return text; 
	},
	
	_getShareDisplay: function (){
		var oAccount = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);
		var text=cus.crm.myaccounts.util.formatter.AccountNameFormatter(oAccount.fullName, oAccount.name1 );
		
		var oMainAddress = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath+"/MainAddress");
		var text2 ="";
		if (oMainAddress)
			text2 = oMainAddress.address;

		return new sap.m.StandardListItem({title: text, description: text2});
	},
	
	_getDiscussID: function (){
		var url =  document.createElement('a');
		url.href = this.getView().getModel().sServiceUrl;
		return url.pathname + this.getView().getBindingContext().sPath;
//		return this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1 ;
//		return new sap.m.StandardListItem({title: text, description: text2});
	},
	
	_getDiscussType: function (){
		var url =  document.createElement('a');
		url.href = this.getView().getModel().sServiceUrl;
		return url.pathname + "/$metadata#AccountCollection";
	},
	
	_getDiscussName: function (){
		var oAccount = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);
		return cus.crm.myaccounts.util.formatter.AccountNameFormatter(oAccount.fullName, oAccount.name1 );
    },
    
	_getHeaderFooterOptions : function() {
		var that = this;
		var aButtonList = [];
		
		if(this.backendSupportsEdit){
			aButtonList.push({
				sI18nBtnTxt:"BUTTON_EDIT",
				sIcon:"",
				onBtnPressed:function (oEvent) {
					var oParameter;
					oParameter = {
						contextPath:that.getView().getBindingContext().sPath.substr(1),
					};
					that.oRouter.navTo("edit", oParameter, false);
				}});
		}
		
		return {
			buttonList : aButtonList,
			sI18NFullscreenTitle:"DETAIL_TITLE",
			onBack: function(oEvent){
				window.history.back();
			},
			oJamOptions : {
				oShareSettings :  { 			
					oDataServiceUrl: "/sap/opu/odata/sap/SM_INTEGRATION_SRV/",		
					object: {
						id: document.URL.replace(/&/g, "%26"),
						display: that._getShareDisplay(),
						share: that._getSelectedText() }
				},
				oDiscussSettings:{ 
					oDataServiceUrl: "/sap/opu/odata/sap/SM_INTEGRATION_SRV/",
					feedType: "object",
					object: {id: that._getDiscussID(),
						type: that._getDiscussType(),
						name: that._getDiscussName(),
						ui_url:document.URL
					}
				}
			},
			oAddBookmarkSettings:{
		    	icon:"sap-icon://Fiori2/F0002"
		    }
		};
	},
	navToOpportunity: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/opportunitiesCount");
		this.navToOtherApplication("Opportunity", "manageOpportunity",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToLead: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/leadsCount");
		this.navToOtherApplication("Lead", "manageLead",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToAppointments: function(){
		//path:'AccountFactsheet/nextContact/fromDate'
		var accountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID;
		var nextAppbinding = this.getView().getBindingContext().sPath +"/AccountFactsheet/nextContact/fromDate";
		var nextAppointmentDate = this.getView().getModel().getProperty(nextAppbinding);


		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/futureActivitiesCount");

		// *XNav* (1) obtain cross app navigation interface
		var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService; 
		this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
		if (null === nextAppointmentDate){
			//pass in format YYYYMMDD
			nextAppointmentDate = new Date();		
		}		

		//pass in format YYYYMMDD
		var nextAppDate = this.getDateParameterfromDate(nextAppointmentDate);
		
		cus.crm.myaccounts.NavigationHelper.qty = QtyForAccountID;
		cus.crm.myaccounts.NavigationHelper.accountName = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1;

		//Stop listen for route matched events in this view we are leaving
		this.oRouter.detachRouteMatched(this.handleNavTo, this, this);
		
		// *XNav (2) generate cross application link       
        this.oCrossAppNavigator && this.oCrossAppNavigator.toExternal({
            target: {  semanticObject : "Appointment", action: "myAppointments"  },
            params : { "accountID" : [ accountID ],
            			"Date" : [ nextAppDate ]}
        });

	},
	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},	
	navToTask: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/tasksCount");
		this.navToOtherApplication("Task", "manageTasks",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToNote: function(oEvent){
		this.oRouter.navTo("AccountNotes", {                                                         
			contextPath : oEvent.getSource().getBindingContext().sPath.replace('/' , "")
			// Remove initial /
		});

	}, 
	navToContact: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/contactsCount");
		this.navToOtherApplication("ContactPerson", "MyContacts",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToOtherApplication: function(targetSemanticObject, targetAction, accountID, qtyForAccountID,accountName){
		
		
		// *XNav* (1) obtain cross app navigation interface
		var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService; 
		this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
		
		cus.crm.myaccounts.NavigationHelper.qty = qtyForAccountID;
		cus.crm.myaccounts.NavigationHelper.accountName = accountName;
		
		//Stop listen for route matched events in this view we are leaving
		this.oRouter.detachRouteMatched(this.handleNavTo, this, this);
		
		// *XNav (2) generate cross application link       
        this.oCrossAppNavigator && this.oCrossAppNavigator.toExternal({
            target: {  semanticObject : targetSemanticObject, action: targetAction },
            params : { "accountID" : [ accountID ]}
        });
		

	},	
	navToAttachment: function(oEvent){
		this.oRouter.navTo("AccountAttachments", {                                                         
			contextPath : oEvent.getSource().getBindingContext().sPath.replace('/' , "")
			// Remove initial /
		});
	}, 
});
