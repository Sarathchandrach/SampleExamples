/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.ppm.mgr.util.formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");

cus.crm.ppm.mgr.util.formatter = {
	// Formatters
	toBoolean : function(i) {
		if (i > 0)
			return true;
		else
			return false;
	},

	setDLFormatter : function(a) {
		return [ [ sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER ] ];
	},

	setYAFormatter : function(a) {
		return sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER;
	},

	// Formatting to display and reverse the numbers
	displayNumbers : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
			groupingEnabled : true
		}, locale);
		var numVal = convNF.format(i);
		return numVal;
	},

	// Formatting to display mobile view numbers
	displayTargetNumbers : function(i) {
		var numVal = sap.ca.ui.model.format.AmountFormat.FormatAmountShort(i);
		return numVal;
	},

	reverseNumbers : function(i) {
		var langu = sap.ui.getCore().getConfiguration().getLanguage();
		var numVal = null;
		if (langu == "fr" || langu == "ru")
			numVal = parseInt(i.replace(/[^0-9\.]+/g, ""));
		else {
			var locale = new sap.ui.core.Locale(langu);
			var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
				groupingEnabled : true
			}, locale);
			numVal = convNF.parse(i);
		}
		return numVal;
	},

	// Formatting to display and reverse the dates
	displayDates : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "long"
		}, locale);
		var dateVal = convDF.format(i);
		return dateVal;
	},

	convToSixZeros : function(i) {
		var locTime = i.getTime();
		var offSet = i.getTimezoneOffset() * 60000;
		var utcDate = new Date(locTime + offSet);
		return utcDate;
	},

	convFromSixZeros : function(i) {
		var utcTime = i.getTime();
		var offSet = i.getTimezoneOffset() * 60000;
		var locDate = new Date(utcTime - offSet);
		return locDate;
	},
};