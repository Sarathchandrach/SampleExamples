/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//declare namespace
jQuery.sap.declare("hcm.emp.mybenefits.util.Utilities");

hcm.emp.mybenefits.util.Utilities = {

    formAttachments: function(oContext) {
        var attachments = [];
        var attachment = {};
        var attachmentsList = [];
        var attachmentJsonModel = new sap.ui.model.json.JSONModel();
        if (oContext.UrlPlan.length !== 0) {
            attachment.UrlPlanText = oContext.UrlPlanText;
            attachment.UrlPlan = oContext.UrlPlan;

            attachments.push(attachment);

        }
        if (oContext.UrlPlanType.length !== 0) {
            attachment.UrlPlanText = oContext.UrlPlanTypeText;
            attachment.UrlPlan = oContext.UrlPlanType;

            attachments.push(attachment);
        }

        attachmentsList.push(attachments);

        if (oContext.UrlPlan.length !== 0 || oContext.UrlPlanType.length !== 0) {
            attachmentJsonModel.setData(attachmentsList);
        }
        return attachmentJsonModel;
    }


};