/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.mycalendar.util.Util");
jQuery.sap.require("cus.crm.mycalendar.util.Conversions");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("cus.crm.mycalendar.util.Schema");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.mycalendar.view.AppointmentList", {

	filterAccountID : null, // cross nav filter : AccountID
	filterDate : new Date(), // cross nav filter : DisplayDate
	createFromNote: false,
	bTodayClicked : false, //up-port
	
	createFromOppt: false,
				processType : null,
				AccountName: null,
				title:null,
				ContactName: null,
			opportunityId:null,
			StartDate:null,
	
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to
	 * modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		
		if(!this.oApplicationFacade.getApplicationModel("customizing")){
			cus.crm.mycalendar.util.Util.initCustomizingModel(this);
		}
		

		this.calendarType = "W"; // calendar type W=week, M=month, D=day
		
		this.isMock = this.oApplicationFacade.isMock();
		this.bIsPhone = jQuery.device.is.phone;
        
		
		this.oPage = this.byId("appointmentListPage");
		this.oList = this.byId("l");
		
		//setting viem model to appointment list view
	    this.getView().setModel(new sap.ui.model.json.JSONModel({isSharedCalendar : false}),"vm");	
	
		this.sharedCalendar = sap.ui.xmlfragment(this
				.createId("sharedCalendarFragment"),
				"cus.crm.mycalendar.view.sharedDialog",
		
				this);
		this.oActionSheet = sap.ui.xmlfragment(
				"cus.crm.mycalendar.view.ProcessTypeDialog",
		
				this);
		this.mycalendar=this.byId("mycalendar");
		
		//up-port onAfter Rendering delegate for list - used when today button is clicked
		this.oList.addEventDelegate({onAfterRendering : jQuery.proxy(function(){
			
			//var ref = new sap.ushell.services.URLParsing();
			//var refString = ref.getHash(location.href);
			
			
			var now = new Date(new Date().toDateString());
			if(this.oList.getItems().length > 0 && this.bTodayClicked){
			
				window.setTimeout(jQuery.proxy(function(){this.oCal.fireTapOnDate({
				didSelect : true,
				date : now
			           });
				},this),100);
			
			this.bTodayClicked = false;
			}
		   },this) });
		
		this.oCal = this.byId("cal");
		this.oScroll = this.byId("scroll");
		this.oFilterBar = this.byId("filterPanel");
		this.oFilterText = this.byId("filtertext");
		this.oFooterBar = this.byId("master_footer");
		this.osbtnTimeSwitch = this.byId("sbtnTimeSwitch");

		this.oBundle = this.oApplicationFacade.getResourceBundle();

		var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
		this.oCal.setFirstDayOffset(locale.getFirstDayOfWeek());

		// in phone mode icon, else text for add appointment button
		//this.bIsPhone ? this.byId("btnAdd").setIcon("sap-icon://add") : this.byId("btnAdd").setText(this.oBundle.getText("view.Appointment.add"));
		this.byId("btnAdd").setIcon("sap-icon://add");
		this.oModel = this.oApplicationFacade.getODataModel();
		this.oModel.attachRequestCompleted(this, this.onRequestCompleted, this);
		this.oModel.setCountSupported(false);
		this.oModel.setSizeLimit(5000);
		this.calendarsButton=this.byId("Calendar_type");
		var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		
		this.sBackendVersion = sBackendVersion;
		
		if(parseFloat(sBackendVersion) >= 3){
			this.calendarsButton.setVisible(true);
		}
		else{
			this.calendarsButton.setVisible(false);
		}

		// register for navigation
		this.oRouter.attachRouteMatched(function(oEvent) {
			jQuery.sap.log.info("### nav target:  " + oEvent.getParameter("name"));
			var dDate; 
			
			
			if (oEvent.getParameter("name") === "start" || oEvent.getParameter("name") === "catchall") {
				// check parameter is to early in cross app navigation use-case
				// this.checkStartupParameter();
				jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
				this.onDisplayWeek();
				// required to get correct scroll view size
				this.oCal.rerender();
				this.filterDate = new Date(new Date().toDateString()); // today without time
				this.oCal.toggleDatesSelection([this.filterDate], true);
				this.getAppointmentList();
			}

			if ((oEvent.getParameter("name") === "month") || (oEvent.getParameter("name") === "month_phone")) {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnMonth").getId());
				*/this.onDisplayMonth();
				
				if (oEvent.getParameter("arguments").Date) {
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);					
				
					if (oEvent.getParameter("name") === "month_phone") {
						//--up-port display appointment list in month view in mobile -SV 786701/2014
						this.oList.setVisible(true);
						this.oPage.setEnableScrolling(true);
					} else {
						this.oPage.setEnableScrolling(false);
						this.oList.setVisible(true);
					}
					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}
			if (oEvent.getParameter("name") === "week") {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnWeek").getId());
				*/this.onDisplayWeek();
				
				if (oEvent.getParameter("arguments").Date) {
					
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);					
					this.oList.setVisible(true);

					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}
			
			if ((oEvent.getParameter("name") === "month/account") || (oEvent.getParameter("name") === "month_phone/account")) {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnMonth").getId());
				*/this.onDisplayMonth();
				
				if (oEvent.getParameter("arguments").AccountID) {
					this.filterAccountID = oEvent.getParameter("arguments").AccountID;
					this.setAccountFilterText();
				}
				
				if (oEvent.getParameter("arguments").Date) {
				
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);
					
					if (oEvent.getParameter("name") === "month_phone/account") {
						this.oList.setVisible(false);
					} else {
						this.oList.setVisible(true);
					}
					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}
			if (oEvent.getParameter("name") === "week/account") {
				/*this.osbtnTimeSwitch.setSelectedButton(this.byId("btnWeek").getId());
				*/this.onDisplayWeek();
				
				if (oEvent.getParameter("arguments").AccountID) {
					this.filterAccountID = oEvent.getParameter("arguments").AccountID;
					this.setAccountFilterText();
				}
				
				if (oEvent.getParameter("arguments").Date) {
				
					if (oEvent.getParameter("arguments").Date.charAt(0) === "_"){
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date.substring(1));
						this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
					} else{
						dDate = this.getDatefromParameterString(oEvent.getParameter("arguments").Date);
						this.oCal.toggleDatesSelection([dDate], true);
						this.filterDate = dDate;
					}
					
					this.oCal.setCurrentDate(dDate);
				
					this.oList.setVisible(true);

					jQuery.sap.log.info("### AppointmentList Calendar   ### reRendering");
					// required to get correct scroll view size
					this.oCal.rerender();
					this.getAppointmentList();
				}
			}

			// scroll to filterDate
			var that = this;
			if (this.filterDate) {
				window.setTimeout(function() {
					jQuery.sap.log.info("### AppointmentList Calendar   ### scroll timer");
					that.scrollToDate(that.filterDate, that);
					that.filterDate = null;
					that.setScrollSize();
				}, 1800);
			}

		}, this);

		// correct size after reSize
		var that = this;
		window.onresize = function(evt) {
			that.setScrollSize();
		};
		
		var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		this.oVersioningModel = new sap.ui.model.json.JSONModel({});
		this._loadVersionSpecificUI(sBackendVersion);

	},
	
	_loadVersionSpecificUI : function(sBackendVersion){	
		
		if(sBackendVersion>=2)
			this._loadWave4UI();
		else
			this._loadWave3UI();		
		 	
	},	
		 	
	_loadWave3UI : function(){	

		this.byId('btnAdd').attachPress(jQuery.proxy(this.onCreate1,this)	);
		
		
	},	
		    	
	_loadWave4UI : function(){	

		this.byId('btnAdd').attachPress(jQuery.proxy(this.onCreate,this)	);
	},

	onBeforeRendering : function() {
		jQuery.sap.log.info("### AppointmentList Controller   ### beforeRendering");
		// add settings button & todays button in footer
		
		this.getView().getModel('controllers').getData().apptListController = this;
		this.defineButtons();
		// interpret startup parameter from cross app navigation
		this.checkStartupParameter();
		// set filter text if required (cross nav)
		this.setAccountFilterText();
	},

	onAfterRendering : function() {
		jQuery.sap.log.info("### AppointmentList Controller   ### afterRendering");
		
		if (this.createFromNote) {
			
			this.oRouter.navTo("newappointmentfromnote",{
				processType: this.processType,
				
		});
			
			this.createFromNote = false;
		}
			if (this.createFromOppt) {
		 						
		 			
		 					
		 					//this.oRouter.navTo("newappointmentfromoppt");
		 					this.oRouter.navTo("newappointmentfromoppt", {
		 						processType:this.processType,
		 										
		 					});
		 					
		 					this.createFromOppt = false;
			
		}
	},

	setAccountFilterText : function() {
		var sText = this.oBundle.getText("view.Appointment.filteraccount");

		if (this.filterAccountID) {
			this.oFilterText.setText(sText + " " + this.filterAccountID);
			this.oFilterBar.setHeight("32px");
			this.oFilterBar.setVisible(true);
		} else {
			this.oFilterBar.setVisible(false);
		}
		// read name of account
		if (this.filterAccountID && !this.isMock) {
			var oSearchModel = this.oModel;
			var that = this;
			oSearchModel.read("/AccountCollection('" + this.filterAccountID + "')", null, null, false, function(data, response) {
				if (data.name1) {
					var sText = that.oBundle.getText("view.Appointment.filteraccount");
					that.oFilterText.setText(sText + " " + data.name1);
				}
			});
		}
	},

	checkStartupParameter : function() {
		if (!this.firstTime) {
			this.firstTime = true;
			var oStartupParameter = this.getView().getModel("startupParameters");
			this.filterAccountID = null;
			if (oStartupParameter && oStartupParameter.oData) {
				if (oStartupParameter.oData.parameters) {
					for ( var param in oStartupParameter.oData.parameters) {
						if (oStartupParameter.oData.parameters[param].key == "createFromNote") {
							this.createFromNote = true;
							
						}
						
					if (oStartupParameter.oData.parameters[param].key == "createFromOppt") {
							this.createFromOppt = true;
						}
						if (oStartupParameter.oData.parameters[param].key == "processType") {
							this.processType = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "AccountName") {
							this.AccountName = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "title") {
							this.title = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "ContactName") {
							this.ContactName = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "opportunityId") {
							this.opportunityId = oStartupParameter.oData.parameters[param].value;
						}
						if (oStartupParameter.oData.parameters[param].key == "StartDate") {
							this.StartDate = oStartupParameter.oData.parameters[param].value;
//							delete oStartupParameter.oData.parameters[param];
						}

						if (oStartupParameter.oData.parameters[param].key == "accountID") {
							this.filterAccountID = oStartupParameter.oData.parameters[param].value;
//							delete oStartupParameter.oData.parameters[param];
						}
						if (oStartupParameter.oData.parameters[param].key == "Date") {
							this.filterDate = oStartupParameter.oData.parameters[param].value;
//							delete oStartupParameter.oData.parameters[param];
						}

					}
					if (this.filterDate) {
						var dDate = this.getDatefromParameterString(this.filterDate);
						if (dDate) {
							this.oCal.setCurrentDate(dDate);
						}
					}
					if (this.filterAccountID) {
						// reload of data with correct selection criteria required
						this.getAppointmentList();
					}
				}
			}
//			if ( !this.createFromNote ) {
//				delete oStartupParameter.oData.parameters[param];
//			}
		}
	},

	// callback for odata model
	onRequestCompleted : function(ev) {
		jQuery.sap.log.info("### AppointmentList Controller   ### oData request completed");
		var sText = this.oBundle.getText("view.Appointment.appointment_nodata");
		this.oList.setNoDataText(sText);
		this.setScrollSize();

		if (this.oList.getBinding('items')) {
			var numberOfAppointments = this.oList.getBinding('items').getLength();
			if (typeof cus.crm.myaccounts !== 'undefined' && typeof cus.crm.myaccounts.NavigationHelper !== 'undefined'
					&& typeof cus.crm.myaccounts.NavigationHelper.qty !== 'undefined' ) {
				if (cus.crm.myaccounts.NavigationHelper.qty > numberOfAppointments &&  typeof this.filterAccountID  !== 'undefined') {
					sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("LIST_FILTERED_BY_MYITEMS",
							[numberOfAppointments, cus.crm.myaccounts.NavigationHelper.qty]));

				}
				// Not needed again. Clear the variable
				cus.crm.myaccounts.NavigationHelper.qty = undefined;			
			}
		}
	},

	// read data
	getAppointmentList : function() {
		jQuery.sap.log.info("### AppointmentList Controller   ### getAppointmentList");
		var that=this;
		if(this.selectedEmp){
			this.oPage.setTitle(that.employeeName+" "+that.oBundle.getText("view.Appointment.apptitle"));
		}
		else{
			this.oPage.setTitle(that.oBundle.getText("view.Appointment.apptitle"));
			
		}

		var sText = this.oBundle.getText("view.Appointment.loaddatatext");
		this.oList.setNoDataText(sText);
		var oListItem = this.byId("AppListItem");
		// remove template, because data binding will clone this template / avoid empty AppointmentSet oData call
		this.oList.removeItem(oListItem);

		var aFilter = this.getViewFilters();

		var that = this;
		var oDateSorter = new sap.ui.model.Sorter("FromDate", false, function(oContext) {
			
			var sDate = oContext.getProperty("FromDate");
			var sDateEnd = oContext.getProperty("ToDate");	
			
			if (typeof sDate === "string") {
				// for mock data
				sDate = sDate.replace("/Date(", "").replace(")/", "");
				var iDate = parseInt(sDate);
			  sDate = new Date(iDate);
				sDateEnd = sDateEnd.replace("/Date(", "").replace(")/", "");
			  iDate = parseInt(sDateEnd);
			  sDateEnd = new Date(iDate);				
			} 			
			
			// Try All Day Stuff
			var sAllDayFlag = oContext.getProperty("AllDay");
			
			if (sAllDayFlag) {
				// If true, then adjust the startdate according to the offsets, because all day comes from back end
				// with datetime stamp at GMT				
				var fromDatetimeOffset = sDate.getTimezoneOffset();
				var toDatetimeOffset = sDateEnd.getTimezoneOffset();
				
				sDate.setTime( sDate.getTime() + fromDatetimeOffset * 60 * 1000 );
				sDateEnd.setTime( sDateEnd.getTime() + toDatetimeOffset * 60 * 1000 );			
			}
			
			var dtformatter = sap.ui.core.format.DateFormat.getDateInstance({
				style : "full"
			});

			return {
				key : that.getDateString(sDate),
				text : dtformatter.format(sDate)
			};
		});

		// delete all markers in calendar
		this.oCal.removeTypesOfAllDates(); // is not working for own Types like
		// TypeDot
		this.oCal._removeStyleClassOfAllDates("sapMeCalendarTypeDot");

		// bind data
		this.oList.bindAggregation("items", {
			path : "/AppointmentSet",
			template : oListItem,
			sorter : oDateSorter,
			filters : aFilter,
			groupHeaderFactory : function(oGroup) {
				var header = new sap.m.GroupHeaderListItem({
					title : oGroup.text
				});
				if (oGroup.key === that.getDateString(new Date())) {
					// add style for todays group header
					header.addStyleClass("sapMLabelBold");
				}
				// mark day in calendar
				that.oCal.toggleDatesType([oGroup.key], "TypeDot", true);
				header.setUpperCase(false);
				return header;
			}
		});
	},

	onTodayClick : function(targetDate) {
		// today without timepart
		var now;
		if (targetDate) {
			now = targetDate;
		} else {
			now = new Date(new Date().toDateString());
		}

		if (now < this.calFromRange || this.calToRange < now) {
			// load data --> date/now is not loaded
			this.getAppointmentList();
			//up-port
			this.bTodayClicked = true;
		}
		else{
			// simulate tap on todays day to scroll
			this.oCal.fireTapOnDate({
				didSelect : true,
				date : now
			});
			
		}
		this.filterDate = now;
	},

	onDateClicked : function(oEvent) {
		if (this.calendarType == "D") {
			this.getAppointmentList();
		}
		if (this.bIsPhone && this.calendarType == "M") {
			// navigate to week view only for Phone
			var oClickDate = new Date(oEvent.getParameter("date"));
			this.oCal.setCurrentDate(oClickDate);
			this._buttonDisplayWeek();
			return;
		}
		if (this.calendarType !== "D") {
			// scroll to day in list
			var oClickDate = new Date(oEvent.getParameter("date"));
			
			if (oEvent.getSource().getSelectedDates.length == 0) {
				this.oCal.toggleDatesSelection([oClickDate], true);
			}
			this.scrollToDate(oClickDate, this);
		}
	},

	scrollToDate : function(date, that) {

		
		  var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : 'full'});
		  var dateText = dateTimeFormatter.format(date);
		  var items = that.oList.getItems();
		  var start = items[0].getDomRef().getBoundingClientRect().top;
		  var end = 0;
		  var bFound = false;
		  for(var i = 0; i < items.length; i++){
		  
		      if(!items[i].getBindingContext()){
		    	 items[i].removeStyleClass("sapMLabelBold");
			     if( items[i].getTitle() === dateText){
			      bFound = true;
		          end  = items[i].getDomRef().getBoundingClientRect().top;
		          items[i].addStyleClass("sapMLabelBold");
		       }
			     
		      }
		  
		  }
		  if(bFound){
		  that.byId('scroll').scrollTo(0,that.modulus(start - end),500);
		  }
		
	
	},

	setScrollSize : function() {
		// correct size for startup
		var pFooterRef = this.oFooterBar.getDomRef();
		var pCalRef = this.oCal.getDomRef();

		if (pFooterRef && pCalRef) {
			var posFooter = pFooterRef.getBoundingClientRect();
			var posCal = pCalRef.getBoundingClientRect();
			var size = (posFooter.top - posCal.bottom);
			var sSize = "" + size + "px";
			if (size > 0 && sSize != this.oScroll.getHeight()) {
				this.oScroll.setHeight(sSize);
				jQuery.sap.log.info("### Set scroll size   ### size -- " + size);
				this.oScroll.rerender();
			}
		}
	},

	defineButtons : function() {
		this.oFooterBar.destroyContentLeft();
		// add settings button
		
		
		/*try {
			var oSettingsButton = sap.ushell.services.AppConfiguration.getSettingsControl();
			oSettingsButton.setText("");
			oSettingsButton.setWidth("");
			this.oFooterBar.addContentLeft(oSettingsButton);
		} catch (err) {
			jQuery.sap.log.warning("### Setting button from uShell could not be added  ###");
		}

        */
		
		
		
		// add todays button manually because settings button shall be most left button
		var oBtnToday;
		if (this.bIsPhone) {
			//this.oPage.setShowHeader(false);

			oBtnToday = new sap.m.Button({
				press : jQuery.proxy(this._buttonToday, this),
				icon : "sap-icon://appointment-2"
			});
		} else {
			oBtnToday = new sap.m.Button({
				press : jQuery.proxy(this._buttonToday, this),
				text : "{i18n>view.Appointment.today_tt}"
			});

		}
		this.oFooterBar.addContentLeft(oBtnToday);

		// boarder for calendar
		this.oCal.addStyleClass("calendarBoarder");
	},

	// /////////////////////////////////////////////
	// event handler from sap.me.calendar
	onCurrentDateChanged : function(oEvent) {
		this.getAppointmentList();
		this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
	},

	onDateRangeChanged : function() {
	},
	// /////////////////////////////////////////////

	onDisplayMonth : function(oEvent) {
		this.oCal.setMonthsPerRow(1);
		this.oCal.setWeeksPerRow(1);
		this.oCal.setSingleRow(false);
		this.oCal.setVisible(true);
		this.calendarType = "M";
		this.oCal.setSwipeToNavigate(true);
		this.oCal.unselectAllDates();
			
	},

	onDisplayDay : function(oEvent) {
		this.oCal.setMonthsPerRow(1);
		this.oCal.setWeeksPerRow(1);
		this.oCal.setSingleRow(true);
		this.oCal.setVisible(true);
		this.calendarType = "D";
		this.oCal.setSwipeToNavigate(true);
		this.oCal.unselectAllDates();
	},

	onDisplayWeek : function(oEvent) {
		this.oCal.setMonthsPerRow(1);
		this.oCal.setWeeksPerRow(1);
		this.oCal.setSingleRow(true);
		this.oCal.setVisible(true);
		this.calendarType = "W";
		this.oCal.setSwipeToNavigate(true);
		this.oCal.unselectAllDates();
	},

	// returns relevant filters for the appointment list
	getViewFilters : function() {
		var aDateFilter = [];
 
		var cal = this.byId("cal");
		var sDate = cal.getCurrentDate();
		var oSelDate = new Date(sDate);
		var oDateFrom = new Date(sDate);
		var oDateTo = new Date(sDate);
		var iDayIndex = oSelDate.getDay(); // 0 Sun, 1 Mon....
		var oFromOffset = 0;
		var oToOffset = 0;

    if (this.isMock){
    	// filter not yet supported in mockmode
    	return aDateFilter;
    }		
		
		if (this.calendarType == "W") {
			// week mode
			var iOffset = cal.getFirstDayOffset(); // 0 sunday
			var iOffsetFrom = iDayIndex - iOffset;
			var iOffsetTo = 7 - iOffsetFrom; // 7 days a week

			oDateFrom.setDate(oSelDate.getDate() - iOffsetFrom);
			oDateTo.setDate(oSelDate.getDate() + iOffsetTo); // weekslot
			// minus 1 sec
			oDateTo.setTime(oDateTo.getTime() - 1);

			this.calFromRange = oDateFrom;
			this.calToRange = oDateTo;
		} else if (this.calendarType == "M") {
			// month mode
			var year = oSelDate.getFullYear();
			var month = oSelDate.getMonth();

			oDateFrom = new Date(year, month, 1);
			oDateTo = new Date(year, month + 1, 1); // 1 month + 1 day
			oDateTo.setTime(oDateTo.getTime() - 1); // minus 1 sec

			this.calFromRange = oDateFrom;
			this.calToRange = oDateTo;
		} else if (this.calendarType == "D") {
			// day mode --- just show first selected date
			var sSelection = this.oCal.getSelectedDates()[0];
			if (!sSelection) {
				sSelection = cal.getCurrentDate();
			}
			var oSelection = new Date(sSelection);
			oDateFrom = oSelection;
			oDateTo = oSelection;
			oDateTo.setDate(oDateTo.getDate() + 1); // 1 day
			oDateTo.setTime(oDateTo.getTime() - 1); // minus 1 sec

			this.calFromRange = oSelection;
			this.calToRange = oSelection;
		}

		var oFilter;
			jQuery.sap.log.info("### Query filter   ### search from    -- " + oDateFrom);
			jQuery.sap.log.info("### Query filter   ### search to      -- " + oDateTo);

			oFilter = new sap.ui.model.odata.Filter("FromDate", [{
				operator : "BT",
				value1 : oDateFrom,
				value2 : oDateTo
			}]);
			aDateFilter.push(oFilter);
// Add the user (frontend) timezone offset so that backend can
// look for the time zone adjusted appoinments
			oFromOffset = oDateFrom.getTimezoneOffset();
			oToOffset = oDateTo.getTimezoneOffset();
			oFilter = new sap.ui.model.odata.Filter("FromOffset", [{
				operator : "EQ",
				value1 : oFromOffset			}]);
			aDateFilter.push(oFilter);
			oFilter = new sap.ui.model.odata.Filter("ToOffset", [{
				operator : "EQ",
				value1 : oToOffset			}]);
			aDateFilter.push(oFilter);
			
			
			
			// filter for cross nav use case
			if (this.filterAccountID) {
				oFilter = new sap.ui.model.odata.Filter("Account", [{
					operator : "EQ",
					value1 : this.filterAccountID
				}]);
				aDateFilter.push(oFilter);
			}

			/*// to see only "my appointments"
			// all -> ResponsArea EQ 0
			// my -> ResponsArea EQ X
			oFilter = new sap.ui.model.odata.Filter("ResponsArea", [{
				operator : "EQ",
				value1 : 'X'
			}]);
			aDateFilter.push(oFilter);
		*/

			// to see only "my appointments"
			// all -> ResponsArea EQ 0
			// my -> ResponsArea EQ X
			
			
			if(this.selectedEmp)
				{
				oFilter = new sap.ui.model.odata.Filter("ResponsArea", [{
					operator : "EQ",
					value1 : '0'
				}]);
				aDateFilter.push(oFilter);
				var aFilter1 = new sap.ui.model.Filter("Responsible",
						sap.ui.model.FilterOperator.EQ, this.selectedEmp);
				aDateFilter.push(aFilter1);
				
			
				}
			else{
				oFilter = new sap.ui.model.odata.Filter("ResponsArea", [{
					operator : "EQ",
					value1 : 'X'
				}]);
				aDateFilter.push(oFilter);
			}
		return aDateFilter;
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// conversion functions
	// ///////////////////////////////////////////////////////////////////////////////

	getDateString : function(d) {
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		// Safari browser: The pattern yyyy-MM-dd isn't an officially supported format for Date constructor but yyyy/MM/dd
		var sDate = sYear + "/" + sMonth + "/" + sDay;
		return sDate;
	},

	getDatefromString : function(datetime) {
		// mock data json now "FromDate":
		// "/Date(1356998400000)/",
		datetime = datetime.replace("/Date(", "").replace(")/", "");
		datetime = parseInt(datetime); // number ms
		datetime = new Date(datetime);
		return datetime;
	},

	getDatefromParameterString : function parse(str) {
		// format: yyymmdd --> Date
		if (!/^(\d){8}$/.test(str))
			return null;
		var y = str.substr(0, 4), m = str.substr(4, 2) - 1, d = str.substr(6, 2);
		return new Date(y, m, d);
	},

	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},

	// ///////////////////////////////////////////////////////////////////////////////
	// view interactions
	// ///////////////////////////////////////////////////////////////////////////////

	// Displaying an Appointment
	onAppointmentClicked : function(oEvt) {
		
		var oContext = oEvt.getSource().getBindingContext();
		var bc = oContext.getPath();
		var oData = oContext.getObject(); 
		var checkPrivate = oData.PrivatFlag;
		var description = oData.Description;
		if(checkPrivate==true && this.selectedEmp){
			sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("view.Appointment.privateMessage"));
			
		}
		else{
			if(this.dayActionSheet != undefined)	//Clearing action sheet button when navigating to detail
				this.dayActionSheet = undefined;
			
			var sUUID = this.oModel.getProperty(bc).Guid;
			this.oRouter.navTo("appointment", {
				AppointmentID : sUUID
			},false);}
	},
	onDay:function(oEvent) {
		var that = this;
		if(!this.dayActionSheet){
		this.dayActionSheet = new sap.m.ActionSheet({
			// title : "Choose Your Action",
			// showCancelButton: true,
			placement : sap.m.PlacementType.Top,

			// Adding create an appointment / task buttons

			buttons : [
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.week"),
								enabled:false,
						press : function(evt) {

							that._buttonDisplayWeek();

						},

					}),
					new sap.m.Button({
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.month"),
						press : function(evt) {

							that._buttonDisplayMonth();
						},

					}),

					
					]

		});
		}

		this.dayActionSheet.openBy(oEvent.getSource());

	
	},
	onCalendar:function(oEvent) {
		var that = this;
		if(!this.calendarActionSheet){
		this.calendarActionSheet = new sap.m.ActionSheet({
			// title : "Choose Your Action",
			// showCancelButton: true,
			placement : sap.m.PlacementType.Top,

			// Adding create an appointment / task buttons

			buttons : [
					new sap.m.Button({
						
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.mycalendar"),
						
						enabled:false,
						press : function(evt) {

							that._buttonDisplayMyCalendar();

						},

					}),
					new sap.m.Button({
						
						text : this.getView().getModel("i18n")
								.getProperty("view.Appointment.sharedCalendars"),
						
						press : function(evt) {

							that._buttonDisplaySharedCalendar();
						},

					}),

					
					]

		});
		}

		this.calendarActionSheet.openBy(oEvent.getSource());

	
	},

	// button click: clear Account Filterbar (from CrossApp Navigation)
	onClearFilter : function() {
		this.filterAccountID = null;
		// navigat to get bookmark ... after navigation data is loaded
		//up-port also close the toolbar - set it to visible false 
		this.byId('filterbar').setVisible(false);
		
		if (this.calendarType == "M") {
			this._buttonDisplayMonth();
		} else if (this.calendarType == "W") {
			this._buttonDisplayWeek();
		} else if (this.calendarType == "D") {
			this._buttonDisplayDay();
		}
	},
	
	
	onCreate : function(oEvent) {
		
		//if (!this.oActionSheet) {
			
			 var oModel = this.getView().getModel();
			
			var data1;
			var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
			
			var sUrl;
			if(parseFloat(sBackendVersion) >= 4.0){
			sUrl = "TransactionTypes";
			
			}
			else{
			sUrl = "TransactionTypeSet";			
			}
			var that = this;
			oModel.read( sUrl,null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
					{ 
		                 data1 = {
		                		 TransactionTypeSet : resp.data.results
					    };
		                 
		                 if(parseFloat(sBackendVersion) >= 4){
		                	
		                	 var oCustModel = that.oApplicationFacade.getApplicationModel("customizing");
		                	 var oData = oCustModel.oData;
		                	 oData.TransactionTypeSet = data1.TransactionTypeSet;
		                	 
		                 }
		                
					});
		
			if(data1.TransactionTypeSet.length==1)
			{
			this.onlyOneProcessType=true;
			this.processType=data1.TransactionTypeSet[0].ProcessTypeCode;
			this.ProcessTypeDescription = data1.TransactionTypeSet[0].Description;
			this.PrivateFlag = data1.TransactionTypeSet[0].PrivateFlag;
			this.selectProcess();
			
			}
			else
				{
				
			this.oActionSheet = sap.ui.xmlfragment(
					"cus.crm.mycalendar.view.ProcessTypeDialog",
			
					this);
			this.oActionSheet.setModel(this.getView().getModel(
			"i18n"), "i18n");
			var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData(data1);
            this.oActionSheet.setModel(jsonModel,"json"); 
			this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
			this.oActionSheet._list.setGrowingScrollToLoad(true);
			
			
			this.oActionSheet._dialog.setVerticalScrolling(true);
			this.oActionSheet.open();
				}
	},
	
	selectProcess : function(oEvent) {
		
		var sTransactionType;
		if(this.onlyOneProcessType){
			sTransactionType = this.processType;
		}
		else{
			sTransactionType = oEvent.getParameters().selectedItem.getBindingContext("json").getObject().ProcessTypeCode;
		}
		
		var bReturn = cus.crm.mycalendar.util.Util.getCustomizing(sTransactionType,this);
		
		if(bReturn === false){
			return;
		}
		
		if(this.dayActionSheet != undefined) 	//Clearing action sheet button when navigating to NewAppointment
			this.dayActionSheet = undefined;
		
		if(!this.onlyOneProcessType)
		{
		var selectedItem = oEvent.getParameter("selectedItem");
		if (selectedItem) {
			this.processType= selectedItem.data("ProcessTypeCode");
			this.processTypeDesc = selectedItem.data("ProcessTypeDescription");
			this.PrivateFlag = selectedItem.data("PrivateFlag");
		}
		}

		//this.getView().getController().setBtnEnabled("sort", false);
		//this.getView().getController().setBtnEnabled("BTN_S2_ADD", false);
		
		//Enable footer buttons in Set ListItem
		//this.firstCall="X";
		//sap.ui.getCore().byId('ProcessDialog').close();
	
	   	
		var oCreateDate = this.oCal.getSelectedDates()[0] || this.oCal.getCurrentDate();
		if (typeof oCreateDate === "string") {
			oCreateDate = new Date(oCreateDate);
		}
		var sCreateDate = this.getDateParameterfromDate(oCreateDate);
		
		
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		 if(this.createFromOppt ==="X")
		 					{
		 					this.oRouter.navTo("newappointmentfromnote",
		 					{processType : this.processType
		 					},true);
		 						
		 					}
		else if(this.createFromNote ==="X")
			{
			this.oRouter.navTo("newappointmentfromnote",
			{processType : this.processType
			
			},true);
			
			}
		
		else {
			if(this.PrivateFlag == undefined)
				this.PrivateFlag = false;
		this.oRouter.navTo("newappointment", {
			//contextPath : cPath,
			Date : sCreateDate,
			processType : this.processType,
			privateFlag: this.PrivateFlag
		},false);
		
		}
		 this.onlyOneProcessType=false;
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
	},
	
	
	
//search in process type dialog
	/*searchProcess : function(oEvent){
		var sValue = oEvent.getParameter("value");
		if (sValue !== undefined) {
			// apply the filter to the bound items, and the Select Dialog will update
			oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
		}
	},*/
	searchProcess : function(oEvent){
		var itemsBinding = oEvent
		.getParameter("itemsBinding");
		var that=this;
		var data_len;
		var sText = this.oBundle.getText("view.Appointment.loaddatatext");
		
		this.oActionSheet.setNoDataText(sText);
		var sValue = oEvent.getParameter("value");
		if (sValue !== undefined) {
			// apply the filter to the bound items, and the Select Dialog will update
			itemsBinding.filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
			data_len=itemsBinding.filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)]);
		
		if(data_len.iLength==0){
			var sText = this.oBundle.getText("view.Appointment.no_data_text");
			that.oActionSheet.setNoDataText(sText);
		
		}}},
		onSharedSearch : function(oEvent){
			//this.isSearch=false;
			var aFilters = [];
			var sPath="";
			/*var sValue = oEvent.oSource.getValue();*/
			var sValue = this.sharedCalendar.getSubHeader().getContentLeft()[0].getValue();
			
			var infoTool = this.sharedCalendar.getContent()[0].getInfoToolbar();
			
			var oModel = this.getView().getModel();
			
			var data1;
			if(sValue==""){
				sPath = "EmployeeCollection?$filter=IsMyEmployee eq true";
				infoTool.setVisible(true);
			}
			else{
			 sPath = "EmployeeCollection";
			 infoTool.setVisible(false);
			}
			if(sValue!=""){
			aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains, sValue));
			}
			
			var that=this;
			oModel.read(sPath,{
				  async : true,
				  context : null,
				  urlParameters : null,
				  filters : aFilters,
				  success : function(oData,response){
					  
					  data1 = {
			            		
				    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
				    	
					  }; 
					  var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData(data1);
					    that.sharedCalendar.setModel(jsonModel,"showJson");},
				  error : function(oError){
						
					        }
				  
			  });
			this.sharedCalendar.setModel(this.getView().getModel("i18n"), "i18n");
			//	this.sharedCalendar.setModel(cus.crm.mycalendar.util.Util.getSearchModel(this.oModel.sServiceUrl, this.isMock), "sm");
				/*var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData(data1);
			    this.sharedCalendar.setModel(jsonModel,"showJson");*/
			
			
			
		},
	
	

	// button click: Create New Appointment --> navigate to create screen
	onCreate1 : function(oEvent) {

		var oCreateDate = this.oCal.getSelectedDates()[0] || this.oCal.getCurrentDate();
		if (typeof oCreateDate === "string") {
			oCreateDate = new Date(oCreateDate);
		}
		var sCreateDate = this.getDateParameterfromDate(oCreateDate);
		this.oRouter.navTo("newappointmentw3", {
			Date : sCreateDate
		}, 
		false); // do not write entry in browser history 
	},
	_buttonDisplaySharedCalendar : function(oEvent){
		var oModel = this.getView().getModel();
		
		var data1;
		
			oModel.read("EmployeeCollection?$filter=IsMyEmployee eq true",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
					{ 
			             data1 = {
			            		 EmployeeCollection : resp.data.results
					    };
			            
					});
			
		
		
		this.sharedCalendar.setModel(this.getView().getModel("i18n"), "i18n");
	
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData(data1);
	    this.sharedCalendar.setModel(jsonModel,"showJson");
	    this.getView().getModel("vm").oData.isSharedCalendar = false;
	    
	  /*  var aFilter=[];
		var that=this;
		
		aFilter.push(new sap.ui.model.Filter("IsMyEmployee",sap.ui.model.FilterOperator.EQ, true));
			oModel.read("EmployeeCollection",null,null,false,function(oData,resp) //[ "$filter=ProcessType eq '" + pType+ "'" ]
					{ 
			             data1 = {
			            		 EmployeeCollection : resp.data.results
					    };
			            
					});
		oModel.read("EmployeeCollection",{
			  async : true,
			  context : null,
			  urlParameters : null,
			  filters : aFilter,
			  success : function(oData,response){
				  
				  data1 = {
		            		
			    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
			    	
				  };
				  that.sharedCalendar.setModel(this.getView().getModel("i18n"), "i18n");
					
					var jsonModel = new sap.ui.model.json.JSONModel();
					jsonModel.setData(data1);
				    that.sharedCalendar.setModel(jsonModel,"showJson");
				  
				  },
				  error : function(oError){
						
			        }
				 
			  
		  });*/
			
		
	    //this.sharedCalendar.mAggregations.subHeader.mAggregations.contentLeft[0].setValue("");       //---> prio1 Code check error
	    this.sharedCalendar.getAggregation("subHeader").getAggregation("contentLeft")[0].setValue("");
	    this.onSharedSearch();
		this.sharedCalendar.open();
	},
	closeSharedCalendar : function(oEvent){
		
		this.sharedCalendar.close();
	},
sharedAppointment : function(oEvent){
		
		var selectedItem = oEvent.getParameter("listItem");
		if (selectedItem) {
			this.selectedEmp= selectedItem.getBindingContext('showJson').getObject().employeeID;
			this.employeeName=selectedItem.getBindingContext('showJson').getObject().fullName;
			this.getAppointmentList();
			/*this.mycalendar.setEnabled(true);*/
			this.calendarActionSheet.getAggregation("buttons")[0].setEnabled(true);
			this.getView().getModel("vm").oData.isSharedCalendar = true;
		}
		else{
			this.getView().getModel("vm").oData.isSharedCalendar = false;	
		}
		
		//this.getAppointmentList(this.selectedEmp);
		this.sharedCalendar.close();
	},
_buttonDisplayMyCalendar: function(oEvent) {
	    this.getView().getModel("vm").oData.isSharedCalendar = false;
		this.selectedEmp=null;
		
		this.getAppointmentList();
		this.calendarActionSheet.getAggregation("buttons")[0].setEnabled(false);
		/*this.calendarActionSheet.getAggregation("buttons")[0].setProperty(Enabled,false);*/
		/*this.mycalendar.setEnabled(false);*/
	},
	
	// button click: show todays week/month and todays appointments
	_buttonToday : function() {
		this.oCal.setCurrentDate(new Date()); // navigate to todays month/week
		this.oCal.unselectAllDates();
		this.oCal.toggleDatesSelection([new Date()], true); // mark day as
		// selected
		this.onTodayClick(); // load data
	},

	// button click: calendar in Month View
	_buttonDisplayMonth : function() {
		var sDate; 
		this.dayActionSheet.getAggregation("buttons")[0].setEnabled(true);
		this.dayActionSheet.getAggregation("buttons")[1].setEnabled(false);
		// try to get selected day
		if (this.oCal.getSelectedDates().length > 0) {
			sDate = this.getDateParameterfromDate(new Date(this.oCal.getSelectedDates()[0]));
		} else {
		// indicator _ for not to mark day in target view
			sDate = "_" + this.getDateParameterfromDate(this.calToRange);
		}
		this.onDisplayMonth(null);
		// navigate
		if (this.bIsPhone) {
			if (!this.filterAccountID) {
				this.oRouter.navTo("month_phone", {
					Date : sDate
				},true);
			} else {
				this.oRouter.navTo("month_phone/account", {
					Date : sDate,
					AccountID : this.filterAccountID
				},true);
			}
		} else {
			if (!this.filterAccountID) {
				this.oRouter.navTo("month", {
					Date : sDate
				},true);
			} else {
				this.oRouter.navTo("month/account", {
					Date : sDate,
					AccountID : this.filterAccountID
				},true);
			}
		}
	},

	// button click: calendar in Week View
	_buttonDisplayWeek : function() {
		var sDate;
		this.dayActionSheet.getAggregation("buttons")[0].setEnabled(false);
		this.dayActionSheet.getAggregation("buttons")[1].setEnabled(true);
		// try to get selected day
		if (this.oCal.getSelectedDates().length > 0) {
			sDate = this.getDateParameterfromDate(new Date(this.oCal.getSelectedDates()[0]));
		} else {
			// indicator _ for not to mark day in target view
			sDate = "_" + this.getDateParameterfromDate(this.calFromRange);
		}
		this.onDisplayWeek(null);
		// navigate
		if (!this.filterAccountID) {
			this.oRouter.navTo("week", {
				Date : sDate
			},true);
		} else {
			this.oRouter.navTo("week/account", {
				Date : sDate,
				AccountID : this.filterAccountID
			},true);
		}
	},
	_expandFollowup : function(oEvent) {
		
		  var that=this;
   	      this._actionSheet = new sap.m.ActionSheet({
	      // title: "Choose Your Action",
	      //showCancelButton: true,
	      placement: sap.m.PlacementType.Top,
	
	  // Adding create an appointment / task buttons
	      
	      buttons: [
	        new sap.m.Button({
	        text : this
			.getView().getModel("i18n")
			.getProperty("Appointment"),
			press: function(evt) {
				
	             that.navToAppointmentDialog(evt);
	     	        
			},
	        
	        }),
	      
	      ]
	       
	    });
	     
	
	 this._actionSheet.openBy(oEvent.getSource());
		
	},
	
    navToAppointmentDialog : function(oEvent) {
    	
		 var oModel = this.getView().getModel();
		 var oHeader = this.oModel.getContext("/" + this.sPath).getObject();
		 //this.headerGuid = oHeader.Guid;
		 //this.transactionType = oHeader.ProcessType;
		
		 //var oGuid = this.byId('info').getModel('json').getData().Guid;
		 //var oTransType = this.byId('info').getModel('json').getData().ProcessType;
		var data1;
        var sBackendVersion = cus.crm.mycalendar.util.Schema._getServiceSchemaVersion(this.oModel,"Appointment");
		
		oModel.read(((parseFloat(sBackendVersion) >= 4.0)) ? "TransactionTypes" : "TransactionTypeSet",null,null,false,function(oData,resp) 
				{ 
	                 data1 = {
	                		 TransactionTypeSet : resp.data.results
				    };
	                
				});
		
				
				if(data1.TransactionTypeSet.length==1)
				{
				this.onlyOneProcessType=true;
				this.processType=data1.TransactionTypeSet[0].ProcessTypeCode;
				this.selectProcess();
				
				}
				else
					{
					
				this.oActionSheet = sap.ui.xmlfragment(
						"cus.crm.mycalendar.view.ProcessTypeDialog",
				
						this);
				this.oActionSheet.setModel(this.getView().getModel(
				"i18n"), "i18n");
				var jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setData(data1);
	            this.oActionSheet.setModel(jsonModel,"json"); 
				this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));
				this.oActionSheet._list.setGrowingScrollToLoad(true);
				
				
				this.oActionSheet._dialog.setVerticalScrolling(true);
				this.oActionSheet.open();
					
			}
		
		
		
	// setting appointment flag to navigate to Appointment application	
		
		
   },

	// button click: calendar in Day View
	_buttonDisplayDay : function() {
		// navigate
	},
	modulus : function(number){

		 if(number < 0){
		   return -number;
		 }
		return number;
		},
		
		
		
});
