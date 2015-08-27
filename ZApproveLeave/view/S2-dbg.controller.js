/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.mgr.approve.leaverequests.view.S2", {

	extHookChangeFooterButtons: null,
	
    onInit: function() {
        "use strict";
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this._getData();
        this.registerMasterListBind(this.getList());

        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        var oComponent = sap.ui.component(sComponentId);
        oComponent.oEventBus.subscribe("hcm.mgr.approve.leaverequests", "leaveRequestApproveReject", this._handleApproveRejectCallBack, this);

        this.oRouter.attachRoutePatternMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "detail") {
                var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
                var oItem = this.findItemByContextPath(sBindingContextPath);
                var oList = this.getList();
                var iIndex = oList.indexOfItem(oItem);
                var oNextItem = oList.getItems()[iIndex + 1];
                this._sNextDetailPath = oNextItem && oNextItem.getBindingContext(this.sModelName).getPath();
            }
        }, this);
    },

    /**
     * @public [onDataLoaded On master list loaded]
     */
    onDataLoaded: function() {
        if (this.getList().getItems().length < 1) {
            if (!sap.ui.Device.system.phone) {
                this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
            }
        }
    },

    /**
     * @private [_handleApproveRejectCallBack Callback handler on after approval/reject, to select next row in desktop/phone]
     */
    _handleApproveRejectCallBack: function(channelId, eventId, data) {
        "use strict";
        var oItem = this.findItemByContextPath(this._sNextDetailPath);
        if (oItem) {
            this.setListItem(oItem);
        } else {
            if (this.getList().getItems().length > 1) {
                this.selectFirstItem();
            } else {
                this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
            }
        }
    },

    /**
     * @private [_getData Get master data]
     */
    _getData: function() {
        "use strict";
        var oList = this.getList(),
            oSorter = new sap.ui.model.Sorter("ChangeDate", true),
            aFilters = [new sap.ui.model.Filter("FilterGetAllRequests", sap.ui.model.FilterOperator.EQ, 1), new sap.ui.model.Filter("TaskDefinitionID", sap.ui.model.FilterOperator.EQ, "")],
            oTemplate = oList.getItems()[0].clone();

        oList.bindItems("/LeaveRequestCollection", oTemplate, oSorter, aFilters);
    },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
        "use strict";
        var objHdrFtr = {
            sI18NMasterTitle: "view.Master.title"
        };
        
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.mgr.approve.leaverequests.view.S2~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	};
    	return objHdrFtr;
	
    },

    /**
     * @private [_handleListSwipe handler for list row swipe for approval]
     * @return {[type]}
     */
    _handleListSwipe: function() {
        "use strict";
        var oList = this.getList(),
            oSwipeListItem = oList.getSwipedItem(),
            oContext = oSwipeListItem.getBindingContext(),
            sOrigin = oContext.getProperty("SAP__Origin"),
            sRequestID = oContext.getProperty("RequestId"),
            iVersion = oContext.getProperty("Version"),
            sDecision = "PREPARE_APPROVE",
            sTextKey = "dialog.success.approve",
            oEntry = {};

        oList.swipeOut();
        oEntry.RequestId = sRequestID;
        oEntry.Version = iVersion;
        oEntry.Decision = sDecision;
        oEntry.SAP__Origin = sOrigin;
        oEntry.Comment = "";

        this.oDataModel.create("ApplyLeaveRequestDecision?SAP__Origin='" + sOrigin + "'&RequestId='" + sRequestID + "'&Version=" + iVersion + "&Comment=''" + "&Decision='" + sDecision + "'", oEntry, null, function() {
            sap.ca.ui.message.showMessageToast(this.resourceBundle.getText(sTextKey));
        }, jQuery.proxy(this._onRequestFailed, this));
    },

    /**
     * @private [_onRequestFailed handler for service request failure]
     * @param  {[type]} oError
     * @return {[type]}
     */
    _onRequestFailed: function(oError) {
        "use strict";
        sap.ca.ui.message.showMessageBox({
            type: sap.ca.ui.message.Type.ERROR,
            message: oError.message,
            details: oError.response.body
        });
    }
});