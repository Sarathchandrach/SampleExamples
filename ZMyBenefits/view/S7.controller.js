/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");this.utilFormatter=hcm.emp.mybenefits.util.Formatter;sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S7",{extHookInitAdditionalTabs:null,extHookChangeFooterButtons:null,onInit:function(){sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);this.oDataModel=this.oApplicationFacade.getODataModel();this.resourceBundle=this.oApplicationFacade.getResourceBundle();hcm.emp.mybenefits.util.DataManager.init(this.oDataModel,this.resourceBundle);this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="Miscellaneous"){hcm.emp.mybenefits.util.DataManager.init(this.oDataModel,this.resourceBundle);e.getParameter("arguments").contextPath=decodeURIComponent(e.getParameter("arguments").contextPath);var _=this;var c=decodeURIComponent(e.getParameter("arguments").contextPath);var i=c.split("/")[1];var b=hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");_.byId("TabContainer").setSelectedKey("Information");_.byId("TabContainer").setExpanded(true);if(b){var a=b.Benefits[i];var o=_.byId("MB_MISC_HEADER");var F=_.byId("MB_FORM_PLAN_NUMBER");var p=_.byId("MB_FORM_PAYROLL_FREQUENCY");var d=_.byId("MB_FORM_PRETAXCOST");var f=_.byId("MB_LABEL_PRETAXCOST_VALUE");var g=_.byId("MB_FORM_POSTTAXCOST");var h=_.byId("MB_LABEL_POSTTAXCOST_VALUE");var j=_.byId("MB_FORM_ADDTNL_POSTTAXCOST");var k=_.byId("MB_LABEL_ADDTNL_POSTTAXCOST_VALUE");var l=_.byId("MB_FORM_IMPUTED_INCOME");var m=_.byId("MB_LABEL_IMPUTED_INCOME_VALUE");var n=_.byId("MB_FORM_EMPLOYER_COSTS");var q=_.byId("MB_LABEL_EMPLOYER_COSTS_VALUE");var r=_.byId("MB_FORM_CALCULATED_CREDIT");var s=_.byId("MB_LABEL_CALCULATED_CREDIT_VALUE");var t=_.byId("MB_FORM_REGULAR_PRE_TAX");var u=_.byId("MB_REGULAR_PRE_TAX_PERCENT");var w=_.byId("MB_FORM_REGULAR_POST_TAX");var x=_.byId("MB_REGULAR_POST_TAX_PERCENT");var y=_.byId("MB_FORM_BONUS_PRE_TAX");var z=_.byId("MB_BONUS_PRE_TAX_PERCENT");var A=_.byId("MB_FORM_BONUS_POST_TAX");var B=_.byId("MB_BONUS_POST_TAX_PERCENT");o.setTitle(a.PlanTypeText);_.byId("MB_PLAN_SUB_TYPE_TEXT").setText(a.PlanSubTypeText);_.byId("MB_PLAN_OPTION_TEXT").setText(a.PlanOptionText);_.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),a.ParticipationBegin,a.ParticipationEnd));F.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.PlanNo));_.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(a.PlanNo);p.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.ParticipationPeriod));_.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(a.ParticipationPeriod);d.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.EmpPreTaxCost));f.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.EmpPreTaxCost,a.Currency));g.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.EmpPostTaxCost));h.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.EmpPostTaxCost,a.Currency));j.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.EmpAddPostTaxCost));k.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.EmpAddPostTaxCost,a.Currency));l.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.ImputedIncome));m.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.ImputedIncome,a.Currency));n.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.EmployerCost));q.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.EmployerCost,a.Currency));r.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.CalcCredit));s.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.CalcCredit,a.Currency));t.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.RegPreTaxCont));u.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.RegPreTaxCont,a.Currency));_.byId("MB_FORM_REGULAR_PRE_TAX_DUMMY").setVisible(a.TraPreToPost);w.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.RegPostTaxCont));x.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.RegPostTaxCont,a.Currency));_.byId("MB_FORM_REGULAR_POST_TAX_DUMMY").setVisible(a.StartPostTax_mmi);y.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.BonPreTaxContr));z.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.BonPreTaxContr,a.Currency));_.byId("MB_FORM_BONUS_PRE_TAX_DUMMY").setVisible(a.BonTraPreToPost);A.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.BonPostTaxCont));B.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.BonPostTaxCont,a.Currency));_.byId("MB_FORM_BONUS_POST_TAX_DUMMY").setVisible(a.StartBonPostTaximmi);hcm.emp.mybenefits.util.DataManager.getHealthDependants(_,a,function(C){var D=_.byId("MB_LABEL_DEPENDANTS");_.objBenfitsCollection={"Dependants":C.results};D.setModel(new sap.ui.model.json.JSONModel(_.objBenfitsCollection));D.bindAggregation("items",{path:"/Dependants",template:new sap.m.FeedListItem({iconActive:false,icon:"{path:'Dependants/results/DepName', formatter:'utilFormatter.displayContactPicture'}",text:"{parts: [{path: 'DepName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}"})})});hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_,a,function(C){var D=_.byId("MB_LABEL_BENEFICIARIES");_.objBenfitsCollection={"Beneficiary":C.Beneficiary.results};D.setVisible(C.BeneficiaryExists);D.setModel(new sap.ui.model.json.JSONModel(_.objBenfitsCollection));D.bindAggregation("items",{path:"/Beneficiary",template:new sap.m.FeedListItem({iconActive:false,icon:"{path:'BenName', formatter:'utilFormatter.displayContactPicture'}",sender:"{ContingentUI}",senderActive:false,text:"{parts: [{path: 'BenName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}",info:"{BenPctUI}"})})});hcm.emp.mybenefits.util.DataManager.getInvestment(_,a,function(C){var D=_.byId("MB_LABEL_INVESTMENTS");_.objBenfitsCollection={"Investment":C.Investment.results};D.setVisible(C.InvestmentExists);D.setModel(new sap.ui.model.json.JSONModel(_.objBenfitsCollection));D.bindAggregation("items",{path:"/Investment",template:new sap.m.ColumnListItem({cells:[new sap.m.Text({text:"{InvName}"}),new sap.m.Text({text:"{parts:[{path:'InvPct'}], formatter:'utilFormatter.AppendPercent'}"}),new sap.m.Text({text:"{parts:[{path:'InvAmt'},{path:'Currency'}], formatter:'utilFormatter.formatAmount'}"})]})})});_._buildAttachments(a);_._hideNoValueFields()}}},this);var v=this.getView();this.oTabBar=v.byId("TabContainer");if(this.extHookInitAdditionalTabs){this.extHookInitAdditionalTabs(this.oTabBar)}},_hideNoValueFields:function(){var v=this;if(!(v.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible())&&!(v.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible())&&!(v.byId("MB_REGULAR_PRE_TAX_PERCENT").getVisible())&&!(v.byId("MB_REGULAR_POST_TAX_PERCENT").getVisible())&&!(v.byId("MB_BONUS_PRE_TAX_PERCENT").getVisible())&&!(v.byId("MB_BONUS_POST_TAX_PERCENT").getVisible())&&!(v.byId("MB_REGULAR_POST_TAX_TEXT").getVisible())&&!(v.byId("MB_BONUS_POST_TAX_TEXT").getVisible())&&!(v.byId("MB_REGULAR_PRE_TAX_TEXT").getVisible())&&!(v.byId("MB_BONUS_PRE_TAX_TEXT").getVisible())){v.byId("MB_LABEL_NO_DATA").setVisible(true);v.byId("MB_FORM_NO_DATA").setVisible(true);v.byId("MB_LABEL_INFORMATION").destroyTitle()}else{v.byId("MB_LABEL_NO_DATA").setVisible(false);v.byId("MB_FORM_NO_DATA").setVisible(false);v.byId("MB_LABEL_INFORMATION").setTitle("")}},_buildAttachments:function(c){var a=hcm.emp.mybenefits.util.Utilities.formAttachments(c),b=this.byId("Attachment");this.getView().setModel(a,"attachmentsModel");if(a.getData().length>=1){b.setCount(a.getData()[0].length);b.setVisible(true)}else{b.setCount(0);b.setVisible(false)}},onSenderPress:function(e){var p=e.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;sap.m.URLHelper.redirect(p,true)},getHeaderFooterOptions:function(){var o={sI18NDetailTitle:this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),oAddBookmarkSettings:{title:this.resourceBundle.getText("MB_APP_TITLE"),icon:"sap-icon://family-care"}};if(this.extHookChangeFooterButtons){o=this.extHookChangeFooterButtons(o)};return o}});
