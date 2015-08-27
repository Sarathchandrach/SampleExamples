/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.AccountF4");jQuery.sap.require("cus.crm.mytasks.util.Formatter");jQuery.sap.require("cus.crm.mytasks.util.Util");jQuery.sap.require("cus.crm.mytasks.util.Schema");cus.crm.mytasks.util.AccountF4={create:function(c){var C=cus.crm.mytasks.util,o=C.Formatter,a=C.Util,b=o.getResourceBundle(),t=b.getText("DETAILS_VALUE_HELP_ACC_TITLE"),n=b.getText("SEARCH_LIST_NODATA_GENERIC"),A=this.getValueHelp();var s=jQuery.proxy(this._searchOnAccounts,this,this.getFilterString()),l=jQuery.proxy(this._liveSearchOnAccounts,this,this.getFilterString()),f=jQuery.proxy(this._confirmAccount,this,c);A.setTitle(t);A.setNoDataText(n);A.setModel(a.getSearchModel());A.attachSearch(s);A.attachLiveChange(l);A.attachConfirm(f);a.logObjectToConsole("Account F4 search model: ",A.getModel())},getId:function(){if(!this._accountID)this._accountID="";return this._accountID},setId:function(v){this._accountID=v;return this},getName:function(){if(!this._accountName)this._accountName="";return this._accountName},setName:function(v){this._accountName=v;return this},_getLIItem:function(){var t="{parts:[{path:'"+this.getFilterString()+"'}], formatter: 'cus.crm.mytasks.util.Formatter.getAccountF4Title'}",d="{parts:[{path:'MainAddress/city'}, {path:'MainAddress/country'}, {path:'accountID'}], formatter: 'cus.crm.mytasks.util.Formatter.getAccountF4Description'}";var l=new sap.m.StandardListItem({title:t,description:d,active:true});return l},getListItemTemplate:function(){if(!this._oListItem)this._oListItem=this._getLIItem();return this._oListItem},getValueHelp:function(){if(!this._oDialog)this._oDialog=new sap.m.SelectDialog();return this._oDialog},triggerSearch:function(v){var f=[],a=this.getValueHelp(),i=a.getBinding("items");if(v&&v!=="")f.push(new sap.ui.model.Filter(this.getFilterString(),sap.ui.model.FilterOperator.Contains,v));if(!i){var l={path:"/AccountCollection",parameters:{expand:"MainAddress",select:"accountID,"+this.getFilterString()+",MainAddress/city,MainAddress/country"},template:this.getListItemTemplate(),filters:f};a.bindAggregation("items",l)}else{i.aApplicationFilters=[];i.filter(f,sap.ui.model.FilterType.Application)}},_getFS:function(){var c=cus.crm.mytasks.util.Schema;return c._getPropertyInfoOfEntity("Account","fullName")?"fullName":"name1"},getFilterString:function(){if(!this._sFilterString)this._sFilterString=this._getFS();return this._sFilterString},_liveSearchOnAccounts:function(a,e){jQuery.sap.log.debug("in do live search");var f=[],v=e.getParameter("value");if(v.length==0||(v&&v.length>3))this.__commonSearch(f,e.getParameter("itemsBinding"),a,v)},_searchOnAccounts:function(a,e){jQuery.sap.log.debug("in do search");var f=[],v=e.getParameter("value");this.__commonSearch(f,e.getParameter("itemsBinding"),a,v)},__commonSearch:function(f,i,a,v){if(v&&v!=="")f.push(new sap.ui.model.Filter(a,sap.ui.model.FilterOperator.Contains,v));if(!i){var l={path:"/AccountCollection",parameters:{expand:"MainAddress",select:"accountID,"+this.getFilterString()+",MainAddress/city,MainAddress/country"},template:this.getListItemTemplate(),filters:f};this.getValueHelp().bindAggregation("items",l)}else{i.aApplicationFilters=[];i.filter(f,sap.ui.model.FilterType.Application)}},_confirmAccount:function(c,e){var v=c.getView(),s=e.getParameter("selectedItem");if(s){var a=s.getBindingContext().getObject();cus.crm.mytasks.util.Util.logObjectToConsole("Account Data: ",a);this.setId(a.accountID).setName(a[this.getFilterString()]);if(this.getName()==="")this.setName(a.accountID);v.byId("accountInput").setValue(this.getName());jQuery.sap.log.debug("AccountId = "+this.getId());jQuery.sap.log.debug("AccountName = "+this.getName())}}};