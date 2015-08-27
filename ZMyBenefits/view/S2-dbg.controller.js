/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */






jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.emp.mybenefits.view.S2", {
/*	onBeforeShow:funcion(){
		
	},*/
	onInit: function() {
		// execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);

		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		this.masterListCntrl = this.byId("list");
		this.objBenfitsCollection = null;

		this._fnRefreshCompleted = null;
		this.dateChangeFlag=false;
		/* if (jQuery.device.is.phone) {
	            this.getView().addEventDelegate({onBeforeShow : jQuery.proxy(this.onBeforeShow , this)}, this);
	        }*/
		hcm.emp.mybenefits.util.DataManager.setCachedModelObjProp("benefitsPlan",{});
		this.byId("S2DatePicker").setDateValue(new Date()); //note ca.ui to m.datePicker
		
		this._initData();
		
		this._isLocalRouting = false;
		this._isInitialized = false;
		
		this.flag=true;//true for enrolled,false for unenrolled
		this.refreshFlag=false;
	},
	 /*onBeforeShow : function () {
		 this._initData();
	    },*/
	setLeadSelection : function() {
		var oItems = this.masterListCntrl.getItems();
	if(oItems.length<1){
		//this.getList().setNoDataText(this.resourceBundle.getText("NO_ITEMS_AVAILABLE")); // Note: improper display of no data text
		if (!sap.ui.Device.system.phone) {
			this.oRouter.navTo('noData', {
				viewTitle: 'MB_APP_DETAIL_TITLE',
				languageKey: sap.ui.getCore().getConfiguration().getLanguage()
			}, !jQuery.device.is.phone);
			
	       }
	}
	else{
   // this.setListItem(oItems[1]);
		var firstItem = this._oApplicationImplementation.getFirstListItem(this);
    if (firstItem) {
    	var item=firstItem.getAttributes()[0].getText();
    	if(item!="Show Details") //to ensure show details button is not selected by default when there are no enrolled plans
        this.setListItem(firstItem);
    	/*else
    	this.showEmptyView("MB_APP_DETAIL_TITLE","MB_NO_DATA");
*/    }
	}
},

	 _handleRouteMatched : function(oEvent) {

		// to use cached data for local routing
		if (oEvent.getParameter("name") === "master" && this._isLocalRouting == false) {
			this._initData();
		}

		//reset flag
		if(oEvent.getParameter("name") === "master" && this._isLocalRouting === true){
			this._isLocalRouting = false;
		}

	},
	_initData : function(){		
		var _this = this;
		hcm.emp.mybenefits.util.DataManager.init(this.oDataModel, this.resourceBundle);  

		if(!this.dateChangeFlag)
		{
		var d = new Date();
		var dd = ('0' + d.getDate()).slice(-2).toString();
		var mm = ('0' + (d.getMonth() + 1)).slice(-2).toString();
		var yyyy = d.getFullYear();
		
		this.todayDate = dd + "-" + mm + ", " + yyyy;
		this.date=d;
		
		// Fill date filter
		this.filterDate = dd + mm + yyyy;
		/*}*/}
		this.filter = [ "$filter=AsOn eq '" + this.filterDate + "' and Type eq 'Enrolled'" ];
		
		//get enrolled items
		hcm.emp.mybenefits.util.DataManager.getMasterList(this.refreshFlag,this.dateChangeFlag,this.filter,function(objResponse) {
			var tempRefresh=_this.refreshFlag;//holds status of refresh 
			_this.objBenfitsCollection = {"Benefits" : objResponse};
			hcm.emp.mybenefits.util.DataManager.setCachedModelObjProp("benefitsPlan",_this.objBenfitsCollection);
			
			try{
			if (_this.objBenfitsCollection/*.Benefits.length>0*/) {
				_this.masterListCntrl.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));//should have enrolled initially
            	
				_this._isLocalRouting = true;

				this.oSorter = new sap.ui.model.Sorter("StatusCode", false, function(oContext) {
					var skey = oContext.getProperty("StatusCode").trim();
					return skey;
				});
				if(_this.masterListCntrl.getItems().length>0)_this.masterListCntrl.removeAllItems();//clear the master list before binding new data
				_this.masterListCntrl.bindItems({
					path : "/Benefits",
					template :new sap.m.ObjectListItem({
						type:"{device/listItemType}",
						title:"{PlanTypeText}",
						attributes: [
						             new sap.m.ObjectAttribute({
						            	 text:"{PlanSubTypeText}"
						             }),
						             new sap.m.ObjectAttribute({
						            	 text:"{PlanOptionText}"
						             })],
						             firstStatus:
						            	 new sap.m.ObjectStatus ({
						            		 text:"{StatusText}",
						            		 state:"Error"
						            	 }),
						            	 press : jQuery.proxy(_this._handleItemPress,_this)
					}),
					sorter: this.oSorter
				});
				//avoids multiple group headers
				var iInsertIndexRem = 0;
				jQuery.each(_this.masterListCntrl.getItems(), function(i, oItem) {
					if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
						// determine the item type
						_this.masterListCntrl.removeItem(i - iInsertIndexRem);
						iInsertIndexRem = iInsertIndexRem + 1;
					}
				});
				if(objResponse.length>=0||tempRefresh)
					{
				//add show details
		        var  LastItem=new sap.m.ObjectListItem({
					type:"{device/listItemType}",
					title:"",
					attributes: [
					             new sap.m.ObjectAttribute({
					            	 text:_this.resourceBundle.getText("MB_SHOW_DETAILS")
					             }),
					             new sap.m.ObjectAttribute({
					            	 text:""
					             })],
					             firstStatus:
					            	 new sap.m.ObjectStatus ({
					            		 text:"{StatusText}",
					            		 state:"Error"
					            	 })
				});
		        _this.masterListCntrl.addItem(LastItem);
				}
		        _this.originalaItems= _this.masterListCntrl.getItems();
				_this.handleSort();
				_this._bIsMasterRoute = true;
				//_this._selectDetail();
				/*var yyyymmddDate=_this.masterListCntrl.getInfoToolbar().getContent()[1]._toDateStringYYYYMMDD(new Date());
				_this.masterListCntrl.getInfoToolbar().getContent()[1].mProperties.value=yyyymmddDate.substr(6,2)+"-"+yyyymmddDate.substr(4,2)+"-"+yyyymmddDate.substr(0,4);*/
				var yyyymmddDate=_this.filterDate;
				_this.refreshHeaderFooterForEditToggle();
				//Note:2057772
				var formattedDate= yyyymmddDate.substr(2,2)+"-"+yyyymmddDate.substr(0,2)+"-"+yyyymmddDate.substr(4,4);
				//	_this.masterListCntrl.getInfoToolbar().getContent()[1].mProperties.value=formattedDate;
					_this.byId("S2DatePicker").setDateValue(new Date(formattedDate));
				//End Note:2057772
				if(_this._fnRefreshCompleted)
				{
					_this._fnRefreshCompleted();
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
				}
			}
			
				
			}catch(err)
		    {
		    	jQuery.sap.log.warning(err);
				
		    }
	   
			if(!jQuery.device.is.phone && !_this._isInitialized){
				_this.registerMasterListBind(_this.masterListCntrl);						
				_this._isInitialized = true;
			}
			if(!jQuery.device.is.phone){
				if(tempRefresh /*&& _this.itemSelectedExists*/){
					for(var i=0;i<_this.masterListCntrl.getItems().length;i++)
						{
						var indepItem=_this.masterListCntrl.getItems()[i];
						if((indepItem.getBindingContext()))
						{
						var aItem=indepItem.getBindingContext();
						var key1=aItem.getProperty("PlanCategory");
						var key2=aItem.getProperty("PlanTypeKey");
						var key3=aItem.getProperty("PlanSubTypeKey");
						if(key1==_this.selectedItemKey1 && key2==_this.selectedItemKey2 && key3==_this.selectedItemKey3)
							{
							_this.setListItem(_this.masterListCntrl.getItems()[i]);
							break;
							}
						}
						
						}
					if(i==_this.masterListCntrl.getItems().length)_this.setLeadSelection();//if selected item not found in initial list select first item
					_this.refreshFlag=false;//refresh done 
				}
				else
					{
				_this.setLeadSelection();
					}
			}			
		}, function(objResponse) {
			hcm.emp.mybenefits.util.DataManager.parseErrorMessages(objResponse);
		});

	},

	/**
	 * [setListItem description]
	 * @param {[type]} oItem [description]
	 */
	setListItem: function(oItem) {
		
		var showDetailsItem=oItem.getAttributes()[0].getText();
		if(showDetailsItem=="Show Details"){
			oItem.setVisible(false);
			this.flag=false;
			/*this.refreshCall="both";*/
			this.filter=[ "$filter=AsOn eq '" + this.filterDate + "' and Type eq 'Unenrolled'" ];
			this.fetchUnEnrolled(this.filter);
		}
		if (undefined !== oItem.getBindingContext()) {
			var bindingContext = oItem.getBindingContext();
			var planCategory = bindingContext.getProperty("PlanCategory");
			var planType = bindingContext.getProperty("Type");
			var viewName = this._chooseView(planCategory, planType);

			oItem.setSelected(true);
			this.getList().setSelectedItem(oItem, true);
			
			this.oRouter.navTo(viewName, {
				contextPath: encodeURIComponent(bindingContext.sPath.substr(1))
			}, !jQuery.device.is.phone);
		}
		this._isLocalRouting = true;
		if(jQuery.device.is.phone){ //Note: removes the selections on going back to the master list on phone
			this.masterListCntrl.removeSelections();
		}//End Note
	},

	fetchUnEnrolled:function(filter){
		var _this = this;

		hcm.emp.mybenefits.util.DataManager.getbothMasterList(filter,function(objResponse) {
			_this.objBenfitsCollection = objResponse;
			try{
				if (_this.objBenfitsCollection) {
					_this.masterListCntrl.setModel(new sap.ui.model.json.JSONModel(_this.objBenfitsCollection));//should have enrolled initially
					var iInsertIndexRem = 0;
					jQuery.each(_this.masterListCntrl.getItems(), function(i, oItem) {
						if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
							// determine the item type
							_this.masterListCntrl.removeItem(i - iInsertIndexRem);
							iInsertIndexRem = iInsertIndexRem + 1;
						}
					});
					_this.originalaItems= _this.masterListCntrl.getItems();
					_this.handleSort();
					_this._bIsMasterRoute = true;
					var yyyymmddDate=_this.filterDate;
					_this.refreshHeaderFooterForEditToggle();//handle the count in the header
					_this.masterListCntrl.getInfoToolbar().getContent()[1].mProperties.value=yyyymmddDate.substr(0,2)+"-"+yyyymmddDate.substr(2,2)+"-"+yyyymmddDate.substr(4,4);
					if(_this._fnRefreshCompleted)
					{
						_this._fnRefreshCompleted();
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
					}
					
					}
				if(!jQuery.device.is.phone){
					_this.setLeadSelection();
					}
			}
			catch(err)
			{
				jQuery.sap.log.warning(err);

			}
		},function(objResponse) {
			hcm.emp.mybenefits.util.DataManager.parseErrorMessages(objResponse);
		});	
	},

	/**
	 * [_chooseView description]
	 * @param  {[type]} planCategory [description]
	 * @param  {[type]} planType     [description]
	 * @return {[type]}              [description]
	 */
	_chooseView: function(planCategory, planType) {
		var viewName = "";
		if (planType == "Enrolled" || planType == "Pending") {
			switch (planCategory) {
			case "A":
				viewName = "Health"; // "Health"
				break;
			case "B":
				viewName = "Insurance"; // "Insurance"
				break;
			case "C":
				viewName = "Savings"; // "Savings";
				break;
			case "D":
				viewName = "FSA"; // "FSA"
				break;
			case "E":
				viewName = "Miscellaneous"; // "Miscellaneous"
				break;
			case "F":
				viewName = "Savings"; // "Savings";
				break;
			}
		} else if (planType == "Unenrolled") {
			viewName = "Unenrolled"; // UnEnrolled
		}
		return viewName;
	},

	/**
	 * @override
	 *
	 * @param oItem
	 * @param sFilterPattern
	 * @returns {*}
	 */
	applySearchPatternToListItem: function(oItem, sFilterPattern) {

		if (undefined !== oItem.getBindingContext())
			if (sFilterPattern.substring(0, 1) === "#") {
				var sTail = sFilterPattern.substr(1),
				sDescr = oItem.getBindingContext().getProperty("Name").toLowerCase();
				return sDescr.indexOf(sTail) === 0;
			} else {

				if (sFilterPattern === "") {
					return true;
				}
				var oIteshellData = oItem.getBindingContext().getProperty("PlanTypeText");
				if(oIteshellData.toLowerCase().indexOf(sFilterPattern) != -1) {
					return true;
				}
				// if nothing found in unformatted data, check UI
				// elements
				return false;
			}
	},

	applySearchPattern : function(sFilterPattern) {
		var aListItems = this.originalaItems,
		matchingListItems=[],
		bVisibility,
		sFilterPattern = sFilterPattern.toLowerCase(),
		iCount = 0;
		if(sFilterPattern !== ""){
			for ( var i = 0; i < aListItems.length; i++) {
				bVisibility = this.applySearchPatternToListItem(aListItems[i], sFilterPattern);
				//aListItems[i].setVisible(bVisibility);
				if (bVisibility) {
					matchingListItems.push(aListItems[i]);
					iCount++;
				}
				
			}
			if(matchingListItems.length==0){
				if (!sap.ui.Device.system.phone) {
					this.oRouter.navTo('noData', {	
						viewTitle: 'MB_APP_DETAIL_TITLE',
						languageKey: sap.ui.getCore().getConfiguration().getLanguage()
					}, !jQuery.device.is.phone);
				 }				
			}
		}else{
			matchingListItems= this.originalaItems;//on cancel set it back to the prev list
			iCount = this.originalaItems.length;
		}

		
		this.handleSort(matchingListItems);
		this.masterListCntrl.removeSelections();
		if(this._fnRefreshCompleted)
		{
			this._fnRefreshCompleted();
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}
		return iCount;
	},
	
	/**
	 * [handleChange description]
	 * @param  {[type]} evt [description]
	 * @return {[type]}     [description]
	 */
	handleChange: function(evt) {

		// get selected date

	

		var oDate = evt.getParameters().newValue;
		
		
		// construct date in DDMMYYYY format
		var valueArray = oDate.split("-"),
		year = valueArray[2],
		month = valueArray[1],
		date = valueArray[0],
		
		_this=this;
		
		//check for invalid input in date field							Note:2057772
		oDate = date + month + year;
		if(Number(oDate).toString()==="NaN")
		{
			var d = new Date();
		var dd = ('0' + d.getDate()).slice(-2).toString();
		var mm = ('0' + (d.getMonth() + 1)).slice(-2).toString();
		var yyyy = d.getFullYear();
			oDate = dd + mm + yyyy;
		}
		_this.filterDate = oDate;
		_this.tempDate=oDate;
		//oDate = date + month + year;
		/*oBindingList = this.byId("list").getBinding("items");

		if (oBindingList) {
			// execute filtering for the list binding
			oBindingList.filter(new sap.ui.model.Filter("AsOn", sap.ui.model.FilterOperator.EQ, oDate));
			// preserving this below comment for reference in case the registerMastserListBind didnt work
			//oBindingList.attachChange(this.onDataLoaded, this);
			this.registerMasterListBind(this.getList());
		}*/

		//_this.filterDate = oDate;
		//end Note:2057772
		_this.dateChangeFlag=true;
		_this.flag=true;//on change of date only go for enrolled whose flag value is true
		if(_this._oControlStore.oMasterSearchField.getValue()){
			_this._oControlStore.oMasterSearchField.clear();
			}
		_this._initData();
		_this.dateChangeFlag=false;
		
	},


	handleSort: function(matchedItems) {

        var self = this,
            iInsertIndexRem = 0,
            oList = this.byId("list"),
            sSortParam = "StatusCode",
            bGrouping = true;

        // Remove the headers of the current grouping
        jQuery.each(oList.getItems(), function(i, oItem) {
            if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
                // determine the item type
                oList.removeItem(i - iInsertIndexRem);
                iInsertIndexRem = iInsertIndexRem + 1;
            }
        });

        // sort the list items
        var aItems = oList.getItems();
        // check for the call coming from search if yes see the items which it has sent
        // i.e, matchedItems
        if(undefined!==matchedItems &&  null!== matchedItems){
             aItems=matchedItems;
          }
         else{
           // if the call hasn't come from the search then we need to take the original list
            aItems=this.originalaItems;
          }

        aItems.sort(function(a, b) {
			if(a.getBindingContext()){
				var valueA = a.getBindingContext().getProperty(sSortParam);
			}else{
				var valueA = null;
				//return -1;
			}
			if(b.getBindingContext()){
				var valueB = b.getBindingContext().getProperty(sSortParam);
			}else{
				var valueB = null;
				//return -1;
			}
			/*var valueA = a.getBindingContext().getProperty(sSortParam);
                  var valueB = b.getBindingContext().getProperty(sSortParam);*/
			return self.compareFunction(valueA, valueB);
		});

        // Remove all items from the current list
        oList.removeAllItems();

        // Add items in the right order and add grouping headers
        var iIndexAdd = 0;
        var iGroupingNumber = 0;
        var oGroupHeaderItem, sGroupValue;

        jQuery.each(aItems, function(i, oItem) {

        	if(oItem.getBindingContext()){
				var oCurrentValue = oItem.getBindingContext().getProperty("StatusCode");	
			}
			else if(oItem.getAttributes()[0].getText())
			{
				if(oItem.getAttributes()[0].getText()=="Show Details"){oCurrentValue = "2U";}
				
			}

            // Write a default text if no Grouping Value is available
            if (oCurrentValue === "") {
                oCurrentValue = "UnGrouped";
            }

            // Insert grouping header if requested
            if (bGrouping && ((i === 0) || oCurrentValue != sGroupValue)) {

                // Set the count value to the previous grouping header
                // --> this case only works if another grouping header follows
                if (i !== 0) {
                    oGroupHeaderItem.setCount(iGroupingNumber);
                }
                sGroupValue = oCurrentValue;
                oGroupHeaderItem = new sap.m.GroupHeaderListItem({
                    title: self.getGroupHeader(oCurrentValue), //sGroupValueText,
                    uppercase: false
                });
                oList.insertItem(oGroupHeaderItem, i + iIndexAdd);
                iIndexAdd = iIndexAdd + 1;
                iGroupingNumber = 0;
            }

            // Set the count to the last grouping header
            // --> relevant if it is the last or only grouping header in the list
            else if ((bGrouping) && ((i + 1) === aItems.length || ((i + 1) === aItems.length && i === 0))) {
                iGroupingNumber = iGroupingNumber+1;
                oGroupHeaderItem.setCount(iGroupingNumber);
            }

            //check for the last item it doesnt contain the count value so add the count 1 to it since it will
            // from zero
             if (!self.flag && (i + 1) === aItems.length){ //self.flag ensures that show details header do not get the count value
               if("" === oGroupHeaderItem.mProperties.count)
               iGroupingNumber = iGroupingNumber+1;
                oGroupHeaderItem.setCount(iGroupingNumber);
             
           }
            iGroupingNumber = iGroupingNumber + 1;
            oList.addItem(oItem);

        });
 },

	// Compare search values
	compareFunction: function(a, b) {

		if (b === null) {
			return -1;
		}
		if (a === null) {
			return 1;
		}
		if (typeof a === "string" && typeof b === "string") {
			return a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase());
		}
		if (a < b) {
			return -1;
		}
		if (a > b) {
			return 1;
		}
		return 0;
	},

	getGroupHeader: function(groupid) {

		var returnValue = "";
		switch (groupid) {
		case "0P":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_PENDING");
			break;
		case "1A":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_HEALTH");
			break;
		case "1B":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_INSURANCE");
			break;
		case "1C":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_SAVINGS");
			break;
		case "1D":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_FSA");
			break;
		case "1E":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_MISC");
			break;
		case "1F":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_STOCK");
			break;
		case "2U":
			returnValue = this.resourceBundle.getText("MB_LIST_HEADER_UNENROLLED");
			break;
		}
		return returnValue;
	},


	getViewSummary: function() {

		var oView = this.getView(),
		// get selected date
		oDate = oView.byId('list').getInfoToolbar().getContent()[1].getValue(),
		// construct date in DDMMYYYY format
		valueArray = oDate.split("-"),
		year = valueArray[2],
		month = valueArray[1],
		date = valueArray[0],
		oDate = date + month + year;

		//Get connection manager/resource bundle
		//Note:2057772 removal of hardcoded url
		var pdfURL   = /*"/sap/opu/odata/sap/" 
			+ this.oApplicationFacade.oApplicationImplementation.oConfiguration.getServiceList()[0].name
			+ "/FileDataSet(FileKey='CONF_FORM',Date='" + oDate + "')/$value",*/ 							//remove hard coding
			this.oApplicationFacade.oApplicationImplementation.oConfiguration.getServiceList()[0].serviceUrl
			+ "FileDataSet(FileKey='CONF_FORM',Date='" + oDate + "')/$value",
			//end Note:2057772 
			query    = "?",
			amperSand = "&",
			sapserver = "",
			sapclient = "sap-client="+jQuery.sap.getUriParameters().get("sap-client");
		if(location.host.indexOf("localhost")!=-1)
		{
			sapserver="sap-server=gm6-http"+amperSand;
		}
		pdfURL += query+sapserver+sapclient;

		sap.m.URLHelper.redirect(pdfURL, true);
	},

	/**
	 * [getHeaderFooterOptions description]
	 * @return {[type]} [description]
	 */
	getHeaderFooterOptions: function() {

		var oList = this.byId("list");
		var count = oList.getItems().length;

		jQuery.each(oList.getItems(), function(i, oItem) {
			if (!(oItem.getBindingContext())) { // TODO: only a quick solution! Check for a better solution to
				count--;
			}
		});
		

		return {
			sI18NMasterTitle: this.resourceBundle.getText("MB_MASTER_TITLE", [count]),
			buttonList: [{
				sI18nBtnTxt: this.resourceBundle.getText("MB_CONFIRMATION"),
				onBtnPressed: jQuery.proxy(function(event) {
					this.getViewSummary(event);
				}, this)
			}, ],
			onRefresh: jQuery.proxy(function(searchField, fnRefreshCompleted){
				this.refreshFlag=true; 
				this.flag=true;
				this._fnRefreshCompleted = fnRefreshCompleted;
				
				hcm.emp.mybenefits.util.DataManager.setCachedModelObjProp("benefitsPlan",{});
				if(this.masterListCntrl.getSelectedItem()){
					var selectedItemB4Refresh=this.masterListCntrl.getSelectedItem().getBindingContext();
					this.selectedItemKey1=selectedItemB4Refresh.getProperty("PlanCategory");
					this.selectedItemKey2=selectedItemB4Refresh.getProperty("PlanTypeKey");
					this.selectedItemKey3=selectedItemB4Refresh.getProperty("PlanSubTypeKey");
				}
				if(searchField){//Note:Remove search field before refresh
				this._oControlStore.oMasterSearchField.clear();
				}//end note
				this._initData();
			}, this),
		};
	},

	/**
      * @public [isMainScreen describe whether this view is the main detail (S3) screen or a screen on deeper hierarchy level]


      *
      isMainScreen : function(){




              return true;
      } */

});
