/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");
jQuery.sap.require("hcm.emp.myleaverequests.utils.UIHelper");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("hcm.emp.myleaverequests.utils.DataManager");
jQuery.sap.require("hcm.emp.myleaverequests.utils.CalendarTools");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.m.MessageToast");
jQuery.support.useFlexBoxPolyfill = false;

sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.emp.myleaverequests.view.S1", {


	extHookChangeFooterButtons: null,
	extHookRouteMatchedHome : null,
	extHookRouteMatchedChange : null,	
	extHookClearData : null,		
	extHookInitCalendar : null,	
	extHookTapOnDate : null,
	extHookSetHighlightedDays : null,
	extHookDeviceDependantLayout : null,
	extHookSubmit : null,
	extHookOnSubmitLRCfail : null,
	extHookOnSubmitLRCsuccess : null,	
	extHookCallDialog : null,
	


	onInit : function() {

		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.emp.myleaverequests.utils.Formatters.init(this.resourceBundle);
		hcm.emp.myleaverequests.utils.CalendarTools.init(this.resourceBundle);

		this.oDataModel = hcm.emp.myleaverequests.utils.DataManager.getBaseODataModel();

		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		this._buildHeaderFooter();

		this._initCntrls();
		sap.ui.getCore().getEventBus().subscribe("hcm.emp.myleaverequests.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);
	},

	_initCntrls : function() {

		this.changeMode = false; // true: S4 is called by history view for existing lr
		this.oChangeModeData = {}; // container for LR data coming from history view in change mode
		this.selRange = {}; // Object holding the selected dates of the calendar control
		this.selRange.start = null; // earliest selected date or singel selected date
		this.selRange.end = null; // latest selected date or null for single days
		this.aLeaveTypes = []; // array of absence types for current user
		this.leaveType = {}; // currently selected absence type

		this.iPendingRequestCount = 0;

		// ----variables used during onSend:
		this.bSubmitOK = null; // true when the submit simulation was successful
		this.bApproverOK = null; // true when the approving manager could be determined
		this.oSubmitResult = {};
		this.sApprover = ""; // Approving manager - used in confirmation popup
		this.bSimulation = true; // used in oData call for submit of lr - true: just check user entry false: do posting
		this._isLocalReset = false;

		// ------- convenience variables for screen elements
		this.oBusy = null;
		this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
		this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
		this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
		this.noteElem = this.byId("LRS4_FELEM_NOTE");
		this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
		this.timeTo = this.byId("LRS4_DAT_ENDTIME");
		this.legend = this.byId("LRS4_LEGEND");
		this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
		this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
		this.note = this.byId("LRS4_TXA_NOTE");
		this.cale = this.byId("LRS4_DAT_CALENDAR");
		this.slctLvType = this.byId("SLCT_LEAVETYPE");

		this.calSelResetData = [];
		
		//TODO:
		this._initCalendar(); // set up layout + fill calendar with events
		this._deviceDependantLayout();
		
		/*this is not necessary as of now
		 *Here the time pattern used for display in the timeInput control is determined
		if (this.timeFrom && this.timeTo) {
			this._setInputTimePattern();
		}*/
	},
	
	_onLeaveCollRefresh : function(){
		hcm.emp.myleaverequests.utils.CalendarTools.clearCache();
	},
	
	onAfterRendering : function(){
			var that= this;		
			$(window).on("orientationchange",function(event){
				//passing the type orientation to decide number of months to be displayed
				that._orientationDependancies(event.orientation);
			});
			//to align the text and total days available to right
			this.byId('LRS4_TXT_REMAININGDAY').onAfterRendering = function () {
					jQuery(this.getDomRef()).css({
						'text-align': 'right'			/*for IE and web kit browsers*/
						});
				};
			//to enhance the font of days used/available
			this.byId('LRS4_TXT_REMAINING_DAYS').onAfterRendering = function () {
					jQuery(this.getDomRef()).css({'font-size': '1.5rem', 'font-weight':'700'});
				};
			this.byId('LRS4_TXT_BOOKED_DAYS').onAfterRendering = function () {
					jQuery(this.getDomRef()).css({'font-size': '1.5rem', 'font-weight':'700'});
				};
	},


	_buildHeaderFooter : function() {
		var _this = this;
		this.objHeaderFooterOptions = {
			sI18NFullscreenTitle : "",
			oEditBtn : {
				sId : "LRS4_BTN_SEND",
				sI18nBtnTxt : "LR_SEND",
				onBtnPressed : function(evt) {
					_this.onSendClick(evt);
				}
			},
			buttonList : [{
				sId : "LRS4_BTN_CANCEL",
				sI18nBtnTxt : "LR_RESET",
				onBtnPressed : function(evt) {
					_this.onCancelClick(evt);
				}
			}, {
				sId : "LRS4_BTN_ENTITLEMENT",
				sI18nBtnTxt : "LR_BALANCE_TILE",
				onBtnPressed : function(evt) {
					_this.onEntitlementClick(evt);
				}
			}, {
				sId : "LRS4_BTN_HISTORY",
				sI18nBtnTxt : "LR_HISTORY_TILE",
				onBtnPressed : function(evt) {
					_this.onHistoryClick(evt);
				}
			}]
		};
		
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.emp.myleaverequests.view.S1~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
		if (this.extHookChangeFooterButtons) {
			this.objHeaderFooterOptions = this.extHookChangeFooterButtons(this.objHeaderFooterOptions);
    	}
	},

	_handleRouteMatched : function(evt) {

		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		
		var _this = this;

		if (evt.getParameter("name") === "home") {

			hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_CREATE_LEAVE_TILE";
			this.setHeaderFooterOptions(this.objHeaderFooterOptions);
			hcm.emp.myleaverequests.utils.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = false;

			this._clearData();
			hcm.emp.myleaverequests.utils.CalendarTools.clearCache();

			var combinedPromise = $.when(hcm.emp.myleaverequests.utils.DataManager.getConfiguration(), hcm.emp.myleaverequests.utils.DataManager.getAbsenceTypeCollection());
			
			combinedPromise.done(function(defaultType,leaveTypeColl){			
				
				// make sure that the leave type collection is available.
				_this.aLeaveTypes = leaveTypeColl;
				
				var objAbsenceTypes =  {};
				objAbsenceTypes.AbsenceTypeCollection = _this.aLeaveTypes;
				
				_this.slctLvType.setModel(new sap.ui.model.json.JSONModel(objAbsenceTypes));

				_this.slctLvType.bindItems({
					path : "/AbsenceTypeCollection",
					template : new sap.ui.core.Item({
						key : "{AbsenceTypeCode}",
						text : "{AbsenceTypeName}"
					})
				});

				if (_this.aLeaveTypes.length > 0) {
					//var abscenceCode = _this.aLeaveTypes[0].AbsenceTypeCode;
					//_this._setUpLeaveTypeData(abscenceCode);					
					_this._setUpLeaveTypeData(defaultType.DefaultAbsenceTypeCode);
				}				
				
			});

			combinedPromise.fail(function(error){
				hcm.emp.myleaverequests.utils.UIHelper.errorDialog(error);
			});

			
			_this._setHighlightedDays(_this.cale.getCurrentDate());

			if (_this.cale && _this.cale.getSelectedDates().length === 0) {
				_this.setBtnEnabled("LRS4_BTN_SEND", false);
			} else {
				_this.setBtnEnabled("LRS4_BTN_SEND", true);
			}
			
			
			/**
       * @ControllerHook Extend load behavior of home view
       * This hook method can be used to add UI or business logic 
       * It is called when the routeMatched event name match with home
       * @callback hcm.emp.myleaverequests.view.S1~extHookRouteMatchedHome
       */
			if(this.extHookRouteMatchedHome) {
				this.extHookRouteMatchedHome();
	  	}
			
		} else if (evt.getParameter("name") === "change") {

			
			hcm.emp.myleaverequests.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_TITLE_CHANGE_VIEW";
			this.setHeaderFooterOptions(this.objHeaderFooterOptions);
			hcm.emp.myleaverequests.utils.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = true;
			this._clearData();

			var currntRequestId = evt.getParameters().arguments.requestID;

			var curntLeaveRequest = null, i;
			
			var consolidatedLeaveRequestcollection = hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			
				if (consolidatedLeaveRequestcollection) {
					for ( i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
						if (consolidatedLeaveRequestcollection[i].RequestID == currntRequestId) {
							curntLeaveRequest = consolidatedLeaveRequestcollection[i];
						}
					}
					
					//requestID is null
					if(curntLeaveRequest==null){
						for (i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
							if (consolidatedLeaveRequestcollection[i].LeaveKey == currntRequestId) {
								curntLeaveRequest = consolidatedLeaveRequestcollection[i];
							}
						}
					}
				}

				if (!curntLeaveRequest) {
					/*hcm.emp.myleaverequests.utils.UIHelper.errorDialog([this.resourceBundle.getText("LR_DD_GENERIC_ERR"), 
					                                                    "hcm.emp.myleaverequests.view.S1",
					                                                    "_handleRouteMatched",
					                                                    "curntLeaveRequest is null"]);*/
					jQuery.sap.log.warning("curntLeaveRequest is null","_handleRouteMatched","hcm.emp.myleaverequests.view.S1");
					this.oRouter.navTo("home", {},true);
				}else{ 
				var startDate_UTC = hcm.emp.myleaverequests.utils.Formatters.getDate(curntLeaveRequest.StartDate);
				var endDate_UTC = hcm.emp.myleaverequests.utils.Formatters.getDate(curntLeaveRequest.EndDate);
				startDate_UTC = new Date(startDate_UTC.getUTCFullYear(), startDate_UTC.getUTCMonth(), startDate_UTC.getUTCDate(),0,0,0);
				endDate_UTC = new Date(endDate_UTC.getUTCFullYear(), endDate_UTC.getUTCMonth(), endDate_UTC.getUTCDate(),0,0,0);
				_this.oChangeModeData.requestId = curntLeaveRequest.RequestID;
				_this.oChangeModeData.leaveTypeCode = curntLeaveRequest.AbsenceTypeCode;
				_this.oChangeModeData.startDate = startDate_UTC.toString();
				_this.oChangeModeData.endDate = endDate_UTC.toString();
				_this.oChangeModeData.requestID = curntLeaveRequest.RequestID;
				_this.oChangeModeData.noteTxt = curntLeaveRequest.Notes;
				_this.oChangeModeData.startTime = curntLeaveRequest.StartTime;
				_this.oChangeModeData.endTime = curntLeaveRequest.EndTime;
				_this.oChangeModeData.employeeID = curntLeaveRequest.EmployeeID;
				_this.oChangeModeData.changeStateID = curntLeaveRequest.ChangeStateID;
				_this.oChangeModeData.leaveKey = curntLeaveRequest.LeaveKey;
				_this.oChangeModeData.evtType = _this._getCaleEvtTypeForStatus(curntLeaveRequest.StatusCode);

				_this._setUpLeaveTypeData(_this.oChangeModeData.leaveTypeCode);
				_this._copyChangeModeData();
				//disable time inputs if the leaveRange > 1
				if(_this.cale.getSelectedDates().length > 1){
					if (this.timeFrom) {
						this.timeFrom.setValue("");
						this.timeFrom.setEnabled(false);
					}
					if (this.timeTo) {
						this.timeTo.setValue("");
						this.timeTo.setEnabled(false);
					}
				}
				// send button should be disabled if no date is selected
				if (_this.cale && _this.cale.getSelectedDates().length === 0) {
					_this.setBtnEnabled("LRS4_BTN_SEND", false);
				} else {
					_this.setBtnEnabled("LRS4_BTN_SEND", true);
				}
				}
				//sap.ca.ui.utils.busydialog.releaseBusyDialog();
				
				
				/**
	       * @ControllerHook Extend load behavior of change view
	       * This hook method can be used to add UI or business logic 
	       * It is called when the routeMatched event name match with change
	       * @callback hcm.emp.myleaverequests.view.S1~extHookRouteMatchedChange
	       */
				if(this.extHookRouteMatchedChange) {
					this.extHookRouteMatchedChange();
		  	}
		}

	},

	_copyChangeModeData : function() {
		// In change mode the data to be displayed is not entered by the user instead it
		// comes from the LR selected in the history view - This method fills the data coming
		// from the history view into the screen elements of S4
		var _oStartTime = null;
		var _oEndTime = null;
		var _HH = 0;
		var _MM = 0;

		// set Start and End date for calendar
		if (this.oChangeModeData === {}) {
			return;
		}

		this.selRange.start = this.oChangeModeData.startDate;
		this.selRange.end = this.oChangeModeData.endDate;
		if (this.selRange.start === this.selRange.end) {
			this.selRange.end = null;
			if (this.cale) {
				this.cale.toggleDatesSelection([this.selRange.start], true);
			};
		} else {
			if (this.cale) {
				this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
			};
		}
		if (this.cale) {
			this.cale.setCurrentDate(this.selRange.start);
			
			this._setHighlightedDays(this.cale.getCurrentDate());
			
		};

		// set simple ones
		this.requestID = this.oChangeModeData.requestID;
		if (this.note) { // App Designer specific: in case note field was removed
			//remove previous note if exists
			if(!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2) 
				this.byId("LRS4_NOTE").removeContent(1);
			
			//adding note text only if exists
			if(!!this.oChangeModeData.noteTxt && this.oChangeModeData.noteTxt !== "" ){
				var noteText = new sap.m.Text({
					width : "100%",
					wrapping : true,
					layoutData: new sap.ui.layout.ResponsiveFlowLayoutData ({weight: 8})
				});
				noteText.setText(this.oChangeModeData.noteTxt);
				this.byId("LRS4_NOTE").insertContent(noteText,1);
			}
			
		}

		// set start and end Time
		if (typeof this.oChangeModeData.startTime === "string") {
			if (this.timeFrom) {
				if(this.oChangeModeData.startTime === "PT00H00M00S"){
					this.timeFrom.setValue("");
				}else{
					this.timeFrom.setValue(this.oChangeModeData.startTime.substring(2, 4) + ":" + this.oChangeModeData.startTime.substring(5, 7));
				}
			}
			if (this.timeTo) {
				if(this.oChangeModeData.endTime === "PT00H00M00S"){
					this.timeTo.setValue("");
					}else{
						this.timeTo.setValue(this.oChangeModeData.endTime.substring(2, 4) + ":"+ this.oChangeModeData.endTime.substring(5, 7));
					}
			}
		} else {
			_oStartTime = new Date(this.oChangeModeData.startTime.ms);
			_HH = _oStartTime.getUTCHours();
			_MM = _oStartTime.getUTCMinutes();
			_HH = (_HH < 10 ? "0" : "") + _HH;
			_MM = (_MM < 10 ? "0" : "") + _MM;
			if (this.timeFrom) {
				this.timeFrom.setValue(_HH + ":" + _MM);
			}

			_oEndTime = new Date(this.oChangeModeData.endTime.ms);
			_HH = _oEndTime.getUTCHours();
			_MM = _oEndTime.getUTCMinutes();
			_HH = (_HH < 10 ? "0" : "") + _HH;
			_MM = (_MM < 10 ? "0" : "") + _MM;
			if (this.timeTo) {
				this.timeTo.setValue(_HH + ":" + _MM);
			}
			// this.timeFrom = _oStartTime.getHours().toString() + ":" + _oStartTime.getMinutes();
		}
		//if (this.send) {
		if (this.cale & this.cale.getSelectedDates().length === 0) {
			//this.send.setEnabled(false);
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			//this.send.setEnabled(true);
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		};
		//};
	},

	_setInputTimePattern : function() {
		var oTime = new Date();
		var sPattern = "";
		oTime.setHours(23, 30, 59);
		var sTime = hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(oTime);
		if (sTime !== "") {
			var aTimeSegments = sTime.split(":");
			var sHours = "";
			sHours = aTimeSegments[0];
			if (isNaN(sHours)) {
				// in Chinese the am/pm indicator is at the beginning
				sPattern = "a hh:mm";
			} else if (parseInt(sHours) === 23) {
				// use 24 hour pattern - no seconds
				sPattern = "HH:mm";
			} else if (parseInt(sHours) === 11) {
				if (isNaN(aTimeSegments[aTimeSegments.length - 1])) {
					// use 12 hours pattern with am/pm - no seconds
					sPattern = "hh:mm a";
				} else {
					// use 12 hours pattern - no seconds
					sPattern = "hh:mm";
				};
			}
		};
		if (sPattern !== "") {
			this.timeFrom.setDisplayFormat(sPattern);
			this.timeTo.setDisplayFormat(sPattern);
		};
	},

	_clearData : function() {
		// All screen elements that can be changed by a user are set back to their initial values
		// This refresh is done when the screen is started (onNavigateTo) and when a new LR has
		// successfully been submitted (onSubmitLRCsuccess) and when changing/creating a LR is
		// aborted with the cancel button (onCancel)
		// This method does NO refresh of the ajax buffer or the calendarTool buffer
		this._clearDateSel();
		
		if(this._isLocalReset){			
			for (var i = 0; i < this.calSelResetData.length; i++) {
				this.cale.toggleDatesType(this.calSelResetData[i].calEvt, this.calSelResetData[i].evtType, false);
	  	}		
			this.calSelResetData=[];
		}
		
		this.oChangeModeData = {};
		if (this.cale) {
			this.cale.setCurrentDate(new Date());
		};
		if (this.note) { // App Designer specific: in case note field was removed
			this.note.setValue("");
			//remove previous note if exists
			if(!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2) 
				this.byId("LRS4_NOTE").removeContent(1);
		}
		if (this.timeFrom) {
			this.timeFrom.setValue("");
			this.timeFrom.rerender();//workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.timeFrom.setEnabled(true);
		};
		if (this.timeTo) {
			this.timeTo.setValue("");
			this.timeTo.rerender();//workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.timeTo.setEnabled(true);
		};
		//if (this.send) {
		//this.send.setEnabled(false);
		this.setBtnEnabled("LRS4_BTN_SEND", false);
		//};
		if (this.byId("LRS4_LBL_TITLE")) {
			this.byId("LRS4_LBL_TITLE").setText(this.resourceBundle.getText("LR_TITLE_CREATE_VIEW"));
		};

		// set leave type to default absence type + get balances for absence type
		if (this.aLeaveTypes.length > 0 && this.changeMode==false && this._isLocalReset== true) {

			
			var defaultLeaveObj = hcm.emp.myleaverequests.utils.DataManager.getCachedModelObjProp("DefaultAbsenceTypeCode");
			this.slctLvType.setSelectedKey(defaultLeaveObj.DefaultAbsenceTypeCode);
			this._setUpLeaveTypeData(defaultLeaveObj.DefaultAbsenceTypeCode);
			// The selection inthe drop down list needs also to be reset to the default value but
			// setting the selected item programatically in sap.m.list does not work once the selection
			// was done by a real tap event...
			// Therefore then list content is destroyed and rebuild here which also resets the selection.
			// The tap handler will then set the selection to the default value (first list item)
		}

		
		this._isLocalReset = false;
		
		/**
     * @ControllerHook Extend behavior of clearing of data
     * This hook method can be used to add UI or business logic 
     * It is called when the clearData method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookClearData
     */
		if(this.extHookClearData) {
			this.extHookClearData();
  	};
		
	},

	_clearDateSel : function() {
		// remove all selected days from the calendar control and from selRange
		if (this.cale) {
			this.cale.unselectAllDates();
		};
		this.selRange.end = null;
		this.selRange.start = null;
		//if (this.send) {
		//this.send.setEnabled(false);
		this.setBtnEnabled("LRS4_BTN_SEND", false);
		//}
	},

	_initCalendar : function() {
		// Here the initial setup for the calendar and the calendar legend is done
		// this setting is refined depending on the used device and device orientation
		// in deviceDependantLayout() and leaveTypeDependantSettings()
		if (this.cale) {
			this.cale.setSwipeToNavigate(true);
			// handler for paging in calendar
			this.cale.attachChangeCurrentDate(this._onChangeCurrentDate, this);
			// handler for date selection
			this.cale.attachTapOnDate(this._onTapOnDate, this);
			// disable swipe range selection -> we do the range selection using 'tap'
			this.cale.setEnableMultiselection(false);
			// setup display for moth
			this.cale.setWeeksPerRow(1);

		};

		// create legend
		if (this.legend) {
			this.legend.setLegendForNormal(this.resourceBundle.getText("LR_WORKINGDAY"));
			this.legend.setLegendForType00(this.resourceBundle.getText("LR_NONWORKING"));
			this.legend.setLegendForType01(this.resourceBundle.getText("LR_APPROVELEAVE"));
			this.legend.setLegendForType04(this.resourceBundle.getText("LR_APPROVEPENDING"));
			this.legend.setLegendForType06(this.resourceBundle.getText("LR_PUBLICHOLIDAY"));
			this.legend.setLegendForType07(this.resourceBundle.getText("LR_REJECTEDLEAVE"));
			this.legend.setLegendForToday(this.resourceBundle.getText("LR_DTYPE_TODAY"));
			this.legend.setLegendForSelected(this.resourceBundle.getText("LR_DTYPE_SELECTED"));
		};
		
		
		/**
     * @ControllerHook Extend behavior of initializing calendar
     * This hook method can be used to add UI or business logic 
     * It is called when the initCalendar method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookInitCalendar
     */
		if(this.extHookInitCalendar) {
			this.extHookInitCalendar();
  	};
		
	},

	//TODO Orientation
	registerForOrientationChange : function(oApp) {
		// called by Main.controller.js during init
		// registration is only done on tablets
		if (jQuery.device.is.tablet) {
			this.parentApp = oApp;
			oApp.attachOrientationChange(jQuery.proxy(this._onOrientationChanged, this));
		}
	},

	_onOrientationChanged : function() {
		// the dynamic layout for orientation changes is done in leaveTypeDependantSettings
		this._leaveTypeDependantSettings(this.leaveType);
	},

	_onTapOnDate : function(evt) {
		// tap handler for calendar control
		// Depending on the AllowedDurationMultipleDayInd the selection of a single day or a range of days is allowed
		// selecting a singel day: tap on a day
		// deselecting a sngle day: select a different day or tap again on a selected day
		// selecting a range of days: tap on one day to select it then tap an a different day to select both
		// days and all days between them
		// deselecting a range: tapping an a day while a range of days is selected deselects the range and the tapped
		// day becomes selected
		var _aSelction;

		if (this.cale) {
			_aSelction = this.cale.getSelectedDates();
		}

		if (this.leaveType.AllowedDurationMultipleDayInd === false) {
			// there are Absence Types where partial days AND multiple days are allowed
			// || this.leaveType.AllowedDurationPartialDayInd === true) {
			// only one day may be selected at a time
			// no special treatment needed

		} else if (this.leaveType.AllowedDurationMultipleDayInd) {
			// Ranges and single days are allowed
			if (_aSelction.length === 0 || evt.mParameters.didSelect === false) {
				// ************** a selection was removed *****************
				if (this.selRange.start !== null && this.selRange.end !== null) {
					// a selected range was deselected -> the new selection replaces the old}
					this._clearDateSel();
					if (evt.getParameters().date !== "") {
						this.selRange.start = evt.getParameters().date;
						if (this.cale) {
							this.cale.toggleDatesSelection([this.selRange.start], true);
						}
					}
				} else if (this.selRange.start !== null && this.selRange.end === null) {
					// A single field was deselected -> remove selection
					this._clearDateSel();
				}

			}
			// // ************** something was selected *****************
			else if (this.selRange.start === null) {
				// start date of range selected
				this.selRange.start = evt.getParameters().date;
			} else if (this.selRange.end === null) {
				// end date of range selected
				this.selRange.end = evt.getParameters().date;
				if (this.cale) {
					this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
				}
			} else {
				this.selRange.start = evt.getParameters().date;
				this.selRange.end = null;
				// this.selRange.lastTap = null;
				if (this.cale) {
					this.cale.toggleDatesSelection([this.selRange.start], true);
				}
			}
		}

		// if partial days AND multiple days are allowed the time input fields shall only be open
		// for input if a single day is selected
		if (this.leaveType.AllowedDurationMultipleDayInd === true && this.timeFrom && this.timeTo) {
			_aSelction = this.cale.getSelectedDates();
			if (_aSelction.length > 1) {
				this.timeFrom.setValue("");
				this.timeTo.setValue("");
				this.timeFrom.setEnabled(false);
				this.timeTo.setEnabled(false);
			} else {
				this.timeFrom.setEnabled(true);
				this.timeTo.setEnabled(true);
			}

		}

		if (this.cale && this.cale.getSelectedDates().length === 0) {
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		};

		
		/**
     * @ControllerHook Extend behavior of tap on Date
     * This hook method can be used to add UI or business logic 
     * It is called when the onTapOnDate method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookTapOnDate
     */
		if(this.extHookTapOnDate) {
			this.extHookTapOnDate();
  	};
		
	},

	_setHighlightedDays : function(strDate) {
		// This method triggers the reading of the calendar events from the backend for the
		// currently displayed month as well as the previous and next month.
		// Buffering of the calendar events is done in calendarTools.js
		var _oDate;
		//incorporating framework change
		try {
			_oDate = sap.me.Calendar.parseDate(strDate);
			} catch (e) {
				_oDate = new Date(strDate);
			}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_oDate, this._getCalLabelsOK,
				this._getCalLabelsError);
		// do calendar coloring for last month
		
		/*var _oDatePrevious = {};
		if (_oDate.getMonth() === 0) {
			_oDatePrevious = new Date(_oDate.getFullYear() - 1, 11, 1);
		} else {
			_oDatePrevious = new Date(_oDate.getFullYear(), _oDate.getMonth() - 1, 1);
		}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_oDatePrevious, this._getCalLabelsOK,
				this._getCalLabelsError);*/
		// do calendar coloring for next month
		
		/*var _oDateNext = {};
		if (_oDate.getMonth() === 11) {
			_oDateNext = new Date(_oDate.getFullYear() + 1, 0, 1);
		} else {
			_oDateNext = new Date(_oDate.getFullYear(), _oDate.getMonth() + 1, 1);
		}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.CalendarTools.getDayLabelsForMonth(_oDateNext, this._getCalLabelsOK,
				this._getCalLabelsError);*/
		
		
		/**
     * @ControllerHook Extend behavior of highlighted days
     * This hook method can be used to add UI or business logic 
     * It is called when the setHighlightedDays method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookSetHighlightedDays
     */
		if(this.extHookSetHighlightedDays ) {
			this.extHookSetHighlightedDays();
  	};
		
		
	},

	_getCalLabelsOK : function(oCalEvents) {

		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		/*
		 maps the back end status to the corresponding sap.me.calendar event type
		 sap.me.CalendarEventType.Type00 Type00 (non-working day)
		 sap.me.CalendarEventType.Type10 Type10 (working day) ONLY Available after 1.22.x hence we have check
		 sap.me.CalendarEventType.Type01 Type01 (Booked/Approved)
		 sap.me.CalendarEventType.Type04 Type04 (open request / manager action needed)
		 sap.me.CalendarEventType.Type06 Type06 (public holiday)
		 sap.me.CalendarEventType.Type07 Type07 (deletion requested / your action needed/ Rejected)
		 Precedences(low---high) : REJECTED< SENT< (APPROVED|POSTED)
		 It means if you have two leave requests on same day, Approved will more precedence than rejected one.
		 WEEKEND , WORKDAY, PHOLIDAY, (all LEAVE TYPES) are independent. 
		 Hence toggling is needed only b/w leave types
		 */
		if (!!oCalEvents.REJECTED && oCalEvents["REJECTED"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["REJECTED"], sap.me.CalendarEventType.Type07, true);
			_this.cale.toggleDatesType(oCalEvents["REJECTED"], sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents["REJECTED"], sap.me.CalendarEventType.Type01, false);
		}
		if (!!oCalEvents.SENT && oCalEvents["SENT"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["SENT"], sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents["SENT"], sap.me.CalendarEventType.Type04, true);
			_this.cale.toggleDatesType(oCalEvents["SENT"], sap.me.CalendarEventType.Type01, false);
		}
		if (!!oCalEvents.APPROVED && oCalEvents["APPROVED"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["APPROVED"], sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents["APPROVED"], sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents["APPROVED"], sap.me.CalendarEventType.Type01, true);
		}
		if (!!oCalEvents.POSTED && oCalEvents["POSTED"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["POSTED"], sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents["POSTED"], sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents["POSTED"], sap.me.CalendarEventType.Type01, true);
		}
		if (!!oCalEvents.WEEKEND && oCalEvents["WEEKEND"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["WEEKEND"], sap.me.CalendarEventType.Type00, true);
		} 
		if (!!oCalEvents.PHOLIDAY && oCalEvents["PHOLIDAY"].length > 0) {
			_this.cale.toggleDatesType(oCalEvents["PHOLIDAY"], sap.me.CalendarEventType.Type06, true);
		}
		if(!!oCalEvents.WORKDAY && oCalEvents["WORKDAY"].length > 0) {
			if(!!sap.me.CalendarEventType.Type10){
				_this.cale.toggleDatesType(oCalEvents["WORKDAY"], sap.me.CalendarEventType.Type10, true);
			}else {
				_this.cale.toggleDatesType(oCalEvents["WORKDAY"], "", true);
			}	
		}
	},

	_getCaleEvtTypeForStatus : function(sStatus) {
		// maps the back end status to the corresponding sap.me.calendar event type
		// sap.me.CalendarEventType.Type00 Type 00 (non-working day (e.g.
		// sap.me.CalendarEventType.Type01 Type 01 (nonattendance / submitted day)
		// sap.me.CalendarEventType.Type04 Type 04 (open request / manager action needed)
		// sap.me.CalendarEventType.Type06 Type 06 (public holiday)
		// sap.me.CalendarEventType.Type07 Type 07 (deletion requested / your action needed/ Rejected)
		if (sStatus === "WEEKEND") {
			return sap.me.CalendarEventType.Type00;
		} else if (sStatus === "PHOLIDAY") {
			return sap.me.CalendarEventType.Type06;
		} else if (sStatus === "SENT") {
			return sap.me.CalendarEventType.Type04;
		} else if (sStatus === "POSTED" || sStatus === "APPROVED") {
			return sap.me.CalendarEventType.Type01;
		}	else if (sStatus === "REJECTED") {
		  return sap.me.CalendarEventType.Type07;
		} else if (sStatus === "WORKDAY") {
			if(!!sap.me.CalendarEventType.Type10)
            return sap.me.CalendarEventType.Type10;
			else return "";
		} else {
			return "";
		}
	},

	_getCalLabelsError : function(objResponse) {
		//sap.ca.ui.utils.busydialog.releaseBusyDialog();
		hcm.emp.myleaverequests.utils.UIHelper.errorDialog(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
	},

	_onChangeCurrentDate : function(evt) {
		if (this.cale) {
			this._setHighlightedDays(evt.mParameters.currentDate);
		};
	},

	_getStartEndDate : function(aStringDates) {
		var _oDates = [];
		var _oDatesSorted = [];
		var oResponse = {};
		for ( var i = 0; i < aStringDates.length; i++) {
			_oDates[i] = new Date(aStringDates[i]);
		}

		if (_oDates.length === 0) {
			oResponse.startDate = {};
			oResponse.endDate = {};
		} else if (_oDates.length === 1) {
			oResponse.startDate = _oDates[0];
			oResponse.endDate = _oDates[0];
		} else {
			_oDatesSorted = _oDates.sort(function(date1, date2) {
				if (date1 < date2)
					return -1;
				if (date1 > date2)
					return 1;
				return 0;
			});
			oResponse.startDate = _oDatesSorted[0];
			oResponse.endDate = _oDatesSorted[_oDatesSorted.length - 1];
		};

		return oResponse;
	},

	_getLeaveTypesFromModel : function() {
		// This method reads the absence types from the model and fills the information in aLeaveTypes.
		// THis method was done to handle the slightly different formats in which the absence type information
		// is stored in the model -> it can be a single records or an array depending on if mock data or oData data is used
		var _aLeaveTypes = new Array();
		for (var x in this.oDataModel.oData) {
			if (x.substring(0, 21) === "AbsenceTypeCollection") {
				if (this.oDataModel.oData[x] instanceof Array) {
					for ( var i = 0; i < this.oDataModel.oData[x].length; i++) {
						_aLeaveTypes.push(this.oDataModel.oData[x][i]);
					}
				} else {
					_aLeaveTypes.push(this.oDataModel.oData[x]);
				}
			}
		}
		return _aLeaveTypes;
	},

	_setUpLeaveTypeData : function(absenceTypeCode) {
		// When the absence types are read for the first time the user has not yet
		// selected one absence type from the list. Therefore the absence type are
		// initially done for the first absence type of the list.
		if (this.slctLvType) {
			this.slctLvType.setSelectedKey(absenceTypeCode);
		}
		this.leaveType = this._readWithKey(this.aLeaveTypes, "AbsenceTypeCode", absenceTypeCode);
		//if defaultLeave Type is not fount in employee's leave types throw error! can't proceed.
		if(this.leaveType === null){
			hcm.emp.myleaverequests.utils.UIHelper.errorDialog(this.resourceBundle.getText("LR_DD_GENERIC_ERR"));
			jQuery.sap.log.warning("couldn't find defaultLeaveType","_setUpLeaveTypeData","hcm.emp.myleaverequests.view.S1");
		}
		this._leaveTypeDependantSettings(this.leaveType);
		this.getBalancesForAbsenceType(absenceTypeCode);
		this.selectorInititDone = true;
	},

	_readWithKey : function(aList, strKeyName, keyValue) {
		// searches an arry for a given key/value pair and returns the first matching entry
		// used to search the array of absence types
		for ( var i = 0; i < aList.length; i++) {
			if (aList[i][strKeyName] === keyValue) {
				return aList[i];
			}
		}
		return null;
	},

	_getBalancesBusyOn : function() {
		// Removes the "used days" and "remaining days" screen elements and replaces
		// them with busy indicators while the information is read asynchronously from the back end
		//Removal and addition is not optimal so visibilities are changed!		
			this.bookedVacation.setVisible(false);
			this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(true);
			this.remainingVacation.setVisible(false);
			this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(true);
	},

	_getBalancesBusyOff : function() {
		// Removes the busy indicators and replaces them with the "used days" and "remaining days"
		// screen elements as soon as the asynchronous calls to get the information are finished
		//Removal and addition is not optimal so visibilities are changed!
		this.bookedVacation.setVisible(true);
		this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(false);
		this.remainingVacation.setVisible(true);
		this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(false);
	},
	
	_leaveTypeDependantSettings : function(lt) {
		/* Time input visibility is controlled based leaveType selected */
		if (lt.AllowedDurationPartialDayInd) {
			if (this.timeInputElem) {
				this.timeInputElem.setVisible(true);
			};
		} else {
			if (this.timeInputElem) {
				this.timeInputElem.setVisible(false);
			};
		}
	},
	
	_orientationDependancies : function(currentMode){
		/*Months to be visible and layoutData is decided based on device type and orientation*/
		if (jQuery.device.is.phone === true) {
				if (this.cale) {
					this.cale.setMonthsToDisplay(1);
					this.cale.setMonthsPerRow(1);
				};	
		} else {
				if (currentMode == "portrait") {
					if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(5);
					};
					if (this.cale) {
						this.cale.setMonthsToDisplay(1);
						this.cale.setMonthsPerRow(1);
					};
					if (this.formContainer) {
						this.formContainer.getLayoutData().setWeight(5);
					};
				} else if (currentMode == "landscape") {
					if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
					};
					if (this.cale) {
						this.cale.setMonthsToDisplay(2);
						this.cale.setMonthsPerRow(2);
					};
					if (this.formContainer) {
						this.formContainer.getLayoutData().setWeight(3);
					};
				}
		}
	},

	_deviceDependantLayout : function() {
		// This method defines the screen layout depending on the used device.
		// The only mechanism used here to rearrange the screen elements is the line-break
		// function of the sap.ui.commons.form.Form control.
		// The initial screen layout as defined in the html view is used for phones

		// ******************** valid for all devices - start ********************
		if (this.byId("LRS4_FLX_TOP")) {
			this.byId("LRS4_FLX_TOP").addStyleClass("s4leaveTypeSelectorFlx");
		}
		if (this.byId("LRS4_TXT_BOOKEDDAYS")) {
			this.byId("LRS4_TXT_BOOKEDDAYS").addStyleClass("s4BalancesFlxLeft");
		}
		if (this.byId("LRS4_TXT_REMAININGDAY")) {
			this.byId("LRS4_TXT_REMAININGDAY").addStyleClass("s4BalancesFlxRight");
		}
		if (this.byId("LRS4_FLX_ENDTIME")) {
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlx");
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlxEnd");
		}
		if (this.byId("LRS4_FLX_STARTTIME")) {
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlxStart");
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlx");
		}
		// ******************** valid for all devices - end ********************

		if (jQuery.device.is.phone) {
			// ******************** PHONE start ********************
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(false);
			}
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
			}

			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(true);
				this.formContainer.getLayoutData().setWeight(3);
			}

			// ******************** PHONE end ********************
		} else {
			// ******************** TABLET / PC start *******************
			// scrolling is only needed for phone - disabled on other devices
			if (this.byId("S4")) {
				this.byId("S4").setEnableScrolling(false);
			}
			// Calendar - default full day? - Cale takes up complete 1st row
			if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
				this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
			}
			if (this.cale) {
				this.cale.setMonthsToDisplay(2);
				this.cale.setMonthsPerRow(2);
			}

			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(false);
				this.formContainer.getLayoutData().setWeight(3);
			}
			// Balances
			if (this.balanceElem) {
				this.balanceElem.getLayoutData().setLinebreak(false);
			}

			// Time Input
			// - default full day? - Time Input should not be shown
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
				this.timeInputElem.setVisible(false);
			}

			// Note
			if (this.noteElem) {
				this.noteElem.getLayoutData().setLinebreak(true);
			}

			// Legend
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(true);
			}
			if (this.byId("LRS4_FRM_CNT_LEGEND")) {
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9);
			}
			// ******************** TABLET / PC end ********************
		}
		
		
		/**
     * @ControllerHook Extend behavior of device Dependant Layout
     * This hook method can be used to add UI or business logic 
     * It is called when the deviceDependantLayout method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookDeviceDependantLayout
     */
		if(this.extHookDeviceDependantLayout) {
			this.extHookDeviceDependantLayout();
		}
		
	},

	_getDaysOfRange : function(startDate, endDate) {
		var _startDate = null;
		var _endDate = null;
		var aDaysOfRange = [];

		if (startDate instanceof Date) {
			_startDate = new Date(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate());
		} else if (typeof startDate === "string") {
			_startDate = new Date(startDate);
			_startDate = new Date(_startDate.getUTCFullYear(),_startDate.getUTCMonth(),_startDate.getUTCDate());
		}

		if (endDate instanceof Date) {
			_endDate = new Date(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate());
		} else if (typeof endDate === "string") {
			_endDate = new Date(endDate);
			_endDate = new Date(_endDate.getUTCFullYear(),_endDate.getUTCMonth(),_endDate.getUTCDate());
		}

		if (_endDate === null) {
			return [_startDate.toDateString()];
		} else {
			while (_startDate <= _endDate) {
				// add day to result array
				aDaysOfRange.push(_startDate.toDateString());
				// proceed to the next day
				_startDate.setTime(_startDate.getTime() + 86400000);
			}
			return aDaysOfRange;
		}
	},

	onSend : function() {
		this.submit(true);
	},

	submit : function(isSimulation) {
		// This method is called when the "send" button is tapped after entering a new leave request
		// or changing an existing one.
		// The method is called two times during one "submit" event. The first time it is called by the
		// tap event handler of the submit button. This call is done with parameter isSimulation=true. This
		// parameter is passed on to the backend where the data is checked. If the check has a positive result
		// a confirmation popup with a summary of the lr data is show. When the user confirmr this popup this function
		// is called the second time this time not in simulate mode

		var sStartDate, sStartTime, sEndDate, sEndTime;
		// reset globals
		this.bApproverOK = null;
		this.bSubmitOK = null;
		this.oSubmitResult = {};
		this.bSimulation = isSimulation;

		if (this.cale) {
			var _oStartEndDates = this._getStartEndDate(this.cale.getSelectedDates());
			// collect data for submit
			if (this.timeFrom && this.timeTo && this.leaveType.AllowedDurationPartialDayInd) {
				sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.startDate) + 'T00:00:00';
				if(this.timeFrom.getValue() === ""){
					sStartTime = 'PT00H00M00S';
				}else{
					sStartTime = "PT"+ this.timeFrom.getValue().substring(0, 2) + "H" + this.timeFrom.getValue().substring(3, 5) + "M00S";
				}
				sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.endDate) + 'T00:00:00';
				if(this.timeTo.getValue() === ""){
					sEndTime = 'PT00H00M00S';
				}else{
					sEndTime = "PT"+ this.timeTo.getValue().substring(0, 2) + "H" + this.timeTo.getValue().substring(3, 5) + "M00S";
				}
			} else {
				sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.startDate) + 'T00:00:00';
				sStartTime = 'PT00H00M00S';
				sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.endDate) + 'T00:00:00';
				sEndTime = 'PT00H00M00S';
			}
			// submit leave request
			if (!this.oBusy) {
				this.oBusy = new sap.m.BusyDialog();
			}
			this.oBusy.open();
			var notes = "";
			if (this.note) { // App Designer specific: in case note field was removed
				notes = this.note.getValue();
			}
			if (this.changeMode) {
				// if an existing LR is changed additional data is needed to identify the lr to be changed
				hcm.emp.myleaverequests.utils.DataManager.changeLeaveRequest(this.oChangeModeData.employeeID,
						this.oChangeModeData.requestID, this.oChangeModeData.changeStateID, this.oChangeModeData.leaveKey,
						sStartDate, sStartTime, sEndDate, sEndTime, this.leaveType.AbsenceTypeCode, notes, isSimulation,
						this.onSubmitLRCsuccess, this.onSubmitLRCfail);

			} else {
				hcm.emp.myleaverequests.utils.DataManager.submitLeaveRequest(sStartDate, sStartTime, sEndDate, sEndTime,
						this.leaveType.AbsenceTypeCode, notes, isSimulation, this.onSubmitLRCsuccess, this.onSubmitLRCfail);
			}
		
		};
		
		
		/**
     * @ControllerHook Extend behavior of submit
     * This hook method can be used to add UI or business logic 
     * It is called when the submit method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookSubmit
     */
		if(this.extHookSubmit) {
			this.extHookSubmit();
		};
		
	},

	onSubmitLRCfail : function(aErrorMessages) {
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		_this.evalSubmitResult("submitLRC", false, {});
		_this.oBusy.close();
		
		/**
     * @ControllerHook Extend behavior of request submit failure
     * This hook method can be used to add UI or business logic 
     * It is called when the submit method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookOnSubmitLRCfail
     * @param {object} ErrorMessages Object
     * @return {object} ErrorMessages Object
     */
		if(this.extHookOnSubmitLRCfail) {
			aErrorMessages = this.extHookOnSubmitLRCfail(aErrorMessages);
		};
		
		hcm.emp.myleaverequests.utils.UIHelper.errorDialog(aErrorMessages);
	},

	onSubmitLRCsuccess : function(oResult, oMsgHeader) {
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		
		
		/**
     * @ControllerHook Extend behavior of request submit failure
     * This hook method can be used to add UI or business logic 
     * It is called when the submit method executes
     * @callback hcm.emp.myleaverequests.view.S1~extHookOnSubmitLRCsuccess
     * @param {object} oResult Object
     * @param {object} oMsgHeader Object
     * @return {object} Object with oResult and oMsgHeader
     */
		if(this.extHookOnSubmitLRCsuccess) {
			var extResult = this.extHookOnSubmitLRCsuccess(oResult, oMsgHeader);
			oResult = extResult.oResult;			
			oMsgHeader = extResult.oMsgHeader;
		};
		
		_this.oLRSuccessResult = oResult;	
		// get approver for confirmation dialog
		if (_this.bSimulation) {
			
			if(oMsgHeader.severity){
			// show the warning message in a MessageBox
			 if(oMsgHeader.severity=="warning")	{
				 //inject the method into the native prototype for those browsers which don't support trim()
				 if(typeof String.prototype.trim !== 'function') {
					  String.prototype.trim = function() {
					    return this.replace(/^\s+|\s+$/g, ''); 
					  };
					}
				 var detailsMsg = "";
				 oMsgHeader.details.forEach(function(entry) {
					 detailsMsg += decodeURI(entry.message).trim() + '\r\n';
				 });
				 
			   sap.ca.ui.message.showMessageBox({
			       type: sap.ca.ui.message.Type.WARNING,
			       message: decodeURI(oMsgHeader.message).trim(),
			       details: detailsMsg
			   }, 
			   _this._fetchApprover(oResult));
			 }else{
				_this._fetchApprover(oResult);
			 }
			}else{
				_this._fetchApprover(oResult);
			}			
			
		}else{
			
				//hcm.emp.myleaverequests.utils.Ajax.clearCache();
				//hcm.emp.myleaverequests.utils.CalendarTools.clearCache();

				// just for change mode - remove old day markings
				if (_this.cale && _this.changeMode) {
					_this.cale.toggleDatesType(_this
							._getDaysOfRange(_this.oChangeModeData.startDate, _this.oChangeModeData.endDate),
							_this.oChangeModeData.evtType, false);
				}

				sap.m.MessageToast.show(_this.resourceBundle.getText("LR_SUBMITDONE", [_this.sApprover]), {
					// duration : 3000,
					width : "15em"
				// my : "center center",
				// at : "center center",
				// offset : "0 0",
				// collision : "fit fit",
				// onClose : null,
				// autoClose : true,
				// animationTimingFunction : "ease",
				// animationDuration : 1000
				});

				if (_this.changeMode === true) {
					//TODO: back to history
					//var oBus = sap.ui.getCore().getEventBus();
					//oBus.publish("nav", "back");
				}
				// else {
				//_this._clearData();
				//if (_this.cale) {
				//	_this._setHighlightedDays(_this.cale.getCurrentDate());
				//};
				
				_this._clearData();
			 	_this._setUpLeaveTypeData(_this.slctLvType.getSelectedKey());
			 	_this.note.setValue("");
				if (_this.cale) {
					_this.cale.unselectAllDates();
				 
					 var daysOfRange = _this._getDaysOfRange(_this.oLRSuccessResult.StartDate, _this.oLRSuccessResult.EndDate);
					//Updating the Calendar Cache
					 for(var i=0;i<daysOfRange.length;i++){
						 var currDate = new Date(daysOfRange[i]);
						 //get the first day of month and its cache data
						 var firstDayOfMonth = new Date(currDate.getFullYear(),currDate.getMonth(),1);
						 var CalCache = hcm.emp.myleaverequests.utils.CalendarTools.oCache;
						 //check if cache exists for that month
						 if(CalCache.hasOwnProperty(firstDayOfMonth.toString())){
							 var currObj = CalCache[firstDayOfMonth];
							 //find the date in all the other arrays and remove it
							 for (var key in currObj) {
								 if (currObj.hasOwnProperty(key)) {
									 if(currObj[key].length > 0)
									 {
										 for(var j=0;j<currObj[key].length;j++){
											 //direct comparison would lead to erraneous output
											 //hence convert both to dates and then to sting and then compare
											 if((new Date(currObj[key][j])).toString() == (new Date(currDate)).toString()){
												 //delete currObj[key][j]; // DON'T USE because it sets it to undefined
												 currObj[key].splice(j,1);
												 //delete the array if its empty || else it creates trouble in label painting
												 if(currObj[key].length < 1){
													 delete currObj[key];//use delete here, because key is not integer/index
												 }
												 break;
											 }
										 }
									 }
								 }
							 }
							 //push to Approval pending i.e., SENT array
							 //if array exists already
							 if(currObj.hasOwnProperty("SENT"))
								 currObj["SENT"].push(daysOfRange[i]);
							 //else create the array and push
							 else{
								 currObj.SENT = new Array(daysOfRange[i]);
							 }
						 }
					 }
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type06, false);
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type01, false);
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type07, false);
					if(!!sap.me.CalendarEventType.Type10){
						_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type10, false);
					}
					_this.cale.toggleDatesType(daysOfRange,	sap.me.CalendarEventType.Type04, true);
					
				}
		}
		
		_this.oBusy.close();	

	},
	
	_fetchApprover : function(oLRResult){
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		var _oResult = {};
		if(oLRResult.ApproverEmployeeName!=""){
			//reset to selected item. issue with binding trigger. need to check.
			_this.slctLvType.setSelectedKey(_this.leaveType.AbsenceTypeCode);
			
			_oResult.sApprover = _this.sApprover = oLRResult.ApproverEmployeeName;
			_this.evalSubmitResult("getApprover", true, _oResult);
			_this.evalSubmitResult("submitLRC", true, _this.oLRSuccessResult);
			
		}else{
			hcm.emp.myleaverequests.utils.DataManager.getApprover(function(sApprover) {			
				//reset to selected item. issue with binding trigger. need to check.
				_this.slctLvType.setSelectedKey(_this.leaveType.AbsenceTypeCode);
				
				_oResult.sApprover = _this.sApprover = sApprover;
				_this.evalSubmitResult("getApprover", true, _oResult);
				_this.evalSubmitResult("submitLRC", true, _this.oLRSuccessResult);
			
			}, function() {
				_oResult.sApprover = _this.resourceBundle.getText("LR_UNKNOWN");
				_this.evalSubmitResult("getApprover", false, _oResult);
			}, this);
		}

	},

	evalSubmitResult : function(sCaller, bSuccess, oResult) {
		// evaluate the results of two asynchronous calls (submit leave request and get approver) to decide when the
		// confirmation popup can be shown
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();
		if (sCaller === "submitLRC") {
			_this.bSubmitOK = bSuccess;
			_this.oSubmitResult = oResult;
		}
		if (sCaller === "getApprover") {
			_this.bApproverOK = bSuccess;
			_this.sApprover = oResult.sApprover;
		}
		if (_this.bSubmitOK === false) {
			if (_this.oBusy) {
				_this.oBusy.close();
			}
			// errors are already shown by the caller
		} else if (_this.bSubmitOK === true) {
			if (_this.bApproverOK === false) {
				if (_this.oBusy) {
					_this.oBusy.close();
				}
				_this.callDialog(_this.oSubmitResult, _this.sApprover);
			} else if (_this.bApproverOK === true) {
				if (_this.oBusy) {
					_this.oBusy.close();
				}
				_this.callDialog(_this.oSubmitResult, _this.sApprover);
			}
		}
	},

	callDialog : function(oSimResponse, sApprover) {
		// here the confirmation dialog is created which is shown when the "send" button is clicked
		// The generic Dialog popup sap.ca.common.uilib.dialog.dialog is reused.
		var _this = hcm.emp.myleaverequests.utils.UIHelper.getControllerInstance();

		var _from;
		var _to;

		if (jQuery.sap.getUriParameters().get("responderOn")) {
			if (_this.selRange.start === null) {
				try {
					_this.selRange.start = sap.me.Calendar.parseDate(_this.cale.getSelectedDates()[0]);
				} catch (e) {
					_this.selRange.start = new Date(_this.cale.getSelectedDates()[0]);
				}
			}
			_from = _this.selRange.start;
			if(_this.selRange.end === null){
				_to = _this.selRange.start;
			}else{
				_to = _this.selRange.end;
			}
		}else {
			if (_this.leaveType.AllowedDurationPartialDayInd) {
				_from = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.StartDate, "medium");
				_to = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.EndDate, "medium");
				_from += " " + hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(oSimResponse.StartTime);
				_to += " " + hcm.emp.myleaverequests.utils.Formatters.TIME_hhmm(oSimResponse.EndTime);
			} else {
				_from = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.StartDate);
				_to = hcm.emp.myleaverequests.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.EndDate);
			}
		}

		var oSettings = {
			question : this.resourceBundle.getText("LR_CONFIRMATIONMSG", [sApprover]),
			additionalInformation : [
					{
						label : _this.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE"),
						text : this.leaveType.AbsenceTypeName
					},
					{
						label : _this.resourceBundle.getText("LR_FROM"),
						text : _from
					},
					{
						label : _this.resourceBundle.getText("LR_TO"),
						text : _to
					},
					{
						label : _this.resourceBundle.getText("LR_REQUEST"),
						text : hcm.emp.myleaverequests.utils.Formatters.DURATION(oSimResponse.WorkingDaysDuration,
								oSimResponse.WorkingHoursDuration)
								+ " "
								+ hcm.emp.myleaverequests.utils.Formatters.DURATION_UNIT(oSimResponse.WorkingDaysDuration,
										oSimResponse.WorkingHoursDuration)
					}],
			showNote : false,
			title : _this.resourceBundle.getText("LR_TITLE_SEND"),
			confirmButtonLabel : _this.resourceBundle.getText("LR_OK")
		};
		
		
		/**
     * @ControllerHook Modify the Dialog Content
     * This hook method can be used to modify the dialog content
     * It is called when the leave was submitted and oData response was received
     * @callback hcm.emp.myleaverequests.view.S1~extHookCallDialog
     * @param {object} Settings Object
     * @return {object} Settings Object
     */
		if(this.extHookCallDialog) {
			oSettings = this.extHookCallDialog(oSettings);
		};

		sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
			if (response.isConfirmed == true) {
				_this.submit(false);
			}
		});
	},

	onSelectionChange : function(evt) {
		var selectdItem = evt.getParameter("selectedItem");
		var absenceTypeCode = selectdItem.getProperty("key");
		this._setUpLeaveTypeData(absenceTypeCode);
	},

	getBalancesForAbsenceType : function(sAbsenceTypeCode) {
		// Here the balances for the currently displayed absence type are read (currently we display
		// "BalancePlannedQuantity"
		// and "BalanceUsedQuantity").
		// When the balances for an absence type are read for the first time the data will come from the backend. If the
		// same
		// absence type is selected again later on the balances will be read from a buffer in utils.Ajax. This cache is
		// cleared
		// after a LR is created, changed or withdrawn (look for hcm.emp.myleaverequests.utils.Ajax.clearCache())
		if (sAbsenceTypeCode == undefined || sAbsenceTypeCode.length < 1)
			return;

		if (this.bookedVacation) {
			this.bookedVacation.setNumber("-");
		};
		if (this.remainingVacation) {
			this.remainingVacation.setNumber("-");
		};
		this._getBalancesBusyOn();

		var _this = this;

		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.emp.myleaverequests.utils.DataManager.getBalancesForAbsenceType(sAbsenceTypeCode, function(sBalancePlanned,
				sTimeUnitNamePlanned, sBalanceAvailable, sTimeUnitNameAvailable, sTimeAccountTypeName, sBalanceUsed, sBalanceTotalUsedQuantity) {
			
			// Success handler for DataManager.getBalancesForAbsenceType
			_this._getBalancesBusyOff();
			// create json model to bind the values to the s4 screen elements
			var json = {
				BalancePlannedQuantity : sBalancePlanned,
				BalanceAvailableQuantity : sBalanceAvailable,
				BalanceUsedQuantity : sBalanceUsed,
				BalanceTotalUsedQuantity : sBalanceTotalUsedQuantity, 
				TimeUnitName : sTimeUnitNameAvailable
			};
			var oModel = new sap.ui.model.json.JSONModel(json);
			_this.getView().setModel(oModel, "TimeAccount");
			oModel.createBindingContext("/", function(oContext) {
				_this.getView().setBindingContext(oContext, "TimeAccount");
			});

			//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			
		}, function(aErrorMessages) {
			// Error handler for DataManager.getBalancesForAbsenceType
			//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			
			_this._getBalancesBusyOff();
			if (_this.bookedVacation) {
				_this.bookedVacation.setNumber("-");
			}
			_this.bookedVacation.setNumberUnit("-");
			if (_this.remainingVacation) {
				_this.remainingVacation.setNumber("-");
			}
			_this.remainingVacation.setNumberUnit("-");
			hcm.emp.myleaverequests.utils.UIHelper.errorDialog(aErrorMessages);
		}, this);
	},

	onTimeChange : function() {
		// set default value of the endTime picker based on the startTime
		var _endTime = this.byId("LRS4_DAT_ENDTIME").getValue();
		var _startTime = this.byId("LRS4_DAT_STARTTIME").getValue();

		if (this.byId("LRS4_DAT_ENDTIME") && _endTime === "" && _startTime !== "") {
			this.byId("LRS4_DAT_ENDTIME").setValue(_startTime);
		}
		if (this.byId("LRS4_DAT_STARTTIME") && _endTime !== "" && _startTime === "") {
			this.byId("LRS4_DAT_STARTTIME").setValue(_endTime);
		}

	},

	onSendClick : function() {
		this.submit(true);
	},

	onCancelClick : function() {
		if(!this.changeMode){
			this._isLocalReset = true;
			this._clearData();		
			hcm.emp.myleaverequests.utils.CalendarTools.clearCache();
			this._setHighlightedDays(this.cale.getCurrentDate());		
		}else{
			this.oRouter.navTo("master");
		}
	},

	onEntitlementClick : function() {
		this.oRouter.navTo("entitlements", {});
	},

	onHistoryClick : function() {
		this.oRouter.navTo("master", {});
	}

});
