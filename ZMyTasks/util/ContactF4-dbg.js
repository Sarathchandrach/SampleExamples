/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.ContactF4");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Util");
// jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.ContactF4 = {
	create : function(oController) {
		var oCU = cus.crm.mytasks.util, oCUU = oCU.Util, oCUF = oCU.Formatter, oBundle = oCUF
				.getResourceBundle(), sTitle = oBundle
				.getText("DETAILS_VALUE_HELP_CON_TITLE"), sNo = oBundle
				.getText("SEARCH_LIST_NODATA_GENERIC"), oConF4 = this
				.getValueHelp();
		jQuery.sap.log.debug("Contact F4 help title: " + sTitle);
		var fnS = jQuery.proxy(this._searchOnContacts, this, this
				.getFilterString()), fnLS = jQuery.proxy(
				this._liveSearchOnContacts, this, this.getFilterString()), fnC = jQuery
				.proxy(this._confirmContact, this, oController);
		oConF4.setTitle(sTitle);
		oConF4.setNoDataText(sNo);
		oConF4.setModel(oCUU.getSearchModel());
		oConF4.attachSearch(fnS);
		oConF4.attachLiveChange(fnLS);
		oConF4.attachConfirm(fnC);
		// TODO: find correct way to display InfoBar (no such method)
		oConF4._list.setInfoToolbar(this.getDialogInfoToolBar());
		// oContactF4._list.setInfoToolbar(oContactF4.myInfobar);
		// this.getListItemTemplate();
		// return oContactF4;
	},

	getId : function() {
		if (!this._contactID)
			this._contactID = "";
		return this._contactID;
	},

	setId : function(sValue) {
		this._contactID = sValue;
		return this;
	},

	getName : function() {
		if (!this._contactName)
			this._contactName = "";
		return this._contactName;
	},

	setName : function(sValue) {
		this._contactName = sValue;
		return this;
	},

	_getLIItem : function() {
		var oLITemplate = new sap.m.StandardListItem(
				{
					title : "{" + this.getFilterString() + "}",
					description : "{parts:['company', 'function'], formatter: 'cus.crm.mytasks.util.Formatter.getContactF4Description'}",
					active : true
				});

		return oLITemplate;
	},

	getListItemTemplate : function() {
		if (!this._oListItem)
			this._oListItem = this._getLIItem();
		return this._oListItem;
	},

	// _getFS : function() {
	// var oCUS = cus.crm.mytasks.util.Schema;
	// return oCUS._getEntityAnnotation(oCUS.getModel(),
	// "service-schema-version", "Account") ? "fullName" : "lastName";
	// },

	getFilterString : function() {
		if (!this._sFilterString)
			this._sFilterString = "fullName";
		return this._sFilterString;
	},

	getValueHelp : function() {
		if (!this._oDialog)
			this._oDialog = new sap.m.SelectDialog();
		return this._oDialog;
	},

	getDialogInfoToolBar : function() {
		if (!this._oInfoTB)
			this._oInfoTB = new sap.m.Toolbar({
				active : true,
				content : [ new sap.m.Label({
					text : ""
				}), new sap.m.ToolbarSpacer(), new sap.ui.core.Icon({
					src : "sap-icon://decline"
				}) ],
				press : jQuery.proxy(this._pressInfoToolbar, this)
			});
		return this._oInfoTB;
	},

	__setFilterText : function(oEvent) {
		var oDL = this.getValueHelp(), oDlItb = oDL._list.getInfoToolbar();
		if (oDL.data("accountid")) {
			var sFilterText = cus.crm.mytasks.util.Formatter
					.getResourceBundle().getText(
							"DETAILS_VALUE_HELP_FILTERED_BY")
					+ " " + oDL.data("accounttext");
			oDlItb.getContent()[0].setText(sFilterText);
			oDlItb.setVisible(true);
		} else {
			oDlItb.setVisible(false);
			// oDL.getModel().detachRequestCompleted(
			// jQuery.proxy(this._onRequestCompleted, this, oParams));
			// oDL.bRequestHandlerAttached = false;
		}
	},

	_onRequestCompleted : function(oParams, oEvent) {
		var fnTO = jQuery.proxy(this.__setFilterText, this);
		setTimeout(fnTO, 5);
	},

	triggerSearch : function(oParams) {
		cus.crm.mytasks.util.Util.logObjectToConsole(
				"Contact F4 Help sValue: ", oParams);
		var aFilter = [], oDL = this.getValueHelp(), itemsBinding = oDL
				.getBinding('items');
		// Add to Custom Data if accountid & contactid is there for a TASK
		if (oParams.accountid && oParams.accountid !== "") {
			oDL.data('accountid', oParams.accountid).data('accounttext',
					oParams.accounttext);
			aFilter.push(new sap.ui.model.Filter("accountID",
					sap.ui.model.FilterOperator.EQ, oParams.accountid));
		} else
			oDL.data('accountid', null).data('accounttext', null);
		if (oParams.contactid && oParams.contactid !== "")
			oDL.data('contactid', oParams.contactid);
		else
			oDL.data('contactid', null);
		if (oParams.searchvalue && oParams.searchvalue !== "")
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, oParams.searchvalue));

		// for showing the filter bar at the appropriate moment - once
		// request has been serviced
		var fnRC = jQuery.proxy(this._onRequestCompleted, this, oParams);
		if (!oDL.bRequestHandlerAttached) {
			oDL.getModel().attachRequestCompleted(null, fnRC);
			oDL.bRequestHandlerAttached = true;
		}
		if (!itemsBinding) {
			// Needed for Texts & make text to display in info bar:
			jQuery.sap.log.debug("accountid filled for contact F4 help");
			var sPath = "/ContactCollection", oLI = {
				path : sPath,
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			jQuery.sap.log.debug("Contact F4 Binding Path: " + sPath);
			oDL.bindAggregation("items", oLI);
		} else {
			// clearing aApplicationFilters
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_searchOnContacts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value"), oDL = this
				.getValueHelp(), sAccountId = oDL && oDL.data ? oDL
				.data("accountid") : null;
		this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
				sAccountId, sAttr, sVal);
	},

	_liveSearchOnContacts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value"), oDL = this
				.getValueHelp(), sAccountId = oDL && oDL.data ? oDL
				.data("accountid") : null;
		if (sVal.length == 0 || (sVal && sVal.length > 3))
			this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
					sAccountId, sAttr, sVal);
	},

	__commonSearch : function(aFilter, itemsBinding, sAccountId, sAttr, sVal) {
		if (sAccountId)
			aFilter.push(new sap.ui.model.Filter("accountID",
					sap.ui.model.FilterOperator.EQ, sAccountId));
		if (sVal && sVal !== "")
			aFilter.push(new sap.ui.model.Filter(sAttr,
					sap.ui.model.FilterOperator.Contains, sVal));
		if (!itemsBinding) {
			var sPath = "/ContactCollection", oLI = {
				path : sPath,
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			jQuery.sap.log.debug("Contact F4 Binding Path: " + sPath);
			this.getValueHelp().bindAggregation("items", oLI);
		} else {
			// and apply the filter to the bound items, and the Select
			// Dialog will update
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_pressInfoToolbar : function(oEvent) {
		var oDialog = this.getValueHelp(), itemsBinding = oDialog
				.getBinding("items"), aFilter = [], sSearchField = oDialog._oDialog
				.getSubHeader().getContentMiddle()[0].getValue();
		oDialog._list.getInfoToolbar().setVisible(false);
		oDialog.data('accountid', null).data('accounttext', null);
		// update items collection -> that is switch
		// back to ContactCollection
		if (sSearchField && sSearchField !== "")
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, sSearchField));
		if (!itemsBinding) {
			var sPath = "/ContactCollection", oLI = {
				path : sPath,
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			jQuery.sap.log.debug("Contact F4 Binding Path: " + sPath);
			oDialog.bindAggregation("items", oLI);
		} else {
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_confirmContact : function(oController, evt) {
		var oView = oController.getView(), selectedItem = evt
				.getParameter("selectedItem"), oCU = cus.crm.mytasks.util;
		if (selectedItem) {
			var oContact = selectedItem.getBindingContext().getObject();
			oCU.Util.logObjectToConsole("Contact Data: ", oContact);
			this.setId(oContact.contactID).setName(
					oContact[this.getFilterString()]);
			if (this.getName() === "")
				this.setName(oContact.contactID);
			oView.byId("contactInput").setValue(this.getName());
			jQuery.sap.log.debug("ContactId = " + this.getId());
			jQuery.sap.log.debug("ContactName = " + this.getName());
			this._setAccountIfNotSetAlready(oController, oContact);
		}
	},

	_setAccountIfNotSetAlready : function(oController, oContact) {
		if (oController instanceof sap.ca.scfld.md.controller.BaseFullscreenController) {
			var oCUA = cus.crm.mytasks.util.AccountF4, oAccInput = oController
					.getView().byId("accountInput");
			if (oAccInput.getValue() === "") {
				oCUA.setId(oContact.accountID).setName(oContact.company);
				if (oCUA.getName() === "")
					oCUA.setName(oContact.accountID);
				oAccInput.setValue(oCUA.getName());
				jQuery.sap.log.debug("AccountId = " + oCUA.getId());
				jQuery.sap.log.debug("AccountName = " + oCUA.getName());
			}
		}
	},
};