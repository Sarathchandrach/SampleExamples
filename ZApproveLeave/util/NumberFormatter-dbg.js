/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.leaverequests.util.NumberFormatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

hcm.mgr.approve.leaverequests.util.NumberFormatter = (function() {
    "use strict";
    return {

        // strips unwanted leading or ending zeros
        formatNumberStripZeros: function(number) {

            var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
            if (typeof number === "string") {
                return numberFormatter.format(Number(number));
            }
            return numberFormatter.format(number);
        }
    };
}());