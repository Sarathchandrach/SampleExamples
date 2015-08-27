/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.util.CalendarServices");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

hcm.mgr.approve.leaverequests.util.CalendarServices = (function() {

    "use strict";
    var oCurrRequestParam = {}, oCalData = {}, oAppModel = null, sCalStartDate = null,
        oCalModel = new sap.ui.model.json.JSONModel(oCalData);
    oCurrRequestParam.RequestID = "4711";
    oCurrRequestParam.ReqOrigin = "";
    oCurrRequestParam.StartDate = "1970-01-01T00:00:00";
    oCurrRequestParam.EndDate = "1970-01-01T00:00:00";

    return {

        checkLoadRequired: function(oReqStartDate, oReqEndDate) {

            var oReqStartMS = oReqStartDate.getTime(),
                oReqEndMS = oReqEndDate.getTime(),
                calData = oCalModel.getData(),
                oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss"
                }),
                oDataStart = calData[oCurrRequestParam.RequestID].range.StartDate,
                oDataEnd = calData[oCurrRequestParam.RequestID].range.EndDate,
                oDataStartMS = oDateFormat.parse(oDataStart).getTime(),
                oDataEndMS = oDateFormat.parse(oDataEnd).getTime(),
                oDataStatus = {};
            oDataStatus.bLoadReq = false;
            oDataStatus.bLoadBefore = false;
            oDataStatus.StartDate = oDataStart;
            oDataStatus.EndDate = oDataEnd;

            if (!calData[oCurrRequestParam.RequestID]) {
                // ideally does not happen
                return;
            }
            // evaluate cases
            if (oReqStartMS > oDataStartMS && oReqEndMS < oDataEndMS) {
                oDataStatus.bLoadReq = false;
                oDataStatus.bLoadBefore = false;
            } else if (oReqEndMS > oDataEndMS) {
                oDataStatus.bLoadReq = true;
                oDataStatus.bLoadBefore = false;
            } else if (oReqStartMS < oDataStartMS) {
                oDataStatus.bLoadReq = true;
                oDataStatus.bLoadBefore = true;
            } else {
                oDataStatus.bLoadReq = false;
                oDataStatus.bLoadBefore = false;
            }

            return oDataStatus;
        },

        getTimeframe: function(oValue, bExtendBefore) {
            var oDateRange = {},
                oStartDate = new Date(),
                oEndDate = new Date(),
                oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss"
                }),
                oDate,
                oMS,
                oStartMS,
                oEndMS;

            oDateRange.StartDate = "1970-01-01T00:00:00";
            oDateRange.EndDate = "1970-01-01T00:00:00";

            if (oValue instanceof Date) {
                oDate = oValue;
            } else if (typeof oValue === "string") {
                oDate = oDateFormat.parse(oValue);
            } else {
                return;
            }

            // correction for timezone
            oMS = oDate.getTime();

            if (bExtendBefore === null) {
                // subtract 1 week for start / add 3 weeks for end
                oMS = oDate.getTime();
                oStartMS = oMS - (7 * 24 * 60 * 60 * 1000); // +
                // oTimezoneOffset;
                oEndMS = oMS + (21 * 24 * 60 * 60 * 1000); // +
                // oTimezoneOffset;
                oStartDate.setTime(oStartMS);
                oEndDate.setTime(oEndMS);

                oDateRange.StartDate = oDateFormat.format(oStartDate, false);
                oDateRange.EndDate = oDateFormat.format(oEndDate, false);
            } else if (bExtendBefore === false) {
                // add another 2 weeks to the existing data in the future -
                // timezone offset missing

                oDateRange.StartDate = oValue;

                oMS = oDate.getTime();
                oEndMS = oMS + (14 * 24 * 60 * 60 * 1000);
                oEndDate.setTime(oEndMS);
                oDateRange.EndDate = oDateFormat.format(oEndDate, false);

            } else if (bExtendBefore === true) {
                // add another 2 weeks to the existing data in the past-
                // timezone offset missing

                oDateRange.EndDate = oValue;

                oMS = oDate.getTime();
                oStartMS = oMS - (14 * 24 * 60 * 60 * 1000);
                oStartDate.setTime(oStartMS);
                oDateRange.StartDate = oDateFormat.format(oStartDate, false);
            }

            return oDateRange;

        },

        readCalData: function(sRequestID, oDate, bExtendBefore, sOrigin) {

            // para1: sRequestID (if provided: 'no extend' case
            // para2: sDate (only considered if 'no extend' case)
            // para3: bBefore: 'extend' case - direction considered for calc of
            // new daterange
            var sCalUrl, oThisDateRange, checkCalData, sOriginInfix, thisCalData, collection, calData, sRefDate;
            var oRequestedData = null;

            if (bExtendBefore === null) {
                // calendar should exchange its data (new leadselection in
                // list)
                oCurrRequestParam.RequestID = sRequestID;
                oCurrRequestParam.ReqOrigin = sOrigin;
                oThisDateRange = this.getTimeframe(oDate, null);

                oCurrRequestParam.RequestID = sRequestID;
                oCurrRequestParam.StartDate = oThisDateRange.StartDate;
                oCurrRequestParam.EndDate = oThisDateRange.EndDate;

                // check if data (requestID) is already available:
                checkCalData = oCalModel.getData();
                if (!checkCalData[oCurrRequestParam.RequestID]) {

                    sOriginInfix = oCurrRequestParam.ReqOrigin ? "',SAP__Origin='" + oCurrRequestParam.ReqOrigin : "";
                    sCalUrl = "/TeamCalendarHeaderCollection(StartDate=datetime'" + oCurrRequestParam.StartDate + "',EndDate=datetime'" + oCurrRequestParam.EndDate + "',RequestID='" + oCurrRequestParam.RequestID + sOriginInfix + "',FilterLeaves=false)";

                    if (oAppModel) {
                        oAppModel.read(sCalUrl, undefined, ["$expand=TeamCalendar"], false,
                            function(oData) {
                                oRequestedData = oData;
                            });
                    }

                    // create CalData
                    thisCalData = oCalModel.getData();
                    thisCalData[oCurrRequestParam.RequestID] = {};
                    thisCalData[oCurrRequestParam.RequestID].range = {};
                    thisCalData[oCurrRequestParam.RequestID].range.StartDate = oCurrRequestParam.StartDate;
                    thisCalData[oCurrRequestParam.RequestID].range.EndDate = oCurrRequestParam.EndDate;
                    thisCalData[oCurrRequestParam.RequestID].events = [];

                    if (oRequestedData) {
                        collection = oRequestedData.TeamCalendar.results;

                        thisCalData[oCurrRequestParam.RequestID].events = collection;

                        oCalModel.setData(thisCalData);
                    } else {
                        return;
                    }

                }
            } else {
                // read in the past or in the future and extend existing model
                // check existing range from model
                calData = oCalModel.getData();
                if (calData[oCurrRequestParam.RequestID]) {

                    if (bExtendBefore) {
                        sRefDate = calData[oCurrRequestParam.RequestID].range.StartDate;
                        // calculate new dates and set to the model
                        oThisDateRange = this.getTimeframe(sRefDate,
                            bExtendBefore);
                        calData[oCurrRequestParam.RequestID].range.StartDate = oThisDateRange.StartDate;

                    } else {
                        sRefDate = calData[oCurrRequestParam.RequestID].range.EndDate;
                        // calculate new dates and set to the model
                        oThisDateRange = this.getTimeframe(sRefDate,
                            bExtendBefore);
                        calData[oCurrRequestParam.RequestID].range.EndDate = oThisDateRange.EndDate;
                    }

                    oCurrRequestParam.StartDate = oThisDateRange.StartDate;
                    oCurrRequestParam.EndDate = oThisDateRange.EndDate;

                }

                sOriginInfix = oCurrRequestParam.ReqOrigin ? "',SAP__Origin='" + oCurrRequestParam.ReqOrigin : "";
                sCalUrl = "/TeamCalendarHeaderCollection(StartDate=datetime'" + oCurrRequestParam.StartDate + "',EndDate=datetime'" + oCurrRequestParam.EndDate + "',RequestID='" + oCurrRequestParam.RequestID + sOriginInfix + "',FilterLeaves=false)";

                if (oAppModel) {
                    oAppModel.read(sCalUrl, undefined, ["$expand=TeamCalendar"], false,
                        function(oData) {
                            oRequestedData = oData;
                        });
                }

                if (oRequestedData) {
                    collection = oRequestedData.TeamCalendar.results;
                    for (var i = 0; i < collection.length; i++) {
                        calData[oCurrRequestParam.RequestID].events.push(collection[i]);
                    }
                    oCalModel.setData(calData);
                } else {
                    return;
                }
            }

        },

        setAppModel: function(model) {
            if (model) {
                oAppModel = model;
            }
        },

        getAppModel: function() {
            return oAppModel;
        },

        getLeadRequestID: function() {
            return oCurrRequestParam.RequestID;
        },

        getCalModel: function() {
            return oCalModel;
        },

        clearCalData: function() {
            // clear calendar buffer (necessary because calendar entries
            // become outdated after approval/decline...)
            // create CalData
            var initCalData = {};

            oCalModel.setData(initCalData);
        },

        setCalStartDate: function(oDate) {
            var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd'T'HH:mm:ss"
            });
            sCalStartDate = oDateFormat.format(oDate, false);
        },

        getCalStartDate: function() {
            return sCalStartDate;
        },

        setDateType: function(oValue) {

            var oDate = null;
            var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd'T'HH:mm:ss"
            });

            if (oValue instanceof Date) {
                oDate = hcm.mgr.approve.leaverequests.util.Conversions.revertTimezoneOffset(oValue);
            } else if (typeof oValue === "string") {
                // expects  mockdata(json) with format "2013-07-15T00:00:00"
                oDate = oDateFormat.parse(oValue);
            }

            return oDate;

        }


    };

}());