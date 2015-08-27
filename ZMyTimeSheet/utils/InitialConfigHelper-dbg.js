/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.InitialConfigHelper");
jQuery.sap.require("hcm.emp.mytimesheet.utils.ConnectionHelper");

hcm.emp.mytimesheet.Configuration.extend("hcm.emp.mytimesheet.utils.InitialConfigHelper", {
			
		getText : function(sKey, aParams) {
			return this.oBundle.getText(sKey, aParams);
		},
		
		getClockEntry : function() {
			return this.initialInfoModel.getData().clockEntry;
		},
		
/*Note 1959135: Quantity input field*/
		getDecimalTimeEntry : function() {
			return this.initialInfoModel.getData().decimalTimeEntry;
		},

		getAllowNonWorkingDays : function() {
			return this.initialInfoModel.getData().allowNonWorkingDays;
		},

		getQuickEntryCounter : function() {
			return this.initialInfoModel.getData().quickEntryCounter;
		},

		getStartDate : function() {
			return this.initialInfoModel.getData().startDate;
		},

		getEndDate : function() {
			return this.initialInfoModel.getData().endDate;
		},
		setInitialInfoModel: function(initialInfoModel){
			this.initialInfoModel = initialInfoModel;
		},
		setResourceBundle: function(resourceBundle){
			this.oBundle = resourceBundle;
		}
	
});
