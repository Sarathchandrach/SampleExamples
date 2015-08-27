/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/* Renderer */

jQuery.sap.declare("sap.crm.BubbleChartRenderer");

sap.crm.BubbleChartRenderer = {};

// the part creating the HTML:
// static function
sap.crm.BubbleChartRenderer.render = function(oRm, oControl) {
	// so
	// use the given
	// "oControl" instance
	// instead of "this" in
	// the renderer function
	if (!oControl.getVisible())
		return;

	oRm.write("<div");
	oRm.writeControlData(oControl); // writes the Control ID
	// and enables event
	// handling - important!
	oRm.addClass("bubble"); // add a CSS class for styles
	// common to all control instances
	oRm.writeClasses(); // this call writes the above class
	// plus enables support for
	// Square.addStyleClass(...)
	oRm.write(">");
	oRm.write("</div>");
};