/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");jQuery.sap.require("hcm.emp.mybenefits.util.Utilities");this.utilFormatter=hcm.emp.mybenefits.util.Formatter;sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.emp.mybenefits.view.S6",{extHookInitAdditionalTabs:null,extHookChangeFooterButtons:null,onInit:function(){sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);this.oDataModel=this.oApplicationFacade.getODataModel();this.resourceBundle=this.oApplicationFacade.getResourceBundle();hcm.emp.mybenefits.util.DataManager.init(this.oDataModel,this.resourceBundle);this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="FSA"){hcm.emp.mybenefits.util.DataManager.init(this.oDataModel,this.resourceBundle);e.getParameter("arguments").contextPath=decodeURIComponent(e.getParameter("arguments").contextPath);var _=this;var c=decodeURIComponent(e.getParameter("arguments").contextPath);var i=c.split("/")[1];var b=hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");_.byId("TabContainer").setSelectedKey("Information");_.byId("TabContainer").setExpanded(true);if(b){var a=b.Benefits[i];var o=_.byId("MB_MISC_HEADER");var f=_.byId("MB_FORM_EVIDENCE_INSURABILITY");var s=_.byId("MB_LABEL_EVIDENCE_INSURABILITY_VALUE");var F=_.byId("MB_FORM_PLAN_NUMBER");var p=_.byId("MB_FORM_PAYROLL_FREQUENCY");var d=_.byId("MB_FORM_PLAN_OPTION");var g=_.byId("MB_LABEL_PLAN_OPTION_VALUE");var h=_.byId("MB_FORM_PLAN_YEAR");var j=_.byId("MB_LABEL_PLAN_YEAR_VALUE");var k=_.byId("MB_FORM_CONTRIBUTION");var l=_.byId("MB_LABEL_CONTRIBUTION_VALUE");o.setTitle(a.PlanTypeText);o.setNumber(hcm.emp.mybenefits.util.Formatter.formatAmount(a.Coverage,a.Currency));o.setNumberUnit(a.Currency);_.byId("MB_PLAN_SUB_TYPE_TEXT").setText(a.PlanSubTypeText);_.byId("MB_PLAN_OPTION_TEXT").setText(a.PlanOptionText);_.byId("MB_PLAN_PERIOD").setText(hcm.emp.mybenefits.util.Formatter.mbPeriod(_.resourceBundle.getText("MB_PARTICIPATION_PERIOD"),a.ParticipationBegin,a.ParticipationEnd));_.byId("MB_PLAN_FSA_STATUS").setText(hcm.emp.mybenefits.util.Formatter.formatFSAStatus(a.Coverage));F.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.PlanNo));_.byId("MB_LABEL_PLAN_NUMBER_VALUE").setText(a.PlanNo);p.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.ParticipationPeriod));_.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").setText(a.ParticipationPeriod);d.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.PlanOptionText));g.setText(a.PlanOptionText);h.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisible(a.FsaPlanStart));j.setText(hcm.emp.mybenefits.util.Formatter.mbPlanYear(a.FsaPlanStart,a.FsaPlanEnd));k.setVisible(hcm.emp.mybenefits.util.Formatter.formatterVisibleCost(a.EmpPreTaxCost));l.setText(hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(a.EmpPreTaxCost,a.Currency));this._buildAttachments(a);this._hideNoValueFields()}}},this);var v=this.getView();this.oTabBar=v.byId("TabContainer");if(this.extHookInitAdditionalTabs){this.extHookInitAdditionalTabs(this.oTabBar)}},_hideNoValueFields:function(){var v=this;if(!(v.byId("MB_LABEL_PLAN_NUMBER_VALUE").getVisible())&&!(v.byId("MB_LABEL_PAYROLL_FREQUENCY_VALUE").getVisible())&&!(v.byId("MB_LABEL_PLAN_OPTION_VALUE").getVisible())&&!(v.byId("MB_LABEL_PLAN_YEAR_VALUE").getVisible())&&!(v.byId("MB_LABEL_CONTRIBUTION_VALUE"))){v.byId("MB_LABEL_NO_DATA").setVisible(true);v.byId("MB_FORM_NO_DATA").setVisible(true);v.byId("MB_LABEL_INFORMATION").destroyTitle()}else{v.byId("MB_LABEL_NO_DATA").setVisible(false);v.byId("MB_FORM_NO_DATA").setVisible(false);v.byId("MB_LABEL_INFORMATION").setTitle("")}},_buildAttachments:function(c){var a=hcm.emp.mybenefits.util.Utilities.formAttachments(c),b=this.byId("Attachment");this.getView().setModel(a,"attachmentsModel");if(a.getData().length>=1){b.setCount(a.getData()[0].length);b.setVisible(true)}else{b.setCount(0);b.setVisible(false)}},onSenderPress:function(e){var p=e.oSource.oBindingContexts.attachmentsModel.getProperty().UrlPlan;sap.m.URLHelper.redirect(p,true)},getHeaderFooterOptions:function(){var o={sI18NDetailTitle:this.resourceBundle.getText("MB_APP_DETAIL_TITLE"),oAddBookmarkSettings:{title:this.resourceBundle.getText("MB_APP_TITLE"),icon:"sap-icon://family-care"}};if(this.extHookChangeFooterButtons){o=this.extHookChangeFooterButtons(o)};return o}});
