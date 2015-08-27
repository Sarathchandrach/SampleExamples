/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.utils.PdfLoader");

hcm.emp.payslip.utils.PdfLoader = function(){
    this.sUrl = null;
    this.sState = "idle";
    this.oRequester = null;
    this.fOnSuccess = null;
    this.fOnFailure = null;
};

hcm.emp.payslip.utils.PdfLoader.prototype.LoadPdf = function (url, onSuccess, onFailure) {

    jQuery.sap.log.debug("PdfLoader::LoadPdf " + url);

    if (url==this.sUrl) {
        jQuery.sap.log.debug("PdfLoader::LoadPdf already loading " + url);
    }
    else {

        // cancel previous request
        if (null!=this.oRequester) {
            jQuery.sap.log.debug("PdfLoader::abort " + this.sUrl);
            this.oRequester.abort();
        }

        this.sUrl = url;
        this.fOnSuccess = onSuccess;
        this.fOnFailure = onFailure;

        // new request
        this.LoadPdfData(jQuery.proxy(this.onComplete, this));
    }
};

hcm.emp.payslip.utils.PdfLoader.prototype.LoadPdfData = function(onComplete) {

//    jQuery.sap.measure.start(hcm.emp.payslip.utils.PerfUtils.getStartId(hcm.emp.payslip.utils.PerfUtils.LoadPdfData)); TODO: uncomment later
    jQuery.sap.log.debug("PdfLoader::LoadPdfData " + this.sUrl);
    this.sState = "loading";

    this.oRequester = new XMLHttpRequest();
    this.oRequester.open("GET", this.sUrl);
    this.oRequester.setRequestHeader("Accept-Language", sap.ui.getCore().getConfiguration().getLanguage());
    this.oRequester.responseType = "arraybuffer";
    this.oRequester.onload = function () {
        onComplete();
    };

    this.oRequester.send();
};

hcm.emp.payslip.utils.PdfLoader.prototype.onComplete = function () {

    jQuery.sap.log.debug("PdfLoader::onComplete " + this.sUrl);
    this.sState = "loaded";

    try {
        if (this.oRequester.status == 200 || this.oRequester.status == 0) {
            var pdfData = this.oRequester.response;
//            jQuery.sap.measure.end(hcm.emp.payslip.utils.PerfUtils.getEndId(hcm.emp.payslip.utils.PerfUtils.LoadPdfData)); TODO
            if (null!=this.fOnSuccess) {
                this.fOnSuccess(pdfData);
            }
        } else {
            if (null != this.fOnFailure) {
                this.fOnFailure(this.oRequester.responseText);
            }
        }
    }
    catch (error) {
        if (null != this.fOnFailure)
            this.fOnFailure(null);
    }

    this.oRequester = null;
};