/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.util.NumberFormatter");jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");hcm.mgr.approve.leaverequests.util.NumberFormatter=(function(){"use strict";return{formatNumberStripZeros:function(n){var a=sap.ca.ui.model.format.NumberFormat.getInstance();if(typeof n==="string"){return a.format(Number(n))}return a.format(n)}}}());
