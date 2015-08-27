/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("hcm.mgr.approve.leaverequests.util.Conversions");
jQuery.sap.require("sap.ca.ui.message.message");

sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.mgr.approve.leaverequests.view.S3", {

	extHookChangeFooterButtons: null,
	
    onInit: function() {
        "use strict";
        this.resourceBundle = this.oApplicationFacade.getResourceBundle();
        this.oDataModel = this.oApplicationFacade.getODataModel();
        this.oView = this.getView();
        this.mailSubject = "";

        this.oRouter.attachRouteMatched(function(oEvent) {
            if (oEvent.getParameter("name") === "detail") {
                var sDetailTabContextPath = oEvent.getParameter("arguments").contextPath;
                sDetailTabContextPath = sDetailTabContextPath.replace("LeaveRequestCollection", "/LeaveRequestDetailsCollection");
                sDetailTabContextPath = sDetailTabContextPath.replace("')", "',CalculateOverlaps=1)");
                this.oView.bindElement(sDetailTabContextPath);
                if (this.oView.byId("LRAtc").getSelectedKey() !== "contentInfo") {
                    this.oView.byId("LRAtc").setSelectedKey("contentInfo");
                }
            }
        }, this);
    },

    /**
     * @public [getHeaderFooterOptions Define header & footer options]
     */
    getHeaderFooterOptions: function() {
        "use strict";
        var that = this;
        var objHdrFtr = {
            sI18NDetailTitle: "view.Detail.title",
            oPositiveAction: {
                sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
                onBtnPressed: jQuery.proxy(that._handleApprove, that)
            },
            oNegativeAction: {
                sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
                onBtnPressed: jQuery.proxy(that._handleReject, that)
            },
            oAddBookmarkSettings: {
                title: that.resourceBundle.getText("view.Detail.title"),
                icon: "sap-icon://card"
            },
            onBack: jQuery.proxy(function() {
                //Check if a navigation to master is the previous entry in the history
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                if (sDir === "Backwards") {
                    window.history.go(-1);
                } else {
                    //we came from somewhere else - create the master view
                    this.oRouter.navTo("master");
                }
            }, this)
        };
        /**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.mgr.approve.leaverequests.view.S3~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */    	
        if (this.extHookChangeFooterButtons) {
        	objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
        };
    	return objHdrFtr;
    },

    /**
     * @private [_handleTabSelect handler for IconTabBar select]
     * // FIXME: The below is a workaround because the odata service doesnt handler /Notes but only $expand=Notes.
     * Whenever scaffolding triggers a model refresh, automatically /Notes on main model is triggered which fails.
     * Hence, a new JSON model for notes is created and assigned on notes tab click
     */
    _handleTabSelect: function(evt) {
        "use strict";
        var key, context, sDetailTabContextPath, fnSuccess;

        key = evt.getParameter("key");
        context = this.getView().getBindingContext();

        if (key === "contentNotes") {
            sDetailTabContextPath = "/LeaveRequestDetailsCollection(SAP__Origin='" + context.getProperty("SAP__Origin") + "',RequestId='" + context.getProperty("RequestId") + "',CalculateOverlaps=1)";
            fnSuccess = function(oData) {
                this.oModel2 = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(this.oModel2, "notes");
            };
            this.oDataModel.read(sDetailTabContextPath, undefined, ["$expand=Notes"], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(this.onRequestFailed, this));
        }
    },

    /**
     * @private [_handleApprove handler for approve action]
     */
    _handleApprove: function() {
        "use strict";
        var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()),
            bApprove = true,
            fnClose = function(oResult) {
                this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
            },
            sUserName = this.oView.getBindingContext().getProperty("RequesterName"),
            sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"),
            sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"),
            sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"),
            sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"),
            sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"),
            sRequested = hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
            sApproveText = "";

        if (sLeaveRequestType === "3") {
            sApproveText = this.resourceBundle.getText("dialog.question.approvecancel", [sUserName]);
        } else {
            sApproveText = this.resourceBundle.getText("dialog.question.approve", [sUserName]);
        }

        sap.ca.ui.dialog.confirmation.open({
            question: sApproveText,
            showNote: true,
            additionalInformation: [{
                label: this.resourceBundle.getText("view.AddInfo.LeaveType"),
                text: sLeaveType
            }, {
                label: this.resourceBundle.getText("view.AddInfo.Requested"),
                text: sRequested
            }],
            title: this.resourceBundle.getText("XTIT_APPROVAL"),
            confirmButtonLabel: this.resourceBundle.getText("XBUT_APPROVE")
        }, jQuery.proxy(fnClose, this));
    },

    /**
     * @private [_handleReject handler for reject action]
     */
    _handleReject: function() {
        "use strict";
        var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()),
            bApprove = false,
            fnClose = function(oResult) {
                this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
            },
            sUserName = this.oView.getBindingContext().getProperty("RequesterName"),
            sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"),
            sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"),
            sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"),
            sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"),
            sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"),
            sRequested = hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
            sRejectText = "";

        if (sLeaveRequestType === "3") {
            sRejectText = this.resourceBundle.getText("dialog.question.rejectcancel", [sUserName]);
        } else {
            sRejectText = this.resourceBundle.getText("dialog.question.reject", [sUserName]);
        }

        // open the confirmation dialog
        sap.ca.ui.dialog.confirmation.open({
            question: sRejectText,
            showNote: true,
            additionalInformation: [{
                label: this.resourceBundle.getText("view.AddInfo.LeaveType"),
                text: sLeaveType
            }, {
                label: this.resourceBundle.getText("view.AddInfo.Requested"),
                text: sRequested
            }],
            title: this.resourceBundle.getText("XTIT_REJECT"),
            confirmButtonLabel: this.resourceBundle.getText("XBUT_REJECT")
        }, jQuery.proxy(fnClose, this));
    },

    /**
     * @private [_handleApproveRejectExecute handler for executing the approval/reject to backend]
     */
    _handleApproveRejectExecute: function(oResult, bApprove, oDataObj) {
        "use strict";
        if (oResult.isConfirmed) {

            var oEntry = {}, sDecision, sURL;

            if (oResult.sNote) {
                oEntry.Comment = oResult.sNote;
            } else {
                oEntry.Comment = "";
            }

            oEntry.RequestId = oDataObj.RequestId;
            oEntry.Version = oDataObj.Version;

            if (bApprove) {
                sDecision = "PREPARE_APPROVE";
                this.sTextKey = "dialog.success.approve";
            } else {
                sDecision = "PREPARE_REJECT";
                this.sTextKey = "dialog.success.reject";
            }

            oEntry.Decision = sDecision;
            oEntry.SAP__Origin = oDataObj.SAP__Origin;

            sURL = "ApplyLeaveRequestDecision?SAP__Origin='" + oDataObj.SAP__Origin + "'&RequestId='" + oDataObj.RequestId + "'&Version=" + oDataObj.Version + "&Comment='" + oResult.sNote + "'&Decision='" + sDecision + "'";

            this.oDataModel.setRefreshAfterChange(false);
            this.oDataModel.create(sURL, oEntry, null, jQuery.proxy(this._handleApproveRejectSuccess, this), jQuery.proxy(this._handleApproveRejectFailure, this));
        }
    },

    _handleApproveRejectSuccess: function() {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.oView),
            oComponent = sap.ui.component(sComponentId);

        oComponent.oEventBus.publish("hcm.mgr.approve.leaverequests", "leaveRequestApproveReject");

        this.oDataModel.setRefreshAfterChange(true);
        this.oDataModel.refresh(true);

        sap.ca.ui.message.showMessageToast(this.resourceBundle.getText(this.sTextKey));
    },

    _handleApproveRejectFailure: function(oError) {
        "use strict";
        this.oDataModel.setRefreshAfterChange(true);
        if (this.oDataModel.hasPendingChanges()) {
            this.oDataModel.refresh(true);
        }

        hcm.mgr.approve.leaverequests.util.Conversions.formatErrorDialog(oError);
    },

    /**
     * @private [_handleOverlapTap handler for overlap link click]
     */
    _handleOverlapTap: function() {
        "use strict";
        this.oRouter.navTo("calendar", {
            from: "detail",
            SAP__Origin: this.oView.getBindingContext().getProperty("SAP__Origin"),
            RequestId: this.oView.getBindingContext().getProperty("RequestId"),
            StartDate: Date.parse(this.oView.getBindingContext().getProperty("StartDate"))
        });
    },

    /**
     * @private [_handleNamePress handler for manager name press]
     */
    _handleNamePress: function(oEvent) {
        "use strict";
        jQuery.proxy(this._handleEmployeeNameClick(oEvent), this);
    },

    /**
     * @private [_handleSenderPress handler for employee name press]
     */
    _handleSenderPress: function(oEvent) {
        "use strict";
        jQuery.proxy(this._handleEmployeeNameClick(oEvent), this);
    },

    /**
     * @private [_handleNamePress handler for opening employee business card]
     */
    _handleEmployeeNameClick: function(oEvent) {
        "use strict";
        this.oControl = oEvent.getParameters().domRef;
        var oContext = this.oView.getBindingContext(),
            userID = oContext.getProperty("RequesterNumber"),
            leaveTypeDesc = oContext.getProperty("LeaveTypeDesc"),
            startDate = oContext.getProperty("StartDate"),
            startTime = oContext.getProperty("StartTime"),
            endDate = oContext.getProperty("EndDate"),
            endTime = oContext.getProperty("EndTime"),
            allDayFlag = oContext.getProperty("AllDayFlag"),
            tFrame = hcm.mgr.approve.leaverequests.util.Conversions.formatterAbsenceDays3(startDate, startTime, endDate, endTime, allDayFlag),
            Subject = this.resourceBundle.getText("view.BusinessCard.Employee.Subject", [leaveTypeDesc]);
        try {
			//if call is from notes, fetch the Pernr of the commenter and not the Requester of the leave request
			if (oEvent.getSource().mProperties.hasOwnProperty("sender")) {
				var index = oEvent.getSource().oParent.indexOfItem(this
						.byId(oEvent.getSource().sId));
				userID = oEvent.getSource().oPropagatedProperties.oModels.notes.oData.Notes.results[index].PersonNr;
			}
		} catch (e) {
			jQuery.sap.log.warning("Couldn't find the Details of employee","_handleEmployeeNameClick","hcm.mgr.approve.leaverequests.view.S3");
		}
        this.mailSubject = Subject + " " + tFrame;
        this.oDataModel.read("EmployeeCollection", null, ["$filter=EmployeeNumber eq '" + userID + "'"], true,
            jQuery.proxy(this._onRequestSuccess, this),
            jQuery.proxy(this._onRequestFailed, this));
    },

    /**
     * @private [_onRequestFailed handler for service request failure]
     */
    _onRequestSuccess: function(oData) {
        "use strict";
        jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
        var data = oData.results[0],
            oEmpConfig = {
                title: "Employee",
                name: data.Name,
                department: data.Department,
                contactmobile: data.Mobile,
                contactphone: data.Phone,
                contactemail: data.Email,
                contactemailsubj: this.mailSubject,
                companyname: data.Company,
                companyaddress: data.Address
            },
            oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);

        oEmployeeLaunch.openBy(this.oControl);
    },

    /**
     * @private [_onRequestFailed handler for service request failure]
     */
    _onRequestFailed: function(oError) {
        "use strict";
        sap.ca.ui.message.showMessageBox({
            type: sap.ca.ui.message.Type.ERROR,
            message: oError.message,
            details: oError.response.body
        });
    },

    isMainScreen: function() {
        return true;
    }
});