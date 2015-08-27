/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//declare namespace
jQuery.sap.declare("hcm.emp.mybenefits.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");

hcm.emp.mybenefits.util.Formatter = {

    mbPeriod: function(sText, sBeginDate, sEndDate) {
        return sText + ": " + hcm.emp.mybenefits.util.Formatter.DateFormatter(sBeginDate, "medium") + " - " + hcm.emp.mybenefits.util.Formatter.DateFormatter(sEndDate, "medium");
    },

    mbSubmitInsurabilityBefore: function(value) {
        return hcm.emp.mybenefits.util.Formatter.DateFormatter(value, "medium");
    },

    DateFormatter: function(formatdate, style) {

        var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({
            style: style
        });
        var oFormatDate = new Date(formatdate);

        if (oFormatDate) {
            return oFormatter.format(oFormatDate);
        }
        return "";
    },

    formatterVisibleInsurability: function(insurabilityRequired, StatusText) {
        if (StatusText == "Pending" && insurabilityRequired === true)
            return true;
        else
            return false;

    },

    formatterVisibleCost: function(value) {
        if (value !== "0.0000" && value !== "0,0000" && value !== "" && value !== null)
            return true;
        else
            return false;
    },

    /**
     * formatter for display contact picture
     */
    displayContactPicture: function() {
        return jQuery.sap.getModulePath("hcm.emp.mybenefits") + "/img/" + "person_placeholder.png";
    },

    formatterVisible: function(Data) {
        if (Data !== "" && Data !== null)
            return true;

        else
            return false;
    },

    formatAmount: function(oValue, sCurrency) {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance(sCurrency, {
            style: "standard",
            decimals: "2"
        });
        return formatter.format(oValue);
    },

    formatAmountWCurr: function(oValue, sCurrency) {
        var formattedVal = hcm.emp.mybenefits.util.Formatter.formatAmount(oValue, sCurrency);
        return formattedVal + " " + sCurrency;
    },

    formatContribution: function(oValue, sCurrency) {

        var taxValue = oValue;
        var Curr = sCurrency;
        var taxValueAmount, taxValues;
        if (!hcm.emp.mybenefits.util.Formatter.formatterVisible(oValue))
            return "";
        if (taxValue.indexOf("+") != -1) {
            taxValues = taxValue.split("+");
            taxValueAmount = taxValues[0].split(" ");
            if (sCurrency === null)
                Curr = taxValueAmount[1];
            if (taxValueAmount[0].indexOf("%") == -1 && taxValueAmount[0].indexOf("unit") == -1)
                taxValueAmount[0] = hcm.emp.mybenefits.util.Formatter.formatAmount(taxValueAmount[0], Curr);
        } else {
            if (taxValue.indexOf("%") != -1 && taxValue.indexOf("unit") != -1) {
                return hcm.emp.mybenefits.util.Formatter.formatAmountWCurr(taxValue, Curr);
            } else {
                return taxValue;
            }
        }
        return hcm.emp.mybenefits.util.Formatter.concatenateData(taxValueAmount[0], Curr, taxValues[1], taxValues[2]);
    },

    concatenateData: function(amount, currency, percentage, unit) {
        var amountAppended = "";
        if (amount.length !== 0 && currency.length !== 0)
            amountAppended = amount + " " + currency;
        if (percentage.length !== 0)
            amountAppended += " +" + percentage;
        if (unit.length !== 0)
            amountAppended += "+" + unit;
        return amountAppended;
    },

    mbDependants: function(sName, sRelation) {
        return sName + " (" + sRelation + ")";
    },

 // Append % character
    AppendPercent: function(percentage) {
    	return percentage + " %";
    },
    mbPlanYear: function(sBeginDate, sEndDate) {
        return hcm.emp.mybenefits.util.Formatter.DateFormatter(sBeginDate, "medium") + " - " + hcm.emp.mybenefits.util.Formatter.DateFormatter(sEndDate, "medium");
    },

    formatFSAStatus: function(oValue) {
        if (oValue !== null) {
            var coverageValues = oValue.split(" ");
            var peryear;
            if (coverageValues[0] !== "" && coverageValues[0] !== "0.0000" && coverageValues[0] !== "0,0000" && coverageValues.length > 2) {
                peryear = coverageValues[2].charAt(0).toUpperCase() + coverageValues[2].slice(1);
                return peryear;
            } else
                return "";
        } else
            return "";
    }
};