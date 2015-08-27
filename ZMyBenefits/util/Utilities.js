/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mybenefits.util.Utilities");hcm.emp.mybenefits.util.Utilities={formAttachments:function(c){var a=[];var b={};var d=[];var e=new sap.ui.model.json.JSONModel();if(c.UrlPlan.length!==0){b.UrlPlanText=c.UrlPlanText;b.UrlPlan=c.UrlPlan;a.push(b)}if(c.UrlPlanType.length!==0){b.UrlPlanText=c.UrlPlanTypeText;b.UrlPlan=c.UrlPlanType;a.push(b)}d.push(a);if(c.UrlPlan.length!==0||c.UrlPlanType.length!==0){e.setData(d)}return e}};
