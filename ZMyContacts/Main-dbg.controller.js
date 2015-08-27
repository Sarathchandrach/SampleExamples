/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false */
(function () {
	'use strict';
	sap.ui.controller("cus.crm.mycontacts.Main", {

		onInit:function () {
			jQuery.sap.require("sap.ca.scfld.md.Startup");
			jQuery.sap.require("cus.crm.mycontacts.formatter.ReleaseFormatter");

			sap.ca.scfld.md.Startup.init('cus.crm.mycontacts', this);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 *
		 * @memberOf MainXML
		 */
		onExit:function () {
			//exit cleanup code here
		}

	});
}());
