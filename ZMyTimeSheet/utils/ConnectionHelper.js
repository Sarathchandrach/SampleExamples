/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.ConnectionHelper");jQuery.sap.require("sap.ui.model.odata.datajs");jQuery.sap.require("sap.m.MessageToast");jQuery.sap.require("sap.ca.ui.message.message");jQuery.sap.require("hcm.emp.mytimesheet.utils.PerfUtils");jQuery.sap.require("sap.ui.base.EventProvider");jQuery.sap.require("hcm.emp.mytimesheet.utils.InitialConfigHelper");jQuery.sap.require("sap.ca.ui.utils.busydialog");sap.ui.base.EventProvider.extend("hcm.emp.mytimesheet.Service",{metadata:{publicMethods:["getModel","getGeneralParameters","getSpendingDataByHierarhyNodesAndPeriod","getGenericLineItemsByHierNodesAndPeriod","getTrendDataByHierarchyNodes","setBundle"]},constructor:function(){this._nCounter=0},_initialize:function(a){if(!this.oApplication){this.oApplication=a.oApplicationFacade.oApplicationImplementation;this.oConfiguration=new hcm.emp.mytimesheet.utils.InitialConfigHelper();this.oConnectionManager=a.oApplication.getConnectionManager()}if(!this.oBundle){this.oBundle=a.oApplicationFacade.oApplicationImplementation.getResourceBundle()}this.oConfiguration.setResourceBundle(this.oBundle);this.oDataModel=this.oConnectionManager.getModel();this.oDataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay)},processError:function(e){var m="";var a="";if(e.response){m=e.response.statusText;var b=e.response.body;var i=b.indexOf("value");var c=b.substring(i).indexOf("}");if(c>-1){m=b.substring(i+8,i+c-1)}var d=b.indexOf("errordetails");var f=b.substring(d).indexOf("message");var g=b.substring(d+f).indexOf(",");if(g>-1){a=b.substring(d+f+10,d+f+g-1)}}var M={message:m,details:a,type:sap.ca.ui.message.Type.ERROR};sap.ca.ui.message.showMessageBox({type:M.type,message:M.message,details:M.details})},getWorkDays:function(a,b,e,s){this.showBusy();var c=this;if(jQuery.sap.getUriParameters().get("responderOn")){var j=new sap.ui.model.json.JSONModel();j.loadData("resources/model/workdays.json",{},false);var d=j.getData();var n=[];for(var i=0;i<d.length;i++){if(d[i].date>=b&&d[i].date<=e){n.push(d[i])}}s(n);c.hideBusy()}else{this._initialize(a);jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));this.oDataModel.read("/WorkCalendars",null,["$filter=StartDate eq '"+b+"' and EndDate eq '"+e+"'"],true,function(D,r){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));s(D.results);c.hideBusy()},function(E){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));c.hideBusy(true);c.processError(E)})}},getWorkListCollection:function(a,b,e,s){this.showBusy();var c=this;if(jQuery.sap.getUriParameters().get("responderOn")){var j=new sap.ui.model.json.JSONModel();j.loadData("resources/model/worklist.json",{},false);var d=j.getData();var n=[];for(var i=0;i<d.length;i++){if(d[i].WorkDate>=b&&d[i].WorkDate<=e){n.push(d[i])}}s(n);c.hideBusy()}else{this._initialize(a);jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));this.oDataModel.read("/TimeDataList",null,["$filter=StartDate eq '"+b+"' and EndDate eq '"+e+"'"],true,function(D){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORKLIST_COLLECTION));for(var i=0;i<D.results.length;i++){D.results[i].Level=D.results[i].Level.toString().trim()}s(D.results);c.hideBusy()},function(E){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORKLIST_COLLECTION));c.hideBusy(true);c.processError(E)})}},getCostAssignmentWorkListCollection:function(a,b,e,s){this.showBusy();var c=this;if(jQuery.sap.getUriParameters().get("responderOn")){var j=new sap.ui.model.json.JSONModel();j.loadData("resources/model/CostAssignmentWorkList.json",{},false);s(j.getData());c.hideBusy()}else{this._initialize(a);jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));this.oDataModel.read("/WorkListCollection",null,["$filter=StartDate eq '"+b+"' and EndDate eq '"+e+"'"],true,function(d){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION));for(var i=0;i<d.results.length;i++){d.results[i].Level=d.results[i].Level.toString().trim()}s(d.results);c.hideBusy()},function(E){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION));c.hideBusy(true);c.processError(E)})}},getCostAssignmentWorkListTypeCollection:function(a,s){this.showBusy();var b=this;if(jQuery.sap.getUriParameters().get("responderOn")){var j=new sap.ui.model.json.JSONModel();j.loadData("resources/model/CostAssignmentWorkListType.json",{},false);s(j.getData());b.hideBusy()}else{this._initialize(a);jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_PROJECT_SUMMARY));this.oDataModel.read("/ProfileFields",null,[],true,function(d){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION));s(d.results);b.hideBusy()},function(e){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION));b.hideBusy(true);b.processError(e)})}},getCostAssignmentTypeListCollection:function(f,t,s,a,b,c,e,S){this.showBusy();var d=this;if(jQuery.sap.getUriParameters().get("responderOn")){var j=new sap.ui.model.json.JSONModel();j.loadData("resources/model/CostAssignmentTypeList.json",{},false);S(j.getData());d.hideBusy()}else{var q=["$filter=FieldName eq '"+f+"'"];q[0]+=" and StartDate eq '"+encodeURIComponent(c)+"'"+" and EndDate eq '"+encodeURIComponent(e)+"' ";if(a){q[0]+="and substringof('"+encodeURIComponent(a)+"',FieldValue)"}if(b){q[0]+="and FieldRelated eq '"+encodeURIComponent(b)+"'"}q[0]+="&$top="+t+"&$skip="+s;this._initialize();jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));this.oDataModel.read("/ValueHelpList",null,q,true,function(D){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION));S(D.results);d.hideBusy()},function(E){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION));d.hideBusy(true);d.processError(E)})}},getInitialInfos:function(a,b,e,s){if(jQuery.sap.getUriParameters().get("responderOn")){var j=new sap.ui.model.json.JSONModel();j.loadData("resources/model/InitialInfos.json",{},false);s(j.getData())}else{this._initialize(a);var c=this;jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_WORK_DAYS));this.oDataModel.read("/InitialInfos",null,["$filter=StartDate eq '"+b+"' and EndDate eq '"+e+"'"],false,function(d){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_INITIAL_INFOS));var f=d.results[0];if(f){var g=new sap.ui.model.json.JSONModel({newItemCount:c.oBundle.getText('MISSING_DAYS',[0]),showBusyIndicator:false,modellingName:"initialInfoModel"});g.setProperty("/quickEntryCounter",f.Counter);g.setProperty("/startDate",f.StartDate);g.setProperty("/endDate",f.EndDate);g.setProperty("/clockEntry",f.ClockEntry=="TRUE");g.setProperty("/decimalTimeEntry",true);g.setProperty("/allowNonWorkingDays",f.AllowNonWorkingDays=="TRUE");g.setProperty("/itemCount",parseInt(f.MissingDays.trim()));g.setProperty("/allHours",parseFloat(f.AllHours.trim()));g.setProperty("/weekHours",parseFloat(f.WeekHours.trim()));g.setProperty("/monthHours",parseFloat(f.MonthHours.trim()));g.setProperty("/releaseAllowed",f.ReleaseAllowed=="TRUE");g.setProperty("/releaseFuture",f.ReleaseFuture=="TRUE");a.oApplication.setModel(g,"timesheet_initialInfo")}for(var i=0;i<d.results.length;i++){d.results[i].Level=d.results[i].Level.toString().trim()}s(d.results)},function(E){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_GET_INITIAL_INFOS));c.processError(E)})}},submitQuickEntry:function(a,b,e,s,f){this._initialize(a);var m=a.oApplication.getModel("timesheet_initialInfo");var d={};d.EndDate=e;d.StartDate=b;d.Counter=m.getData().quickEntryCounter;if(jQuery.sap.getUriParameters().get("responderOn")){s();return}this.showBusy();var c=this;var M=this.oDataModel;M.refreshSecurityToken(function(D,r){M.oHeaders={"x-csrf-token":r.headers["x-csrf-token"],"Accept":"application/json"};jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils.getStartId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));M.create("/InitialInfos",d,null,function(D,r){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));s();c._initialize();c.hideBusy(true);sap.m.MessageToast.show(c.oConfiguration.getText("SUBMIT_SUCCESS"))},function(E){jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils.getEndId(hcm.emp.mytimesheet.utils.PerfUtils.SERVICE_SUBMIT_QUICK_ENTRY));c.hideBusy(true);var g="";if(E.response){var h=E.response.body;var j=h.indexOf("errordetails");var k=h.substring(j).split("message");for(var i=1;i<k.length;i++){var l=k[i];var n=l.indexOf(",");if(n>-1){g=g+l.substring(3,n-1)+'\r\n'}}}c._initialize(a);var o=c.oBundle;var p={message:c.oConfiguration.getText("ERROR_SUBMIT_AUTO_ENTRY"),details:g,type:sap.ca.ui.message.Type.ERROR};sap.ca.ui.message.showMessageBox({type:p.type,message:p.message,details:p.details});f()})},function(E){c.hideBusy(true);c.processError(E);f()},true)},checkSubmittedTime:function(a,t,b,c,s,f){this.showBusy();this._initialize(a);var d=this;var e=t.concat(b);var g=e.concat(c);var m=this.oDataModel;this.errors=[];this.responseData=[];m.refreshSecurityToken(function(D,r){var h=JSON.stringify(g);var j={"checkTimeString":h};m.create("/CheckTimeEntries",j,null,function(){s();d.hideBusy(true)},function(D){if(D.response){var k=D.message;var l=D.response.body;var n=JSON.parse(l);var o=(n.error.innererror.errordetails.length-1);var p="";for(var i=0;i<o;i++){k=n.error.innererror.errordetails[i].message;p=n.error.innererror.errordetails[i].code;d.errors.push({code:p,message:k})}}if(D.response){d.hideBusy(true);if(d.errors.length>0){var q="";for(var i=0;i<d.errors.length;i++){q=q+d.errors[i].code+": "+d.errors[i].message+'\r\n'}var M={message:d.oConfiguration.getText("ERROR_SUBMIT"),details:q,type:sap.ca.ui.message.Type.ERROR};sap.ca.ui.message.showMessageBox({type:M.type,message:M.message,details:M.details});f(d.errors,d.responseData)}}},true)},function(E){d.hideBusy(true)},true)},submitTimeEntry:function(a,t,b,c,s,f){this.showBusy();this._initialize(a);var e=this;var g=t.concat(b);var h=g.concat(c);var j=this.oDataModel;this.errors=[];this.responseData=[];j.refreshSecurityToken(function(D,r){for(var i=0;i<h.length;i++){e.data=h[i];var k=j.createBatchOperation("/TimeEntries","POST",e.data);var l=[];l.push(k);j.addBatchChangeOperations(l)}j.submitBatch(function(D,r,E){for(var i=0;i<D.__batchResponses.length;i++){if(D.__batchResponses[i].response){var n=D.__batchResponses[i].message;var o;o=D.__batchResponses[i].response.statusText;var p=D.__batchResponses[i].response.body;var q=p.indexOf("errordetails");if(q>-1){var u=p.substring(q).indexOf("message");var v=p.substring(q+u).indexOf(",");if(v>-1){n=p.substring(q+u+10,q+u+v-1)}}e.errors.push({counter:h[i].Counter,workdate:h[i].TimeEntryDataFields.WORKDATE,time:h[i].TimeEntryDataFields.CATSHOURS,message:n})}else if(D.__batchResponses[i].__changeResponses){e.responseData.push(D.__batchResponses[i].__changeResponses[0].data)}}e.hideBusy(true);e._initialize();var w=e.oBundle;if(e.errors.length>0){var x="";for(var i=0;i<e.errors.length;i++){var z=e.errors[i].workdate;var y=parseInt(z.substr(0,4),10);var m=parseInt(z.substr(4,2),10)-1;var d=parseInt(z.substr(6,2),10);var A=sap.ui.core.format.DateFormat.getDateInstance({style:"short"}).format(new Date(y,m,d,0,0,0,0));x=x+A+": "+e.errors[i].message+'\r\n'}var M={message:e.oConfiguration.getText("ERROR_SUBMIT"),details:x,type:sap.ca.ui.message.Type.ERROR};sap.ca.ui.message.showMessageBox({type:M.type,message:M.message,details:M.details});f(e.errors,e.responseData)}else{s()}},function(E){e.hideBusy(true)})},function(E){e.hideBusy(true)},true)},showBusy:function(){this._nCounter++;if(this._nCounter==1){sap.ca.ui.utils.busydialog.requireBusyDialog()}},hideBusy:function(f){if(this._nCounter==0)return;this._nCounter=f?0:Math.max(0,this._nCounter-1);if(this._nCounter>0){return}sap.ca.ui.utils.busydialog.releaseBusyDialog()},});