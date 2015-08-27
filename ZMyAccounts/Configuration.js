/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.Configuration");jQuery.sap.require("sap.ca.scfld.md.app.Application");jQuery.sap.require("cus.crm.myaccounts.util.Util");sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.myaccounts.Configuration",{oServiceParams:{serviceList:[{name:"CRM_BUPA_ODATA",serviceUrl:"/sap/opu/odata/sap/CRM_BUPA_ODATA",countSupported:true,isDefault:true,mockedDataSource:"model/metadata.xml"}]},getServiceList:function(){return this.oServiceParams.serviceList},setApplicationFacade:function(a){sap.ca.scfld.md.ConfigurationBase.prototype.setApplicationFacade.call(this,a);cus.crm.myaccounts.util.Util.setApplicationFacade(a)}});
