/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.EmployeeF4");
jQuery.sap.require("cus.crm.mytasks.util.Util");
jQuery.sap.require("cus.crm.mytasks.util.AccountF4");
// jQuery.sap.require("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.EmployeeF4 = {
	create : function(oController) {
		var oCU = cus.crm.mytasks.util, oCUF = oCU.Formatter, oCUU = oCU.Util, oBundle = oCUF
				.getResourceBundle(), sTitAcc = oBundle
				.getText("DETAILS_ASSIGNTO_ASIGNEE"), sNoEmps = oBundle
				.getText("SEARCH_LIST_NODATA_GENERIC"), oEmployeeF4 = this
				.getValueHelp(), fnS = jQuery.proxy(this._searchOnEmployees,
				this, this.getFilterString()), fnLS = jQuery.proxy(
				this._liveSearchOnEmployees, this, this.getFilterString()), fnC = jQuery
				.proxy(this._confirmEmployee, this, oController);
		oEmployeeF4.setTitle(sTitAcc);
		oEmployeeF4.setNoDataText(sNoEmps);
		oEmployeeF4.setModel(oCUU.getSearchModel());
		oEmployeeF4.attachSearch(fnS);
		oEmployeeF4.attachLiveChange(fnLS);
		oEmployeeF4.attachConfirm(fnC);
		oCUU.logObjectToConsole("Employee F4 search model: ", oEmployeeF4
				.getModel());
	},

	getId : function() {
		if (!this._employeeID)
			this._employeeID = "";
		return this._employeeID;
	},

	setId : function(sValue) {
		this._employeeID = sValue;
		return this;
	},

	getName : function() {
		if (!this._employeeName)
			this._employeeName = "";
		return this._employeeName;
	},

	setName : function(sValue) {
		this._employeeName = sValue;
		return this;
	},

	_getLIItem : function() {
		var oLITemplate = new sap.m.StandardListItem(
				{
					title : "{" + this.getFilterString() + "}",
					icon : "{path:'Photo', formatter:'cus.crm.mytasks.util.Formatter.photoUrlFormatter'}",
					description : "{Company/"
							+ cus.crm.mytasks.util.AccountF4.getFilterString()
							+ "}",
					// description : "{parts:['company', 'function'], formatter:
					// 'cus.crm.mytasks.util.Formatter.getContactF4Description'}",
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

	triggerSearch : function(sValue) {
		// Get the binded items
		var aFilter = [], oEmpF4 = this.getValueHelp(), itemsBinding = oEmpF4
				.getBinding("items");
		if (sValue)
			aFilter.push(new sap.ui.model.Filter(this.getFilterString(),
					sap.ui.model.FilterOperator.Contains, sValue));

		if (!itemsBinding) {
			var oLI = {
				path : "/EmployeeCollection",
				parameters : {
					expand : 'Company,Photo',
					select : 'employeeID,firstName,lastName,fullName,Company/'
							+ cus.crm.mytasks.util.AccountF4.getFilterString()
							+ ',Company/accountID,Photo'
				},
				template : this.getListItemTemplate(),
				filters : aFilter
			};
			oEmpF4.bindAggregation("items", oLI);
		} else {// just filter
			itemsBinding.aApplicationFilters = [];
			itemsBinding.filter(aFilter, sap.ui.model.FilterType.Application);
		}
	},

	_liveSearchOnEmployees : function(sAttr, oEvent) {
		jQuery.sap.log.debug("in do live search");
		var aFilter = [], sVal = oEvent.getParameter("value");
		if (sVal.length == 0 || (sVal && sVal.length > 3))
			this.__commonSearch(aFilter, oEvent.getParameter("itemsBinding"),
					sAttr, sVal);
	},

	_searchOnEmployees : function(sAttr, oEvent) {
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
				path : "/EmployeeCollection",
				parameters : {
					expand : 'Company,Photo',
					select : 'employeeID,firstName,lastName,fullName,Company/'
							+ cus.crm.mytasks.util.AccountF4.getFilterString()
							+ ',Company/accountID,Photo'
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

	_confirmEmployee : function(oController, evt) {
		var selectedItem = evt.getParameter("selectedItem");
		if (selectedItem) {
			var oEmpF4Val = selectedItem.getBindingContext().getObject();
			this.setId(oEmpF4Val.employeeID).setName(
					oEmpF4Val[this.getFilterString()]);
			oController._oDlAssignTask.getContent()[1].setValue(this.getName());
			jQuery.sap.log.debug("EmployeeId = " + this.getId());
			jQuery.sap.log.debug("EmployeeName = " + this.getName());
		}
	},
};