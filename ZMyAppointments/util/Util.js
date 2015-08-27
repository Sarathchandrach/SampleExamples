/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.util.Util");cus.crm.mycalendar.util.Util={setApplicationFacade:function(a){this.oApplicationFacade=a},geti18NResourceBundle:function(){if(this.oApplicationFacade){return this.oApplicationFacade.getResourceBundle()}else{return null}},geti18NText:function(k){if(this.geti18NResourceBundle()){return this.geti18NResourceBundle().getText(k)}else{return null}},geti18NText1:function(k,r){if(this.geti18NResourceBundle()){return this.geti18NResourceBundle().getText(k,r)}else{return null}},getSearch:function(a,l){var d=function(e){jQuery.sap.log.info("in do search");var f=[];var i;var v;if(l){v=e.getSource().getValue()}else{v=e.getParameter("value")}if(v!==undefined){if(l){i=l.getBinding("items")}else{i=e.getParameter("itemsBinding")}i.aApplicationFilters=[];var s=new sap.ui.model.Filter(a,sap.ui.model.FilterOperator.Contains,v);f.push(s);i.filter(f)}};return d},getLiveSearch:function(a,l){var b;var d=function(e){jQuery.sap.log.info("in do live search");var f=[];var i;var v;if(l){v=e.getSource().getValue()}else{v=e.getParameter("value")}if(v.length===0||v.length>3){if(l){i=l.getBinding("items")}else{i=e.getParameter("itemsBinding")}var s=new sap.ui.model.Filter(a,sap.ui.model.FilterOperator.Contains,v);f.push(s);clearTimeout(b);b=setTimeout(function(e){i.filter(f)},1000)}};return d},createContactSearchFragment:function(i,c){var f=sap.ui.xmlfragment(i,"cus.crm.mycalendar.view.ContactSearch",c);var s=sap.ui.core.Fragment.byId(i,"lsc");var I=s.getInfoToolbar();var l=sap.ui.core.Fragment.byId(i,"lsci");var S=sap.ui.core.Fragment.byId(i,"sfc");s.removeItem(l);f.onContactSearch=cus.crm.mycalendar.util.Util.getSearch("lastName",s);f.onContactLiveChange=cus.crm.mycalendar.util.Util.getLiveSearch("lastName",s);f.triggerSearch=function(a){var F=[];s.removeItem(l);if(a.searchvalue){var b=new sap.ui.model.Filter("lastName",sap.ui.model.FilterOperator.Contains,a.searchvalue);F.push(b);S.setValue(a.searchvalue)}else{S.setValue("")}if(a.accountid){var d=c.oBundle.getText("view.Appointment.filteredby");d=d+" "+(a.accounttext===""?a.accountid:a.accounttext);I.getContent()[0].setProperty("text",d);s.getInfoToolbar().setVisible(true);var p="sm>/AccountCollection('"+a.accountid+"')/Contacts";s.bindAggregation("items",{path:p,template:l,filters:F})}else{I.setVisible(false);var p="sm>/ContactCollection";s.bindAggregation("items",{path:p,template:l,filters:F})}};return f},getSearchModel:function(m,i){if(this.oSearchModel===undefined){if(i){this.oSearchModel=new sap.ui.model.json.JSONModel();this.oSearchModel.loadData("/cus.crm.mycalendar/model/SearchModel.json","",true)}else{this.oSearchModel=m;this.oSearchModel.attachRequestFailed(this,this.onRequestFailed,this)}}return this.oSearchModel},onRequestFailed:function(e){jQuery.sap.log.error("oData search request failed");this.showErrorMessagePopup(e)},formatAccountPlace:function(c,a){var r=c;if(a){if(c){r=r+", "+a}else{r=a}}return r},getAccountF4Description:function(c,a,b){var t="";var i="";if(b){i=b+" / ";t=b}if(!c&&a){t=i+a}else if(!a&&c){t=i+c}else if(a&&c){t=i+c+", "+a}return t},getAccountF4Title:function(f){var t="";if(f){t=f}else{t=" "}return t},showErrorMessagePopup:function(E){var d="",m="";if(E.response&&E.response.body){try{var r=JSON.parse(E.response.body);if(r.error&&r.error.message){m=r.error.message.value}else{m=E.message;d=E.response.body}}catch(e){m=E.message;d=E.response.body}}sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:m,details:d})},initEmployeeF4:function(c,s,m){var r=c.getView().getModel('i18n').getResourceBundle();c.onEmpSelect=this.getEmployeeSelect(c,s,m);c.searchEmp=this.getEmployeeSearch(c,s);c.searchEmpLive=this.getEmployeeSearchLive(c);c.onEmpToolbarClose=this.getEmpInfoBarClose(c);c.closeEmpF4=this.getCloseEmpF4(c);c.oEmpF4=new sap.ui.xmlfragment("cus.crm.mycalendar.view.EmployeeF4",c);c.oEmpF4.setModel(new sap.ui.model.json.JSONModel(),"json");c.oEmpF4.getModel('json').setSizeLimit(5000);c.oEmpF4.setModel(c.getView().getModel('i18n'),"i18n");c.oEmpF4._list=c.oEmpF4.getContent()[0];c.oEmpF4._infoToolbar=c.oEmpF4._list.getInfoToolbar();c.oEmpF4._infoBarLabel=c.oEmpF4._infoToolbar.getContent()[0];c.oEmpF4._searchField=c.oEmpF4.getSubHeader().getContentLeft()[0];c.oEmpF4._loadingText=r.getText('view.Appointment.loaddatatext');c.oEmpF4._noDataText=r.getText('view.Appointment.empsea_nodata')},showEmployeeF4:function(c,e,a,A){var m=c.getView().getModel();var f=[];var p="";if(e!==""){f.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,e))}c.oEmpF4._searchField.setValue(e);if(a!==""){p="AccountCollection(accountID='"+a+"')/EmployeeResponsibles";var F=c.getView().getModel('i18n').getResourceBundle().getText('view.Appointment.filteredby')+" ";F+=(A==="")?a:A;c.oEmpF4._infoBarLabel.setText(F);c.oEmpF4._infoToolbar.setVisible(true)}else{p="EmployeeCollection";c.oEmpF4._infoToolbar.setVisible(false)}c.oEmpF4._list.setNoDataText(c.oEmpF4._loadingText);c.oEmpF4.getModel('json').setData({EmployeeCollection:[]});m.read(p,{async:true,context:null,urlParameters:null,filters:f,success:function(o,r){c.oEmpF4._list.setNoDataText(c.oEmpF4._noDataText);c.oEmpF4.getModel('json').setData({EmployeeCollection:r.data.hasOwnProperty("results")?r.data.results:[r.data]})},error:function(E){}});c.oEmpF4.data('account',a);c.oEmpF4.open()},getEmployeeSelect:function(c,s,m){var t=this;return function(e){var S=e.getParameter('listItem');var d=S.getBindingContext('json').getObject();if(s instanceof sap.m.Input){s.setValue((d.fullName==="")?d.employeeID:d.fullName)}m.oData.Responsible=d.employeeID;m.oData.ResponsibleTxt=d.fullName;if(parseFloat(c.sBackendVersion)>=4.0){c._setPrivateFlag(d)}c.oEmpF4._list.removeSelections();c.oEmpF4.close()}},getEmployeeSearch:function(c){return function(e){var m=c.getView().getModel();var E=c.oEmpF4._searchField.getValue();var p="";var a=c.oEmpF4.data('account');var f=[];if(a!==""){p="/AccountCollection(accountID='"+a+"')/EmployeeResponsibles"}else{p="/EmployeeCollection"}if(E!==""){f.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,E))}c.oEmpF4._list.setNoDataText(c.oEmpF4._loadingText);c.oEmpF4.getModel('json').setData({EmployeeCollection:[]});m.read(p,{async:true,context:null,urlParameters:null,filters:f,success:function(d,r){c.oEmpF4._list.setNoDataText(c.oEmpF4._noDataText);c.oEmpF4.getModel('json').setData({EmployeeCollection:r.data.hasOwnProperty("results")?r.data.results:[r.data]})},error:function(o){}})}},getEmpInfoBarClose:function(c){return function(e){var m=c.getView().getModel();var E=c.oEmpF4._searchField.getValue();var p="/EmployeeCollection";var f=[];c.oEmpF4.data('account',"");if(E!==""){f.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,E))}c.oEmpF4._list.setNoDataText(c.oEmpF4._loadingText);c.oEmpF4.getModel('json').setData({EmployeeCollection:[]});m.read(p,{async:true,urlParameters:null,context:null,filters:f,success:function(d,r){c.oEmpF4._list.setNoDataText(c.oEmpF4._noDataText);c.oEmpF4.getModel('json').setData({EmployeeCollection:r.data.hasOwnProperty("results")?r.data.results:[r.data]})},error:function(o){}});c.oEmpF4._infoToolbar.setVisible(false)}},getEmployeeSearchLive:function(c){return function(e){var m=c.getView().getModel();var E=c.oEmpF4._searchField.getValue();if(E.length>0&&E.length<=3){return}var p="";var a=c.oEmpF4.data('account');var f=[];if(a!==""){p="/AccountCollection(accountID='"+a+"')/EmployeeResponsibles"}else{p="/EmployeeCollection"}if(E!==""){f.push("$filter=substringof('"+E+"',fullName)")}c.oEmpF4._list.setNoDataText(c.oEmpF4._loadingText);c.oEmpF4.getModel('json').setData({EmployeeCollection:[]});m.read(p,null,f,true,function(d,r){c.oEmpF4._list.setNoDataText(c.oEmpF4._noDataText);c.oEmpF4.getModel('json').setData({EmployeeCollection:r.data.hasOwnProperty("results")?r.data.results:[r.data]})},function(o){})}},getCloseEmpF4:function(c){return function(){c.oEmpF4._list.removeSelections();c.oEmpF4.close()}},filterStatusesByProcessType:function(s,p){},handleErrors:function(e){jQuery.sap.log.error(JSON.stringify(e));sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e.message,details:JSON.parse(e.response.body).error.message.value},function(r){})},initCustomizingModel:function(c){c.oApplicationFacade.setApplicationModel("customizing",new sap.ui.model.json.JSONModel({}))},getStatusesForTxType:function(s,t){var i=0;var f=[];var l=s.length;for(;i<l;i++){if(s[i].TransactionType===t){f.push(s[i])}}if(f.length===0){return null}return f},getDefaultStatus:function(s){for(var i=0;i<s.length;i++){if(s[i].Default===true){return s[i]}}return null},getPrioritiesForTxType:function(p,t){},getDefaultPriority:function(t,c){var C=c.oApplicationFacade.getApplicationModel("customizing");var d=C.oData;var D="";if(d.TransactionTypeSet&&d.TransactionTypeSet.length!==0){for(var i=0;i<d.TransactionTypeSet.length;i++){if(d.TransactionTypeSet[i].ProcessTypeCode===t){D=d.TransactionTypeSet[i].Priority;break}}if(D!==""&&d.UserPriorities){for(var i=0;i<d.UserPriorities.length;i++){if(d.UserPriorities[i].Priority===D){return d.UserPriorities[i]}}}else{return null}}else{return null}},showErrMsgBox:function(e){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e,},function(r){})},handleBatchCustomizingRead:function(r,c){var C=c.oApplicationFacade.getApplicationModel("customizing");var d=C.oData;var f=false;var e="";var E="";if(parseInt(r.__batchResponses[0].statusCode)>=400){e=oResponses.__batchResponses[0].statusText;E=JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value+"\n";f=true}else{d.UserPriorities=r.__batchResponses[0].data.results}if(parseInt(r.__batchResponses[1].statusCode)>=400){e=oResponses.__batchResponses[1].statusText;E=JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value+"\n";f=true}else{d.UserStatuses=r.__batchResponses[1].data.results}if(!d.TransactionTypeSet){if(parseInt(r.__batchResponses[2].statusCode)>=400){e=oResponses.__batchResponses[2].statusText;E=JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value+"\n";f=true}else{d.TransactionTypeSet=r.__batchResponses[2].data.results}}if(f){if(c._setViewMode){c._setViewMode("ERROR");c.sErrMsg=E;return!f}this.showErrMsgBox(E)}return!f},filterDropDowns:function(t,c){var C=c.oApplicationFacade.getApplicationModel("customizing");var d=C.oData;if(d.UserPriorities&&d.UserPriorities.length===0){var e=c.getView().getModel("i18n").getResourceBundle().getText("CUSTOMIZING_INCOMPLETE");if(c._setViewMode){c._setViewMode("ERROR");c.sErrMsg=e;return false}this.showErrMsgBox(e);return false}var f=this.getStatusesForTxType(d.UserStatuses,t);if(f===null){var e=c.getView().getModel("i18n").getResourceBundle().getText("CUSTOMIZING_INCOMPLETE");if(c._setViewMode){c._setViewMode("ERROR");c.sErrMsg=e;return false}this.showErrMsgBox(e);return false}if(!d.mStatuses){d.mStatuses={}}d.mStatuses[t]=f;return true},isTransactionTypeActive:function(t,c){var r;c.oModel.read("readAppointStatusCust",null,{Guid:"''",TransactionType:"'"+t+"'"},false,function(d,a){r=true;var C=c.oApplicationFacade.getApplicationModel("customizing");var o=C.oData;if(!o.mStatuses){o.mStatuses={}}C.oData.mStatuses[t]=d.results},function(e){cus.crm.mycalendar.util.Util.handleErrors(e);r=false});return r},getCustomizing:function(t,c){if(parseFloat(c.sBackendVersion)>=4){var r;var C=c.oApplicationFacade.getApplicationModel("customizing");var d=C.oData;if(c._getViewMode){var i=0;var R={};var v=c._getViewMode();if(v==="EDIT"){if(!d.mNextPossibleStatuses){d.mNextPossibleStatuses={}}if(!d.mNextPossibleStatuses[t]){c.oModel.addBatchReadOperations([c.oModel.createBatchOperation(c.sEntityPath.substr(1)+"/AppointmentStatuses","GET")]);R["NEXTSTATUS"]=i;i++}if(!d.UserPriorities){c.oModel.addBatchReadOperations([c.oModel.createBatchOperation("UserPriorities","GET")]);R["PRIO"]=i;i++}if(i>0){c.oModel.submitBatch(function(b){var f=false;var e="";var E="";var k;if(R["NEXTSTATUS"]!==null&&R["NEXTSTATUS"]!==undefined){var g=R["NEXTSTATUS"];if(parseInt(b.__batchResponses[g].statusCode)>=400){f=true;e=oResponses.__batchResponses[g].statusText;E=JSON.parse(oResponses.__batchResponses[g].response.body).error.message.value+"\n"}else{d.mNextPossibleStatuses[t]=b.__batchResponses[g].data.results}}if(R["PRIO"]!==null&&R["PRIO"]!==undefined){var g=R["PRIO"];if(parseInt(b.__batchResponses[g].statusCode)>=400){f=true;e=oResponses.__batchResponses[g].statusText;E=JSON.parse(oResponses.__batchResponses[g].response.body).error.message.value+"\n"}else{d.UserPriorities=b.__batchResponses[g].data.results}}if(f){cus.crm.mycalendar.util.Util.showErrMsgBox(E);return!f}},function(e){cus.crm.mycalendar.util.Util.handleErrors(e);r=false},false);if(r===false){return false}}}}if(!d.UserStatuses||!d.UserPriorities){c.oModel.addBatchReadOperations([c.oModel.createBatchOperation("UserPriorities","GET")]);c.oModel.addBatchReadOperations([c.oModel.createBatchOperation("UserStatuses","GET")]);if(!d.TransactionTypeSet){c.oModel.addBatchReadOperations([c.oModel.createBatchOperation("TransactionTypes","GET")])}var a=c;c.oModel.submitBatch(function(b){r=cus.crm.mycalendar.util.Util.handleBatchCustomizingRead(b,a);if(r===true){r=cus.crm.mycalendar.util.Util.filterDropDowns(t,c)}},function(e){cus.crm.mycalendar.util.Util.handleErrors(e);r=false},false);if(r===false){return false}}else{r=cus.crm.mycalendar.util.Util.filterDropDowns(t,c);if(r===false){return false}}}else{var T=cus.crm.mycalendar.util.Util.isTransactionTypeActive(t,c);if(!T){return false}}},initControllersModel:function(c){var C=new sap.ui.model.json.JSONModel({});c.oApplicationFacade.setApplicationModel("controllers",C);return C},_fetchETag:function(e,m){var c=m.getContext(e);if(c){m.deleteCreatedEntry(c)}m.createBindingContext(e,null,function(c){cus.crm.mycalendar.util.Util._saveETag(c.getObject().__metadata.etag)},true)},_saveETag:function(e){this.sETag=e},_getETag:function(){return this.sETag}};
