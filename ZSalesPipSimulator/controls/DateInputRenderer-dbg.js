/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// Input Renderer

/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.ui.core.Renderer");
jQuery.sap.require("sap.m.InputRenderer");
jQuery.sap.declare("sap.crm.DateInputRenderer");
sap.crm.DateInputRenderer = sap.ui.core.Renderer.extend(sap.m.InputRenderer);
sap.crm.DateInputRenderer.writeInnerContent = function(r, c) {
	if (c.getShowValueHelp() && c.getEnabled()) {
		r.write('<div class="sapMInputValHelp">');
		r.renderControl(c._getValueHelpIcon());
		r.write("</div>");
	}
};