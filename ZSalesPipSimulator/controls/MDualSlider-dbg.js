/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// Provides control sap.m.Slider.
jQuery.sap.declare("sap.crm.MDualSlider");
jQuery.sap.require("sap.m.library");
jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Control.extend("sap.crm.MDualSlider", {
	metadata : {

		// ---- object ----
		publicMethods : [
		// methods
		"stepUp", "stepDown" ],

		// ---- control specific ----
		library : "sap.m",
		properties : {
			"width" : {
				type : "sap.ui.core.CSSSize",
				group : "Appearance",
				defaultValue : '100%'
			},
			"enabled" : {
				type : "boolean",
				group : "Behavior",
				defaultValue : true
			},
			"visible" : {
				type : "boolean",
				group : "Appearance",
				defaultValue : true
			},
			"name" : {
				type : "string",
				group : "Misc",
				defaultValue : null
			},
			"value" : {
				type : "float",
				group : "Data",
				defaultValue : 0
			},
			"value2" : {
				type : "float",
				group : "Data",
				defaultValue : 1
			}
		},
		aggregations : {
			units : {
				type : "sap.crm.MDualSliderLabel",
				multiple : true,
				singularName : "unit"
			}
		},
		events : {
			"change" : {},
			"liveChange" : {}
		}
	}
});

sap.crm.MDualSlider._bIsRTL = sap.ui.getCore().getConfiguration().getRTL();
sap.crm.MDualSlider.M_EVENTS = {
	'change' : 'change',
	'liveChange' : 'liveChange'
};

// Start of sap\m\Slider.js
jQuery.sap.require("sap.ui.core.EnabledPropagator");
sap.ui.core.EnabledPropagator.apply(sap.crm.MDualSlider.prototype, [ true ]);

/* =========================================================== */
/* begin: lifecycle methods */
/* =========================================================== */

/**
 * Required adaptations before rendering.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.onBeforeRendering = function() {
	var fMin = 0, units = this.getUnits(), fMax = units.length - 1;
	var fStep = 1, bMinbiggerThanMax = false, bError = false;

	/*
	 * functional dependencies:
	 * 
	 * min -> max max -> min
	 * 
	 * max, min -> step max, min, step -> value
	 * 
	 */
	// if the minimum is lower than or equal to the maximum, log a warning
	if (fMin >= fMax) {
		bMinbiggerThanMax = true;
		bError = true;
		jQuery.sap.log.warning("Warning: " + "Property wrong min: " + fMin
				+ " >= max: " + fMax + " on ", this);
	}
	// if the step is negative or 0, set to 1 and log a warning
	if (fStep <= 0) {
		jQuery.sap.log.warning("Warning: "
				+ "The step could not be negative on ", this);
		fStep = 1;
		// update the step to 1 and suppress re-rendering
		this.setProperty("step", fStep, true);
	}
	// the step can't be bigger than slider range, log a warning
	if (fStep > (fMax - fMin) && !bMinbiggerThanMax) {
		bError = true;
		jQuery.sap.log.warning("Warning: " + "Property wrong step: " + fStep
				+ " > max: " + fMax + " - " + "min: " + fMin + " on ", this);
	}
	// update the value only if there aren't errors
	if (!bError) {
		var iLeftIndex = this.getValue(), iRightIndex = this.getValue2();
		this.setValue(iLeftIndex).setValue2(iRightIndex);
		// get updated values
		iLeftIndex = this.getValue();
		iRightIndex = this.getValue2();
		var iWidth = iRightIndex - iLeftIndex, fRTL = this
				._getPercentFromValue(iRightIndex);
		this._fValue = this._getPercentFromValue(iLeftIndex);
		this._fValue2 = this._getPercentFromValue(iRightIndex);
		this._fWidth = this._getPercentFromValue(iWidth);
		fRTL = iRightIndex == fMax ? 100 - (fRTL + 1) : 100 - (fRTL + 3);
		this._fValueText = this._getPercentFromValue(iLeftIndex) - 1;
		this._fValue2Text = fRTL;
	}
	// flags
	this._bDisabled = !this.getEnabled();
};

/**
 * Required adaptations after rendering.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.onAfterRendering = function() {
	// slider control container jQuery reference
	this._$SliderContainer = this.$();
	// slider jQuery reference
	this._$Slider = this._$SliderContainer.children(".sapcrmMsli");
	// progress indicator
	this._$ProgressIndicator = this._$Slider.children(".sapcrmMsliProgress");
	// handle jQuery reference
	this._$Handle = this._$Slider.children(".sapcrmMsliHandle");
	// handle for the left handle
	this._$Lhandle = this._$Handle.first();
	// handle for the right handle
	this._$Rhandle = this._$Handle.last();
	// after all calculations, makes the control visible
	this._$SliderContainer.css("visibility", "");
};

/* =========================================================== */
/* end: lifecycle methods */
/* =========================================================== */

/* =========================================================== */
/* begin: event handlers */
/* =========================================================== */

/**
 * Handle the touch start event happening on the slider.
 * 
 * @param {jQuery.EventObject}
 *            oEvent The event object
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchstart = function(oEvent) {
	var $Target = jQuery(oEvent.target), fMin = 0, fMax = this.getUnits().length - 1;
	oEvent.originalEvent._sapui_handledByControl = true;
	if (oEvent.targetTouches.length > 1 || this._bDisabled) {
		// suppress multiTouch events
		return;
	}

	// update the slider measures, those values may change in orientation
	// change
	this._recalculateStyles();
	this._fDiffX = this._fSliderPaddingLeft;
	// initialization
	if ($Target.attr("id") == "left") {
		this._fStartValue = this.getValue();
		this._handle_hold = "left";
		this._$Lhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Lhandle.css("border", "0.125rem solid #007cc0");
	} else if ($Target.attr("id") == "right") {
		this._fStartValue = this.getValue2();
		this._handle_hold = "right";
		this._$Rhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Rhandle.css("border", "0.125rem solid #007cc0");
	} else if ($Target.attr("id") == "mSlider_bar") {
		this._handle_hold = "bar";
		this._$Lhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Lhandle.css("border", "0.125rem solid #007cc0");
		this._$Rhandle.css("background-color", "rgba(0, 124, 192, 0.3)");
		this._$Rhandle.css("border", "0.125rem solid #007cc0");
		var fInteractionVal = (oEvent.targetTouches[0].pageX - this._fDiffX - this._fSliderOffsetLeft)
				/ this._fSliderWidth;
		this.fNewValue_start = fMin + (fInteractionVal * (fMax - fMin));
		if (this._bIsRTL)
			this.fNewValue_start = this
					._convertValueToRTL(this.fNewValue_start);
	}
	this.fireLiveChange({
		value : this.getValue(),
		value2 : this.getValue2()
	});
};

/**
 * Handle the touch move event on the slider.
 * 
 * @param {jQuery.EventObject}
 *            oEvent The event object
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchmove = function(oEvent) {
	if (this._bDisabled) {
		return;
	}
	var fMin = 0, fMax = this.getUnits().length - 1, fInteractionVal = (oEvent.targetTouches[0].pageX
			- this._fDiffX - this._fSliderOffsetLeft)
			/ this._fSliderWidth;
	var fNewValue = fMin + (fInteractionVal * (fMax - fMin));
	if (this._bIsRTL)
		fNewValue = this._convertValueToRTL(fNewValue);

	if (this._handle_hold == "left") {
		// validate, update the the slider value and the UI
		this.setValue(fNewValue);
	} else if (this._handle_hold == "right") {
		// validate, update the the slider value and the UI
		this.setValue2(fNewValue);
	} else if (this._handle_hold == "bar") {
		var fBarInteractionVal = (oEvent.targetTouches[0].pageX - this._fDiffX - this._fSliderOffsetLeft)
				/ this._fSliderWidth;
		this.fNewValue_end = fMin + (fBarInteractionVal * (fMax - fMin));
		if (this._bIsRTL)
			this.fNewValue_end = this._convertValueToRTL(this.fNewValue_end);

		var iLeftIndex = this.getValue(), iRightIndex = this.getValue2(), fDelta = this.fNewValue_end
				- this.fNewValue_start, fStep = 1;
		var iNewVal = iLeftIndex + fDelta, fModStepVal = Math.abs(iNewVal
				% fStep), iNewVal2 = iRightIndex + fDelta, fModStepVal2 = Math
				.abs(iNewVal2 % fStep);
		if (fModStepVal * 2 >= fStep) {
			iNewVal += (fStep - fModStepVal);
			iNewVal2 += (fStep - fModStepVal2);
		} else {
			iNewVal -= fModStepVal;
			iNewVal2 -= fModStepVal2;
		}
		if (iLeftIndex != fMin || iNewVal > iLeftIndex) {
			if (iRightIndex != fMax || iNewVal2 < iRightIndex)
				this.setValue(iNewVal).setValue2(iNewVal2);
		}
		if (iLeftIndex !== iNewVal)
			this.fNewValue_start = this.fNewValue_end;
	}
	this.fireLiveChange({
		value : this.getValue(),
		value2 : this.getValue2()
	});
};

/**
 * Handle the touch end event on the slider.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchend = function(oEvent) {
	if (this._handle_hold == "left") {
		this._$Lhandle.css("background-color", "");
		this._$Lhandle.css("border", "");
	} else if (this._handle_hold == "right") {
		this._$Rhandle.css("background-color", "");
		this._$Rhandle.css("border", "");
	} else if (this._handle_hold == "bar") {
		this._$Lhandle.css("background-color", "");
		this._$Lhandle.css("border", "");
		this._$Rhandle.css("background-color", "");
		this._$Rhandle.css("border", "");
	}
	if (this._bDisabled) {
		return;
	}

	// remove active state
	if (this._fStartValue !== this.getValue()) {
		// if the value if not the same
		this.fireChange({
			value : this.getValue(),
			value2 : this.getValue2()
		});
	}
	// remove unused properties
	delete this._fDiffX;
	delete this._fStartValue;
	this._handle_hold = null;
	var controllerInfo = sap.ca.scfld.md.app.Application.getImpl();
	controllerInfo.oCurController.FullCtrl.reRenderTopNSlider = true;
};

/**
 * Handle the touch cancel event on the slider.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype.ontouchcancel = sap.crm.MDualSlider.prototype.ontouchend;

/* ============================================================ */
/* end: event handlers */
/* ============================================================ */

/* =========================================================== */
/* begin: internal methods */
/* =========================================================== */

/**
 * Recalculate styles.
 * 
 * @private
 */
sap.crm.MDualSlider.prototype._recalculateStyles = function() {
	// slider width
	this._fSliderWidth = this._$SliderContainer.width();
	// slider padding left
	this._fSliderPaddingLeft = parseFloat(this._$SliderContainer
			.css("padding-left"));
	// slider offset left
	this._fSliderOffsetLeft = this._$SliderContainer.offset().left;
	// handle width
	this._fHandleWidth = this._$Handle.width();
};

/**
 * Calculate percentage.
 * 
 * @param {float}
 *            fValue the value from the slider
 * @private
 * @returns {float} percent
 */
sap.crm.MDualSlider.prototype._getPercentFromValue = function(fValue) {
	var fMin = 0, fMax = this.getUnits().length - 1;
	return ((fValue - fMin) / (fMax - fMin)) * 100;
};

sap.crm.MDualSlider.prototype._convertValueToRTL = function(fNewValue) {
	var fMin = 0, fMax = this.getUnits().length - 1;
	return fMax - (fMin + fNewValue);
};

sap.crm.MDualSlider.prototype._validateN = function(n) {
	var sTypeofN = typeof n;
	if (sTypeofN === "undefined")
		return 1; // default n = 1
	else if (sTypeofN !== "number") {
		jQuery.sap.log.warning('Warning: n needs to be a number', this);
		return 0;
	} else if (Math.floor(n) === n && isFinite(n)) {
		return n;
	} else {
		jQuery.sap.log
				.warning('Warning: n needs to be a finite interger', this);
		return 0;
	}
};

sap.crm.MDualSlider.prototype._setValue = function(fNewValue) {
	var fMin = 0, units = this.getUnits(), fMax = units.length - 1, fStep = 1, iLeftIndex = this
			.getValue(), iRightIndex = this.getValue2(), fModStepVal = Math
			.abs(fNewValue % fStep), fNewPercent;

	// validate the new value before arithmetic calculations
	if (typeof fNewValue !== "number" || !isFinite(fNewValue)) {
		jQuery.sap.log.error("Error:",
				'"fNewValue" needs to be a finite number of', this);
		return this;
	}

	// round the value to the nearest step
	if (fModStepVal * 2 >= fStep)
		fNewValue += (fStep - fModStepVal);
	else
		fNewValue -= fModStepVal;

	// validate that the value is between maximum and minimum
	fNewValue = fNewValue > fMax ? fMax : fNewValue < fMin ? fMin : fNewValue;
	if (this._handle_hold !== "bar" && this._handle_hold != undefined) {
		if (fNewValue >= iRightIndex) {
			fNewValue = iRightIndex - 1;
			// return;
		}
	}

	// Floating-point in JavaScript are IEEE 64 bit values and has some problems
	// with big decimals.
	// Round the final value to 5 digits after the decimal point.
	fNewValue = Number(fNewValue.toFixed(5));
	if (fNewValue == iRightIndex && this._handle_hold !== "bar")
		return this;
	// update the value and suppress re-rendering
	this.setProperty("value", fNewValue, true);
	this._sValueText = " ";
	this._sValueText = units[fNewValue].getValue();

	// if the value is the same, suppress DOM modifications and event fire
	if (iLeftIndex === this.getValue())
		return this;

	if (this._$SliderContainer) {
		// after re-rendering
		iLeftIndex = this.getValue();
		fNewPercent = this._getPercentFromValue(fNewValue);
		var iWidth = iRightIndex - iLeftIndex, fLeftPercent = this
				._getPercentFromValue(iLeftIndex), sLeft = this._bIsRTL ? "right"
				: "left";
		this._fWidth = this._getPercentFromValue(iWidth);
		this._$ProgressIndicator[0].style.width = this._fWidth + "%";
		this._$ProgressIndicator[0].style[sLeft] = fLeftPercent + "%";
		$("#left_text").css("margin-" + sLeft, fLeftPercent + "%");
		$("#left_text").text(this._sValueText);
		// update the handle position & text
		this._$Handle[0].style[sLeft] = fNewPercent + "%";
		this._$Handle[0].title = this._sValueText;
	}
	return this;
};

sap.crm.MDualSlider.prototype._setValue2 = function(fNewValue) {
	var fMin = 0, units = this.getUnits(), fMax = units.length - 1, fStep = 1, iLeftIndex = this
			.getValue(), iRightIndex = this.getValue2(), fModStepVal = Math
			.abs(fNewValue % fStep), fNewPercent;

	// validate the new value before arithmetic calculations
	if (typeof fNewValue !== "number" || !isFinite(fNewValue)) {
		jQuery.sap.log.error("Error:",
				'"fNewValue" needs to be a finite number of', this);
		return this;
	}

	// round the value to the nearest step
	if (fModStepVal * 2 >= fStep)
		fNewValue += (fStep - fModStepVal);
	else
		fNewValue -= fModStepVal;

	// validate that the value is between maximum and minimum
	fNewValue = fNewValue > fMax ? fMax : fNewValue < fMin ? fMin : fNewValue;
	if ((this._handle_hold !== "bar") && (this._handle_hold != undefined)) {
		if (fNewValue <= iLeftIndex) {
			fNewValue = iLeftIndex + 1;
			return;
		}
	}

	// Floating-point in JavaScript are IEEE 64 bit values and has some problems
	// with big decimals.
	// Round the final value to 5 digits after the decimal point.
	fNewValue = Number(fNewValue.toFixed(5));
	if (fNewValue == iLeftIndex)
		return this;
	// update the value and suppress re-rendering
	this.setProperty("value2", fNewValue, true);
	this._sValue2Text = " ";
	this._sValue2Text = units[fNewValue].getValue();

	// if the value is the same, suppress DOM modifications and event fire
	if (iRightIndex === this.getValue2())
		return this;

	if (this._$SliderContainer) {
		// after re-rendering
		iRightIndex = this.getValue2();
		fNewPercent = this._getPercentFromValue(fNewValue);
		var iWidth = iRightIndex - iLeftIndex, fRightPercent = this
				._getPercentFromValue(iRightIndex), sLeft, sRight;
		if (this._bIsRTL) {
			sLeft = "right";
			sRight = "left";
		} else {
			sLeft = "left";
			sRight = "right";
		}
		this._fWidth = this._getPercentFromValue(iWidth);
		this._$ProgressIndicator[0].style.width = this._fWidth + "%";
		this._$ProgressIndicator[0].style[sRight] = fRightPercent + "%";
			fRightPercent = fNewValue == fMax ? 100 - (fRightPercent + 1)
					: 100 - (fRightPercent + 3);
		$("#right_text").css("margin-" + sRight, fRightPercent + "%");
		$("#right_text").text(this._sValue2Text);
		// update the handle position
		this._$Handle[1].style[sLeft] = fNewPercent + "%";
		this._$Handle[1].title = this._sValue2Text;
	}
	return this;
};

/* =========================================================== */
/* end: internal methods */
/* =========================================================== */

/* =========================================================== */
/* begin: API method */
/* =========================================================== */

sap.crm.MDualSlider.prototype.stepUp = function(n) {
	return this.setValue(this.getValue() + (this._validateN(n) * 1));
};

sap.crm.MDualSlider.prototype.stepDown = function(n) {
	return this.setValue(this.getValue() - (this._validateN(n) * 1));
};

sap.crm.MDualSlider.prototype.setValue = function(fNewValue) {
	/*
	 * The first time when setValue() method is called, other properties may be
	 * outdated, because the invocation order is not always the same.
	 * 
	 * Overwriting this prototype method with an instance method after the first
	 * call, will ensure correct calculations.
	 * 
	 */
	this.setValue = this._setValue;

	// update the value and suppress re-rendering
	return this.setProperty("value", fNewValue, true);
};

sap.crm.MDualSlider.prototype.setValue2 = function(fNewValue) {
	/*
	 * The first time when setValue() method is called, other properties may be
	 * outdated, because the invocation order is not always the same.
	 * 
	 * Overwriting this prototype method with an instance method after the first
	 * call, will ensure correct calculations.
	 * 
	 */
	this.setValue2 = this._setValue2;

	// update the value and suppress re-rendering
	return this.setProperty("value2", fNewValue, true);
};

/* =========================================================== */
/* end: API method */
/* =========================================================== */

/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP AG. All rights reserved
 */