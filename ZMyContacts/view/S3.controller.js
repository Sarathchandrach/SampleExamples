/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
(function(){'use strict';jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");jQuery.sap.require("sap.ca.ui.message.message");jQuery.sap.require("sap.ca.ui.model.type.DateTime");jQuery.sap.require("sap.m.MessageBox");sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.mycontacts.view.S3",{onInit:function(){this.fullScreenMode=false;sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);this.oFileUpload=this.byId('fileupload');var v=this.getView(),f=this.byId('fileupload'),u=this.getView().getModel().sUrlParams;if(f.getUploadEnabled()){f.setXsrfToken(this.getXsrfToken());f.setEncodeUrl("/sap/bc/ui2/encode_file"+(u?'?'+u:''))}this.oRouter.attachRouteMatched(function(e){var a=e.getParameter("name");if(a==="detail2"||a==="display"){if(a==="display"){this.fullScreenMode=true}else{this.fullScreenMode=false}var m=this.getView().getModel();var A=e.getParameter("arguments");var c=new sap.ui.model.Context(m,'/'+A.contextPath);if(a==="detail2"){this.sFilter=A.filter;this.sSort=A.sort;this.bIsSearch=A.isSearch;this.sSearch=A.search;this.iAccountID=A.accountID;this.iContactID=A.contactID;this.iItemCount=A.itemCount}if(!c.getObject()){var t=this;m.createBindingContext(c.sPath,"",{expand:this._getExpandForDataBinding()},function(){v.setBindingContext(c);t._bindSelectedTab(m,c)},true)}else{if(a==="detail2"){v.setBindingContext(c);this.byId("iconTabBar").setSelectedKey("details");this._bindSelectedTab(m,c)}}}},this)},onUploadFile:function(e){var d,f;d=e.getParameters()&&e.getParameters().d?e.getParameters().d:e.getParameters();f=this.buildFileDescriptorObject(d);this.byId('fileupload').commitFileUpload(f);cus.crm.mycontacts.util.Util.getRefreshUIObject(this.getView().getModel(),"/AttachmentCollection(documentID='"+d.documentID+"',documentClass='"+d.documentClass+"',businessPartnerID='"+d.businessPartnerID+"')")},onFileUploadFailed:function(e){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:e.getParameters().exception.message,details:e.getParameters().response})},buildFileDescriptorObject:function(v){var f,u;if(v["URL"])u=v["URL"];else u=cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter(v.__metadata.media_src);var f;f={name:v.name,size:v.fileSize,url:u,uploadedDate:v.createdAt,contributor:v.createdBy,mimeType:v.mimeType,fileId:v.documentID,mediaURL:cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter(v.__metadata.media_src)};return f},onRenameFile:function(e){var p=e.getParameters();var r="";if(p.mediaURL)r=p.mediaURL.split("(").pop();else r=p.url.split("(").pop();var a="AttachmentCollection(";r=r.replace(/%27/g,"'");this._renameFile((a+r).split("/")[0],p.newFilename+p.parsedFileExtension)},_renameFile:function(c,a,f){var e=null;if(f)e="*";var m=this.getView().getModel();var A={};A.name=a;var u=c;var b=[];var B=m.createBatchOperation(u,"PUT",A,{sETag:e});b.push(B);var t=this;cus.crm.mycontacts.util.Util.sendBatchChangeOperations(m,b,function(){t._onAfterRename(c)},function(E){E.newAttachmentName=a;t._onAfterRename(c,E)})},_onAfterRename:function(c,e){if(e){if(this["_onAfterSaveHandleErrorCode_"+e.statusCode])this["_onAfterSaveHandleErrorCode_"+e.statusCode](c,e);else{sap.m.MessageBox.alert(e.message.value);this.oFileUpload.abandonPendingRenames()}}else{cus.crm.mycontacts.util.Util.getRefreshUIObject(this.getView().getModel(),"/"+c).refresh();this.oFileUpload.commitPendingRenames()}},_onAfterSaveHandleErrorCode_412:function(c,e){var t=this;sap.m.MessageBox.show(cus.crm.mycontacts.util.Util.geti18NText("MSG_CONFLICTING_FILE_NAME"),{title:cus.crm.mycontacts.util.Util.geti18NText("CONFIRM_TITLE"),actions:[sap.m.MessageBox.Action.YES,sap.m.MessageBox.Action.NO],onClose:function(a){if(a==sap.m.MessageBox.Action.YES){t._renameFile(c,e.newAttachmentName,true)}else{t.oFileUpload.abandonPendingRenames();t._bindAttachments(t.getView().getModel(),t.getView().getBindingContext())}},})},onDeleteFile:function(e){var m=this.getView().getModel();var p=e.getParameters();var r="";if(p.mediaURL)r=p.mediaURL.split("(").pop();else r=p.url.split("(").pop();var a="AttachmentCollection(";var u=a+r;var b=[];var B=m.createBatchOperation(u,"DELETE",undefined,{sETag:"*"});b.push(B);this._submitBatchOperation(b,function(){this.oFileUpload.removeFile([p.fileId])})},_submitBatchOperation:function(b,c,a){var m=this.getView().getModel();m.clearBatch();m.addBatchChangeOperations(b);var t=this;m.submitBatch(jQuery.proxy(function(d){var e=null;var B=d.__batchResponses;var r=null;for(var i=0;i<B.length;i++){if(B[i].response){e=jQuery.parseJSON(B[i].response.body).error.message.value}if(B[i].__changeResponses&&B[i].__changeResponses.length>0&&B[i].__changeResponses[0].statusCode==201){r=B[i].__changeResponses[0].data}}if(!e){if(c)c.call(t,r)}else{sap.m.MessageBox.alert(e);if(a)a.call(t)}},this),true)},getXsrfToken:function(){var t=this.getView().getModel().getHeaders()['x-csrf-token'];if(!t){this.getView().getModel().refreshSecurityToken(function(e,o){t=o.headers['x-csrf-token']},function(){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:'Could not get XSRF token',details:''})},false)}return t},onShowBusinessCard:function(){var m=this.getView().getModel(),c=this.getView().getBindingContext(),a=m.getProperty("accountID",c),C=m.getProperty("contactID",c),p="/AccountCollection('"+a+"')",A=m.getProperty(p),d=new sap.m.Button(),b,r;d.setModel(m);if(A){this.showBusinessCard(A)}else{r=jQuery.proxy(function(){var A=m.getProperty(p,null);if(A){this.showBusinessCard(A)}d.unbindElement();b.detachDataReceived(r)},this);d.bindElement("/ContactCollection(contactID='"+C+"',accountID='"+a+"')/Account",{expand:'MainAddress,MainContact,MainContact/WorkAddress,Logo'});b=d.getElementBinding();b.attachDataReceived(r)}},showBusinessCard:function(a){var m,p,c,M,l,C,o,b,d,e;m=this.getView().getModel();p="/AccountCollection('"+a.accountID+"')";l=m.getProperty(p+"/Logo");C=function(){var n={};n.target={};n.target.semanticObject="Account";n.target.action="MyAccounts&/detail/AccountCollection('"+a.accountID+"')";return n};c=m.getProperty(p+"/fullName");if(!c){c=m.getProperty(p+"/name1")}M=m.getProperty(p+"/MainAddress");e=new sap.ui.model.json.JSONModel();e.setData(M);this.resourceBundle=this.oApplicationFacade.getResourceBundle();o={popoverHeight:"22rem",title:this.resourceBundle.getText("CONTACT_ACCOUNT"),headerNoIcon:false,headerImgURL:cus.crm.mycontacts.formatter.ReleaseFormatter.logoUrlFormatter(l),headerTitle:c,subViewName:"cus.crm.mycontacts.view.AccountBusinessCard",beforeExtNav:C,oModel:e};b=this.byId("company");d=new sap.ca.ui.quickoverview.Quickoverview(o);d.openBy(b)},getHeaderFooterOptions:function(){var t=this;return{buttonList:[{sI18nBtnTxt:"S3_EDIT",onBtnPressed:function(){var p;if(t.fullScreenMode){p={contextPath:t.getView().getBindingContext().getPath().substr(1),};t.oRouter.navTo("edit",p,false)}else{p={editPath:t.getView().getBindingContext().getPath().substr(1),filter:t.sFilter,sort:t.sSort,isSearch:t.bIsSearch,search:t.sSearch,accountID:t.iAccountID,contactID:t.iContactID,itemCount:t.iItemCount};t.oRouter.navTo("subDetail",p,true)}}}],oAddBookmarkSettings:{icon:"sap-icon://Fiori2/F0004"},onBack:t._getBackFunction(),}},_getBackFunction:function(){if(this.fullScreenMode)return function(){window.history.back(1)};else return undefined},onSelectTab:function(e){var m,c;m=e.getSource().getModel();c=e.getSource().getBindingContext();this._bindSelectedTab(m,c)},_bindSelectedTab:function(m,c){switch(this.byId("iconTabBar").getSelectedKey()){case"details":break;case"attachments":this._bindAttachments(m,c);break;case"notes":this._bindNotes(c);break}},_bindAttachments:function(m,c){var s=this;var u=m.sUrlParams;var d={Attachments:[]};s.oFileUpload.setModel(new sap.ui.model.json.JSONModel(d));if(s.oFileUpload.getUploadEnabled()){s.oFileUpload.setUploadUrl(c.getModel().sServiceUrl+c.getPath()+'/Attachments'+(u?'?'+u:''))}cus.crm.mycontacts.util.Util.readODataObjects(c,"Attachments",function(r){jQuery.each(r,function(i,v){d.Attachments.push(s.buildFileDescriptorObject(m.getProperty("/"+v)))});s.oFileUpload.setModel(new sap.ui.model.json.JSONModel(d))})},_bindNotes:function(c){var t,m;t=new sap.ca.ui.ExpansibleFeedListItem({type:sap.m.ListType.Inactive,activeIcon:undefined,sender:"{CRM_BUPA_ODATA_CREATE>creator}",text:"{CRM_BUPA_ODATA_CREATE>content}",timestamp:"{path:'CRM_BUPA_ODATA_CREATE>createdAt', type:'sap.ca.ui.model.type.DateTime', formatOptions : { style:'medium'}}",senderActive:false,iconActive:true,showIcon:false,maxLines:3});m=this.oConnectionManager.getModel("CRM_BUPA_ODATA_CREATE");this.byId("myNotes").reset();this.byId("myNotes").destroyAggregation("items");this.byId("myNotes").setBindingContext(c);this.byId("myNotes").bindAggregation("items",{path:"CRM_BUPA_ODATA_CREATE>"+c.getPath()+"/Notes",template:t});this.byId("myNotes").setModel(m)},_handleAddNote:function(e){var t,v,m,c="",n,C,N;t=e.getParameter("value");t=jQuery.trim(t);if(t.length==0){return}v=this.getView();m=v.getModel("CRM_BUPA_ODATA_CREATE");n={"tdname":c,"tdid":"","tdspras":"","content":t,"createdAt":null,"creator":""};C=v.getBindingContext();N=jQuery.proxy(function(E){var M;if(E.response){M=jQuery.parseJSON(E.response.body).error.message.value}sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:M})},this);m.forceNoCache(true);m.create("Notes",n,C,undefined,N)},_getExpandForDataBinding:function(){var e='Photo';var d=this._getDependentRelations();for(var i in d){e=e+","+d[i]}return e},_getDependentRelations:function(){var d=["WorkAddress"];var D=[];if(this.extHookGetDependentCustomRelations)D=this.extHookGetDependentCustomRelations();for(var i in D){d.push(D[i])}return d},})}());