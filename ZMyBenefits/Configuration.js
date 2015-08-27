/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mybenefits.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.mybenefits.Configuration",{oServiceParams:{serviceList:[{name:"SRA007_BENEFITS_SRV",masterCollection:"Benefits",serviceUrl:"/sap/opu/odata/sap/SRA007_BENEFITS_SRV/",isDefault:true,mockedDataSource:"/hcm.emp.mybenefits/model/metadata.xml"}]},getServiceParams:function(){return this.oServiceParams},getServiceList:function(){return this.oServiceParams.serviceList},getMasterKeyAttributes:function(){return["Id"]}});
