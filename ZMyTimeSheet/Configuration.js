/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("hcm.emp.mytimesheet.Configuration",{oServiceParams:{serviceList:[{name:"SRA002_TIMESHEET_SRV",masterCollection:"WorkListCollection",serviceUrl:"/sap/opu/odata/sap/SRA002_TIMESHEET_SRV/",isDefault:true,mockedDataSource:"/hcm.emp.mytimesheet/model/metadata.xml"}]},getServiceParams:function(){return this.oServiceParams},getServiceList:function(){return this.oServiceParams.serviceList},getMasterKeyAttributes:function(){return["Id"]},});
