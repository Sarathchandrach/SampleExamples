/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S7", {
//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S7 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,

	onInit: function() {
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Miscellaneous") {
				hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

				oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);

				var _this = this;

				var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
				var indexVal = contextPath.split("/")[1];

				var  benefitsPlancollection = hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");

				_this.byId("TabContainer").setSelectedKey("Information");
				_this.byId("TabContainer").setExpanded(true);
				
				if (benefitsPlancollection) {

					var curntBnftPlan = benefitsPlancollection.Benefits[indexVal];	

					var objHeader= _this.byId("MB_MISC_HEADER");

					var FrmPlnNumVisblty=_this.byId("MB_FORM_PLAN_NUMBER");
					var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");

					var preTaxCostVisblty=_this.byId("MB_FORM_PRETAXCOST");
					var preTaxCostValue=_this.byId("MB_LABEL_PRETAXCOST_VALUE");

					var postTaxCstVisblty=_this.byId("MB_FORM_POSTTAXCOST");
					var postTaxCostValue=_this.byId("MB_LABEL_POSTTAXCOST_VALUE");

					var addtnlPstTaxVisblty= _this.byId("MB_FORM_ADDTNL_POSTTAXCOST");
					var addtnlPstTaxVlu= _this.byId("MB_LABEL_ADDTNL_POSTTAXCOST_VALUE");

					var imputedIncomeVisblty= _this.byId("MB_FORM_IMPUTED_INCOME");
					var imputedIncomeVlu= _this.byId("MB_LABEL_IMPUTED_INCOME_VALUE");

					var employerCstVisblty= _this.byId("MB_FORM_EMPLOYER_COSTS");
					var employerCstVlu= _this.byId("MB_LABEL_EMPLOYER_COSTS_VALUE");

					var calculatdCrdtVisblty= _this.byId("MB_FORM_CALCULATED_CREDIT");
					var calculatdCrdtVlu= _this.byId("MB_LABEL_CALCULATED_CREDIT_VALUE");

					var reglrPreTaxVisblty=_this.byId("MB_FORM_REGULAR_PRE_TAX");
					var reglrPreTaxVlu=_this.byId("MB_REGULAR_PRE_TAX_PERCENT");

					var reglrPstTaxVisblty=_this.byId("MB_FORM_REGULAR_POST_TAX");
					var reglrPstTaxVlu=_this.byId("MB_REGULAR_POST_TAX_PERCENT");

					var bnsPreTaxCostVisblty=_this.byId("MB_FORM_BONUS_PRE_TAX");
					var bnsPreTaxCostVlu=_this.byId("MB_BONUS_PRE_TAX_PERCENT");

					var bnsPstTaxCostVisblty=_this.byId("MB_FORM_BONUS_POST_TAX");
					var bnsPstTaxCostVlu=_this.byId("MB_BONUS_POST_TAX_PERCENT");


					objHeader.setTitle(curntBnftPlan.PlanTypeText);  

					_this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
					_this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
					_this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));

					FrmPlnNumVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
					_this.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);

					payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
					_this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);

					preTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPreTaxCost));
					preTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPreTaxCost,curntBnftPlan.Currency));

					postTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPostTaxCost));
					postTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPostTaxCost,curntBnftPlan.Currency));

					addtnlPstTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpAddPostTaxCost));
					addtnlPstTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpAddPostTaxCost,curntBnftPlan.Currency));

					imputedIncomeVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.ImputedIncome));
					imputedIncomeVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.ImputedIncome,curntBnftPlan.Currency));

					employerCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmployerCost));
					employerCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmployerCost,curntBnftPlan.Currency));

					calculatdCrdtVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.CalcCredit));
					calculatdCrdtVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.CalcCredit,curntBnftPlan.Currency));

					reglrPreTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.RegPreTaxCont));
					reglrPreTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.RegPreTaxCont,curntBnftPlan.Currency));  			 
					_this.byId("MB_FORM_REGULAR_PRE_TAX_DUMMY").setVisible(curntBnftPlan.TraPreToPost);

					reglrPstTaxVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.RegPostTaxCont));
					reglrPstTaxVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.RegPostTaxCont,curntBnftPlan.Currency));
					_this.byId("MB_FORM_REGULAR_POST_TAX_DUMMY").setVisible(curntBnftPlan.StartPostTax_mmi);

					bnsPreTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPreTaxContr));
					bnsPreTaxCostVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.BonPreTaxContr,curntBnftPlan.Currency));
					_this.byId("MB_FORM_BONUS_PRE_TAX_DUMMY").setVisible(curntBnftPlan.BonTraPreToPost);

					bnsPstTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPostTaxCont));
					bnsPstTaxCostVlu.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(curntBnftPlan.BonPostTaxCont,curntBnftPlan.Currency));
					_this.byId("MB_FORM_BONUS_POST_TAX_DUMMY").setVisible(curntBnftPlan.StartBonPostTaximmi);


					
					 hcm.emp.mybenefits.util.DataManager.getHealthDependants(_this,curntBnftPlan,function(objResponse) {
					 var dependants= _this.byId("MB_LABEL_DEPENDANTS");
						_this.objBenfitsCollection = {"Dependants" :objResponse.results };
						dependants.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
						dependants.bindAggregation("items",{
							path : "/Dependants",
							template : new sap.m.FeedListItem({
								iconActive: false,
								icon:"{path:'Dependants/results/DepName', formatter:'utilFormatter.displayContactPicture'}",
								text:"{parts: [{path: 'DepName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}"

							})
						});
	    			 });


						 
	    			 hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_this,curntBnftPlan,function(objResponse) {
	    				 var beneficiaries= _this.byId("MB_LABEL_BENEFICIARIES");
	    					_this.objBenfitsCollection = {"Beneficiary" : objResponse.Beneficiary.results};
	    					beneficiaries.setVisible( objResponse.BeneficiaryExists);
	    					beneficiaries.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
	    					beneficiaries.bindAggregation("items",{
	    						 path : "/Beneficiary",
	    						 template : new sap.m.FeedListItem({
	    							 iconActive: false,
	    							 icon:"{path:'BenName', formatter:'utilFormatter.displayContactPicture'}",
	    							 sender:"{ContingentUI}",
	    							 senderActive: false ,
	    							 text:"{parts: [{path: 'BenName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}",
	    							 info:"{BenPctUI}"
	    						 })
	    					 });
	    			 });

	    			 hcm.emp.mybenefits.util.DataManager.getInvestment(_this,curntBnftPlan,function(objResponse) {
	    				 var investments= _this.byId("MB_LABEL_INVESTMENTS");
	    					_this.objBenfitsCollection = { "Investment": objResponse.Investment.results};
	    					investments.setVisible( objResponse.InvestmentExists);
	    					investments.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));
	    					investments.bindAggregation("items",{
	    						 path : "/Investment",
	    						// visible:"{InvestmentExists}",
	    						 template :  new sap.m.ColumnListItem({
	    							 cells:[
	    							        new sap.m.Text({text:"{InvName}"}),
	    							        new sap.m.Text({text:"{parts:[{path:'InvPct'}], formatter:'utilFormatter.AppendPercent'}"}),
	    							        new sap.m.Text({
	    							        	 text:"{parts:[{path:'InvAmt'},{path:'Currency'}], formatter:'utilFormatter.formatAmount'}"
	    							         })
	    							        ]
	    						 })
	    					 });
	    			 });
	    			 _this._buildAttachments(curntBnftPlan);
						_this._hideNoValueFields();
				}
			}

		}, this);
        var oView = this.getView();
        //    var IconTabFilter = new sap.m.IconTabFilter
            this.oTabBar = oView.byId("TabContainer");
            /**
             * @ControllerHook Initialize the custom tabs
             * added by the extension application.
             * This hook method can be used to initialize additional tabs of the tab bar from code.
             * It is called during S7 view initialization.  The controller extension should obtain   
             * references to the new tabs, which can be used later in the configureAdditionalTabs 
             * hook method.
             * @callback hcm.emp.mybenefits.view.S7~extHookInitAdditionalTabs
             * @param {object} oTabBar - contains the tab bar object.
             * @return {void}
             */
            if (this.extHookInitAdditionalTabs) {
            	this.extHookInitAdditionalTabs(this.oTabBar);
            }
	},


	/**
	 * handler for data loading
	 */
	_hideNoValueFields: function() {
		// No data check for information section
		var view = this;
		if (!(view.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_REGULAR_PRE_TAX_PERCENT").getVisible()) && !(view.byId("MB_REGULAR_POST_TAX_PERCENT").getVisible()) && !(view.byId("MB_BONUS_PRE_TAX_PERCENT").getVisible()) && !(view.byId("MB_BONUS_POST_TAX_PERCENT").getVisible()) && !(view.byId("MB_REGULAR_POST_TAX_TEXT").getVisible()) && !(view.byId("MB_BONUS_POST_TAX_TEXT").getVisible()) && !(view.byId("MB_REGULAR_PRE_TAX_TEXT").getVisible()) && !(view.byId("MB_BONUS_PRE_TAX_TEXT").getVisible())) {
			view.byId("MB_LABEL_NO_DATA").setVisible(true);
			view.byId("MB_FORM_NO_DATA").setVisible(true);
			view.byId("MB_LABEL_INFORMATION").destroyTitle();
		} else {
			view.byId("MB_LABEL_NO_DATA").setVisible(false);
			view.byId("MB_FORM_NO_DATA").setVisible(false);
			view.byId("MB_LABEL_INFORMATION").setTitle("");
		}

	},

	_buildAttachments: function(oContext) {
		var attachments = hcm.emp.mybenefits.util.Utilities.formAttachments(oContext),
		attachmenttab = this.byId("Attachment");
		this.getView().setModel(attachments, "attachmentsModel");
		if (attachments.getData().length >= 1) {
			attachmenttab.setCount(attachments.getData()[0].length);
			attachmenttab.setVisible(true);
		} else {
			attachmenttab.setCount(0);
			attachmenttab.setVisible(false);
		}
	},

	onSenderPress: function(oEvent) {
		var path = oEvent.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;
		sap.m.URLHelper.redirect(path, true);
	},

	getHeaderFooterOptions: function() {
    	var objHdrFtr = {
                sI18NDetailTitle: this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),
                oAddBookmarkSettings: {
                    title: this.resourceBundle.getText("MB_APP_TITLE"),        
                    icon:"sap-icon://family-care"
                }
        	};
        	/**
             * @ControllerHook Modify the footer buttons
             * This hook method can be used to add and change buttons for the detail view footer
             * It is called when the decision options for the detail item are fetched successfully
             * @callback hcm.emp.mybenefits.view.S7~extHookChangeFooterButtons
             * @param {object} objHdrFtr-Header Footer Object
             * @return {object} objHdrFtr-Header Footer Object
             */
        	
        	if (this.extHookChangeFooterButtons) {
        		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        	};
        	
            //Note:Back button issue
            /*,
                   onBack: jQuery.proxy(function() {
                    //Check if a navigation to master is the previous entry in the history
                    var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                    if (sDir === "Backwards") {
                        window.history.go(-1);
                    } else {
                        //we came from somewhere else - create the master view
                        this.oRouter.navTo("master");
                    }
                }, this)*/
              //Note: End Back button issue
            
        	
            return objHdrFtr;
        }

});
