/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.InitialConfigHelper");jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");hcm.emp.mytimesheet.Configuration.extend("hcm.emp.mytimesheet.utils.InitialConfigHelper",{getText:function(k,p){return this.oBundle.getText(k,p)},getClockEntry:function(){return this.initialInfoModel.getData().clockEntry},getDecimalTimeEntry:function(){return this.initialInfoModel.getData().decimalTimeEntry},getAllowNonWorkingDays:function(){return this.initialInfoModel.getData().allowNonWorkingDays},getQuickEntryCounter:function(){return this.initialInfoModel.getData().quickEntryCounter},getStartDate:function(){return this.initialInfoModel.getData().startDate},getEndDate:function(){return this.initialInfoModel.getData().endDate},setInitialInfoModel:function(i){this.initialInfoModel=i},setResourceBundle:function(r){this.oBundle=r}});