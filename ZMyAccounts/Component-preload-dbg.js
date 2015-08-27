jQuery.sap.registerPreloadedModules({
"name":"cus/crm/myaccounts/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/myaccounts/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.myaccounts.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
jQuery.sap.require("sap.ui.core.routing.HashChanger");
sap.ca.scfld.md.ComponentBase.extend("cus.crm.myaccounts.Component", {

    metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", {
	"name" : "My Accounts",
	"version" : "1.0.16",
	"library" : "cus.crm.myaccounts",
	"includes" : [],
	"dependencies" : {
	    "libs" : [ "sap.m", "sap.me" ],
	    "components" : []
	},
	"config" : {
	    "resourceBundle" : "i18n/i18n.properties",
	    "titleResource" : "FULLSCREEN_TITLE",
	    "icon" : "sap-icon://Fiori2/F0002",
	    "favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
	    "homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
	    "homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
	    "homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
	    "homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
	    "startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
	    "startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
	    "startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
	    "startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
	    "startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
	    "startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
	    "startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
	},
	viewPath : "cus.crm.myaccounts.view",
	fullScreenPageRoutes : {
		
		"S2" : {
		pattern : "",
		view : "S2",

	    },
	    "mainPage" : {
			pattern : "mainPage/{filterState}",
			view : "S2",

		},
	    "detail" : {
		pattern : "detail/{contextPath}", // will be the url and from
		view : "S360",

	    },
	    "edit" : {
			pattern : "edit/{contextPath}",
			view : "maintain.GeneralDataEdit",
		},
		"new" : {
			pattern : "new/{accountCategory}",
			view : "maintain.GeneralDataEdit",
		},
	    "AccountNotes" : {
		pattern : "AccountNotes/{contextPath}", // will be the url and
		view : "S4Notes",

	    },
	    "AccountAttachments" : {
		pattern : "AccountAttachments/{contextPath}", // will be the
		view : "S4Attachments",

	    }

	}
    }),

    /**
     * Initialize the application
     * 
     * @returns {sap.ui.core.Control} the content
     */
    createContent : function() {

	var oViewData = {
	    component : this
	};

	return sap.ui.view({
	    viewName : "cus.crm.myaccounts.Main",
	    type : sap.ui.core.mvc.ViewType.XML,
	    viewData : oViewData
	});
    },
    init : function() {
	// Get accountID query parameter
	var myComponent = this, context, accountID;
	if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
	    jQuery.sap.log.debug("startup parameters are " + JSON.stringify(myComponent.getComponentData().startupParameters));
	    if (undefined != myComponent.getComponentData().startupParameters.accountID[0]) {
		accountID = myComponent.getComponentData().startupParameters.accountID[0];
	    }
	}
	if (accountID) {
	    // fix : the hash change could be not initialized in that moment
	    if (undefined == this.getRouter().oHashChanger) {
		this.getRouter().oHashChanger = sap.ui.core.routing.HashChanger.getInstance();

	    }
	    context = "AccountCollection('" + accountID + "')";
	    this.getRouter().navTo("detail", {
		contextPath : context
	    }, true);
	}

    },

});
},
	"cus/crm/myaccounts/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.Configuration");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
jQuery.sap.require("cus.crm.myaccounts.util.Util");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.myaccounts.Configuration", {

    oServiceParams : {
	serviceList : [ {
	    name : "CRM_BUPA_ODATA",
	    serviceUrl : "/sap/opu/odata/sap/CRM_BUPA_ODATA",
	    countSupported : true,
	    isDefault : true,
	    mockedDataSource : "model/metadata.xml"
	} ]
    },

    /**
     * @inherit
     */
    getServiceList : function() {
    	return this.oServiceParams.serviceList;
    },
    
	setApplicationFacade : function(oApplicationFacade) {
		sap.ca.scfld.md.ConfigurationBase.prototype.setApplicationFacade.call(this, oApplicationFacade);
		cus.crm.myaccounts.util.Util.setApplicationFacade(oApplicationFacade);
	}
});

},
	"cus/crm/myaccounts/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.myaccounts.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('cus.crm.myaccounts', this);
	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}
		
});
},
	"cus/crm/myaccounts/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core"\n\txmlns="sap.m" controllerName="cus.crm.myaccounts.Main" displayBlock="true"\n\theight="100%">\n\t<App id="fioriContent" showHeader="false">                                                              \t\n\t</App>  \n</core:View>',
	"cus/crm/myaccounts/controller/Base360Controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.controller.Base360Controller");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.controller.Base360Controller", {

	getTargetAggregation: function(){
		return "content";
	},
	getControl :function(){
		
	},
	getTargetBinding: function(){
		var oControl = this.getControl();
		if(oControl){
			return this.getControl().getBinding(this.getTargetAggregation());
		}
		return undefined;
	}

});
},
	"cus/crm/myaccounts/util/Constants.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
cus.crm.myaccounts.util.Constants = {
		
		accountCategoryPerson: "1",
		accountCategoryCompany: "2",
		accountCategoryGroup: "3",
		
};
},
	"cus/crm/myaccounts/util/Util.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.myaccounts.util.Util");
jQuery.sap.require("sap.ca.ui.quickoverview.Quickoverview");

cus.crm.myaccounts.util.Util = {


	setApplicationFacade : function(oApplicationFacade) {
		this.oApplicationFacade = oApplicationFacade;
	},

	geti18NResourceBundle : function() {
		if (this.oApplicationFacade) {
			return this.oApplicationFacade.getResourceBundle();
		} else {
			return null ;
		}
	},

	geti18NText : function(key) {
		if (this.geti18NResourceBundle()) {
			return this.geti18NResourceBundle().getText(key);
		} else {
			return null ;
		}
	},

	geti18NText1 : function(key, replace) {
		if (this.geti18NResourceBundle()) {
			return this.geti18NResourceBundle().getText(key, replace);
		} else {
			return null ;
		}
	},
	
	openQuickoverview : function(
			popoverTitle, title, subtitle, imageURL,
			oContextPerson, pathToPerson, pathToPersonDependentObject,
			oContextCompany, pathToCompany,
			triggeringObject){
		
		// Set path and model for retrieving data of person 
		var contextPathPerson = oContextPerson.getPath();
		var oModelPerson = oContextPerson.getModel();
		
		// Set path and model for retrieving data of company
		var contextPathCompany = oContextCompany.getPath();
		var oModelCompany = oContextCompany.getModel();
		
		// Collect all data for business card in one model
		var oModelData = {};
		oModelData.Company = {};
		oModelData.Company.Address = oModelCompany.getProperty(contextPathCompany+"/"+pathToCompany);
		oModelData.Company.name = cus.crm.myaccounts.util.formatter.AccountNameFormatter( oModelCompany.getProperty(contextPathCompany).fullName, oModelCompany.getProperty(contextPathCompany).name1);
		oModelData.Person = oModelPerson.getProperty(contextPathPerson+ "/"+pathToPerson);
		var personDependentObject = "";
		if(oModelData.Person && pathToPersonDependentObject) {
			personDependentObject = oModelPerson.getProperty(contextPathPerson+ "/"+pathToPerson+"/"+pathToPersonDependentObject);
			oModelData.Person.Address = personDependentObject;
		}
		
		// Set the model used for the business card
		var oBusinessCardModel = new sap.ui.model.json.JSONModel();
		oBusinessCardModel.setData(oModelData);
		
		// Determine the icon of the header in the business card
		var isNoHeaderIcon, headerImgURL;
		if(imageURL){
			isNoHeaderIcon = false;
			headerImgURL = imageURL;
		}
		else{
			isNoHeaderIcon = true;
			headerImgURL = "";
		}
		
		// Use the quickoverview control for displaying the business card
		var oBusinessCardDefinition = {
				popoverHeight:"32rem",
				title:popoverTitle,
				headerNoIcon:isNoHeaderIcon,
				headerImgURL:headerImgURL,
				headerTitle:title,
				headerSubTitle:subtitle,
				subViewName:"cus.crm.myaccounts.view.overview.Quickoverview",
				oModel:oBusinessCardModel
			};
		var oBusinessCard = new sap.ca.ui.quickoverview.Quickoverview(oBusinessCardDefinition);
		oBusinessCard.openBy(triggeringObject);
		
		// Check whether any data of the person is missing and has to be read from odata model
		if(!oModelData.Person || !personDependentObject){
			oModelPerson.read(pathToPerson, oContextPerson, ["$expand="+pathToPersonDependentObject], true,
				function(oData, oResponse){	
					var oPerson = jQuery.parseJSON(JSON.stringify(oData));
					oModelData.Person = oPerson;
					oModelData.Person.Address = oPerson[pathToPersonDependentObject];
					var form = sap.ui.getCore().byId("cus.crm.myaccounts.view.overview.Quickoverview").byId("quickOverviewForm1");
					var item;
					for(var i in form.getContent()){
						item = sap.ui.getCore().byId(form.getContent()[i].getId());
						var textBinding = item.getBindingInfo("text");
						if (textBinding)
							textBinding.binding.refresh();
					}
				},
				function(oError){
					jQuery.sap.log.error("Read failed in Util.js:"+oError.response.body);
				}
			);
		}
		// Check whether any data of the company is missing and has to be read from odata model
		if(!oModelData.Company.Address){
			this.readODataObject(oContextCompany, pathToCompany, function(){});
		}		
	},
	
	readODataObjects: function(oContext, relationshipName, callbackFunction){
		
		var oContextObject = oContext.getModel().getProperty(oContext.sPath);
		
		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName)){
			callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
			return;
		}
		
		var oItemTemplate = new sap.m.StandardListItem({text:""});
    	var oList = new sap.m.List({
    	    items: {
    			path: relationshipName, 
    			template: oItemTemplate
    		}
    	});
    	
    	oList.setModel(oContext.getModel());
    	oList.setBindingContext(oContext);
    	
    	var oBinding = oList.getBinding("items");
    	var fnReceivedHandler = null;
    	fnReceivedHandler = jQuery.proxy(function (response) {

    		if (response.getSource().aKeys.length > 0)
    			oContextObject[relationshipName] = {__list: response.getSource().aKeys};
    		else
    			oContextObject[relationshipName] = null;
    
    		oBinding.detachDataReceived(fnReceivedHandler);
    		oList.destroy();
    		
    		callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
    		
    	}, this);
    	
    	oBinding.attachDataReceived(fnReceivedHandler);
	},
	
	readODataObject: function(oContext, relationshipName, callbackFunction, forceRead){
		
		var oContextObject = oContext.getModel().getProperty(oContext.sPath);
		
		if (oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName) && !forceRead){
			callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
			return;
		}
		
    	var oLabel = new sap.m.List();
    	oLabel.bindElement(oContext.sPath + "/" + relationshipName);
    	
    	oLabel.setModel(oContext.getModel());
    	oLabel.setBindingContext(oContext);
    	
    	var oBinding = oLabel.getElementBinding();
    	var fnReceivedHandler = null;
    	fnReceivedHandler = jQuery.proxy(function (response) {

    		if (response.getSource().getBoundContext())
    			oContextObject[relationshipName] = {__ref: response.getSource().getBoundContext().sPath.substr(1)};
    		else
    			oContextObject[relationshipName] = null;
    
    		oBinding.detachDataReceived(fnReceivedHandler);
    		oLabel.destroy();
    		
    		callbackFunction(oContext.getModel().getProperty(oContext.sPath+"/"+relationshipName));
    		
    	}, this);
    	
    	oBinding.attachDataReceived(fnReceivedHandler);
	},

	getRefreshUIObject: function(oModel, contextPath, expand){
		
		if(!this.refreshList)
			this.refreshList = new sap.m.List();
		var oList = this.refreshList;
		
		if(expand)
			oList.bindElement(contextPath, {expand: expand});
		else
			oList.bindElement(contextPath);
		
		oList.setModel(oModel);
		var oBinding = oList.getElementBinding();
		
		var fnCleanUp = null;
		fnCleanUp = jQuery.proxy(function (response) {
			if(oBinding)
				oBinding.detachDataRequested(fnCleanUp);
			oBinding = null;
		}, this);
		oBinding.attachDataRequested(fnCleanUp);
		
		var oRefreshObject = {
			refresh: function(){
				if(oBinding)
					oBinding.refresh();
			},
			destroy: function(){
				fnCleanUp();
			},
		};
		
		return oRefreshObject;
	},
	
	getServiceSchemaVersion: function(oModel, entityType){
		var version = 0;
		var oEntityModel = oModel.oMetadata._getEntityTypeByPath(entityType);
		for(var i in oEntityModel.extensions){
			if(oEntityModel.extensions[i].name == "service-schema-version")
				version = oEntityModel.extensions[i].value;
		}
		return version;
	}

};

},
	"cus/crm/myaccounts/util/formatter.js":function(){/*
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

},
	"cus/crm/myaccounts/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.myaccounts.controller.Base360Controller");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("cus.crm.myaccounts.util.Constants");
jQuery.sap.require("cus.crm.myaccounts.util.Util");

cus.crm.myaccounts.controller.Base360Controller.extend("cus.crm.myaccounts.view.S2", {

    onInit : function() {
	// execute the onInit for the base class BaseDetailController
	cus.crm.myaccounts.controller.Base360Controller.prototype.onInit.call(this);
	this.resourceBundle = this.oApplicationFacade.getResourceBundle();

	// Settings
	var oMasterModel = new sap.ui.model.json.JSONModel({
	    isRefreshing : false,
	    searchValue : "",
	    selectedKey : "MyAccount",
	    threshold : this.getThreshold(),
	    items : [ {
		text : this.resourceBundle.getText("MY_ACCOUNT"),
		key : "MyAccount"
	    }, {
		text : this.resourceBundle.getText("ALL_ACCOUNTS"),
		key : "All"
	    } ]
	});
	
	var oModel = this.getView().getModel(); 
	oModel.forceNoCache(true);
	
	this.getView().setModel(oMasterModel, "config");
	this.oRouter.attachRouteMatched(this.handleNavTo, this);
	
	this.backendSupportsCreate = cus.crm.myaccounts.util.Util.getServiceSchemaVersion(oModel, "AccountCollection") > 0;

    },
    destroy : function() {
	var oBinding = this.getTargetBinding();
	oBinding.detachChange(this._fnOnBindingChange);
    },
    handleNavTo : function(oEvent) {
		if (oEvent.getParameter("name") === "mainPage") {
        	var oArguments = oEvent.getParameter("arguments");
        	if (oArguments.filterState === "All")
        		this.getView().getModel('config').setProperty("/selectedKey", "All");
        	else
        		this.getView().getModel('config').setProperty("/selectedKey", "MyAccount"); 
        }
		
		if (oEvent.getParameter("name") === "S2" || oEvent.getParameter("name") === "mainPage") {
		    jQuery.sap.log.info("My accounts nav to " + oEvent.getParameter("name"));
		    // workaround to fix the pull to refresh that does not go
		    jQuery.sap.delayedCall(2000, this, function() {
			this.byId("myPullToRefresh").hide();
		    });
		    this._bindGrowingTileContainer();
		}
    },
    _bindGrowingTileContainer : function() {
    	if (!this.getView().byId("myOverviewTile"))
    		return;
		var oGrowingTile = this.getControl(), oBinding, aOptions;
		oGrowingTile.setGrowingThreshold(this.getThreshold()).setGrowing(true);
		oGrowingTile.bindAggregation("content", {
		    path : '/AccountCollection',
		    filters : this._getFilters(),
		    parameters : {
			expand : 'MainContact,Classification,MainAddress,Logo,AccountFactsheet',
			// select all account attributes (*), and some special attribute of the other entities 
			select : '*,MainContact,Classification,MainAddress,Logo,AccountFactsheet/opportunityVolume,AccountFactsheet/revenueCurrentYear,AccountFactsheet/lastContact,AccountFactsheet/nextContact'	
		    },
		    template : this.getView().byId("myOverviewTile").clone(),
		});
		this._fnOnBindingChange = jQuery.proxy(this.onBindingChange, this);
		oBinding = this.getTargetBinding();
		oBinding.attachChange(this._fnOnBindingChange);
		aOptions = this._getHeaderFooterOptions();
		this.setHeaderFooterOptions(aOptions);
    },

    /**
     * @Override getControl
     */
    getControl : function() {
	return this._getTileContainer();
    },
    /**
     * @Override getTargetAggregation
     */
    getTargetAggregation : function() {
	return "content";
    },

    _getTileContainer : function() {
	return this.byId("tileContainer");
    },
    /**
     * check if filter on my account is set
     */
    _isMyAccount : function() {
	var key = this.getView().getModel('config').getProperty("/selectedKey");
	return (key === "MyAccount") ? true : false;
    },

    /**
     * determines whether search (triggered by search field) is performed on
     * backend or frontend (frontend being default behavior).
     */
    isBackendSearch : function() {
	return true;
    },

    /**
     * @Override contains the server filter
     */
    applyBackendSearchPattern : function(sFilterPattern, oBinding) {
	var filters = this._getFilters(),
	// HACK: Remove initial filter (Status = New) which is by default
	// concatenated (or) to custom filters
	oBinding = this.getControl().getBinding(this.getTargetAggregation());

	oBinding.aApplicationFilters = [];
	// update master list binding
	oBinding.filter(filters);
    },
    onTileTap : function(oEvent) {
	// var title = oEvent.getSource().getTitle();
	this.oRouter.navTo("detail", {
	    contextPath : oEvent.getSource().getBindingContext().sPath.replace('/', "")
	});
    },
    openBusinessCard : function(oEvent) {
	var oEmpData = {};
	// get control that triggeres the BusinessCard
	if (oEvent) {
	    var oSource = oEvent.oSource;
	    if (oSource) {
		var oContext = oSource.getBindingContext();
		if (oContext) {
		    oEmpData = {
			name : oContext.getProperty("MainContact/fullName"),
			imgurl : this.photoUrlFormatter(oContext.getProperty("MainContact/Photo/__metadata/media_src")),
			department : oContext.getProperty("MainContact/department"),
			mobilephone : oContext.getProperty("MainContact/WorkAddress/mobilePhone"),
			officephone : oContext.getProperty("MainContact/WorkAddress/phone"),
			email : oContext.getProperty("MainContact/WorkAddress/email"),
			companyname : oContext.getProperty("MainContact/company"),
			companyaddress : oContext.getProperty("MainContact/WorkAddress/address")
		    };
		    // call 'Business Card' reuse component
		    var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpData);
		    oEmployeeLaunch.openBy(oEvent.getParameters());
		}

	    }
	}
    },

    logoUrlFormatter : function(mediaUrl) {
	return mediaUrl ? mediaUrl : "sap-icon://factory";
    },

    photoUrlFormatter : function(mediaUrl) {
	   if (mediaUrl) {
		   return cus.crm.myaccounts.util.formatter.getRelativePathFromURL(mediaUrl);
		}	
		else {	
			return "sap-icon://person-placeholder";
		}

    },

    _getHeaderFooterOptions : function() {
	// Update master Page title with total list items count
	// var nbItems = this.getList().getItems().length;
	// var oPage = this.getView().byId("page");
	var oController = this;
	var aButtonList = [];
	
	if(this.backendSupportsCreate){
		aButtonList.push({
			sI18nBtnTxt:"BUTTON_ADD",
			onBtnPressed:function (oEvent) {
				oController._addAccount(oEvent);
			}});
	}
	
	return {
		buttonList : aButtonList,
	    oFilterOptions : {
		aFilterItems : this.getView().getModel('config').getProperty("/items"),
		sSelectedItemKey : this.getView().getModel('config').getProperty("/selectedKey"),
		onFilterSelected : function(sKey) {
		    jQuery.sap.log.info(sKey + " has been selected");
		    oController.getView().getModel('config').setProperty("/selectedKey", sKey);
		    oController.handleFilter();
		}
	    },
	    oAddBookmarkSettings : {
		icon : "sap-icon://Fiori2/F0002"
	    }

	};
    },
    
    _addAccount: function(oEvent){
    	var that = this;
    	var aCategories =  this._getPossibleAccountCategories();
    	var aButtons = [];
    	for(var i in aCategories){
    		switch (aCategories[i]){
    			case cus.crm.myaccounts.util.Constants.accountCategoryCompany:
    				aButtons.push(new sap.m.Button({ text: this.resourceBundle.getText("CORPORATE_ACCOUNT"), press : function() {that._navigateToCreateScreen(cus.crm.myaccounts.util.Constants.accountCategoryCompany);} }));
    				break;
    			case cus.crm.myaccounts.util.Constants.accountCategoryPerson:
    				aButtons.push(new sap.m.Button({ text: this.resourceBundle.getText("INDIVIDUAL_ACCOUNT"), press : function() {that._navigateToCreateScreen(cus.crm.myaccounts.util.Constants.accountCategoryPerson);} }));
    				break;
    			case cus.crm.myaccounts.util.Constants.accountCategoryGroup:
    				aButtons.push(new sap.m.Button({ text: this.resourceBundle.getText("ACCOUNT_GROUP"), press : function() {that._navigateToCreateScreen(cus.crm.myaccounts.util.Constants.accountCategoryGroup);} }));
    				break;
    		}
    	}
    		
    	if(!this.oCreateAccountActionSheet){
    		this.oCreateAccountActionSheet = new sap.m.ActionSheet("AddAccountActionSheet", {
    			buttons: aButtons,
    			placement: sap.m.PlacementType.Top,
    		});
    	}
    		
    	this.oCreateAccountActionSheet.openBy(oEvent.getSource());
    },
    
    _getPossibleAccountCategories: function(){
    	return [cus.crm.myaccounts.util.Constants.accountCategoryCompany, cus.crm.myaccounts.util.Constants.accountCategoryPerson, cus.crm.myaccounts.util.Constants.accountCategoryGroup];
    },
    
    _navigateToCreateScreen: function(accountCategory){
		var oParameter;
		oParameter = {
			accountCategory:accountCategory,
		};
		this.oRouter.navTo("new", oParameter, false);
    },

    handleFilter : function() {
		var filters = this._getFilters(),
		// HACK: Remove initial filter (Status = New) which is by default
		// concatenated (or) to custom filters
		listBinding = this.getTargetBinding();
	
		listBinding.aApplicationFilters = [];
		// update master list binding
		listBinding.filter(filters);
		
		this._setFilterInURL();
    },
    
    _setFilterInURL:function () {
        var oParameter = {};
        oParameter.filterState = this.getView().getModel('config').getProperty("/selectedKey");
    	this.oRouter.navTo("mainPage", oParameter, true);
    },

    _getFilters : function() {
	var filters = [], sValue = this.getView().getModel("config").getProperty("/searchValue"), isMyAccounts = this._isMyAccount();
	if (sValue && sValue.length > 0) {
	    filters.push(new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sValue));
	}
	// add filter from Filters
	filters.push(new sap.ui.model.Filter("isMyAccount", sap.ui.model.FilterOperator.EQ, isMyAccounts));
	return filters;

    },

    refreshList : function(oEvent) {
	// workaround to fix the pull to refresh that does not go
	jQuery.sap.delayedCall(2000, this, function() {
	    this.byId("myPullToRefresh").hide();
	});
	var oControl = this.getControl(), isRefreshing = this.getView().getModel("config").getProperty("/isRefreshing"), oBinding = oControl.getBinding(this.getTargetAggregation()), fReceivedHandler = jQuery.proxy(function() {
	    this.getView().getModel("config").setProperty("/isRefreshing", false);
	    oBinding.detachDataReceived(fReceivedHandler);
	    sap.ca.ui.utils.busydialog.releaseBusyDialog();
	}, this), fRequestedHandler = jQuery.proxy(function() {
	    this.getView().getModel("config").setProperty("/isRefreshing", true);
	    sap.ca.ui.utils.busydialog.requireBusyDialog();
	    oBinding.detachDataRequested(fRequestedHandler);
	}, this), sValue;

	oBinding.attachDataRequested(fRequestedHandler);
	oBinding.attachDataReceived(fReceivedHandler);
	if (this.isBackendSearch() && !isRefreshing) {
	    sValue = this.getView().getModel("config").getProperty("/searchValue");
	    this.applyBackendSearchPattern(sValue, oBinding);
	}

    },

    onBindingChange : function() {
	var sI18NHeaderTitle = this._isMyAccount() ? "MY_ACCOUNT_TITLE" : "ALL_ACCOUNTS_TITLE", iCount = 0, oBinding = this.getTargetBinding();

	if (oBinding) {
	    iCount = oBinding.getLength();
	}
	(iCount > 0) ? this._oControlStore.oTitle.setText(this.resourceBundle.getText(sI18NHeaderTitle, iCount)) : this._oControlStore.oTitle.setText(this.resourceBundle.getText("FULLSCREEN_TITLE"));
    },

    getThreshold : function() {
	if (jQuery.device.is.phone) {
	    return 3;
	} else {
	    return 10;
	}
    }

});

},
	"cus/crm/myaccounts/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:ca="sap.ca.ui"\n\txmlns:layout="sap.ui.layout" controllerName="cus.crm.myaccounts.view.S2"\n\tdisplayBlock="true" height="100%">\n\t<Page id="page">\n\t\t<subHeader>\n\t\t\t<Bar>\n\t\t\t\t<contentMiddle>\n\t\t\t\t\t<SearchField id="mySearchField" value="{config>/searchValue}"\n\t\t\t\t\t\tsearch="refreshList" showRefreshButton="{device>/isNoTouch}" placeholder="{i18n>SEARCH_ACCOUNTS}">\n\t\t\t\t\t</SearchField>\n\t\t\t\t</contentMiddle>\n\t\t\t</Bar>\n\t\t</subHeader>\n\t\t<content>\n\t\t\t<PullToRefresh id="myPullToRefresh" visible="{device>/isTouch}" refresh="refreshList"></PullToRefresh>\n\t\t\t<!-- Replace with required full screen control -->\n\n\t\t\t<ca:GrowingTileContainer id="tileContainer"\tvertical="true" horizontal="false" growingScrollToLoad="true">\n\n\t\t\t\t<core:ExtensionPoint name="extOverviewTile">\n\t\t\t\t\t<ca:OverviewTile id="myOverviewTile" contact="{path:\'MainContact/fullName\'}"\n\t\t\t\t\t\ticon="{parts:[{path:\'Logo/__metadata/media_src\'},{path: \'category\'}], formatter:\'cus.crm.myaccounts.util.formatter.logoUrlFormatter\'}" \n\t\t\t\t\t\taddress="{parts:[{path:\'MainAddress/city\'}, {path:\'MainAddress/country\'}],formatter:\'cus.crm.myaccounts.util.formatter.locationFormatter\'}"\n\t\t\t\t\t\ttitle= "{parts:[{path: \'fullName\'},{path: \'name1\'}], formatter: \'cus.crm.myaccounts.util.formatter.AccountNameFormatter\'}" \n\t\t\t\t\t\trating="{Classification/ratingText}"\n\t\t\t\t\t\topportunities="{parts:[{path:\'AccountFactsheet/opportunityVolume/amount\'}, {path:\'AccountFactsheet/opportunityVolume/currency\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatShortAmounts\'}"\n\t\t\t\t\t\trevenue="{parts:[{path:\'AccountFactsheet/revenueCurrentYear/amount\'}, {path:\'AccountFactsheet/revenueCurrentYear/currency\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatShortAmounts\'}"\n\t\t\t\t\t\tlastContact="{parts:[{path:\'AccountFactsheet/lastContact/toDate\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumDate\' }"\n\t\t\t\t\t\tnextContact="{parts:[{path:\'AccountFactsheet/nextContact/fromDate\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumDate\' }"\n\t\t\t\t\t\tpress="onTileTap" contactPress="openBusinessCard">\n\t\t\t\t\t\t<ca:layoutData>\n\t\t\t\t\t\t\t<layout:GridData span="L4 M6 S12"></layout:GridData>\n\t\t\t\t\t\t</ca:layoutData>\n\t\t\t\t\t</ca:OverviewTile>\n\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\n\t\t\t</ca:GrowingTileContainer>\n\t\t</content>\n\t</Page>\n</core:View>\n',
	"cus/crm/myaccounts/view/S360.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("cus.crm.myaccounts.util.Util");


//Used for Cross Navigation to Leads, Opportunities, Tasks and Appointments
cus.crm.myaccounts.NavigationHelper = {};

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S360", {
    MODEL_360 : "cus.crm.myaccounts.s360",
	
	onInit : function() {		 
	   sap.ui.getCore().setModel(this.getView().getModel(),
			   cus.crm.myaccounts.view.S360.MODEL_360);
		this.oRouter.attachRouteMatched(this.handleNavTo, this);
		
		this.backendSupportsEdit = cus.crm.myaccounts.util.Util.getServiceSchemaVersion(this.getView().getModel(), "AccountCollection") > 0;
	},
	
	onAfterRendering: function(){
        $('.sapCRMmyAccountsHeader .sapMFlexItem').attr("style","float:left");
    },
	
	handleNavTo : function(oEvent){
		var oModel =  sap.ui.getCore().getModel(cus.crm.myaccounts.view.S360.MODEL_360);
		if (oEvent.getParameter("name") === "detail") {	
			var oController = this;
			var oView = this.getView();
			var sPath = '/' + oEvent.getParameter("arguments").contextPath;
			var context = new sap.ui.model.Context(oModel, '/' + oEvent.getParameter("arguments").contextPath);
			var fnBindViewContext = function(){
				oView.setModel(oModel);
				oView.setBindingContext(context);
				var oOptions=oController._getHeaderFooterOptions();
				oController.setHeaderFooterOptions(oOptions);
			};
			oModel.createBindingContext(sPath, "",
				{expand: 'AccountFactsheet,AccountFactsheet/Attachments,Logo,AccountFactsheet/Opportunities,AccountFactsheet/Notes,AccountFactsheet/Contacts,AccountFactsheet/Contacts/WorkAddress,AccountFactsheet/Leads,AccountFactsheet/Tasks,Classification,MainAddress,EmployeeResponsible,EmployeeResponsible/WorkAddress'}
				,fnBindViewContext
				,true
			);			
		}
		if (oEvent.getParameter("name") === "S2") {
			this.getView().setModel(new sap.ui.model.json.JSONModel());
		}
	},

	_getSelectedText: function (){
		var oAccount = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);
		var text=cus.crm.myaccounts.util.formatter.AccountNameFormatter(oAccount.fullName, oAccount.name1 )+"\n";
		
		var oMainAddress = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath+"/MainAddress");
		if (oMainAddress)
			text+=oMainAddress.address;

		return text; 
	},
	
	_getShareDisplay: function (){
		var oAccount = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);
		var text=cus.crm.myaccounts.util.formatter.AccountNameFormatter(oAccount.fullName, oAccount.name1 );
		
		var oMainAddress = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath+"/MainAddress");
		var text2 ="";
		if (oMainAddress)
			text2 = oMainAddress.address;

		return new sap.m.StandardListItem({title: text, description: text2});
	},
	
	_getDiscussID: function (){
		var url =  document.createElement('a');
		url.href = this.getView().getModel().sServiceUrl;
		return url.pathname + this.getView().getBindingContext().sPath;
//		return this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1 ;
//		return new sap.m.StandardListItem({title: text, description: text2});
	},
	
	_getDiscussType: function (){
		var url =  document.createElement('a');
		url.href = this.getView().getModel().sServiceUrl;
		return url.pathname + "/$metadata#AccountCollection";
	},
	
	_getDiscussName: function (){
		var oAccount = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);
		return cus.crm.myaccounts.util.formatter.AccountNameFormatter(oAccount.fullName, oAccount.name1 );
    },
    
	_getHeaderFooterOptions : function() {
		var that = this;
		var aButtonList = [];
		
		if(this.backendSupportsEdit){
			aButtonList.push({
				sI18nBtnTxt:"BUTTON_EDIT",
				sIcon:"",
				onBtnPressed:function (oEvent) {
					var oParameter;
					oParameter = {
						contextPath:that.getView().getBindingContext().sPath.substr(1),
					};
					that.oRouter.navTo("edit", oParameter, false);
				}});
		}
		
		return {
			buttonList : aButtonList,
			sI18NFullscreenTitle:"DETAIL_TITLE",
			onBack: function(oEvent){
				window.history.back();
			},
			oJamOptions : {
				oShareSettings :  { 			
					oDataServiceUrl: "/sap/opu/odata/sap/SM_INTEGRATION_SRV/",		
					object: {
						id: document.URL.replace(/&/g, "%26"),
						display: that._getShareDisplay(),
						share: that._getSelectedText() }
				},
				oDiscussSettings:{ 
					oDataServiceUrl: "/sap/opu/odata/sap/SM_INTEGRATION_SRV/",
					feedType: "object",
					object: {id: that._getDiscussID(),
						type: that._getDiscussType(),
						name: that._getDiscussName(),
						ui_url:document.URL
					}
				}
			},
			oAddBookmarkSettings:{
		    	icon:"sap-icon://Fiori2/F0002"
		    }
		};
	},
	navToOpportunity: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/opportunitiesCount");
		this.navToOtherApplication("Opportunity", "manageOpportunity",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToLead: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/leadsCount");
		this.navToOtherApplication("Lead", "manageLead",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToAppointments: function(){
		//path:'AccountFactsheet/nextContact/fromDate'
		var accountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID;
		var nextAppbinding = this.getView().getBindingContext().sPath +"/AccountFactsheet/nextContact/fromDate";
		var nextAppointmentDate = this.getView().getModel().getProperty(nextAppbinding);


		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/futureActivitiesCount");

		// *XNav* (1) obtain cross app navigation interface
		var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService; 
		this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
		if (null === nextAppointmentDate){
			//pass in format YYYYMMDD
			nextAppointmentDate = new Date();		
		}		

		//pass in format YYYYMMDD
		var nextAppDate = this.getDateParameterfromDate(nextAppointmentDate);
		
		cus.crm.myaccounts.NavigationHelper.qty = QtyForAccountID;
		cus.crm.myaccounts.NavigationHelper.accountName = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1;

		//Stop listen for route matched events in this view we are leaving
		this.oRouter.detachRouteMatched(this.handleNavTo, this, this);
		
		// *XNav (2) generate cross application link       
        this.oCrossAppNavigator && this.oCrossAppNavigator.toExternal({
            target: {  semanticObject : "Appointment", action: "myAppointments"  },
            params : { "accountID" : [ accountID ],
            			"Date" : [ nextAppDate ]}
        });

	},
	getDateParameterfromDate : function(d) {
		// format: Date --> yyymmdd
		var sDay = d.getDate().toString();
		sDay = (sDay.length === 1) ? "0" + sDay : sDay;
		var sMonth = d.getMonth() + 1; // Months are zero based
		sMonth = sMonth.toString();
		sMonth = (sMonth.length === 1) ? "0" + sMonth : sMonth;
		var sYear = d.getFullYear();
		var sDate = "" + sYear + sMonth + sDay;
		return sDate;
	},	
	navToTask: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/tasksCount");
		this.navToOtherApplication("Task", "manageTasks",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToNote: function(oEvent){
		this.oRouter.navTo("AccountNotes", {                                                         
			contextPath : oEvent.getSource().getBindingContext().sPath.replace('/' , "")
			// Remove initial /
		});

	}, 
	navToContact: function(){
		var QtyForAccountID = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath +"/AccountFactsheet/contactsCount");
		this.navToOtherApplication("ContactPerson", "MyContacts",this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).accountID, QtyForAccountID,
				this.getView().getModel().getProperty(this.getView().getBindingContext().sPath).name1);
	},
	navToOtherApplication: function(targetSemanticObject, targetAction, accountID, qtyForAccountID,accountName){
		
		
		// *XNav* (1) obtain cross app navigation interface
		var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService; 
		this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
		
		cus.crm.myaccounts.NavigationHelper.qty = qtyForAccountID;
		cus.crm.myaccounts.NavigationHelper.accountName = accountName;
		
		//Stop listen for route matched events in this view we are leaving
		this.oRouter.detachRouteMatched(this.handleNavTo, this, this);
		
		// *XNav (2) generate cross application link       
        this.oCrossAppNavigator && this.oCrossAppNavigator.toExternal({
            target: {  semanticObject : targetSemanticObject, action: targetAction },
            params : { "accountID" : [ accountID ]}
        });
		

	},	
	navToAttachment: function(oEvent){
		this.oRouter.navTo("AccountAttachments", {                                                         
			contextPath : oEvent.getSource().getBindingContext().sPath.replace('/' , "")
			// Remove initial /
		});
	}, 
});

},
	"cus/crm/myaccounts/view/S360.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core" xmlns:ui="sap.ca.ui" xmlns:suite="sap.suite.ui.commons" xmlns:layout="sap.ui.layout" xmlns:html="http://www.w3.org/1999/xhtml"\r\n\txmlns="sap.m" controllerName="cus.crm.myaccounts.view.S360">\r\n\r\n\r\n\t<Page id="page" title="{i18n>DETAIL_TITLE}" showNavButton="true">\r\n\t\t<content>\r\n\t\t\t<layout:Grid class ="sapSuiteUtiHeaderGrid sapSuiteUti sapCRMmyAccountsHeader" defaultSpan="L6 M6 S12" vSpacing="0" >\r\n\t\t\t\t<layout:content>\r\n\t\t\t\t\t<HBox>\r\n\t\t\t\t\t\t<Image src="{parts:[{path:\'Logo/__metadata/media_src\'},{path: \'category\'}], formatter:\'cus.crm.myaccounts.util.formatter.logoUrlFormatter\'}" \r\n\t\t\t\t\t\t\theight="5rem" \r\n\t\t\t\t\t\t\twidth="5rem"\r\n\t\t\t\t\t\t\tvisible="{path:\'Logo/__metadata/media_src\', formatter:\'cus.crm.myaccounts.util.formatter.logoVisibilityFormatter\'}" >\r\n\t\t\t\t\t\t</Image>\r\n\t\t\t\t\t\t<ObjectHeader title="{parts:[{path: \'fullName\'},{path: \'name1\'}], formatter: \'cus.crm.myaccounts.util.formatter.AccountNameFormatter\'}"\r\n\t\t\t\t\t\t\tclass="sapSuiteUtiHeader">\r\n\t\t\t\t\t\t\t<attributes>\r\n\t\t\t\t\t\t\t\t<ObjectAttribute text="{accountID}"></ObjectAttribute>\r\n\t\t\t\t\t\t\t</attributes>\r\n\t\t\t\t\t\t</ObjectHeader>\r\n\t\t\t\t\t</HBox>\r\n\t\t\t\t\t\r\n\t\t\t\t\t<core:ExtensionPoint name="extKpiBox">\r\n\t\t\t\t\t\t<HBox class="sapSuiteUtiKpiBox">\r\n\t\t\t\t\t\t\t<suite:KpiTile \r\n\t\t\t\t\t\t\t\tvalue="{parts:[{path:\'AccountFactsheet/revenueCurrentYear/amount\'},{path:\'AccountFactsheet/revenueCurrentYear/currency\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatShortNumber\'}"\r\n\t\t\t\t\t\t\t\tvalueUnit="{parts:[{path:\'AccountFactsheet/revenueCurrentYear/currency\'}]}"\r\n\t\t\t\t\t\t\t\tdescription="{i18n>REVENUE_CURRENT}"\r\n\t\t\t\t\t\t\t\tdoubleFontSize="true"\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t</suite:KpiTile>\r\n\t\t\t\t\t\t\t<suite:KpiTile \r\n\t\t\t\t\t\t\t\tvalue="{parts:[{path:\'AccountFactsheet/revenueLastYear/amount\'},{path:\'AccountFactsheet/revenueLastYear/currency\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatShortNumber\'}"\r\n\t\t\t\t\t\t\t\tvalueUnit="{parts:[{path:\'AccountFactsheet/revenueLastYear/currency\'}]}"\r\n\t\t\t\t\t\t\t\tdescription="{i18n>REVENUE_LAST}"\r\n\t\t\t\t\t\t\t\tdoubleFontSize="true"\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t</suite:KpiTile>\r\n\t\t\t\t\t\t\t<core:ExtensionPoint name="extKpiTile"/>\r\n\t\t\t\t\t\t</HBox>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t</layout:content>\r\n\t\t\t</layout:Grid>\r\n\t\t\t<layout:Grid defaultSpan="L6 M12 S12">\r\n\t\t\t\t<layout:content>\r\n\t\t\t\t\t<core:ExtensionPoint name="extGeneralInfo">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>GENERAL_DATA}" width="100%" height="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S6" hSpacing="0">\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>ADDRESS}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{MainAddress/address}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>UNWEIGHTED_OPPORTUNITIES}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{parts:[{path:\'AccountFactsheet/opportunityVolume/amount\'}, {path:\'AccountFactsheet/opportunityVolume/currency\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatShortAmounts\'}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extGeneralInfoLeft"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t\t<VBox>\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>RATING}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{Classification/ratingText}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'EmployeeResponsible/WorkAddress/function\'}], formatter:\'cus.crm.myaccounts.util.formatter.formatEmployeeResponsible\'}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{EmployeeResponsible/fullName}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extGeneralInfoRight"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extContacts">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>CONTACTS}"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tpress="navToContact"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/contactsCount\'}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12"\r\n\t\t\t\t\t\t\t\t\t\t\thSpacing="0" \r\n\t\t\t\t\t\t\t\t\t\t\tcontent="{path:\'AccountFactsheet/Contacts\'}" >\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{function}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{fullName}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{WorkAddress/mobilePhone}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{WorkAddress/email}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extContactsInfo"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extOpportunities">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>OPPORTUNITIES}"\r\n\t\t\t\t\t\t\tpress="navToOpportunity"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/opportunitiesCount\', parameters:{expand:\'AccountFactsheet\'}}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12"\r\n\t\t\t\t\t\t\t\t\t\t\thSpacing="0"\r\n\t\t\t\t\t\t\t\t\t\t\tcontent="{path:\'AccountFactsheet/Opportunities\'}" >\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'closingDate\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatCloseDate\' }"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{description}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{parts:[{path : \'expRevenue\'},{path : \'currency\'}], formatter:\'cus.crm.myaccounts.util.formatter.formatAmounts\'}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{currPhaseText}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extOpportunityInfo"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extAppointments">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>APPOINTMENTS}"\r\n\t\t\t\t\t\t\tpress="navToAppointments"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/futureActivitiesCount\', parameters:{expand:\'AccountFactsheet\'}}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12" hSpacing="0">\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>NEXT_APPOINTMENT}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{parts:[{path:\'AccountFactsheet/nextContact/fromDate\'}, {path:\'AccountFactsheet/nextContact/toDate\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumTimeInterval\' }"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{AccountFactsheet/nextContact/description}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extAppointmentLeft"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t\t<VBox>\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>LAST_APPOINTMENT}"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{parts:[{path:\'AccountFactsheet/lastContact/fromDate\'}, {path:\'AccountFactsheet/lastContact/toDate\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumTimeInterval\' }"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{AccountFactsheet/lastContact/description}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extAppointmentRight"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extLeads">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>LEADS}"\r\n\t\t\t\t\t\t\tpress="navToLead"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/leadsCount\', parameters:{expand:\'AccountFactsheet\'}}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12"\r\n\t\t\t\t\t\t\t\t\t\t\thSpacing="0"\r\n\t\t\t\t\t\t\t\t\t\t\tcontent="{path:\'AccountFactsheet/Leads\'}" >\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'validFrom\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatStartDate\' }"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{description}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{qualificationLevel}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{statusText}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{importanceText}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extLeadInfo"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extTasks">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>TASKS}"\r\n\t\t\t\t\t\t\tpress="navToTask"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/tasksCount\', parameters:{expand:\'AccountFactsheet\'}}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12"\r\n\t\t\t\t\t\t\t\t\t\t\thSpacing="0"\r\n\t\t\t\t\t\t\t\t\t\t\tcontent="{path:\'AccountFactsheet/Tasks\'}" >\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'dueDate\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatDueDate\' }"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{description}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extTaskInfo"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extNotes">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>NOTES}"\r\n\t\t\t\t\t\t\tpress="navToNote"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/notesCount\', parameters:{expand:\'AccountFactsheet\'}}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12"\r\n\t\t\t\t\t\t\t\t\t\t\thSpacing="0"\r\n\t\t\t\t\t\t\t\t\t\t\tcontent="{path:\'AccountFactsheet/Notes\'}" >\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'createdAt\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumDate\' }"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{content}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extNoteInfo"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extAttachments">\r\n\t\t\t\t\t\t<suite:FacetOverview\r\n\t\t\t\t\t\t\ttitle="{i18n>ATTACHMENTS}"\r\n\t\t\t\t\t\t\tpress="navToAttachment"\r\n\t\t\t\t\t\t\twidth="100%"\r\n\t\t\t\t\t\t\tquantity="{path:\'AccountFactsheet/attachmentsCount\', parameters:{expand:\'AccountFactsheet\'}}"\r\n\t\t\t\t\t\t\theight="200px">\r\n\t\t\t\t\t\t\t<suite:content>\r\n\t\t\t\t\t\t\t\t<layout:Grid defaultSpan="L6 M6 S12"\r\n\t\t\t\t\t\t\t\t\t\t\thSpacing="0"\r\n\t\t\t\t\t\t\t\t\t\t\tcontent="{path:\'AccountFactsheet/Attachments\'}" >\r\n\t\t\t\t\t\t\t\t\t<layout:content>\r\n\t\t\t\t\t\t\t\t\t\t<VBox height="200px">\r\n\t\t\t\t\t\t\t\t\t\t\t<items>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'createdAt\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumDate\' }"></Label>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<Text text="{name}"></Text>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extAttachmentInfo"/>\r\n\t\t\t\t\t\t\t\t\t\t\t</items>\r\n\t\t\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t\t</layout:content>\r\n\t\t\t\t\t\t\t\t</layout:Grid>\r\n\t\t\t\t\t\t\t</suite:content>\r\n\t\t\t\t\t\t</suite:FacetOverview>\r\n\t\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t\t\t<core:ExtensionPoint name="extFacetOverview"/>\r\n\t\t\t\t</layout:content>\r\n\t\t\t</layout:Grid>\r\n\t\t</content>\r\n\t\t\t\t<footer>\r\n            <Bar id="detailFooter">\r\n                <contentRight>\r\n                    <Button icon="sap-icon://action" press="handleAction" />\r\n                </contentRight>\r\n            </Bar>\r\n        </footer>\r\n\t</Page>\r\n</core:View>\r\n',
	"cus/crm/myaccounts/view/S4Attachments.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S4Attachments", {

	onInit : function() {
		this.oRouter.attachRouteMatched(this.handleNavTo, this);

	},
	handleNavTo : function(oEvent){
		if (oEvent.getParameter("name") === "AccountAttachments") {	
			var oView = this.getView();
			var contextPath = oEvent.getParameter("arguments").contextPath;
//          Unused variable
//			var oPage = this.byId("page");
    		var oModel = this.getView().getModel();
    		var sPath = '/' + oEvent.getParameter("arguments").contextPath;
    		var context = new sap.ui.model.Context(oModel, '/' + oEvent.getParameter("arguments").contextPath);
    		var fnBindViewContext = function(){
    			oView.setBindingContext(context);
    		}
    		oModel.createBindingContext(sPath, "", {expand: 'Attachments'},fnBindViewContext,true);

			var oModel = this.getView().getModel();
			var that=this;

			if (oModel instanceof sap.ui.model.odata.ODataModel){
				oModel.read(contextPath+"/Attachments", null, null, true, function(oData, oResponse){   
					var attachments= JSON.parse(JSON.stringify(oData));
					var data = { Attachments : [] };
					$.each( attachments.results, function(index, value) 
							{
						var o = {name : value.name,
								size : value.fileSize,
								url : cus.crm.myaccounts.util.formatter.urlFormatter(value.__metadata.media_src),
								uploadedDate :value.createdAt,
								contributor : value.createdBy,
								fileExtension : cus.crm.myaccounts.util.formatter.mimeTypeFormatter(value.mimeType),
								fileId : value.documentId
						};
						data.Attachments.push(o);								
							}
					);
					that.byId('fileupload').setModel(new sap.ui.model.json.JSONModel(data));

				});
			}
		}

	},
	handleNavBack: function(oEvent){
		window.history.back();
	},

	_refresh : function(channelId, eventId, data) {

		var that = this;

		if (data && data.context) {

			this.getView().setBindingContext(data.context);

			var oModel = this.getView().getModel();			
			if (oModel instanceof sap.ui.model.odata.ODataModel){
				oModel.read(data.context.getPath()+"/Attachments", null, null, true, function(oData, oResponse){   
					var attachments= JSON.parse(JSON.stringify(oData));
					var data = { Attachments : [] };
					$.each( attachments.results, function(index, value) 
							{
						var o = {name : value.name,
								size : value.fileSize,
								url : cus.crm.myaccounts.util.formatter.getRelativePathFromURL(value.__metadata.media_src),
								uploadedDate : cus.crm.mycontacts.formatter.ReleaseFormatter.dateFormatter(value.createdAt),
								contributor : value.createdBy,
								fileExtension : cus.crm.mycontacts.formatter.ReleaseFormatter.mimeTypeFormatter(value.mimeType),
								fileId : value.documentId
						};
						data.Attachments.push(o);								
							}
					);
					that.byId('fileupload').setModel(new sap.ui.model.json.JSONModel(data));
				});
			}
		}

	},

});

},
	"cus/crm/myaccounts/view/S4Attachments.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:ca="sap.ca.ui" xmlns:html="http://www.w3.org/1999/xhtml"\n\txmlns="sap.m" controllerName="cus.crm.myaccounts.view.S4Attachments">\n\n\n\t<Page id="page" title="{i18n>ATTACHMENTS}" showNavButton="true" navButtonPress="handleNavBack">\n\t\t<content>\n\t\t\t<ObjectHeader title="{i18n>ATTACHMENTS}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute text="{parts:[{path: \'fullName\'},{path: \'name1\'}], formatter: \'cus.crm.myaccounts.util.formatter.AccountNameFormatter\'}"></ObjectAttribute>\n\t\t\t\t</attributes>\n\t\t\t</ObjectHeader>\n\t\t\t<html:div><html:hr ></html:hr></html:div>\n\t\t\t <ca:FileUpload\n\t\t\t \tclass="sapCaUiNotes"\n\t\t\t    id="fileupload"\n\t\t\t    items="/Attachments"\n\t\t\t    uploadUrl="name"\n\t\t\t    fileName="name"\n\t\t\t    size="size"\n\t\t\t    url="url"\n\t\t\t    uploadedDate="uploadedDate"\n\t\t\t    contributor="contributor"\n\t\t\t    fileExtension="fileExtension"\n\t\t\t    fileId="documentId"\t\n\t\t\t    editMode="false"\n\t\t\t    showNoData="true" \n\t\t\t    uploadEnabled = "false"/>\n\t\t</content>\n\t</Page>\n</core:View>',
	"cus/crm/myaccounts/view/S4Notes.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.S4Notes", {

    onInit : function() {
    	this.oRouter.attachRouteMatched(this.handleNavTo, this);

    },
    handleNavTo : function(oEvent){
    	if (oEvent.getParameter("name") === "AccountNotes") {	
    		var oView = this.getView();
//           Unused variables
//			var contextPath = oEvent.getParameter("arguments").contextPath;
//			var oPage = this.byId("page");
    		var oModel = this.getView().getModel();
    		var sPath = '/' + oEvent.getParameter("arguments").contextPath;
    		var context = new sap.ui.model.Context(oModel, '/' + oEvent.getParameter("arguments").contextPath);
    		var fnBindViewContext = function(){
    			oView.setBindingContext(context);
    		}
    		oModel.createBindingContext(sPath, "", {expand: 'Notes'},fnBindViewContext,true);
    	}
    },
    handleNavBack: function(oEvent){
    	window.history.back();
   	
	}	
	
});

},
	"cus/crm/myaccounts/view/S4Notes.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:ca="sap.ca.ui" xmlns:html="http://www.w3.org/1999/xhtml"\n\txmlns="sap.m" controllerName="cus.crm.myaccounts.view.S4Notes">\n\n\n\t<Page id="page" title="{i18n>NOTES}" showNavButton="true" navButtonPress="handleNavBack">\n\t\t<content>\n\t\t\t<ObjectHeader title="{i18n>NOTES}">\n\t\t\t\t<attributes>\n\t\t\t\t\t<ObjectAttribute text="{parts:[{path: \'fullName\'},{path: \'name1\'}], formatter: \'cus.crm.myaccounts.util.formatter.AccountNameFormatter\'}"></ObjectAttribute>\n\t\t\t\t</attributes>\n\t\t\t</ObjectHeader>\n\t\t\t<html:div><html:hr ></html:hr></html:div>\n\t\t\t<ca:Notes growing="true" growingThreshold="4" showNoteInput="false" items="{Notes}">\n\t\t\t\t<ca:ExpansibleFeedListItem  senderActive="false" showIcon="false" text="{content}" sender="{creator}" timestamp="{parts:[{path:\'createdAt\'}],formatter:\'cus.crm.myaccounts.util.formatter.formatMediumDateTime\' }" maxLines="3"></ca:ExpansibleFeedListItem>\n\t\t\t</ca:Notes>\n\t\t</content>\n\t</Page>\n</core:View>',
	"cus/crm/myaccounts/view/maintain/GeneralDataEdit.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("cus.crm.myaccounts.util.Util");
jQuery.sap.require("cus.crm.myaccounts.util.formatter");
jQuery.sap.require("cus.crm.myaccounts.util.Constants");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("cus.crm.myaccounts.view.maintain.GeneralDataEdit", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.maintain.GeneralDataEdit
*/
	onInit: function() {
		this.editMode = true;
		this.oDataModel = null;
		this.valueHelpCountry = null;
		this.valueHelpRegion = null;
		this.countryIDUsedForRegion = undefined;
		this.countryIDUsedForRegionSuggestion = undefined;
		this.customizingModel = new sap.ui.model.json.JSONModel({TitleCustomizing: [], AcademicTitleCustomizing: []});
		this.getView().setModel(this.customizingModel, "Customizing");
		
		if(!this.oDataModel)
			this.oDataModel = this.getView().getModel();
		
		var constants = new sap.ui.model.json.JSONModel(cus.crm.myaccounts.util.Constants);
		this.getView().setModel(constants, "constants");	
		this._readCustomizing();
		
		this.oRouter.attachRouteMatched(function (oEvent) {
			if (oEvent.getParameter("name") === "edit") {
				this.editMode = true;
				this._cleanUp();
				var oArguments = oEvent.getParameter("arguments");
				var oModel = this.oDataModel;
				this.getView().setModel(oModel);
				var contextPath = "/"+oArguments.contextPath;
				var oContext = oModel.getContext(contextPath);
				this.getView().setBindingContext(oContext);
				var that = this;
				if(!oContext.getObject()){ //if context has no account object (if the view has been called directly with a link)
					oModel.createBindingContext(contextPath, "", {
						expand : this._getExpandForDataBinding()}, 
						function() {
							var oContext = that.getView().getBindingContext();
							var oModel = that.getView().getModel();
							var countryID = oModel.getProperty(oContext.sPath+"/MainAddress/countryID");
							if (countryID && countryID != "")
								that._setAddressFieldsEnabled(true);
							else
								that._setAddressFieldsEnabled(false);
						}, 
						true); 
				}
				else{
					this._toggleAddressFields();
				}
			}
			if (oEvent.getParameter("name") === "new") {
				this.editMode = false;
				this._cleanUp();
				var accountCategory = oEvent.getParameter("arguments").accountCategory;
				if( accountCategory != cus.crm.myaccounts.util.Constants.accountCategoryPerson && accountCategory != cus.crm.myaccounts.util.Constants.accountCategoryCompany && accountCategory != cus.crm.myaccounts.util.Constants.accountCategoryGroup)
					accountCategory = cus.crm.myaccounts.util.Constants.accountCategoryCompany;
				this._setEmptyScreen(accountCategory);
				this._toggleAddressFields();
			}
		}, this);
	},
	
	_setEmptyScreen: function(accountCategory){
		var oAccountTemplate = this._getTemplateForAccount(accountCategory);
		
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			oAccountTemplate[aDependentRelations[i]] = this._getTemplateForDependentObject(aDependentRelations[i]);
		}
		
		var oNewAccountModel = new sap.ui.model.json.JSONModel({NewAccount: oAccountTemplate});
		oNewAccountModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay); //to be similar to oData model
		this.getView().setModel(oNewAccountModel);
		this.getView().setBindingContext(oNewAccountModel.getContext("/NewAccount"));
	},
	
	_getExpandForDataBinding: function(){
		var expandString='Logo';
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			expandString = expandString + "," + aDependentRelations[i];
		}
		return expandString;
	},
	
	_getDependentRelations: function(){
		var oDependentRelations = ["MainAddress"];
		var oDependentCustomRelations = [];
		if (this.extHookGetDependentCustomRelations)
			/** * @ControllerHook extHookGetDependentCustomRelations * 
			 * The method extHookGetDependentCustomRelations should return an array with dependent relations to the AccountCollection, which should be considered in the create/update process * 
			 * @callback cus.crm.myaccounts.view.maintain.GeneralDataEdit~extHookGetDependentCustomRelations *
			 * @return {array} */
			oDependentCustomRelations = this.extHookGetDependentCustomRelations();
		for(var i in oDependentCustomRelations){
			oDependentRelations.push(oDependentCustomRelations[i]);
		}
			
		return oDependentRelations;
	},

	_getTemplateForAccount: function(accountCategory){
		var oAccountTemplate = this._generateTemplateUsingMetadata("AccountCollection");
		oAccountTemplate.isMyAccount = true;
		oAccountTemplate.category = accountCategory;
		if(oAccountTemplate.birthDate == "")
			oAccountTemplate.birthDate = null;
		return oAccountTemplate;
	},
	
	_getTemplateForDependentObject: function(relationName){
		switch (relationName) {
			default:
				return this._generateTemplateUsingMetadata("AccountCollection/"+relationName);
				break;
		}
	},
	
	_generateTemplateUsingMetadata: function(path){
		var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
		var oTemplate={};
		for(var i in oEntityMetadata.property){
			oTemplate[oEntityMetadata.property[i].name] = "";
		}
		return oTemplate;
	},
	
	_objectKeyIsInitial: function(object, path){
		var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath(path);
		for(var i in oEntityMetadata.key.propertyRef)
			if(object[oEntityMetadata.key.propertyRef[i].name] != "")
				return false;
		
		return true;
	},
	
	_fillNewObject: function(sourceObject, targetObject, fieldPrefix, fragmentName){
		
		var changesExist = false;
		var inputFieldId = "";
		for (var key in sourceObject) {
			
			if(fragmentName)
				inputFieldId = this.getView().getId()+"--"+fragmentName+"--"+fieldPrefix+key+"Input";
			else
				inputFieldId = this.getView().getId()+"--"+fieldPrefix+key+"Input";
			
			if(typeof sourceObject[key] != "object" || key == "birthDate")
				targetObject[key] = sourceObject[key];
			
			var oInputField = this.byId(inputFieldId);
			if (oInputField){
				var newValue = "";
				if(oInputField.getDateValue){	//special logic for dates
					newValue = oInputField.getValue();
					if(newValue == ""){
						newValue = null;
					}
					else{
						var oNewDate = new Date();
						var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "long"});
						var oDate = dateFormatter.parse(newValue);
						if(!oDate){
							dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "short"});
							oDate = dateFormatter.parse(newValue);
						}
						if(!oDate){
							dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({style : "medium"});
							oDate = dateFormatter.parse(newValue);
						}
						if(oDate){
							oNewDate.setUTCFullYear(oDate.getFullYear());
							oNewDate.setUTCDate(oDate.getDate());
							oNewDate.setUTCMonth(oDate.getMonth());
							oNewDate.setUTCHours(0);
							oNewDate.setUTCMinutes(0);
							oNewDate.setUTCSeconds(0);
							oNewDate.setUTCMilliseconds(0);
							newValue = oNewDate;
						}
						else{
							newValue = null;
						}
					}
				}
					
				else if (oInputField.getSelectedKey)
					newValue = oInputField.getSelectedKey();
				else if (oInputField.getValue) 
					newValue = oInputField.getValue();
				if(targetObject[key] != newValue){
					changesExist = true;
					targetObject[key] = newValue;
				}
			}		
		}
		return changesExist;
	},

	_onAfterSave: function(responseObject){
		this._setBusy(false);
		if (this.editMode)
			window.history.back();
		else
			this.oRouter.navTo("detail", {
			    contextPath : "AccountCollection('"+responseObject.accountID+"')"
			}, true);
	},

	onSaveButtonPressed: function(oEvent){
		if(!this._checkSavePossible())
			return;
		
		this._setBusy(true);
		var oModel = this.getView().getModel();
		var oAccountContext = this.getView().getBindingContext();
		var oAccount = oAccountContext.getObject();
		var oNewAccount = {};
		
		var changesInAccount=false, changesInAccountSpecificFields=false, changesForDependentRelations=false;
		
		changesInAccount = this._fillNewObject(oAccount, oNewAccount, "");
		if(oAccount.category == cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccountSpecificFields = this._fillNewObject(oNewAccount, oNewAccount, "", "personFragment");
		if(oAccount.category != cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccountSpecificFields = this._fillNewObject(oNewAccount, oNewAccount, "", "companyFragment");
		if(changesInAccountSpecificFields)
			changesInAccount = changesInAccountSpecificFields;
		
		changesForDependentRelations = this._changesForDependentRelationsExists();
		
		if(!changesInAccount && !changesForDependentRelations)
			return;	
		
		var oBatchOperation, sRequestURL;
		var aBatchOperation = [];
		
		if(this.editMode){
			
			if (changesInAccount) {
				sRequestURL = oAccountContext.sPath;
				oBatchOperation = oModel.createBatchOperation(sRequestURL, "PUT", oNewAccount);
				aBatchOperation.push(oBatchOperation);
			}

			if(changesForDependentRelations) {
				this._createBatchOperationForDependentRelations(aBatchOperation);
			}
			
			var oRefreshUIObject = cus.crm.myaccounts.util.Util.getRefreshUIObject(oModel, oAccountContext.sPath, this._getExpandForDataBinding());
			this._submitBatchOperation(aBatchOperation, function(){ oRefreshUIObject.refresh(); this._onAfterSave();}, function(){ oRefreshUIObject.destroy(); this._setBusy(false);});
			
		}
		else {
	
			sRequestURL = "/AccountCollection";
			oBatchOperation = this.oDataModel.createBatchOperation(sRequestURL, "POST", oNewAccount);
			
			if(changesForDependentRelations) {
				this._adaptAccountWithDependentRelationsBeforeCreate(oNewAccount);
			}
			
			aBatchOperation.push(oBatchOperation);
			this._submitBatchOperation(aBatchOperation, this._onAfterSave, function(){this._setBusy(false);});
		}
	},
	
	_adaptAccountWithDependentRelationsBeforeCreate: function(oNewAccount){
		
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			var oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
			var oNewDependentObject = {};
			var changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
			if(changesInDependentObject)
				oNewAccount[aDependentRelations[i]] = oNewDependentObject;
		}	
	},
	
	_createBatchOperationForDependentRelations: function(aBatchOperation){
		var oModel = this.getView().getModel();
		var oAccountContext = this.getView().getBindingContext();
		var oAccount = oAccountContext.getObject();
		
		
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			var oDependentObject = oModel.getProperty(oAccountContext+"/"+aDependentRelations[i]);
			var oDependentObjectContext = null;
			if (oDependentObject)
				oDependentObjectContext = oModel.getContext("/"+oAccount[aDependentRelations[i]]["__ref"]); 
			var oNewDependentObject = {};
			
			var changesInDependentObject=false;
			
			var dependentObjectToBeCreated = false;
			if(!oDependentObject || this._objectKeyIsInitial(oDependentObject, "AccountCollection/"+aDependentRelations[i])){	//odata contains initial address with no keys -> only if user comes from search result list
				dependentObjectToBeCreated = true;
				oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
				if(oDependentObject.accountID != null && oDependentObject.accountID != undefined)
					oDependentObject.accountID = oAccount.accountID;
			}
			changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
			
			var oBatchOperation, requestURL;
			if(changesInDependentObject){
				var httpMethod;
				if(dependentObjectToBeCreated){
					httpMethod = "POST";
					var oEntityMetadata = this.oDataModel.oMetadata._getEntityTypeByPath("AccountCollection/"+aDependentRelations[i]);
					requestURL = oEntityMetadata.name+"Collection";
				}
				else{
					httpMethod = "PUT";
					requestURL = oDependentObjectContext.sPath;
				}
				oBatchOperation = oModel.createBatchOperation(requestURL, httpMethod, oNewDependentObject);
				aBatchOperation.push(oBatchOperation);
			}			
		}
	},
	
	_changesForDependentRelationsExists: function(){
		var oModel = this.oDataModel;
		var oAccountContext = this.getView().getBindingContext();
		var changesInDependentObject = false;
		var aDependentRelations = this._getDependentRelations();
		for(var i in aDependentRelations){
			var oDependentObject = oModel.getProperty(oAccountContext+"/"+aDependentRelations[i]);
			if(!oDependentObject)
				oDependentObject = this._getTemplateForDependentObject(aDependentRelations[i]);
			var oNewDependentObject = {};
			changesInDependentObject = this._fillNewObject(oDependentObject, oNewDependentObject, aDependentRelations[i]+".");
			if(changesInDependentObject)
				return changesInDependentObject;
		}

		return changesInDependentObject;
	},
	
	
	_submitBatchOperation: function(aBatchOperation, callbackSuccess, callbackError){
		var oModel = this.oDataModel;
		oModel.clearBatch();
		oModel.addBatchChangeOperations(aBatchOperation);
		var that = this;
		oModel.submitBatch(
			jQuery.proxy(function (data) {
				var sErrorMessage = null;
				var aBatchResponse = data.__batchResponses;
				var responseObject = null;
				for (var i = 0; i < aBatchResponse.length; i++) {
					if (aBatchResponse[i].response) {
						sErrorMessage = jQuery.parseJSON(aBatchResponse[i].response.body).error.message.value;
					}
					if (aBatchResponse[i].__changeResponses &&
						aBatchResponse[i].__changeResponses.length > 0 && 
						aBatchResponse[i].__changeResponses[0].statusCode == 201){
						
						responseObject = aBatchResponse[i].__changeResponses[0].data;
					}
				}
				if (!sErrorMessage) {
					if(this.editMode)
						sap.m.MessageToast.show(cus.crm.myaccounts.util.Util.geti18NText("MSG_UPDATE_SUCCESS"));
					else
						sap.m.MessageToast.show(cus.crm.myaccounts.util.Util.geti18NText("MSG_CREATION_SUCCESS"));
					if (callbackSuccess)
						callbackSuccess.call(that, responseObject);
				}
				else {
					sap.m.MessageBox.alert(sErrorMessage);
					if (callbackError)
						callbackError.call(that);
				}

			}, this),
			jQuery.proxy(function () {
				if(this.editMode)
					sap.m.MessageBox.alert(cus.crm.myaccounts.util.Util.geti18NText("MSG_UPDATE_ERROR"));
				else
					sap.m.MessageBox.alert(cus.crm.myaccounts.util.Util.geti18NText("MSG_CREATION_ERROR"));

				if (callbackError)
					callbackError.call(that);
			}, this),
		true);
	},

	onCancelButtonPressed: function(){
		
		if(!this._checkSaveNeeded()){
			window.history.back();
			return;
		}

		sap.m.MessageBox.confirm(
			cus.crm.myaccounts.util.Util.geti18NText("MSG_CONFIRM_CANCEL"),
			jQuery.proxy(function (confirmed) {
				if (confirmed === "OK") {
					window.history.back();
				}
			}, this)
		);
	},
	
	onInputFieldChanged:function (oEvent) {
		this._toggleSubmit();
	},
		
	_toggleSubmit:function () {
		if (this._checkMandatoryFieldsFilled() && this._checkSaveNeeded())
			this.setBtnEnabled("saveButton", true);
		else
			this.setBtnEnabled("saveButton", false);
	},

	_checkMandatoryFieldsFilled: function() {
		var oAccount = this.getView().getBindingContext().getObject();
		if(oAccount.category == cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			return this.byId(sap.ui.core.Fragment.createId("personFragment","name1Input")).getValue().length !== 0;
		else
			return this.byId(sap.ui.core.Fragment.createId("companyFragment","name1Input")).getValue().length !== 0;
	},

	_checkSavePossible: function(){
		var inputField, countryID, country, regionID, region;
		
		inputField = this.getView().byId("MainAddress.countryIDInput");
		if(inputField)
			countryID = inputField.getValue();
		
		inputField = this.getView().byId("MainAddress.countryInput");
		if(inputField)
			country = inputField.getValue();
		
		if(country && !countryID){
			sap.m.MessageBox.alert( cus.crm.myaccounts.util.Util.geti18NText1("MSG_WRONG_COUNTRY_ERROR", country));
			return false;
		}
			
		inputField = this.getView().byId("MainAddress.regionIDInput");
		if(inputField)
			regionID = inputField.getValue();
		
		inputField = this.getView().byId("MainAddress.regionInput");
		if(inputField)
			region = inputField.getValue();
		
		if(region && !regionID){
			sap.m.MessageBox.alert( cus.crm.myaccounts.util.Util.geti18NText1("MSG_WRONG_REGION_ERROR", region));
			return false;
		}
		
		return true;
	},
	
	_checkSaveNeeded: function(){
		var oAccountContext = this.getView().getBindingContext();
		var oAccount = oAccountContext.getObject();
		var oNewAccount = {};

		var changesInAccount=false, changesForDependentRelations=false;

		changesInAccount = this._fillNewObject(oAccount, oNewAccount, "");
		if(changesInAccount)
			return true;
		
		if(oAccount.category == cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccount = this._fillNewObject(oNewAccount, oNewAccount, "", "personFragment");
		if(oAccount.category != cus.crm.myaccounts.util.Constants.accountCategoryPerson)
			changesInAccount = this._fillNewObject(oNewAccount, oNewAccount, "", "companyFragment");
		
		if(changesInAccount)
			return true;

		changesForDependentRelations = this._changesForDependentRelationsExists();
		if(!changesForDependentRelations)
			return false;
		else
			return true;
	},
	
	_cleanUp: function(){
		this.getView().setModel(null);
		this.setBtnEnabled("saveButton", false);
	},
	
	_setBusy: function(busy){
		this.getView().setBusy(busy);
		if(busy){
			this.setBtnEnabled("saveButton", !busy);
			this.setBtnEnabled("cancelButton", !busy);
		}
		else{
			this._toggleSubmit();
			this.setBtnEnabled("cancelButton", !busy);
		}
	},


	// ############################### address specific methods: ################################################################

	_setCountry: function(countryID, country){
		var countryInput = this.getView().byId("MainAddress.countryInput");
		var countryIDInput = this.getView().byId("MainAddress.countryIDInput");
		
    	var oldCountryID = countryIDInput.getValue();
    	if (oldCountryID != countryID){
    		this._setRegion("", ""); //clear region
    	}
    	
    	countryInput.setValue(country);
    	countryIDInput.setValue(countryID);
    	this._toggleSubmit();

    	//enable address input field
    	this._toggleAddressFields();
	},

	_readCountries: function(callbackCountryRead){
		var that = this;
		this.valueHelpCountry.setModel(new sap.ui.model.json.JSONModel({CountryCustomizing: []}));
		this.oDataModel.read("/CountryCustomizing", null, undefined, true,
			function(oData, oResponse){
				var countryCustomizing = jQuery.parseJSON(JSON.stringify(oData));
				countryCustomizing.results.unshift({country:"", countryID:""});
				that.valueHelpCountry.setModel(new sap.ui.model.json.JSONModel({CountryCustomizing: countryCustomizing.results}));
				if (callbackCountryRead)
					callbackCountryRead.call(that);
			},
			function(oError){
				jQuery.sap.log.error("Read failed in GeneralDateEdit->_readCountries:"+oError.response.body);
			}
		);
	},

	_setRegion: function(regionID, region){
		var regionInput = this.getView().byId("MainAddress.regionInput");
		regionInput.setValue(region);
		var regionIDInput = this.getView().byId("MainAddress.regionIDInput");
    	regionIDInput.setValue(regionID);
    	this._toggleSubmit();
	},

	_readRegions: function(callbackRegionRead){
		var that = this;
		var currentCountryID = this.getView().byId("MainAddress.countryIDInput").getValue();
		
		if(!that.aRegionCallback)
			that.aRegionCallback = [];
		
		if(that.regionReadRunning && callbackRegionRead){
			that.aRegionCallback.push(callbackRegionRead);
			return;
		}

		if(this.countryIDUsedForRegion == currentCountryID){
			if (callbackRegionRead)
				callbackRegionRead.call(that);
			return;
		}
		
		if (callbackRegionRead)
			that.aRegionCallback.push(callbackRegionRead);
		that.regionReadRunning = true;

		this.countryIDUsedForRegion = currentCountryID;
		this.valueHelpRegion.setModel(new sap.ui.model.json.JSONModel({RegionCustomizing: []}));	
		this.oDataModel.read("/RegionCustomizing", null, ["countryID='"+currentCountryID+"'"], true,
			function(oData, oResponse){
				var regionCustomizing = jQuery.parseJSON(JSON.stringify(oData));
				regionCustomizing.results.unshift({region:"", regionID:""});
				that.valueHelpRegion.setModel(new sap.ui.model.json.JSONModel({RegionCustomizing: regionCustomizing.results}));
				that.regionReadRunning = false;
				
				for(var i in that.aRegionCallback)
					that.aRegionCallback[i].call(that);
		},
			function(oError){
				jQuery.sap.log.error("Read failed in GeneralDateEdit->_readRegions: "+oError.response.body);
				that.regionReadRunning = false;
			}
		);
	},

	_toggleAddressFields: function(){
				
		var countryID = this.getView().byId("MainAddress.countryIDInput").getValue();

		if (countryID && countryID != "")
			this._setAddressFieldsEnabled(true);
		else
			this._setAddressFieldsEnabled(false);
	},

	_setAddressFieldsEnabled:function (enabled){
		var oAddressContainer = this.getView().byId("editFormAddress");
		if(!oAddressContainer)
			return;
		var aFormElements = oAddressContainer.getFormElements();
		var viewId = this.getView().getId();
		for(var i in aFormElements){
			var aFields = aFormElements[i].getFields();
			for(var z in aFields){
				var regEx = new RegExp(viewId+"--MainAddress.[A-z0-9]+Input","g");
				var elementId = aFields[z].getId();
				if(elementId == viewId+"--MainAddress.countryInput")
					continue;
				if(regEx.test(elementId))
					aFields[z].setEnabled(enabled);
			}
		}
	},

	// ############################### country value help: ################################################################

	onCountryValueHelpSelected: function(oEvent){
		if (!this.valueHelpCountry) {
			this._createValueHelpCountry();
		   // this.getView().addDependent(this.valueHelpCountry);
		    this._readCountries();
		}
	    this.valueHelpCountry.open();
	},

	_createValueHelpCountry: function(){
		if(!this.valueHelpCountry)
			this.valueHelpCountry = sap.ui.xmlfragment( "cus.crm.myaccounts.view.maintain.ValueHelpCountry", this);
	},

	onCountryValueHelpSearch: function(oEvent){
		var searchValue = oEvent.getParameter("value");
	    var oFilter = new sap.ui.model.Filter("country", sap.ui.model.FilterOperator.Contains, searchValue);
	    oEvent.getSource().getBinding("items").filter([oFilter]);
	},

	onCountryValueHelpClose: function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	    	var oSelectedObject = oSelectedItem.getBindingContext().getObject();
	    	this._setCountry(oSelectedObject.countryID, oSelectedObject.country);
	    }
	    oEvent.getSource().getBinding("items").filter([]);
	},
	
	onCountryValueHelpCancel: function(oEvent){
	    oEvent.getSource().getBinding("items").filter([]);
	},
	
	// ############################### region value help: ################################################################

	onRegionValueHelpSelected: function(oEvent){
		if (!this.valueHelpRegion) {
			this._createValueHelpRegion();
		    //this.getView().addDependent(this.valueHelpRegion);
		}
		this._readRegions();
	    this.valueHelpRegion.open();
	},

	_createValueHelpRegion: function(){
		if(!this.valueHelpRegion)
			this.valueHelpRegion = sap.ui.xmlfragment( "cus.crm.myaccounts.view.maintain.ValueHelpRegion", this);
	},
	
	onRegionValueHelpSearch: function(oEvent){
		var searchValue = oEvent.getParameter("value");
	    var oFilter = new sap.ui.model.Filter("region", sap.ui.model.FilterOperator.Contains, searchValue);
	    oEvent.getSource().getBinding("items").filter([oFilter]);
	},
	
	onRegionValueHelpClose: function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
	    if (oSelectedItem) {
	    	var oSelectedObject = oSelectedItem.getBindingContext().getObject();
	    	this._setRegion(oSelectedObject.regionID, oSelectedObject.region);
	    }
	    oEvent.getSource().getBinding("items").filter([]);
	},

	onRegionValueHelpCancel: function(oEvent){
		oEvent.getSource().getBinding("items").filter([]);
	},
	
	
	// ############################### country suggestion: ################################################################
	
	onCountrySuggest: function(oEvent){
		var countryInput = oEvent.getSource();
		var fnDisplaySuggestion = function(){
			var oModel = this.valueHelpCountry.getModel();
			if(countryInput.getSuggestionItems().length > 0)
				return;
			var aCountries = oModel.getProperty("/CountryCustomizing");
			for(var i=0 in aCountries){
				var oCountry = aCountries[i];
				var oCustomData = new sap.ui.core.CustomData({key:"countryID", value:oCountry.countryID});
				var oItem = new sap.ui.core.Item({text: oCountry.country, customData:oCustomData});
				countryInput.addSuggestionItem(oItem);
			}
		};
		if (!this.valueHelpCountry) {
			this._createValueHelpCountry();
		    this._readCountries(fnDisplaySuggestion);
		}
		else{
			fnDisplaySuggestion.call(this);
		}
	},
	
	onCountrySuggestItemSelected: function(oEvent){
		var oItem = oEvent.getParameter("selectedItem");
		var countryID = null;
		for(var i in oItem.getCustomData()){
			var oCustomData = oItem.getCustomData()[i];
			if (oCustomData.getKey() == "countryID")
				countryID = oCustomData.getValue();
		}
		this._setCountry(countryID, oItem.getText());
	},

	onCountryInputFieldChanged:function (oEvent) {
		this.onInputFieldChanged();
		var countryInput = oEvent.getSource();
		this._setCountry("", countryInput.getValue());
		
		var fnCheckCountry = function(){
			var oModel = this.valueHelpCountry.getModel();
			var aCountries = oModel.getProperty("/CountryCustomizing");
			for(var i=0 in aCountries){
				var oCountry = aCountries[i];
				if (oCountry.country == countryInput.getValue())
					this._setCountry(oCountry.countryID, countryInput.getValue());
			}
		};
		if (!this.valueHelpCountry) {
			this._createValueHelpCountry();
		    this._readCountries(fnCheckCountry);
		}
		else{
			fnCheckCountry.call(this);
		}
	},
	
	// ############################### region suggestion: ################################################################
	
	onRegionSuggest: function(oEvent){
		var regionInput = oEvent.getSource();
		var fnDisplaySuggestion = function(){
			if(this.countryIDUsedForRegionSuggestion == this.countryIDUsedForRegion)
				return;
			this.countryIDUsedForRegionSuggestion = this.countryIDUsedForRegion;
			var oModel = this.valueHelpRegion.getModel();
			var aRegions = oModel.getProperty("/RegionCustomizing");
			regionInput.removeAllSuggestionItems();
			for(var i=0 in aRegions){
				var oRegion = aRegions[i];
				var oCustomData = new sap.ui.core.CustomData({key:"regionID", value:oRegion.regionID});
				var oItem = new sap.ui.core.Item({text: oRegion.region, customData:oCustomData});
				regionInput.addSuggestionItem(oItem);
			}
		};
		if (!this.valueHelpRegion)
			this._createValueHelpRegion();
		
		this._readRegions(fnDisplaySuggestion);
		
	},

	onRegionSuggestItemSelected: function(oEvent){
		var oItem = oEvent.getParameter("selectedItem");
		var regionID = null;
		for(var i in oItem.getCustomData()){
			var oCustomData = oItem.getCustomData()[i];
			if (oCustomData.getKey() == "regionID")
				regionID = oCustomData.getValue();
		}
		this._setRegion(regionID, oItem.getText());
	},

	onRegionInputFieldChanged:function (oEvent) {
		this.onInputFieldChanged();
		var regionInput = oEvent.getSource();
		this._setRegion("", regionInput.getValue());
		
		var fnCheckRegion = function(){
			var oModel = this.valueHelpRegion.getModel();
			var aRegions = oModel.getProperty("/RegionCustomizing");
			for(var i=0 in aRegions){
				var oRegion = aRegions[i];
				if (oRegion.region == regionInput.getValue()){
					this._setRegion(oRegion.regionID, regionInput.getValue());
				}
					
			}
		};
		if (!this.valueHelpRegion) {
			this._createValueHelpRegion();
		    this._readRegions(fnCheckRegion);
		}
		else{
			fnCheckRegion.call(this);
		}
	},
	
	// ############################### customizing for title and academic title: ################################################################
	
	_readCustomizing: function(callbackCountryRead){
		
	},

	// ############################### redefinition of framework methods: ################################################################
	getHeaderFooterOptions: function(){
		var that = this;
		return {
			sI18NFullscreenTitle : "DETAIL_TITLE",
			buttonList : [
				{
					sI18nBtnTxt : "BUTTON_SAVE",
					sId : "saveButton",
					onBtnPressed : jQuery.proxy(this.onSaveButtonPressed, this),
					bDisabled : "true"
				},
				{
					sI18nBtnTxt : "BUTTON_CANCEL",
					sId : "cancelButton",
					onBtnPressed : jQuery.proxy(this.onCancelButtonPressed, this),
				},
			],
			onBack : function(oEvent) {
				that.onCancelButtonPressed();
			},
                             
		};
	},	
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.maintain.GeneralDataEdit
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.maintain.GeneralDataEdit
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.maintain.GeneralDataEdit
*/
//	onExit: function() {
//
//	}

});

},
	"cus/crm/myaccounts/view/maintain/GeneralDataEdit.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:layout="sap.ui.layout" xmlns:form="sap.ui.layout.form"\n\t\t\tcontrollerName="cus.crm.myaccounts.view.maintain.GeneralDataEdit" xmlns:html="http://www.w3.org/1999/xhtml" id="editView">\n\t <Page showNavButton="true">\n        <content>\n\t        <layout:Grid defaultSpan="L12 M12 S12" width="auto">\n\t            <layout:content>\n\t\t            <core:ExtensionPoint name="extEditForm">\n\t\t\t\t        <form:Form class="sapUiFormEdit sapUiFormEdit-CTX">\n\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t<form:ResponsiveGridLayout xmlns:form="sap.ui.layout.form"\n\t\t\t\t\t\t\t\t\tlabelSpanL="4" \n\t\t\t\t\t\t\t\t\tlabelSpanM="4" \n\t\t\t\t\t\t\t\t\temptySpanL="3" \n\t\t\t\t\t\t\t\t\temptySpanM="2" \n\t\t\t\t\t\t\t\t\tcolumnsL="1"\n\t\t\t\t\t\t\t\t\tcolumnsM="1"\n\t\t\t\t\t\t\t\t\tclass="editableForm">\n\t\t\t\t\t\t\t\t</form:ResponsiveGridLayout>\n\t\t\t\t\t\t\t</form:layout>\t\t\n\t\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t\t<form:FormContainer />\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extEditFormTop"/> \n\t\t\t\t\t\t\t\t<form:FormContainer title="{i18n>GENERAL_DATA}" visible="{parts:[\'category\', \'constants>/accountCategoryPerson\'], formatter: \'cus.crm.myaccounts.util.formatter.isUnequal\'}">\n\t\t\t\t\t\t\t\t\t<form:formElements >\n\t\t\t\t\t\t\t\t\t\t<core:Fragment id="companyFragment" fragmentName="cus.crm.myaccounts.view.maintain.GeneralDataEditCompany" type="XML" />\n\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t\t<form:FormContainer title="{i18n>GENERAL_DATA}" visible="{parts:[\'category\', \'constants>/accountCategoryPerson\'], formatter: \'cus.crm.myaccounts.util.formatter.isEqual\'}">\n\t\t\t\t\t\t\t\t\t<form:formElements >\n\t\t\t\t\t\t\t\t\t\t<core:Fragment id="personFragment" fragmentName="cus.crm.myaccounts.view.maintain.GeneralDataEditPerson" type="XML" />\n\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t</form:FormContainer>\t\t\t\t\t\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extEditFormMiddle"/>\n\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t</form:Form>\t\n\t\t\t\t\t\t<form:Form class="sapUiFormEdit sapUiFormEdit-CTX">\n\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t<form:ResponsiveGridLayout xmlns:form="sap.ui.layout.form"\n\t\t\t\t\t\t\t\t\tlabelSpanL="4" \n\t\t\t\t\t\t\t\t\tlabelSpanM="4" \n\t\t\t\t\t\t\t\t\temptySpanL="3" \n\t\t\t\t\t\t\t\t\temptySpanM="2" \n\t\t\t\t\t\t\t\t\tcolumnsL="1"\n\t\t\t\t\t\t\t\t\tcolumnsM="1"\n\t\t\t\t\t\t\t\t\tclass="editableForm">\n\t\t\t\t\t\t\t\t</form:ResponsiveGridLayout>\n\t\t\t\t\t\t\t</form:layout>\t\n\t\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t\t<form:FormContainer title="{i18n>ADDRESS}" id="editFormAddress">\n\t\t\t\t\t\t\t\t\t<form:formElements >\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>COUNTRY}" id="MainAddress.countryLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t  \t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input\n\t\t\t\t\t\t\t\t\t\t\t        id="MainAddress.countryInput"\n\t\t\t\t\t\t\t\t\t\t\t        value="{MainAddress/country}"\n\t\t\t\t\t\t\t\t\t\t\t        type="Text"\n\t\t\t\t\t\t\t\t\t\t\t        placeholder=""\n\t\t\t\t\t\t\t\t\t\t\t        enabled="true"\n\t\t\t\t\t\t\t\t\t\t\t        editable="true"\n\t\t\t\t\t\t\t\t\t\t\t        showValueHelp="true"\n\t\t\t\t\t\t\t\t\t\t\t        valueHelpOnly="false"\n\t\t\t\t\t\t\t\t\t\t\t        valueHelpRequest="onCountryValueHelpSelected"\n\t\t\t\t\t\t\t\t\t\t\t        showSuggestion = "true"\n\t\t\t\t\t\t\t\t\t\t\t        suggest="onCountrySuggest"\n\t\t\t\t\t\t\t\t\t\t\t        suggestionItemSelected = "onCountrySuggestItemSelected"\n\t\t\t\t\t\t\t\t\t\t\t        liveChange="onCountryInputFieldChanged"/>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input id="MainAddress.countryIDInput" value="{MainAddress/countryID}" type="Text" visible="false"/>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>REGION}" id="MainAddress.regionLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t  \t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input\n\t\t\t\t\t\t\t\t\t\t\t        id="MainAddress.regionInput"\n\t\t\t\t\t\t\t\t\t\t\t        value="{MainAddress/region}"\n\t\t\t\t\t\t\t\t\t\t\t        type="Text"\n\t\t\t\t\t\t\t\t\t\t\t        placeholder=""\n\t\t\t\t\t\t\t\t\t\t\t        editable="true"\n\t\t\t\t\t\t\t\t\t\t\t        showValueHelp="true"\n\t\t\t\t\t\t\t\t\t\t\t        valueHelpOnly="false"\n\t\t\t\t\t\t\t\t\t\t\t        valueHelpRequest="onRegionValueHelpSelected"\n\t\t\t\t\t\t\t\t\t\t\t        showSuggestion = "true"\n\t\t\t\t\t\t\t\t\t\t\t        suggest="onRegionSuggest"\n\t\t\t\t\t\t\t\t\t\t\t        suggestionItemSelected = "onRegionSuggestItemSelected"\n\t\t\t\t\t\t\t\t\t\t\t        liveChange="onRegionInputFieldChanged"/>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input id="MainAddress.regionIDInput" value="{MainAddress/regionID}" type="Text" visible="false"/>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'i18n>POSTAL_CODE\'},{path:\'i18n>CITY\'}], formatter: \'cus.crm.myaccounts.util.formatter.sleshSeparator\'}" id="MainAddress.postcodeLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t  \t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input value="{MainAddress/postcode}" maxLength="40" id="MainAddress.postcodeInput" liveChange="onInputFieldChanged">\n\t\t\t\t\t\t\t\t\t\t\t       \t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t           \t<layout:GridData span="L1 M2 S5"/>\n\t\t\t\t\t\t\t\t\t\t\t       \t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t   \t</Input>\n\t\t\t\t\t\t\t\t\t\t\t   \t<Input value="{MainAddress/city}" maxLength="40" id="MainAddress.cityInput" liveChange="onInputFieldChanged">\n\t\t\t\t\t\t\t\t\t\t\t       \t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t           \t<layout:GridData span="L4 M4 S7"/>\n\t\t\t\t\t\t\t\t\t\t\t       \t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t   \t</Input>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{parts:[{path:\'i18n>STREET\'},{path:\'i18n>HOUSE_NUMBER\'}], formatter: \'cus.crm.myaccounts.util.formatter.sleshSeparator\'}" id="MainAddress.streetLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t  \t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input value="{MainAddress/street}" maxLength="40" id="MainAddress.streetInput" liveChange="onInputFieldChanged">\n\t\t\t\t\t\t\t\t\t\t\t       \t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t           \t<layout:GridData span="L4 M4 S9"/>\n\t\t\t\t\t\t\t\t\t\t\t       \t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t   \t</Input>\n\t\t\t\t\t\t\t\t\t\t\t   \t<Input value="{MainAddress/houseNumber}" maxLength="40" id="MainAddress.houseNumberInput" liveChange="onInputFieldChanged">\n\t\t\t\t\t\t\t\t\t\t\t       \t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t           \t<layout:GridData span="L1 M2 S3"/>\n\t\t\t\t\t\t\t\t\t\t\t       \t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t   \t</Input>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement visible="{parts:[\'category\', \'constants>/accountCategoryPerson\'], formatter: \'cus.crm.myaccounts.util.formatter.isEqual\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>MOBILE}" id="MainAddress.mobilePhoneLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input value="{MainAddress/mobilePhone}" maxLength="40" id="MainAddress.mobilePhoneInput" liveChange="onInputFieldChanged"/>\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>PHONE}" id="MainAddress.phoneLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input value="{MainAddress/phone}" maxLength="40" id="MainAddress.phoneInput" liveChange="onInputFieldChanged" />\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>EMAIL}" id="MainAddress.emailLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input value="{MainAddress/email}" maxLength="40" id="MainAddress.emailInput" liveChange="onInputFieldChanged" />\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>WEBSITE}" id="MainAddress.websiteLabel" width="100%" />\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Input value="{MainAddress/website}" maxLength="40" id="MainAddress.websiteInput" liveChange="onInputFieldChanged" />\n\t\t\t\t\t\t\t\t\t   \t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extEditFormAddress"/>\n\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="extEditFormBottom"/>\n\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t</form:Form>\n\t\t\t\t\t</core:ExtensionPoint>\t\n\t\t\t\t</layout:content>\n\t        </layout:Grid>\n        </content>\n    </Page>\n</core:View>\n'
}});
