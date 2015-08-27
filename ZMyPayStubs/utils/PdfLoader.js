/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.utils.PdfLoader");
hcm.emp.payslip.utils.PdfLoader=function(){this.sUrl=null;this.sState="idle";this.oRequester=null;this.fOnSuccess=null;this.fOnFailure=null};
hcm.emp.payslip.utils.PdfLoader.prototype.LoadPdf=function(u,o,a){jQuery.sap.log.debug("PdfLoader::LoadPdf "+u);if(u==this.sUrl){jQuery.sap.log.debug("PdfLoader::LoadPdf already loading "+u)}else{if(null!=this.oRequester){jQuery.sap.log.debug("PdfLoader::abort "+this.sUrl);this.oRequester.abort()}this.sUrl=u;this.fOnSuccess=o;this.fOnFailure=a;this.LoadPdfData(jQuery.proxy(this.onComplete,this))}};
hcm.emp.payslip.utils.PdfLoader.prototype.LoadPdfData=function(o){jQuery.sap.log.debug("PdfLoader::LoadPdfData "+this.sUrl);this.sState="loading";this.oRequester=new XMLHttpRequest();this.oRequester.open("GET",this.sUrl);this.oRequester.setRequestHeader("Accept-Language",sap.ui.getCore().getConfiguration().getLanguage());this.oRequester.responseType="arraybuffer";this.oRequester.onload=function(){o()};this.oRequester.send()};
hcm.emp.payslip.utils.PdfLoader.prototype.onComplete=function(){jQuery.sap.log.debug("PdfLoader::onComplete "+this.sUrl);this.sState="loaded";try{if(this.oRequester.status==200||this.oRequester.status==0){var p=this.oRequester.response;if(null!=this.fOnSuccess){this.fOnSuccess(p)}}else{if(null!=this.fOnFailure){this.fOnFailure(this.oRequester.responseText)}}}catch(e){if(null!=this.fOnFailure)this.fOnFailure(null)}this.oRequester=null};
