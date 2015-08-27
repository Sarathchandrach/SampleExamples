/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.mgr.approve.timesheet.Main", {

	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('hcm.mgr.approve.timesheet', this);
	}
});