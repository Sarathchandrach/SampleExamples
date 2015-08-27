/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.AccountF4");
jQuery.sap.require("cus.crm.mytasks.util.Formatter");
jQuery.sap.require("cus.crm.mytasks.util.Util");
jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.AccountF4 = {
	create : function(oController) {
		var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oCUU = oCU.Util, oBundle = oCUF
				.getResourceBundle(), sTitAcc = oBundle
				.getText("DETAILS_VALUE_HELP_ACC_TITLE"), sNoAccounts = oBundle
				.getText("SEARCH_LIST_NODATA_GENERIC"), oAccountF4 = this
				.getValueHelp();
		var fnS = jQuery.proxy(this._searchOnAccounts, this, this
				.getFilterString()), fnLS = jQuery.proxy(
				this._liveSearchOnAccounts, this, this.getFilterString()), fnC = jQuery
				.proxy(this._confirmAccount, this, oController);
		oAccountF4.setTitle(sTitAcc);
		oAccountF4.setNoDataText(sNoAccounts);
		oAccountF4.setModel(oCUU.getSearchModel());
		oAccountF4.attachSearch(fnS);
		oAccountF4.attachLiveChange(fnLS);
		oAccountF4.attachConfirm(fnC);
		oCUU.logObjectToConsole("Account F4 search model: ", oAccountF4
				.getModel());
	},

	getId : function() {
		if (!this._accountID)
			this._accountID = "";
		return this._accountID;
	},

	setId : function(sValue) {
		this._accountID = sValue;
		return this;
	},

	getName : function() {
		if (!this._accountName)
			this._accountName = "";
		return this._accountName;
	},

	setName : function(sValue) {
		this._accountName = sValue;
		return this;
	},

	_getLIItem : function() {
		var sTitle = "{parts:[{path:'"
				+ this.getFilterString()
				+ "'}], formatter: 'cus.crm.mytasks.util.Formatter.getAccountF4Title'}", sDesc = "{parts:[{path:'MainAddress/city'}, {path:'MainAddress/country'}, {path:'accountID'}], formatter: 'cus.crm.mytasks.util.Formatter.getAccountF4Description'}";
		// title : "{fullName}",
		// title :"{parts:[{path:'fullName'}], formatter:
		// 'cus.crm.mytasks.util.Formatter.getAccountF4Title'}",
		// description : "{parts:['MainAddress/city',
		// 'MainAddress/country'], formatter:
		// 'cus.crm.mytasks.util.Formatter.getAccountF4Description'}",
		var oLI = new sap.m.StandardListItem({
			title : sTitle,
			description : sDesc,
			active : true
		});
		return oLI;
	},

	getListItemTemplate : function() {
		if (!this._oListItem)
			this._oListItem = this._getLIItem();
		return this._oListItem;
	},

	getValueHelp : function() {
		if (!this._oDialog)
			this._oDialog = new sap.m.SelectDialog();
		return this._oDialog;
	},

	triggerSearch : function(sValue) {
		// Get the binded items
		var aFilter = [], oAccF4 = this.getValueHelp(), itemsBinding = oAccF4
				.getBinding("items");
		if (sValue && sValue !== "")
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, sValue));

		if (!itemsBinding) {
			var oLI = {
				path : "/AccountCollection",
				parameters : {
					expand : "MainAddress",
					select : "accountID," + this.getFilterString()
							+ ",MainAddress/city,MainAddress/country"
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			oAccF4.bindAggregation("items", oLI);
		} else {// just filter
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_getFS : function() {
		var oCUS = cus.crm.mytasks.util.Schema;
		return oCUS._getPropertyInfoOfEntity("Account", "fullName") ? "fullName"
				: "name1";
	},

	getFilterString : function() {
		if (!this._sFilterString)
			this._sFilterString = this._getFS();
		return this._sFilterString;
	},

	_liveSearchOnAccounts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do live search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		if (sVal.length == 0 || (sVal && sVal.length > 3))
			this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
					sAttr, sVal);
	},

	_searchOnAccounts : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
				sAttr, sVal);
	},

	__commonSearch : function(aFilter, itemsBinding, sAttr, sVal) {
		if (sVal && sVal !== "")
			aFilter.push(new sap.ui.model.Filter(sAttr,
					sap.ui.model.FilterOperator.Contains, sVal));
		if (!itemsBinding) {
			var oLI = {
				path : "/AccountCollection",
				parameters : {
					expand : "MainAddress",
					select : "accountID," + this.getFilterString()
							+ ",MainAddress/city,MainAddress/country"
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			this.getValueHelp().bindAggregation("items", oLI);
		} else {
			// clear application filters
			itemsBinding.aApplicationFilters = [];
			// and apply the filter to the bound items, and the Select
			// Dialog will update
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_confirmAccount : function(oController, evt) {
		var oView = oController.getView(), selectedItem = evt
				.getParameter("selectedItem");
		if (selectedItem) {
			var oAccF4Val = selectedItem.getBindingContext().getObject();
			cus.crm.mytasks.util.Util.logObjectToConsole("Account Data: ",
					oAccF4Val);
			this.setId(oAccF4Val.accountID).setName(
					oAccF4Val[this.getFilterString()]);
			if (this.getName() === "")
				this.setName(oAccF4Val.accountID);
			oView.byId("accountInput").setValue(this.getName());
			jQuery.sap.log.debug("AccountId = " + this.getId());
			jQuery.sap.log.debug("AccountName = " + this.getName());
		}
	}
};