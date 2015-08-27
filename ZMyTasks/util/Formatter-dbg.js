/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Util");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
cus.crm.mytasks.util.Formatter = {
	I18N_MODEL_NAME : "cus.crm.mytasks.i18n",
	EDM_STRING : "Edm.String",
	EDM_GUID : "Edm.Guid",
	getResourceBundle : function() {
		if (!this.oBundle) {
			var oConfig = cus.crm.mytasks.util.AppConfig.getConfiguration();
			jQuery.sap.log
					.warning("Creating ResBundle for formatter on the fly, but it should have been injected beforehand!");
			if (oConfig.isDebug) {
				console.trace();
			}
			var i18n = sap.ui.getCore().getModel(
					cus.crm.mytasks.util.Formatter.I18N_MODEL_NAME);
			cus.crm.mytasks.util.Util.logObjectToConsole("i18n model", i18n);
			if (i18n) {
				this.oBundle = i18n.getResourceBundle();
			} else {
				jQuery.sap.require("jquery.sap.resources");
				this.oBundle = jQuery.sap.resources({
					url : "i18n/i18n.properties"
				});
			}
		}
		return this.oBundle;
	},

	showPriorityStatus : function(priority, completed) {
		var highestPrio = cus.crm.mytasks.util.PriorityListUtil
				.getHighestPrio();
		return ((highestPrio == priority) && !completed) ? "Warning" : "None";
	},

	getPriorityIcon : function(priority, completed) {
		var highestPrio = cus.crm.mytasks.util.PriorityListUtil
				.getHighestPrio();
		return ((highestPrio == priority) && !completed) ? "sap-icon://warning"
				: "";
	},

	showDueDateInDays : function(dueDate, completed) {
		if ((dueDate == null) || completed) {
			return "";
		}
		var oBundle = cus.crm.mytasks.util.Formatter.getResourceBundle();

		var oNow = cus.crm.mytasks.util.Formatter.getCurrentDate();
		var oThen = cus.crm.mytasks.util.Formatter.parseDate(dueDate);

		var daysDiff = cus.crm.mytasks.util.Formatter
				.getDiffInDays(oNow, oThen);

		var oResult;
		if (0 == daysDiff) {
			oResult = oBundle.getText("LIST_DUE_DATE_TODAY");
		} else if (1 == daysDiff) {
			oResult = oBundle.getText("LIST_DUE_DATE_TOMORROW");
		} else if (-1 == daysDiff) {
			oResult = oBundle.getText("LIST_DUE_DATE_YESTERDAY");
		} else if (daysDiff < 0) {
			oResult = oBundle
					.getText("LIST_DUE_DATE_X_DAYS_AGO", [ -daysDiff ]);
		} else if (daysDiff > 0) {
			oResult = oBundle.getText("LIST_DUE_DATE_IN_X_DAYS", [ daysDiff ]);
		} else {
			oResult = "";
		}
		return oResult;
	},

	showDueDateStatus : function(dueDate, completed) {
		var status;
		if ((dueDate == null) || completed) {
			status = "Success";
		} else {
			var oNow = cus.crm.mytasks.util.Formatter.getCurrentDate();
			var oThen = cus.crm.mytasks.util.Formatter.parseDate(dueDate);

			var daysDiff = cus.crm.mytasks.util.Formatter.getDiffInDays(oNow,
					oThen);

			status = daysDiff < 0 ? "Warning" : "None";
		}
		return status;
	},

	getCurrentDate : function() {
		var oCurrentDate = new Date();
		return oCurrentDate;
	},

	showTaskTitle : function(description, id) {
		var title;
		if (!id || ("" === id)) {
			var oBundle = cus.crm.mytasks.util.Formatter.getResourceBundle();
			title = oBundle.getText("NEW_TASK_PAGE_TITLE");
		} else {
			title = description;
		}
		return title;
	},

	getDateEndOfTheWeek : function() {
		var today = cus.crm.mytasks.util.Formatter.getCurrentDate();
		var diffToSun = (7 - today.getDay()) % 7;
		var endOfTheWeek = new Date(today);
		endOfTheWeek.setDate(today.getDate() + diffToSun);
		return endOfTheWeek;
	},

	parseDate : function(datestring) {
		if (datestring == null) {
			return null;
		}
		if (datestring instanceof Date) {
			return datestring;
		} else {
			var year = datestring.substring(0, 4);
			var month = datestring.substring(4, 6);
			var day = datestring.substring(6, 8);

			var oDueDate = new Date(year, month, day);
			return oDueDate;
		}
	},

	getPrivacyIcon : function(privacyFlag) {
		var icon = "";

		// if (privacyFlag) {
		// icon = "sap-icon://locked";
		// }
		return icon;
	},

	getDiffInDays : function(oDate1orig, oDate2orig) {
		if (!oDate1orig || !oDate2orig) {
			return undefined;
		}
		var oDate1 = new Date(oDate1orig.getTime());
		var oDate2 = new Date(oDate2orig.getTime());

		cus.crm.mytasks.util.Formatter.eraseTime(oDate1);
		cus.crm.mytasks.util.Formatter.eraseTime(oDate2);

		var daysDiff = Math.round((oDate2.getTime() - oDate1.getTime())
				/ (1000 * 60 * 60 * 24));

		return daysDiff;
	},

	eraseTime : function(oDate) {
		oDate.setHours(0);
		oDate.setMinutes(0);
		oDate.setSeconds(0);
		oDate.setMilliseconds(0);
	},

	listType : function(completed) {
		return completed ? sap.m.ListType.Inactive : sap.m.ListType.Navigation;
	},

	formatDate : function(date) {
		var sDate = "";
		if (date) {
			if (typeof date === "string") {
				if (date.substring(0, 6) === "/Date(") {
					// for mockmode
					date = date.replace("/Date(", "").replace(")/", "");
					date = parseInt(date); // number ms
					date = new Date(date);
				} else {
					// datepicker issue -> maybe remove when fixed
					// Wed Sep 18 2013 00:00:00 GMT+0200 (W. Europe Daylight
					// Time)
					date = new Date(date);
				}
			}
			if (typeof date === "object") {
				var dateFormatter = cus.crm.mytasks.util.Formatter
						.getDateFormatter();
				sDate = dateFormatter.format(date);
			}
		}
		return sDate;
	},

	parseLongDate : function(dateString) {
		var dateFormatter = cus.crm.mytasks.util.Formatter.getDateFormatter();
		var oDate;
		try {
			oDate = dateFormatter.parse(dateString);
		} catch (oError) {
			oDate = null;
		}
		return oDate;
	},

	getDateFormatter : function(dateString) {
		var dateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
			style : "long"
		});
		return dateFormatter;
	},

	logoUrlFormatter : function(oPhoto) {
		return oPhoto && oPhoto.__metadata && oPhoto.__metadata.media_src ? oPhoto.__metadata.media_src
				: "sap-icon://factory";
	},

	photoUrlFormatter : function(oPhoto) {
		return oPhoto && oPhoto.__metadata && oPhoto.__metadata.media_src ? oPhoto.__metadata.media_src
				: "sap-icon://person-placeholder";
	},

	showTitleInMainList : function(description, completed) {
		return completed ? "\u2714 " + description : description;
	},

	getContactF4Description : function(accountName, functionName) {
		var description = cus.crm.mytasks.util.Formatter
				.combine2AttributesIntoOneString(accountName, functionName,
						"DETAILS_VALUE_HELP_CON_DESCR");
		return description;
	},

	getAccountF4Descriptionold : function(city, country) {
		var description = cus.crm.mytasks.util.Formatter
				.combine2AttributesIntoOneString(city, country,
						"DETAILS_VALUE_HELP_ACC_DESCR");
		return description;
	},
	getAccountF4Description : function(city, country, accountID) {
		var sComboCityCountry = cus.crm.mytasks.util.Formatter
				.combine2AttributesIntoOneString(city, country,
						"DETAILS_VALUE_HELP_ACC_DESCR");
		return sComboCityCountry && sComboCityCountry != "" ? accountID
				&& accountID != "" ? accountID + " / " + sComboCityCountry
				: sComboCityCountry : accountID && accountID != "" ? accountID
				: "";
	},
	getAccountF4Title : function(fullName) {
		return fullName ? fullName : " ";
	},

	combine2AttributesIntoOneString : function(attr1, attr2, i18nTemplateKey) {
		var oBundle = cus.crm.mytasks.util.Formatter.getResourceBundle();
		var isAttr1 = attr1 && attr1.length > 0;
		var isAttr2 = attr2 && attr2.length > 0;
		return isAttr1 && isAttr2 ? oBundle.getText(i18nTemplateKey, [ attr1,
				attr2 ]) : isAttr1 ? attr1 : isAttr2 ? attr2 : "";
	},

	formatBusinessPartner : function(sName, sId) {
		return sName ? sName : sId;
	},

	showCurrentPriority : function(sPrioKey) {
		var oCUU = cus.crm.mytasks.util.Util, aPrioList = oCUU
				.getCustomizingModel().getProperty("/priolist");
		if (!Array.isArray(aPrioList))
			return "";
		else {
			var sTextToReturn = "";
			for ( var i = 0, j = aPrioList.length; i < j; i++)
				if (aPrioList[i]["Priority"] === sPrioKey) {
					sTextToReturn = aPrioList[i]["TxtLong"];
					break;
				}
			return sTextToReturn;
		}
	},

	showPrivacyFlag : function(bIsPrivate) {
		return bIsPrivate ? "sap-icon://private" : "";
	},

	formatOverviewField : function(sI18NText, oParamA, oParamB) {
		var oCUF = cus.crm.mytasks.util.Formatter, oDF = oCUF
				.getDateFormatter(), sTextToReturn = "", oRB = oCUF
				.getResourceBundle();
		switch (sI18NText) {
		case oRB.getText("S4_TASK_DUEDATE"):
			sTextToReturn = jQuery.type(oParamA) === "date" ? oRB.getText(
					"S4_TASK_DUEDATE", [ oDF.format(oParamA) ]) : "";
			break;
		default:
			sTextToReturn = oParamA && oParamA !== "" ? jQuery.sap
					.formatMessage(sI18NText, [ oParamA ]) : oParamB
					&& oParamB !== "" ? jQuery.sap.formatMessage(sI18NText,
					[ oParamB ]) : "";
			break;
		}
		return sTextToReturn;
	},

	formatAttachmentURL : function(sValue) {
		var oUriParams = jQuery.sap.getUriParameters(), sSapServer = oUriParams
				.get("sap-server"), sSapHost = oUriParams.get("sap-host"), sSapHostHttp = oUriParams
				.get("sap-host-http"), sSapClient = oUriParams
				.get("sap-client"), sCurrentProtocol = location.protocol
				.replace(':', '');

		var sReturnString = URI([ location.protocol, location.hostname ]
				.join("//")
				+ (location.port ? ':' + location.port : '')
				+ cus.crm.mytasks.util.Formatter.getRelativePathFromURL(sValue));
		if (sCurrentProtocol !== sReturnString.protocol())
			sReturnString.protocol(sCurrentProtocol);

		if (sSapServer)
			sReturnString.addSearch('sap-server', sSapServer);
		if (sSapHost)
			sReturnString.addSearch('sap-host', sSapHost);
		if (sSapHostHttp)
			sReturnString.addSearch('sap-host-http', sSapHostHttp);
		// if (sSapClient)
		// sReturnString.addSearch('sap-client', sSapClient);

		return sReturnString.toString();
	},

	getRelativePathFromURL : function(absoluteURL) {
		var url = document.createElement('a');
		url.href = absoluteURL;
		if (url.pathname.substring(0, 1) == "/")
			return url.pathname;
		else
			return "/" + url.pathname;
	},

	formatMimeType : function(sValue) {
		switch (sValue) {
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return 'pptx';
		case 'application/vnd.ms-powerpoint':
			return 'ppt';
		case 'application/vnd.openxmlformats-officedocument.presentationml.template':
			return 'potx';
		case 'application/msword':
			return 'doc';
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'docx';
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
			return 'dotx';
		case 'text/csv':
			return 'csv';
		case 'application/vnd.ms-excel':
			return 'xls';
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return 'xlsx';
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
			return 'xltx';
		case 'application/pdf':
			return 'pdf';
		case 'application/xhtml+xml':
			return 'xhtml';
		case 'application/zip':
			return 'zip';
		case 'application/gzip':
			return 'gzip';
		case 'video/avi':
			return 'avi';
		case 'video/mpeg':
			return 'mpeg';
		case 'video/mp4':
			return 'mp4';
		case 'text/html':
			return 'html';
		case 'text/plain':
			return 'txt';
		case 'text/xml':
			return 'xml';
		case 'image/gif':
			return 'gif';
		case 'image/jpeg':
			return 'jpg' || 'jpeg';
		case 'image/pjpeg':
			return 'pjpeg';
		case 'image/png':
			return 'png';
		case 'image/bmp':
			return 'bmp';
		case 'image/tiff':
			return 'tif' || 'tiff';
		case 'audio/mpeg3':
			return 'mp3';
		case 'audio/x-ms-wmv':
			return 'wmv';
		case 'application/octet-stream':
		default:
			return '';
		}
	},

};