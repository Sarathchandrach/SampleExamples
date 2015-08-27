/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.CalendarServices");jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("sap.ca.ui.dialog.factory");sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mgr.approve.leaverequests.view.S4",{extHookChangeFooterButtons:null,onInit:function(){"use strict";this.oView=this.getView();this.resourceBundle=this.oApplicationFacade.getResourceBundle();this.oDataModel=this.oApplicationFacade.getODataModel();this.detailContextPath="";this.oRouter.attachRouteMatched(function(e){if(e.getParameter("name")==="calendar"){var r,R,o,s,a;R=e.getParameter("arguments").RequestId;o=e.getParameter("arguments").SAP__Origin;a="/LeaveRequestDetailsCollection(SAP__Origin='"+o+"',RequestId='"+R+"',CalculateOverlaps=1)";this.detailContextPath="LeaveRequestCollection(SAP__Origin='"+o+"',RequestId='"+R+"')";this.oView.bindElement(a);r=new Date();r.setTime(e.getParameter("arguments").StartDate);s=hcm.mgr.approve.leaverequests.util.CalendarServices.setDateType(r);hcm.mgr.approve.leaverequests.util.CalendarServices.setCalStartDate(s);if(!hcm.mgr.approve.leaverequests.util.CalendarServices.getAppModel()){hcm.mgr.approve.leaverequests.util.CalendarServices.setAppModel(this.oDataModel)}hcm.mgr.approve.leaverequests.util.CalendarServices.clearCalData();jQuery.sap.delayedCall(5,undefined,jQuery.proxy(function(){hcm.mgr.approve.leaverequests.util.CalendarServices.readCalData(R,r,null,o);this._onShow(R)},this))}},this);var c=this.byId("OverlapCalendar2"),l=this.byId("CalenderLegend");if(c){c.setModel(hcm.mgr.approve.leaverequests.util.CalendarServices.getCalModel())}if(jQuery.device.is.phone){c.setWeeksPerRow(1)}if(l){l.setLegendForNormal(this.resourceBundle.getText("view.Calendar.LegendWorkingDay"));l.setLegendForType00(this.resourceBundle.getText("view.Calendar.LegendDayOff"));l.setLegendForType01(this.resourceBundle.getText("view.Calendar.LegendApproved"));l.setLegendForType04(this.resourceBundle.getText("view.Calendar.LegendPending"));l.setLegendForType06(this.resourceBundle.getText("view.Calendar.LegendHoliday"));l.setLegendForType07(this.resourceBundle.getText("view.Calendar.LegendDeletionRequested"));l.setLegendForToday(this.resourceBundle.getText("view.Calendar.LegendToday"))}},_onShow:function(R){"use strict";var c,p,e;c=this.byId("OverlapCalendar2");if(c){p="/"+R+"/events";e=new sap.me.OverlapCalendarEvent({row:"{Order}",type:"{LegendType}",typeName:"{AbsenceType}",name:"{EmployeeName}"});e.bindProperty("halfDay",{parts:[{path:"AllDayFlag"}],formatter:function(a){var r=false;if(!a){r=true}return r}});e.bindProperty("startDay",{parts:[{path:"StartDate"}],formatter:hcm.mgr.approve.leaverequests.util.Conversions.convertLocalDateToUTC});e.bindProperty("endDay",{parts:[{path:"EndDate"}],formatter:hcm.mgr.approve.leaverequests.util.Conversions.convertLocalDateToUTC});c.bindAggregation("calendarEvents",p,e);c.setStartDate(hcm.mgr.approve.leaverequests.util.CalendarServices.getCalStartDate())}},_onEndOfData:function(e){"use strict"},_onChangeDate:function(e){"use strict";var d,p;d=hcm.mgr.approve.leaverequests.util.CalendarServices.checkLoadRequired(e.getParameter("firstDate"),e.getParameter("endDate"));if(d.bLoadReq){p=d.bLoadBefore;jQuery.sap.delayedCall(5,undefined,function(){if(hcm.mgr.approve.leaverequests.util.CalendarServices.getLeadRequestID()){hcm.mgr.approve.leaverequests.util.CalendarServices.readCalData(null,null,p,null)}})}},getHeaderFooterOptions:function(){"use strict";var o={sI18NDetailTitle:"view.Detail.title",onBack:jQuery.proxy(function(){var d=sap.ui.core.routing.History.getInstance().getDirection("");if(d&&d!=="Unknown"){window.history.go(-1)}else{this.oRouter.navTo("detail",{from:"calendar",contextPath:this.detailContextPath},true)}},this)};if(this.extHookChangeFooterButtons){o=this.extHookChangeFooterButtons(o)};return o}});