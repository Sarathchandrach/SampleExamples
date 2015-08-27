/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.opportunity.util.Formatter");jQuery.sap.require("sap.ca.ui.utils.busydialog");jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");jQuery.sap.require("cus.crm.opportunity.util.schema");jQuery.sap.require("cus.crm.opportunity.util.Util");sap.ca.scfld.md.controller.BaseMasterController.extend("cus.crm.opportunity.view.S2",{processType:"",numberOfOpportunity:0,firstCall:"",desc:undefined,nGuid:undefined,bAppLaunched:true,onInit:function(){sap.ca.scfld.md.controller.BaseMasterController.prototype.onInit.call(this);var c=new sap.ui.model.json.JSONModel({s2Controller:this});this.oApplicationFacade.setApplicationModel("s2Controller",c);var v=this.getView();var s=this;this.guid=undefined;this.accountID=undefined;this.opportunityID=undefined;this.oModel=this.getView().getModel();var C=sap.ui.core.Component.getOwnerIdFor(this.getView());var m=sap.ui.component(C);this.oResourceBundle=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();if(m&&m.getComponentData()&&m.getComponentData().startupParameters){var a=m.getComponentData().startupParameters;jQuery.sap.log.debug("startup parameters are "+JSON.stringify(a));if(m.QtyForAccountID){this.QtyForAccountID=m.QtyForAccountID}if(a.accountID!=null){if(undefined!=a.accountID){this.accountID=a.accountID[0]}}else if(a.opportunityID!=null){this.opportunityID=a.opportunityID[0]}else{if(a.guid!=null){if(undefined!=a.guid){this.guid=a.guid[0]}}}}this.oShowSheet=sap.ui.xmlfragment(this.createId("showFragment"),"cus.crm.opportunity.view.showMaxHit",this);var l=this.getList();var t=l.getItems()[0].clone();var b=this.getFilters();l.bindAggregation("items",{path:'/Opportunities',template:t,filters:b});var M=this.getView().getModel();M.bRefreshAfterChange=false;var d=function(e){var n=this.getList().getBinding('items').getLength();if(this.nGuid!==undefined){this.byId("labelInfo").setText(this.desc);this.byId("toolbarInfo").setVisible(true)}if(this.accountID!=undefined&&this.desc===undefined){if(!this.bAccountNameFound){this.setAccountName()}else{this.byId("labelInfo").setText(this.sProspectName);this.byId('toolbarInfo').setVisible(true)}}if(typeof cus.crm.myaccounts!=='undefined'&&typeof cus.crm.myaccounts.NavigationHelper!=='undefined'&&typeof cus.crm.myaccounts.NavigationHelper.qty!=='undefined'){if(cus.crm.myaccounts.NavigationHelper.qty>n&&typeof this.accountID!=='undefined'){sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("LIST_FILTERED_BY_MYITEMS",[n,cus.crm.myaccounts.NavigationHelper.qty]))};cus.crm.myaccounts.NavigationHelper.qty=undefined}};if(M!=undefined)M.attachRequestCompleted(jQuery.proxy(d,this));var n=this.getList().getBinding('items').getLength();if(n<=0){this.getList().setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NO_DATA_TEXT"))}this.sBackendVersion=cus.crm.opportunity.util.schema._getServiceSchemaVersion(this.oModel,"Opportunity")},setAccountName:function(){var l=this.getList(),i=l.getItems(),b,e;if(i.length>0){b=i[0].getBindingContext();if(b&&b.sPath){this.byId("toolbarInfo").setVisible(true);e=l.getModel().getProperty(b.sPath);if(e&&e.ProspectNumber===this.accountID){this.byId("labelInfo").setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('FILTER')+" "+e.ProspectName);this.bAccountNameFound=true;this.sProspectName=(e.ProspectName!=="")?e.ProspectName:e.ProspectNumber}else{this.bAccountNameFound=false;this.byId("toolbarInfo").setVisible(false)}}}},onBeforeRendering:function(){this.getView().getModel("controllers").getData().s2Controller=this},getFilters:function(){var f=[];if(undefined!=this.accountID&&this.nGuid===undefined){f.push(new sap.ui.model.Filter("ProspectNumber",sap.ui.model.FilterOperator.EQ,this.accountID))}if(undefined!=this.opportunityID){f.push(new sap.ui.model.Filter("Id",sap.ui.model.FilterOperator.EQ,this.opportunityID))}if(undefined!=this.nGuid){f.push(new sap.ui.model.Filter("Guid",sap.ui.model.FilterOperator.EQ,this.nGuid))}if(undefined!=this.guid){f.push(new sap.ui.model.Filter("Guid",sap.ui.model.FilterOperator.EQ,this.guid))}return f},setListItem:function(i){if(this.bAppLaunched)this.prevItem=i;this.oItem=i;this.getList().removeSelections();if(this.prevItem){this.getList().setSelectedItem(this.prevItem)}var c=sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();var e=this.getView().getModel('controllers').getData().s4Controller;var a=this.getView().getModel('controllers').getData().s5Controller;if(!this.bAppLaunched&&c&&e&&(e.getView()===c)){var s=this.getS4Controller();if(s&&s._checkDataLoss()){sap.ca.ui.dialog.confirmation.open({question:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),title:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),confirmButtonLabel:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')},jQuery.proxy(this.datalossDismissed,this));return}}if(!this.bAppLaunched&&c&&a&&(a.getView()===c)){sap.ca.ui.dialog.confirmation.open({question:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),title:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),confirmButtonLabel:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')},jQuery.proxy(this.datalossDismissed,this));return}this.goToDetailPage(i)},goToDetailPage:function(i){var l=this.getList();l.removeSelections();i.setSelected(true);l.setSelectedItem(i,true);this.prevItem=i;if(this.firstCall!=""){this.firstCall="";this.setBtnEnabled("sort",true);this.setBtnEnabled("BTN_S2_ADD",true);this.setBtnEnabled("BTN_S2_SHOW",true)}var c=sap.ui.core.Component.getOwnerIdFor(this.getView());var m=sap.ui.component(c);this.oRouter.navTo("detail",{contextPath:i.getBindingContext().sPath.substr(1)},true)},datalossDismissed:function(r){var s=this.getS4Controller();this.getList().getModel().clearBatch();if(r.isConfirmed===false){this.getList().setSelectedItem(this.prevItem);return}if(s)s.deleteBuffer=[];this.goToDetailPage(this.oItem)},getS3Controller:function(){return this.getView().getModel('controllers').getData().s3Controller},getS4Controller:function(){return this.getView().getModel('controllers').getData().s4Controller},getHeaderFooterOptions:function(){var t=this;var n=0;var b=this.byId("list").getBinding("items");if(b!=undefined&&b!=""){n=b.length}var h={onBack:jQuery.proxy(this.onBack,this),sI18NMasterTitle:this.oApplicationFacade.getResourceBundle().getText("MASTER_TITLE",n),oSortOptions:{sId:"sort",aSortItems:[{text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CLSDATEASC'),key:"ClosingDate"},{text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CLSDATEDESC'),key:"ClosingDate2"},{text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACTASC'),key:"ProspectName"},{text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACTDESC'),key:"ProspectName2"},{text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('STATASC'),key:"UserStatusText"},{text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('STATDESC'),key:"UserStatusText2"}],onSortSelected:function(k){t.applySort(k)}},aAdditionalSettingButtons:[{sI18nBtnTxt:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LIST_SETTING'),sId:"BTN_S2_SHOW",sIcon:"sap-icon://settings",onBtnPressed:function(k){jQuery.proxy(t.onShow(k),this)}},],oAddOptions:{sId:"BTN_S2_ADD",onBtnPressed:function(k){jQuery.proxy(t.onCreate(k),this)}}};if(this.extHookGetHeaderFooterOptions)this.extHookGetHeaderFooterOptions(h);return h},applySort:function(k){if(k==="ProspectName2"||k==="UserStatusText2"||k==="ClosingDate2"){if(k==="ProspectName2"){k="ProspectName"}else if(k==="UserStatusText2"){k="UserStatusText"}else k="ClosingDate";var s=new sap.ui.model.Sorter(k,true,false)}else var s=new sap.ui.model.Sorter(k,false,false);this.getHeaderFooterOptions().oSortOptions.sSelectedItemKey=k;this.getView().byId('list').getBinding("items").aSorters=[];this.getView().byId('list').getBinding("items").aSorters=[s];this.getView().byId('list').getBinding("items").sort(s)},isBackendSearch:function(){sap.ca.scfld.md.controller.BaseMasterController.prototype.applyBackendSearchPattern.call(this);return true},applyBackendSearchPattern:function(f,b){var a=this.getFilters();var o=this.getList();this.getList().setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("LOADING_TEXT"));var v=f;if(v&&v.length>0){a.push(new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,v))}b.aApplicationFilters=[];b.filter(a);var l=this.getList().getBinding("items");if(!jQuery.device.is.phone){}if(this.nGuid!=undefined)l.attachChange(this._selectContextPath,this);this.getView().byId("toolbarInfo").setVisible(false)},onCreate:function(e){var m=this.getView().getModel();var d;m.read("ProcessTypes",null,null,false,jQuery.proxy(function(D,r){d={ProcessTypes:r.data.results};if(d.ProcessTypes.length==1){this.onlyOneProcessType=true;this.processType=d.ProcessTypes[0].ProcessTypeCode;this.processTypeDesc=d.ProcessTypes[0].ProcessTypeDescription;this.selectProcess()}else{this.oActionSheet=sap.ui.xmlfragment("cus.crm.opportunity.view.ProcessTypeDialog",this);this.oActionSheet.setModel(this.getView().getModel("i18n"),"i18n");var j=new sap.ui.model.json.JSONModel();j.setData(d);this.oActionSheet.setModel(j,"json");this.oActionSheet._searchField.setPlaceholder(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SEARCH"));this.oActionSheet._list.setGrowingScrollToLoad(true);this.oActionSheet._dialog.setVerticalScrolling(true);this.oActionSheet.open()}},this),jQuery.proxy(function(E){this.handleErrors(E)},this))},handleErrors:function(e){sap.ca.ui.utils.busydialog.releaseBusyDialog();jQuery.sap.log.error(JSON.stringify(e));sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e.message,details:JSON.parse(e.response.body).error.message.value},function(r){})},onShow:function(e){var t=this;var m=this.getView().getModel();var a;m.read((parseFloat(this.sBackendVersion)>=4)?"RetrieveMaxHitSet":"RetrieveMaxHit",null,null,false,function(d,r){a={RetrieveMaxHit:r.data.results[0]}});this.oldValue=a.RetrieveMaxHit.MaxHitNumber;this.oShowSheet.setModel(this.getView().getModel("i18n"),"i18n");var j=new sap.ui.model.json.JSONModel();j.setData(a);this.oShowSheet.setModel(j,"showJson");this.oShowSheet.open()},closeShow:function(e){this.oShowSheet.close()},saveMaxHit:function(e){this.oModel=this.getView().getModel();var v=this.oShowSheet.getContent()[1].getValue();var t=this;if(v!=this.oldValue)this.oModel.create("UpdateMaxHit",null,{success:jQuery.proxy(function(){this.oModel.bRefreshAfterChange=false;this.oModel.refresh()},this),error:jQuery.proxy(function(E){this.handleErrors(E);this.oModel.bRefreshAfterChange=false},this),async:true,urlParameters:["MaxHitNumber='"+v+"'"]});this.oShowSheet.close()},selectProcess:function(e){if(!this.onlyOneProcessType){var s=e.getParameter("selectedItem");if(s){this.processType=s.data("ProcessTypeCode");this.processTypeDesc=s.data("ProcessTypeDescription")}}this.getView().getController().setBtnEnabled("sort",false);this.getView().getController().setBtnEnabled("BTN_S2_ADD",false);this.getView().getController().setBtnEnabled("BTN_S2_SHOW",false);this.firstCall="X";var l=this.getList();var i=l.getSelectedItem();if(i){var c=i.getBindingContext().sPath.substr(1)}else var c=" ";sap.ca.ui.utils.busydialog.requireBusyDialog();this.oRouter.navTo("create",{contextPath:c,processType:this.processType},!jQuery.device.is.phone);this.onlyOneProcessType=false;sap.ca.ui.utils.busydialog.releaseBusyDialog()},searchProcess:function(e){var i=e.getParameter("itemsBinding");var t=this;var d;this.getList().setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("LOADING_TEXT"));var v=e.getParameter("value");if(v!==undefined){i.filter([new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,v)]);d=i.filter([new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,v)]);if(d.iLength==0){this.getList().setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NO_DATA_TEXT"))}}},_handleToolBar:function(){var f,l;this.byId("toolbarInfo").setVisible(false);var d=false;if(this.desc!==undefined){if(this.accountID!==undefined){this.nGuid=undefined}else{this.byId("toolbarInfo").setVisible(false)}this.nGuid=undefined;this.desc=undefined;d=true}if(!d){if(this.accountID!==undefined){this.accountID=undefined;this.byId("toolbarInfo").setVisible(false)}}f=this.getFilters();var s=this._oControlStore.oMasterSearchField.getValue();if(s&&s.length>0){f.push(new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,s))}l=this.getList().getBinding("items");if(l){l.aApplicationFilters=[];l.filter(f);if(!jQuery.device.is.phone){}}},_selectContextPath:function(e){var l=this.getList(),I=l.getItems(),m,E,i,a,p,b;if(I.length>0&&this.nGuid){e.getSource().detachChange(this._selectContextPath,this);m=l.getModel();p="/Opportunities(guid'"+this.nGuid+"')";E=m.getProperty(p);if(E){for(i=0,a=I.length;i<a;i++){b=I[i].getBindingContext();if(b&&b.sPath===p){if(!jQuery.device.is.phone)this.setListItem(I[i],jQuery.device.is.phone);this.byId("toolbarInfo").setVisible(true);this.byId("labelInfo").setText(this.desc);return}}}else{if(l._oGrowingDelegate._iItemCount<this.iNumberOfContacts){l._oGrowingDelegate.requestNewPage();e.getSource().attachChange(this._selectContextPath,this)}else{this.navToEmptyView()}}}},_selectFirstElement:function(e){var l=this.getList(),I=l.getItems(),b,i,a,p,B,E;var c=sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();var d=this.getView().getModel('controllers').getData().s5Controller;if(c&&d&&(d.getView()===c))return;if(I.length>0){e.getSource().detachChange(this._selectFirstElement,this);for(i=0,a=I.length;i<a;i++){B=I[i].getBindingContext();if(B&&B.sPath){this.setListItem(I[i],jQuery.device.is.phone);return}}}this.navToEmptyView()},navToEmptyView:function(){var s=this.getView().getModel('controllers').getData().s4Controller;if(s&&s.bEmployeeUpdateSuccess){s.bEmployeeUpdateSuccess=false;return}var a=this.getView().getModel('controllers').getData().s3Controller;if(this.bCreateOppt){this.bCreateOppt=false;return}else if(a&&a.navToOtherApp){a.navToOtherApp=false;return}this.getList().setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NO_DATA_TEXT"));this.oRouter.navTo("noData",{viewTitle:"DETAIL_TITLE",languageKey:"NO_ITEMS_AVAILABLE"})},_modifyListAfterCreate:function(){var f,l;f=this.getFilters();l=this.getList().getBinding("items");if(l){l.aApplicationFilters=[];l.filter(f);this.byId("toolbarInfo").setVisible(true);this.byId("labelInfo").setText(this.desc);if(!jQuery.device.is.phone)l.attachChange(this._selectContextPath,this)}},onDataLoaded:function(){if(this.bAppLaunched){this.getList().getBinding('items').attachChange(this.opptListRefreshed,this);this._selectDetail();this.bAppLaunched=false}else{if(this.getList().getBinding('items').getLength()===0){this.getList().setNoDataText(this.oResourceBundle.getText('NO_DATA_TEXT'));if(this.accountID!==undefined)this.navToEmptyView()}else{var i=this.getList().getSelectedItem();if(i&&this.getSplitContainer().getCurrentDetailPage().sViewName==="sap.ca.scfld.md.view.empty"){if(!jQuery.device.is.phone&&this.getS3Controller())this.oRouter.navTo("detail",{contextPath:i.getBindingContext().sPath.substr(1)},!jQuery.device.is.phone)}}}},opptListRefreshed:function(e){this.getList().setNoDataText(this.oResourceBundle.getText('LOADING_TEXT'))},applyFilterFromContext:function(c){this.sContext=c;var l=this.getList();if(l.attachUpdateFinished){l.attachUpdateFinished(null,this.onGrowingFinished,this)}if(this.getS3Controller()){this.oRouter.navTo("detail",{contextPath:c.substr(1)},!jQuery.device.is.phone)}},onBack:function(e){var c=sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();var a=this.getView().getModel('controllers').getData().s4Controller;if(c&&a&&(a.getView()===c)){if(a._checkDataLoss()){this.getList().getModel().clearBatch();sap.ca.ui.dialog.confirmation.open({question:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),title:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),confirmButtonLabel:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')},jQuery.proxy(this.dataLossForExit,this));return}}var b=this.getView().getModel('controllers').getData().s5Controller;if(c&&b&&(b.getView()===c)){sap.ca.ui.dialog.confirmation.open({question:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),title:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),confirmButtonLabel:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')},jQuery.proxy(this.dataLossForExit,this));return}window.history.back(1)},dataLossForExit:function(r){if(r.isConfirmed===true){window.history.back(1)}},onGrowingFinished:function(e){if(this.sContext){var l=this.getList();var a=l.getItems();for(var i=0;i<a.length;i++){if(this.sContext===a[i].getBindingContextPath()){a[i].setSelected(true);this.sContext=null;l.detachUpdateFinished(this.onGrowingFinished,this);this.prevItem=a[i]}else{a[i].setSelected(false)}}}}});
