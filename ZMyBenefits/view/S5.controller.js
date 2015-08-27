/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");this.utilFormatter=hcm.emp.mybenefits.util.Formatter;sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S5",{extHookInitAdditionalTabs:null,extHookChangeFooterButtons:null,onInit:function(){sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);this.oDataModel=this.oApplicationFacade.getODataModel();this.resourceBundle=this.oApplicationFacade.getResourceBundle();hcm.emp.mybenefits.util.DataManager.init(this.oDataModel,this.resourceBundle);this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="Savings"){hcm.emp.mybenefits.util.DataManager.init(this.oDataModel,this.resourceBundle);e.getParameter("arguments").contextPath=decodeURIComponent(e.getParameter("arguments").contextPath);var _=this;var c=decodeURIComponent(e.getParameter("arguments").contextPath);var i=c.split("/")[1];var b=hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");_.byId("TabContainer").setSelectedKey("Information");_.byId("TabContainer").setExpanded(true);if(b){var a=b.Benefits[i];var o=_.byId("MB_SAVINGS_HEADER");var F=_.byId("MB_FORM_PLAN_NUMBER");var p=_.byId("MB_FORM_PAYROLL_FREQUENCY");var r=_.byId("MB_FORM_REGULAR_PRE_TAX");var d=_.byId("MB_REGULAR_PRE_TAX_PERCENT");var f=_.byId("MB_FORM_REGULAR_POST_TAX");var g=_.byId("MB_REGULAR_POST_TAX_PERCENT");var h=_.byId("MB_FORM_BONUS_PRE_TAX");var j=_.byId("MB_BONUS_PRE_TAX_PERCENT");var k=_.byId("MB_FORM_BONUS_POST_TAX");var l=_.byId("MB_BONUS_POST_TAX_PERCENT");o.setTitle(a.PlanTypeText);_.byId("MB_PLAN_SUB_TYPE_TEXT").setText(a.PlanSubTypeText);_.byId("MB_PLAN_OPTION_TEXT").setText(a.PlanOptionText);_.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),a.ParticipationBegin,a.ParticipationEnd));F.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.PlanNo));_.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(a.PlanNo);p.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.ParticipationPeriod));_.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(a.ParticipationPeriod);r.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.RegPreTaxCont));d.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.RegPreTaxCont,a.Currency));_.byId("MB_FORM_REGULAR_PRE_TAX_DUMMY").setVisible(a.TraPreToPost);f.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.RegPostTaxCont));g.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.RegPostTaxCont,a.Currency));_.byId("MB_FORM_REGULAR_POST_TAX_DUMMY").setVisible(a.StartPostTax_mmi);h.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.BonPreTaxContr));j.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.BonPreTaxContr,a.Currency));_.byId("MB_FORM_BONUS_PRE_TAX_DUMMY").setVisible(a.BonTraPreToPost);k.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.BonPostTaxCont));l.setText(hcm.emp.mybenefits.util.Formatter.formatContribution(a.BonPostTaxCont,a.Currency));_.byId("MB_FORM_BONUS_POST_TAX_DUMMY").setVisible(a.StartBonPostTaximmi);hcm.emp.mybenefits.util.DataManager.getBeneficiaries(_,a,function(m){var n=_.byId("MB_LABEL_BENEFICIARIES");n.setVisible(m.BeneficiaryExists);_.objBenfitsCollection={"Beneficiary":m.Beneficiary.results};n.setModel(new sap.ui.model.json.JSONModel(_.objBenfitsCollection));n.bindAggregation("items",{path:"/Beneficiary",template:new sap.m.FeedListItem({iconActive:false,icon:"{path:'BenName', formatter:'utilFormatter.displayContactPicture'}",sender:"{ContingentUI}",senderActive:false,text:"{parts: [{path: 'BenName'}, {path: 'Relation'}], formatter:'utilFormatter.mbDependants'}",info:"{BenPctUI}"})})});hcm.emp.mybenefits.util.DataManager.getInvestment(_,a,function(m){var n=_.byId("MB_LABEL_INVESTMENTS");n.setVisible(m.InvestmentExists);_.objBenfitsCollection={"Investment":m.Investment.results};n.setModel(new sap.ui.model.json.JSONModel(_.objBenfitsCollection));n.bindAggregation("items",{path:"/Investment",template:new sap.m.ColumnListItem({cells:[new sap.m.Text({text:"{InvName}"}),new sap.m.Text({text:"{parts:[{path:'InvPct'}], formatter:'utilFormatter.AppendPercent'}"}),new sap.m.Text({text:"{parts:[{path:'InvAmt'},{path:'Currency'}], formatter:'utilFormatter.formatAmount'}"})]})})});_._buildAttachments(a);_._hideNoValueFields()}}},this);var v=this.getView();this.oTabBar=v.byId("TabContainer");if(this.extHookInitAdditionalTabs){this.extHookInitAdditionalTabs(this.oTabBar)}},_hideNoValueFields:function(){var v=this;if(!(v.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible())&&!(v.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible())&&!(v.byId("MB_REGULAR_PRE_TAX_PERCENT").getVisible())&&!(v.byId("MB_REGULAR_POST_TAX_PERCENT").getVisible())&&!(v.byId("MB_BONUS_PRE_TAX_PERCENT").getVisible())&&!(v.byId("MB_BONUS_POST_TAX_PERCENT").getVisible())&&!(v.byId("MB_REGULAR_POST_TAX_TEXT").getVisible())&&!(v.byId("MB_BONUS_POST_TAX_TEXT").getVisible())&&!(v.byId("MB_REGULAR_PRE_TAX_TEXT").getVisible())&&!(v.byId("MB_BONUS_PRE_TAX_TEXT").getVisible())){v.byId("MB_LABEL_NO_DATA").setVisible(true);v.byId("MB_FORM_NO_DATA").setVisible(true);v.byId("MB_LABEL_INFORMATION").destroyTitle()}else{v.byId("MB_LABEL_NO_DATA").setVisible(false);v.byId("MB_FORM_NO_DATA").setVisible(false);v.byId("MB_LABEL_INFORMATION").setTitle("")}},_buildAttachments:function(c){var a=hcm.emp.mybenefits.util.Utilities.formAttachments(c),b=this.byId("Attachment");this.getView().setModel(a,"attachmentsModel");if(a.getData().length>=1){b.setCount(a.getData()[0].length);b.setVisible(true)}else{b.setCount(0);b.setVisible(false)}},onSenderPress:function(e){var p=e.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;sap.m.URLHelper.redirect(p,true)},getHeaderFooterOptions:function(){var o={sI18NDetailTitle:this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),oAddBookmarkSettings:{title:this.resourceBundle.getText("MB_APP_TITLE"),icon:"sap-icon://family-care"}};if(this.extHookChangeFooterButtons){o=this.extHookChangeFooterButtons(o)};return o}});
