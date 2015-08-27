/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
(function(){'use strict';jQuery.sap.require("sap.ca.ui.model.type.Date");sap.ui.controller("cus.crm.mycontacts.view.ContactDetails",{makeCall:function(e){if(jQuery.device.is.ipad)sap.m.URLHelper.redirect("facetime://"+e.getSource().getText().replace(/[()\s]/g,''),false);else sap.m.URLHelper.triggerTel(e.getSource().getText())},sendEmail:function(e){sap.m.URLHelper.triggerEmail(e.getSource().getText())},formatLabelVisible:function(s){return(s!==undefined&&null!==s&&s.length!==0)},onMapIconPressed:function(e){sap.m.URLHelper.redirect("http"+"://"+"maps.apple.com/?q="+this.getView().getBindingContext().getProperty("WorkAddress/address").split("\n").join(" "),!jQuery.device.is.phone)},})}());
