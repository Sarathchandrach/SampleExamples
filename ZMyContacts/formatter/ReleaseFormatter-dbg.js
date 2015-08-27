/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
/*global jQuery: false, sap: false, cus: false, console: false, location: false, URI:false */
(function () {
	'use strict';
	jQuery.sap.declare("cus.crm.mycontacts.formatter.ReleaseFormatter");

	cus.crm.mycontacts.formatter.ReleaseFormatter = {};

	cus.crm.mycontacts.formatter.ReleaseFormatter.pictureUrlFormatter = function (photo) {
		if(photo && photo.__metadata.media_src){
			return cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(photo.__metadata.media_src);
		}
		return "sap-icon://person-placeholder";
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL = function(absoluteURL){
		var url =  document.createElement('a');
		url.href = absoluteURL;
		if(url.pathname.substring(0, 1) == "/")
			return url.pathname;
		else
			return "/" + url.pathname;
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.logoUrlFormatter = function (oLogo) {
		var sLogoUrl = "sap-icon://factory";

		if (oLogo && oLogo.__metadata && oLogo.__metadata.media_src) {
			sLogoUrl = cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(oLogo.__metadata.media_src);
		}

		return sLogoUrl;
	};


	cus.crm.mycontacts.formatter.ReleaseFormatter.urlFormatter = function (value) {
		var sSapServer, sSapHost, sSapHostHttp, sSapClient, oUri, sCurrentProtocol;

		sSapServer = jQuery.sap.getUriParameters().get("sap-server");
		sSapHost = jQuery.sap.getUriParameters().get("sap-host");
		sSapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
		sSapClient = jQuery.sap.getUriParameters().get("sap-client");

		oUri = URI(location.protocol + "//" + location.hostname + (location.port ? ':'+location.port: '') + cus.crm.mycontacts.formatter.ReleaseFormatter.getRelativePathFromURL(value));
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

	cus.crm.mycontacts.formatter.ReleaseFormatter.addressFormatter = function (address) {
		return address.split("\n").join(" ");
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.isMainContact = function (value) {
		var mainContact = "";
		if (value) {
			mainContact = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("MAIN_CONTACT");
		}

		return mainContact;
	};
	
	cus.crm.mycontacts.formatter.ReleaseFormatter.locationFormatter= function (oCity, oCountry, accountID) {
		var text = "";
		var idPrefix = "";
		
		if (accountID){
			idPrefix = accountID + " / ";
			text = accountID;
		}
		if(!oCity && oCountry){
			text = idPrefix + oCountry;
		}
		else if(!oCountry && oCity){
			text = idPrefix + oCity;
		}
		else if(oCountry && oCity){
			text = idPrefix + oCity +", " + oCountry;
		}
		return text;
	};

	cus.crm.mycontacts.formatter.ReleaseFormatter.formatMediumDate = function(oValue){
		if(oValue){
			return sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}).format(oValue);
		}
		else {
			return "";
		}
	};	
	
	cus.crm.mycontacts.formatter.ReleaseFormatter.isUnequal = function (value1, value2) {
		if(typeof(value1)=="string" && typeof(value2)=="string"){
			return value1.valueOf() != value2.valueOf();}
		else{
			return value1 != value2;
		}
	};
	
	cus.crm.mycontacts.formatter.ReleaseFormatter.isNotInitial = function (value) {
		if (value)
			return true;
		else
			return false;
	};
}());
