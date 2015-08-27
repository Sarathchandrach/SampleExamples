/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");jQuery.sap.require("cus.crm.mycalendar.util.Conversions");jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");jQuery.sap.require("sap.ca.ui.model.type.FileSize");jQuery.sap.require("cus.crm.mycalendar.util.Util");sap.ui.controller("cus.crm.mycalendar.view.Attachments",{onInit:function(){},refresh:function(c,a,m){var _=cus.crm.mycalendar.util.Conversions.uploadUrlConverter(c);var u=this.getView().getModel().sUrlParams;var A=this.byId('attachments');A.setXsrfToken(this.getXsrfToken());A.setEncodeUrl("/sap/bc/ui2/encode_file"+(u?'?'+u:''));var b;var d={AppointmentToAttachment:[]};$.each(a.results,function(i,v){var o={name:v.RelativeUrl,size:v.FileSize,url:(v.UrlAttachment==="")?cus.crm.mycalendar.util.Conversions.urlConverter(v.__metadata.media_src):v.UrlAttachment,uploadedDate:v.UploadedDate,contributor:v.CreatedBy,fileExtension:cus.crm.mycalendar.util.Conversions.mimeTypeConverter(v.Mimetype),fileId:v.Id,media_src:v.__metadata.media_src};d.AppointmentToAttachment.push(o)});this.byId('attachments').setModel(new sap.ui.model.json.JSONModel(d));this.byId('attachments').setUploadUrl(_);this.getView().byId("attConti").setVisible(true);if(d.AppointmentToAttachment.length==0){b=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber","0");if(!m){this.getView().byId("attConti").setVisible(false)}}else{b=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber",d.AppointmentToAttachment.length)}if(m){var e=this.byId('attachments');e.setUploadEnabled(true);e.setRenameEnabled(true)}if(c==""&&m){this.byId('attachments').setUploadEnabled(false);this.byId('attachments').setShowNoData(false);b=cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.attachmentSaveRequest")}this.getView().byId("attTitle").setTitle(b)},onUploadFile:function(e){cus.crm.mycalendar.util.Util._fetchETag(this.getView().getBindingContext().getPath(),this.getView().getModel());var d;if(e.getParameters()&&e.getParameters().d){d=e.getParameters().d}else{d=e.getParameters()}this.value=d;var f=this.buildFileDescriptorObject(d);this.byId('attachments').commitFileUpload(f);this.countAttachments("1");this.byId('attachments').setRenameEnabled(true)},buildFileDescriptorObject:function(v){var f={name:v.Filename,size:v.FileSize,url:cus.crm.mycalendar.util.Conversions.urlConverter(v.__metadata.media_src),uploadedDate:v.UploadedDate,contributor:v.Contributor,fileExtension:v.FileExtension,fileId:v.Id,xsrfToken:this.getView().getModel().refreshSecurityToken()};return f},onBeforeUploadFile:function(e){var A=this.byId("attachments").getProperty("uploadUrl");var a=A.split("'");A=e.getParameter("name")+";"+"AppointmentMain"+";"+a[1].replace(/-/g,"");this.byId("attachments").setCustomHeader("slug",A)},onRenameFile:function(e){var t=this;var m=this.getView().getModel();var u=e.getParameter("media_src");var v=1;if(!u){var a=this.value.DocId;u=a.split('/').join('%2F');v=0}var A=u.split("'");var d=A[v];var b;d=d.split('%2F').join('/');var E={RelativeUrl:e.getParameter("newFilename"),Description:e.getParameter("newFilename"),DocId:d};b="/AttachmentSet('"+A[v]+"')";m.update(b,E,null,function(D,r){cus.crm.mycalendar.util.Util._fetchETag(t.getView().getBindingContext().getPath(),t.getView().getModel())},function(M){t.displayResponseErrorMessage(M,sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('SAVE_FAILED'))})},onSaveClicked:function(){var s=true;var f=this.byId("attachments");if(s){f.commitPendingRenames()}else{f.abandonPendingRenames()}},onDeleteFile:function(e){var A;this.byId("attachments").removeFile(e.getParameters().fileId);var m=this.getView().getModel();var b=[];if(e.getParameters().media_src){A=e.getParameters().media_src}else{A=e.getParameters().url}var a=A.split("'");A="/AttachmentSet('"+a[1]+"')";var c=m.createBatchOperation(A,"DELETE");b.push(c);m.addBatchChangeOperations(b);m.submitBatch(jQuery.proxy(this.successSave,this),jQuery.proxy(this.errorSave,this));this.countAttachments("0")},displayResponseErrorMessage:function(m,d){var M;if(m.response){M=jQuery.parseJSON(m.response.body).error.message.value}else M=d;sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:M,})},getXsrfToken:function(){var t=this.getView().getModel().getHeaders()['x-csrf-token'];if(!t){this.getView().getModel().refreshSecurityToken(function(e,o){t=o.headers['x-csrf-token']},function(){throw new Error('could not refresh XSRF token')},false)}return t},countAttachments:function(v){var t=this;var a=t.byId("attTitle").getTitle();var b=a.split("(");b=b[1].split(")");a=b[0];if(v=="0"){a=Number(a)-1}else{a=Number(a)+1}if(isNaN(a)){}else{var c=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber",a);if(a===0){c=cus.crm.mycalendar.util.Util.geti18NText1("view.Appointment.attachmentDataNumber","0")}t.byId("attTitle").setTitle(c);t.byId('attachments').setRenameEnabled(false)}},successSave:function(r){cus.crm.mycalendar.util.Util._fetchETag(this.getView().getBindingContext().getPath(),this.getView().getModel())}});