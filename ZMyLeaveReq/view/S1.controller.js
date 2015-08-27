/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");jQuery.sap.require("hcm.emp.myleaverequests.utils.UIHelper");jQuery.sap.require("sap.m.MessageBox");jQuery.sap.require("hcm.emp.myleaverequests.utils.DataManager");jQuery.sap.require("hcm.emp.myleaverequests.utils.CalendarTools");jQuery.sap.require("sap.ca.ui.dialog.factory");jQuery.sap.require("sap.ca.ui.dialog.Dialog");jQuery.sap.require("sap.m.MessageToast");jQuery.support.useFlexBoxPolyfill=false;sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.emp.myleaverequests.view.S1",{extHookChangeFooterButtons:null,extHookRouteMatchedHome:null,extHookRouteMatchedChange:null,extHookClearData:null,extHookInitCalendar:null,extHookTapOnDate:null,extHookSetHighlightedDays:null,extHookDeviceDependantLayout:null,extHookSubmit:null,extHookOnSubmitLRCfail:null,extHookOnSubmitLRCsuccess:null,extHookCallDialog:null,onInit:function(){sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);this.resourceBundle=this.oApplicationFacade.getResourceBundle();this.oDataModel=this.oApplicationFacade.getODataModel();hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel,this.resourceBundle);hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);hcm.emp.myleaverequests.utils.CalendarTools.init(this.resourceBundle);this.oDataModel=hcm.emp.myleaverequests.utils.DataManager.getBaseODataModel();this.oRouter.attachRouteMatched(this._handleRouteMatched,this);this._buildHeaderFooter();this._initCntrls();sap.ui.getCore().getEventBus().subscribe("hcm.emp.myleaverequests.LeaveCollection","refresh",this._onLeaveCollRefresh,this)},_initCntrls:function(){this.changeMode=false;this.oChangeModeData={};this.selRange={};this.selRange.start=null;this.selRange.end=null;this.aLeaveTypes=[];this.leaveType={};this.iPendingRequestCount=0;this.bSubmitOK=null;this.bApproverOK=null;this.oSubmitResult={};this.sApprover="";this.bSimulation=true;this._isLocalReset=false;this.oBusy=null;this.formContainer=this.byId("LRS4_FRM_CNT_BALANCES");this.timeInputElem=this.byId("LRS4_FELEM_TIMEINPUT");this.balanceElem=this.byId("LRS4_FELEM_BALANCES");this.noteElem=this.byId("LRS4_FELEM_NOTE");this.timeFrom=this.byId("LRS4_DAT_STARTTIME");this.timeTo=this.byId("LRS4_DAT_ENDTIME");this.legend=this.byId("LRS4_LEGEND");this.remainingVacation=this.byId("LRS4_TXT_REMAINING_DAYS");this.bookedVacation=this.byId("LRS4_TXT_BOOKED_DAYS");this.note=this.byId("LRS4_TXA_NOTE");this.cale=this.byId("LRS4_DAT_CALENDAR");this.slctLvType=this.byId("SLCT_LEAVETYPE");this.calSelResetData=[];this._initCalendar();this._deviceDependantLayout()},_onLeaveCollRefresh:function(){hcm.emp.myleaverequests.utils.CalendarTools.clearCache()},onAfterRendering:function(){var t=this;$(window).on("orientationchange",function(e){t._orientationDependancies(e.orientation)});this.byId('LRS4_TXT_REMAININGDAY').onAfterRendering=function(){jQuery(this.getDomRef()).css({'text-align':'right'})};this.byId('LRS4_TXT_REMAINING_DAYS').onAfterRendering=function(){jQuery(this.getDomRef()).css({'font-size':'1.5rem','font-weight':'700'})};this.byId('LRS4_TXT_BOOKED_DAYS').onAfterRendering=function(){jQuery(this.getDomRef()).css({'font-size':'1.5rem','font-weight':'700'})}},_buildHeaderFooter:function(){var _=this;this.objHeaderFooterOptions={sI18NFullscreenTitle:"",oEditBtn:{sId:"LRS4_BTN_SEND",sI18nBtnTxt:"LR_SEND",onBtnPressed:function(e){_.onSendClick(e)}},buttonList:[{sId:"LRS4_BTN_CANCEL",sI18nBtnTxt:"LR_RESET",onBtnPressed:function(e){_.onCancelClick(e)}},{sId:"LRS4_BTN_ENTITLEMENT",sI18nBtnTxt:"LR_BALANCE_TILE",onBtnPressed:function(e){_.onEntitlementClick(e)}},{sId:"LRS4_BTN_HISTORY",sI18nBtnTxt:"LR_HISTORY_TILE",onBtnPressed:function(e){_.onHistoryClick(e)}}]};if(this.extHookChangeFooterButtons){this.objHeaderFooterOptions=this.extHookChangeFooterButtons(this.objHeaderFooterOptions)}},_handleRouteMatched:function(e){var _=this;if(e.getParameter("name")==="home"){hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel,this.resourceBundle);this.objHeaderFooterOptions.sI18NFullscreenTitle="LR_CREATE_LEAVE_TILE";this.setHeaderFooterOptions(this.objHeaderFooterOptions);hcm.emp.myleaverequests.utils.UIHelper.setControllerInstance(this);this.oChangeModeData={};this.changeMode=false;this._clearData();hcm.emp.myleaverequests.utils.CalendarTools.clearCache();var c=$.when(hcm.emp.myleaverequests.utils.DataManager.getConfiguration(),hcm.emp.myleaverequests.utils.DataManager.getAbsenceTypeCollection());c.done(function(g,l){_.aLeaveTypes=l;var o={};o.AbsenceTypeCollection=_.aLeaveTypes;_.slctLvType.setModel(new sap.ui.model.json.JSONModel(o));_.slctLvType.bindItems({path:"/AbsenceTypeCollection",template:new sap.ui.core.Item({key:"{AbsenceTypeCode}",text:"{AbsenceTypeName}"})});if(_.aLeaveTypes.length>0){_._setUpLeaveTypeData(g.DefaultAbsenceTypeCode)}});c.fail(function(g){hcm.emp.myleaverequests.utils.UIHelper.errorDialog(g)});_._setHighlightedDays(_.cale.getCurrentDate());if(_.cale&&_.cale.getSelectedDates().length===0){_.setBtnEnabled("LRS4_BTN_SEND",false)}else{_.setBtnEnabled("LRS4_BTN_SEND",true)}if(this.extHookRouteMatchedHome){this.extHookRouteMatchedHome()}}else if(e.getParameter("name")==="change"){hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel,this.resourceBundle);this.objHeaderFooterOptions.sI18NFullscreenTitle="LR_TITLE_CHANGE_VIEW";this.setHeaderFooterOptions(this.objHeaderFooterOptions);hcm.emp.myleaverequests.utils.UIHelper.setControllerInstance(this);this.oChangeModeData={};this.changeMode=true;this._clearData();var a=e.getParameters().arguments.requestID;var b=null,i;var d=hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");if(d){for(i=0;i<d.length;i++){if(d[i].RequestID==a){b=d[i]}}if(b==null){for(i=0;i<d.length;i++){if(d[i].LeaveKey==a){b=d[i]}}}}if(!b){jQuery.sap.log.warning("curntLeaveRequest is null","_handleRouteMatched","hcm.emp.myleaverequests.view.S1");this.oRouter.navTo("home",{},true)}else{var s=hcm.emp.myleaverequests.utils.Formatters.getDate(b.StartDate);var f=hcm.emp.myleaverequests.utils.Formatters.getDate(b.EndDate);s=new Date(s.getUTCFullYear(),s.getUTCMonth(),s.getUTCDate(),0,0,0);f=new Date(f.getUTCFullYear(),f.getUTCMonth(),f.getUTCDate(),0,0,0);_.oChangeModeData.requestId=b.RequestID;_.oChangeModeData.leaveTypeCode=b.AbsenceTypeCode;_.oChangeModeData.startDate=s.toString();_.oChangeModeData.endDate=f.toString();_.oChangeModeData.requestID=b.RequestID;_.oChangeModeData.noteTxt=b.Notes;_.oChangeModeData.startTime=b.StartTime;_.oChangeModeData.endTime=b.EndTime;_.oChangeModeData.employeeID=b.EmployeeID;_.oChangeModeData.changeStateID=b.ChangeStateID;_.oChangeModeData.leaveKey=b.LeaveKey;_.oChangeModeData.evtType=_._getCaleEvtTypeForStatus(b.StatusCode);_._setUpLeaveTypeData(_.oChangeModeData.leaveTypeCode);_._copyChangeModeData();if(_.cale.getSelectedDates().length>1){if(this.timeFrom){this.timeFrom.setValue("");this.timeFrom.setEnabled(false)}if(this.timeTo){this.timeTo.setValue("");this.timeTo.setEnabled(false)}}if(_.cale&&_.cale.getSelectedDates().length===0){_.setBtnEnabled("LRS4_BTN_SEND",false)}else{_.setBtnEnabled("LRS4_BTN_SEND",true)}}if(this.extHookRouteMatchedChange){this.extHookRouteMatchedChange()}}},_copyChangeModeData:function(){var _=null;var a=null;var b=0;var c=0;if(this.oChangeModeData==={}){return}this.selRange.start=this.oChangeModeData.startDate;this.selRange.end=this.oChangeModeData.endDate;if(this.selRange.start===this.selRange.end){this.selRange.end=null;if(this.cale){this.cale.toggleDatesSelection([this.selRange.start],true)}}else{if(this.cale){this.cale.toggleDatesRangeSelection(this.selRange.start,this.selRange.end,true)}}if(this.cale){this.cale.setCurrentDate(this.selRange.start);this._setHighlightedDays(this.cale.getCurrentDate())};this.requestID=this.oChangeModeData.requestID;if(this.note){if(!!this.byId("LRS4_NOTE")&&this.byId("LRS4_NOTE").getContent().length>2)this.byId("LRS4_NOTE").removeContent(1);if(!!this.oChangeModeData.noteTxt&&this.oChangeModeData.noteTxt!==""){var n=new sap.m.Text({width:"100%",wrapping:true,layoutData:new sap.ui.layout.ResponsiveFlowLayoutData({weight:8})});n.setText(this.oChangeModeData.noteTxt);this.byId("LRS4_NOTE").insertContent(n,1)}}if(typeof this.oChangeModeData.startTime==="string"){if(this.timeFrom){if(this.oChangeModeData.startTime==="PT00H00M00S"){this.timeFrom.setValue("")}else{this.timeFrom.setValue(this.oChangeModeData.startTime.substring(2,4)+":"+this.oChangeModeData.startTime.substring(5,7))}}if(this.timeTo){if(this.oChangeModeData.endTime==="PT00H00M00S"){this.timeTo.setValue("")}else{this.timeTo.setValue(this.oChangeModeData.endTime.substring(2,4)+":"+this.oChangeModeData.endTime.substring(5,7))}}}else{_=new Date(this.oChangeModeData.startTime.ms);b=_.getUTCHours();c=_.getUTCMinutes();b=(b<10?"0":"")+b;c=(c<10?"0":"")+c;if(this.timeFrom){this.timeFrom.setValue(b+":"+c)}a=new Date(this.oChangeModeData.endTime.ms);b=a.getUTCHours();c=a.getUTCMinutes();b=(b<10?"0":"")+b;c=(c<10?"0":"")+c;if(this.timeTo){this.timeTo.setValue(b+":"+c)}}if(this.cale&this.cale.getSelectedDates().length===0){this.setBtnEnabled("LRS4_BTN_SEND",false)}else{this.setBtnEnabled("LRS4_BTN_SEND",true)}},_setInputTimePattern:function(){var t=new Date();var p="";t.setHours(23,30,59);var T=hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(t);if(T!==""){var a=T.split(":");var h="";h=a[0];if(isNaN(h)){p="a hh:mm"}else if(parseInt(h)===23){p="HH:mm"}else if(parseInt(h)===11){if(isNaN(a[a.length-1])){p="hh:mm a"}else{p="hh:mm"}}};if(p!==""){this.timeFrom.setDisplayFormat(p);this.timeTo.setDisplayFormat(p)}},_clearData:function(){this._clearDateSel();if(this._isLocalReset){for(var i=0;i<this.calSelResetData.length;i++){this.cale.toggleDatesType(this.calSelResetData[i].calEvt,this.calSelResetData[i].evtType,false)}this.calSelResetData=[]}this.oChangeModeData={};if(this.cale){this.cale.setCurrentDate(new Date())};if(this.note){this.note.setValue("");if(!!this.byId("LRS4_NOTE")&&this.byId("LRS4_NOTE").getContent().length>2)this.byId("LRS4_NOTE").removeContent(1)}if(this.timeFrom){this.timeFrom.setValue("");this.timeFrom.rerender();this.timeFrom.setEnabled(true)};if(this.timeTo){this.timeTo.setValue("");this.timeTo.rerender();this.timeTo.setEnabled(true)};this.setBtnEnabled("LRS4_BTN_SEND",false);if(this.byId("LRS4_LBL_TITLE")){this.byId("LRS4_LBL_TITLE").setText(this.resourceBundle.getText("LR_TITLE_CREATE_VIEW"))};if(this.aLeaveTypes.length>0&&this.changeMode==false&&this._isLocalReset==true){var d=hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("DefaultAbsenceTypeCode");this.slctLvType.setSelectedKey(d.DefaultAbsenceTypeCode);this._setUpLeaveTypeData(d.DefaultAbsenceTypeCode)}this._isLocalReset=false;if(this.extHookClearData){this.extHookClearData()}},_clearDateSel:function(){if(this.cale){this.cale.unselectAllDates()};this.selRange.end=null;this.selRange.start=null;this.setBtnEnabled("LRS4_BTN_SEND",false)},_initCalendar:function(){if(this.cale){this.cale.setSwipeToNavigate(true);this.cale.attachChangeCurrentDate(this._onChangeCurrentDate,this);this.cale.attachTapOnDate(this._onTapOnDate,this);this.cale.setEnableMultiselection(false);this.cale.setWeeksPerRow(1)};if(this.legend){this.legend.setLegendForNormal(this.resourceBundle.getText("LR_WORKINGDAY"));this.legend.setLegendForType00(this.resourceBundle.getText("LR_NONWORKING"));this.legend.setLegendForType01(this.resourceBundle.getText("LR_APPROVELEAVE"));this.legend.setLegendForType04(this.resourceBundle.getText("LR_APPROVEPENDING"));this.legend.setLegendForType06(this.resourceBundle.getText("LR_PUBLICHOLIDAY"));this.legend.setLegendForType07(this.resourceBundle.getText("LR_REJECTEDLEAVE"));this.legend.setLegendForToday(this.resourceBundle.getText("LR_DTYPE_TODAY"));this.legend.setLegendForSelected(this.resourceBundle.getText("LR_DTYPE_SELECTED"))};if(this.extHookInitCalendar){this.extHookInitCalendar()}},registerForOrientationChange:function(a){if(jQuery.device.is.tablet){this.parentApp=a;a.attachOrientationChange(jQuery.proxy(this._onOrientationChanged,this))}},_onOrientationChanged:function(){this._leaveTypeDependantSettings(this.leaveType)},_onTapOnDate:function(e){var _;if(this.cale){_=this.cale.getSelectedDates()}if(this.leaveType.AllowedDurationMultipleDayInd===false){}else if(this.leaveType.AllowedDurationMultipleDayInd){if(_.length===0||e.mParameters.didSelect===false){if(this.selRange.start!==null&&this.selRange.end!==null){this._clearDateSel();if(e.getParameters().date!==""){this.selRange.start=e.getParameters().date;if(this.cale){this.cale.toggleDatesSelection([this.selRange.start],true)}}}else if(this.selRange.start!==null&&this.selRange.end===null){this._clearDateSel()}}else if(this.selRange.start===null){this.selRange.start=e.getParameters().date}else if(this.selRange.end===null){this.selRange.end=e.getParameters().date;if(this.cale){this.cale.toggleDatesRangeSelection(this.selRange.start,this.selRange.end,true)}}else{this.selRange.start=e.getParameters().date;this.selRange.end=null;if(this.cale){this.cale.toggleDatesSelection([this.selRange.start],true)}}}if(this.leaveType.AllowedDurationMultipleDayInd===true&&this.timeFrom&&this.timeTo){_=this.cale.getSelectedDates();if(_.length>1){this.timeFrom.setValue("");this.timeTo.setValue("");this.timeFrom.setEnabled(false);this.timeTo.setEnabled(false)}else{this.timeFrom.setEnabled(true);this.timeTo.setEnabled(true)}}if(this.cale&&this.cale.getSelectedDates().length===0){this.setBtnEnabled("LRS4_BTN_SEND",false)}else{this.setBtnEnabled("LRS4_BTN_SEND",true)};if(this.extHookTapOnDate){this.extHookTapOnDate()}},_setHighlightedDays:function(s){var _;try{_=sap.me.Calendar.parseDate(s)}catch(e){_=new Date(s)}hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_,this._getCalLabelsOK,this._getCalLabelsError);if(this.extHookSetHighlightedDays){this.extHookSetHighlightedDays()}},_getCalLabelsOK:function(c){var _=hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();if(!!c.REJECTED&&c["REJECTED"].length>0){_.cale.toggleDatesType(c["REJECTED"],sap.me.CalendarEventType.Type07,true);_.cale.toggleDatesType(c["REJECTED"],sap.me.CalendarEventType.Type04,false);_.cale.toggleDatesType(c["REJECTED"],sap.me.CalendarEventType.Type01,false)}if(!!c.SENT&&c["SENT"].length>0){_.cale.toggleDatesType(c["SENT"],sap.me.CalendarEventType.Type07,false);_.cale.toggleDatesType(c["SENT"],sap.me.CalendarEventType.Type04,true);_.cale.toggleDatesType(c["SENT"],sap.me.CalendarEventType.Type01,false)}if(!!c.APPROVED&&c["APPROVED"].length>0){_.cale.toggleDatesType(c["APPROVED"],sap.me.CalendarEventType.Type07,false);_.cale.toggleDatesType(c["APPROVED"],sap.me.CalendarEventType.Type04,false);_.cale.toggleDatesType(c["APPROVED"],sap.me.CalendarEventType.Type01,true)}if(!!c.POSTED&&c["POSTED"].length>0){_.cale.toggleDatesType(c["POSTED"],sap.me.CalendarEventType.Type07,false);_.cale.toggleDatesType(c["POSTED"],sap.me.CalendarEventType.Type04,false);_.cale.toggleDatesType(c["POSTED"],sap.me.CalendarEventType.Type01,true)}if(!!c.WEEKEND&&c["WEEKEND"].length>0){_.cale.toggleDatesType(c["WEEKEND"],sap.me.CalendarEventType.Type00,true)}if(!!c.PHOLIDAY&&c["PHOLIDAY"].length>0){_.cale.toggleDatesType(c["PHOLIDAY"],sap.me.CalendarEventType.Type06,true)}if(!!c.WORKDAY&&c["WORKDAY"].length>0){if(!!sap.me.CalendarEventType.Type10){_.cale.toggleDatesType(c["WORKDAY"],sap.me.CalendarEventType.Type10,true)}else{_.cale.toggleDatesType(c["WORKDAY"],"",true)}}},_getCaleEvtTypeForStatus:function(s){if(s==="WEEKEND"){return sap.me.CalendarEventType.Type00}else if(s==="PHOLIDAY"){return sap.me.CalendarEventType.Type06}else if(s==="SENT"){return sap.me.CalendarEventType.Type04}else if(s==="POSTED"||s==="APPROVED"){return sap.me.CalendarEventType.Type01}else if(s==="REJECTED"){return sap.me.CalendarEventType.Type07}else if(s==="WORKDAY"){if(!!sap.me.CalendarEventType.Type10)return sap.me.CalendarEventType.Type10;else return""}else{return""}},_getCalLabelsError:function(o){hcm.emp.myleaverequests.utils.UIHelper.errorDialog(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(o))},_onChangeCurrentDate:function(e){if(this.cale){this._setHighlightedDays(e.mParameters.currentDate)}},_getStartEndDate:function(s){var _=[];var a=[];var r={};for(var i=0;i<s.length;i++){_[i]=new Date(s[i])}if(_.length===0){r.startDate={};r.endDate={}}else if(_.length===1){r.startDate=_[0];r.endDate=_[0]}else{a=_.sort(function(d,b){if(d<b)return-1;if(d>b)return 1;return 0});r.startDate=a[0];r.endDate=a[a.length-1]};return r},_getLeaveTypesFromModel:function(){var _=new Array();for(var x in this.oDataModel.oData){if(x.substring(0,21)==="AbsenceTypeCollection"){if(this.oDataModel.oData[x]instanceof Array){for(var i=0;i<this.oDataModel.oData[x].length;i++){_.push(this.oDataModel.oData[x][i])}}else{_.push(this.oDataModel.oData[x])}}}return _},_setUpLeaveTypeData:function(a){if(this.slctLvType){this.slctLvType.setSelectedKey(a)}this.leaveType=this._readWithKey(this.aLeaveTypes,"AbsenceTypeCode",a);if(this.leaveType===null){hcm.emp.myleaverequests.utils.UIHelper.errorDialog(this.resourceBundle.getText("LR_DD_GENERIC_ERR"));jQuery.sap.log.warning("couldn't find defaultLeaveType","_setUpLeaveTypeData","hcm.emp.myleaverequests.view.S1")}this._leaveTypeDependantSettings(this.leaveType);this.getBalancesForAbsenceType(a);this.selectorInititDone=true},_readWithKey:function(l,s,k){for(var i=0;i<l.length;i++){if(l[i][s]===k){return l[i]}}return null},_getBalancesBusyOn:function(){this.bookedVacation.setVisible(false);this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(true);this.remainingVacation.setVisible(false);this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(true)},_getBalancesBusyOff:function(){this.bookedVacation.setVisible(true);this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(false);this.remainingVacation.setVisible(true);this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(false)},_leaveTypeDependantSettings:function(l){if(l.AllowedDurationPartialDayInd){if(this.timeInputElem){this.timeInputElem.setVisible(true)}}else{if(this.timeInputElem){this.timeInputElem.setVisible(false)}}},_orientationDependancies:function(c){if(jQuery.device.is.phone===true){if(this.cale){this.cale.setMonthsToDisplay(1);this.cale.setMonthsPerRow(1)}}else{if(c=="portrait"){if(this.byId("LRS4_FRM_CNT_CALENDAR")){this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(5)};if(this.cale){this.cale.setMonthsToDisplay(1);this.cale.setMonthsPerRow(1)};if(this.formContainer){this.formContainer.getLayoutData().setWeight(5)}}else if(c=="landscape"){if(this.byId("LRS4_FRM_CNT_CALENDAR")){this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6)};if(this.cale){this.cale.setMonthsToDisplay(2);this.cale.setMonthsPerRow(2)};if(this.formContainer){this.formContainer.getLayoutData().setWeight(3)}}}},_deviceDependantLayout:function(){if(this.byId("LRS4_FLX_TOP")){this.byId("LRS4_FLX_TOP").addStyleClass("s4leaveTypeSelectorFlx")}if(this.byId("LRS4_TXT_BOOKEDDAYS")){this.byId("LRS4_TXT_BOOKEDDAYS").addStyleClass("s4BalancesFlxLeft")}if(this.byId("LRS4_TXT_REMAININGDAY")){this.byId("LRS4_TXT_REMAININGDAY").addStyleClass("s4BalancesFlxRight")}if(this.byId("LRS4_FLX_ENDTIME")){this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlx");this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlxEnd")}if(this.byId("LRS4_FLX_STARTTIME")){this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlxStart");this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlx")}if(jQuery.device.is.phone){if(this.byId("LRS4_LEGEND")){this.byId("LRS4_LEGEND").setExpandable(true);this.byId("LRS4_LEGEND").setExpanded(false)}if(this.timeInputElem){this.timeInputElem.getLayoutData().setLinebreak(true)}if(this.formContainer){this.formContainer.getLayoutData().setLinebreak(true);this.formContainer.getLayoutData().setWeight(3)}}else{if(this.byId("S4")){this.byId("S4").setEnableScrolling(false)}if(this.byId("LRS4_FRM_CNT_CALENDAR")){this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6)}if(this.cale){this.cale.setMonthsToDisplay(2);this.cale.setMonthsPerRow(2)}if(this.formContainer){this.formContainer.getLayoutData().setLinebreak(false);this.formContainer.getLayoutData().setWeight(3)}if(this.balanceElem){this.balanceElem.getLayoutData().setLinebreak(false)}if(this.timeInputElem){this.timeInputElem.getLayoutData().setLinebreak(true);this.timeInputElem.setVisible(false)}if(this.noteElem){this.noteElem.getLayoutData().setLinebreak(true)}if(this.byId("LRS4_LEGEND")){this.byId("LRS4_LEGEND").setExpandable(true);this.byId("LRS4_LEGEND").setExpanded(true)}if(this.byId("LRS4_FRM_CNT_LEGEND")){this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9)}}if(this.extHookDeviceDependantLayout){this.extHookDeviceDependantLayout()}},_getDaysOfRange:function(s,e){var _=null;var a=null;var d=[];if(s instanceof Date){_=new Date(s.getUTCFullYear(),s.getUTCMonth(),s.getUTCDate())}else if(typeof s==="string"){_=new Date(s);_=new Date(_.getUTCFullYear(),_.getUTCMonth(),_.getUTCDate())}if(e instanceof Date){a=new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate())}else if(typeof e==="string"){a=new Date(e);a=new Date(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate())}if(a===null){return[_.toDateString()]}else{while(_<=a){d.push(_.toDateString());_.setTime(_.getTime()+86400000)}return d}},onSend:function(){this.submit(true)},submit:function(i){var s,S,e,E;this.bApproverOK=null;this.bSubmitOK=null;this.oSubmitResult={};this.bSimulation=i;if(this.cale){var _=this._getStartEndDate(this.cale.getSelectedDates());if(this.timeFrom&&this.timeTo&&this.leaveType.AllowedDurationPartialDayInd){s=hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_.startDate)+'T00:00:00';if(this.timeFrom.getValue()===""){S='PT00H00M00S'}else{S="PT"+this.timeFrom.getValue().substring(0,2)+"H"+this.timeFrom.getValue().substring(3,5)+"M00S"}e=hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_.endDate)+'T00:00:00';if(this.timeTo.getValue()===""){E='PT00H00M00S'}else{E="PT"+this.timeTo.getValue().substring(0,2)+"H"+this.timeTo.getValue().substring(3,5)+"M00S"}}else{s=hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_.startDate)+'T00:00:00';S='PT00H00M00S';e=hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_.endDate)+'T00:00:00';E='PT00H00M00S'}if(!this.oBusy){this.oBusy=new sap.m.BusyDialog()}this.oBusy.open();var n="";if(this.note){n=this.note.getValue()}if(this.changeMode){hcm.emp.myleaverequests.utils.DataManager.changeLeaveRequest(this.oChangeModeData.employeeID,this.oChangeModeData.requestID,this.oChangeModeData.changeStateID,this.oChangeModeData.leaveKey,s,S,e,E,this.leaveType.AbsenceTypeCode,n,i,this.onSubmitLRCsuccess,this.onSubmitLRCfail)}else{hcm.emp.myleaverequests.utils.DataManager.submitLeaveRequest(s,S,e,E,this.leaveType.AbsenceTypeCode,n,i,this.onSubmitLRCsuccess,this.onSubmitLRCfail)}};if(this.extHookSubmit){this.extHookSubmit()}},onSubmitLRCfail:function(e){var _=hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();_.evalSubmitResult("submitLRC",false,{});_.oBusy.close();if(this.extHookOnSubmitLRCfail){e=this.extHookOnSubmitLRCfail(e)};hcm.emp.myleaverequests.utils.UIHelper.errorDialog(e)},onSubmitLRCsuccess:function(r,m){var _=hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();if(this.extHookOnSubmitLRCsuccess){var e=this.extHookOnSubmitLRCsuccess(r,m);r=e.oResult;m=e.oMsgHeader};_.oLRSuccessResult=r;if(_.bSimulation){if(m.severity){if(m.severity=="warning"){if(typeof String.prototype.trim!=='function'){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'')}}var d="";m.details.forEach(function(g){d+=decodeURI(g.message).trim()+'\r\n'});sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.WARNING,message:decodeURI(m.message).trim(),details:d},_._fetchApprover(r))}else{_._fetchApprover(r)}}else{_._fetchApprover(r)}}else{if(_.cale&&_.changeMode){_.cale.toggleDatesType(_._getDaysOfRange(_.oChangeModeData.startDate,_.oChangeModeData.endDate),_.oChangeModeData.evtType,false)}sap.m.MessageToast.show(_.resourceBundle.getText("LR_SUBMITDONE",[_.sApprover]),{width:"15em"});if(_.changeMode===true){}_._clearData();_._setUpLeaveTypeData(_.slctLvType.getSelectedKey());_.note.setValue("");if(_.cale){_.cale.unselectAllDates();var a=_._getDaysOfRange(_.oLRSuccessResult.StartDate,_.oLRSuccessResult.EndDate);for(var i=0;i<a.length;i++){var c=new Date(a[i]);var f=new Date(c.getFullYear(),c.getMonth(),1);var C=hcm.emp.myleaverequests.utils.CalendarTools.oCache;if(C.hasOwnProperty(f.toString())){var b=C[f];for(var k in b){if(b.hasOwnProperty(k)){if(b[k].length>0){for(var j=0;j<b[k].length;j++){if((new Date(b[k][j])).toString()==(new Date(c)).toString()){b[k].splice(j,1);if(b[k].length<1){delete b[k]}break}}}}}if(b.hasOwnProperty("SENT"))b["SENT"].push(a[i]);else{b.SENT=new Array(a[i])}}}_.cale.toggleDatesType(a,sap.me.CalendarEventType.Type06,false);_.cale.toggleDatesType(a,sap.me.CalendarEventType.Type01,false);_.cale.toggleDatesType(a,sap.me.CalendarEventType.Type07,false);if(!!sap.me.CalendarEventType.Type10){_.cale.toggleDatesType(a,sap.me.CalendarEventType.Type10,false)}_.cale.toggleDatesType(a,sap.me.CalendarEventType.Type04,true)}}_.oBusy.close()},_fetchApprover:function(l){var _=hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();var a={};if(l.ApproverEmployeeName!=""){_.slctLvType.setSelectedKey(_.leaveType.AbsenceTypeCode);a.sApprover=_.sApprover=l.ApproverEmployeeName;_.evalSubmitResult("getApprover",true,a);_.evalSubmitResult("submitLRC",true,_.oLRSuccessResult)}else{hcm.emp.myleaverequests.utils.DataManager.getApprover(function(A){_.slctLvType.setSelectedKey(_.leaveType.AbsenceTypeCode);a.sApprover=_.sApprover=A;_.evalSubmitResult("getApprover",true,a);_.evalSubmitResult("submitLRC",true,_.oLRSuccessResult)},function(){a.sApprover=_.resourceBundle.getText("LR_UNKNOWN");_.evalSubmitResult("getApprover",false,a)},this)}},evalSubmitResult:function(c,s,r){var _=hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();if(c==="submitLRC"){_.bSubmitOK=s;_.oSubmitResult=r}if(c==="getApprover"){_.bApproverOK=s;_.sApprover=r.sApprover}if(_.bSubmitOK===false){if(_.oBusy){_.oBusy.close()}}else if(_.bSubmitOK===true){if(_.bApproverOK===false){if(_.oBusy){_.oBusy.close()}_.callDialog(_.oSubmitResult,_.sApprover)}else if(_.bApproverOK===true){if(_.oBusy){_.oBusy.close()}_.callDialog(_.oSubmitResult,_.sApprover)}}},callDialog:function(s,a){var _=hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();var b;var c;if(jQuery.sap.getUriParameters().get("responderOn")){if(_.selRange.start===null){try{_.selRange.start=sap.me.Calendar.parseDate(_.cale.getSelectedDates()[0])}catch(e){_.selRange.start=new Date(_.cale.getSelectedDates()[0])}}b=_.selRange.start;if(_.selRange.end===null){c=_.selRange.start}else{c=_.selRange.end}}else{if(_.leaveType.AllowedDurationPartialDayInd){b=hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.StartDate,"medium");c=hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.EndDate,"medium");b+=" "+hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(s.StartTime);c+=" "+hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(s.EndTime)}else{b=hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.StartDate);c=hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.EndDate)}}var S={question:this.resourceBundle.getText("LR_CONFIRMATIONMSG",[a]),additionalInformation:[{label:_.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE"),text:this.leaveType.AbsenceTypeName},{label:_.resourceBundle.getText("LR_FROM"),text:b},{label:_.resourceBundle.getText("LR_TO"),text:c},{label:_.resourceBundle.getText("LR_REQUEST"),text:hcm.emp.myleaverequests.utils.Formatters.DURATION(s.WorkingDaysDuration,s.WorkingHoursDuration)+" "+hcm.emp.myleaverequests.utils.Formatters.DURATION_UNIT(s.WorkingDaysDuration,s.WorkingHoursDuration)}],showNote:false,title:_.resourceBundle.getText("LR_TITLE_SEND"),confirmButtonLabel:_.resourceBundle.getText("LR_OK")};if(this.extHookCallDialog){S=this.extHookCallDialog(S)};sap.ca.ui.dialog.factory.confirm(S,function(r){if(r.isConfirmed==true){_.submit(false)}})},onSelectionChange:function(e){var s=e.getParameter("selectedItem");var a=s.getProperty("key");this._setUpLeaveTypeData(a)},getBalancesForAbsenceType:function(a){if(a==undefined||a.length<1)return;if(this.bookedVacation){this.bookedVacation.setNumber("-")};if(this.remainingVacation){this.remainingVacation.setNumber("-")};this._getBalancesBusyOn();var _=this;hcm.emp.myleaverequests.utils.DataManager.getBalancesForAbsenceType(a,function(b,t,B,T,s,c,d){_._getBalancesBusyOff();var j={BalancePlannedQuantity:b,BalanceAvailableQuantity:B,BalanceUsedQuantity:c,BalanceTotalUsedQuantity:d,TimeUnitName:T};var m=new sap.ui.model.json.JSONModel(j);_.getView().setModel(m,"TimeAccount");m.createBindingContext("/",function(C){_.getView().setBindingContext(C,"TimeAccount")})},function(e){_._getBalancesBusyOff();if(_.bookedVacation){_.bookedVacation.setNumber("-")}_.bookedVacation.setNumberUnit("-");if(_.remainingVacation){_.remainingVacation.setNumber("-")}_.remainingVacation.setNumberUnit("-");hcm.emp.myleaverequests.utils.UIHelper.errorDialog(e)},this)},onTimeChange:function(){var _=this.byId("LRS4_DAT_ENDTIME").getValue();var a=this.byId("LRS4_DAT_STARTTIME").getValue();if(this.byId("LRS4_DAT_ENDTIME")&&_===""&&a!==""){this.byId("LRS4_DAT_ENDTIME").setValue(a)}if(this.byId("LRS4_DAT_STARTTIME")&&_!==""&&a===""){this.byId("LRS4_DAT_STARTTIME").setValue(_)}},onSendClick:function(){this.submit(true)},onCancelClick:function(){if(!this.changeMode){this._isLocalReset=true;this._clearData();hcm.emp.myleaverequests.utils.CalendarTools.clearCache();this._setHighlightedDays(this.cale.getCurrentDate())}else{this.oRouter.navTo("master")}},onEntitlementClick:function(){this.oRouter.navTo("entitlements",{})},onHistoryClick:function(){this.oRouter.navTo("master",{})}});
