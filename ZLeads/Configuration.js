/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.lead.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.lead.Configuration",{oServiceParams:{serviceList:[{name:"CRM_LEAD",masterCollection:"Leads",serviceUrl:URI("/sap/opu/odata/sap/CRM_LEAD/").directory(),isDefault:true,countSupported:true,mockedDataSource:"/cus.crm.lead/model/metadata.xml"}]},getServiceParams:function(){return this.oServiceParams},getServiceList:function(){return this.oServiceParams.serviceList},getMasterKeyAttributes:function(){return["Id"]},});
