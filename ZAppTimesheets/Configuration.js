/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.timesheet.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("hcm.mgr.approve.timesheet.Configuration",{oServiceParams:{serviceList:[{name:"SRA010_TIMESHEET_APPROVAL_SRV",masterCollection:"Time_Pending",serviceUrl:"/sap/opu/odata/sap/SRA010_TIMESHEET_APPROVAL_SRV/",isDefault:true,mockedDataSource:"/hcm.mgr.approve.timesheet/model/metadata.xml"}]},getServiceParams:function(){return this.oServiceParams},getServiceList:function(){return this.oServiceParams.serviceList},getMasterKeyAttributes:function(){return["Id"]}});
