/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.utils.PerfUtils");
//hcm.emp.payslip.utils.PerfUtils.getMeasurements();
hcm.emp.payslip.utils.PerfUtils = {

    MASTER_INIT : "hcm.emp.payslip.utils.MASTER_INIT",
    DETAIL_INIT : "hcm.emp.payslip.utils.DETAIL_INIT",
    PaystubLoading : "hcm.emp.payslip.utils.PaystubLoading",
    afterZoomableScrollContainerRendering : "hcm.emp.payslip.utils.afterZoomableScrollContainerRendering",
    onGetListSuccess : "hcm.emp.payslip.utils.onGetListSuccess",
    onListSelect : "hcm.emp.payslip.utils.onListSelect",
    RenderPdf : "hcm.emp.payslip.utils.RenderPdf",
    getPdfUrl: "hcm.emp.payslip.utils.getPdfUrl",
    lazyRoundNumber : "hcm.emp.payslip.utils.lazyRoundNumber",
    updateModel : "hcm.emp.payslip.utils.updateModel",
    LoadPdfData : "hcm.emp.payslip.utils.LoadPdfData",
    getDocument : "hcm.emp.payslip.utils.getDocument",
    showBusyCursor : "hcm.emp.payslip.utils.showBusyCursor",
    hideBusyCursor : "hcm.emp.payslip.utils.hideBusyCursor",
    openApplication : "hcm.emp.payslip.utils.openApplication",
    MasterView : "hcm.emp.payslip.utils.MasterView",
    DetailView : "hcm.emp.payslip.utils.DetailView",

    _mCounter:{},
    getMeasurements : function(){
        var aMeasures = jQuery.sap.measure.getAllMeasurements();
        var aOutputs = [];
        for( var i in aMeasures){
            var oMeasure = aMeasures[i];
            var oOutput = {
                "id" : oMeasure.id,
                "info" : (oMeasure.info ? oMeasure.info : ''),
                "start" : oMeasure.start.toString(),
                "end" : oMeasure.end.toString(),
                "time"  : oMeasure.time,
                "duration" : oMeasure.duration
            }
            aOutputs.push(oOutput);
        };
        var sOutput = JSON.stringify(aOutputs);
        return sOutput;
    },
    getStartId:function(id){
        if(hcm.emp.payslip.utils.PerfUtils._mCounter[id]==undefined){
            hcm.emp.payslip.utils.PerfUtils._mCounter[id]=-1;
        }
        hcm.emp.payslip.utils.PerfUtils._mCounter[id]++;
        return id +" ("+hcm.emp.payslip.utils.PerfUtils._mCounter[id]+")";
    },
    getEndId:function(id){
        if(hcm.emp.payslip.utils.PerfUtils._mCounter[id]==undefined){
            hcm.emp.payslip.utils.PerfUtils._mCounter[id]=0;
        }
        return id +" ("+hcm.emp.payslip.utils.PerfUtils._mCounter[id]+")";
    }
};

