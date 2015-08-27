/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.payslip.controls.EmbedPdf");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.ui.core.RenderManager");sap.ui.core.Control.extend("hcm.emp.payslip.controls.EmbedPdf",{metadata:{properties:{"src":{type:"string",group:"Misc"},"noPluginMessage":{type:"string",group:"Misc"}}}});
hcm.emp.payslip.controls.EmbedPdf.prototype.exit=function(){if($.browser.msie){$('.embedPdf').remove()}};
hcm.emp.payslip.controls.EmbedPdf.prototype.init=function(){if($.browser.msie){$('.embedPdf').remove()}};
