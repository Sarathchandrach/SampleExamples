/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
(function(){'use strict';sap.ui.controller("cus.crm.mycontacts.view.AccountBusinessCard",{onTapPhone:function(e){sap.m.URLHelper.triggerTel(e.getSource().getText())},onMapIconPressed:function(e){sap.m.URLHelper.redirect("http"+"://"+"maps.apple.com/?q="+this.getView().getModel().getProperty("/address").split("\n").join(" "),!jQuery.device.is.phone)},})}());
