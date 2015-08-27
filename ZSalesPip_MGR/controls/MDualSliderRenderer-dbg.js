/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.MDualSliderRenderer");

/**
 * @class Slider renderer.
 * @static
 */
sap.crm.MDualSliderRenderer = {};

/**
 * Renders the HTML for the given control, using the provided
 * {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager}
 *            oRm the RenderManager that can be used for writing to the render
 *            output buffer
 * @param {sap.ui.core.Control}
 *            oSlider an object representation of the slider that should be
 *            rendered
 */
sap.crm.MDualSliderRenderer.render = function(oRm, oSlider) {
	var bIsEnabled = oSlider.getEnabled(), sTooltip = oSlider
			.getTooltip_AsString(), sLeftStr, sRightStr;
	if (typeof oSlider._bIsRTL === "undefined")
		oSlider._bIsRTL = sap.ui.getCore().getConfiguration().getRTL();
	if (oSlider._bIsRTL) {
		sLeftStr = "right";
		sRightStr = "left";
	} else {
		sLeftStr = "left";
		sRightStr = "right";
	}
	// avoid render when not visible
	if (!oSlider.getVisible()) {
		return;
	}

	oRm.write("<div").addClass("sapcrmMsliCont");
	if (!bIsEnabled) {
		oRm.addClass("sapcrmMSliContDisabled");
	}

	oRm.addStyle("width", oSlider.getWidth()).addStyle("visibility", "hidden")
			.writeClasses().writeStyles().writeControlData(oSlider);
	if (sTooltip) {
		oRm.writeAttributeEscaped("title", sTooltip);
	}

	oRm.write("><div").addClass("sapcrmMsli");
	if (!bIsEnabled) {
		oRm.addClass("sapcrmMSliDisabled");
	}
	oRm.writeClasses().writeStyles().write("><div id='mSlider_bar'").addClass(
			"sapcrmMsliProgress").addStyle("width", oSlider._fWidth + "%")
			.addStyle(sLeftStr, oSlider._fValue + "%").addStyle(sRightStr,
					oSlider._fValue2 + "%").writeClasses().writeStyles().write(
					"></div>");

	// start render left slider handle
	oRm.write("<span id='left'").addClass("sapcrmMsliHandle").addStyle(
			sLeftStr, oSlider._fValue + "%").writeClasses().writeStyles()
			.writeAttributeEscaped("title", oSlider._sValueText);
	if (bIsEnabled) {
		oRm.writeAttribute("tabIndex", "0");
	}
	oRm.write("><span").addClass("sapcrmMsliHandleInner").writeClasses().write(
			"></span></span>").write("<div id='left_text'").addClass(
			"sliderText").addStyle("float", sLeftStr).addStyle(
			"margin-" + sLeftStr, oSlider._fValueText + "%").addStyle("bottom",
			"-2.5rem").writeClasses().writeStyles().write(">").writeEscaped(
			oSlider._sValueText).write("</div>");

	// FIXME: start render right slider handle
	oRm.write("<span id='right'").addClass("sapcrmMsliHandle").addStyle(
			sLeftStr, oSlider._fValue2 + "%").writeClasses().writeStyles()
			.writeAttributeEscaped("title", oSlider._sValue2Text);
	if (bIsEnabled) {
		oRm.writeAttribute("tabIndex", "0");
	}
	oRm.write("><span").addClass("sapcrmMsliHandleInner").writeClasses().write(
			"></span></span>").write("<div id='right_text'").addClass(
			"sliderText").addStyle("float", sRightStr).addStyle(
			"margin-" + sRightStr, oSlider._fValue2Text + "%").addStyle(
			"bottom", "-2.5rem").writeClasses().writeStyles().write(">")
			.writeEscaped(oSlider._sValue2Text).write("</div></div></div>");
};