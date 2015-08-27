/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.salespipeline.sim.util.formatter");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

cus.crm.salespipeline.sim.util.formatter = {
	// Formatters
	toBoolean : function(i) {
		if (i > 0)
			return true;
		else
			return false;
	},

	// Formatting to display and reverse the numbers
	displayNumbers : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
			groupingEnabled : true
		}, locale);
		// var convNF =
		// sap.ca.ui.model.format.AmountFormat.getInstance({decimals: 0});
		var numVal = convNF.format(i);
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
		// var convNF =
		// sap.ca.ui.model.format.AmountFormat.getInstance({decimals: 0});
		// var numVal = convNF.parse(i);
		return numVal;
	},

	displayNumbersShort : function(i) {
		var numVal = null;
		/*if (jQuery.device.is.phone || jQuery.device.is.iphone
				|| jQuery.device.is.android_phone)*/
		if(sap.ui.Device.system.phone)
			numVal = sap.ca.ui.model.format.AmountFormat.FormatAmountShort(i);
		else {
			var locale = new sap.ui.core.Locale(sap.ui.getCore()
					.getConfiguration().getLanguage());
			var convNF = sap.ui.core.format.NumberFormat.getIntegerInstance({
				groupingEnabled : true
			}, locale);
			numVal = convNF.format(i);
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

	reverseDates : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "long"
		}, locale);
		var dateVal = convDF.parse(i);
		return dateVal;
	},

	// Formatting dates in ChangeLog
	dispCLDate : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "medium"
		}, locale);
		var dateVal = convDF.format(i);
		return dateVal;
	},

	revCLDate : function(i) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration()
				.getLanguage());
		var convDF = sap.ui.core.format.DateFormat.getInstance({
			style : "medium"
		}, locale);
		var dateVal = convDF.parse(i);
		dateVal = this.convFromSixZeros(dateVal);
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