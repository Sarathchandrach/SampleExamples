/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");jQuery.sap.require("cus.crm.myaccounts.util.formatter");sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S4Notes",{onInit:function(){this.oRouter.attachRouteMatched(this.handleNavTo,this)},handleNavTo:function(e){if(e.getParameter("name")==="AccountNotes"){var v=this.getView();var m=this.getView().getModel();var p='/'+e.getParameter("arguments").contextPath;var c=new sap.ui.model.Context(m,'/'+e.getParameter("arguments").contextPath);var b=function(){v.setBindingContext(c)};m.createBindingContext(p,"",{expand:'Notes'},b,true)}},handleNavBack:function(e){window.history.back()}});
