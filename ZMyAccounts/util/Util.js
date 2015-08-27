/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.util.Util");jQuery.sap.require("sap.ca.ui.quickoverview.Quickoverview");cus.crm.myaccounts.util.Util={setApplicationFacade:function(a){this.oApplicationFacade=a},geti18NResourceBundle:function(){if(this.oApplicationFacade){return this.oApplicationFacade.getResourceBundle()}else{return null}},geti18NText:function(k){if(this.geti18NResourceBundle()){return this.geti18NResourceBundle().getText(k)}else{return null}},geti18NText1:function(k,r){if(this.geti18NResourceBundle()){return this.geti18NResourceBundle().getText(k,r)}else{return null}},openQuickoverview:function(p,t,s,a,c,b,d,C,e,f){var g=c.getPath();var m=c.getModel();var h=C.getPath();var M=C.getModel();var o={};o.Company={};o.Company.Address=M.getProperty(h+"/"+e);o.Company.name=cus.crm.myaccounts.util.formatter.AccountNameFormatter(M.getProperty(h).fullName,M.getProperty(h).name1);o.Person=m.getProperty(g+"/"+b);var j="";if(o.Person&&d){j=m.getProperty(g+"/"+b+"/"+d);o.Person.Address=j}var B=new sap.ui.model.json.JSONModel();B.setData(o);var k,l;if(a){k=false;l=a}else{k=true;l=""}var n={popoverHeight:"32rem",title:p,headerNoIcon:k,headerImgURL:l,headerTitle:t,headerSubTitle:s,subViewName:"cus.crm.myaccounts.view.overview.Quickoverview",oModel:B};var q=new sap.ca.ui.quickoverview.Quickoverview(n);q.openBy(f);if(!o.Person||!j){m.read(b,c,["$expand="+d],true,function(D,r){var P=jQuery.parseJSON(JSON.stringify(D));o.Person=P;o.Person.Address=P[d];var u=sap.ui.getCore().byId("cus.crm.myaccounts.view.overview.Quickoverview").byId("quickOverviewForm1");var v;for(var i in u.getContent()){v=sap.ui.getCore().byId(u.getContent()[i].getId());var w=v.getBindingInfo("text");if(w)w.binding.refresh()}},function(E){jQuery.sap.log.error("Read failed in Util.js:"+E.response.body)})}if(!o.Company.Address){this.readODataObject(C,e,function(){})}},readODataObjects:function(c,r,a){var C=c.getModel().getProperty(c.sPath);if(c.getModel().getProperty(c.sPath+"/"+r)){a(c.getModel().getProperty(c.sPath+"/"+r));return}var i=new sap.m.StandardListItem({text:""});var l=new sap.m.List({items:{path:r,template:i}});l.setModel(c.getModel());l.setBindingContext(c);var b=l.getBinding("items");var R=null;R=jQuery.proxy(function(d){if(d.getSource().aKeys.length>0)C[r]={__list:d.getSource().aKeys};else C[r]=null;b.detachDataReceived(R);l.destroy();a(c.getModel().getProperty(c.sPath+"/"+r))},this);b.attachDataReceived(R)},readODataObject:function(c,r,a,f){var C=c.getModel().getProperty(c.sPath);if(c.getModel().getProperty(c.sPath+"/"+r)&&!f){a(c.getModel().getProperty(c.sPath+"/"+r));return}var l=new sap.m.List();l.bindElement(c.sPath+"/"+r);l.setModel(c.getModel());l.setBindingContext(c);var b=l.getElementBinding();var R=null;R=jQuery.proxy(function(d){if(d.getSource().getBoundContext())C[r]={__ref:d.getSource().getBoundContext().sPath.substr(1)};else C[r]=null;b.detachDataReceived(R);l.destroy();a(c.getModel().getProperty(c.sPath+"/"+r))},this);b.attachDataReceived(R)},getRefreshUIObject:function(m,c,e){if(!this.refreshList)this.refreshList=new sap.m.List();var l=this.refreshList;if(e)l.bindElement(c,{expand:e});else l.bindElement(c);l.setModel(m);var b=l.getElementBinding();var C=null;C=jQuery.proxy(function(a){if(b)b.detachDataRequested(C);b=null},this);b.attachDataRequested(C);var r={refresh:function(){if(b)b.refresh()},destroy:function(){C()},};return r},getServiceSchemaVersion:function(m,e){var v=0;var E=m.oMetadata._getEntityTypeByPath(e);for(var i in E.extensions){if(E.extensions[i].name=="service-schema-version")v=E.extensions[i].value}return v}};
