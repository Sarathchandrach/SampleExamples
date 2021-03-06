/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

jQuery.sap.declare("hcm.emp.myleaverequests.utils.Formatters");

hcm.emp.myleaverequests.utils.Formatters = (function() {

	return {

		init : function(resourseBundle) {

			this.resourceBundle = resourseBundle;
		},

		getDate : function(oValue) {

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return null;
				if (oValue.length < 8)
					return null;
				if (oValue.substring(0, 6) != "/Date("
						|| oValue.substring(oValue.length - 2, oValue.length) != ")/") {
					return null;
				}
				var dateValue = oValue.substring(6, 6 + oValue.length - 8);
				oDate = new Date();
				oDate.setTime(dateValue * 1);
			}

			return oDate;
		},

		stripDecimals : function(sNumber) {

			while (sNumber.length > 0 && sNumber.charAt(0) == "0") {
				sNumber = sNumber.substring(1, 1 + sNumber.length - 1);
			}

			var pos = sNumber.indexOf(".");
			if (pos < 0) {
				if (sNumber.length < 1)
					return "0";
				return sNumber;
			}

			while (sNumber.charAt(sNumber.length - 1) == "0") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}
			if (sNumber.charAt(sNumber.length - 1) == ".") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}

			if (sNumber.length < 1)
				return "0";

			if (sNumber.length > 0 && sNumber.charAt(0) == ".") {
				return "0" + sNumber;
			}

			return sNumber;
		},

		adjustSeparator : function(number) {

			try {
				if (!isNaN(parseFloat(number)) && isFinite(number)) {
					var numberFormatter = sap.ca.ui.model.format.NumberFormat
							.getInstance();
					if(number.indexOf(".")>0)//truncating decimals only if they exist
					numberFormatter.oFormatOptions.decimals=2;
					return numberFormatter.format(number);
				}
			} catch (e) {
			}
			return "";
		},

		// format date MMMyyyy
		DATE_ODATA_MMMyyyy : function(oValue) {

			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
						.getInstance({
							pattern : "MMM yyyy"
						});

				return oDateFormat.format(oDate,true);
			} else {
				return null;
			}
		},

		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyy : function(oValue, sStyle) {

			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				if (sStyle) {
					var oDateFormat = sap.ca.ui.model.format.DateFormat
							.getInstance({
								style : sStyle
							});
					return oDateFormat.format(oDate,true);
				} else {
					if (jQuery.device.is.phone === true) {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "medium"
								});
						return oDateFormat.format(oDate,true);
					} else {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "medium"
								});
						return oDateFormat.format(oDate,true);
					}
					;
				}
				;
			} else {
				return null;
			}
		},


		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyyLong : function(oValue, sStyle) {

			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				if (sStyle) {
					var oDateFormat = sap.ca.ui.model.format.DateFormat
							.getInstance({
								style : sStyle
							});
					return oDateFormat.format(oDate,true);
				} else {
					if (jQuery.device.is.phone === true) {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "long"
								});
						return oDateFormat.format(oDate,true);
					} else {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "full"
								});
						return oDateFormat.format(oDate,true);
					}
					;
				}
				;
			} else {
				return null;
			}
		},
		
		// format date ddMMMyyyy
		DATE_ODATA_ddMMMyyyy : function(oValue) {
			var oDate = hcm.emp.myleaverequests.utils.Formatters
					.getDate(oValue);

			if (oDate != null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
						.getInstance({
							pattern : "dd.MM.yyyy"
						});
				return oDateFormat.format(oDate,true);
			} else {
				return null;
			}
		},

		// format date YYYYMMdd
		DATE_YYYYMMdd : function(oDate) {

			if (oDate == undefined)
				return "";

			var oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
				pattern : "YYYY-MM-dd"
			});

			return oDateFormat.format(oDate);
		},

		BALANCE : function(oValue) {

			if (oValue == undefined)
				return "";

			if (typeof oValue != 'string' && !(oValue instanceof String))
				return "";

			return hcm.emp.myleaverequests.utils.Formatters
					.adjustSeparator(hcm.emp.myleaverequests.utils.Formatters
							.stripDecimals(oValue));
		},
		
		//return duration Hours in 00:00 format 
        DURATION_FORMAT : function(sHours)
        {
            if(sHours.indexOf(".")>-1){
             var duration = sHours.split(".");
             var hours = duration[0].toString();
             if(parseInt(duration[1])<10) duration[1]=parseInt(duration[1])*10;
             var minutes = (parseInt(duration[1])*60)/100 ;
             minutes = Math.round(minutes);
             minutes = minutes.toString();
         if (minutes<10)minutes = "0"+minutes;
         return hours+":"+minutes;
           }else
         return sHours+":00";
               
        },
        
		// return duration days or hours depending on input
		DURATION : function(sDays, sHours) {

			if (sDays == undefined || sHours == undefined)
				return "";

			sDays = hcm.emp.myleaverequests.utils.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return hcm.emp.myleaverequests.utils.Formatters
						.adjustSeparator(sDays);

			return hcm.emp.myleaverequests.utils.Formatters.DURATION_FORMAT(hcm.emp.myleaverequests.utils.Formatters.stripDecimals(sHours));
		},

		// determine duration unit based on leave time range
		DURATION_UNIT : function(sDays, sHours) {

			if (sDays == undefined || sHours == undefined)
				return "";

			sDays = hcm.emp.myleaverequests.utils.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return (sDays * 1 != 1) ? hcm.emp.myleaverequests.utils.Formatters.resourceBundle
						.getText("LR_DAYS")
						: hcm.emp.myleaverequests.utils.Formatters.resourceBundle
								.getText("LR_DAY");

			return (sHours * 1 != 1) ? hcm.emp.myleaverequests.utils.Formatters.resourceBundle
					.getText("LR_HOURS")
					: hcm.emp.myleaverequests.utils.Formatters.resourceBundle.getText("LR_HOUR");
		},

		// check leave time range whether below 1 day
		isHalfDayLeave : function(sDays) {

			if (sDays == undefined)
				return false;

			sDays = hcm.emp.myleaverequests.utils.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return false;

			return true;
		},

		// time formatter
		TIME_hhmm : function(oValue) {

			if (oValue == undefined)
				return "";

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else if (oValue.ms) {
				var hours = (oValue.ms / (3600 * 1000)) | 0;
				var minutes = ((oValue.ms - (hours * 3600 * 1000)) / (60 * 1000)) | 0;
				var seconds = ((oValue.ms - (hours * 3600 * 1000) - (minutes * 60 * 1000)) / 1000) | 0;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return "";
				if (oValue.length != 11)
					return "";
				if (oValue.substring(0, 2) != "PT"
						|| oValue.substring(4, 5) != "H"
						|| oValue.substring(7, 8) != "M"
						|| oValue.substring(10, 11) != "S") {
					return "";
				}
				var hours = oValue.substring(2, 4) * 1;
				var minutes = oValue.substring(5, 7) * 1;
				var seconds = oValue.substring(8, 10) * 1;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			}

			var oDateFormat = sap.ca.ui.model.format.DateFormat
					.getTimeInstance({
						style : "short"
					});
			var sTime = oDateFormat.format(oDate);
			var aTimeSegments = sTime.split(":");
			var sAmPm = "";
			var lastSeg = aTimeSegments[aTimeSegments.length - 1];

			// chop off seconds
			// check for am/pm at the end
			if (isNaN(lastSeg)) {
				var aAmPm = lastSeg.split(" ");
				// result array can only have 2 entries
				aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
				sAmPm = " " + aAmPm[1];
			}
			return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);

		},

		// format date and time in format EEEdMMMyyyy
		FORMAT_DATETIME : function(sPrefix, oValue) {

			return sPrefix
					+ " "
					+ hcm.emp.myleaverequests.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyy(oValue);
		},

		// history view date and label formatters: related dates are the ones
		// from an original leave request
		// where a change request has been submitted

		// header label indicating cancel or change request pending
		FORMATTER_INTRO : function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			}
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType == "2") {
				if (sStatusCode == "SENT") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType == "3") {
				if (sStatusCode == "SENT") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return hcm.emp.myleaverequests.utils.Formatters.resourceBundle
							.getText("LR_CANCEL_DONE");
				}
			}
			return "";
		},

		// format end date
		FORMAT_ENDDATE : function(sHyphen, sWorkingDaysDuration, sStartTime,
				sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
						&& sEndTime) {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(sWorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(sStartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyy(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		
	// format end date
		FORMAT_ENDDATE_LONG : function(sHyphen, sWorkingDaysDuration, sStartTime,
				sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
						&& sEndTime) {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(sWorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(sStartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyyLong(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		// visibility setter for original/changed date range labels
		SET_RELATED_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2";
		},

		SET_RELATED_START_DATE_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined;
		},

		// format related start date
		FORMAT_RELATED_START_DATE : function(aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined) {
				try {
					return hcm.emp.myleaverequests.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].StartDate);
				} catch (e) {
				}
			}
			return "";
		},

		FORMAT_RELATED_START_DATE_LONG : function(aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined) {
				try {
					return hcm.emp.myleaverequests.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].StartDate);
				} catch (e) {
				}
			}
			return "";
		},
		
		// set related end date from change request visible if available
		SET_RELATED_END_DATE_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined
					&& aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined
					&& (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration) || aRelatedRequests[0].WorkingDaysDuration * 1 != 1);
		},

		// format related end date
		FORMAT_RELATED_END_DATE : function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined) {
				try {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(aRelatedRequests[0].StartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].EndDate);
					}
				} catch (e) {
				}
			}
			return "";
		},
		
		FORMAT_RELATED_END_DATE_LONG : function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined) {
				try {
					if (hcm.emp.myleaverequests.utils.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return hcm.emp.myleaverequests.utils.Formatters
								.TIME_hhmm(aRelatedRequests[0].StartTime)
								+ " "
								+ sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters
										.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].EndDate);
					}
				} catch (e) {
				}
			}
			return "";
		},

		State : function(status) {
			status = status.toLowerCase();
			switch (status) {
			case "sent":
				return null;
				break;
			case "posted":
				return "Success";
				break;
			case "approved":
				return "Success";
				break;
			case "rejected":
				return "Error";
				break;
			default:
				return null;
			}
			;

		},
		
		/**
		 * Adds BalanceUsedQuantity, BalanceApprovedQuantity & BalanceRequestedQuantity
		 * @param {String} BalanceUsedQuantity
		 * @param {String} BalanceApprovedQuantity
		 * @param {String} BalanceRequestedQuantity
		 * @return {String} totalUsed
		 */
		calculateUsed : function(BalanceUsedQuantity, BalanceApprovedQuantity,BalanceRequestedQuantity){
			var sBalanceTotalUsedQuantity = parseFloat(BalanceUsedQuantity) + parseFloat(BalanceApprovedQuantity) + parseFloat(BalanceRequestedQuantity);
			sBalanceTotalUsedQuantity = hcm.emp.myleaverequests.utils.Formatters.BALANCE(sBalanceTotalUsedQuantity.toString());
			return sBalanceTotalUsedQuantity;
		}

	};

}());
