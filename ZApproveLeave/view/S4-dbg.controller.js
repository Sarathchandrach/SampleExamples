/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.CalendarServices");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mgr.approve.leaverequests.view.S4", {

	extHookChangeFooterButtons: null,
	
    onInit: function() {

        "use strict";
        this.oView = this.getView();
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.detailContextPath = "";

        this.oRouter.attachRouteMatched(function(oEvent) {

            if (oEvent.getParameter("name") === "calendar") {

                var sReqStartDate, sRequestId, sOrigin, oStartDate, contextPath;

                sRequestId = oEvent.getParameter("arguments").RequestId;
                sOrigin = oEvent.getParameter("arguments").SAP__Origin;
                contextPath = "/LeaveRequestDetailsCollection(SAP__Origin='" + sOrigin + "',RequestId='" + sRequestId + "',CalculateOverlaps=1)";
                
                this.detailContextPath = "LeaveRequestCollection(SAP__Origin='" + sOrigin + "',RequestId='" + sRequestId + "')";
                this.oView.bindElement(contextPath);

                sReqStartDate = new Date();
                sReqStartDate.setTime(oEvent.getParameter("arguments").StartDate);
                oStartDate = hcm.mgr.approve.leaverequests.util.CalendarServices.setDateType(sReqStartDate);
                hcm.mgr.approve.leaverequests.util.CalendarServices.setCalStartDate(oStartDate);

                //set model to the calendar
                if (!hcm.mgr.approve.leaverequests.util.CalendarServices.getAppModel()) {
                    hcm.mgr.approve.leaverequests.util.CalendarServices.setAppModel(this.oDataModel);
                }

                //clear calendar data - since every
                // refresh/approve/reject could outdate the data
                hcm.mgr.approve.leaverequests.util.CalendarServices.clearCalData();

                jQuery.sap.delayedCall(5, undefined, jQuery.proxy(function() {
                    hcm.mgr.approve.leaverequests.util.CalendarServices.readCalData(sRequestId, sReqStartDate, null, sOrigin);
                    //call controller to set context
                    this._onShow(sRequestId);
                }, this));

            }
        }, this);

        var oCalendar2 = this.byId("OverlapCalendar2"),
            oLegend = this.byId("CalenderLegend");
        if (oCalendar2) {
            oCalendar2.setModel(hcm.mgr.approve.leaverequests.util.CalendarServices.getCalModel());
        }

        if (jQuery.device.is.phone) {
            // default: 2 weeks
            oCalendar2.setWeeksPerRow(1);
        }

        if (oLegend) {
            oLegend.setLegendForNormal(this.resourceBundle.getText("view.Calendar.LegendWorkingDay"));
            oLegend.setLegendForType00(this.resourceBundle.getText("view.Calendar.LegendDayOff"));
            oLegend.setLegendForType01(this.resourceBundle.getText("view.Calendar.LegendApproved"));
            oLegend.setLegendForType04(this.resourceBundle.getText("view.Calendar.LegendPending"));
            oLegend.setLegendForType06(this.resourceBundle.getText("view.Calendar.LegendHoliday"));
            oLegend.setLegendForType07(this.resourceBundle.getText("view.Calendar.LegendDeletionRequested"));
            oLegend.setLegendForToday(this.resourceBundle.getText("view.Calendar.LegendToday"));
        }
    },

    /**
     * @private [_onShow handler for calendar display]
     * @param  {[type]} RequestID
     * @return {[type]}
     */
    _onShow: function(RequestID) {
        "use strict";
        var oCalendar2, sPath, eventTemplate;
        oCalendar2 = this.byId("OverlapCalendar2");

        if (oCalendar2) {
            // bind aggregation
            sPath = "/" + RequestID + "/events";
            eventTemplate = new sap.me.OverlapCalendarEvent({
                row: "{Order}",
                type: "{LegendType}",
                typeName: "{AbsenceType}",
                name: "{EmployeeName}"
            });

            eventTemplate.bindProperty("halfDay", {
                parts: [{
                    path: "AllDayFlag"
                }],
                formatter: function(bAllDayFlag) {
                    var bReturn = false;
                    if (!bAllDayFlag) {
                        bReturn = true;
                    }
                    return bReturn;
                }
            });

            // start date
            eventTemplate.bindProperty("startDay", {
                parts: [{
                    path: "StartDate"
                }],
                formatter: hcm.mgr.approve.leaverequests.util.Conversions.convertLocalDateToUTC
            });

            // end date
            eventTemplate.bindProperty("endDay", {
                parts: [{
                    path: "EndDate"
                }],
                formatter: hcm.mgr.approve.leaverequests.util.Conversions.convertLocalDateToUTC
            });

            oCalendar2.bindAggregation("calendarEvents", sPath, eventTemplate);
            oCalendar2.setStartDate(hcm.mgr.approve.leaverequests.util.CalendarServices.getCalStartDate());
        }
    },

    /**
     * @private [_onEndOfData End of Data handler]
     * @param  {[type]} oEvt
     * @return {[type]}
     */
    _onEndOfData: function(oEvt) {
        "use strict";
        // commented - loading is handled in onChangeDate
    },

    /**
     * @private [_onChangeDate change of date handler]
     * @param  {[type]} oEvt
     * @return {[type]}
     */
    _onChangeDate: function(oEvt) {
        "use strict";
        var oDataStatus, bParamBefore;
        oDataStatus = hcm.mgr.approve.leaverequests.util.CalendarServices.checkLoadRequired(oEvt.getParameter("firstDate"), oEvt.getParameter("endDate"));
        if (oDataStatus.bLoadReq) {
            bParamBefore = oDataStatus.bLoadBefore;
            jQuery.sap.delayedCall(5, undefined, function() {
                if (hcm.mgr.approve.leaverequests.util.CalendarServices.getLeadRequestID()) {
                    hcm.mgr.approve.leaverequests.util.CalendarServices.readCalData(null, null, bParamBefore, null);
                }
            });
        }
    },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
        "use strict";
        var objHdrFtr = {
            sI18NDetailTitle: "view.Detail.title",
            onBack: jQuery.proxy(function() {
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep link situation
                if (sDir && sDir !== "Unknown") {
                    window.history.go(-1);
                } else {
                    this.oRouter.navTo("detail", {
                        from: "calendar",
                        contextPath: this.detailContextPath
                    }, true);
                }
            }, this)
        };
        /**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.mgr.approve.leaverequests.view.S4~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	return objHdrFtr;
    }

});