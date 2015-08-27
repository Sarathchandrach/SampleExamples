/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");

cus.crm.myaccounts.util.formatter = {};

cus.crm.myaccounts.util.formatter.formatMediumTimeInterval = function(fromDate, toDate){
	if(fromDate && toDate){
		if(fromDate.getYear() == toDate.getYear() && fromDate.getMonth() == toDate.getMonth() && fromDate.getDay() == toDate.getDay())
			return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(fromDate);
		else{
			return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(fromDate)
			+
			" - "
			+
			sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(toDate);
		}
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.formatMediumDate = function(oValue){
	if(oValue){
		return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(oValue);
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.formatLongDate = function(oValue){
	if(oValue){
		return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "long"}).format(oValue);
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.formatShortDate = function(oValue){
	if(oValue){
		return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "short"}).format(oValue);
	}
	else {
		return "";
	}
};
cus.crm.myaccounts.util.formatter.formatAmounts = function(sValue, sCurrency){
	if(sValue > 0 ){
        return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(sValue , sCurrency );
	}
	return "";
};

cus.crm.myaccounts.util.formatter.formatShortAmounts = function(sValue, sCurrency){
	if(sValue > 0 ){
        return sap.ca.ui.model.format.AmountFormat.FormatAmountShortWithCurrency(sValue , sCurrency );
	}
	return "";
};
cus.crm.myaccounts.util.formatter.formatShortNumber = function(sValue, sCurrency){
	if(sValue > 0 ){
        return sap.ca.ui.model.format.AmountFormat.FormatAmountShort(sValue , sCurrency );
	}
	return "";
};
cus.crm.myaccounts.util.formatter.formatEmployeeResponsible = function(sFunction){
       if(sFunction){return sFunction}
       else{return  sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("EMPLOYEE_RESPONSIBLE");}
};

cus.crm.myaccounts.util.formatter.formatMediumDateTime = function(oValue){
	if(oValue){
		return sap.ca.ui.model.format.DateFormat.getDateTimeInstance({style: "medium"}).format(oValue);
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.formatStartDate = function(oValue){
	if(oValue){
		var date=sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(oValue);
		return  sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("STARTING",[date]);
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.formatCloseDate = function(oValue){
	if(oValue){
		var date=sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(oValue);
		return  sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CLOSING",[date]);
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.formatDueDate = function(oValue){
	if(oValue){
		var date=sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(oValue);
		return  sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DUE",[date]);
	}
	else {
		return "";
	}
};

cus.crm.myaccounts.util.formatter.mimeTypeFormatter = function(value) {

	switch (value)
	{
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		case 'application/vnd.ms-powerpoint':			
			return 'pptx';
			break;
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'doc';
			break;
		case 'application/vnd.ms-excel':
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return 'xls';
			break;			
		case 'image/jpeg':
		case 'image/png':
		case 'image/tiff':
		case 'image/gif':		
			return 'jpg';
			break;
		case 'application/pdf':	
			return 'pdf';
			break;
		case 'text/plain':	
			return 'txt';
			break;
		default:
			return 'unknown'; 	
	}
};

cus.crm.myaccounts.util.formatter.getRelativePathFromURL = function(absoluteURL){
	var url =  document.createElement('a');
	url.href = absoluteURL;
	if(url.pathname.substring(0, 1) == "/")
		return url.pathname;
	else
		return "/" + url.pathname;
};

cus.crm.myaccounts.util.formatter.logoUrlFormatter= function (mediaUrl, category) {
	
	// Return Account Logo 
	if (mediaUrl) {
		// return relative URL
		return cus.crm.myaccounts.util.formatter.getRelativePathFromURL(mediaUrl);
	}	
	else {	
		// If not exists, return icons dependent on account category
	
		switch (category){ 
		case '1':	//individual accounts
		  	return "sap-icon://person-placeholder";
		  	break;	
		case '2':	//corporate accounts
	      	return "sap-icon://factory";
	      	break;
		case '3':	//groups
	      	return "sap-icon://group";
	      	break;
		default:    //default behavior when category is initial
			return "sap-icon://factory";    	  
		}
	}
};

cus.crm.myaccounts.util.formatter.urlFormatter = function (value) {
	var sSapServer, sSapHost, sSapHostHttp, sSapClient, oUri, sCurrentProtocol;

	sSapServer = jQuery.sap.getUriParameters().get("sap-server");
	sSapHost = jQuery.sap.getUriParameters().get("sap-host");
	sSapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
	sSapClient = jQuery.sap.getUriParameters().get("sap-client");

	oUri = URI(location.protocol + "//" +location.hostname + (location.port ? ':'+location.port: '') + cus.crm.myaccounts.util.formatter.getRelativePathFromURL(value));
	sCurrentProtocol = location.protocol.replace(':', '');
	if (sCurrentProtocol !== oUri.protocol()) {
		oUri.protocol(sCurrentProtocol);
	}

	if (sSapServer) {
		oUri.addSearch('sap-server', sSapServer);
	}

	if (sSapHost) {
		oUri.addSearch('sap-host', sSapHost);
	}

	if (sSapHostHttp) {
		oUri.addSearch('sap-host-http', sSapHostHttp);
	}


	if (sSapClient) {
		oUri.addSearch('sap-client', sSapClient);
	}

	return oUri.toString();

};

cus.crm.myaccounts.util.formatter.logoVisibilityFormatter= function (mediaUrl) {
	if(mediaUrl){
		return true;
	}
	else {
		return false;
	}
};


cus.crm.myaccounts.util.formatter.locationFormatter= function (oCity, oCountry) {
	if(!oCity){
		return oCountry;
	}
	else if(!oCountry){
		return oCity;
	}
	else{
		return  sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("LOCATION",[oCity,oCountry]);
	}
};

cus.crm.myaccounts.util.formatter.comaSeparator = function (value1, value2) {
	var string = value1;
	if (value2)
		return string ? string + ", " + value2 : value2;
	
	return string;
};

cus.crm.myaccounts.util.formatter.sleshSeparator = function (value1, value2) {
	var string = value1;
	if (value2)
		return string ? string + " / " + value2 : value2;

	return string;
};


cus.crm.myaccounts.util.formatter.AccountNameFormatter = function (fullName, name1) {
	if (fullName) { return fullName; }
	else { return name1; }
};

cus.crm.myaccounts.util.formatter.isEqual = function (value1, value2) {
	if(typeof(value1)=="string" && typeof(value2)=="string"){
		return value1.valueOf() == value2.valueOf();}
	else{
		return value1 == value2;
	}
		
};

cus.crm.myaccounts.util.formatter.isUnequal = function (value1, value2) {
	if(typeof(value1)=="string" && typeof(value2)=="string"){
		return value1.valueOf() != value2.valueOf();}
	else{
		return value1 != value2;
	}
		
};

cus.crm.myaccounts.util.formatter.AccountSpecificText = function (textPerson, textCompany, textGroup, accountType) {
	switch (accountType) {
	case cus.crm.myaccounts.util.Constants.accountCategoryPerson:
		return textPerson;
		break;
	case cus.crm.myaccounts.util.Constants.accountCategoryCompany:
		return textCompany;
		break;
	case cus.crm.myaccounts.util.Constants.accountCategoryGroup:
		return textGroup;
		break;
	}
};
