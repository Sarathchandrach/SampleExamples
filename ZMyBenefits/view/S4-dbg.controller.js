/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");
this.utilFormatter = hcm.emp.mybenefits.util.Formatter;
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S4", {
	
//	Controller Hook method definitions

//	This hook method can be used to initialize additional tabs of the icon tab filter from code.
//	It is called during S4 view initialization.  The controller extension should obtain   
//	references to the new icon tabs
	extHookInitAdditionalTabs: null,
	
//	This hook method can be used to add and change buttons for the detail view footer
//	It is called when the decision options for the detail item are fetched successfully
	extHookChangeFooterButtons: null,
	
	onInit: function() {
		// execute the onInit for the base class
		// BaseDetailController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "Insurance") {
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

					var objHeader= _this.byId("MB_INSURANCE_HEADER");
					var formEvdncVisibility=_this.byId("MB_FORM_EVIDENCE_INSURABILITY");
					var sbmtLblValue=_this.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE");

					var FrmPlnNumVisblty=_this.byId("MB_FORM_PLAN_NUMBER");
					var payrlFreqVisiblty=_this.byId("MB_FORM_PAYROLL_FREQUENCY");

					var preTaxCostVisblty=_this.byId("MB_FORM_PRETAXCOST");
					var preTaxCostValue=_this.byId("MB_LABEL_PRETAXCOST_VALUE");

					var empBonsPreTaxCstVisblty=_this.byId("MB_FORM_EMP_BONUS_PRE_TAX_COST");
					var empBonsPreTaxCstVlu=_this.byId("MB_LABEL_EMP_BONUS_PRE_TAX_COST_VALUE");

					var postTaxCstVisblty=_this.byId("MB_FORM_POSTTAXCOST");
					var postTaxCostValue=_this.byId("MB_LABEL_POSTTAXCOST_VALUE");

					var empBonsPostTaxCstVisblty=_this.byId("MB_FORM_EMP_BONUS_POST_TAX_COST");
					var empBonsPostTaxCstVlu= _this.byId("MB_LABEL_EMP_BONUS_POST_TAX_COST_VALUE");

					var employerCstVisblty= _this.byId("MB_FORM_EMPLOYER_COSTS");
					var employerCstVlu= _this.byId("MB_LABEL_EMPLOYER_COSTS_VALUE");



					objHeader.setTitle(curntBnftPlan.PlanTypeText);  
					objHeader.setNumber(hcm.emp.mybenefits.util.Formatter.formatAmount(curntBnftPlan.Coverage,curntBnftPlan.Currency));
					objHeader.setNumberUnit(curntBnftPlan.Currency);

					_this.byId("MB_PLAN_SUB_TYPE_TEXT").setText(curntBnftPlan.PlanSubTypeText);
					_this.byId("MB_PLAN_OPTION_TEXT").setText(curntBnftPlan.PlanOptionText);
					_this.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_this.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),curntBnftPlan.ParticipationBegin,curntBnftPlan.ParticipationEnd));

					formEvdncVisibility.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleInsurability(curntBnftPlan.InsurabilityRequired,curntBnftPlan.StatusText));
					sbmtLblValue.setText(hcm.emp.mybenefits.util.Formatter.mbSubmitInsurabilityBefore(curntBnftPlan.InsurabilitySubDate));

					FrmPlnNumVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.PlanNo));
					_this.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(curntBnftPlan.PlanNo);

					payrlFreqVisiblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(curntBnftPlan.ParticipationPeriod));
					_this.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(curntBnftPlan.ParticipationPeriod);

					preTaxCostVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPreTaxCost));
					preTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPreTaxCost,curntBnftPlan.Currency));

					empBonsPreTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPreTaxCost));
					empBonsPreTaxCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.BonPreTaxCost,curntBnftPlan.Currency));

					postTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmpPostTaxCost));
					postTaxCostValue.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmpPostTaxCost,curntBnftPlan.Currency));

					empBonsPostTaxCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.BonPostTaxCost));
					empBonsPostTaxCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.BonPostTaxCost,curntBnftPlan.Currency));

					employerCstVisblty.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(curntBnftPlan.EmployerCost));
					employerCstVlu.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(curntBnftPlan.EmployerCost,curntBnftPlan.Currency));

					this._buildAttachments(curntBnftPlan/*this.oDataModel.oData[oEvent
	            .getParameter("arguments").contextPath]*/);


					hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_this,curntBnftPlan,function(objResponse) {
						var beneficiaries= _this.byId("MB_LABEL_BENEFICIARIES");
						beneficiaries.setVisible( objResponse.BeneficiaryExists);
						_this.objBenfitsCollection = {"Beneficiary" : objResponse.Beneficiary.results};
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
				}
			
				this._buildAttachments(curntBnftPlan);
				this._hideNoValueFields();

			}

		}, this);
		   var oView = this.getView();
		    //    var IconTabFilter = new sap.m.IconTabFilter
		        this.oTabBar = oView.byId("TabContainer");
		        /**
		         * @ControllerHook Initialize the custom tabs
		         * added by the extension application.
		         * This hook method can be used to initialize additional tabs of the tab bar from code.
		         * It is called during S4 view initialization.  The controller extension should obtain   
		         * references to the new tabs, which can be used later in the configureAdditionalTabs 
		         * hook method.
		         * @callback hcm.emp.mybenefits.view.S4~extHookInitAdditionalTabs
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
        if (!(view.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE").getVisible()) && !(view.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible()) && !(view.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible()) && !(view.byId("MB_LABEL_PRETAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_POSTTAXCOST_VALUE").getVisible()) && !(view.byId("MB_LABEL_EMPLOYER_COSTS").getVisible())) {
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
             * @callback hcm.emp.mybenefits.view.S4~extHookChangeFooterButtons
             * @param {object} objHdrFtr-Header footer object
             * @return {object} objHdrFtr-Header footer object
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
