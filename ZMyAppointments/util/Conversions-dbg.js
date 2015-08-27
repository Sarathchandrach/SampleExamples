/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.declare("cus.crm.mycalendar.util.Conversions");

cus.crm.mycalendar.util.Conversions = {
		
	formatDateTime : function(oDateTime) {
			if (oDateTime !== null ) {
				if (typeof oDateTime === "string") {

					oDateTime = oDateTime.replace("/Date(", "").replace(")/", "");
					oDateTime = parseInt(oDateTime); // number ms
					oDateTime = new Date(oDateTime);
					
					
				}
				
				var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
					style : "short" });
			    return dateTimeFormatter.format(oDateTime); }				
					else {
				return;
				}
	},
	
	formatDateTimeAllDay : function(oDateTime, bAllDay) {
		if (oDateTime !== null && bAllDay !== null ) {
			if (typeof oDateTime === "string") {

				oDateTime = oDateTime.replace("/Date(", "").replace(")/", "");
				oDateTime = parseInt(oDateTime); // number ms
				oDateTime = new Date(oDateTime);
				
				
			}
			
			var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				style : "short" });
			var oDate = dateFormatter.format(oDateTime);			
			
			if (bAllDay) {
				var allDay = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.alldayevent");
				 return oDate + " " + allDay;	}
				else {
					var timeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({
						style : "short" });
					var oTime = timeFormatter.format(oDateTime); 
				return oDate + " " + oTime;
				}
			
			}
},
	
	
	formatDate : function(date) {

		var sDate = "";
		if (date) {
			
		
			if (typeof date === "string"){
				
				if ( date.substring(0,6) === "/Date(" ){
					// for mockmode
					date = date.replace("/Date(", "").replace(")/", "");
					date = parseInt(date); // number ms
					date = new Date(date);
				}else{
					// datepicker issue -> maybe remove when fixed
				  // Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight
					// Time)
					date = new Date(date);					
				}
			} 	
			
			if (typeof date === "object") {

				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					style : "long" });
				sDate = dateFormatter.format(date);
				
			}
		}
		return sDate;
	},
	
	formatDateDay : function(date) {

		var sDate = "";
		if (date) {
			
		
			if (typeof date === "string"){
				
				if ( date.substring(0,6) === "/Date(" ){
					// for mockmode
					date = date.replace("/Date(", "").replace(")/", "");
					date = parseInt(date); // number ms
					date = new Date(date);
				}else{
					// datepicker issue -> maybe remove when fixed
				  // Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight
					// Time)
					date = new Date(date);					
				}
			} 	
			
			if (typeof date === "object") {

				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					style : "full" });
				sDate = dateFormatter.format(date);
				
			}
		}
		return sDate;
	},
	

	
	formatTime : function(datetime,bAllDay) {
		if(bAllDay) {
			// return string "All Day"
			return cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.alldayevent");
		}
		else if (datetime) {
			if (typeof datetime === "string") {
				// mock data json now "FromDate": "/Date(1356998400000)/",

				datetime = datetime.replace("/Date(", "").replace(")/", "");
				datetime = parseInt(datetime); // number ms
				datetime = new Date(datetime);

			}
			
			//
			var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
		    var pattern = locale.getTimePattern("short");
			var formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: pattern });
			var sTime = formatter.format(datetime);
			return sTime;
		}
	},
	
	formatAccountContact : function(loc, acctxt, acc, contxt,isSharedCalendar) {
		var sResult = "";
		/*sResult = loc;*/
        if(isSharedCalendar){
        	var bindingContext=this.getBindingContext().getObject();
			if(bindingContext){
			var bPrivate = this.getBindingContext().getObject().PrivatFlag;
	    	
			if(bPrivate){
				
				return "";
			}
			}
			else
				return;
				
		}
        if(loc!=="") {
        	if(acctxt!=="") {
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetails", [loc, acctxt,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContact", [loc, acctxt]);
        	}
        	else {
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetails", [loc, acc,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContact", [loc, acc]);
        	}
        } else {        	
        	if(acctxt!==""){
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutLoc", [acctxt,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContactAndLoc", [acctxt]);
        	}
        		
        	else
        		{
        		if(contxt!=="")
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutLoc", [acc,contxt]);
        		else
        			sResult=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutContactAndLoc", [acc]);
        
        		}
        }
        
		/*if(acctxt !== ""){
			sResult ? sResult = sResult + " | " + acctxt : sResult = acctxt;
			cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetails", [loc,acctxt,contxt]);
		}
		else{
			sResult ? sResult = sResult + " | " + acc : sResult = acc;
			cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.furtherDetailsWithoutLoc", [acc,contxt]);
		}
		if (contxt) {
			sResult ? sResult = sResult + " (" + contxt + ")"
					: sResult = contxt;
		}*/
		
		return sResult;
	},
	
	formatDuration : function(from, to) {
	
		if (from !== null && to !== null && from !== undefined && to !== undefined ) {
			var diffmin;
			var diffms;
		
			if (typeof from === "string") {
				from = cus.crm.mycalendar.util.Conversions.getDatefromString(from);
			}

			if (typeof to === "string") {
				to = cus.crm.mycalendar.util.Conversions.getDatefromString(to);
			}

			diffms = to.getTime() - from.getTime();

			// in minutes ->
			diffmin = Math.round(diffms / 60000);

			if (diffmin < 60) {
				var number = diffmin.toString();
				var min = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.min", number);
				return min;
			} else {
			// rule for >= 1 Hour and < 24 hours
				if (diffmin < 1440 ) { 

					var diffHalfHours = Math.round(diffmin / 30 );
					var diffHours = diffHalfHours / 2;
					var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance();
					var diffHoursLocal = numberFormatter.format(diffHours);
					number = diffHoursLocal.toString();
					var hour = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.hour", number);
				
					return hour;
				}
				else {
			// rule for > 1 day
					var days = Math.ceil(diffmin / 1440 );
					number = days.toString();
					if (days == "1") {
					var day = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.day", number);
					}
					else {
						var day = cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.duration.days", number);						
					}
					return day;
				
				}
			}
		}
	},

	
	
	getDatefromString : function(datetime) {
		// mock data json now "FromDate": "/Date(1356998400000)/",
		datetime = datetime.replace("/Date(", "").replace(")/", "");
		datetime = parseInt(datetime); // number ms
		datetime = new Date(datetime);

		return datetime;
	},	
	
	formatStatusText : function(oStatus) {
		switch(oStatus){
			case 'E0001':    // Status Open -> black
				return sap.ui.core.ValueState.Neutral;
			case 	'E0002':    // Status In Process -> black
				return sap.ui.core.ValueState.Neutral;
			case 	'E0003':    // Status Completed -> green
				return sap.ui.core.ValueState.Success;	
			case 	'E0007':    // Status Rejected -> red
				return sap.ui.core.ValueState.Error;	
			default:					// for other not specified status
				return sap.ui.core.ValueState.None;
		}
	},
	
	formatPrivateIcon : function(oPrivate) {
		if (oPrivate !== null) {
			if (oPrivate) {
				return "sap-icon://private";
			} else {
				return "sap-icon://unlocked";
			}
		}
	},
	
	formatPrivateDescription : function(oPrivate) {
		if (oPrivate !== null) {
			if (oPrivate) {
				return cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.private");
			} else {
				return "";
			}
		}
	},	
	
	formatContactTxt : function(oContactTxt) {
			if (oContactTxt) {
				var oContactLabel = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.contact") + ":\u00A0";
				return oContactLabel + oContactTxt;
			} else {
				return "";
			}
	},	
	
	formatResponsibleTxt : function(oResponsibleTxt) {
		if (oResponsibleTxt) {
			var oResponsibleLabel = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.employeeResponsible") + ":\u00A0";
			return oResponsibleLabel + oResponsibleTxt;
		} else {
			return "";
		}
	},	
	
	
	formatPhotoUrl : function(mediaUrl) {
		return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
	},
	
	 getRelativePathFromURL : function(absoluteURL){
			var url =  document.createElement('a');
			url.href = absoluteURL;
			if(url.pathname.substring(0, 1) == "/")
				return url.pathname;
			else
				return "/" + url.pathname;
		},


	urlConverter : function(value) {

		var sapServer = jQuery.sap.getUriParameters().get("sap-server");
		var sapHost = jQuery.sap.getUriParameters().get("sap-host");
		var sapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
		var sapClient = jQuery.sap.getUriParameters().get("sap-client");
		var oUriString;
							
       var oUri = URI(location.protocol + "//" + location.hostname + (location.port ? ':'+location.port: '') + cus.crm.mycalendar.util.Conversions.getRelativePathFromURL(value));
		var sCurrentProtocol = location.protocol.replace(':','');
		if (sCurrentProtocol !== oUri.protocol()) {
				oUri.protocol(sCurrentProtocol);
		}
		if (sapServer) {
			oUri.addSearch('sap-server', sapServer);
		}
		if (sapHost) {
			oUri.addSearch('sap-host', sapHost);		
		}
		if (sapHostHttp) {
			oUri.addSearch('sap-host-http', sapHostHttp);
		}
		if (sapClient) {
			oUri.addSearch('sap-client', sapClient);		
		}
		oUriString = oUri.toString();
		if (oUriString == "") {
			value = value.replace("https", "http");
			return value;
		}
		else {
			return oUri.toString();
		}
			
	},
	
	mimeTypeConverter : function(value) {

		switch (value)
		{
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			case 'application/vnd.ms-powerpoint':			
				return 'pptx';
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				return 'doc';
				break;
			case 'application/vnd.ms-excel':
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				return 'xls';
				break;			
			case 'image/jpeg':
			case 'image/png':
			case 'image/tiff':
			case 'image/gif':		
				return 'jpg';
				break;
			case 'application/pdf':	
				return 'pdf';
				break;
			case 'text/plain':	
				return 'txt';
				break;
			default:
				return 'unknown'; 	
		}
	},
	
	uploadUrlConverter : function(value) {
		value = "/sap/opu/odata/sap/CRM_APPOINTMENT_SRV" + value + "/AppointmentToAttachment";
		return value;
	},
	formatAccountText : function(sAccountTxt,sAccount){
		if(sAccountTxt !== ""){
			return sAccountTxt;
		}
		return sAccount;
	},
	
	formatTypeTxt : function(oTypeTxt) {
		if (oTypeTxt !== "") {
			var oTypeLabel = cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.TransactionType") + ":\u00A0";
			return oTypeLabel + oTypeTxt;
		} else {
			return "";
		}
	},
	
	FormatDocHistory: function (value) {
        if (value === "BUS2000111" || value === "BUS2000125" || value === "BUS2000126" || value ==="BUS2000108"){
        	return true;
        }
        else
        {
            return false;
        }
    },
	
	formatDescrType : function(oDescTxt , oTypeTxt,isSharedCalendar) {
		
		if(isSharedCalendar){
			var bindingContext=this.getBindingContext().getObject();
			if(bindingContext){
			var bPrivate = this.getBindingContext().getObject().PrivatFlag;
	    	
			if(bPrivate){
				var text=cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.privateAppointment");
				return text;
			}
			}
			else
				return;
				
		}
		
		return oDescTxt;
		
	}

};
