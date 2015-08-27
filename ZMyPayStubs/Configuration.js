/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.payslip.Configuration",{oServiceParams:{serviceList:[{name:"SRA006_SRV",masterCollection:"Payslips",serviceUrl:"/sap/opu/odata/sap/SRA006_SRV/",isDefault:true,mockedDataSource:"/hcm.emp.payslip/model/metadata.xml"}]},getServiceParams:function(){return this.oServiceParams},getServiceList:function(){return this.oServiceParams.serviceList},getMasterKeyAttributes:function(){return["Id"]}});
