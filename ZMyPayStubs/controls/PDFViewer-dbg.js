/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.PDFViewer");
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.ui.core.RenderManager");

sap.ui.core.Control.extend("hcm.emp.payslip.controls.PDFViewer", { metadata:{

    // ---- object ----
    properties:{
        "src":{type:"string", group:"Misc"},
        "errorMessage":{type:"string", group:"Misc"},
        "setPdfData":{type:"string", group:"Misc"}
    },
    events:{
        "begin":{},
        "complete":{}
    }
}});

hcm.emp.payslip.controls.PDFViewer.prototype.exit = function () {
    jQuery.sap.log.debug("exit "+this.getSrc());
    this.UnloadPdf();
    this.ClearPdfData();
};

hcm.emp.payslip.controls.PDFViewer.prototype.Show = function (loader) {

    // no need to test empty source
    var sourceURL = this.getSrc();
    if (null==sourceURL || sourceURL.length==0) {
        return;
    }
    // no need to reload the pdf if we already have it
    if (!this._pdfData) {
        // load the pdf
        this.fireBegin();
        loader.LoadPdf(sourceURL, jQuery.proxy(this.setPdfData, this), jQuery.proxy(this.showErrorMessage, this));
    } else {
        // just render the pdf
        this.RenderPdf();
    }
};

hcm.emp.payslip.controls.PDFViewer.prototype.ClearPdfData = function() {
    this._pdfData = null;
};

hcm.emp.payslip.controls.PDFViewer.prototype.UnloadPdf = function () {

    if (this._pdf != null) {
        jQuery.sap.log.debug("UnloadPdf " + this.getSrc());
        this._pdf.destroy();
        this._pdf = null;

        $(this.getDomRef()).empty();
    }
};

hcm.emp.payslip.controls.PDFViewer.prototype.setPdfData = function (data) {

    this._pdfData = data;
    this.RenderPdf();
};

hcm.emp.payslip.controls.PDFViewer.prototype.showErrorMessage = function (responseText) {

    // get response
    var errorResponse = (null!=responseText) ? null : JSON.parse(responseText);
    // show error
//    hcm.emp.payslip.Service.showError(this.getErrorMessage(), errorResponse);TODO
};


hcm.emp.payslip.controls.PDFViewer.prototype.RenderPdf = function() {
//    jQuery.sap.measure.start(sap.hcm.payslip.utils.PerfUtils.getStartId(sap.hcm.payslip.utils.PerfUtils.RenderPdf));

    var id = this.getDomRef(), that = this, contextArray = [];
    jQuery.sap.log.debug("RenderPdf "+this.getSrc());

    if (id.childNodes != null && id.childNodes.length > 0) {
        // The control is already rendered
        setTimeout(function() {
            jQuery.sap.log.debug("The control is already rendered");
            that.fireComplete();
        }, 500);

        return;
    }

        var pdfPath = jQuery.sap.getModulePath("hcm.emp.payslip") + "/ext/pdfjs/pdf.js";//com.sap.kelley.getAppContainer().getDescriptor("Payslip").getPdfPath();
//    if (sap.ui.core.AppCacheBuster && !jQuery.sap.getUriParameters().get("local")) {
//        pdfPath = sap.ui.core.AppCacheBuster.convertURL(pdfPath);
//    }
        
    jQuery.sap.require("hcm.emp.payslip.ext.pdfjs.pdf");
    if (PDFJS.workerSrc != pdfPath) {
        PDFJS.workerSrc =  pdfPath;
    }

    // Fetch the PDF document from the URL using promices
    PDFJS.getDocument(this._pdfData).then(function getPdfForm(pdf) {
        // Rendering all pages starting from first
        that._pdf = pdf;
        var viewer = id, pageNumber = 1;
        that.renderPage(viewer, pdf, pageNumber++, function pageRenderingComplete() {

            // check for last page
            if (pageNumber > pdf.numPages) {
                jQuery.sap.log.debug("renderPage complete");
                that.fireComplete();
//                jQuery.sap.measure.end(sap.hcm.payslip.utils.PerfUtils.getEndId(sap.hcm.payslip.utils.PerfUtils.RenderPdf));
                return; // All pages rendered
            }

            // continue rendering of the next page
            jQuery.sap.log.debug("render another page");
            that.renderPage(viewer, pdf, pageNumber++, pageRenderingComplete);

        }, contextArray);
    });
};


hcm.emp.payslip.controls.PDFViewer.prototype.renderPage = function(div, pdf, pageNumber, callback) {
    pdf.getPage(pageNumber).then(function(page) {
        jQuery.sap.log.debug("renderingPage "+pageNumber);
        var containerWidth, viewportWithoutZoom, viewportWidth, factor, scale, viewport;

        scale = 2;

        // check for valid page
        if (null==div.offsetParent || null==div.offsetParent.clientWidth)  {
            jQuery.sap.log.debug("invalid offsetParent");
            return;
        }

        containerWidth = div.offsetParent.clientWidth;
        viewportWithoutZoom = page.getViewport(1);
        viewportWidth = viewportWithoutZoom.width;
        factor = jQuery.device.is.phone ? 1 : containerWidth / viewportWidth;
        viewport = page.getViewport(scale * factor);

        var pageDisplayWidth = viewport.width;
        var pageDisplayHeight = viewport.height;

        var pageDivHolder = document.createElement('div');
        pageDivHolder.className = 'pdfpage';

        if (jQuery.device.is.phone) {
            pageDivHolder.style.width = pageDisplayWidth + 'px';
            pageDivHolder.style.height = pageDisplayHeight + 'px';

        } else {
            pageDivHolder.style.width = pageDisplayWidth / scale + 'px';
            pageDivHolder.style.height = pageDisplayHeight / scale + 'px';
        }

        div.appendChild(pageDivHolder);

        // Prepare canvas using PDF page dimensions
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = pageDisplayWidth;
        canvas.height = pageDisplayHeight;

        if (jQuery.device.is.phone) {
            canvas.style.width = pageDisplayWidth + 'px';
            canvas.style.height = pageDisplayHeight + 'px';

        } else {
            canvas.style.width = pageDisplayWidth / scale + 'px';
            canvas.style.height = pageDisplayHeight / scale + 'px';
        }

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).then(function() {
            pageDivHolder.appendChild(canvas);
            callback();
        });
    });
};

