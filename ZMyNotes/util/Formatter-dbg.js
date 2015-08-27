/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("sap.ca.ui.model.type.Time");

jQuery.sap.declare("cus.crm.notes.util.Formatter");

cus.crm.notes.util.Formatter = {

	/**
	 * Converts from a Javascript date into a string with Format
	 * YYYY-MM-DDTHH:MM:SS e.g. 2013-09-04T04:00:00
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getAbapDate : function(datetime) {
		// TODO search for a better way to format the date in abap format
		return datetime.getUTCFullYear() + '-'
				+ (new Number(datetime.getUTCMonth()) + 1) + '-'
				+ datetime.getUTCDate() + 'T' + datetime.getUTCHours() + ':'
				+ datetime.getUTCMinutes() + ':' + datetime.getUTCSeconds();
	},
	
	/**
	 * Converts from two Javascript dates (one for the date and one for the time) into
	 * a string with Format: YYYY-MM-DDTHH:MM:SS e.g. 2013-09-04T04:00:00
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getAbapDateTime : function(date, time) {
		// TODO search for a better way to format the date in abap format
		return date.getUTCFullYear() + '-'
				+ (new Number(date.getUTCMonth()) + 1) + '-'
				+ date.getUTCDate() + 'T' + time.getUTCHours() + ':'
				+ time.getUTCMinutes() + ':' + time.getUTCSeconds();
	},
	
	/**
	 * Converts from a Javascript date into a string with Format
	 * PTHHHMMMSSS e.g. PT16H00M00S
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getAbapTime : function(datetime) {
		// TODO search for a better way to format the date in abap format
		return 'PT' + datetime.getUTCHours() + 'H' + datetime.getUTCMinutes() + 'M'
				+ datetime.getUTCSeconds() + 'S';
	},
	
	weightedvolume : function(value, value1)
	{
		 var val =  value * value1* 1.00  / 100.00 ;
		  
	    return val;
	},
	
	pictureUrlFormatter : function (mediaUrl) {
	    return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
	},
	
	sectionDate : function (dateTime) {
		if (dateTime) {
			var dateFormat = sap.ui.core.format.DateFormat.getInstance({style: "long"}); 
     	    var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
     	    var timePattern = locale.getTimePattern("short");
     	    var timeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: timePattern });
		    return dateFormat.format(dateTime) + " " + timeFormat.format(dateTime);			
		} else {
			return dateTime;
		}
	},
	
	teaserText : function (teaser) {
		if (teaser === "") {
			teaser = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DETAIL_TITLE");
			return teaser;
		} else {
		  return teaser ;
		}
	}

};
