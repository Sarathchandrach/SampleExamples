jQuery.sap.registerPreloadedModules({
"name":"cus/crm/notes/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/notes/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.notes.Component");
jQuery.sap.require("cus.crm.notes.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.notes.Component", {
	
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Master Detail Sample",
		"version" : "1.0.0",
		"library" : "cus.crm.notes",
		"includes" : ["css/style.css"],  
		"dependencies" : { 
			"libs" : [ 
				"sap.m",
				"sap.me"
			],  
			"components" : [ 
			]/*, 
			"ui5version" : "1.16.3-SNAPSHOT"*/
		},
		"config" : {
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" : "SHELL_TITLE",
			"icon" : "sap-icon://Fiori2/F0006",
            "favIcon":"./resources/sap/ca/ui/themes/base/img/favicon/F0006_My_Notes.ico",
			"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0006_My_Notes/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
			"startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
			"startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
			"startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
			"startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
			"startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
			"startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
		},
		
		viewPath : "cus.crm.notes.view",
		
	}),

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {component: this};

		return sap.ui.view({
			viewName : "cus.crm.notes.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},    
	
	/**
	 * Check if there are unsynchronized batch operations, which must be finished.
	 * The user will be prompted and can cancel the unload event.
	 * @param oEvent
	 * @returns {String}
	 */
	onWindowBeforeUnload : function(oEvent) {
		//Singleton object of the model handler
		this.oModelHandler = new cus.crm.notes.handler.ModelHandler();
		
		if(this.oModelHandler.hasBatchOperations()) {
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			
			//TODO: This is a workaround, because it is unclear where the translation model is stored at this point in time
			var oTranslationModel = new sap.ui.model.resource.ResourceModel({
                bundleUrl : jQuery.sap.getModulePath("cus.crm.notes.i18n.i18n", ".properties"),
				bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
			});			
			
			//Will be called when the batch operations are finished
			this.oModelHandler.emptyBatchCallback = jQuery.proxy(
					function() {
						this.oModelHandler.emptyBatchCallback = function() {
						}; // clear function
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						sap.m.MessageToast.show( oTranslationModel.getResourceBundle().getText("MSG_SYNCHRONIZATION_SUCCEEDED"), {
							at: sap.ui.core.Popup.Dock.CenterCenter
						});
						//TODO: Re-execution of the original leave event possible (the event data is stored in oEvent)? 
					}, this);
			
			//Show data loss pop up with this given string
			return oTranslationModel.getResourceBundle().getText("MSG_SYNCHRONIZATION_ONGOING");
		}		
	}
});

},
	"cus/crm/notes/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.notes.Configuration", {

    oServiceParams: {
        serviceList: [
            {
                name: "CRM_NOTES",
                masterCollection: "NoteHeaders",
                serviceUrl: URI("/sap/opu/odata/sap/CRM_NOTES/").directory(),
                countSupported: false,
 //               useBatch: true,
                isDefault: true,
                mockedDataSource: "model/metadata.xml"
            }
        ]
    },    

    getServiceParams: function () {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function () {
        return this.oServiceParams.serviceList;
    },

    getMasterKeyAttributes: function () {
        return ["NoteGuid"];
    }
});

},
	"cus/crm/notes/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.notes.Main", {

	onInit : function() {
		jQuery.sap.require("cus.crm.notes.util.Formatter");
		jQuery.sap.require("cus.crm.notes.util.DomHelper");		
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		
		sap.ca.scfld.md.Startup.init('cus.crm.notes', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		// exit cleanup code here
	}
});
},
	"cus/crm/notes/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\r\n\txmlns="sap.m" controllerName="cus.crm.notes.Main" xmlns:html="http://www.w3.org/1999/xhtml"\r\n\txmlns:form="sap.ui.form" height="100%">\r\n\t<NavContainer id="fioriContent" showHeader="false"/>\r\n</core:View>',
	"cus/crm/notes/control/SectionList.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.control.SectionList");

sap.m.List.extend("cus.crm.notes.control.SectionList", {
	
	onAfterRendering: function(evt){
		
	    // set height of TextAreas to actual test height
//		var domRefSectionList = this.getDomRef();
//        var textareas = $(domRefSectionList).find("textarea");
//        for (var i = 0; i < textareas.length; i++){
//        	textareas[i].style.height = textareas[i].scrollHeight + 'px';
//        	textareas[i].style.overflow = "hidden";
//        	//$(textareas[i]).addClass("sapMBusyDialogSimple");
//        	//$(textareas[i]).addClass("sapUiTxtA");
//        	textareas[i].style.border = "none";
//        	textareas[i].style.resize = "none";
//        } 
	
	},
	
	renderer : "sap.m.ListRenderer",	
	
});
},
	"cus/crm/notes/control/SectionTextArea.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.control.SectionTextArea");

sap.m.TextArea.extend("cus.crm.notes.control.SectionTextArea", {
	
	 metadata:{
	      events: {
	          "merge" : {}
	      }  
	    },
	
	onAfterRendering : function(evt){
		var oListItem = this.getParent();
		var oList = oListItem.getParent();
		
		if (sap.m.TextArea.prototype.onAfterRendering) {   // check whether superclass has an onAfterRendering() method
            sap.m.TextArea.prototype.onAfterRendering.apply(this, evt);  // call super.onAfterRendering()
         }
		
		if (oList.indexOfItem(oListItem) === 0){
			this.setPlaceholder(this.getModel("i18n").getResourceBundle().getText("SECTION_NO_DATA_TEXT"));
		};
		
		var domRefTextArea = this.getDomRef();
        var textarea = $(domRefTextArea).find("textarea");

        if(textarea[0].scrollHeight) {
        	textarea[0].style.height = textarea[0].scrollHeight + 'px';
        }
     
        textarea[0].style.overflow = "hidden";
        if(jQuery.browser.mozilla){
	        textarea[0].style.paddingTop = "0px";
	        textarea[0].style.paddingBottom = "0px";        
	    }
        $(textarea[0]).addClass("customNoteSection");
	},
	
	onsapbackspace : function(evt){
	
		var textarea = this.$().find("textarea");
		var bIsSelection = textarea[0].selectionStart != textarea[0].selectionEnd;
    	if (textarea.cursorPos() === 0 && !bIsSelection){
    		evt.preventDefault();
    		this.fireMerge({originalEvent: evt, Key: "backspace"});
    	}
		
	},
	
	onsapdelete : function(evt){
		var textLength = this.getValue().length;
		var cursorPos = this.$().find("textarea").cursorPos();
    	if (cursorPos === textLength){
    		evt.preventDefault();
    		this.fireMerge({originalEvent: evt, Key: "delete"});
    	}
		
	},
	
	renderer : "sap.m.TextAreaRenderer"
});

},
	"cus/crm/notes/handler/ModelHandler.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.handler.ModelHandler");
jQuery.sap.require("cus.crm.notes.util.Util");

sap.ui.base.ManagedObject.extend("cus.crm.notes.handler.ModelHandler", {
	
	oDataModel: {},
	oJSONModel : {}, //current local JSON model (for the current sContextBindingPath) which will be synchronized with the backend
	oJSONModels : [], //local map of JSON models (the map key is the context path of note)
	aBatchStacks : [], //stack for asynchronous processing of batch operations
	isProcessing : false, //flag if the batch process is currently running, prevents parallel processing of the batch stack. 
	sContextBindingPath : "", //Context binding path of the current view
	globalStepSize : 100, //sequence number range between the sections
	maxSequenceNumber: 9999, //sequence number has 4 digits in backend system
	retryWaitingTime : 5000, //Waiting time for a retry of the batch process
	batchOperationsWaitingTime : 100, //the waiting time until the batch process will call itself (in ms)
	maxRetryBatchOperations : 10, //max. retries of batch processing in case of network errors
	retryBatchOperationsCount : 0, //will be count to maxRetryBatchOperations and will then be reset to 0
	retrySuccessFunction : null, //this function will be called after a retry of the batch process if this was successful
	stopBatchProcessing : false, //If this is set to true the batch processing will be stopped
	
	/**
	 * This constructor uses the Singleton Pattern
	 */
	constructor : function() {
	    if (typeof cus.crm.notes.handler.ModelHandler.__instance === "object") {
	        return cus.crm.notes.handler.ModelHandler.__instance;
	    }
	    
		//All coding from this point will only be called on initial creation due to the singleton pattern.	    
		cus.crm.notes.handler.ModelHandler.__instance = this;
		
		//setInterval can be also used, but will be slower cause of the waiting time and leads to parallel threads.
		//Functions, which call themselves have only one running thread at a time. 
		setTimeout(jQuery.proxy(this.processBatchOperations, this), this.batchOperationsWaitingTime);
	},
	
	addBatchOperations : function(aBatchOperations) {
		this.aBatchStacks.push(aBatchOperations);
	},
	
	getFirstBatchOperations : function() {
		if(this.aBatchStacks.length == 0) {
			return null;
		}
				
		return this.aBatchStacks[0];
	},
	
	hasBatchOperations : function() {
		if(this.aBatchStacks.length == 0) {
			return false;
		}
				
		return true;
	},
	
	deleteFirstBatchOperations : function() {
		if(this.aBatchStacks.length > 0) {
			this.aBatchStacks.shift();	
		}
	},
		
	retryBatchOperations : function(fnSuccess) {		
		this.retrySuccessFunction = fnSuccess;
		this.isProcessing = false;
	},
	
	discardBatchOperations : function(fnSuccess) {
		this.aBatchStacks.length = 0;
		this.isProcessing = false;		
		
		//The changes were discarded, so the current state will be loaded from the backend to replace the changes in the JSON Model 
		//TODO In case of a network loss, the model refresh will also not work. Better remove this refresh? The user will still see the unsaved changes from the JSON model.
		this.readSections();
		
		fnSuccess.apply(this);
	},
	
	updateBatchOperations : function() {
        for (var i = 0; i < this.aBatchStacks.length; i++) {
            var aBatchOperations = this.aBatchStacks[i];
            
            for (var j = 0; j < aBatchOperations.length; j++) {
	            //Note section
	            if(aBatchOperations[j].requestUri.indexOf("NoteSections") == 0) {
	            	//Update or Delete             
		            if (aBatchOperations[j].method === "PUT" || aBatchOperations[j].method === "DELETE") {
		            	//As the section guid could be set afterwards, just update the requestUri with the reference object "data" from the JSON Model   
		            	aBatchOperations[j].requestUri = "NoteSections(SectionGuid='" + aBatchOperations[j].data.SectionGuid + "',NoteGuid='" + aBatchOperations[j].data.NoteGuid + "')";
		            }
	            }
            }
        }
	},
	
	/**
	 * This function will call itself asynchronously as last action. 
	 * This will ensure, that only one "process" of this function is executed at every single time.
	 */
	processBatchOperations : function() {
		try {
			//TODO Can be changed to get all current batch operations without a SectionGuid to reduce backend calls (performance optimizations)			
			var aBatchOperations = this.getFirstBatchOperations();
			
			if(aBatchOperations){				
				if(!this.isProcessing) {		
					this.isProcessing = true;
					
					//Asynchronous call because of performance reasons. 
					//First Parameter is the onSuccess Callback. Second Parameter is the onError Callback.
					try {
						//TODO It is not clear why the function addBatchChangeOperations works not directly with the variable aBatchOperations
						for (var i = 0; i < aBatchOperations.length; i++) {
							//aBatchOperations is available due to a closure!
							this.oDataModel.addBatchChangeOperations([aBatchOperations[i]]);
						}
	
						//Asynchronous call because of performance reasons
						//First Parameter is the onSuccess Callback. Second Parameter is the onError Callback.
						this.oDataModel.submitBatch(jQuery.proxy(this.processBatchResults, this), jQuery.proxy(this.handleNetworkError, this), true);
					} catch(e) {
						this.handleBatchOperationException(e);
					}
				}
			}else{
				//Batch is empty
				this.emptyBatchCallback();
			}
		} catch(e) {
			this.handleBatchOperationException(e);
		} finally {			
			//Call the next iteration of the processing.
			if (!this.stopBatchProcessing){
				setTimeout(jQuery.proxy(this.processBatchOperations, this), this.batchOperationsWaitingTime);
			}
		}
	},
	
	processBatchResults : function(oData, oResponse, aErrorResponses) {
		try {
			//TODO Check for error responses
			if(aErrorResponses && aErrorResponses.length > 0) {
				if(aErrorResponses[0].response.statusCode=="412")
					{
					//this.os3Controller.refreshDialog();
				   
					 cus.crm.notes.util.Util.show412ErrorDialog(this,
                            	jQuery.proxy(function(){
                            			cus.crm.notes.util.Util.refreshHeaderETag(this.sContextBindingPath,this.os3Controller); 
                            			this.oJSONModel.refresh();
                            			this.readSections();
                            			this.os3Controller.refreshDetailTitle();
                            		 },this));
					}
				else
				this.handleBatchResultsError(aErrorResponses);
				return;
			}
			
			if(oData.__batchResponses[0].__changeResponses[0].statusCode=="204" && this.isTeaserTextUpdate)
				{
				 var aBatchOperations = [];
				 var oBatchOperation = this.oDataModel.createBatchOperation("", "PUT",this.oSection);
				 oBatchOperation.requestUri = "NoteSections(SectionGuid='" + this.oSection.SectionGuid + "',NoteGuid='" + this.oSection.NoteGuid + "')";
			        
			        aBatchOperations.push(oBatchOperation);
			        this.addBatchOperations(aBatchOperations);
			        this.isTeaserTextUpdate = false;
				}
	
			var aBatchOperations = this.getFirstBatchOperations();	
	
			for (var i = 0; i < aBatchOperations.length; i++) {
				//TODO Check for status
				if (oData.__batchResponses[i].__changeResponses[0].statusCode != "201") {
					
				}
				
				//Note section
				if(aBatchOperations[i].requestUri.indexOf("NoteSections") == 0) {
					//Create          
					if (aBatchOperations[i].method === "POST") {
						//Finish the creation of a section with updating the newly created section guid.
						//This will also change the section guid of the JSON Model (by Reference)
						aBatchOperations[i].data.SectionGuid = oData.__batchResponses[i].__changeResponses[0].data.SectionGuid;	
					}
				}
			}
			
			this.deleteFirstBatchOperations();
			this.updateBatchOperations();
			this.oDataModel.refresh();
			this.oJSONModel.refresh();
			
			//Enable the processing again
			this.isProcessing = false;
			
			if(this.retrySuccessFunction) {
				this.retrySuccessFunction.apply(this);
				this.retrySuccessFunction = null;
			}
		} catch(e) {
			this.handleBatchResultsException(e);
		}
	},
	
	/**
	 * This function should be overwritten by the using controller.
	 */
	emptyBatchCallback : function() {		
	},
	
	/**
	 * This function should be overwritten by the using controller.
	 */
	networkErrorCallback : function(sErrorMessage) {
		this.retryBatchOperations();
	},
	
	handleNetworkError : function(oError) {
		if(this.retryBatchOperationsCount <= this.maxRetryBatchOperations) {
			this.retryBatchOperationsCount++;
			this.batchOperationsWaitingTime = this.retryWaitingTime;
			this.retryBatchOperations();
		} else {
			this.retryBatchOperationsCount = 0;
			this.batchOperationsWaitingTime = 100;
			
			var sErrorMessage = oError.message;
			
			if(oError.response) {
				sErrorMessage += " - " + oError.response.statusText;
			}
			
			this.networkErrorCallback(sErrorMessage);
		}	
	},
	
	/**
	 * This function should be overwritten by the using controller.
	 */
	exceptionCallback : function(sErrorMessage) {
		this.discardBatchOperations();
	},
	
	handleBatchOperationException : function(oException) {
		this.exceptionCallback(oException.message);
	},
	
	handleBatchResultsException : function(oException) {
		this.exceptionCallback(oException.message);
	},
	
	handleBatchResultsError : function(aErrorResponses) {
		var sErrorMessage = aErrorResponses[0].message;
		
		if(aErrorResponses[0].response) {
			sErrorMessage += " - " + aErrorResponses[0].response.statusText;
		}
		
		this.exceptionCallback();
	},
    
    attachView : function(sNoteHeadersPath, oView) {
		this.sContextBindingPath = sNoteHeadersPath;
		this.oView=oView;
		//TODO: do we need to finalize batch queue first?
		this.oDataModel = oView.getModel();
		this.oJSONModel = this.oJSONModels[this.sContextBindingPath];
		
		//Check if the local JSON model was already loaded, otherwise create it and get the data from the backend 
		if(!this.oJSONModel){		
			this.oJSONModel = new sap.ui.model.json.JSONModel();
			
			this.oJSONModels[this.sContextBindingPath] = this.oJSONModel;
			
			//The local JSON model did not exist for the current note, so the sections need to be loaded from the backend
			this.readSections();
		}
    	    	
    	//TODO Is setBindingContext really necessary? I need it at least to get the NoteGuid
		oView.setBindingContext(new sap.ui.model.Context(this.oDataModel, '/' + this.sContextBindingPath));
		var sNoteGuid = oView.getBindingContext().getProperty("NoteGuid");	
		
		if (sNoteGuid) {
		   // add empty section for new notes, i.e. if note does not have a section yet
		   if (this.oJSONModel.getData().navNoteSection.length === 0){
			   this.createFirstSection(sNoteGuid);
		   }
        }
		
    	oView.setModel(this.oJSONModel, "json");
    },	

    injectFirstSectionFromMaster : function(oModel, sNoteGuid) {
    	var sNoteHeadersPath = "NoteHeaders('" + sNoteGuid + "')";
		this.oDataModel = oModel;
		this.oJSONModel = new sap.ui.model.json.JSONModel({ navNoteSection:[] });
		this.oJSONModels[sNoteHeadersPath] = this.oJSONModel;
	   // add empty section for new notes, i.e. if note does not have a section yet
	   this.createFirstSection(sNoteGuid);
    },	

    /**
     * Read data from the backend (due the odata model) by the given read path
     * @param sReadPath
     * @param oUrlParams these parameters will be added to the odata service call URL
     */
	read : function(sReadPath, oUrlParams) {
		//TODO Is this context really needed? Maybe set the context binding path directly in the read path
		var context = new sap.ui.model.Context(this.oDataModel, '/' + this.sContextBindingPath);

		//this.readCompleted will be called synchronously with the parameter sReadPath
		this.oDataModel.read(sReadPath, context, oUrlParams, false, jQuery.proxy(this.readCompleted, this, sReadPath));
	},
	
	/**
	 * Will be called after a successful read of the backend data
	 * @param sPath
	 * @param oData
	 */
	readCompleted : function (sPath, oData) {		
		if(sPath)
		{
			//Dynmically set the variable by the name given in the parameter "sPath" with the value "oData.results"		
			switch (sPath) {
			case "navNoteSection":
				oData.navNoteSection=oData.results;
				break;
			default:
				break;
			}
		}		
		
		//TODO Check if the model needs to be refreshed first
		this.oJSONModel.setData(oData);
		this.oJSONModel.updateBindings();
    },
    
    createSection : function(sNoteGuid, sContentText) {    	
    	var aBatchOperations = [];
    	var updateTeaserTextOperation = undefined;
    	var oSection = {
    			NoteGuid : sNoteGuid,
    			ContentType : "T",
    			ContentText : sContentText,
    			SequenceNumber : this.getLastSectionSequenceNumber()
    	};
    	
    	this.oJSONModel.getData().navNoteSection.push(oSection);
        this.oJSONModel.refresh();
        
        if(this.oJSONModel.getData().navNoteSection.indexOf(oSection) == 0) {        	
        	updateTeaserTextOperation = this.updateTeaserText();
        	if (updateTeaserTextOperation !== undefined){
        		aBatchOperations.push(updateTeaserTextOperation);
        	}
        }
              
        aBatchOperations.push(this.oDataModel.createBatchOperation("/NoteSections", "POST", oSection));  
        
        this.addBatchOperations(aBatchOperations);      
    },
    
    readSections : function() {
		//These parameters will be added to the url in the following read request
		var oUrlParams = {
//			$expand : "navAttachment"	
		};
		
		//The sections need to be loaded from the backend
		this.read("navNoteSection", oUrlParams);
    },
    
    updateSection : function(sBindingPath, sContentText,oETag,os3Controller) {
    	this.os3Controller=os3Controller;
        var oSection = this.oJSONModel.getProperty(sBindingPath);  
        this.oSection=oSection;
        var aBatchOperations = [];
        var updateTeaserTextOperation = undefined;
        
        // oSection includes the property navAttachment, which must not be passed to a PUT operation of a NoteSection
//        delete oSection.navAttachment; 
        
        //This is undefined, when the changes are directly entered into the text field (Cause of the json binding)
        if(sContentText) {
        	oSection.ContentText = sContentText;
        }
        
        if(this.oJSONModel.getData().navNoteSection.indexOf(oSection) == 0) {
        	updateTeaserTextOperation = this.updateTeaserText(oETag);
        	if (updateTeaserTextOperation !== undefined){
        		this.isTeaserTextUpdate = true;
        		aBatchOperations.push(updateTeaserTextOperation);
        	}
        }        
  
        var oBatchOperation = this.oDataModel.createBatchOperation("", "PUT", oSection);
        
        if(!this.isTeaserTextUpdate){
        //TODO Maybe use this Uri from the oDataModel
        oBatchOperation.requestUri = "NoteSections(SectionGuid='" + oSection.SectionGuid + "',NoteGuid='" + oSection.NoteGuid + "')";
        
        aBatchOperations.push(oBatchOperation);
        }
        
        this.addBatchOperations(aBatchOperations);
    },
    
    deleteSections : function(aBindingPaths) {
    	var oDeleteOperation = null;    	
    	var aBatchOperations = [];
    	var oSection = null;
    	var index = null;
    	var updateTeaserTextOperation = undefined;
    	
    	if(aBindingPaths && aBindingPaths.length > 0){
	    	for (var i = 0; i < aBindingPaths.length; i++) {
	    		oSection = this.oJSONModel.getProperty(aBindingPaths[i]);    		
	    		index = this.oJSONModel.getData().navNoteSection.indexOf(oSection);	    		
	    		this.oJSONModel.getData().navNoteSection.splice(index,1);
	    			    		
	    		//TODO Do not update this everytime, do it only once!
	            if(index == 0) {
	            	updateTeaserTextOperation = this.updateTeaserText();
	            	if (updateTeaserTextOperation !== undefined){
	            		aBatchOperations.push(updateTeaserTextOperation);
	            	}
	            }
	            
	           // delete oSection.navAttachment;
	    		
	    		oDeleteOperation = this.oDataModel.createBatchOperation("", "DELETE", oSection);
	    		
	    		//TODO Maybe use this Uri from the oDataModel    		
	    		oDeleteOperation.requestUri = "NoteSections(SectionGuid='" + oSection.SectionGuid + "',NoteGuid='" + oSection.NoteGuid + "')";	           
	            aBatchOperations.push(oDeleteOperation);
	    	}

            this.oJSONModel.refresh();
    		this.addBatchOperations(aBatchOperations); 
    	}
    },

    splitSection : function(sBindingPath, iSplitPosition) {    	
    	var oSection = this.oJSONModel.getProperty(sBindingPath);  	
    	var upperText = oSection.ContentText.substring(0,iSplitPosition);
        var lowerText = oSection.ContentText.substring(iSplitPosition+2, oSection.ContentText.length);
        var newSequenceNumber = this.getSectionSequenceNumber(oSection.SequenceNumber);
    	var aBatchOperations = [];
    	var updateTeaserTextOperation = undefined;
    	
        // oSection includes the property navAttachment, which must not be passed to a PUT operation of a NoteSection
        //delete oSection.navAttachment; 
        
        oSection.ContentText = upperText;
        
        if(this.oJSONModel.getData().navNoteSection.indexOf(oSection) == 0) {
        	updateTeaserTextOperation = this.updateTeaserText();
        	if (updateTeaserTextOperation !== undefined){
        		aBatchOperations.push(updateTeaserTextOperation);
        	}
        }
        
        var oNewSection = {
        		NoteGuid : oSection.NoteGuid,
            	ContentType : "T",
            	ContentText : lowerText,
            	SequenceNumber : newSequenceNumber,
        };
    	
    	this.oJSONModel.getData().navNoteSection.push(oNewSection);
       	this.oJSONModel.getData().navNoteSection.sort(this.sectionSorter);
        this.oJSONModel.refresh();          
        
        var oUpdateBatchOperation = this.oDataModel.createBatchOperation("", "PUT", oSection);
        oUpdateBatchOperation.requestUri = "NoteSections(SectionGuid='" + oSection.SectionGuid + "',NoteGuid='" + oSection.NoteGuid + "')";     
        
        aBatchOperations.push(oUpdateBatchOperation);
        
        var oCreateBatchOperation = this.oDataModel.createBatchOperation("/NoteSections", "POST", oNewSection);       
        aBatchOperations.push(oCreateBatchOperation);
        
        this.addBatchOperations(aBatchOperations);        
    },
    
    /**
     * The second section will be deleted.
     * 
     * @param sFirstBindingPath
     * @param sSecondBindingPath
     */
    mergeSection : function(sFirstBindingPath, sSecondBindingPath){
    	var oFirstSection = this.oJSONModel.getProperty(sFirstBindingPath);  	
    	var oSecondSection = this.oJSONModel.getProperty(sSecondBindingPath);  	
    	var aBatchOperations = [];
    	var updateTeaserTextOperation = undefined;
    	
    	oFirstSection.ContentText = oFirstSection.ContentText + oSecondSection.ContentText; 

		// oSection includes the property navAttachment, which must not be passed to a PUT operation of a NoteSection
    	//delete oFirstSection.navAttachment;
    	//delete oSecondSection.navAttachment;
    	
    	var index = this.oJSONModel.getData().navNoteSection.indexOf(oSecondSection); 

    	this.oJSONModel.getData().navNoteSection.splice(index,1);
    	this.oJSONModel.refresh();
    	
    	if(this.oJSONModel.getData().navNoteSection.indexOf(oFirstSection) == 0) {
    		updateTeaserTextOperation = this.updateTeaserText();
        	if (updateTeaserTextOperation !== undefined){
        		aBatchOperations.push(updateTeaserTextOperation);
        	}
    	}

    	var oBatchOperation = this.oDataModel.createBatchOperation("", "PUT", oFirstSection);
    	
    	//TODO Maybe use this Uri from the oDataModel
    	oBatchOperation.requestUri = "NoteSections(SectionGuid='" + oFirstSection.SectionGuid + "',NoteGuid='" + oFirstSection.NoteGuid + "')";		
    	aBatchOperations.push(oBatchOperation);
    	
    	var oDeleteOperation = this.oDataModel.createBatchOperation("", "DELETE", oSecondSection);

    	//TODO Maybe use this Uri from the oDataModel    	
    	oDeleteOperation.requestUri = "NoteSections(SectionGuid='" + oSecondSection.SectionGuid + "',NoteGuid='" + oSecondSection.NoteGuid + "')";	     
    	aBatchOperations.push(oDeleteOperation);
    	
    	this.addBatchOperations(aBatchOperations);    
    },
    
    createFirstSection : function(sNoteGuid) {
    	var aBatchOperations = [];
    	
    	var oSection = {
    			NoteGuid : sNoteGuid,
    			ContentType : "T",
    			ContentText : "",
    			SequenceNumber : this.getLastSectionSequenceNumber()
    	};
    	
    	this.oJSONModel.getData().navNoteSection.push(oSection);
        this.oJSONModel.refresh();
        
        aBatchOperations.push(this.oDataModel.createBatchOperation("/NoteSections", "POST", oSection));  
        
        this.addBatchOperations(aBatchOperations);      
    },
    
    getFirstSectionText : function() {
    	var oFirstSection = this.oJSONModel.getData().navNoteSection[0];
    	
    	if(!oFirstSection) {
    		return null;
    	}
    	
    	return oFirstSection.ContentText;
    },
    
    getSectionText : function(sBindingPath) {
    	return this.oJSONModel.getProperty(sBindingPath).ContentText;
    },
    
    getSectionsText : function(aBindingPaths) {
		var selectedText = '';
		var currentText = '';
				
		// Loop over all sections and check if section has been checked	
		for (var i = 0; i < aBindingPaths.length; i++){				
			currentText = this.getSectionText(aBindingPaths[i]);
			
			if (selectedText != '' && currentText != ''){
				selectedText += '\n\n';
			}
				
			selectedText += currentText;						
		};
				
		return selectedText;
    },
    
    getSectionAttachmentUploadUrl : function(sBindingPath) {
    	var oSection = this.oJSONModel.getProperty(sBindingPath);
    	var sUploadUrl = null;
    		
    	if(oSection.navAttachment) {
    		sUploadUrl = oSection.navAttachment.__metadata.edit_media;
    	} else { 		
    		
    		var context = new sap.ui.model.Context(this.oDataModel, "/NoteSections(SectionGuid='" + oSection.SectionGuid + "',NoteGuid='" + oSection.NoteGuid + "')");    		
    		var oUrlParams = {
    				$expand : "navAttachment"	
    			};
    		
    		this.oDataModel.read("/", context, oUrlParams, false, jQuery.proxy(function(oSection){sUploadUrl = oSection.navAttachment.__metadata.edit_media;}, this));
    	}
    	
    	return sUploadUrl;
    },
    
    getSectionSequenceNumber : function(iSequenceNumber) {
    	var aSections = this.oJSONModel.getData().navNoteSection;    	
    	var iNewSequenceNumber = null;
    	var iNumber = null;
    	
    	 for (var i = 0; i < aSections.length; i++) {
    		 iNumber = aSections[i].SequenceNumber;
    		 
    		 if(iNewSequenceNumber == null || iNumber < iNewSequenceNumber) {
        		 if(iNumber > iSequenceNumber) {
        			 iNewSequenceNumber = iNumber;
        		 } 
    		 }
    	 }
    	 
    	 if(!iNewSequenceNumber) {
    		 return this.getLastSectionSequenceNumber();
    	 }
    	 
		 if(Math.abs(iSequenceNumber - iNewSequenceNumber) == 1) {    			 
			 iSequenceNumber = this.reorderSequenceNumber(iSequenceNumber); // section has new sequence number after reordering
			 return this.getSectionSequenceNumber(iSequenceNumber);
		 }
    	 
    	 return Math.round((iSequenceNumber + iNewSequenceNumber)/2);
    },   
        
    getLastSectionSequenceNumber : function() {
    	var aSections = this.oJSONModel.getData().navNoteSection;
    	var iLastSequenceNumber = 0;
    	var iNumber = null;

    	for (var i = 0; i < aSections.length; i++) {
    		iNumber = aSections[i].SequenceNumber;

    		if(iNumber >= iLastSequenceNumber) {
    			iLastSequenceNumber = iNumber;
    		}
    	}

    	iLastSequenceNumber = iLastSequenceNumber + this.globalStepSize;

    	if (iLastSequenceNumber > this.maxSequenceNumber){ // decrease stepSize and reorder if we are running out of numbers
    		this.globalStepSize = Math.round(this.globalStepSize/2);
    		this.reorderSequenceNumber();
    		iLastSequenceNumber = this.globalStepSize * (aSections.length + 1);
    	}
    
    	return iLastSequenceNumber;
    }, 
    
    reorderSequenceNumber : function(oldSequenceNumber) {
    	var aSections = this.oJSONModel.getData().navNoteSection;
    	var aBatchOperations = [];
    	var oBatchOperation = null;
    	var iSeqNumberBeforeReorder = undefined;
    	var iSeqNumberAfterReorder = undefined;
    	
    	for (var i = 0; i < aSections.length; i++) {
    		iSeqNumberBeforeReorder = aSections[i].SequenceNumber;
    		aSections[i].SequenceNumber = (i+1) * this.globalStepSize;
    		if (oldSequenceNumber && oldSequenceNumber === iSeqNumberBeforeReorder){
    			iSeqNumberAfterReorder = aSections[i].SequenceNumber;
    		}
    		//delete aSections[i].navAttachment;
    		oBatchOperation = this.oDataModel.createBatchOperation("", "PUT", aSections[i]);
    		oBatchOperation.requestUri = "NoteSections(SectionGuid='" + aSections[i].SectionGuid + "',NoteGuid='" + aSections[i].NoteGuid + "')";
    		aBatchOperations.push(oBatchOperation);
    	}

		this.addBatchOperations(aBatchOperations);
		
		return iSeqNumberAfterReorder;
    },
    
    getTeaserText : function(){
    	if(this.oJSONModel.getData().navNoteSection.length == 0) {
    		return null;
    	}
    	
    	return this.oJSONModel.getData().navNoteSection[0].ContentText;
    },
    
    
    /**
     * Update the teaser text of the note header
     * @returns a batch operation so it can be set together with the batch operation of the corresponding CRUD operation (performance reason)
     */
    updateTeaserText : function(oEtag) {
    	if(this.oJSONModel.getData().navNoteSection.length == 0) {
    		return;
    	}
    	
    	var oSection = this.oJSONModel.getData().navNoteSection[0];
    	var oHeader = this.oDataModel.getProperty("/" + this.sContextBindingPath);
    	
    	if (oSection.ContentText == oHeader.TeaserText) {  	
    		//Update is not needed
    		return;
    	}
    	
    	oHeader.TeaserText = oSection.ContentText;
    	
    	var oBatchOperation = this.oDataModel.createBatchOperation("/" + this.sContextBindingPath, "PUT", oHeader,oEtag);                
                
        //Update the teaser text without refreshing the whole model
        this.oDataModel.setProperty("/" + this.sContextBindingPath + "/TeaserText", oHeader.TeaserText);
        
        //TODO Workaround. Otherwise its not possible to change the teaser text of two header notes... thats crazy
        this.oDataModel.sChangeKey = null;
        
        return oBatchOperation;
    },
    
    //TODO Move to common utilities class
    sectionSorter : function(oSectionA, oSectionB) {
    	  return oSectionA.SequenceNumber - oSectionB.SequenceNumber;
    },
    
    /**
     * Stop the next iteration of the batch process. The current iteration will still be executed.
     * The stopping of the batch process is irreversible as there is no restart method! Only use this 
     * before destroying this class. The batch process can only be started in the constructor of this class.
     */
	stopBatchProcess : function() {
		this.stopBatchProcessing = true;
	},
    
	/**
	 * Called when the Handler is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 */
    onExit : function() {
    },
    
});
},
	"cus/crm/notes/i18n/i18n.properties":'#<CRM Notes>\n# __ldi.translation.uuid=493edec0-163d-11e3-8ffd-0800200c9a66\n# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n# XTIT,40: Application title\nSHELL_TITLE=My Notes\n\n#XTIT: this is the title for the master section\nMASTER_TITLE=Notes ({0})\n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Untitled\n#XFLD, 30: this is the place holder dummy in the detail page\nDETAIL_TEXT=Insert your controls here\n\n#XFLD,20: No Data text after loading list\nNO_DATA_TEXT=No Data\n\n#XFLD,20: No Data text when loading/searching list\nLOADING_TEXT=Loading....\n\n#XFLD,20: No Data text after searching list\nNO_MATCHING_ITEMS=No matching items found\n \n#YMSG, 30: Default EMail body text\nEMAIL_NO_TEXT=<No text selected>\n\n#YMSG: Delete question for data loss popup (delete note)\nDELETE_NOTE_QUESTION=If no section is selected, the entire note will be deleted. Otherwise only selected sections will be deleted. Do you want to perform the deletion? \n#YMSG, 30: Text for an empty section in detail page\nSECTION_NO_DATA_TEXT=Add text here. Choose "Return" twice to create new section.\n#YMSG: Delete question for only selected data loss popup (delete note)\nDELETE_SELECTED_NOTE_QUESTION= Selected sections will be deleted. Do you want to perform the deletion?\n#YMSG: Delete question for data loss popup (delete note)\nDELETE_ALL_NOTE_QUESTION= The entire note will be deleted. Do you want to perform the deletion?\n\n#XBUT: Button to add a new note\nBUTTON_ADD_NOTE=Add Note\n#XBUT: Button to sort notes\nBUTTON_SORT_NOTES=Sort Notes\n\n#XBUT: Button to delete one or more sections of the selected note\nDETAIL_BUTTON_DELETE=Delete\n#XBUT: Button to attach a document to a note\nDETAIL_BUTTON_ATTACH=Attach\n#XBUT: Button to create a task with the note as the basis content\nDETAIL_BUTTON_CREATETASK=Create Task\n#XBUT: Button to create an appointment with the note as the basis content\nDETAIL_BUTTON_CREATEAPPOINTMENT=Create Appointment\n#XBUT: Button to add a Image to a section of the note\nDETAIL_BUTTON_ADDPICTURE=Add Image\n#XBUT: Button to add a note to a CRM object\nDETAIL_BUTTON_ADDTO=Add To\n#XBUT: Button to share the note\nDETAIL_BUTTON_SHARE=Share\n#XBUT: Button to save the note\nDETAIL_BUTTON_SAVE=Save\n#XBUT: Button to cancel sharing\nDETAIL_BUTTON_CANCEL=Cancel\n#XBUT: Button to delete note\nDELETE_NOTE_BUTTON_OK=OK\n#XBUT: Button to cancel the note deletion\nDELETE_NOTE_BUTTON_CANCEL=Cancel\n\n#XTIT: this is the title for create appointment dialog\nCREATE_APPOINTMENT_TITLE=Create Appointment\n#XTIT: This is the title for data loss popup (delete note)\nDELETE_NOTE_TITLE=Delete Note\n#YMSG, 200: Message in the error message dialog for network errors\nNETWORK_ERROR_MSG=The synchronization failed because of a network error. Click on OK to retry the synchronization. \n#YMSG, 200: Message in the error message dialog for network errors\nEXCEPTION_ERROR_MSG=The last changes could not be saved because an exception occurred. Click on OK to discard the last changes. \n\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\nSORTING_POPOVER_TITLE=Sort\n#XLST: Item: alphabetical sorting\nSORTING_POPOVER_ALPHABETICAL=Alphabetical\n#XLST: Item: date sorting\nSORTING_POPOVER_DATE=Date\n\n#XTIT: Title of the dialog to create a task\nCREATE_TASK_TITLE=Create Task\n#XFLD, 30: The title of a task\nCREATE_TASK_ATTR_TITLE=Title\n#YMSG: Placeholder of the title input field\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Enter title\n#XFLD, 30: The note to be attached to a task\nCREATE_TASK_ATTR_NOTE=Note\n#XFLD, 30: The due date of a task\nCREATE_TASK_ATTR_DATE=Due Date\n#XFLD, 30: The priority of a task\nCREATE_TASK_ATTR_PRIORITY=Priority\n#XFLD, 30: The private flag of a task\nCREATE_TASK_ATTR_PRIVATE=Private\n#XFLD, 30: The account information of a task\nCREATE_TASK_ATTR_ACCOUNT=Account\n#XFLD, 30: The contact information of a task\nCREATE_TASK_ATTR_CONTACT=Contact\n#XBUT: Button to confirm the creation of a task\nCREATE_TASK_OK=OK\n#XBUT: Button to cancel the creation of a task\nCREATE_TASK_CANCEL=Cancel\n\n#XTIT: Title of processtype dialog\nPROCESS_TYPE=Select Transaction Type\n#XTIT: Title of add to dialog\nTITLE_ADDTO=Add To\n#YMSG: Label of the text area with a note\nADDTO_NOTE_LABEL=Add this note to a business object\n#XBUT: Button to confirm the add to dialog\nADD_TO_OK=OK\n#XBUT: Button to cancel the add to dialog\nADD_TO_CANCEL=Cancel\n#XTIT: Title of opportunity \nTITLE_OPPORTUNITY_OPTION=Opportunity\n#XTIT: Title of select opportunity page \nTITLE_SELECT_OPPORTUNITY=Select Opportunity\n#YMSG: Placeholder of the opportunity search bar\nOPPORTUNITY_SEARCH_PLACEHOLDER=Search\n#YMSG: Label description of the create appointment dialog\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Title\n#YMSG: Placeholder of the Description input field\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Enter title\n#YMSG: Label content of the create appointment dialog\nCREATE_APPOINTMENT_CONTENT_LABEL=Content\n#YMSG: Label start date of the create appointment dialog\nCREATE_APPOINTMENT_START_DATE_LABEL=Start Date and Time\n#YMSG: Label start date of the create appointment dialog\nCREATE_APPOINTMENT_END_DATE_LABEL=End Date and Time\n#YMSG: Label all day of the create appointment dialog\nCREATE_APPOINTMENT_ALL_DAY_LABEL=All Day\n#YMSG: Label private of the create appointment dialog\nCREATE_APPOINTMENT_PRIVATE_LABEL=Private\n#YMSG: Label account of the create appointment dialog\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Account\n#YMSG: Label contact of the create appointment dialog\nCREATE_APPOINTMENT_CONTACT_LABEL=Contact\n#YMSG: Label contact of the create appointment dialog\nCREATE_APPOINTMENT_OK_LABEL=OK\n#YMSG: Label contact of the create appointment dialog\nCREATE_APPOINTMENT_CANCEL_LABEL=Cancel\n#XTIT: Title of select account dialog\nSELECT_ACCOUNT_DIALOG_TITLE=Select Account\n#XTIT: Title of select contact dialog \nSELECT_CONTACT_DIALOG_TITLE=Select Contact\n#YMSG: Information about filter value dependency in the select contact dialog\nCONTACT_SEARCH_FILTERED=Filtered by account data\n#YMSG: Placeholder of the contact search bar\nCONTACT_SEARCH_PLACEHOLDER=Search\n#YMSG: Placeholder of the account search bar\nACCOUNT_SEARCH_PLACEHOLDER=Search\n#YMSG: Placeholder of the note search bar\nNOTE_SEARCH_PLACEHOLDER=Search\n#YMSG: Display value of the priority "Very High"\nPRIORITY_VERY_HIGH=Very High\n#YMSG: Display value of the priority "High"\nPRIORITY_HIGH=High\n#YMSG: Display value of the priority "Medium"\nPRIORITY_MEDIUM=Medium\n#YMSG: Display value of the priority "Low"\nPRIORITY_LOW=Low\n\n#YMSG: 30, Technical error message\nTECHNICAL_ERROR_MESSAGE=Technical error message\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \nMSG_SYNCHRONIZATION_ONGOING=Synchronization with the backend is still ongoing.\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\nMSG_SYNCHRONIZATION_SUCCEEDED=Synchronization with the backend was successful\n#YMSG: 30, Success message after the changes were discarded\nMSG_CHANGES_DISCARDED=Changes were discarded\n#YMSG: 30, Error message in case of creation of note section fails\nMSG_CREATION_NOTE_FAILED=Creating note failed\n#YMSG: Long error message in case of deletion of note section fails\nMSG_LONG_CREATION_NOTE_FAILED=Creating of note failed in backend system. Contact your system administrator. \n#YMSG: 30, Error message in case of deletion of note section fails\nMSG_DELETION_NOTE_FAILED=Deleting note failed\n#YMSG: Long error message in case of deletion of note section fails\nMSG_LONG_DELETION_NOTE_FAILED=Deleting of note failed in backend system. Contact your system administrator. \n#YMSG: 30, Error message in case of updating of note teaser text fails\nMSG_UPDATING_TEASER_FAILED=Updating note failed\n#YMSG: Error message in case of updating of note teaser text fails\nMSG_LONG_UPDATING_TEASER_FAILED=Updating of note failed in backend system. Contact your system administrator.\n#YMSG: 30, Success message in case of updating of opportunity succeeded\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Opportunity with title "{0}" successfully updated \n#YMSG: 30, Error message in case of updating of opportunity fails\nMSG_UPDATING_OPPORTUNITY_FAILED=Updating opportunity with title "{0}" failed\n#YMSG: Error message in case of updating of opportunity fails\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Updating of opportunity failed in backend system. Contact your system administrator. \n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\nMSG_CREATION_OBJECT_FAILED=Creating failed\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\nMSG_LONG_CREATION_OBJECT_FAILED=Creating failed in backend system. Contact your system administrator. \n\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\nMSG_CREATION_OBJECT_SUCCESS=Entry created\n#YMSG: 30, Success message in case of updating of opportunity \nMSG_UPDATING_OPPORTUNITY_SUCCESS=Opportunity created\n#YMSG: 30, Success message in case of updating of task\nMSG_UPDATING_TASK_SUCCESS=Task created\n#YMSG: 30, Success message in case of updating of appointment\nMSG_UPDATING_APPOINTMENT_SUCCESS=Appointment created\n\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\nMSG_SELECT_ONE_SECTION=Select just one section to upload the picture\n\n#YMSG: no transaction types  present\nFOLLOWUPERROR = No Transacation Types found . Kindly check the customization in the backend\n\n#YMSG: message that will be displayed in case of conflicting data during account editing\nMSG_CONFLICTING_DATA=Data has been changed by another user. Click OK to fetch the latest.',
	"cus/crm/notes/i18n/i18n_ar.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\\u064A\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u0628\\u062F\\u0648\\u0646 \\u0639\\u0646\\u0648\\u0627\\u0646\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u0623\\u062F\\u062E\\u0644 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u0627\\u0644\\u062A\\u062D\\u0643\\u0645 \\u0647\\u0646\\u0627\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0639\\u0646\\u0627\\u0635\\u0631 \\u0645\\u0637\\u0627\\u0628\\u0642\\u0629\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062F \\u0623\\u064A \\u0646\\u0635>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u0641\\u064A \\u062D\\u0627\\u0644\\u0629 \\u0639\\u062F\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062F \\u0623\\u064A \\u0642\\u0633\\u0645\\u060C \\u0633\\u064A\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 \\u0628\\u0627\\u0644\\u0643\\u0627\\u0645\\u0644. \\u0628\\u062E\\u0644\\u0627\\u0641 \\u0630\\u0644\\u0643\\u060C \\u0633\\u064A\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0623\\u0642\\u0633\\u0627\\u0645 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0641\\u0642\\u0637. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0625\\u062C\\u0631\\u0627\\u0621 \\u0627\\u0644\\u062D\\u0630\\u0641\\u061F \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u0623\\u0636\\u0641 \\u0646\\u0635\\u064B\\u0627 \\u0647\\u0646\\u0627. \\u0627\\u062E\\u062A\\u0631 "\\u0631\\u062C\\u0648\\u0639" \\u0645\\u0631\\u062A\\u064A\\u0646 \\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0642\\u0633\\u0645 \\u062C\\u062F\\u064A\\u062F.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u0641\\u0631\\u0632 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u062D\\u0630\\u0641\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u0625\\u0631\\u0641\\u0627\\u0642\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0645\\u0647\\u0645\\u0629\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0645\\u0648\\u0639\\u062F\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0635\\u0648\\u0631\\u0629\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0625\\u0644\\u0649\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u062D\\u0641\\u0638\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0645\\u0648\\u0639\\u062F\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u0645\\u0632\\u0627\\u0645\\u0646\\u0629 \\u0628\\u0633\\u0628\\u0628 \\u062D\\u062F\\u0648\\u062B \\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0634\\u0628\\u0643\\u0629. \\u0627\\u062E\\u062A\\u0631 "\\u0645\\u0648\\u0627\\u0641\\u0642" \\u0644\\u062A\\u0643\\u0631\\u0627\\u0631 \\u0627\\u0644\\u0645\\u0632\\u0627\\u0645\\u0646\\u0629.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u062A\\u0639\\u0630\\u0631 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u0623\\u062E\\u064A\\u0631\\u0629 \\u0628\\u0633\\u0628\\u0628 \\u062D\\u062F\\u0648\\u062B \\u0627\\u0633\\u062A\\u062B\\u0646\\u0627\\u0621. \\u0627\\u062E\\u062A\\u0631 "\\u0645\\u0648\\u0627\\u0641\\u0642" \\u0644\\u062A\\u062C\\u0627\\u0647\\u0644 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u0623\\u062E\\u064A\\u0631\\u0629.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u062A\\u0631\\u062A\\u064A\\u0628\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u0623\\u0628\\u062C\\u062F\\u064A\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u0627\\u0644\\u062A\\u0627\\u0631\\u064A\\u062E\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0645\\u0647\\u0645\\u0629\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u0623\\u062F\\u062E\\u0644 \\u0639\\u0646\\u0648\\u0627\\u0646\\u064B\\u0627\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0633\\u062A\\u062D\\u0642\\u0627\\u0642\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u0627\\u0644\\u0623\\u0641\\u0636\\u0644\\u064A\\u0629\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u062E\\u0627\\u0635\\u0629\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0639\\u0627\\u0645\\u0644\\u0629\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0625\\u0644\\u0649\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u0623\\u0636\\u0641 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 \\u0625\\u0644\\u0649 \\u0643\\u0627\\u0626\\u0646 \\u0623\\u0639\\u0645\\u0627\\u0644\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0641\\u0631\\u0635\\u0629 \\u0628\\u064A\\u0639\\u064A\\u0629\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u0628\\u062D\\u062B\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u0623\\u062F\\u062E\\u0644 \\u0639\\u0646\\u0648\\u0627\\u0646\\u064B\\u0627\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u0627\\u0644\\u0645\\u062D\\u062A\\u0648\\u0649\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0648\\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0648\\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u0637\\u0648\\u0627\\u0644 \\u0627\\u0644\\u064A\\u0648\\u0645\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u062E\\u0627\\u0635\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0639\\u0645\\u064A\\u0644\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u062A\\u0645\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u0628\\u062D\\u062B\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u0628\\u062D\\u062B\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u0628\\u062D\\u062B\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u0645\\u0631\\u062A\\u0641\\u0639\\u0629 \\u062C\\u062F\\u064B\\u0627\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u0645\\u0631\\u062A\\u0641\\u0639\\u0629\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u0645\\u062A\\u0648\\u0633\\u0637\\u0629\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u0645\\u0646\\u062E\\u0641\\u0636\\u0629\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u0631\\u0633\\u0627\\u0644\\u0629 \\u062E\\u0637\\u0623 \\u062A\\u0642\\u0646\\u064A\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u0644\\u0627 \\u062A\\u0632\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0632\\u0627\\u0645\\u0646\\u0629 \\u0645\\u0639 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A \\u062C\\u0627\\u0631\\u064A\\u0629\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u0646\\u062C\\u062D\\u062A \\u0627\\u0644\\u0645\\u0632\\u0627\\u0645\\u0646\\u0629 \\u0645\\u0639 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u062A\\u0645 \\u062A\\u062C\\u0627\\u0647\\u0644 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u0641\\u0634\\u0644 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u0641\\u0634\\u0644 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A. \\u0627\\u062A\\u0635\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u0641\\u0634\\u0644 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u0641\\u0634\\u0644 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A. \\u0627\\u062A\\u0635\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u0641\\u0634\\u0644 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u0641\\u0634\\u0644 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A. \\u0627\\u062A\\u0635\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629 \\u0628\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646 {0}" \\u0628\\u0646\\u062C\\u0627\\u062D  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u0641\\u0634\\u0644 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629 \\u0628\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646 "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u0641\\u0634\\u0644 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A. \\u0627\\u062A\\u0635\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0641\\u064A \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A. \\u0627\\u062A\\u0635\\u0644 \\u0628\\u0645\\u0633\\u0624\\u0648\\u0644 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u0641\\u0634\\u0644 \\u0627\\u0644\\u0625\\u062F\\u062E\\u0627\\u0644\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u0628\\u064A\\u0639\\u064A\\u0629\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0648\\u0639\\u062F\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u062D\\u062F\\u062F \\u0642\\u0633\\u0645\\u064B\\u0627 \\u0648\\u0627\\u062D\\u062F\\u064B\\u0627 \\u0641\\u0642\\u0637 \\u0644\\u062A\\u062D\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0635\\u0648\\u0631\\u0629\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u064A\\u0629 \\u0623\\u0646\\u0648\\u0627\\u0639 \\u0645\\u0639\\u0627\\u0645\\u064E\\u0644\\u0627\\u062A. \\u0627\\u0644\\u0631\\u062C\\u0627\\u0621 \\u0641\\u062D\\u0635 \\u062A\\u062E\\u0635\\u064A\\u0635 \\u0627\\u0644\\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062E\\u0644\\u0641\\u064A \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631. \\u0627\\u062E\\u062A\\u0631 \'\\u0645\\u0648\\u0627\\u0641\\u0642\' \\u0644\\u0627\\u0633\\u062A\\u0631\\u062C\\u0627\\u0639 \\u0622\\u062E\\u0631 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A.\r\n',
	"cus/crm/notes/i18n/i18n_bg.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u041D\\u0435\\u043E\\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0435\\u043D\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u0412\\u043C\\u044A\\u043A\\u043D\\u0435\\u0442\\u0435 \\u043A\\u043E\\u043D\\u0442\\u0440. \\u0444\\u0443\\u043D\\u043A\\u0446\\u0438\\u0438 \\u0442\\u0443\\u043A\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u041D\\u044F\\u043C\\u0430 \\u0434\\u0430\\u043D\\u043D\\u0438\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u041D\\u0435 \\u0441\\u0430 \\u043D\\u0430\\u043C\\u0435\\u0440\\u0435\\u043D\\u0438 \\u0441\\u044A\\u0432\\u043F\\u0430\\u0434\\u0430\\u0449\\u0438 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u041D\\u044F\\u043C\\u0430 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D \\u0442\\u0435\\u043A\\u0441\\u0442>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u0410\\u043A\\u043E \\u043D\\u044F\\u043C\\u0430 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B, \\u0446\\u044F\\u043B\\u0430\\u0442\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442\\u0430. \\u0412 \\u043F\\u0440\\u043E\\u0442\\u0438\\u0432\\u0435\\u043D \\u0441\\u043B\\u0443\\u0447\\u0430\\u0439, \\u0441\\u0430\\u043C\\u043E \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u0438\\u0442\\u0435 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0438 \\u0449\\u0435 \\u0441\\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u044F\\u0442. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u0438\\u0437\\u043F\\u044A\\u043B\\u043D\\u0438\\u0442\\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\\u0442\\u043E? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0435\\u0442\\u0435 \\u0442\\u0435\\u043A\\u0441\\u0442 \\u0442\\u0443\\u043A. \\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 "\\u0412\\u0440\\u044A\\u0449\\u0430\\u043D\\u0435" \\u0434\\u0432\\u0430 \\u043F\\u044A\\u0442\\u0438 \\u0437\\u0430 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043D\\u043E\\u0432 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u041A\\u0440\\u0430\\u0442\\u043A\\u0438 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u041F\\u0440\\u0438\\u043A\\u0440\\u0435\\u043F\\u044F\\u043D\\u0435\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0440\\u043E\\u043A\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0438\\u0437\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0438\\u0435\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043A\\u044A\\u043C\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u0421\\u043F\\u043E\\u0434\\u0435\\u043B\\u044F\\u043D\\u0435\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0440\\u043E\\u043A\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430 \\u0441\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043F\\u043E\\u0440\\u0430\\u0434\\u0438 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430 \\u0432 \\u043C\\u0440\\u0435\\u0436\\u0430\\u0442\\u0430. \\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u041E\\u041A \\u0437\\u0430 \\u043F\\u043E\\u0432\\u0442\\u043E\\u0440\\u043D\\u0430 \\u0441\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u041D\\u0435\\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u0437\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u043F\\u043E\\u0440\\u0430\\u0434\\u0438 \\u0432\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430\\u043B\\u043E \\u0438\\u0437\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0438\\u0435. \\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u041E\\u041A \\u0437\\u0430 \\u043E\\u0442\\u043C\\u044F\\u043D\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u0410\\u0437\\u0431\\u0443\\u0447\\u043D\\u043E\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u0414\\u0430\\u0442\\u0430\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0434\\u0430\\u0447\\u0430\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u0417\\u0430\\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u041F\\u0430\\u0434\\u0435\\u0436\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u0427\\u0430\\u0441\\u0442\\u043D\\u043E\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u0421\\u043C\\u0435\\u0442\\u043A\\u0430\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0432\\u0438\\u0434 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u044F\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043A\\u044A\\u043C\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0442\\u0430\\u0437\\u0438 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430 \\u043A\\u044A\\u043C \\u0431\\u0438\\u0437\\u043D\\u0435\\u0441 \\u043E\\u0431\\u0435\\u043A\\u0442\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u0421\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u041D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u0438 \\u0447\\u0430\\u0441\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u0438 \\u0447\\u0430\\u0441\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u0426\\u044F\\u043B \\u0434\\u0435\\u043D\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u0427\\u0430\\u0441\\u0442\\u043D\\u043E\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u041C\\u043D\\u043E\\u0433\\u043E \\u0432\\u0438\\u0441\\u043E\\u043A\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u0412\\u0438\\u0441\\u043E\\u043A\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u0421\\u0440\\u0435\\u0434\\u0435\\u043D\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u041D\\u0438\\u0441\\u044A\\u043A\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u0421\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u0441 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434\\u0430 \\u0432\\u0441\\u0435 \\u043E\\u0449\\u0435 \\u0441\\u0435 \\u0438\\u0437\\u043F\\u044A\\u043B\\u043D\\u044F\\u0432\\u0430\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u0421\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u0441 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434\\u0430 \\u0435 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0430\\u0437\\u0430\\u043D\\u0438\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430 \\u0432 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430. \\u0421\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0438\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0438\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430 \\u0432 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430. \\u0421\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430. \\u0421\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 \\u0441\\u044A\\u0441 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435 "{0}" \\u0435 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0440\\u0430\\u043D\\u043E \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 \\u0441\\u044A\\u0441 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435 "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u0430 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 \\u0432 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430. \\u0421\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u0432 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430. \\u0421\\u0432\\u044A\\u0440\\u0436\\u0435\\u0442\\u0435 \\u0441\\u0435 \\u0441 \\u0432\\u0430\\u0448\\u0438\\u044F \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435\\u043D \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u0417\\u0430\\u043F\\u0438\\u0441\\u044A\\u0442 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u0412\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430\\u0442\\u0430 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u0421\\u0440\\u043E\\u043A\\u044A\\u0442 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0441\\u0430\\u043C\\u043E \\u0435\\u0434\\u043D\\u0430 \\u0441\\u0435\\u043A\\u0446\\u0438\\u044F \\u0437\\u0430 \\u043A\\u0430\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0438\\u0437\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0432\\u0438\\u0434\\u043E\\u0432\\u0435 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438. \\u041C\\u043E\\u043B\\u044F \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0431\\u0435\\u043A\\u0435\\u043D\\u0434 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\\u0442\\u0435 \\u0441\\u0438.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438 \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 OK \\u0437\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0437\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u0435 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u0434\\u0430\\u043D\\u043D\\u0438.\r\n',
	"cus/crm/notes/i18n/i18n_cs.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Moje pozn\\u00E1mky\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Pozn\\u00E1mky ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Bez n\\u00E1zvu\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Sem vlo\\u017Ete sv\\u00E9 ovl\\u00E1dac\\u00ED prvky\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u017D\\u00E1dn\\u00E1 data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Zav\\u00E1d\\u00ED se...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 odpov\\u00EDdaj\\u00EDc\\u00ED polo\\u017Eky\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nebyl vybr\\u00E1n \\u017E\\u00E1dn\\u00FD text>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Pokud nen\\u00ED vybr\\u00E1na \\u017E\\u00E1dn\\u00E1 sekce, cel\\u00E1 pozn\\u00E1mka bude vymaz\\u00E1na. Jinak budou vymaz\\u00E1ny pouze vybran\\u00E9 sekce. Chcete prov\\u00E9st vymaz\\u00E1n\\u00ED? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Sem p\\u0159idejte text. Novou sekci vytvo\\u0159\\u00EDte, kdy\\u017E dvakr\\u00E1t vyberete n\\u00E1vrat.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=P\\u0159idat pozn\\u00E1mku\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=T\\u0159\\u00EDdit pozn\\u00E1mky\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Smazat\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=P\\u0159ipojit\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Vytvo\\u0159it \\u00FAlohu\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Vytvo\\u0159it sch\\u016Fzku\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=P\\u0159idat obr\\u00E1zek\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=P\\u0159idat k\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Sd\\u00EDlet\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Ulo\\u017Eit\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Zru\\u0161it\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Zru\\u0161it\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Vytvo\\u0159it sch\\u016Fzku\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Vymazat pozn\\u00E1mku\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Synchronizace se nezda\\u0159ilo kv\\u016Fli s\\u00ED\\u0165ov\\u00E9 chyb\\u011B. Zvolte OK a opakujte synchronizaci.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Posledn\\u00ED zm\\u011Bny se nepoda\\u0159ilo ulo\\u017Eit, proto\\u017Ee do\\u0161lo k v\\u00FDjimce. Zvolen\\u00EDm OK zru\\u0161\\u00EDte posledn\\u00ED zm\\u011Bny.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=T\\u0159\\u00EDdit\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Podle abecedy\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Datum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Vytvo\\u0159it \\u00FAlohu\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Titul\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Zadejte n\\u00E1zev\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Pozn\\u00E1mka\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Term\\u00EDn spln\\u011Bn\\u00ED\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorita\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Soukrom\\u00E9\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Z\\u00E1kazn\\u00EDk\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Zru\\u0161it\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Vybrat typ transakce\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=P\\u0159idat k\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=P\\u0159idat tuto pozn\\u00E1mku k podnikov\\u00E9mu objektu\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Zru\\u0161it\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=P\\u0159\\u00EDle\\u017Eitost\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Vybrat p\\u0159\\u00EDle\\u017Eitost\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Hledat\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Titul\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Zadejte n\\u00E1zev\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Obsah\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Po\\u010D\\u00E1te\\u010Dn\\u00ED datum a \\u010Das\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Koncov\\u00E9 datum a \\u010Das\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Cel\\u00FD den\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Soukrom\\u00E9\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Z\\u00E1kazn\\u00EDk\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Zru\\u0161it\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Vybrat z\\u00E1kazn\\u00EDka\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Vybrat kontakt\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrov\\u00E1no podle dat z\\u00E1kazn\\u00EDka\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Hledat\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Hledat\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Hledat\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Velmi vysok\\u00E1\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Vysok\\u00E1\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=St\\u0159edn\\u00ED\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=N\\u00EDzk\\u00E1\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Zpr\\u00E1va o technick\\u00E9 chyb\\u011B\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Synchronizace s backendem st\\u00E1le prob\\u00EDh\\u00E1\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Synchronizace s backendem byla \\u00FAsp\\u011B\\u0161n\\u00E1\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Zm\\u011Bny byly zru\\u0161eny\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Nepoda\\u0159ilo se vytvo\\u0159it pozn\\u00E1mku\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Nepoda\\u0159ilo se vytvo\\u0159it pozn\\u00E1mku v backendov\\u00E9m syst\\u00E9mu. Obra\\u0165te se na spr\\u00E1vce syst\\u00E9mu.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Nepoda\\u0159ilo se vymazat pozn\\u00E1mku\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Nepoda\\u0159ilo se odstranit pozn\\u00E1mku v backendov\\u00E9m syst\\u00E9mu. Obra\\u0165te se na spr\\u00E1vce syst\\u00E9mu.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Nepoda\\u0159ilo se aktualizovat pozn\\u00E1mku\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Nepoda\\u0159ilo se aktualizovat pozn\\u00E1mku v backendov\\u00E9m syst\\u00E9mu. Obra\\u0165te se na spr\\u00E1vce syst\\u00E9mu.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=P\\u0159\\u00EDle\\u017Eitost s n\\u00E1zvem \\u201E{0}\\u201C byla \\u00FAsp\\u011B\\u0161n\\u011B aktualizov\\u00E1na  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Nepoda\\u0159ilo se aktualizovat p\\u0159\\u00EDle\\u017Eitost s n\\u00E1zvem \\u201E{0}\\u201C \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Nepoda\\u0159ilo se aktualizovat p\\u0159\\u00EDle\\u017Eitost v backendov\\u00E9m syst\\u00E9mu. Obra\\u0165te se na spr\\u00E1vce syst\\u00E9mu.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Vytvo\\u0159en\\u00ED se nezda\\u0159ilo\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Vytvo\\u0159en\\u00ED se nezda\\u0159ilo v backendov\\u00E9m syst\\u00E9mu. Obra\\u0165te se na spr\\u00E1vce syst\\u00E9mu.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Z\\u00E1znam vytvo\\u0159en\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=P\\u0159\\u00EDle\\u017Eitost vytvo\\u0159ena\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u00DAloha vytvo\\u0159ena\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Sch\\u016Fzka vytvo\\u0159ena\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Vyberte jednu sekci k uploadu obr\\u00E1zku\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Nebyly nalezeny \\u017E\\u00E1dn\\u00E9 typy transakc\\u00ED. Zkontrolujte sv\\u00E9 p\\u0159izp\\u016Fsoben\\u00ED backendu.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data zm\\u011Bnil jin\\u00FD u\\u017Eivatel. Zvolte OK a na\\u010Dt\\u011Bte nejnov\\u011Bj\\u0161\\u00ED data.\r\n',
	"cus/crm/notes/i18n/i18n_de.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Meine Notizen\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notizen ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Ohne Titel\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Controls hier einf\\u00FCgen\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Keine Daten\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Ladevorgang l\\u00E4uft...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Keine passenden Positionen gefunden\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Kein Text ausgew\\u00E4hlt>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Wenn Sie keinen Abschnitt ausw\\u00E4hlen, wird die gesamte Notiz gel\\u00F6scht. Ansonsten werden nur ausgew\\u00E4hlte Abschnitte gel\\u00F6scht. Wollen Sie die L\\u00F6schung durchf\\u00FChren? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Hier Text eingeben. Zweimal "Return" erzeugt einen neuen Abschnitt.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Notiz hinzuf\\u00FCgen\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Notizen sortieren\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=L\\u00F6schen\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Anh\\u00E4ngen\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Aufgabe anlegen\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Termin anlegen\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Bild hinzuf\\u00FCgen\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Hinzuf\\u00FCgen\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Freigeben\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Sichern\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Abbrechen\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Abbrechen\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Termin anlegen\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Notiz l\\u00F6schen\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Synchronisation aufgrund eines Netzwerk-Fehlers fehlgeschlagen. W\\u00E4hlen Sie OK, um die Synchronisation zu wiederholen.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Die letzten \\u00C4nderungen k\\u00F6nnen nicht gesichert werden, da eine Ausnahme aufgetreten ist. W\\u00E4hlen Sie OK, um die letzten \\u00C4nderungen zu verwerfen.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Sortieren\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alphabetisch\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Datum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Aufgabe anlegen\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Titel\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Titel eingeben\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Notiz\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=F\\u00E4lligkeitsdatum\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorit\\u00E4t\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privat\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Account\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Ansprechpartner\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Abbrechen\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Vorgangsart ausw\\u00E4hlen\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Hinzuf\\u00FCgen\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Diese Notiz einem Business-Objekt hinzuf\\u00FCgen\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Abbrechen\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Opportunity\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Opportunity ausw\\u00E4hlen\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Suchen\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Titel\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Titel eingeben\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Inhalt\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Beginndatum/-uhrzeit\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Enddatum/-uhrzeit\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Ganzt\\u00E4gig\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privat\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Account\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Ansprechpartner\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Abbrechen\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Account ausw\\u00E4hlen\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Ansprechpartner ausw\\u00E4hlen\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Nach Account-Daten gefiltert\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Suchen\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Suchen\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Suchen\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Sehr hoch\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Hoch\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Mittel\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Niedrig\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Technische Fehlermeldung\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Synchronisation mit dem Backend l\\u00E4uft noch\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Synchronisation mit dem Backend erfolgreich durchgef\\u00FChrt\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u00C4nderungen wurden verworfen\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Notiz konnte nicht angelegt werden\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Notiz konnte nicht im Backend-System angelegt werden. Wenden Sie sich an die Systemadministration.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Notiz konnte nicht gel\\u00F6scht werden\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Notiz konnte nicht im Backend-System gel\\u00F6scht werden. Wenden Sie sich an die Systemadministration.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Notiz konnte nicht aktualisiert werden\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Notiz konnte nicht im Backend-System aktualisiert werden. Wenden Sie sich an die Systemadministration.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Opportunity mit Titel "{0}" wurde erfolgreich aktualisiert  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Aktualisieren der Opportunity mit Titel "{0}" ist fehlgeschlagen \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Opportunity konnte nicht im Backend-System aktualisiert werden. Wenden Sie sich an die Systemadministration.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Anlegen fehlgeschlagen\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Anlegen im Backend-System fehlgeschlagen. Wenden Sie sich an die Systemadministration.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Eintrag angelegt\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Opportunity angelegt\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Aufgabe angelegt\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Termin angelegt\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=W\\u00E4hlen Sie einen einzelnen Abschnitt, um das Bild hochzuladen\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Keine Vorgangsarten gefunden. Pr\\u00FCfen Sie bitte Ihr Backend-Customizing.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Daten wurden von einem anderen Benutzer ge\\u00E4ndert. W\\u00E4hlen Sie \'OK\', um die neuesten Daten abzurufen.\r\n',
	"cus/crm/notes/i18n/i18n_en.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=My Notes\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notes ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Untitled\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Insert your controls here\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=No Data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Loading...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=No matching items found\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<No text selected>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=If no section is selected, the entire note will be deleted. Otherwise only selected sections will be deleted. Do you want to perform the deletion? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Add text here. Choose "Return" twice to create new section.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\nDELETE_SELECTED_NOTE_QUESTION=Selected sections will be deleted. Do you want to perform the deletion?\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_ALL_NOTE_QUESTION=The entire note will be deleted. Do you want to perform the deletion?\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Add Note\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Sort Notes\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Delete\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Attach\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Create Task\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Create Appointment\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Add Image\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Add To\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Share\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Save\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Cancel\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Cancel\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Create Appointment\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Delete Note\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Synchronization failed due to a network error. Choose OK to repeat the synchronization.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Unable to save the last changes because an exception occurred. Choose OK to discard the last changes.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Sort\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alphabetical\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Date\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Create Task\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Title\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Enter title\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Note\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Due Date\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priority\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Private\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Account\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Contact\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Cancel\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Select Transaction Type\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Add To\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Add this note to a business object\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Cancel\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Opportunity\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Select Opportunity\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Search\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Title\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Enter title\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Content\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Start Date and Time\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=End Date and Time\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=All Day\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Private\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Account\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Contact\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Cancel\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Select Account\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Select Contact\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtered by account data\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Search\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Search\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Search\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Very High\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=High\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Medium\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Low\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Technical error message\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Synchronization with the backend is still ongoing\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Synchronization with the backend was successful\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Changes were discarded\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Failed to create note\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Failed to create note in the backend system. Contact your system administrator.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Failed to delete note\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Failed to delete note in the backend system. Contact your system administrator.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Failed to update note\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Failed to update note in the backend system. Contact your system administrator.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Opportunity with title "{0}" updated successfully  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Failed to update the opportunity with the title "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Failed to update opportunity in the backend system. Contact your system administrator.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Creation failed\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Creation failed in the backend system. Contact your system administrator.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Entry created\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Opportunity created\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Task created\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Appointment created\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Select one section only to upload the image\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=No transaction types found. Please check your back-end customizing.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data has been changed by another user. Choose OK to retrieve the latest data.\r\n',
	"cus/crm/notes/i18n/i18n_en_US_sappsd.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=[[[\\u039C\\u0177 \\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=[[[\\u0143\\u014F\\u0163\\u0113\\u015F ({0})]]]\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=[[[\\u016E\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u018C]]]\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=[[[\\u012C\\u014B\\u015F\\u0113\\u0157\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u014F\\u014B\\u0163\\u0157\\u014F\\u013A\\u015F \\u0125\\u0113\\u0157\\u0113]]]\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=[[[\\u0143\\u014F \\u010E\\u0105\\u0163\\u0105]]]\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F....]]]\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=[[[\\u0143\\u014F \\u0271\\u0105\\u0163\\u010B\\u0125\\u012F\\u014B\\u011F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=[[[<\\u0143\\u014F \\u0163\\u0113\\u03C7\\u0163 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C>]]]\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=[[[\\u012C\\u0192 \\u014B\\u014F \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u012F\\u015F \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C, \\u0163\\u0125\\u0113 \\u0113\\u014B\\u0163\\u012F\\u0157\\u0113 \\u014B\\u014F\\u0163\\u0113 \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C. \\u014E\\u0163\\u0125\\u0113\\u0157\\u0175\\u012F\\u015F\\u0113 \\u014F\\u014B\\u013A\\u0177 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u03C1\\u0113\\u0157\\u0192\\u014F\\u0157\\u0271 \\u0163\\u0125\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u012F\\u014F\\u014B? ]]]\r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=[[[\\u0100\\u018C\\u018C \\u0163\\u0113\\u03C7\\u0163 \\u0125\\u0113\\u0157\\u0113. \\u0108\\u0125\\u014F\\u014F\\u015F\\u0113 "\\u0158\\u0113\\u0163\\u0171\\u0157\\u014B" \\u0163\\u0175\\u012F\\u010B\\u0113 \\u0163\\u014F \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113 \\u014B\\u0113\\u0175 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B.]]]\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\nDELETE_SELECTED_NOTE_QUESTION=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u03C1\\u0113\\u0157\\u0192\\u014F\\u0157\\u0271 \\u0163\\u0125\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u012F\\u014F\\u014B?]]]\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_ALL_NOTE_QUESTION=[[[\\u0162\\u0125\\u0113 \\u0113\\u014B\\u0163\\u012F\\u0157\\u0113 \\u014B\\u014F\\u0163\\u0113 \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u03C1\\u0113\\u0157\\u0192\\u014F\\u0157\\u0271 \\u0163\\u0125\\u0113 \\u018C\\u0113\\u013A\\u0113\\u0163\\u012F\\u014F\\u014B?]]]\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=[[[\\u0100\\u018C\\u018C \\u0143\\u014F\\u0163\\u0113]]]\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=[[[\\u015C\\u014F\\u0157\\u0163 \\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113]]]\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125]]]\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0162\\u0105\\u015F\\u0137]]]\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=[[[\\u0100\\u018C\\u018C \\u012C\\u0271\\u0105\\u011F\\u0113]]]\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=[[[\\u0100\\u018C\\u018C \\u0162\\u014F]]]\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=[[[\\u015C\\u0125\\u0105\\u0157\\u0113]]]\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=[[[\\u014E\\u0136]]]\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163]]]\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0143\\u014F\\u0163\\u0113]]]\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=[[[\\u0162\\u0125\\u0113 \\u015F\\u0177\\u014B\\u010B\\u0125\\u0157\\u014F\\u014B\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C \\u0183\\u0113\\u010B\\u0105\\u0171\\u015F\\u0113 \\u014F\\u0192 \\u0105 \\u014B\\u0113\\u0163\\u0175\\u014F\\u0157\\u0137 \\u0113\\u0157\\u0157\\u014F\\u0157. \\u0108\\u013A\\u012F\\u010B\\u0137 \\u014F\\u014B \\u014E\\u0136 \\u0163\\u014F \\u0157\\u0113\\u0163\\u0157\\u0177 \\u0163\\u0125\\u0113 \\u015F\\u0177\\u014B\\u010B\\u0125\\u0157\\u014F\\u014B\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B. ]]]\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=[[[\\u0162\\u0125\\u0113 \\u013A\\u0105\\u015F\\u0163 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u015F\\u0105\\u028B\\u0113\\u018C \\u0183\\u0113\\u010B\\u0105\\u0171\\u015F\\u0113 \\u0105\\u014B \\u0113\\u03C7\\u010B\\u0113\\u03C1\\u0163\\u012F\\u014F\\u014B \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C. \\u0108\\u013A\\u012F\\u010B\\u0137 \\u014F\\u014B \\u014E\\u0136 \\u0163\\u014F \\u018C\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C \\u0163\\u0125\\u0113 \\u013A\\u0105\\u015F\\u0163 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F. ]]]\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=[[[\\u015C\\u014F\\u0157\\u0163]]]\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=[[[\\u0100\\u013A\\u03C1\\u0125\\u0105\\u0183\\u0113\\u0163\\u012F\\u010B\\u0105\\u013A]]]\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=[[[\\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0162\\u0105\\u015F\\u0137]]]\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=[[[\\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0163\\u012F\\u0163\\u013A\\u0113]]]\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=[[[\\u010E\\u0171\\u0113 \\u010E\\u0105\\u0163\\u0113]]]\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=[[[\\u01A4\\u0157\\u012F\\u014F\\u0157\\u012F\\u0163\\u0177]]]\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=[[[\\u01A4\\u0157\\u012F\\u028B\\u0105\\u0163\\u0113]]]\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=[[[\\u014E\\u0136]]]\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113]]]\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=[[[\\u0100\\u018C\\u018C \\u0162\\u014F]]]\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=[[[\\u0100\\u018C\\u018C \\u0163\\u0125\\u012F\\u015F \\u014B\\u014F\\u0163\\u0113 \\u0163\\u014F \\u0105 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u014F\\u0183\\u0135\\u0113\\u010B\\u0163]]]\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=[[[\\u014E\\u0136]]]\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177]]]\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=[[[\\u0162\\u012F\\u0163\\u013A\\u0113]]]\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0163\\u012F\\u0163\\u013A\\u0113]]]\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=[[[\\u0108\\u014F\\u014B\\u0163\\u0113\\u014B\\u0163]]]\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113 \\u0105\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113]]]\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113 \\u0105\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113]]]\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=[[[\\u0100\\u013A\\u013A \\u010E\\u0105\\u0177]]]\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=[[[\\u01A4\\u0157\\u012F\\u028B\\u0105\\u0163\\u0113]]]\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=[[[\\u014E\\u0136]]]\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 \\u018C\\u0105\\u0163\\u0105]]]\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=[[[\\u01B2\\u0113\\u0157\\u0177 \\u0124\\u012F\\u011F\\u0125]]]\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=[[[\\u0124\\u012F\\u011F\\u0125]]]\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=[[[\\u039C\\u0113\\u018C\\u012F\\u0171\\u0271]]]\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=[[[\\u013B\\u014F\\u0175]]]\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=[[[\\u0162\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157 \\u0271\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113]]]\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=[[[\\u015C\\u0177\\u014B\\u010B\\u0125\\u0157\\u014F\\u014B\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u012F\\u0163\\u0125 \\u0163\\u0125\\u0113 \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u012F\\u015F \\u015F\\u0163\\u012F\\u013A\\u013A \\u014F\\u014B\\u011F\\u014F\\u012F\\u014B\\u011F.]]]\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=[[[\\u015C\\u0177\\u014B\\u010B\\u0125\\u0157\\u014F\\u014B\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u012F\\u0163\\u0125 \\u0163\\u0125\\u0113 \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u0175\\u0105\\u015F \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A]]]\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u0113\\u0157\\u0113 \\u018C\\u012F\\u015F\\u010B\\u0105\\u0157\\u018C\\u0113\\u018C]]]\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u012F\\u014B\\u011F \\u014B\\u014F\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C]]]\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u012F\\u014B\\u011F \\u014F\\u0192 \\u014B\\u014F\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C \\u012F\\u014B \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271. \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157. ]]]\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u012F\\u014B\\u011F \\u014B\\u014F\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C]]]\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u012F\\u014B\\u011F \\u014F\\u0192 \\u014B\\u014F\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C \\u012F\\u014B \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271. \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157. ]]]\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u012F\\u014B\\u011F \\u014B\\u014F\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C]]]\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u012F\\u014B\\u011F \\u014F\\u0192 \\u014B\\u014F\\u0163\\u0113 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C \\u012F\\u014B \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271. \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157.]]]\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u0175\\u012F\\u0163\\u0125 \\u0163\\u012F\\u0163\\u013A\\u0113 "{0}" \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\u013A\\u0177 \\u0171\\u03C1\\u018C\\u0105\\u0163\\u0113\\u018C ]]]\r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u012F\\u014B\\u011F \\u014F\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u0175\\u012F\\u0163\\u0125 \\u0163\\u012F\\u0163\\u013A\\u0113 "{0}" \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C]]]\r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u012F\\u014B\\u011F \\u014F\\u0192 \\u014F\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C \\u012F\\u014B \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271. \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157. ]]]\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u012F\\u014B\\u011F \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C]]]\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u012F\\u014B\\u011F \\u0192\\u0105\\u012F\\u013A\\u0113\\u018C \\u012F\\u014B \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271. \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0177\\u015F\\u0163\\u0113\\u0271 \\u0105\\u018C\\u0271\\u012F\\u014B\\u012F\\u015F\\u0163\\u0157\\u0105\\u0163\\u014F\\u0157. ]]]\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=[[[\\u0114\\u014B\\u0163\\u0157\\u0177 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C]]]\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=[[[\\u014E\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0171\\u014B\\u012F\\u0163\\u0177 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C]]]\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=[[[\\u0162\\u0105\\u015F\\u0137 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C]]]\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=[[[\\u0100\\u03C1\\u03C1\\u014F\\u012F\\u014B\\u0163\\u0271\\u0113\\u014B\\u0163 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C]]]\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0135\\u0171\\u015F\\u0163 \\u014F\\u014B\\u0113 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0163\\u014F \\u0171\\u03C1\\u013A\\u014F\\u0105\\u018C \\u0163\\u0125\\u0113 \\u03C1\\u012F\\u010B\\u0163\\u0171\\u0157\\u0113]]]\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=[[[\\u0143\\u014F \\u0162\\u0157\\u0105\\u014B\\u015F\\u0105\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B \\u0162\\u0177\\u03C1\\u0113\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C . \\u0136\\u012F\\u014B\\u018C\\u013A\\u0177 \\u010B\\u0125\\u0113\\u010B\\u0137 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u015F\\u0163\\u014F\\u0271\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u012F\\u014B \\u0163\\u0125\\u0113 \\u0183\\u0105\\u010B\\u0137\\u0113\\u014B\\u018C]]]\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=[[[\\u010E\\u0105\\u0163\\u0105 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0183\\u0177 \\u0105\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157. \\u0108\\u013A\\u012F\\u010B\\u0137 \\u014E\\u0136 \\u0163\\u014F \\u0192\\u0113\\u0163\\u010B\\u0125 \\u0163\\u0125\\u0113 \\u013A\\u0105\\u0163\\u0113\\u015F\\u0163.]]]\r\n',
	"cus/crm/notes/i18n/i18n_en_US_saptrc.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=gpGzrTwvPSLrr+iZDH5MAg_My Notes\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=ypDgEXna8Z1L6/zcC4Nmew_Notes ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=qnYb/8rvwxo79ryngaRNJw_Untitled\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=E6PeLEYTInzThz//If1DIg_Insert your controls here\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=S3xgXB/eL14EgBtDT01vzg_No Data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=3ZrjCaj1Z0wWmU8Icua87g_Loading....\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=JwHJVR8EA2UPBZFlKEFcoA_No matching items found\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=ummDNm2N5YZUROokUmT3Wg_<No text selected>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Hmp6FLLjnqEBHjATRJ5QsQ_If no section is selected, the entire note will be deleted. Otherwise only selected sections will be deleted. Do you want to perform the deletion? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=0HXm7U6NZ2+z2gFycRsOWA_Add text here. Choose "Return" twice to create new section.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\nDELETE_SELECTED_NOTE_QUESTION=4UR4dlD+tqOQJ54fFIp0nA_Selected sections will be deleted. Do you want to perform the deletion?\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_ALL_NOTE_QUESTION=Sv08VyYpz2XE+tI2cf4lSg_The entire note will be deleted. Do you want to perform the deletion?\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=SnA+0WvmXIzKOifhJE+2Gw_Add Note\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Ae/hdMxB4eS9zwcu6GTymg_Sort Notes\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=8C5V69/Dpp5CipuarZbJ6A_Delete\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=v6yojcb3HHykUcFf0VF3AA_Attach\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=qUwgAlEHqa2YWfWN2pTYqQ_Create Task\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=TdT9UlA6vsBPsWIrr2uFbg_Create Appointment\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=V+mBysJPB9qrnevT16j/iQ_Add Image\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=gMcHEFX/BgiAnuvqtsP0xA_Add To\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=b+CMvWmX0GonSc6DOwNOOg_Share\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Ik4br3bGKAcjGNotEeBpUQ_Save\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=8xyp1ay72v8ElzWfLlwOrw_Cancel\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=rrUr1icwYPXtZdetU5+4xw_OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=JlqCRglY68AaB0l7YUNSOw_Cancel\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Y9ypIM/XGRfleGhI7yqm6Q_Create Appointment\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=ih2j/tmoKPFO96HpLw2YzA_Delete Note\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=suYxJU9vKfBoKu8IO9Nq0Q_The synchronization failed because of a network error. Click on OK to retry the synchronization. \r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=R4601qQuakfGOgJIZBTtUg_The last changes could not be saved because an exception occurred. Click on OK to discard the last changes. \r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=/P4gXXsBVKopzvX+Qj7/Qg_Sort\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=w4eaw53teET2WHwz+tknqg_Alphabetical\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=d0d/YImYFdOR5zDc+tf78Q_Date\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=vgAFGaaf6fgObmBmFagAgA_Create Task\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=fq8doqv6GzUBO1FzBbA3dQ_Title\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=cvyVpVq8xRTP5PE60Db2aA_Enter title\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=lq4utnTNlpeUoeh6jExchA_Note\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=A400GYFdzLr4rdnPXSQwqw_Due Date\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=d6ST8T9CLXn5aFBnWX8gYA_Priority\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=2teoi5OXKhjCFWOeMuhoWg_Private\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=wS2VG1OZ63EXDGmbJwJhxw_Account\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kv3fPz/pybitNvqEeXyI6g_Contact\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=SaVTV50TalbXubrrwb6VGA_OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=X4ujba1+z7K6KRwFIzVAkw_Cancel\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=YgqjMarMuGTEcbERepL0qg_Select Transaction Type\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=+2ZTF9G2+wIq6MFAUfpaew_Add To\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=pCyG/8TBgM/QEv+X/X3DVg_Add this note to a business object\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=cXo0afKC5+9qUrC7fjYrMQ_OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=g3vlY7T6yov/Aj4Ybces1Q_Cancel\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=YgX0rVZD6cZmBLf4PH6Azg_Opportunity\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=ZnBmp7pX5fgY2+vBvJjT0Q_Select Opportunity\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=UvnRJOoeM4bTJweCm4NCrQ_Search\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=h8JdMGlaoY+Hk15ycL5myw_Title\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=TTHxhyxP5eKv8ZZaGejLxQ_Enter title\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=llamKSM8ZNNXUW7LCGOcmA_Content\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=R/HPYJZkdfwo0e9a2s6xww_Start Date and Time\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=7Eksggg7WxuXzR+KGLwbjw_End Date and Time\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=M7+1zI28EFlP7KY0OkIF/g_All Day\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=XrEQo8KIj4nUbqK+3/59tA_Private\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=4oXDEtDJJl2N3qxzX+FGig_Account\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Wsh+XZQCGujKXZPvO/IqCg_Contact\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=g2JPq96i7WwLxC5aAaVH8A_OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=xOa3f8uai7jK6ChoVAhUFA_Cancel\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=1y07xxOuP7HjXdOvKiiqdA_Select Account\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=5CIMXpP6ky2CpOJ+RLl/cA_Select Contact\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=ryaVukOIPCDju/cypACsbQ_Filtered by account data\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=zL68rQXeiiEmmZEeE45M6A_Search\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=tCUCSpc4iXf+glKbC3rmAQ_Search\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=tdtkdSFzLGXT5IKt94Sc1g_Search\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=GK8n8YUWjer43clYJiGWQw_Very High\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=cOCJIw3j3H42IqiaAcFUxg_High\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Bg3VH0AC4f2sUVwxqpqkPA_Medium\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=t0V0spavJJn4wN3TQp8YyQ_Low\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=jqByW0cNnkJA31fCc6SBIw_Technical error message\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=l0V0RB/0xeUZnGO1rNsFGw_Synchronization with the backend is still ongoing.\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=ZHHbeh2qRY+MRQHlK37W7Q_Synchronization with the backend was successful\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=BZK3RXrbyO5t3mQ38wWB1w_Changes were discarded\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=0ihqrZ4F5iPiRmiIaYmfSg_Creating note failed\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=ouz7RKvH9NJ+O4Lju+16vw_Creating of note failed in backend system. Contact your system administrator. \r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=ofmPRNlwEHdDVYvlKDx8vw_Deleting note failed\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=R0uTiprUVOhkO5Q6lmm2HQ_Deleting of note failed in backend system. Contact your system administrator. \r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=oY7ipHK3JY3aQLT2ryLFdw_Updating note failed\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=nD5xt9VCht66hKMWgw0w6A_Updating of note failed in backend system. Contact your system administrator.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=6ZVdCewm2mSSqVHBpkYA/g_Opportunity with title "{0}" successfully updated \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=fy50x2Nbob8hVgSiEw8/Iw_Updating opportunity with title "{0}" failed\r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=9YA4Cdh23xQPJHftoSz7Rw_Updating of opportunity failed in backend system. Contact your system administrator. \r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=WgNCZoTNnzZLnp2xODLLLQ_Creating failed\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=9eQ3sXv8BRAlhVJOLISzog_Creating failed in backend system. Contact your system administrator. \r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=KxKO/VXHQRMACoccBpR+mA_Entry created\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=igBwit5vZIqOuurI0gKJhA_Opportunity created\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=yV9HeAIDpTP4t2XtB7ck6A_Task created\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=FSMdR87CUHFzJX+rvdVlCw_Appointment created\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=OOvRsmruKec52yp8VdemGQ_Select just one section to upload the picture\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=5kiT3SRogBn2c4a0bciyvg_No Transacation Types found . Kindly check the customization in the backend\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=U64DsxssSws1SlZa6rNI2A_Data has been changed by another user. Click OK to fetch the latest.\r\n',
	"cus/crm/notes/i18n/i18n_es.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Mis notas\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notas ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Sin t\\u00EDtulo\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Inserte sus controles aqu\\u00ED\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Sin datos\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Cargando...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=No se han encontrado coincidencias\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<No se ha seleccionado texto>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Si no se selecciona ninguna secci\\u00F3n, se eliminar\\u00E1 la nota completa. De lo contrario solo se eliminar\\u00E1n las secciones seleccionadas. \\u00BFDesea realizar la eliminaci\\u00F3n? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=A\\u00F1adir texto aqu\\u00ED. Seleccione "Devoluci\\u00F3n" dos veces para crear una secci\\u00F3n nueva.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=A\\u00F1adir nota\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Clasificar notas\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Borrar\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Anexar\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Crear tarea\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Crear cita\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=A\\u00F1adir imagen\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=A\\u00F1adir a\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Compartir\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Guardar\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Cancelar\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Cancelar\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Crear cita\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Borrar nota\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Error en la sincronizaci\\u00F3n por un error de red. Seleccione OK para repetir la sincronizaci\\u00F3n.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=No es posible guardar las \\u00FAltimas modificaciones porque se ha producido una excepci\\u00F3n. Seleccione OK para rechazar las \\u00FAltimas modificaciones.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Clasificar\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfab\\u00E9tico\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Fecha\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Crear tarea\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=T\\u00EDtulo\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Introducir t\\u00EDtulo\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Nota\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Fecha de vencimiento\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioridad\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privado\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Cliente\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Contacto\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Cancelar\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Seleccionar tipo de transacci\\u00F3n\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=A\\u00F1adir a\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=A\\u00F1adir esta nota a un objeto empresarial\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Cancelar\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Oportunidad\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Seleccionar oportunidad\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Buscar\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=T\\u00EDtulo\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Introducir t\\u00EDtulo\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Contenido\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Fecha y hora de inicio\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Fecha y hora de fin\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Todo el d\\u00EDa\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privado\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Cliente\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Contacto\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Cancelar\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Seleccionar cliente\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Seleccionar contacto\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrado por datos del cliente\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Buscar\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Buscar\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Buscar\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Muy alta\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Alta\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Media\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Baja\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Mensaje de error t\\u00E9cnico\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=La sincronizaci\\u00F3n con el back end a\\u00FAn est\\u00E1 en proceso\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Se ha realizado correctamente la sincronizaci\\u00F3n con el back end\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Se han rechazado las modificaciones\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Error de creaci\\u00F3n de nota\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Error de creaci\\u00F3n de nota en el sistema back end. P\\u00F3ngase en contacto con el administrador del sistema.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Error de borrado de nota\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Error de borrado de nota en el sistema back end. P\\u00F3ngase en contacto con el administrador del sistema.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Error de actualizaci\\u00F3n de nota\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Error de actualizaci\\u00F3n de nota en el sistema back end. P\\u00F3ngase en contacto con el administrador del sistema.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Oportunidad con el t\\u00EDtulo "{0}" actualizada correctamente  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Error en la carga de la oportunidad con el t\\u00EDtulo "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Error de actualizaci\\u00F3n de oportunidad en el sistema back end. P\\u00F3ngase en contacto con el administrador del sistema.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Error de creaci\\u00F3n\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Error de creaci\\u00F3n en el sistema back end. P\\u00F3ngase en contacto con el administrador del sistema.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Entrada creada\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Oportunidad creada\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Tarea creada\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Cita creada\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Seleccione solo una secci\\u00F3n para cargar la imagen\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=No se han encontrado tipos de transacci\\u00F3n. Compruebe su Customizing de back end.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Otro usuario ha modificado los datos. Seleccione OK para recuperar los datos m\\u00E1s recientes.\r\n',
	"cus/crm/notes/i18n/i18n_fr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Mes notes\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notes ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Sans titre\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Ins\\u00E9rez vos contr\\u00F4les ici\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Aucune donn\\u00E9e\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Chargement...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Aucun \\u00E9l\\u00E9ment correspondant trouv\\u00E9.\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Aucun texte s\\u00E9lectionn\\u00E9>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Si aucune section n\'est s\\u00E9lectionn\\u00E9e, la note sera supprim\\u00E9e int\\u00E9gralement. Autrement, seules les sections s\\u00E9lectionn\\u00E9es seront supprim\\u00E9es. Voulez-vous effectuer la suppression\\u00A0? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Ajoutez du texte ici. S\\u00E9lectionnez deux fois "Entr\\u00E9e" pour cr\\u00E9er une nouvelle section.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Ajouter note\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Trier notes\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Supprimer\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Joindre\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Cr\\u00E9er t\\u00E2che\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Cr\\u00E9er rendez-vous\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Ajouter image\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Ajouter \\u00E0\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Partager\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Sauvegarder\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Interrompre\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Interrompre\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Cr\\u00E9er un rendez-vous\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Supprimer note\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Echec de la synchronisation suite \\u00E0 une erreur r\\u00E9seau. Cliquez sur OK pour relancer la synchronisation.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Suite \\u00E0 une exception, la sauvegarde des derni\\u00E8res modifications est impossible. Cliquez sur OK pour ignorer les derni\\u00E8res modifications.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Trier\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alphab\\u00E9tique\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Date\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Cr\\u00E9er t\\u00E2che\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Titre\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Saisir titre\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Note\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u00C9ch\\u00E9ance\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorit\\u00E9\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Priv\\u00E9\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Compte\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Contact\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Interrompre\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=S\\u00E9lection du type de transaction\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Ajouter \\u00E0\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Ajoutez cette note \\u00E0 un objet de gestion.\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Interrompre\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Opportunit\\u00E9\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=S\\u00E9lectionner opportunit\\u00E9\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Rechercher\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Titre\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Saisir titre\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Contenu\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Date/heure de d\\u00E9but\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Date/heure de fin\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Toute la journ\\u00E9e\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Priv\\u00E9\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Compte\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Contact\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Interrompre\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=S\\u00E9lectionner compte\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=S\\u00E9lectionner contact\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtr\\u00E9s par donn\\u00E9es de compte\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Rechercher\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Rechercher\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Rechercher\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Tr\\u00E8s \\u00E9lev\\u00E9e\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u00C9lev\\u00E9e\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Moyenne\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Basse\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Message d\'erreur technique\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=La synchronisation avec le syst\\u00E8me backend est en cours.\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=La synchronisation avec le syst\\u00E8me backend s\'est correctement termin\\u00E9e.\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Modifications ignor\\u00E9es\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Echec de la cr\\u00E9ation de note\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Echec de la cr\\u00E9ation de note dans le syst\\u00E8me backend. Contactez l\'administrateur syst\\u00E8me.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Echec de la suppression de note\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Echec de la suppression de note dans le syst\\u00E8me backend. Contactez l\'administrateur syst\\u00E8me.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Echec de la mise \\u00E0 jour de note\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Echec de la mise \\u00E0 jour de note dans le syst\\u00E8me backend. Contactez l\'administrateur syst\\u00E8me.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Opportunit\\u00E9 intitul\\u00E9e "{0}" correctement mise \\u00E0 jour  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Echec de la mise \\u00E0 jour de l\'\'opportunit\\u00E9 intitul\\u00E9e "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Echec de la mise \\u00E0 jour d\'opportunit\\u00E9 dans le syst\\u00E8me backend. Contactez l\'administrateur syst\\u00E8me.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Echec de la cr\\u00E9ation\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Echec de la cr\\u00E9ation dans le syst\\u00E8me backend. Contactez l\'administrateur syst\\u00E8me.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Entr\\u00E9e cr\\u00E9\\u00E9e\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Opportunit\\u00E9 cr\\u00E9\\u00E9e\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=T\\u00E2che cr\\u00E9\\u00E9e\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Rendez-vous cr\\u00E9\\u00E9\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=S\\u00E9lectionnez une seule section afin de t\\u00E9l\\u00E9charger l\'image.\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Aucun type de transaction trouv\\u00E9. Contr\\u00F4lez le Customizing du backend.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Donn\\u00E9es modifi\\u00E9es par un autre utilisateur. S\\u00E9lectionnez OK pour r\\u00E9cup\\u00E9rer les donn\\u00E9es les plus r\\u00E9centes.\r\n',
	"cus/crm/notes/i18n/i18n_hr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Moje bilje\\u0161ke\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Bilje\\u0161ke ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Bez naslova\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Ovdje umetnite kontrole\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Nema podataka\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=U\\u010Ditavanje...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nema na\\u0111enih odgovaraju\\u0107ih stavki\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nema odabranog teksta>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Ako nije odabran odjeljak, izbrisat \\u0107e se cijela bilje\\u0161ka. U suprotnom izbrisat \\u0107e se samo odabrani odjeljci. \\u017Delite li izvesti brisanje? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Dodajte tekst ovdje. Izaberite "Return" dvaput za kreiranje novog odjeljka.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Dodaj bilje\\u0161ku\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Sortiraj bilje\\u0161ke\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Izbri\\u0161i\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Prilo\\u017Ei\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Kreiraj zadatak\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Kreiraj sastanak\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Dodaj sliku\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Dodaj\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Otpusti\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Snimi\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Otka\\u017Ei\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=U redu\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Otka\\u017Ei\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Kreiraj sastanak\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Izbri\\u0161i bilje\\u0161ku\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Sinkronizacija nije uspjela zbog gre\\u0161ke mre\\u017Ee. Izaberite OK za ponavljanje sinkronozacije.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Nije mogu\\u0107e snimiti zadnje promjene jer se pojavila iznimka. Izaberite OK za odbacivanje zadnjih promjena.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Sortiraj\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Abecedno\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Datum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Kreiraj zadatak\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Naslov\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Unesite naslov\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Bilje\\u0161ka\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Datum dospije\\u0107a\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioritet\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Osobno\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Klijent\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=U redu\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Otka\\u017Ei\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Odaberi tip transakcije\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Dodaj\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Dodaj ovu bilje\\u0161ku poslovnom objektu\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=U redu\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Otka\\u017Ei\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Prilika\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Odaberi priliku\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Tra\\u017Eenje\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Naslov\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Unesi naslov\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Sadr\\u017Eaj\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Datum i vrijeme po\\u010Detka\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Datum i vrijeme zavr\\u0161etka\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Cijeli dan\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Osobno\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Klijent\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=U redu\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Otka\\u017Ei\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Odaberi klijenta\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Odaberi kontakt\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrirano po podacima klijenta\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Tra\\u017Eenje\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Tra\\u017Eenje\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Tra\\u017Eenje\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Vrlo visoko\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Visoko\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Srednje\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Nisko\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Poruka tehni\\u010Dke gre\\u0161ke\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Sinkronizacija s backendom jo\\u0161 traje\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Sinkronizacija s backendom uspje\\u0161na\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Promjene odba\\u010Dene\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Kreiranje bilje\\u0161ke nije uspjelo\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Kreiranje bilje\\u0161ke u backend sustavu nije uspjelo. Kontaktirajte svog administratora sustava.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Brisanje bilje\\u0161ke nije uspjelo\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Brisanje bilje\\u0161ke u backend sustavu nije uspjelo. Kontaktirajte svog administratora sustava.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=A\\u017Euriranje bilje\\u0161ke nije uspjelo\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=A\\u017Euriranje bilje\\u0161ke u backend sustavu nije uspjelo. Kontaktirajte svog administratora sustava.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Prilika s naslovom "{0}" uspje\\u0161no je a\\u017Eurirana  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Nije uspjelo a\\u017Euriranje prilike s naslovom "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=A\\u017Euriranje prilike u backend sustavu nije uspjelo. Kontaktirajte svog administratora sustava.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Kreiranje nije uspjelo\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Kontaktirajte svog administratora sustava.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Unos kreiran\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Prilika kreirana\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Zadatak kreiran\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Sastanak kreiran\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Odaberite samo jedan odjeljak za prijenos slike na poslu\\u017Eitelj\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Nisu na\\u0111eni tipovi transakcija. Provjerite back-end prilagodbu.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Podatke je promijenio drugi korisnik. Izaberite OK za dohva\\u0107anje najnovijih podataka.\r\n',
	"cus/crm/notes/i18n/i18n_hu.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Saj\\u00E1t jegyzetek\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Jegyzetek ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=N\\u00E9vtelen\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Control besz\\u00FAr\\u00E1sa itt\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Nincs adat\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Bet\\u00F6lt\\u00E9s...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nem tal\\u00E1lhat\\u00F3 egyez\\u0151 t\\u00E9tel\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nincs kiv\\u00E1lasztva sz\\u00F6veg>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Ha nincs kijel\\u00F6lt szakasz, az eg\\u00E9sz jegyzet t\\u00F6rl\\u0151dni fog. Egy\\u00E9bk\\u00E9nt csak a kiv\\u00E1lasztott r\\u00E9sz t\\u00F6rl\\u0151dik. V\\u00E9grehajtja a t\\u00F6rl\\u00E9st? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Sz\\u00F6veg hozz\\u00E1ad\\u00E1sa itt. \\u00DAj szakasz l\\u00E9trehoz\\u00E1s\\u00E1hoz kattintson k\\u00E9tszer a Visszat\\u00E9r\\u00E9sre\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Megj.hozz\\u00E1ad.\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Jegyzetek rendez\\u00E9se\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=T\\u00F6rl\\u00E9s\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Mell\\u00E9klet\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Feladat l\\u00E9trehoz\\u00E1sa\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Tal\\u00E1lkoz\\u00F3 l\\u00E9trehoz\\u00E1sa\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=K\\u00E9p hozz\\u00E1ad\\u00E1sa\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Hozz\\u00E1ad\\u00E1s\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Megoszt\\u00E1s\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Ment\\u00E9s\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=M\\u00E9gse\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=M\\u00E9gse\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Tal\\u00E1lkoz\\u00F3 l\\u00E9trehoz\\u00E1sa\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Megjegyz\\u00E9s t\\u00F6rl\\u00E9se\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=A szinkroniz\\u00E1l\\u00E1s nem siker\\u00FClt h\\u00E1l\\u00F3zati hiba miatt. Kattintson az OK-ra a szinkroniz\\u00E1l\\u00E1s megism\\u00E9tl\\u00E9s\\u00E9hez\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Az utols\\u00F3 m\\u00F3dos\\u00EDt\\u00E1sokat nem siker\\u00FClt elmenteni, mert kiv\\u00E9tel t\\u00F6rt\\u00E9nt. Kattintson az OK-ra az utols\\u00F3 m\\u00F3dos\\u00EDt\\u00E1sok elutas\\u00EDt\\u00E1s\\u00E1hoz\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Rendez\\u00E9s\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u00C1b\\u00E9c\\u00E9 sorrendben\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=D\\u00E1tum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Feladat l\\u00E9trehoz\\u00E1sa\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=C\\u00EDm\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=C\\u00EDm megad\\u00E1sa\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Megjegyz\\u00E9s\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Esed\\u00E9kess\\u00E9g d\\u00E1tuma\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorit\\u00E1s\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Priv\\u00E1t\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u00DCgyf\\u00E9l\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=T\\u00E1rgyal\\u00F3partner\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=M\\u00E9gse\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Tranzakci\\u00F3fajta kiv\\u00E1laszt\\u00E1sa\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Hozz\\u00E1ad\\u00E1s\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=E megjegyz\\u00E9s hozz\\u00E1ad\\u00E1sa \\u00FCzleti objektumhoz\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=Rendben\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=M\\u00E9gse\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Opportunity\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Opportunity kiv\\u00E1laszt\\u00E1sa\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Keres\\u00E9s\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=C\\u00EDm\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=C\\u00EDm megad\\u00E1sa\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Tartalom\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Kezd\\u0151 d\\u00E1tum \\u00E9s id\\u0151p.\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Z\\u00E1r\\u00F3 d\\u00E1tum \\u00E9s id\\u0151pont\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Eg\\u00E9sz nap\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Priv\\u00E1t\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u00DCgyf\\u00E9l\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=T\\u00E1rgyal\\u00F3partner\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=M\\u00E9gse\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Sz\\u00E1mla kiv\\u00E1laszt\\u00E1sa\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=T\\u00E1rgyal\\u00F3partner kiv\\u00E1laszt\\u00E1sa\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Sz\\u0171r\\u00E9s fi\\u00F3kadatok szerint\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Keres\\u00E9s\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Keres\\u00E9s\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Keres\\u00E9s\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Nagyon magas\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Magas\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=K\\u00F6zepes\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Alacsony\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=M\\u0171szaki hiba\\u00FCzenet\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=M\\u00E9g tart a szinkroniz\\u00E1l\\u00E1s backenddel\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=A backanddel val\\u00F3 szinkroniz\\u00E1l\\u00E1s siker\\u00FClt\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=A m\\u00F3dos\\u00EDt\\u00E1sokat elutas\\u00EDtott\\u00E1k\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Nem siker\\u00FClt l\\u00E9trehozni a megjegyz\\u00E9st\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Nem siker\\u00FClt a megjegyz\\u00E9s l\\u00E9trehoz\\u00E1sa a backend rendszeren. Forduljon a rendszeradminisztr\\u00E1torhoz\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Nem siker\\u00FClt a megjegyz\\u00E9s t\\u00F6rl\\u00E9se\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Nem siker\\u00FClt a megjegyz\\u00E9s t\\u00F6rl\\u00E9se a backend rendszeren. Forduljon a rendszeradminisztr\\u00E1torhoz\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Nem siker\\u00FClt a megjegyz\\u00E9s aktualiz\\u00E1l\\u00E1sa\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Nem siker\\u00FClt a megjegyz\\u00E9s aktualiz\\u00E1l\\u00E1sa a backend rendszeren. Forduljon a rendszeradminisztr\\u00E1torhoz\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED="{0}" c\\u00EDm\\u0171 opportunity aktualiz\\u00E1l\\u00E1sa siker\\u00FClt  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Nem siker\\u00FClt "{0}" c\\u00EDm\\u0171 opportunity aktualiz\\u00E1l\\u00E1sa \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Nem siker\\u00FClt az opportunity aktualiz\\u00E1l\\u00E1sa a backend rendszeren. Forduljon a rendszeradminisztr\\u00E1torhoz\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=L\\u00E9trehoz\\u00E1s sikertelen\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Nem siker\\u00FClt a l\\u00E9trehoz\\u00E1s a backend rendszeren. Forduljon a rendszeradminisztr\\u00E1torhoz\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Bejegyz\\u00E9s l\\u00E9trej\\u00F6tt\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Opportunity l\\u00E9trej\\u00F6tt\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Feladat l\\u00E9trej\\u00F6tt\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Tal\\u00E1lkoz\\u00F3 l\\u00E9trej\\u00F6tt\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=V\\u00E1lasszon ki egy egyedi szakaszt a k\\u00E9p felt\\u00F6lt\\u00E9s\\u00E9hez\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Nem tal\\u00E1lhat\\u00F3 m\\u0171veletfajta. K\\u00E9rem, ellen\\u0151rizze a back-end customizingot.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Az adatokat egy m\\u00E1sik felhaszn\\u00E1l\\u00F3 m\\u00F3dos\\u00EDtotta. A legfrissebb adatok h\\u00EDv\\u00E1s\\u00E1hoz v\\u00E1lassza az OK-t.\r\n',
	"cus/crm/notes/i18n/i18n_it.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Le mie note\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Note ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Senza titolo\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Inserisci qui i controlli\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Nessun dato\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=In caricamento...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nessuna posizione concordante\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nessun testo selezionato>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Se non sono state selezionate sezioni, l\'intera nota sar\\u00E0 eliminata. In caso contrario saranno eliminate soltanto le sezioni selezionate. Effettuare l\'eliminazione? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Aggiungi qui del testo. Seleziona due volte "Indietro" per creare una nuova sezione.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Aggiungi nota\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Classifica note\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Elimina\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Allega\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Crea task\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Crea appuntamento\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Aggiungi immagine\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Aggiungi a\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Condividi\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Salva\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Annulla\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Annulla\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Crea appuntamento\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Elimina nota\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Sincronizzazione non riuscita per un errore di rete. Seleziona OK per ripetere la sincronizzazione.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Un\'eccezione ha impedito di salvare le ultime modifiche. Seleziona OK per scartarle.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Classifica\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfabetico\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Data\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Crea task\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Titolo\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Inserisci titolo\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Nota\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Data di scadenza\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorit\\u00E0\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privato\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Cliente\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Contatto\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Annulla\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Seleziona tipo di transazione\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Aggiungi a\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Aggiungi questa nota ad un business object\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Annulla\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Opportunit\\u00E0\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Seleziona opportunit\\u00E0\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Cerca\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Titolo\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Inserisci titolo\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Contenuto\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Data e ora di inizio\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Data e ora di fine\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Tutto il giorno\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privato\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Cliente\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Contatto\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Annulla\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Seleziona cliente\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Seleziona contatto\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrato in base a dati del cliente\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Cerca\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Cerca\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Cerca\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Molto alta\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Alta\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Media\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Bassa\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Messaggio di errore tecnico\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Sincronizzazione con il back-end ancora in corso\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Sincronizzazione con il back-end riuscita\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Le modifiche sono state scartate\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Nota non creata\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Nota non creata nel sistema back-end. Contatta l\'amministratore di sistema.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Nota non eliminata\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Nota non eliminata nel sistema back-end. Contatta l\'amministratore di sistema.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Nota non aggiornata\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Nota non aggiornata nel sistema back-end. Contatta l\'amministratore di sistema.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Opportunit\\u00E0 dal titolo "{0}" aggiornata correttamente  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Opportunit\\u00E0 con titolo "{0}" non aggiornata \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Opportunit\\u00E0 non aggiornata nel sistema back-end. Contatta l\'amministratore di sistema.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Creazione non riuscita\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Creazione non riuscita nel sistema back-end. Contatta l\'amministratore di sistema.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Inserimento creato\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Opportunit\\u00E0 creata\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Task creato\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Appuntamento creato\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Seleziona solo una sezione per caricare l\'immagine\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Nessun tipo di transazione trovato; controlla il customizing back-end.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dati modificati da un altro utente. Fai clic su OK per chiamare gli ultimi dati.\r\n',
	"cus/crm/notes/i18n/i18n_iw.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u05D4\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA \\u05E9\\u05DC\\u05D9\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u05DC\\u05DC\\u05D0 \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D0\\u05EA \\u05D4\\u05D1\\u05E7\\u05E8\\u05D5\\u05EA \\u05E9\\u05DC\\u05DA \\u05DB\\u05D0\\u05DF\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u05D0\\u05D9\\u05DF \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05DE\\u05EA\\u05D0\\u05D9\\u05DE\\u05D9\\u05DD\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u05DC\\u05D0 \\u05E0\\u05D1\\u05D7\\u05E8 \\u05D8\\u05E7\\u05E1\\u05D8>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u05D0\\u05DD \\u05DC\\u05D0 \\u05E0\\u05D1\\u05D7\\u05E8 \\u05DE\\u05E7\\u05D8\\u05E2, \\u05D4\\u05D4\\u05E2\\u05E8\\u05D4 \\u05EA\\u05D9\\u05DE\\u05D7\\u05E7 \\u05D1\\u05E9\\u05DC\\u05DE\\u05D5\\u05EA\\u05D4. \\u05D0\\u05D7\\u05E8\\u05EA \\u05E8\\u05E7 \\u05D4\\u05DE\\u05E7\\u05D8\\u05E2\\u05D9\\u05DD \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8\\u05D5 \\u05D9\\u05D9\\u05DE\\u05D7\\u05E7\\u05D5. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D1\\u05E6\\u05E2 \\u05D0\\u05EA \\u05D4\\u05DE\\u05D7\\u05D9\\u05E7\\u05D4? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D8\\u05E7\\u05E1\\u05D8 \\u05DB\\u05D0\\u05DF. \\u05D1\\u05D7\\u05E8 \'\\u05D7\\u05D6\\u05D5\\u05E8\' \\u05E4\\u05E2\\u05DE\\u05D9\\u05D9\\u05DD \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D9\\u05E6\\u05D5\\u05E8 \\u05DE\\u05E7\\u05D8\\u05E2 \\u05D7\\u05D3\\u05E9.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05E2\\u05E8\\u05D4\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u05DE\\u05D9\\u05D9\\u05DF \\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u05DE\\u05D7\\u05E7\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u05E6\\u05E8\\u05E3\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u05E6\\u05D5\\u05E8 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u05E6\\u05D5\\u05E8 \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05EA\\u05DE\\u05D5\\u05E0\\u05D4\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D0\\u05DC\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u05E9\\u05EA\\u05E3\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u05E9\\u05DE\\u05D5\\u05E8\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u05D1\\u05D8\\u05DC\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u05E6\\u05D5\\u05E8 \\u05E4\\u05D2\\u05D9\\u05E9\\u05D4\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u05DE\\u05D7\\u05E7 \\u05D4\\u05E2\\u05E8\\u05D4\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u05D4\\u05E1\\u05E0\\u05DB\\u05D5\\u05DF \\u05E0\\u05DB\\u05E9\\u05DC \\u05D1\\u05D2\\u05DC\\u05DC \\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E8\\u05E9\\u05EA. \\u05D1\\u05D7\\u05E8 OK \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D7\\u05D6\\u05D5\\u05E8 \\u05E2\\u05DC \\u05D4\\u05E1\\u05E0\\u05DB\\u05E8\\u05D5\\u05DF.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05DC\\u05E9\\u05DE\\u05D5\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D9\\u05DD \\u05DB\\u05D9 \\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D7\\u05E8\\u05D9\\u05D2\\u05D4. \\u05D1\\u05D7\\u05E8 OK \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E1\\u05D9\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D9\\u05DD.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u05DE\\u05D9\\u05D9\\u05DF\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u05D0\\u05DC\\u05E4\\u05D1\\u05D9\\u05EA\\u05D9\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u05E6\\u05D5\\u05E8 \\u05DE\\u05E9\\u05D9\\u05DE\\u05D4\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u05D4\\u05D6\\u05DF \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u05D4\\u05E2\\u05E8\\u05D4\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u05DE\\u05D5\\u05E2\\u05D3 \\u05E4\\u05D9\\u05E8\\u05E2\\u05D5\\u05DF\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u05E2\\u05D3\\u05D9\\u05E4\\u05D5\\u05EA\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u05E4\\u05E8\\u05D8\\u05D9\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u05DC\\u05E7\\u05D5\\u05D7\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u05D1\\u05D7\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05EA\\u05E0\\u05D5\\u05E2\\u05D4\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D0\\u05DC\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D4\\u05E2\\u05E8\\u05D4 \\u05D6\\u05D5 \\u05DC\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8 \\u05E2\\u05E1\\u05E7\\u05D9\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u05D1\\u05D8\\u05DC\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u05D1\\u05D7\\u05E8 \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u05D7\\u05E4\\u05E9\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u05D4\\u05D6\\u05DF \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u05EA\\u05D5\\u05DB\\u05DF\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D5\\u05E9\\u05E2\\u05EA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D5\\u05E9\\u05E2\\u05EA \\u05E1\\u05D9\\u05D5\\u05DD\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u05DB\\u05DC \\u05D4\\u05D9\\u05D5\\u05DD\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u05E4\\u05E8\\u05D8\\u05D9\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u05DC\\u05E7\\u05D5\\u05D7\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u05D1\\u05D8\\u05DC\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u05D1\\u05D7\\u05E8 \\u05DC\\u05E7\\u05D5\\u05D7\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u05D1\\u05D7\\u05E8 \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9 \\u05E0\\u05EA\\u05D5\\u05E0\\u05D9 \\u05DC\\u05E7\\u05D5\\u05D7\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u05D7\\u05E4\\u05E9\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u05D7\\u05E4\\u05E9\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u05D7\\u05E4\\u05E9\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u05D2\\u05D1\\u05D5\\u05D4\\u05D4 \\u05DE\\u05D0\\u05D5\\u05D3\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u05D2\\u05D1\\u05D5\\u05D4\\u05D4\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u05D1\\u05D9\\u05E0\\u05D5\\u05E0\\u05D9\\u05EA\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u05E0\\u05DE\\u05D5\\u05DB\\u05D4\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u05D4\\u05D5\\u05D3\\u05E2\\u05EA \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u05D4\\u05E1\\u05E0\\u05DB\\u05E8\\u05D5\\u05DF \\u05E2\\u05DD \\u05D4-backend \\u05E2\\u05D3\\u05D9\\u05D9\\u05DF \\u05DE\\u05EA\\u05D1\\u05E6\\u05E2\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u05D4\\u05E1\\u05E0\\u05DB\\u05E8\\u05D5\\u05DF \\u05E2\\u05DD \\u05D4-backend \\u05D4\\u05E6\\u05DC\\u05D9\\u05D7\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05D4\\u05D5\\u05E1\\u05E8\\u05D5\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05D9\\u05E6\\u05D9\\u05E8\\u05EA \\u05D4\\u05E2\\u05E8\\u05D4\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05D9\\u05E6\\u05D9\\u05E8\\u05EA \\u05D4\\u05E2\\u05E8\\u05D4 \\u05D1\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05D4-backend. \\u05E6\\u05D5\\u05E8 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05DD \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05DE\\u05D7\\u05D9\\u05E7\\u05EA \\u05D4\\u05E2\\u05E8\\u05D4\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05DE\\u05D7\\u05D9\\u05E7\\u05EA \\u05D4\\u05E2\\u05E8\\u05D4 \\u05D1\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05D4-backend. \\u05E6\\u05D5\\u05E8 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05DD \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05D4\\u05E2\\u05E8\\u05D4\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05D4\\u05E2\\u05E8\\u05D4 \\u05D1\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05D4-backend. \\u05E6\\u05D5\\u05E8 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05DD \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E2\\u05DD \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA "{0}" \\u05E2\\u05D5\\u05D3\\u05DB\\u05E0\\u05D4 \\u05D1\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05D4\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E2\\u05DD \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u05DB\\u05E9\\u05DC \\u05D1\\u05E2\\u05D3\\u05DB\\u05D5\\u05DF \\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05D1\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05D4-backend. \\u05E6\\u05D5\\u05E8 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05DD \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u05D9\\u05E6\\u05D9\\u05E8\\u05D4 \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u05D9\\u05E6\\u05D9\\u05E8\\u05D4 \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4 \\u05D1\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05D4-backend. \\u05E6\\u05D5\\u05E8 \\u05E7\\u05E9\\u05E8 \\u05E2\\u05DD \\u05DE\\u05E0\\u05D4\\u05DC \\u05D4\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05E9\\u05DC\\u05DA.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u05D4\\u05D6\\u05E0\\u05D4 \\u05E0\\u05D5\\u05E6\\u05E8\\u05D4\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u05D4\\u05D6\\u05D3\\u05DE\\u05E0\\u05D5\\u05EA \\u05E0\\u05D5\\u05E6\\u05E8\\u05D4\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u05DE\\u05E9\\u05D9\\u05DE\\u05D4 \\u05E0\\u05D5\\u05E6\\u05E8\\u05D4\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u05E4\\u05D2\\u05D9\\u05E9\\u05D4 \\u05E0\\u05D5\\u05E6\\u05E8\\u05D4\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u05D1\\u05D7\\u05E8 \\u05DE\\u05E7\\u05D8\\u05E2 \\u05D0\\u05D7\\u05D3 \\u05D1\\u05DC\\u05D1\\u05D3 \\u05DC\\u05D4\\u05E2\\u05DC\\u05D0\\u05EA \\u05D4\\u05EA\\u05DE\\u05D5\\u05E0\\u05D4\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05E1\\u05D5\\u05D2\\u05D9 \\u05E4\\u05E2\\u05D5\\u05DC\\u05D5\\u05EA. \\u05D1\\u05D3\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05EA\\u05D0\\u05DE\\u05EA \\u05D4-Back-End.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05E9\\u05D5\\u05E0\\u05D5 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8. \\u05D1\\u05D7\\u05E8 OK \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D0\\u05D7\\u05D6\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D9\\u05DD.\r\n',
	"cus/crm/notes/i18n/i18n_ja.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u30CE\\u30FC\\u30C8\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u30CE\\u30FC\\u30C8 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u7121\\u984C\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u3053\\u3053\\u306B\\u30B3\\u30F3\\u30C8\\u30ED\\u30FC\\u30EB\\u3092\\u633F\\u5165\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u30C7\\u30FC\\u30BF\\u306A\\u3057\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u4E00\\u81F4\\u3059\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u30C6\\u30AD\\u30B9\\u30C8\\u672A\\u9078\\u629E>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u304C\\u9078\\u629E\\u3055\\u308C\\u3066\\u3044\\u306A\\u3044\\u5834\\u5408\\u3001\\u30CE\\u30FC\\u30C8\\u5168\\u4F53\\u304C\\u524A\\u9664\\u3055\\u308C\\u307E\\u3059\\u3002 \\u305D\\u3046\\u3067\\u306A\\u3044\\u5834\\u5408\\u306F\\u9078\\u629E\\u3057\\u305F\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u306E\\u307F\\u304C\\u524A\\u9664\\u3055\\u308C\\u307E\\u3059\\u3002 \\u524A\\u9664\\u3092\\u5B9F\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002 \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u30C6\\u30AD\\u30B9\\u30C8\\u3092\\u3053\\u3053\\u306B\\u8FFD\\u52A0\\u3057\\u307E\\u3059\\u3002"\\u623B\\u308B" \\u3092 2 \\u56DE\\u9078\\u629E\\u3057\\u3066\\u65B0\\u898F\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u767B\\u9332\\u3057\\u307E\\u3059\\u3002\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u30CE\\u30FC\\u30C8\\u8FFD\\u52A0\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u30CE\\u30FC\\u30C8\\u306E\\u30BD\\u30FC\\u30C8\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u524A\\u9664\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u6DFB\\u4ED8\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u30BF\\u30B9\\u30AF\\u767B\\u9332\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u4E88\\u5B9A\\u767B\\u9332\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u30A4\\u30E1\\u30FC\\u30B8\\u8FFD\\u52A0\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u8FFD\\u52A0\\u5148\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u5171\\u6709\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u4FDD\\u5B58\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u4E2D\\u6B62\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u4E88\\u5B9A\\u767B\\u9332\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u30CE\\u30FC\\u30C8\\u524A\\u9664\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u30CD\\u30C3\\u30C8\\u30EF\\u30FC\\u30AF\\u30A8\\u30E9\\u30FC\\u306E\\u305F\\u3081\\u3001\\u540C\\u671F\\u304C\\u5931\\u6557\\u3057\\u307E\\u3057\\u305F\\u3002\\u540C\\u671F\\u3092\\u7E70\\u308A\\u8FD4\\u3059\\u306B\\u306F OK \\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u4F8B\\u5916\\u304C\\u767A\\u751F\\u3057\\u305F\\u305F\\u3081\\u3001\\u6700\\u7D42\\u5909\\u66F4\\u3092\\u4FDD\\u5B58\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002\\u6700\\u7D42\\u5909\\u66F4\\u3092\\u7834\\u68C4\\u3059\\u308B\\u306B\\u306F OK \\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u30BD\\u30FC\\u30C8\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u30A2\\u30EB\\u30D5\\u30A1\\u30D9\\u30C3\\u30C8\\u9806\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u65E5\\u4ED8\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u30BF\\u30B9\\u30AF\\u767B\\u9332\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u30BF\\u30A4\\u30C8\\u30EB\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u30BF\\u30A4\\u30C8\\u30EB\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u30CE\\u30FC\\u30C8\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u671F\\u65E5\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u512A\\u5148\\u5EA6\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u975E\\u516C\\u958B\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u9867\\u5BA2\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u4E2D\\u6B62\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\\u9078\\u629E\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u8FFD\\u52A0\\u5148\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u3053\\u306E\\u30CE\\u30FC\\u30C8\\u3092\\u30D3\\u30B8\\u30CD\\u30B9\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\\u306B\\u8FFD\\u52A0\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u4E2D\\u6B62\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u6848\\u4EF6\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u6848\\u4EF6\\u9078\\u629E\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u691C\\u7D22\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u30BF\\u30A4\\u30C8\\u30EB\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u30BF\\u30A4\\u30C8\\u30EB\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u30B3\\u30F3\\u30C6\\u30F3\\u30C4\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u958B\\u59CB\\u65E5\\u4ED8/\\u6642\\u523B\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u7D42\\u4E86\\u65E5\\u4ED8/\\u6642\\u523B\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u7D42\\u65E5\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u975E\\u516C\\u958B\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u9867\\u5BA2\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u4E2D\\u6B62\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u9867\\u5BA2\\u9078\\u629E\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u9078\\u629E\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u9867\\u5BA2\\u30C7\\u30FC\\u30BF\\u3067\\u30D5\\u30A3\\u30EB\\u30BF\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u691C\\u7D22\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u691C\\u7D22\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u691C\\u7D22\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u6700\\u9AD8\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u9AD8\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u4E2D\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u4F4E\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u6280\\u8853\\u30A8\\u30E9\\u30FC\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u3068\\u306E\\u540C\\u671F\\u304C\\u307E\\u3060\\u5B9F\\u884C\\u4E2D\\u3067\\u3059\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u3068\\u306E\\u540C\\u671F\\u304C\\u6B63\\u5E38\\u7D42\\u4E86\\u3057\\u307E\\u3057\\u305F\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u5909\\u66F4\\u306F\\u7834\\u68C4\\u3055\\u308C\\u307E\\u3057\\u305F\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u30CE\\u30FC\\u30C8\\u3092\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30B7\\u30B9\\u30C6\\u30E0\\u306B\\u30CE\\u30FC\\u30C8\\u3092\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u30CE\\u30FC\\u30C8\\u3092\\u524A\\u9664\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30B7\\u30B9\\u30C6\\u30E0\\u3067\\u30CE\\u30FC\\u30C8\\u3092\\u524A\\u9664\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u30CE\\u30FC\\u30C8\\u3092\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30B7\\u30B9\\u30C6\\u30E0\\u3067\\u30CE\\u30FC\\u30C8\\u3092\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u6848\\u4EF6 (\\u30BF\\u30A4\\u30C8\\u30EB "{0}") \\u304C\\u66F4\\u65B0\\u3055\\u308C\\u307E\\u3057\\u305F  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u6848\\u4EF6 (\\u30BF\\u30A4\\u30C8\\u30EB "{0}") \\u3092\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30B7\\u30B9\\u30C6\\u30E0\\u3067\\u6848\\u4EF6\\u3092\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30B7\\u30B9\\u30C6\\u30E0\\u306B\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u30B7\\u30B9\\u30C6\\u30E0\\u7BA1\\u7406\\u8005\\u306B\\u9023\\u7D61\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u30A8\\u30F3\\u30C8\\u30EA\\u304C\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u6848\\u4EF6\\u304C\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u30BF\\u30B9\\u30AF\\u304C\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u4E88\\u5B9A\\u304C\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u30A4\\u30E1\\u30FC\\u30B8\\u3092\\u30A2\\u30C3\\u30D7\\u30ED\\u30FC\\u30C9\\u3059\\u308B\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u3092 1 \\u3064\\u3060\\u3051\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u30C8\\u30E9\\u30F3\\u30B6\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30D7\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3002\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u30AB\\u30B9\\u30BF\\u30DE\\u30A4\\u30B8\\u30F3\\u30B0\\u3092\\u30C1\\u30A7\\u30C3\\u30AF\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u30C7\\u30FC\\u30BF\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308A\\u5909\\u66F4\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002OK \\u3092\\u9078\\u629E\\u3057\\u3066\\u6700\\u65B0\\u30C7\\u30FC\\u30BF\\u3092\\u53D6\\u5F97\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n',
	"cus/crm/notes/i18n/i18n_no.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Mine merknader\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Merknader ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Uten tittel\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Sett inn kontrollene her\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Ingen data\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Laster ...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Finner ingen matchende elementer\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Ingen tekst valgt>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Hvis du ikke velger et avsnitt, blir hele merknaden slettet. Ellers blir bare de valgte avsnittene slettet. Vil du utf\\u00F8re slettingen? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Tilf\\u00F8y tekst her. Velg "Tilbake" to ganger for \\u00E5 opprette et nytt avsnitt.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Tilf\\u00F8y merknad\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Sorter merknader\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Slett\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Legg ved\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Opprett oppgave\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Opprett avtale\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Tilf\\u00F8y bilde\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Tilf\\u00F8y til\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Del\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Lagre\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Avbryt\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Avbryt\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Opprett avtale\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Slett merknad\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Synkronisering mislyktes p\\u00E5 grunn av en nettverksfeil. Velg OK for \\u00E5 gjenta synkroniseringen.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Kan ikke lagre de siste endringene fordi det oppstod et unntak. Velg OK for \\u00E5 forkaste de siste endringene.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Sorter\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfabetisk\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Dato\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Opprett oppgave\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Tittel\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Oppgi tittel\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Merknad\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Forfallsdato\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioritet\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privat\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Kunde\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Avbryt\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Velg transaksjonstype\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Tilf\\u00F8y til\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Tilf\\u00F8y denne merknaden til et businessobjekt\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Avbryt\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Salgsmulighet\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Velg salgsmulighet\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=S\\u00F8k\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Tittel\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Oppgi tittel\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Innhold\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Startdato og -klokkeslett\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Sluttdato og -klokkeslett\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Hele dagen\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privat\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Kunde\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Avbryt\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Velg kunde\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Velg kontakt\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrert etter kundedata\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=S\\u00F8k\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=S\\u00F8k\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=S\\u00F8k\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Veldig h\\u00F8y\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=H\\u00F8y\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Medium\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Lav\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Teknisk feilmelding\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Synkronisering med backend p\\u00E5g\\u00E5r fortsatt\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Synkronisering med backend er utf\\u00F8rt\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Endringer er forkastet\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Kan ikke opprette merknad\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Kan ikke opprette merknad i backendsystemet. Kontakt systemadministrator.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Kan ikke slette merknad\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Kan ikke slette merknad i backendsystemet. Kontakt systemadministrator.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Kan ikke oppdatere merknad\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Kan ikke oppdatere merknad i backendsystemet. Kontakt systemadministrator.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Salgsmulighet med tittelen "{0}" er oppdatert  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Kan ikke oppdatere salgsmuligheten med tittelen "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Kan ikke oppdatere salgsmulighet i backendsystemet. Kontakt systemadministrator.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Oppretting mislyktes\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Oppretting mislyktes i backendsystemet. Kontakt systemadministrator.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Post opprettet\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Salgsmulighet opprettet\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Oppgave opprettet\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Avtale opprettet\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Velg bare ett avsnitt for \\u00E5 laste opp bildet\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Finner ikke transaksjonstyper. Kontroller backendsystemtilpasning.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Data er endret av en annen bruker. Velg OK for \\u00E5 hente siste data.\r\n',
	"cus/crm/notes/i18n/i18n_pl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Moje notatki\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notatki ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Bez nazwy\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Wstaw obiekty sterowania tutaj\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Brak danych\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Wczytywanie...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nie znaleziono pasuj\\u0105cych pozycji\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nie wybrano tekstu>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Je\\u015Bli nie wybrano sekcji, ca\\u0142a nota zostanie usuni\\u0119ta. W przypadku wyboru usuni\\u0119te zostan\\u0105 tylko wybrane sekcje. Czy wykona\\u0107 usuwanie? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Dodaj tekst tutaj. Wybierz opcj\\u0119 "Wr\\u00F3\\u0107" dwa razy, aby utworzy\\u0107 nowy fragment.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Dodaj notatk\\u0119\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Sortuj notatki\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Usu\\u0144\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Do\\u0142\\u0105cz\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Utw\\u00F3rz zadanie\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Utw\\u00F3rz spotkanie\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Dodaj obraz\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Dodaj do\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Udost\\u0119pnij\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Zapisz\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Anuluj\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Anuluj\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Utw\\u00F3rz spotkanie\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Usu\\u0144 notatk\\u0119\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Synchronizacja nie powiod\\u0142a si\\u0119 z powodu b\\u0142\\u0119du sieci. Wybierz OK, aby powt. synchronizacj\\u0119.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Nie mo\\u017Cna zapisa\\u0107 ostatnich zmian, poniewa\\u017C wyst\\u0105pi\\u0142 wyj\\u0105tek. Wybierz OK, aby odrzuci\\u0107 ostatnie zmiany.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Sortuj\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfabetycznie\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Data\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Utw\\u00F3rz zadanie\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Tytu\\u0142\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Wpisz tytu\\u0142\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Notatka\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Termin\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorytet\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Prywatne\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Klient\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Anuluj\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Wybierz typ transakcji\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Dodaj do\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Dodaj t\\u0119 notatk\\u0119 do obiektu biznesowego\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Anuluj\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Szansa\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Wybierz szans\\u0119\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Szukaj\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Tytu\\u0142\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Wpisz tytu\\u0142\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Zawarto\\u015B\\u0107\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Data i godzina rozpocz\\u0119cia\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Data i godzina zako\\u0144czenia\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Ca\\u0142y dzie\\u0144\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Prywatne\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Klient\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Anuluj\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Wybierz klienta\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Wybierz kontakt\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Przefiltrowane wed\\u0142ug danych klienta\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Szukaj\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Szukaj\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Szukaj\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Bardzo wysoki\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Wysoki\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u015Aredni\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Niski\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Komunikat o b\\u0142\\u0119dzie technicznym\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Synchronizacja z backend jest nadal w toku\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Synchronizacja z backend pomy\\u015Blna\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Odrzucono zmiany\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Tworzenie notatki nie powiod\\u0142o si\\u0119\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Nie utworzono notatki w systemie backend. Skontaktuj si\\u0119 z administratorem systemu.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Usuwanie notatki nie powiod\\u0142o si\\u0119\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Nie usuni\\u0119to notatki w systemie backend. Skontaktuj si\\u0119 z administratorem systemu.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Aktualizacja notatki nie powiod\\u0142a si\\u0119\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Nie zaktualizowano notatki w systemie backend. Skontaktuj si\\u0119 z administratorem systemu.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Pomy\\u015Blnie zaktualizowano szans\\u0119 o tytule "{0}"  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Aktualizacja szansy o tytule "{0}" nie powiod\\u0142a si\\u0119 \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Nie zaktualizowano szansy w systemie backend. Skontaktuj si\\u0119 z administratorem systemu.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Tworzenie nie powiod\\u0142o si\\u0119\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Tworzenie w systemie backend nie powiod\\u0142o si\\u0119. Skontaktuj si\\u0119 administratorem systemu.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Utworzono wpis\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Utworzono szans\\u0119\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Utworzono zadanie\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Utworzono spotkanie\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Wybierz tylko jeden fragment, aby zaktualizowa\\u0107 obraz\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Nie znaleziono rodzaj\\u00F3w operacji. Sprawd\\u017A konfiguracj\\u0119 backend.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dane zosta\\u0142y zmienione przez innego u\\u017Cytkownika. Wybierz OK, aby pobra\\u0107 najnowsze dane.\r\n',
	"cus/crm/notes/i18n/i18n_pt.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Minhas notas\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notas ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Sem t\\u00EDtulo\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Insira seus controles aqui\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Sem dados\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Carregando...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nenhum item correspondente encontrado\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nenhum texto selecionado>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Se nenhuma se\\u00E7\\u00E3o for selecionada, toda a nota ser\\u00E1 eliminada. Caso contr\\u00E1rio, apenas as se\\u00E7\\u00F5es selecionadas ser\\u00E3o eliminadas. Efetuar a elimina\\u00E7\\u00E3o? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Inserir texto aqui. Selecionar "Retornar" duas vezes para criar nova se\\u00E7\\u00E3o.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Inserir nota\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Ordenar notas\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Excluir\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Anexar\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Criar tarefa\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Criar comprom.\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Inserir imagem\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Inserir em\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Compartilhar\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Gravar\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Anular\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Anular\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Criar compromisso\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Excluir nota\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Falha ao sincronizar devido a erro de rede. Selecione OK para repetir a sincroniza\\u00E7\\u00E3o.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Imposs\\u00EDvel gravar \\u00FAltimas modifica\\u00E7\\u00F5es porque ocorreu uma exce\\u00E7\\u00E3o. Selecione OK para rejeit\\u00E1-las.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Ordenar\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfab\\u00E9tica\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Data\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Criar tarefa\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=T\\u00EDtulo\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Inserir t\\u00EDtulo\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Nota\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Prazo\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioridade\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privado\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Conta\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Contato\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Anular\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Selecionar tipo de transa\\u00E7\\u00E3o\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Inserir em\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Inserir essa nota em um business object\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Anular\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Oportunidade\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Selecionar oportunidade\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Procurar\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=T\\u00EDtulo\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Inserir t\\u00EDtulo\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Conte\\u00FAdo\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Data e hora inicial\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Data e hora final\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=O dia inteiro\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privado\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Conta\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Contato\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Cancelar\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Selecionar conta\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Selecionar contato\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtro por dados de conta\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Procurar\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Procurar\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Procurar\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Muito alta\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Elevada\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=M\\u00E9dia\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Baixa\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Mensagem de erro t\\u00E9cnico\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Sincroniza\\u00E7\\u00E3o com back-end ainda em progresso\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Sincroniza\\u00E7\\u00E3o com back-end bem-sucedida\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Modifica\\u00E7\\u00F5es rejeitadas\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Falha ao criar nota\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Falha ao criar nota no sistema back-end. Contate o administrador do sistema.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Falha ao excluir nota\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Falha ao excluir nota no sistema back-end. Contate o administrador do sistema.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Falha ao atualizar nota\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Falha ao atualizar nota no sistema back-end. Contate o administrador do sistema.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Oportunidade com mosaico "{0}" atualizada com \\u00EAxito  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Falha ao atualizar a oportunidade com o t\\u00EDtulo "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Falha ao atualizar oportunidade no sistema back-end. Contate o administrador do sistema.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Falha ao criar\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Falha ao criar no sistema back-end. Contate o administrador do sistema.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Entrada criada\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Oportunidade criada\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Tarefa criada\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Compromisso criado\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Selecionar s\\u00F3 uma se\\u00E7\\u00E3o para carregar imagem\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Nenhum tipo de transa\\u00E7\\u00E3o encontrado. Verifique seu customizing back-end.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Dados modificados por outro usu\\u00E1rio. Selecione OK para chamar os dados mais recentes.\r\n',
	"cus/crm/notes/i18n/i18n_ro.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Notele mele\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Note ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=F\\u0103r\\u0103 titlu\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Insera\\u0163i aici controalele dvs.\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=F\\u0103r\\u0103 date\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u00CEnc\\u0103rcare ...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=F\\u0103r\\u0103 pozi\\u0163ii concordante g\\u0103site\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nniciun text selectat>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Dac\\u0103 nicio sec\\u0163iune nu este selectat\\u0103, \\u00EEntreaga not\\u0103 va fi \\u015Ftears\\u0103. Altfel, doar sec\\u0163iunile selectate vor fi \\u015Fterse. Dori\\u0163i s\\u0103 efectua\\u0163i \\u015Ftergerea? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Ad\\u0103uga\\u0163i text aici. Alege\\u0163i "\\u00CEnapoi" de dou\\u0103 ori pt.a crea sec\\u0163iunea nou\\u0103.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Ad\\u0103ugare not\\u0103\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Sortare note\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u015Etergere\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Anexare\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Creare sarcin\\u0103\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Creare \\u00EEnt\\u00E2lnire fixat\\u0103\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Ad\\u0103ugare imagine\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Ad\\u0103ugare la\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Partajare\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Salvare\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Anulare\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Anulare\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Creare \\u00EEnt\\u00E2lnire fixat\\u0103\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u015Etergere not\\u0103\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Sincronizare nereu\\u015Fit\\u0103 din cauz\\u0103 de eroare de re\\u0163ea. Alege\\u0163i OK pt.a repeta sincronizarea.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Imposibil de salvat ultimele modific\\u0103ri din cauz\\u0103 c\\u0103 a ap\\u0103rut o excep\\u0163ie. Alege\\u0163i OK pt.a respinge ultimele modific\\u0103ri.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Sortare\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfabetic\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Dat\\u0103\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Creare sarcin\\u0103\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Titlu\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Introduce\\u0163i titlu\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Not\\u0103\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Dat\\u0103 scaden\\u0163\\u0103\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioritate\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privat\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Cont\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Persoan\\u0103 de contact\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Anulare\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Selectare tip de opera\\u0163ie\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Ad\\u0103ugare la\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Ad\\u0103uga\\u0163i aceast\\u0103 not\\u0103 la un obiect de afaceri\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Anulare\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Oportunitate\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Selectare oportunitate\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=C\\u0103utare\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Titlu\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Introduce\\u0163i titlu\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Con\\u0163inut\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Dat\\u0103 \\u015Fi or\\u0103 de \\u00EEnceput\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Dat\\u0103 \\u015Fi or\\u0103 de sf\\u00E2r\\u015Fit\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Toat\\u0103 ziua\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privat\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Cont\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Persoan\\u0103 de contact\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Anulare\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Selectare cont\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Selectare persoan\\u0103 de contact\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrat dup\\u0103 date cont\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=C\\u0103utare\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=C\\u0103utare\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=C\\u0103utare\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Foarte mare\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Superior\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Mediu\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Inferior\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Mesaj de eroare tehnic\\u0103\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Sincronizarea cu backend-ul \\u00EEnc\\u0103 este \\u00EEn execu\\u0163ie\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Sincronizarea cu backend-ul a fost reu\\u015Fit\\u0103\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Modific\\u0103rile au fost respinse\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Eroare la creare not\\u0103\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Eroare la creare not\\u0103 \\u00EEn sistem backend. Contacta\\u0163i administratorul dvs.de sistem.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Eroare la \\u015Ftergere not\\u0103\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Eroare la \\u015Ftergere not\\u0103 \\u00EEn sistem backend. Contacta\\u0163i administratorul dvs.de sistem.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Eroare la actualizare not\\u0103\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Eroare la actualizare not\\u0103 \\u00EEn sistem backend. Contacta\\u0163i administratorul dvs.de sistem.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Oportunitate cu titlu "{0}" actualizat\\u0103 cu succes  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Eroare la actualizare oportunitate cu titlu "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Eroare la actualizare oportunitate \\u00EEn sistem backend. Contacta\\u0163i administratorul dvs.de sistem.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Creare nereu\\u015Fit\\u0103\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Creare nereu\\u015Fit\\u0103 \\u00EEn sistem backend. Contacta\\u0163i administratorul dvs.de sistem.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Intrare creat\\u0103\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Oportunitate creat\\u0103\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Sarcin\\u0103 creat\\u0103\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u00CEnt\\u00E2lnire fixat\\u0103 creat\\u0103\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Selecta\\u0163i doar o sec\\u0163iune pt.a \\u00EEnc\\u0103rca imaginea\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=F\\u0103r\\u0103 tipuri de opera\\u0163ie g\\u0103site. Verifica\\u0163i customizarea dvs.de backend.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Datele au fost modificate de alt utilizator. Alege\\u0163i OK pt.a reg\\u0103si ultimele date.\r\n',
	"cus/crm/notes/i18n/i18n_ru.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u041C\\u043E\\u0438 \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u0417\\u0430\\u043C\\u0435\\u0442\\u043A\\u0438 ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u0411\\u0435\\u0437 \\u043D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u044F\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u0412\\u0441\\u0442\\u0430\\u0432\\u044C\\u0442\\u0435 \\u0443\\u043F\\u0440\\u0430\\u0432\\u043B\\u044F\\u044E\\u0449\\u0438\\u0435 \\u044D\\u043B\\u0435\\u043C\\u0435\\u043D\\u0442\\u044B\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u041D\\u0435\\u0442 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u0421\\u043E\\u043E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0443\\u044E\\u0449\\u0438\\u0435 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u0422\\u0435\\u043A\\u0441\\u0442 \\u043D\\u0435 \\u0432\\u044B\\u0434\\u0435\\u043B\\u0435\\u043D>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u0415\\u0441\\u043B\\u0438 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u044B \\u043D\\u0435 \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u044B, \\u0431\\u0443\\u0434\\u0435\\u0442 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0430 \\u0432\\u0441\\u044F \\u0437\\u0430\\u043C\\u0435\\u0442\\u043A\\u0430. \\u0412 \\u043F\\u0440\\u043E\\u0442\\u0438\\u0432\\u043D\\u043E\\u043C \\u0441\\u043B\\u0443\\u0447\\u0430\\u0435 \\u0431\\u0443\\u0434\\u0443\\u0442 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u044B \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u044B. \\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044C\\u0442\\u0435 \\u0442\\u0435\\u043A\\u0441\\u0442. \\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 "\\u0412\\u043E\\u0437\\u0432\\u0440\\u0430\\u0442" \\u0434\\u0432\\u0430\\u0436\\u0434\\u044B \\u0434\\u043B\\u044F \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F \\u043D\\u043E\\u0432\\u043E\\u0433\\u043E \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u0414\\u043E\\u0431. \\u043F\\u0440\\u0438\\u043C.\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u0421\\u043E\\u0440\\u0442. \\u043F\\u0440\\u0438\\u043C.\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0438\\u0442\\u044C\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u0421\\u043E\\u0437\\u0434. \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0443\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u0414\\u043E\\u0431. \\u0438\\u0437\\u043E\\u0431\\u0440.\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u041F\\u043E\\u0434\\u0435\\u043B\\u0438\\u0442\\u044C\\u0441\\u044F\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=\\u041E\\u041A\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0432\\u0441\\u0442\\u0440\\u0435\\u0447\\u0443\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u0421\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u0430\\u0441\\u044C \\u0438\\u0437-\\u0437\\u0430 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0438 \\u0441\\u0435\\u0442\\u0438. \\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u041E\\u041A \\u0434\\u043B\\u044F \\u043F\\u043E\\u0432\\u0442\\u043E\\u0440\\u0430 \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0438\\u044F \\u0441\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u0438.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u0418\\u0437-\\u0437\\u0430 \\u0432\\u043E\\u0437\\u043D\\u0438\\u043A\\u0448\\u0435\\u0439 \\u043E\\u0441\\u043E\\u0431\\u043E\\u0439 \\u0441\\u0438\\u0442\\u0443\\u0430\\u0446\\u0438\\u0438 \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F. \\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u041E\\u041A \\u0434\\u043B\\u044F \\u043E\\u0442\\u043C\\u0435\\u043D\\u044B \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0445 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u0411\\u0443\\u043A\\u0432\\u0435\\u043D\\u043D\\u043E-\\u0446\\u0438\\u0444\\u0440\\u043E\\u0432\\u043E\\u0439\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u0414\\u0430\\u0442\\u0430\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u0434\\u0430\\u0447\\u0443\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u041D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u0412\\u0432\\u0435\\u0441\\u0442\\u0438 \\u043D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u0421\\u0440\\u043E\\u043A\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u041B\\u0438\\u0447\\u043D\\u0430\\u044F\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=\\u041E\\u041A\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u0412\\u044B\\u0431\\u043E\\u0440 \\u0442\\u0438\\u043F\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u044D\\u0442\\u043E \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 \\u0432 \\u0431\\u0438\\u0437\\u043D\\u0435\\u0441-\\u043E\\u0431\\u044A\\u0435\\u043A\\u0442\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=\\u041E\\u041A\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u0412\\u044B\\u0431\\u043E\\u0440 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u041D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u0412\\u0432\\u0435\\u0441\\u0442\\u0438 \\u043D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u0421\\u043E\\u0434\\u0435\\u0440\\u0436\\u0438\\u043C\\u043E\\u0435\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u0414\\u0430\\u0442\\u0430/\\u0432\\u0440\\u0435\\u043C\\u044F \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u0414\\u0430\\u0442\\u0430/\\u0432\\u0440\\u0435\\u043C\\u044F \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u0412\\u0435\\u0441\\u044C \\u0434\\u0435\\u043D\\u044C\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u041B\\u0438\\u0447\\u043D\\u0430\\u044F\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E \\u0434\\u0430\\u043D\\u043D\\u044B\\u043C \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u041E\\u0447\\u0435\\u043D\\u044C \\u0432\\u044B\\u0441\\u043E\\u043A\\u0438\\u0439\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u0412\\u044B\\u0441\\u043E\\u043A\\u0438\\u0439\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u0421\\u0440\\u0435\\u0434\\u043D\\u0438\\u0439\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u041D\\u0438\\u0437\\u043A\\u0438\\u0439\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u0435 \\u043E \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u043E\\u0439 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0435\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u0421\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u0441 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434\\u043E\\u043C \\u0435\\u0449\\u0435 \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u044F\\u0435\\u0442\\u0441\\u044F\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u0421\\u0438\\u043D\\u0445\\u0440\\u043E\\u043D\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u0441 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434\\u043E\\u043C \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0430 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u043E\\u0442\\u043C\\u0435\\u043D\\u0435\\u043D\\u044B\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 \\u0432 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434-\\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435. \\u041E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 \\u0432 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434-\\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435. \\u041E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 \\u0432 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434-\\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435. \\u041E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u0441 \\u043D\\u0430\\u0437\\u0432\\u0430\\u043D\\u0438\\u0435\\u043C "{0}" \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u043E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0430  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u0441 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043A\\u043E\\u043C "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u0432 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434-\\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435. \\u041E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0432 \\u0431\\u044D\\u043A\\u044D\\u043D\\u0434-\\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0435. \\u041E\\u0431\\u0440\\u0430\\u0442\\u0438\\u0442\\u0435\\u0441\\u044C \\u043A \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u043D\\u043E\\u043C\\u0443 \\u0430\\u0434\\u043C\\u0438\\u043D\\u0438\\u0441\\u0442\\u0440\\u0430\\u0442\\u043E\\u0440\\u0443.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u0417\\u0430\\u043F\\u0438\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0430\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u0412\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0430\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u0417\\u0430\\u0434\\u0430\\u0447\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0430\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u0412\\u0441\\u0442\\u0440\\u0435\\u0447\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0430\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u0412\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043E\\u0434\\u0438\\u043D \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B \\u0434\\u043B\\u044F \\u0437\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0438 \\u0438\\u0437\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0438\\u044F\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u0422\\u0438\\u043F\\u044B \\u0442\\u0440\\u0430\\u043D\\u0437\\u0430\\u043A\\u0446\\u0438\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B; \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u044C\\u0442\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0443 \\u0431\\u044D\\u043A-\\u044D\\u043D\\u0434\\u0430\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u044B \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C. \\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u041E\\u041A \\u0434\\u043B\\u044F \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u044C\\u043D\\u044B\\u0445 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445.\r\n',
	"cus/crm/notes/i18n/i18n_sh.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Moje bele\\u0161ke\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Bele\\u0161ke ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Nenaslovljeno\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Ovde unesite kontrole\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Nema podataka\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=U\\u010Ditavanje...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Nisu na\\u0111ene odgovaraju\\u0107e stavke\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Tekst nije odabran>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Ako odeljak nije odabran cela bele\\u0161ka \\u0107e biti izbrisana. U suprotnom \\u0107e se izbrisati samo odabrani odeljci. Da li \\u017Eelite da izvr\\u0161ite brisanje? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Ovde dodajte tekst. Izaberite "Return" dvaput za kreiranje novog odeljka.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\nDELETE_SELECTED_NOTE_QUESTION=Odabrani odeljci \\u0107e biti izbrisani. Da li \\u017Eelite da izvr\\u0161ite brisanje?\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_ALL_NOTE_QUESTION=Cela bele\\u0161ka \\u0107e biti izbrisana. Da li \\u017Eelite da izvr\\u0161ite brisanje?\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Dodaj bele\\u0161ku\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Pore\\u0111aj bele\\u0161ke\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Izbri\\u0161i\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Dodaj\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Kreiraj zadatak\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Kreiraj sastanak\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Dodaj sliku\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Dodaj\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Podeli\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Sa\\u010Duvaj\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Odustani\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Odustani\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Kreiraj sastanak\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Izbri\\u0161i bele\\u0161ku\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Sinhronizacija nije uspela zbog mre\\u017Ene gre\\u0161ke. Izaberite OK za ponavljanje sinhronizacije.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Nije mogu\\u0107e sa\\u010Duvati poslednje promene zbog izuzetka. Izaberite OK za odbacivanje poslednjih promena.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Pore\\u0111aj\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Abecedno\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Datum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Kreiraj zadatak\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Naslov\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Unesi naslov\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Bele\\u0161ka\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Datum dospe\\u0107a\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioritet\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privatno\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Ra\\u010Dun\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Odustani\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Odaberi tip transakcije\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Dodaj\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Dodaj ovu bele\\u0161ku poslovnom objektu\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Odustani\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Prilika\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Odaberi priliku\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Tra\\u017Ei\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Naslov\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Unesi naslov\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Sadr\\u017Eaj\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Datum i vreme po\\u010Detka\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Datum i vreme zavr\\u0161etka\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Ceo dan\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privatno\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Ra\\u010Dun\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Odustani\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Odaberi klijenta\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Odaberi kontakt\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrirano po podacima klijenta\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Tra\\u017Ei\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Tra\\u017Ei\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Tra\\u017Ei\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Veoma visoko\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Visoko\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Srednje\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Nisko\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Tehni\\u010Dka poruka o gre\\u0161ci\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Sinhronizacija s backend-om je jo\\u0161 uvek u toku\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Sinhronizacija s backend-om je uspe\\u0161na\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Promene su odba\\u010Dene\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Kreiranje bele\\u0161ke nije uspelo\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Kreiranje bele\\u0161ke u backend sistemu nije uspelo. Obavestite sistemskog administratora.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Brisanje bele\\u0161ke nije uspelo\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Brisanje bele\\u0161ke u backend sistemu nije uspelo. Obavestite sistemskog administratora.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=A\\u017Euriranje bele\\u0161ke nije uspelo\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=A\\u017Euriranje bele\\u0161ke u backend sistemu nije uspelo. Obavestite sistemskog administratora.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Prilika sa naslovom "{0}" uspe\\u0161no a\\u017Eurirana  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Nije uspelo a\\u017Euriranje prilike sa naslovom "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=A\\u017Euriranje prilike u backend sistemu nije uspelo. Obavestite sistemskog administratora.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Kreiranje nije uspelo\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Kreiranje nije uspelo u backend sistemu. Obavestite sistemskog administratora.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Unos kreiran\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Prilika kreirana\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Zadatak kreiran\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Sastanak kreiran\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Odaberite samo jedan odeljak za prenos slike na server\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Tipovi transakcije nisu na\\u0111eni. Proverite prilago\\u0111avanje back-end-a.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Podatke je promenio drugi korisnik. Kliknite na dugme OK za pozivanje najnovijih podataka.\r\n',
	"cus/crm/notes/i18n/i18n_sk.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Moje pozn\\u00E1mky\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Pozn\\u00E1mky ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Bez n\\u00E1zvu\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Sem vlo\\u017Ete ovl\\u00E1dacie prvky\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u017Diadne d\\u00E1ta\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Na\\u010D\\u00EDtava sa...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Neboli n\\u00E1jden\\u00E9 \\u017Eiadne zodpovedaj\\u00FAce polo\\u017Eky\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Nebol vybrat\\u00FD \\u017Eiadny text>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Ak nie je vybrat\\u00E1 \\u017Eiadna sekcia, cel\\u00E1 pozn\\u00E1mka bude odstr\\u00E1nen\\u00E1. Inak sa odstr\\u00E1nia len vybrat\\u00E9 sekcie. Chcete vykona\\u0165 odstr\\u00E1nenie? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Sem pridajte text. Nov\\u00FA sekciu vytvor\\u00EDte, ke\\u010F dvakr\\u00E1t zvol\\u00EDte n\\u00E1vrat.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Prida\\u0165 pozn\\u00E1mku\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Triedi\\u0165 pozn\\u00E1mky\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Odstr\\u00E1ni\\u0165\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Prilo\\u017Ei\\u0165\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Vytvori\\u0165 \\u00FAlohu\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Vytvori\\u0165 sch\\u00F4dzku\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Prida\\u0165 obr\\u00E1zok\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Prida\\u0165 do\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Zdie\\u013Ea\\u0165\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Ulo\\u017Ei\\u0165\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Zru\\u0161i\\u0165\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Zru\\u0161i\\u0165\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Vytvori\\u0165 sch\\u00F4dzku\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Odstr\\u00E1ni\\u0165 pozn\\u00E1mku\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Synchroniz\\u00E1cia sa nepodarila z d\\u00F4vodu sie\\u0165ovej chyby. Zvo\\u013Ete OK a opakujte synchroniz\\u00E1ciu.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Posledn\\u00E9 zmeny sa nepodarilo ulo\\u017Ei\\u0165, preto\\u017Ee sa vyskytla v\\u00FDnimka. Zvo\\u013Ete OK, aby sa zru\\u0161ili posledn\\u00E9 zmeny.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Triedi\\u0165\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Pod\\u013Ea abecedy\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=D\\u00E1tum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Vytvori\\u0165 \\u00FAlohu\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=N\\u00E1zov\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Zada\\u0165 n\\u00E1zov\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Pozn\\u00E1mka\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Term\\u00EDn splnenia\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Priorita\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=S\\u00FAkromn\\u00E9\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Z\\u00E1kazn\\u00EDk\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Zru\\u0161i\\u0165\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Vybra\\u0165 typ transakcie\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Prida\\u0165 do\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Pridajte t\\u00FAto pozn\\u00E1mku do podnikov\\u00E9ho objektu\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Zru\\u0161i\\u0165\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Pr\\u00EDle\\u017Eitos\\u0165\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Vybra\\u0165 pr\\u00EDle\\u017Eitos\\u0165\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=H\\u013Eada\\u0165\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=N\\u00E1zov\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Zada\\u0165 n\\u00E1zov\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Obsah\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum a \\u010Das\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Koncov\\u00FD d\\u00E1tum a \\u010Das\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Cel\\u00FD de\\u0148\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=S\\u00FAkromn\\u00E9\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Z\\u00E1kazn\\u00EDk\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Zru\\u0161i\\u0165\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Vybra\\u0165 z\\u00E1kazn\\u00EDka\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Vybra\\u0165 kontakt\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrovan\\u00E9 pod\\u013Ea d\\u00E1t z\\u00E1kazn\\u00EDka\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=H\\u013Eada\\u0165\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=H\\u013Eada\\u0165\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=H\\u013Eada\\u0165\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Ve\\u013Emi vysok\\u00E1\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Vysok\\u00E1\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Stredn\\u00E1\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=N\\u00EDzka\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Spr\\u00E1va o technickej chybe\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Synchroniz\\u00E1cia s backendom st\\u00E1le prebieha\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Synchroniz\\u00E1cia s backendom bola \\u00FAspe\\u0161n\\u00E1\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Zmeny boli zamietnut\\u00E9\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Nepodarilo sa vytvori\\u0165 pozn\\u00E1mku\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Nepodarilo sa vytvori\\u0165 pozn\\u00E1mku v backendovom syst\\u00E9me. Obr\\u00E1\\u0165te sa na spr\\u00E1vcu syst\\u00E9mu.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Nepodarilo sa odstr\\u00E1ni\\u0165 pozn\\u00E1mku\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Nepodarilo sa odstr\\u00E1ni\\u0165 pozn\\u00E1mku v backendovom syst\\u00E9me. Obr\\u00E1\\u0165te sa na spr\\u00E1vcu syst\\u00E9mu.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Nepodarilo sa aktualizova\\u0165 pozn\\u00E1mku\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Nepodarilo sa aktualizova\\u0165 pozn\\u00E1mku v backendovom syst\\u00E9me. Obr\\u00E1\\u0165te sa na spr\\u00E1vcu syst\\u00E9mu.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Pr\\u00EDle\\u017Eitos\\u0165 s n\\u00E1zvom "{0}" bola \\u00FAspe\\u0161ne aktualizovan\\u00E1  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=Nepodarilo sa aktualizova\\u0165 pr\\u00EDle\\u017Eitos\\u0165 s n\\u00E1zvom "{0}" \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Nepodarilo sa aktualizova\\u0165 pr\\u00EDle\\u017Eitos\\u0165 v backendovom syst\\u00E9me. Obr\\u00E1\\u0165te sa na spr\\u00E1vcu syst\\u00E9mu.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Vytvorenie sa nepodarilo\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Vytvorenie sa nepodarilo v backendovom syst\\u00E9me. Obr\\u00E1\\u0165te sa na spr\\u00E1vcu syst\\u00E9mu.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Z\\u00E1znam vytvoren\\u00FD\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Pr\\u00EDle\\u017Eitos\\u0165 vytvoren\\u00E1\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u00DAloha vytvoren\\u00E1\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Sch\\u00F4dzka vytvoren\\u00E1\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Vyberte jednu sekciu na odovzdanie obr\\u00E1zka\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Neboli n\\u00E1jden\\u00E9 \\u017Eiadne typy transakci\\u00ED. Skontrolujte svoje prisp\\u00F4sobenie backendu.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=D\\u00E1ta zmenil in\\u00FD pou\\u017E\\u00EDvate\\u013E. Zvo\\u013Ete OK, aby sa na\\u010D\\u00EDtali najnov\\u0161ie d\\u00E1ta.\r\n',
	"cus/crm/notes/i18n/i18n_sl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Moje zabele\\u017Eke\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Zabele\\u017Eke ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Neimenovano\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Tukaj vnesite svoje nadzore\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Ni podatkov\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Nalaganje poteka ...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=Ustrezne postavke niso najdene\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Tekst ni izbran>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u010Ce ne izberete nobenega segmenta, bo celotna zabele\\u017Eka izbrisana. Druga\\u010De bodo izbrisane samo izbrani segmenti. \\u017Delite izvesti brisanje? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Tukaj vnesite tekst. Izberite "Vrnitev" dvakrat za kreiranje novega segmenta.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Dodajanje zabele\\u017Eke\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Razvr\\u0161\\u010Danje zabele\\u017Ek\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Brisanje\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Pripenjanje\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=Kreiranje naloge\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Kreiranje termina\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Dodajanje slike\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Dodajanje k\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Dele\\u017E\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Shranjevanje\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=Prekinitev\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=OK\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=Prekinitev\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Kreiranje termina\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Brisanje zabele\\u017Eke\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=Sinhronizacija ni uspela zaradi napake omre\\u017Eja. Izberite OK za ponovno sinhronizacijo.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=Zadnjih sprememb ni bilo mogo\\u010De shraniti, ker se je pojavila izjema. Izberite OK za opustitev zadnjih sprememb.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=Razvr\\u0161\\u010Danje\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Abecedno\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Datum\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=Kreiranje naloge\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Naslov\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Vnesite naslov\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Opomba\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Rok\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=Prioriteta\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Privatno\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=Konto\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=Kontakt\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=OK\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=Prekinitev\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=Izberite tip transakcije\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Dodajanje k\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Dodajanje te zabele\\u017Eke poslovnemu objektu\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=OK\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=Prekinitev\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=Prilo\\u017Enost\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=Izbira prilo\\u017Enosti\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Iskanje\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Naslov\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Vnesite naslov\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=Vsebina\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Za\\u010Detni datum in \\u010Das\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Kon\\u010Dni datum in \\u010Das\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=Ves dan\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Privatno\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=Konto\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=Kontakt\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=OK\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=Prekinitev\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=Izbira stranke\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=Izbira kontakta\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=Filtrirano po podatkih stranke\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Iskanje\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Iskanje\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Iskanje\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=Zelo visoko\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Visoko\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Srednje\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=Nizko\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Obvestilo o tehni\\u010Dni napaki\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Sihnronizacija z Backendom \\u0161e vedno poteka\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Sihnronizacija z Backendom je bila uspe\\u0161na\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=Spremembe so bile opu\\u0161\\u010Dene\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Kreiranje zabele\\u017Eke ni uspelo\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Kreiranje zabele\\u017Eke v sistemu Backend ni uspelo. Obrnite se na svojega administratorja sistema.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Brisanje zabele\\u017Eke ni uspelo\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Brisanje zabele\\u017Eke v sistemu Backend ni uspelo. Obrnite se na svojega administratorja sistema.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=A\\u017Euriranje zabele\\u017Eke ni uspelo\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=A\\u017Euriranje zabele\\u017Eke v sistemu Backend ni uspelo. Obrnite se na svojega administratorja sistema.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=Prilo\\u017Enost z naslovom "{0}" uspe\\u0161no a\\u017Eurirana  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=A\\u017Euriranje prilo\\u017Enosti z naslovom "{0}" ni uspelo \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=A\\u017Euriranje prilo\\u017Enosti v sistemu Backend ni uspelo. Obrnite se na svojega administratorja sistema.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Kreiranje ni uspelo\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Kreiranje v sistemu Backend ni uspelo. Obrnite se na svojega administratorja sistema.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Vnos kreiran\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=Prilo\\u017Enost kreirana\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=Naloga kreirana\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Termin kreiran\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Izberite samo en segment za nalaganje slike v stre\\u017Enik\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=Ni najdenih tipov transakcij. Preverite svoj backend Customizing.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Podatke je spremenil drug uporabnik. Izberite OK za priklic najnovej\\u0161ih podatkov.\r\n',
	"cus/crm/notes/i18n/i18n_tr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=Notlar\\u0131m\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Notlar ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Ba\\u015Fl\\u0131ks\\u0131z\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=Kontrollerinizi buraya ekleyin\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=Veri yok\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=Y\\u00FCkleniyor...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=E\\u015Fle\\u015Fen kalem bulunamad\\u0131\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<Metin se\\u00E7ilmedi>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=Kesit se\\u00E7ilmezse, t\\u00FCm not silinecek. Di\\u011Fer durumda yaln\\u0131z se\\u00E7ilen kesitler silinecek. Silmeyi ger\\u00E7ekle\\u015Ftirmek istiyor musunuz? \r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=Buraya metin ekleyin. Yeni b\\u00F6l\\u00FCm olu\\u015Fturmak i\\u00E7in iki defa "D\\u00F6nd\\u00FCr"\\u00FC se\\u00E7in.\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=Not ekle\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=Notlar\\u0131 s\\u0131rala\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=Sil\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=Ekle\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=G\\u00F6rev olu\\u015Ftur\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=Randevu olu\\u015Ftur\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=Resim ekle\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=Ekle\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=Payla\\u015F\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=Kaydet\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u0130ptal\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=Tamam\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u0130ptal\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=Randevu olu\\u015Ftur\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=Notu sil\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=A\\u011F hatas\\u0131 nedeniyle senkronizasyon ba\\u015Far\\u0131s\\u0131z oldu. Senkronizasyonu yenilemek i\\u00E7in TAMAM\'\\u0131 se\\u00E7in.\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u0130stisna ortaya \\u00E7\\u0131kt\\u0131\\u011F\\u0131ndan son de\\u011Fi\\u015Fiklikler kaydedilemiyor. Son de\\u011Fi\\u015Fiklikleri atmak i\\u00E7in TAMAM\'\\u0131 se\\u00E7in.\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=S\\u0131ralama\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=Alfabetik\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=Tarih\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=G\\u00F6rev olu\\u015Ftur\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=Ba\\u015Fl\\u0131k\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=Ba\\u015Fl\\u0131k gir\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=Not\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=Son tarih\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u00D6ncelik\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=Ki\\u015Fisel\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=M\\u00FC\\u015Fteri\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u0130lgili ki\\u015Fi\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=Tamam\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u0130ptal\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u0130\\u015Flem t\\u00FCr\\u00FC se\\u00E7\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=Ekle\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=Bu notu i\\u015F nesnesine ekle\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=Tamam\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u0130ptal\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=F\\u0131rsat\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=F\\u0131rsat se\\u00E7\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=Ara\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=Ba\\u015Fl\\u0131k\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=Ba\\u015Fl\\u0131k gir\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u0130\\u00E7erik\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=Ba\\u015Flang\\u0131\\u00E7 tarihi ve saati\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=Biti\\u015F tarihi ve saati\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=T\\u00FCm g\\u00FCn\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=Ki\\u015Fisel\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=M\\u00FC\\u015Fteri\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u0130lgili ki\\u015Fi\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=Tamam\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u0130ptal\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=M\\u00FC\\u015Fteri se\\u00E7\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u0130lgili ki\\u015Fi se\\u00E7\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=M\\u00FC\\u015Fteri verilerine g\\u00F6re filtrelendi\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=Ara\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=Ara\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=Ara\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u00C7ok y\\u00FCksek\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=Y\\u00FCksek\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=Orta\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=D\\u00FC\\u015F\\u00FCk\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=Teknik hata iletisi\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=Arka u\\u00E7la senkronizasyon hala devam ediyor\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=Arka u\\u00E7la senkronizasyon ba\\u015Far\\u0131l\\u0131 oldu\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=De\\u011Fi\\u015Fiklikler at\\u0131ld\\u0131\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=Not olu\\u015Fturma ba\\u015Far\\u0131s\\u0131z oldu\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=Arka u\\u00E7 sisteminde not olu\\u015Fturma ba\\u015Far\\u0131s\\u0131z oldu. Sistem y\\u00F6neticinize ba\\u015Fvurun.\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=Notu silme ba\\u015Far\\u0131s\\u0131z oldu\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=Arka u\\u00E7 sisteminde notu silme ba\\u015Far\\u0131s\\u0131z oldu. Sistem y\\u00F6neticinize ba\\u015Fvurun.\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=Notu g\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z oldu\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=Arka u\\u00E7 sisteminde notu g\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z oldu. Sistem y\\u00F6neticinize ba\\u015Fvurun.\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED="{0}" ba\\u015Fl\\u0131kl\\u0131 f\\u0131rsat ba\\u015Far\\u0131yla g\\u00FCncellendi  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED="{0}" ba\\u015Fl\\u0131kl\\u0131 f\\u0131rsat\\u0131 g\\u00FCncellemek ba\\u015Far\\u0131s\\u0131z oldu \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=Arka u\\u00E7 sisteminde f\\u0131rsat\\u0131 g\\u00FCncelleme ba\\u015Far\\u0131s\\u0131z oldu. Sistem y\\u00F6neticinize ba\\u015Fvurun.\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=Olu\\u015Fturma ba\\u015Far\\u0131s\\u0131z oldu\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=Arka u\\u00E7 sisteminde olu\\u015Fturma ba\\u015Far\\u0131s\\u0131z oldu. Sistem y\\u00F6neticinize ba\\u015Fvurun.\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=Giri\\u015F olu\\u015Fturuldu\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=F\\u0131rsat olu\\u015Fturuldu\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=G\\u00F6rev olu\\u015Fturuldu\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=Randevu olu\\u015Fturuldu\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=Resmi y\\u00FCklemek i\\u00E7in yaln\\u0131z bir b\\u00F6l\\u00FCm se\\u00E7in\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u0130\\u015Flem t\\u00FCr\\u00FC bulunamad\\u0131. Arka u\\u00E7 uyarlaman\\u0131z\\u0131 kontrol edin.\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=Veriler ba\\u015Fka kullan\\u0131c\\u0131 taraf\\u0131ndan de\\u011Fi\\u015Ftirildi. En son verileri almak i\\u00E7in Tamam\'\\u0131 se\\u00E7in.\r\n',
	"cus/crm/notes/i18n/i18n_zh_CN.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u6211\\u7684\\u8BB0\\u4E8B\\u672C\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u6CE8\\u91CA ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u65E0\\u6807\\u9898\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u5728\\u6B64\\u5904\\u63D2\\u5165\\u63A7\\u4EF6\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u65E0\\u6570\\u636E\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u672A\\u627E\\u5230\\u5339\\u914D\\u9879\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u672A\\u9009\\u62E9\\u6587\\u672C>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u5982\\u679C\\u672A\\u9009\\u62E9\\u533A\\u57DF\\uFF0C\\u5C06\\u5220\\u9664\\u6574\\u4E2A\\u6CE8\\u91CA\\u3002\\u5426\\u5219\\u5C06\\u53EA\\u5220\\u9664\\u9009\\u5B9A\\u533A\\u57DF\\u3002\\u662F\\u5426\\u8981\\u6267\\u884C\\u5220\\u9664\\uFF1F\r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u5728\\u6B64\\u5904\\u6DFB\\u52A0\\u6587\\u672C\\u3002\\u9009\\u62E9\\u201C\\u8FD4\\u56DE\\u201D\\u4E24\\u6B21\\u53EF\\u521B\\u5EFA\\u65B0\\u533A\\u57DF\\u3002\r\n#YMSG: Delete question for only selected data loss popup (delete note)\r\n#YMSG: Delete question for data loss popup (delete note)\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u6DFB\\u52A0\\u6CE8\\u91CA\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u6392\\u5E8F\\u6CE8\\u91CA\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u5220\\u9664\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u9644\\u52A0\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u521B\\u5EFA\\u4EFB\\u52A1\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u521B\\u5EFA\\u9884\\u7EA6\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u6DFB\\u52A0\\u56FE\\u50CF\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u6DFB\\u52A0\\u81F3\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u5171\\u4EAB\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u4FDD\\u5B58\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u53D6\\u6D88\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=\\u786E\\u5B9A\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u53D6\\u6D88\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u521B\\u5EFA\\u9884\\u7EA6\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u5220\\u9664\\u6CE8\\u91CA\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u7531\\u4E8E\\u51FA\\u73B0\\u7F51\\u7EDC\\u9519\\u8BEF\\uFF0C\\u540C\\u6B65\\u5931\\u8D25\\u3002\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u53EF\\u91CD\\u590D\\u6267\\u884C\\u540C\\u6B65\\u3002\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u7531\\u4E8E\\u53D1\\u751F\\u5F02\\u5E38\\uFF0C\\u65E0\\u6CD5\\u4FDD\\u5B58\\u4E0A\\u6B21\\u6267\\u884C\\u7684\\u66F4\\u6539\\u3002\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u53EF\\u653E\\u5F03\\u8FD9\\u4E9B\\u66F4\\u6539\\u3002\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u6392\\u5E8F\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u5B57\\u6BCD\\u987A\\u5E8F\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u65E5\\u671F\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u521B\\u5EFA\\u4EFB\\u52A1\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u6807\\u9898\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u8F93\\u5165\\u6807\\u9898\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u6CE8\\u91CA\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u5230\\u671F\\u65E5\\u671F\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u4F18\\u5148\\u7EA7\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u79C1\\u4EBA\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u5BA2\\u6237\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u8054\\u7CFB\\u4EBA\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=\\u786E\\u5B9A\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u53D6\\u6D88\r\n\r\n#XTIT: Title of processtype dialog\r\nPROCESS_TYPE=\\u9009\\u62E9\\u4EA4\\u6613\\u7C7B\\u578B\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u6DFB\\u52A0\\u81F3\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u5C06\\u6B64\\u6CE8\\u91CA\\u6DFB\\u52A0\\u5230\\u4E1A\\u52A1\\u5BF9\\u8C61\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=\\u786E\\u5B9A\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u53D6\\u6D88\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u673A\\u4F1A\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u9009\\u62E9\\u673A\\u4F1A\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u6807\\u9898\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u8F93\\u5165\\u6807\\u9898\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u5185\\u5BB9\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u5F00\\u59CB\\u65E5\\u671F\\u548C\\u65F6\\u95F4\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u7ED3\\u675F\\u65E5\\u671F\\u548C\\u65F6\\u95F4\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u5168\\u5929\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u79C1\\u4EBA\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u5BA2\\u6237\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u8054\\u7CFB\\u4EBA\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=\\u786E\\u5B9A\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u53D6\\u6D88\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u9009\\u62E9\\u5BA2\\u6237\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u9009\\u62E9\\u8054\\u7CFB\\u4EBA\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u6309\\u5BA2\\u6237\\u6570\\u636E\\u8FC7\\u6EE4\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u975E\\u5E38\\u9AD8\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u9AD8\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u4E2D\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u4F4E\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u6280\\u672F\\u9519\\u8BEF\\u6D88\\u606F\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u540E\\u7AEF\\u540C\\u6B65\\u4ECD\\u5728\\u8FDB\\u884C\\u4E2D\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u540E\\u7AEF\\u540C\\u6B65\\u6210\\u529F\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u5DF2\\u653E\\u5F03\\u66F4\\u6539\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u521B\\u5EFA\\u6CE8\\u91CA\\u5931\\u8D25\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u521B\\u5EFA\\u6CE8\\u91CA\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u5220\\u9664\\u6CE8\\u91CA\\u5931\\u8D25\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u5220\\u9664\\u6CE8\\u91CA\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u66F4\\u65B0\\u6CE8\\u91CA\\u5931\\u8D25\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u66F4\\u65B0\\u6CE8\\u91CA\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u5DF2\\u6210\\u529F\\u66F4\\u65B0\\u6807\\u9898\\u4E3A "{0}" \\u7684\\u673A\\u4F1A  \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u66F4\\u65B0\\u6807\\u9898\\u4E3A "{0}" \\u7684\\u673A\\u4F1A\\u5931\\u8D25 \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u66F4\\u65B0\\u673A\\u4F1A\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u521B\\u5EFA\\u5931\\u8D25\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u7684\\u521B\\u5EFA\\u64CD\\u4F5C\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u6761\\u76EE\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u673A\\u4F1A\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u4EFB\\u52A1\\u5DF2\\u521B\\u5EFA\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u9884\\u7EA6\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u4EC5\\u9009\\u62E9\\u4E00\\u4E2A\\u533A\\u57DF\\u6765\\u4E0A\\u8F7D\\u56FE\\u50CF\r\n\r\n#YMSG: no transaction types  present\r\nFOLLOWUPERROR=\\u672A\\u627E\\u5230\\u4E8B\\u52A1\\u7C7B\\u578B\\u3002\\u8BF7\\u68C0\\u67E5\\u540E\\u7AEF\\u5B9A\\u5236\\u3002\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during account editing\r\nMSG_CONFLICTING_DATA=\\u5176\\u4ED6\\u7528\\u6237\\u5DF2\\u66F4\\u6539\\u6570\\u636E\\u3002\\u8BF7\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u83B7\\u53D6\\u6700\\u65B0\\u6570\\u636E\\u3002\r\n',
	"cus/crm/notes/i18n/i18n_zh_CN_.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n# XTIT,40: Application title\r\nSHELL_TITLE=\\u6211\\u7684\\u8BB0\\u4E8B\\u672C\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u6CE8\\u91CA ({0})\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u65E0\\u6807\\u9898\r\n#XFLD, 30: this is the place holder dummy in the detail page\r\nDETAIL_TEXT=\\u5728\\u6B64\\u5904\\u63D2\\u5165\\u63A7\\u4EF6\r\n\r\n#XFLD,20: No Data text after loading list\r\nNO_DATA_TEXT=\\u65E0\\u6570\\u636E\r\n\r\n#XFLD,20: No Data text when loading/searching list\r\nLOADING_TEXT=\\u52A0\\u8F7D\\u4E2D...\r\n\r\n#XFLD,20: No Data text after searching list\r\nNO_MATCHING_ITEMS=\\u672A\\u627E\\u5230\\u5339\\u914D\\u9879\r\n\r\n#YMSG, 30: Default EMail body text\r\nEMAIL_NO_TEXT=<\\u672A\\u9009\\u62E9\\u6587\\u672C>\r\n\r\n#YMSG: Delete question for data loss popup (delete note)\r\nDELETE_NOTE_QUESTION=\\u5982\\u679C\\u672A\\u9009\\u62E9\\u533A\\u57DF\\uFF0C\\u5C06\\u5220\\u9664\\u6574\\u4E2A\\u6CE8\\u91CA\\u3002\\u5426\\u5219\\u5C06\\u53EA\\u5220\\u9664\\u9009\\u5B9A\\u533A\\u57DF\\u3002\\u662F\\u5426\\u8981\\u6267\\u884C\\u5220\\u9664\\uFF1F\r\n#YMSG, 30: Text for an empty section in detail page\r\nSECTION_NO_DATA_TEXT=\\u5728\\u6B64\\u5904\\u6DFB\\u52A0\\u6587\\u672C\\u3002\\u9009\\u62E9\\u201C\\u8FD4\\u56DE\\u201D\\u4E24\\u6B21\\u53EF\\u521B\\u5EFA\\u65B0\\u533A\\u57DF\\u3002\r\n\r\n#XBUT: Button to add a new note\r\nBUTTON_ADD_NOTE=\\u6DFB\\u52A0\\u6CE8\\u91CA\r\n#XBUT: Button to sort notes\r\nBUTTON_SORT_NOTES=\\u6392\\u5E8F\\u6CE8\\u91CA\r\n\r\n#XBUT: Button to delete one or more sections of the selected note\r\nDETAIL_BUTTON_DELETE=\\u5220\\u9664\r\n#XBUT: Button to attach a document to a note\r\nDETAIL_BUTTON_ATTACH=\\u9644\\u52A0\r\n#XBUT: Button to create a task with the note as the basis content\r\nDETAIL_BUTTON_CREATETASK=\\u521B\\u5EFA\\u4EFB\\u52A1\r\n#XBUT: Button to create an appointment with the note as the basis content\r\nDETAIL_BUTTON_CREATEAPPOINTMENT=\\u521B\\u5EFA\\u9884\\u7EA6\r\n#XBUT: Button to add a Image to a section of the note\r\nDETAIL_BUTTON_ADDPICTURE=\\u6DFB\\u52A0\\u56FE\\u50CF\r\n#XBUT: Button to add a note to a CRM object\r\nDETAIL_BUTTON_ADDTO=\\u6DFB\\u52A0\\u81F3\r\n#XBUT: Button to share the note\r\nDETAIL_BUTTON_SHARE=\\u5171\\u4EAB\r\n#XBUT: Button to save the note\r\nDETAIL_BUTTON_SAVE=\\u4FDD\\u5B58\r\n#XBUT: Button to cancel sharing\r\nDETAIL_BUTTON_CANCEL=\\u53D6\\u6D88\r\n#XBUT: Button to delete note\r\nDELETE_NOTE_BUTTON_OK=\\u786E\\u5B9A\r\n#XBUT: Button to cancel the note deletion\r\nDELETE_NOTE_BUTTON_CANCEL=\\u53D6\\u6D88\r\n\r\n#XTIT: this is the title for create appointment dialog\r\nCREATE_APPOINTMENT_TITLE=\\u521B\\u5EFA\\u9884\\u7EA6\r\n#XTIT: This is the title for data loss popup (delete note)\r\nDELETE_NOTE_TITLE=\\u5220\\u9664\\u6CE8\\u91CA\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nNETWORK_ERROR_MSG=\\u7531\\u4E8E\\u51FA\\u73B0\\u7F51\\u7EDC\\u9519\\u8BEF\\uFF0C\\u540C\\u6B65\\u5931\\u8D25\\u3002\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u53EF\\u91CD\\u590D\\u6267\\u884C\\u540C\\u6B65\\u3002\r\n#YMSG, 200: Message in the error message dialog for network errors\r\nEXCEPTION_ERROR_MSG=\\u7531\\u4E8E\\u53D1\\u751F\\u5F02\\u5E38\\uFF0C\\u65E0\\u6CD5\\u4FDD\\u5B58\\u4E0A\\u6B21\\u6267\\u884C\\u7684\\u66F4\\u6539\\u3002\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u53EF\\u653E\\u5F03\\u8FD9\\u4E9B\\u66F4\\u6539\\u3002\r\n\r\n#XTIT: Title for the sorting selection popover (sorts element in the master list)\r\nSORTING_POPOVER_TITLE=\\u6392\\u5E8F\r\n#XLST: Item: alphabetical sorting\r\nSORTING_POPOVER_ALPHABETICAL=\\u5B57\\u6BCD\\u987A\\u5E8F\r\n#XLST: Item: date sorting\r\nSORTING_POPOVER_DATE=\\u65E5\\u671F\r\n\r\n#XTIT: Title of the dialog to create a task\r\nCREATE_TASK_TITLE=\\u521B\\u5EFA\\u4EFB\\u52A1\r\n#XFLD, 30: The title of a task\r\nCREATE_TASK_ATTR_TITLE=\\u6807\\u9898\r\n#YMSG: Placeholder of the title input field\r\nCREATE_TASK_ATTR_TITLE_PLACEHOLDER=\\u8F93\\u5165\\u6807\\u9898\r\n#XFLD, 30: The note to be attached to a task\r\nCREATE_TASK_ATTR_NOTE=\\u6CE8\\u91CA\r\n#XFLD, 30: The due date of a task\r\nCREATE_TASK_ATTR_DATE=\\u5230\\u671F\\u65E5\\u671F\r\n#XFLD, 30: The priority of a task\r\nCREATE_TASK_ATTR_PRIORITY=\\u4F18\\u5148\\u7EA7\r\n#XFLD, 30: The private flag of a task\r\nCREATE_TASK_ATTR_PRIVATE=\\u79C1\\u4EBA\r\n#XFLD, 30: The account information of a task\r\nCREATE_TASK_ATTR_ACCOUNT=\\u5BA2\\u6237\r\n#XFLD, 30: The contact information of a task\r\nCREATE_TASK_ATTR_CONTACT=\\u8054\\u7CFB\\u4EBA\r\n#XBUT: Button to confirm the creation of a task\r\nCREATE_TASK_OK=\\u786E\\u5B9A\r\n#XBUT: Button to cancel the creation of a task\r\nCREATE_TASK_CANCEL=\\u53D6\\u6D88\r\n\r\n\r\n#XTIT: Title of add to dialog\r\nTITLE_ADDTO=\\u6DFB\\u52A0\\u81F3\r\n#YMSG: Label of the text area with a note\r\nADDTO_NOTE_LABEL=\\u5C06\\u6B64\\u6CE8\\u91CA\\u6DFB\\u52A0\\u5230\\u4E1A\\u52A1\\u5BF9\\u8C61\r\n#XBUT: Button to confirm the add to dialog\r\nADD_TO_OK=\\u786E\\u5B9A\r\n#XBUT: Button to cancel the add to dialog\r\nADD_TO_CANCEL=\\u53D6\\u6D88\r\n#XTIT: Title of opportunity \r\nTITLE_OPPORTUNITY_OPTION=\\u673A\\u4F1A\r\n#XTIT: Title of select opportunity page \r\nTITLE_SELECT_OPPORTUNITY=\\u9009\\u62E9\\u673A\\u4F1A\r\n#YMSG: Placeholder of the opportunity search bar\r\nOPPORTUNITY_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Label description of the create appointment dialog\r\nCREATE_APPOINTMENT_DESCRIPTION_LABEL=\\u6807\\u9898\r\n#YMSG: Placeholder of the Description input field\r\nCREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER=\\u8F93\\u5165\\u6807\\u9898\r\n#YMSG: Label content of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTENT_LABEL=\\u5185\\u5BB9\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_START_DATE_LABEL=\\u5F00\\u59CB\\u65E5\\u671F\\u548C\\u65F6\\u95F4\r\n#YMSG: Label start date of the create appointment dialog\r\nCREATE_APPOINTMENT_END_DATE_LABEL=\\u7ED3\\u675F\\u65E5\\u671F\\u548C\\u65F6\\u95F4\r\n#YMSG: Label all day of the create appointment dialog\r\nCREATE_APPOINTMENT_ALL_DAY_LABEL=\\u5168\\u5929\r\n#YMSG: Label private of the create appointment dialog\r\nCREATE_APPOINTMENT_PRIVATE_LABEL=\\u79C1\\u4EBA\r\n#YMSG: Label account of the create appointment dialog\r\nCREATE_APPOINTMENT_ACCOUNT_LABEL=\\u5BA2\\u6237\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CONTACT_LABEL=\\u8054\\u7CFB\\u4EBA\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_OK_LABEL=\\u786E\\u5B9A\r\n#YMSG: Label contact of the create appointment dialog\r\nCREATE_APPOINTMENT_CANCEL_LABEL=\\u53D6\\u6D88\r\n#XTIT: Title of select account dialog\r\nSELECT_ACCOUNT_DIALOG_TITLE=\\u9009\\u62E9\\u5BA2\\u6237\r\n#XTIT: Title of select contact dialog \r\nSELECT_CONTACT_DIALOG_TITLE=\\u9009\\u62E9\\u8054\\u7CFB\\u4EBA\r\n#YMSG: Information about filter value dependency in the select contact dialog\r\nCONTACT_SEARCH_FILTERED=\\u6309\\u5BA2\\u6237\\u6570\\u636E\\u8FC7\\u6EE4\r\n#YMSG: Placeholder of the contact search bar\r\nCONTACT_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Placeholder of the account search bar\r\nACCOUNT_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Placeholder of the note search bar\r\nNOTE_SEARCH_PLACEHOLDER=\\u641C\\u7D22\r\n#YMSG: Display value of the priority "Very High"\r\nPRIORITY_VERY_HIGH=\\u975E\\u5E38\\u9AD8\r\n#YMSG: Display value of the priority "High"\r\nPRIORITY_HIGH=\\u9AD8\r\n#YMSG: Display value of the priority "Medium"\r\nPRIORITY_MEDIUM=\\u4E2D\r\n#YMSG: Display value of the priority "Low"\r\nPRIORITY_LOW=\\u4F4E\r\n\r\n#YMSG: 30, Technical error message\r\nTECHNICAL_ERROR_MESSAGE=\\u6280\\u672F\\u9519\\u8BEF\\u6D88\\u606F\r\n#YMSG: 30, Info message, that the synchronization with the backend is still ongoing. \r\nMSG_SYNCHRONIZATION_ONGOING=\\u540E\\u7AEF\\u540C\\u6B65\\u4ECD\\u5728\\u8FDB\\u884C\\u4E2D\r\n#YMSG: 30, Success message after the trying to reestablish the synchronization with the backend\r\nMSG_SYNCHRONIZATION_SUCCEEDED=\\u540E\\u7AEF\\u540C\\u6B65\\u6210\\u529F\r\n#YMSG: 30, Success message after the changes were discarded\r\nMSG_CHANGES_DISCARDED=\\u5DF2\\u653E\\u5F03\\u66F4\\u6539\r\n#YMSG: 30, Error message in case of creation of note section fails\r\nMSG_CREATION_NOTE_FAILED=\\u521B\\u5EFA\\u6CE8\\u91CA\\u5931\\u8D25\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_CREATION_NOTE_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u521B\\u5EFA\\u6CE8\\u91CA\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Error message in case of deletion of note section fails\r\nMSG_DELETION_NOTE_FAILED=\\u5220\\u9664\\u6CE8\\u91CA\\u5931\\u8D25\r\n#YMSG: Long error message in case of deletion of note section fails\r\nMSG_LONG_DELETION_NOTE_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u5220\\u9664\\u6CE8\\u91CA\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Error message in case of updating of note teaser text fails\r\nMSG_UPDATING_TEASER_FAILED=\\u66F4\\u65B0\\u6CE8\\u91CA\\u5931\\u8D25\r\n#YMSG: Error message in case of updating of note teaser text fails\r\nMSG_LONG_UPDATING_TEASER_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u66F4\\u65B0\\u6CE8\\u91CA\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Success message in case of updating of opportunity succeeded\r\nMSG_UPDATING_OPPORTUNITY_SUCCEEDED=\\u5DF2\\u6210\\u529F\\u66F4\\u65B0\\u6807\\u9898\\u4E3A "{0}" \\u7684\\u673A\\u4F1A \r\n#YMSG: 30, Error message in case of updating of opportunity fails\r\nMSG_UPDATING_OPPORTUNITY_FAILED=\\u66F4\\u65B0\\u6807\\u9898\\u4E3A "{0}" \\u7684\\u673A\\u4F1A\\u5931\\u8D25 \r\n#YMSG: Error message in case of updating of opportunity fails\r\nMSG_LONG_UPDATING_OPPORTUNITY_FAILED=\\u5728\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u66F4\\u65B0\\u673A\\u4F1A\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n#YMSG: 30, Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_CREATION_OBJECT_FAILED=\\u521B\\u5EFA\\u5931\\u8D25\r\n#YMSG: Error message in case of updating of an object, e.g. task,opportunity fails\r\nMSG_LONG_CREATION_OBJECT_FAILED=\\u540E\\u7AEF\\u7CFB\\u7EDF\\u4E2D\\u7684\\u521B\\u5EFA\\u64CD\\u4F5C\\u5931\\u8D25\\u3002\\u8BF7\\u8054\\u7CFB\\u7CFB\\u7EDF\\u7BA1\\u7406\\u5458\\u3002\r\n\r\n#YMSG: 30, Success message in case of updating of an object, e.g. JAM, Picture\r\nMSG_CREATION_OBJECT_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u6761\\u76EE\r\n#YMSG: 30, Success message in case of updating of opportunity \r\nMSG_UPDATING_OPPORTUNITY_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u673A\\u4F1A\r\n#YMSG: 30, Success message in case of updating of task\r\nMSG_UPDATING_TASK_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u4EFB\\u52A1\r\n#YMSG: 30, Success message in case of updating of appointment\r\nMSG_UPDATING_APPOINTMENT_SUCCESS=\\u5DF2\\u521B\\u5EFA\\u9884\\u7EA6\r\n\r\n#YMSG: 30, Error message when add picture button is pressed and more than one section is selected\r\nMSG_SELECT_ONE_SECTION=\\u4EC5\\u9009\\u62E9\\u4E00\\u4E2A\\u533A\\u57DF\\u6765\\u4E0A\\u8F7D\\u56FE\\u50CF\r\n',
	"cus/crm/notes/util/DomHelper.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.util.DomHelper");

/**
 * Util object to handle the DOM
 */
cus.crm.notes.util.DomHelper = {
	
	/**
	 * Using jquery remove oldClass and add new class to the element identify by id
	 * 
	 * @param id
	 * @param oldClass
	 * @param newClass
	 */
	replaceCssClassById : function(id, oldClass, newClass) {
		jQuery.sap.delayedCall(20, this, function () {
			$(id).removeClass(oldClass).addClass(newClass);
		});
	}
};
},
	"cus/crm/notes/util/Formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("sap.ca.ui.model.type.Time");

jQuery.sap.declare("cus.crm.notes.util.Formatter");

cus.crm.notes.util.Formatter = {

	/**
	 * Converts from a Javascript date into a string with Format
	 * YYYY-MM-DDTHH:MM:SS e.g. 2013-09-04T04:00:00
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getAbapDate : function(datetime) {
		// TODO search for a better way to format the date in abap format
		return datetime.getUTCFullYear() + '-'
				+ (new Number(datetime.getUTCMonth()) + 1) + '-'
				+ datetime.getUTCDate() + 'T' + datetime.getUTCHours() + ':'
				+ datetime.getUTCMinutes() + ':' + datetime.getUTCSeconds();
	},
	
	/**
	 * Converts from two Javascript dates (one for the date and one for the time) into
	 * a string with Format: YYYY-MM-DDTHH:MM:SS e.g. 2013-09-04T04:00:00
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getAbapDateTime : function(date, time) {
		// TODO search for a better way to format the date in abap format
		return date.getUTCFullYear() + '-'
				+ (new Number(date.getUTCMonth()) + 1) + '-'
				+ date.getUTCDate() + 'T' + time.getUTCHours() + ':'
				+ time.getUTCMinutes() + ':' + time.getUTCSeconds();
	},
	
	/**
	 * Converts from a Javascript date into a string with Format
	 * PTHHHMMMSSS e.g. PT16H00M00S
	 * 
	 * @param datetime
	 * @returns {String}
	 */
	getAbapTime : function(datetime) {
		// TODO search for a better way to format the date in abap format
		return 'PT' + datetime.getUTCHours() + 'H' + datetime.getUTCMinutes() + 'M'
				+ datetime.getUTCSeconds() + 'S';
	},
	
	weightedvolume : function(value, value1)
	{
		 var val =  value * value1* 1.00  / 100.00 ;
		  
	    return val;
	},
	
	pictureUrlFormatter : function (mediaUrl) {
	    return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
	},
	
	sectionDate : function (dateTime) {
		if (dateTime) {
			var dateFormat = sap.ui.core.format.DateFormat.getInstance({style: "long"}); 
     	    var locale = new sap.ui.core.LocaleData(sap.ui.getCore().getConfiguration().getLocale());
     	    var timePattern = locale.getTimePattern("short");
     	    var timeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: timePattern });
		    return dateFormat.format(dateTime) + " " + timeFormat.format(dateTime);			
		} else {
			return dateTime;
		}
	},
	
	teaserText : function (teaser) {
		if (teaser === "") {
			teaser = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DETAIL_TITLE");
			return teaser;
		} else {
		  return teaser ;
		}
	}

};

},
	"cus/crm/notes/util/Schema.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.util.Schema");

cus.crm.notes.util.Schema = {
		
		_getEntityAnnotation : function(oModel, sAnnotationName,
				sEntityName) {
			// retrieve the metadata of the passed OData model
			var oModelMetadata = oModel.getServiceMetadata();
			// check for proper metadata structure
			if ((oModelMetadata != null)
					&& (oModelMetadata.dataServices != null)
					&& (oModelMetadata.dataServices.schema != null)
					&& (oModelMetadata.dataServices.schema.length > 0)
					&& (oModelMetadata.dataServices.schema[0].entityType != null)) {
				// determine the annotation by name using the first
				// annotated entity
				var entityTypes = oModelMetadata.dataServices.schema[0].entityType;
				// loop the entities
				for ( var i = 0; i < entityTypes.length; i++) {
					if (sEntityName === entityTypes[i].name
							&& entityTypes[i].extensions != null)
						// loop the annotations of the the entity
						for ( var j = 0; j < entityTypes[i].extensions.length; j++) {
							if (entityTypes[i].extensions[j].name === sAnnotationName)
								return entityTypes[i].extensions[j].value;
						}

				}
			}
			return null;
		},

		_getServiceSchemaVersion : function(oModel, sEntityName) { 
			var version = this._getEntityAnnotation(oModel,
					"service-schema-version", sEntityName);
			// defaults to initial service schema version (1)
			return (version != null) ? version : "1";
		},

		_getServiceVersion : function(oModel, sEntityName) {
			var version = this._getEntityAnnotation(oModel,
					"service-version", sEntityName);
			// defaults to initial service version (1)
			return (version != null) ? parseInt(version) : 1;
		}
      
	
};
},
	"cus/crm/notes/util/Util.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.util.Util");

cus.crm.notes.util.Util = {
	
 refreshHeaderETag : function(sPath,oController){
	 
	 var oModel = oController.oModel;
	 
	 if(oModel.getContext("/" + sPath)){
	        oModel.deleteCreatedEntry(oModel.getContext("/" + sPath));	 
	 }
	 	 oModel.createBindingContext("/"+ sPath,null,function(oContext){
			 
			 //dispatch the latest object to S3 view as well
			
			 
		 },true);
	 },
	 
	show412ErrorDialog : function(oController,fnOKCallback){
		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
		},fnOKCallback);
	} 
	 
 
};
},
	"cus/crm/notes/view/AccountSelectDialog.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<SelectDialog\r\n        xmlns="sap.m"\r\n        xmlns:core="sap.ui.core"\r\n        id="AccountSelectDialog"\r\n        title="{i18n>SELECT_ACCOUNT_DIALOG_TITLE}"\r\n        noDataText="{i18n>ACCOUNT_SEARCH_PLACEHOLDER}"\r\n        multiSelect=""\r\n        items="{path : \'/AccountCollection\',  parameters: {expand: \'MainAddress\'}}"\r\n        confirm="selectAccount"\r\n        search="doSearchAccount">\r\n    <StandardListItem title="{name1}" description="{parts : [{path : \'MainAddress/city\'}, {\tpath : \'MainAddress/country\'}]}">\r\n        <customData>\r\n            <core:CustomData key="id" value="{accountID}"/>\r\n        </customData>\r\n    </StandardListItem>\r\n</SelectDialog>',
	"cus/crm/notes/view/AddToDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:ui="sap.ca.ui" xmlns:layout="sap.ui.layout" \n\tshowHeader="false" contentHeight="500em" \n\tleftButton="okAddToDialogButton"\n\trightButton="cancelAddToDialogButton">\n\t<content>\n\t\t<NavContainer initialPage="page1" afterNavigate="triggerOkButtonVisibility">\n\t\t\t<pages>\n\t\t\t\t<Page id="page1" title="{i18n>TITLE_ADDTO}">\n\t\t\t\t\t<content >\n\t\t\t\t\t\t<Label text="{i18n>ADDTO_NOTE_LABEL}:" class="sapMLabelBold sapMBtnPaddingLeft customPaddingTop sapMBtnPaddingRight" />\n\t\t\t\t\t\t<TextArea width="100%" height="10em" row="5" editable="true" value="{model>/text}" class="sapMBtnPaddingLeft sapMBtnPaddingRight"/>\n\t\t\t\t\t\t<layout:VerticalLayout width="93%" class="sapMBtnPaddingLeft sapMBtnPaddingRight">\n\t\t\t\t\t\t\t<core:ExtensionPoint name="addToOpportunityExtension">\n\t\t\t\t\t\t\t\t<StandardListItem title=\'{i18n>TITLE_OPPORTUNITY_OPTION}\' type="Active" icon="sap-icon://opportunity" iconInset="false" info=">" \n\t\t\t\t\t\t\t\t\tpress="navigateToOpportunities" />\n\t\t\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\t\t\t<core:ExtensionPoint name="addToItemExtension" />\n\t\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t\t</content>\n\t\t\t\t</Page>\n\t\t\t\t<Page id="page2" title="{i18n>TITLE_SELECT_OPPORTUNITY}" showNavButton="true" navButtonPress="navigateFromOpportunities">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<SearchField placeholder="{i18n>OPPORTUNITY_SEARCH_PLACEHOLDER}" showUnread="true"\n\t\t\t\t\t\t\tgrowingThreshold="5" growing="true" width="100%" \n\t\t\t\t\t\t\tsearch="doSearchOpportunity" />\n\t\t\t\t\t\t<core:ExtensionPoint name="addToOpportunityListExtension">\n\t\t\t\t\t\t\t<List id="opportunityList" items="{/Opportunities}"\n\t\t\t\t\t\t\t\tselect="_handleOpportunitySelect" showUnread="true"\n\t\t\t\t\t\t\t\tgrowingThreshold="5" growing="true">\n\t\n\t\t\t\t\t\t\t\t<core:ExtensionPoint name="addToOpportunityItemExtension">\n\t\t\t\t\t\t\t\t\t<ObjectListItem press="handleOpportunityPress"\n\t\t\t\t\t\t\t\t\t\ttype="Active" title="{Description}"\n\t\t\t\t\t\t\t\t\t\tnumber="{parts:[{path:\'ExpectedSalesVolume\'}], formatter:\'util.Formatter.weightedvolume\'}"\n\t\t\t\t\t\t\t\t\t\tnumberUnit="{CurrencyCode}">\n\t\t\t\t\t\t\t\t\t\t<attributes>\n\t\t\t\t\t\t\t\t\t\t\t<ObjectAttribute text="{ProspectName}" />\n\t\t\t\t\t\t\t\t\t\t\t<ObjectAttribute text="{path:\'ClosingDate\' , formatter: \'util.Formatter.Date\'}" />\n\t\t\t\t\t\t\t\t\t\t</attributes>\n\t\t\t\t\t\t\t\t\t\t<firstStatus>\n\t\t\t\t\t\t\t\t\t\t\t<ObjectStatus text="{UserStatusText}">\n\t\t\t\t\t\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t\t\t\t\t\t</firstStatus>\n\t\t\t\t\t\t\t\t\t</ObjectListItem>\n\t\t\t\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\t\t\t</List>\n\t\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\t</content>\n\t\t\t\t</Page>\n\t\t\t\t<core:ExtensionPoint name="addToPageExtension" />\n\t\t\t</pages>\n\t\t</NavContainer>\n\t</content>\n\t<endButton>\n        <Button id="cancelAddToDialogButton" text="{i18n>ADD_TO_CANCEL}" press="cancelAddToDialog" />\n    </endButton>\n</Dialog>\n',
	"cus/crm/notes/view/ContactSelectDialog.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<SelectDialog\r\n        xmlns="sap.m"\r\n        xmlns:core="sap.ui.core"\r\n        \r\n        title="{i18n>SELECT_CONTACT_DIALOG_TITLE}"\r\n        noDataText="{i18n>CONTACT_SEARCH_PLACEHOLDER}"\r\n        multiSelect=""\r\n        items="{path : \'/ContactCollection\',  parameters: {expand: \'Photo\'}}"\r\n        confirm="selectContact"\r\n        search="doSearchContact">\t\r\n\t<ObjectListItem press="selectContact" \r\n\t\t\t\t\ttype="Active"\r\n\t\t\t\t\ttitle="{fullName}"\r\n\t\t\t\t\tdescription="{company}"\r\n\t\t\t\t\ticon="{path:\'Photo/__metadata/media_src\', formatter:\'cus.crm.notes.util.Formatter.pictureUrlFormatter\'}">\r\n\t\t<attributes>\r\n\t\t\t<ObjectAttribute text="{company}" />\r\n\t\t\t<ObjectAttribute text="{function}" />\r\n\t\t\t<ObjectAttribute text="{department}"/>\r\n\t\t</attributes>\r\n\t\t<customData>\r\n\t    \t<core:CustomData key="id" value="{contactID}" />\r\n\t    \t<core:CustomData key="accountId" value="{accountID}" />\r\n\t    \t<core:CustomData key="accountName" value="{company}" />\r\n\t    </customData>\r\n\t</ObjectListItem>\r\n</SelectDialog>',
	"cus/crm/notes/view/CreateAppointmentDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog title="{i18n>CREATE_APPOINTMENT_TITLE}"\n\txmlns="sap.m"\n\txmlns:ui="sap.ca.ui"\n\txmlns:layout="sap.ui.layout"\n\trightButton="cancelCreateAppointmentDialog"\n\tclass="sapUiPopupWithPadding customDialog"\n\tcontentWidth="400px"\n\tstretch="{model>/isFullScreen}"\n\t>\n\t<content>\n\t\t<layout:VerticalLayout width="100%">\n\t\t\t<layout:content>\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_DESCRIPTION_LABEL}:" required="true" class="sapMLabelBold"/>\n\t\t\t\t<Input width="100%" placeholder="{i18n>CREATE_APPOINTMENT_DESCRIPTION_PLACEHOLDER}" type="Text" value="{model>/description}" id="appointmentDescriptionId"/>\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_CONTENT_LABEL}:" class="sapMLabelBold" />\n\t\t\t\t<TextArea width="100%" height="20em" cols="50" row="5" editable="true" value="{model>/text}" class="resizeNone"/>\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_START_DATE_LABEL}:" class="sapMLabelBold" />\n\t\t\t\t<layout:HorizontalLayout width="100%">\n\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t<ui:DatePicker class="customDatePicker" value="{ path:\'model>/startDateValue\', type:\'sap.ui.model.type.Date\', formatOptions: { style: \'medium\'} }" \n\t\t\t\t\t\t\tchange="onStartDateChanged" />\n\t\t\t\t\t\t<DateTimeInput class="customTimeInput" id="CreateAppointmentDialogStartTime" type="Time" visible="{model>/showTime}" \n\t\t\t\t\t\t\tvalue="{ path:\'model>/startTimeValue\', type:\'sap.ui.model.type.Time\', formatOptions: { style: \'short\'} }" \n\t\t\t\t\t\t\tchange="onStartTimeChanged" />\n\t\t\t\t\t</layout:content>\n\t\t\t\t</layout:HorizontalLayout>\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_END_DATE_LABEL}:" class="sapMLabelBold" />\n\t\t\t\t<layout:HorizontalLayout width="100%">\n\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t<ui:DatePicker class="customDatePicker" value="{ path:\'model>/endDateValue\', type:\'sap.ui.model.type.Date\', formatOptions: { style: \'medium\'} }"\n\t\t\t\t\t\t\tchange="onEndDateChanged" />\n\t\t\t\t\t\t<DateTimeInput class="customTimeInput" id="CreateAppointmentDialogEndTime" type="Time" visible="{model>/showTime}"\n\t\t\t\t\t\t\tvalue="{ path:\'model>/endTimeValue\', type:\'sap.ui.model.type.Time\', formatOptions: { style: \'short\'} }" \n\t\t\t\t\t\t\tchange="onEndTimeChanged" />\n\t\t\t\t\t</layout:content>\n\t\t\t\t</layout:HorizontalLayout>\t\t\t\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_ALL_DAY_LABEL}:" class="sapMLabelBold"/>\n\t\t\t\t<Switch enabled="true" state="{model>/allDayFlag}" change="handleDisplayTime" />\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_PRIVATE_LABEL}:" class="sapMLabelBold"/>\n\t\t\t\t<Switch enabled="true" state="{model>/privateFlag}" />\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_ACCOUNT_LABEL}:" class="sapMLabelBold" />\n\t\t\t\t<layout:HorizontalLayout id="accountHorizontalLayoutAppointment" class="customSelectField" width="100%">\n\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t<Input value="{model>/accountName}" showValueHelp="true" valueHelpRequest="displayAccounts" editable="false"\n\t\t\t\t\t\t \tclass="sapMInputBaseInner"/>\n\t\t\t\t\t\t<Button icon="sap-icon://sys-cancel-2" press="deleteAccount" visible="{model>/accountEntered}" type="Transparent"/>\t   \n\t\t\t\t\t</layout:content> \n\t        \t</layout:HorizontalLayout>\n\t\t\t\t<Label text="{i18n>CREATE_APPOINTMENT_CONTACT_LABEL}:" class="sapMLabelBold" />\n\t\t\t\t<layout:HorizontalLayout  id="contactHorizontalLayoutAppointment" class="customSelectField" width="100%">\n\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t<Input value="{model>/contactName}" showValueHelp="true" valueHelpRequest="displayContacts" editable="false" \n\t\t\t\t\t\t\tclass="sapMInputBaseInner" width="{model>/contactFieldWidth}"/>\t\t\n\t\t\t\t\t\t<Button icon="sap-icon://sys-cancel-2" press="deleteContact" visible="{model>/contactEntered}" type="Transparent"/>\t\n\t\t\t\t\t</layout:content>    \n\t        \t</layout:HorizontalLayout>\n        \t</layout:content>\n\t\t</layout:VerticalLayout>\n\t</content>\n\t<beginButton>\n\t\t<Button text="{i18n>CREATE_APPOINTMENT_OK_LABEL}" press="okCreateAppointmentDialog" />\n\t</beginButton>\n\t<endButton>\n\t\t<Button text="{i18n>CREATE_APPOINTMENT_CANCEL_LABEL}" press="cancelCreateAppointmentDialog" />\n\t</endButton>\n</Dialog>\n',
	"cus/crm/notes/view/CreateTaskDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog title="{i18n>CREATE_TASK_TITLE}"\n\txmlns="sap.m" \n\txmlns:ui="sap.ca.ui" \n\txmlns:core="sap.ui.core" \n\txmlns:layout="sap.ui.layout"\n\txmlns:html="http://www.w3.org/1999/xhtml"\n\trightButton="cancelCreateTaskDialogButton"\n\tclass="sapUiPopupWithPadding"\n\tcontentWidth="400px"\n\tstretch="{model>/isFullScreen}"\n\t>\n\t<content>\n\t\t<layout:VerticalLayout width="100%">\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_TITLE}:" required="true" class="sapMLabelBold" />\n\t\t\t<Input width="100%" placeholder="{i18n>CREATE_TASK_ATTR_TITLE_PLACEHOLDER}" type="Text" value="{model>/title}"  id="taskTitleId"/>\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_NOTE}:" class="sapMLabelBold" />\n\t\t\t<TextArea width="100%" height="20em" cols="50" row="5" editable="true" value="{model>/text}" class="resizeNone"/>\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_DATE}:" class="sapMLabelBold" />\n\t\t\t<ui:DatePicker width="100%" value="{ path:\'model>/dueDate\', type:\'sap.ui.model.type.Date\', formatOptions: { style: \'medium\'} }" />\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_PRIORITY}:" class="sapMLabelBold" />\n\t\t\t<Select selectedKey="{model>/priority}">\n\t\t\t\t<items>\n\t\t\t\t\t<core:Item key="1" text="{i18n>PRIORITY_VERY_HIGH}" />\t\t\t\t\t\n\t\t\t\t\t<core:Item key="3" text="{i18n>PRIORITY_HIGH}" />\t\t\t\t\t\n\t\t\t\t\t<core:Item key="5" text="{i18n>PRIORITY_MEDIUM}" />\n\t\t\t\t\t<core:Item key="9" text="{i18n>PRIORITY_LOW}" />\n\t\t\t\t</items>    \n\t\t\t</Select>\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_PRIVATE}:" class="sapMLabelBold"/>\n\t\t\t<Switch enabled="true" state="{model>/privateFlag}" />\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_ACCOUNT}:" class="sapMLabelBold" />\n\t\t\t<layout:HorizontalLayout id="accountHorizontalLayoutTask" class="customSelectField" width="100%">\n\t\t\t\t<layout:content>\n\t\t\t\t\t<Input value="{model>/accountName}" showValueHelp="true" valueHelpRequest="displayAccounts" editable="false"\n\t\t\t\t\t \tclass="sapMInputBaseInner" width="{model>/accountFieldWidth}"/>\n\t\t\t\t\t<Button icon="sap-icon://sys-cancel-2" press="deleteAccount" visible="{model>/accountEntered}" type="Transparent"/>\t   \n\t\t\t\t</layout:content> \n        \t</layout:HorizontalLayout>\n\t\t\t<Label text="{i18n>CREATE_TASK_ATTR_CONTACT}:" class="sapMLabelBold" />\n\t\t\t<layout:HorizontalLayout id="contactHorizontalLayoutTask" class="customSelectField" width="100%">\n\t\t\t\t<layout:content>\n\t\t\t\t\t<Input value="{model>/contactName}" showValueHelp="true" valueHelpRequest="displayContacts" editable="false" \n\t\t\t\t\t\tclass="sapMInputBaseInner" width="{model>/contactFieldWidth}"/>\t\t\n\t\t\t\t\t<Button icon="sap-icon://sys-cancel-2" press="deleteContact" visible="{model>/contactEntered}" type="Transparent"/>\t\n\t\t\t\t</layout:content>    \n        \t</layout:HorizontalLayout>\n\t\t</layout:VerticalLayout>\n\t</content>\n\t<beginButton>\n\t\t<Button text="{i18n>CREATE_TASK_OK}" press="okCreateTaskDialog" />\n\t</beginButton>\n\t<endButton>\n\t\t<Button text="{i18n>CREATE_TASK_CANCEL}" press="cancelCreateTaskDialog" />\n\t</endButton>\n</Dialog>\n',
	"cus/crm/notes/view/DataLossDialog.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog title="{i18n>DELETE_NOTE_TITLE}"\n\txmlns="sap.m"\n\txmlns:ui="sap.ca.ui"\n\txmlns:layout="sap.ui.layout"\n\trightButton="cancelDeleteSection"\n\tclass="sapUiPopupWithPadding customDialog"\n\tcontentWidth="400px"\n\thorizontalScrolling="false"\n\tstretch="{model>/isFullScreen}"\n\t>\n\t<content>\n\t\t<layout:VerticalLayout width="100%">\n\t\t\t<layout:content>\n\t\t       <Text text="" />\t\n\t\t    </layout:content>\n\t\t</layout:VerticalLayout>\t\t    \n\t</content>\n\t\n\t<beginButton>\n\t\t<Button id="NoteDeleteOkButton" text="{i18n>DELETE_NOTE_BUTTON_OK}" press="handleDeleteSection" />\n\t</beginButton>\n\t<endButton>\n\t\t<Button id="NoteDeleteCancelButton" text="{i18n>DELETE_NOTE_BUTTON_CANCEL}" press="cancelDeleteSection" />\n\t</endButton>\n</Dialog>\n',
	"cus/crm/notes/view/NetworkErrorDialog.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<Dialog xmlns="sap.m" xmlns:layout="sap.ui.layout" title="{i18n>ERROR_MESSAGE_DIALOG_TITLE}" type="Message">\r\n       <content>\r\n       \t\t<layout:VerticalLayout width="100%">\r\n\t         <!--    <Text text="{i18n>ERROR_MESSAGE_DIALOG_MSG}" /> -->  \r\n\t               <Text text="{ parts:[{path:\'i18n>TECHNICAL_ERROR_MESSAGE\'},{path : \'model>/message\'}], formatter : \'jQuery.sap.formatMessage" />\r\n            </layout:VerticalLayout>\r\n       </content>\r\n       <beginButton>\r\n            <Button text="{i18n>ERROR_MESSAGE_DIALOG_BUTTON_RETRY}" press="handleDialogRetry" />\r\n       </beginButton>\r\n       <endButton>\r\n            <Button text="{i18n>ERROR_MESSAGE_DIALOG_BUTTON_DISCARD_CHANGES}" press="handleDialogDiscard" />\r\n       </endButton>\r\n</Dialog>\r\n',
	"cus/crm/notes/view/ProcessTypeDialog.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<SelectDialog\r\n        xmlns="sap.m"\r\n        xmlns:core="sap.ui.core"\r\n        \r\n        title="{i18n>PROCESS_TYPE}"\r\n        noDataText="{i18n>LOADING_TEXT}"\r\n        multiSelect=""\r\n        items="{json>/ProcessTypes}"\r\n       \tsearch="searchProcess"\r\n        confirm="selectProcess">\r\n    <StandardListItem title="{json>Description}" description="{json>ProcessTypeCode}">\r\n        <customData>\r\n            <core:CustomData key="ProcessTypeCode" value="{json>ProcessTypeCode}"/>\r\n            <core:CustomData key="ProcessTypeDescription" value="{json>Description}" />\r\n            <core:CustomData key="PrivateFlag" value="{json>PrivateFlag}" />\r\n        </customData>\r\n    </StandardListItem>\r\n</SelectDialog>',
	"cus/crm/notes/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("cus.crm.notes.handler.ModelHandler");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("cus.crm.notes.util.Util");

sap.ca.scfld.md.controller.ScfldMasterController
		.extend(
				"cus.crm.notes.view.S2",
				{

					oModelHandler : null,

					/***********************************************************
					 * overriding functions of base class
					 **********************************************************/

					onInit : function() {

						var oView = this.getView();

						this.oModelHandler = new cus.crm.notes.handler.ModelHandler();

						// TODO Workaround, because in function
						// sap.ui.model.odata.ODataModel.prototype._isRefreshNeeded
						// is an unnecessary refresh
						oView.getModel()._isRefreshNeeded = function(oRequest) {
							if (oRequest.requestUri.indexOf("$batch") != -1
									&& oRequest.async == true) {
								return false;
							}

							return sap.ui.model.odata.ODataModel.prototype
									._isRefreshNeeded(oRequest);
						};

						// handle sorting here
						this.oSortingOptions = {
							alphabetical : {
								path : "TeaserText",
								descending : false
							},
							date : {
								path : "ChangedAt",
								descending : true
							},
						};
						this.oDefaultSorting = this.oSortingOptions.date;
						this.oCurrentSorting = this.oDefaultSorting;

						// subscribe for events triggered from S3 controller
						var oBus = sap.ui.getCore().getEventBus();
						oBus.subscribe("cus.crm.notes", "SectionChanged",
								this.handleSectionChanged, this);
						oBus.subscribe("cus.crm.notes", "DeleteNote",
								this.handleDeleteNote, this);

						// flags for handling deletion of empty notes
						this.bSectionChanged = false;
						this.bHeaderAdded = false;
						this.bHeaderAddedListed = false;

						// flags for routing control
						// indicates whether deletion/search has taken place and
						// first item has to be selected
						this.bSelectFirstItemAfterChange = false;
						// indicates whether adding has taken place and the
						// details of first item has to be shown
						this.bSelectFirstItemAfterAdd = false;

						// required for initial creation of empty note
						// indicates whether request to backend was done
						// in case of count==0 this is ommitted by model
						this.bRequestCompleted = false;
						
						// flag whether search is active
						this.bFilterActive = false;

						oView.getModel().attachRequestSent(
								this.handleRequestSent, this);
						oView.getModel().attachRequestCompleted(
								this.handleRequestCompleted, this);

						// force completion of S3 batch queue, before executing
						// refresh of S2 master list
						this.oMHFHelper = this.oApplicationFacade.oApplicationImplementation.oMHFHelper;
						this.fnSuperHandleMasterSearch = this.oMHFHelper.handleMasterSearch;

						// override event handler for master list refresh event
						this.oMHFHelper.handleMasterSearch = jQuery
								.proxy(
										function(oController, oEvent) {
											var oSearchEvent = jQuery.extend(
													{}, oEvent); // unfortunately original event gets somehow corrupted
											this.oModelHandler.emptyBatchCallback = jQuery
													.proxy(
															function() {
																this.oModelHandler.emptyBatchCallback = function() {
																}; // clear callback
																this.fnSuperHandleMasterSearch
																		.call(
																				this.oMHFHelper,
																				oController,
																				oSearchEvent);
															}, this);
										}, this);

						//make restoring of selected item in scfld switchable
						//in case of added note etc. we want to omit this behaviour
						this.bPreventSetStoredSelectedItem = false;
						this.fnSuperSetStoredSelectedItem = this.oApplicationFacade.oApplicationImplementation.setStoredSelectedItem;
						this.oApplicationFacade.oApplicationImplementation.setStoredSelectedItem = jQuery.proxy(function(oController) {
								if(this.bPreventSetStoredSelectedItem){
									this.bPreventSetStoredSelectedItem = false;
								} else {
									this.fnSuperSetStoredSelectedItem.call(this.oApplicationImplementation, this);
								}	
							}, this);
						
   					    this.getList().getBinding("items").attachChange(this.handleMasterListChanged, this);
   					    
   					 sap.ca.ui.utils.busydialog.releaseBusyDialog();
					},

					onExit : function() {
						this.checkDeleteAddedNote();
						// unsubscribe from events in order to prevent issues
						// after reentering from shell
						var oBus = sap.ui.getCore().getEventBus();
						oBus.unsubscribe("cus.crm.notes", "SectionChanged",
								this.handleSectionChanged, this);
						oBus.unsubscribe("cus.crm.notes", "DeleteNote",
								this.handleDeleteNote, this);
						this.getView().getModel().detachRequestCompleted(
								this.handleRequestCompleted, this);
						this.getView().getModel().detachRequestSent(
								this.handleRequestSent, this);
   					    this.getList().getBinding("items").detachChange(this.handleMasterListChanged, this);
						// unsubscribe scfld events causing issues after leaving
						this._oMasterListBinding.detachChange(
								this._onMasterListChanged, this);
						// reset to original handler function
						this.oMHFHelper.handleMasterSearch = this.fnSuperHandleMasterSearch;
						this.oApplicationFacade.oApplicationImplementation.setStoredSelectedItem = this.fnSuperSetStoredSelectedItem;
  
					},

					/**
					 * @override
					 * 
					 */
					onDataLoaded : function() {
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.onDataLoaded
								.call(this);
						//when using separate count request(isCountSupported===true) - no request completed is triggered 
						// and we have to add the initial empty note here 
						if (!this.bRequestCompleted){
							if (this.getList().getItems().length === 0){								
								this.addNote();
							}
						}
						this.bRequestCompleted = false;
						if (this.getList().getItems().length === 0){
							this.navToEmptyView();
						}

					},

					setListItem : function(oItem) {

						if (oItem === null) {
							return;
						}
						var path = oItem.getBindingContext().getPath();
						this.selectedNoteGuid = oItem.getModel().getProperty(
								path).NoteGuid;
						sap.ca.scfld.md.controller.ScfldMasterController.prototype.setListItem
								.call(this, oItem);
						if (!this.bIsReturningFromAddInSearch)
							this.checkDeleteAddedNote();
						else
							this.bIsReturningFromAddInSearch = false;
					},

					/**
					 * @override
					 * 
					 * @param oItem
					 * @param sFilterPattern
					 * @returns {*}
					 */
					applySearchPatternToListItem : function(oItem,
							sFilterPattern) {

						if (sFilterPattern.substring(0, 1) === "#") {
							var sTail = sFilterPattern.substr(1);
							var sDescr = oItem.getBindingContext().getProperty(
									"Name").toLowerCase();
							return sDescr.indexOf(sTail) === 0;
						} else {
							return sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPatternToListItem
									.call(null, oItem, sFilterPattern);
						}

					},

					/**
					 * @override
					 * 
					 * @param sFilterPattern
					 *            the content of the search field
					 * @param oBinding
					 *            the context binding of the list items to be
					 *            modified.
					 */
					applyBackendSearchPattern : function(sFilterPattern,
							oBinding) {
						this.checkDeleteAddedNote();	//Added to remove added note before searching
						
						this.bSelectFirstItemAfterChange = true;
						this.bFilterActive = (sFilterPattern != "");
						if (sFilterPattern != "") {
							// console.log(sFilterPattern);
							var oTeaserTextFilter = new sap.ui.model.Filter(
									"TeaserText",
									sap.ui.model.FilterOperator.Contains,
									sFilterPattern);
							var aFilters = [ oTeaserTextFilter ];
							oBinding.filter(aFilters);
							// force selection of first item after search
						} else {
							var aFilters = [];
							oBinding.filter(aFilters);
						}
					},

					/**
					 * @override
					 * 
					 */
					isBackendSearch : function() {
						return true;
					},
					
					/**
					 * @override
					 * 
					 * @param sContext
					 *          contains the hash provided via bookmark navigation Deeplink navigation with backend search
					 *          active: when navigating to the app via bookmark, the bookmarked item might not be part of the
					 *          initially loaded list items (usually the case for scenarios where more items exist in the
					 *          backend than shown at once in the list). The assumption in this case is that the backend search
					 *          is active in order to be able to retrieve further list items. If the check on the initial list
					 *          against the navigation context value gives no result, this method is being called. This method
					 *          needs to be overridden by apps where this scenario applies; the app has then to take care about
					 *          retrieving the correct item via backend search
					 */
					applyFilterFromContext : function(sContext) {
						//this.showEmptyView();
					},

					getHeaderFooterOptions : function() {
						var oHeaderFooterOptions = {
							sI18NMasterTitle : "MASTER_TITLE",
							sI18NSearchFieldPlaceholder : this
									.get_i18n_Text("NOTE_SEARCH_PLACEHOLDER"),
							oSortOptions : {
								aSortItems : [
										{
											key : this.oSortingOptions.alphabetical.path,
											text : this
													.get_i18n_Text("SORTING_POPOVER_ALPHABETICAL")
										},
										{
											key : this.oSortingOptions.date.path,
											text : this
													.get_i18n_Text("SORTING_POPOVER_DATE")
										} ],
								sSelectedItemKey : this.oCurrentSorting.path, // this.selectedSorter,
								onSortSelected : jQuery.proxy(this.handleSort,
										this)
							},
							onAddPress : jQuery
									.proxy(this.handleAddPress, this)
						};
						
						// EXTENSION POINT to be able to extend header footer
						// options
						/**
						 * @ControllerHook extHookGetHeaderFooterOptions is the
						 *                 controller hook where the
						 *                 headerFooterOptions can be extended.
						 *                 Attributes like master list title,
						 *                 sorting can be defined in addition to
						 *                 the existing headerFooterOptions
						 * 
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetHeaderFooterOptions
						 * @param {object}
						 *            oHeaderFooterOptions
						 * @return {void}
						 */
						if (this.extHookGetHeaderFooterOptions)
							this
									.extHookGetHeaderFooterOptions(oHeaderFooterOptions);
						
						return oHeaderFooterOptions;
					},
					
					navToEmptyView : function() {
						var oList = this.getList();
						oList.removeSelections();
					
						//only replace the hash here, adding another history entry for not found is bad, 
						//since if the user goes back in history he will end up getting forwarded again
						this.oRouter.navTo("noData", {
							viewTitle : "DETAIL_TITLE",
							languageKey : "NO_ITEMS_AVAILABLE"
						}, true);
						return this;
					},
					
					/***********************************************************
					 * event handlers
					 **********************************************************/
					
					handleMasterListChanged : function (oEvent) {
						var oList = this.getList();
						if (oList.getItems().length > 0) {
							if (this.bSelectFirstItemAfterChange) {
								oList.removeSelections(true); 
								if (jQuery.device.is.phone){
									oList.getItems()[0].setSelected(true);
								} else {
									this.selectFirstItem();									
								}
								this.bSelectFirstItemAfterChange = false;
								this.bPreventSetStoredSelectedItem = true;
							} else if (this.bSelectFirstItemAfterAdd) {
								this.selectFirstItem();
								this.bSelectFirstItemAfterAdd = false;	
								this.bPreventSetStoredSelectedItem = true;
							}
						}
					},
					
					handleRequestSent : function() {
						this.getList().setNoDataText(
								this.get_i18n_Text("LOADING_TEXT"));
					},

					handleRequestCompleted : function() {
						this.bRequestCompleted = true;
						
						if (this.bFilterActive) {
							this.getList().setNoDataText(
									this.get_i18n_Text("NO_MATCHING_ITEMS"));
						} else {
							this.getList().setNoDataText(
									this.get_i18n_Text("NO_DATA_TEXT"));
						}
					},

					handleAddPress : function() {
						this.oModelHandler.emptyBatchCallback = jQuery
								.proxy(
										function() {
											this.oModelHandler.emptyBatchCallback = function() {
											}; // clear function
											this.addNote(); // set new function
										}, this);
					},

					handleSort : function(sKey) {
						if (sKey === this.oSortingOptions.alphabetical.path) {
							this.oCurrentSorting = this.oSortingOptions.alphabetical;
						} else {
							this.oCurrentSorting = this.oSortingOptions.date;
						}
						this.updateSorting(this.oCurrentSorting.path,
								this.oCurrentSorting.descending, false);

					},

					handleSectionChanged : function(channelId, eventId, data) {
						this.bSectionChanged = data;

						if (this.bSectionChanged) {
							this.bSectionChanged = false;
							this.bHeaderAdded = false;
							this.bHeaderAddedListed = false;

							// section has been edited
							this.sAddedNoteGuid = undefined;
						}
					},

					handleDeleteNote : function(channelId, eventId, data) {

						var oModel = this.getView().getModel();
						
						// delete saved Note Guid
						var nGuid = oModel.getData(data.path).NoteGuid;
						if (nGuid === this.sAddedNoteGuid) {
							this.sAddedNoteGuid = undefined;
						}
						
						this.addDeleteNoteOperation(oModel, data.path);
						if (this.getList().getItems()
								&& this.getList().getItems().length === 1
								&& !this.bFilterActive) {
							this.addCreateNoteOperation(oModel);
						}
						var fnError = jQuery
								.proxy(
										function() {
											sap.ca.ui.message
													.showMessageBox({
														type : sap.ca.ui.message.Type.ERROR,
														message : this
																.get_i18n_Text("MSG_DELETION_NOTE_FAILED"),
														details : this
																.get_i18n_Text("MSG_LONG_DELETION_OBJECT_FAILED")
													});
										}, this);
						oModel.submitBatch(jQuery.proxy(function(oData,
								response, aErrorResponses) {
							if (aErrorResponses.length > 0) {
								fnError.call();
							} else {
								this.successBatchAdd(oData, 1);
								this.getList().getBinding("items").refresh();   //Refresh the list after delete, added after UI5 upgrade
								this.bSelectFirstItemAfterChange = true;
							}
						}, this), fnError, false);// execute synchronously

					},

					/***********************************************************
					 * helper functions
					 **********************************************************/

					get_i18n_Text : function(textName) {
						return this.oApplicationFacade.getResourceBundle().getText(textName);
					},

					updateSorting : function(sPath, bDescending, bRefresh) {
						var oList = this.getList();
						var oBinding = oList.getBinding("items");
						var oSorter = new sap.ui.model.Sorter(sPath,
								bDescending);
						oBinding.sort([ oSorter ]);
						if (bRefresh)
							oBinding.refresh();
					},

					addNote : function() {
						// switch off Searching ...
						if (this.bFilterActive) {
							 if (this._oMasterListBinding !== undefined) {
								 // delete Search string
								 this._oControlStore.oMasterSearchField.clear();						
								 this.handleSort(this.oSortingOptions.date.path);
								 // this.bIsReturningFromAddInSearch is used in function setListItem to manage
								 // the check of deletion of empty notes. When a search is successful (items>0)
								 // this.checkDeleteAddedNote() should be NOT called. Otherwise the newly added note 
								 // is deleted immediately ....
								 this.bIsReturningFromAddInSearch = (this.getList().getItems().length > 0);
							 }
						}
						
						var oModel = this.getView().getModel();
						this.addCreateNoteOperation(oModel);

						var fnError = jQuery
								.proxy(
										function() {
											sap.ca.ui.message
													.showMessageBox({
														type : sap.ca.ui.message.Type.ERROR,
														message : this
																.get_i18n_Text("MSG_CREATION_NOTE_FAILED"),
														details : this
																.get_i18n_Text("MSG_LONG_CREATION_NOTE_FAILED")
													});
										}, this);
						oModel.submitBatch(jQuery.proxy(function(oData,
								response, aErrorResponses) {
							if (aErrorResponses.length > 0) {
								fnError.call();
							} else {
								this.successBatchAdd(oData, 0);
								this.getList().getBinding("items").refresh();   //Refresh the list after add, added after UI5 upgrade
								this.bSelectFirstItemAfterAdd = true;
							}
						}, this), fnError, false);// execute synchronously

						// we might need the two following lines in the future
						// in case we have some sorting type that would push the
						// newest node away from the first position
						// if (this._oCurrentSorting !==
						// this._oSortingOptions.date)
						// this.updateSorting(this._oSortingOptions.date.path,
						// this._oSortingOptions.date.descending, false);

					},

					successBatchAdd : function(oData, batchOpIndex) {
						if (!oData.__batchResponses[batchOpIndex]) {
							return;
						}
						var oDataOp = oData.__batchResponses[batchOpIndex].__changeResponses[0].data;
						var sAddedNoteGuid = oDataOp.NoteGuid;
						if (this.sAddedNoteGuid === undefined) {
							// when addNote is pressed twice, the first added
							// note should be deleted
							this.sAddedNoteGuid = sAddedNoteGuid;
							this.sAddedNoteGuidStore = undefined;
						} else {
							this.sAddedNoteGuidStore = sAddedNoteGuid;
						}
						this.bHeaderAdded = true;
						this.oModelHandler.injectFirstSectionFromMaster(this.getView().getModel(), sAddedNoteGuid);
					},

					addDeleteNoteOperation : function(oModel, path) {
						var aChangeOperations = [];
						var oParams = {};
						var oEntry = {};
						var oOperation = oModel.createBatchOperation(path,
								"DELETE", oEntry, oParams);
						aChangeOperations.push(oOperation);
						oModel.addBatchChangeOperations(aChangeOperations);
					},

					addCreateNoteOperation : function(oModel) {
						var aChangeOperations = [];
						var oParams = {};
						var oEntry = {};
						oEntry.TeaserType = "T";
						oEntry.TeaserText = "";//this.get_i18n_Text("DETAIL_TITLE");
						var oOperation = oModel.createBatchOperation(
								'/NoteHeaders', "POST", oEntry, oParams);
						aChangeOperations.push(oOperation);
						oModel.addBatchChangeOperations(aChangeOperations);
					},

					checkDeleteAddedNote : function() {
						if (this.bHeaderAddedListed && !this.bSectionChanged) {
							this.bHeaderAddedListed = false;
							var oModel = undefined;
							var path = undefined;
							var list = this.getView().byId("list");
							var listItems = list.getItems();
							for ( var i = 0; i < listItems.length; i++) {
								var localGuid = listItems[i]
										.getBindingContext().getProperty().NoteGuid;
								if (localGuid === this.sAddedNoteGuid) {
									oModel = listItems[i].getBindingContext()
											.getModel();
									path = listItems[i].getBindingContext()
											.getPath();
									break;
								}
							}

							if (oModel === undefined) {
								// if search result is positive, newly added note is not available
								// check for deletion should be running next time again (next round)
								if (this.bFilterActive === true) {
									  this.bHeaderAddedListed = true;
								}
								return;
							}

							var oParams = {
								fnSuccess : function() {
								},
								fnError : jQuery
										.proxy(
												function() {
													sap.ca.ui.message
															.showMessageBox({
																type : sap.ca.ui.message.Type.ERROR,
																message : this
																		.get_i18n_Text("MSG_DELETION_NOTE_FAILED"),
																details : this
																		.get_i18n_Text("MSG_LONG_DELETION_OBJECT_FAILED")
															});
												}, this)
							};
							oModel.remove(path, oParams);
							this.getList().getBinding("items").refresh();   //Refresh the list after delete, added after UI5 upgrade

							if (this.sAddedNoteGuidStore === undefined) {
								this.sAddedNoteGuid = undefined;
								this.bHeaderAddedListed = false;
							} else {
								this.sAddedNoteGuid = this.sAddedNoteGuidStore;
								this.sAddedNoteGuidStore = undefined;
								// AddNote-Modus still active
								this.bHeaderAddedListed = true;
							}
							this.bSectionChanged = false;

						} else if (this.bHeaderAdded) {
							this.bHeaderAddedListed = true;
							this.bHeaderAdded = false;
						}
					},

				});

},
	"cus/crm/notes/view/S2.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core"\r\n\txmlns="sap.m" controllerName="cus.crm.notes.view.S2">\r\n\t<Page id="page" title="{i18n>MASTER_TITLE}">\r\n\t\t<content>\r\n\t\t\t<List id="list" \r\n\t\t\t\titems="{path: \'/NoteHeaders\', sorter: {path: \'ChangedAt\', descending: true}}"\r\n\t\t\t\tselectionChange="_handleSelect" \r\n\t\t\t\tmode="{device>/listMode}" \r\n                growingScrollToLoad="true"\r\n\t\t\t\tshowUnread="true" \r\n\t\t\t\tgrowingThreshold="20"\r\n\t\t\t\tgrowing="true">\r\n\t\t\t\t<!-- Extension Point to add additional note Item -->\r\n\t\t\t\t<core:ExtensionPoint name="noteItemExtension">\r\n\t\t\t\t\t<ObjectListItem id="MAIN_LIST_ITEM"\r\n\t                                press="_handleItemPress"\r\n\t                                type="{device>/listItemType}"\r\n\t\t\t\t\t\ttitle="{path:\'TeaserText\', formatter:\'cus.crm.notes.util.Formatter.teaserText\'}">\r\n\t\t\t\t\t\t<attributes>\r\n\t\t\t\t\t\t\t<ObjectAttribute\r\n\t\t\t\t\t\t\t\ttext="{\r\n\t\t\t\t\t\t\t\t\t\tpath:\'ChangedAt\',\r\n\t\t\t\t\t\t\t\t\t\t type:\'sap.ca.ui.model.type.Date\', \r\n\t\t\t\t\t\t\t\t\t\t formatOptions : { style:\'daysAgo\'}\r\n\t\t\t\t\t\t\t\t\t}" />\r\n\t\t\t\t\t\t\t\t<!-- Extension Point to add additional note attributes -->\t\r\n\t\t\t\t\t\t\t<core:ExtensionPoint name="noteAttributeExtension" />\r\n\t\t\t\t\t\t</attributes>\r\n\t\t\t\t\t</ObjectListItem>\r\n\t\t\t\t</core:ExtensionPoint>\r\n\t\t\t</List>\r\n\t\t</content>\r\n\t\t<footer>\r\n\t\t\t<Bar id="footer">\r\n\t\t\t</Bar>\r\n\t\t</footer>\r\n\t</Page>\r\n</core:View>\n',
	"cus/crm/notes/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("cus.crm.notes.control.SectionList");
jQuery.sap.require("cus.crm.notes.handler.ModelHandler");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("sap.ca.ui.model.type.Time");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("cus.crm.notes.util.Schema");
jQuery.sap.require("cus.crm.notes.util.Util");

// Used for image upload functionality
// define = undefined;
jQuery.sap.require("sap.ca.ui.JS.jquery-ui-widget");
jQuery.sap.require("sap.ca.ui.JS.jquery-iframe-transport");
jQuery.sap.require("sap.ca.ui.JS.jquery-fileupload");

sap.ca.scfld.md.controller.BaseDetailController
		.extend(
				"cus.crm.notes.view.S3",
				{

					oModelHandler : null,

					onExit : function() {
						// clean up on exit
						this.oModelHandler.onExit();

						// clean up dialogs
						if (this.oCreateAppointmentDialog) {
							this.oCreateAppointmentDialog.destroy();
						}
						if (this.oCreateTaskDialog) {
							this.oCreateTaskDialog.destroy();
						}
						if (this.oContactSelectDialog) {
							this.oContactSelectDialog.destroy();
						}
						if (this.oAddToDialog) {
							this.oAddToDialog.destroy();
						}
						if (this.oAccountSelectDialog) {
							this.oAccountSelectDialog.destroy();
						}
						if (this.oDataLossDialog) {
							this.oDataLossDialog.destroy();
						}
					},

					onInit : function() {
						// execute the onInit for the base class
						// BaseDetailController
						sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
								.call(this);

						this.oModelHandler = new cus.crm.notes.handler.ModelHandler();
						this.oModelHandler.networkErrorCallback = jQuery.proxy(
								this.openNetworkErrorDialog, this);
						this.oModelHandler.exceptionCallback = jQuery.proxy(
								this.openExceptionDialog, this);
						this.oModel = this.getView().getModel();

						this.oRouter
								.attachRouteMatched(
										jQuery
												.proxy(
														function(oEvent) {
															if (oEvent
																	.getParameter("name") === "detail") {
																this.oModelHandler
																		.attachView(
																				oEvent
																						.getParameter("arguments").contextPath,
																				this
																						.getView());
																
																if(this.getView().getModel().getProperty("/" + oEvent.getParameter("arguments").contextPath)){
																	this._saveETag(this.getView().getModel().getProperty("/" + oEvent.getParameter("arguments").contextPath).Etag);
																	}else{
																		
																		this.oModel.read("/NoteHeaders", null, null, false,
																				function(oData, resp){
																					
																		for (var k = 0; k < oData.results.length; k++) {
																			
																			
																				if("NoteHeaders('"+oData.results[k].NoteGuid+"')"==oEvent.getParameter("arguments").contextPath)
																					if(this._saveETag){
																					this._saveETag(oData.results[k].Etag);
																					}else{
																						this.sETag = oData.results[k].Etag;
																						
																					}
															
																		}
		
																	});
																	}
												
																this._oSectionList
																		.removeSelections(true);
																this.oHeaderFooterOptions.sDetailTitle = this.oModelHandler
																		.getTeaserText();
																this
																		.setHeaderFooterOptions(this.oHeaderFooterOptions);
																this._iTextAreaToFocus = 0;
																this._iTextAreaToFocusCursorPos = 0;

																// Invalidate if
																// coming back
																// from noData
																// as the
																// rerendering
																// is setting
																// all textarea
																// height to
																// zero
																jQuery.sap
																		.delayedCall(
																				20,
																				this,
																				function() {
																					if (this.noDataFlag) {
																						this.noDataFlag = false;
																						this._oSectionList
																								.invalidate();
																					}
																				});
															} else if (oEvent
																	.getParameter("name") === "noData") {
																this.noDataFlag = true;
															}
														}, this), this);

						// workaround: fixing exception on startup
						/*
						 * this.oApplicationImplementation.registerExitModule =
						 * function(fExitModule){ console.log("skipping
						 * registerExitModule"); };
						 */

						this._iAutoSaveTimeout = 30000; // 5s for test purposes
														// only
						this._iAutoSaveID = -1;
						this._bWaitingToAutoSave = false;

						this._isBlurCalled = false; // flag to indicate if
													// jQuery.blur was called to
													// enable scrolling after
													// split/merge on
													// touchscreen devices

						this._oSectionList = this.byId("sectionList");
						this._iTextAreaToFocus = -1;
						this._iTextAreaToFocusCursorPos = -1;
						this._oListOnAfterRenderingDelegate = {
							onAfterRendering : function() {
								if (this._oSectionList.getItems().length > 0
										&& this._iTextAreaToFocus >= 0) {
									// var $textArea =
									// this._oSectionList.getItems()[this._iTextAreaToFocus].$().find("textarea");
									// if(!jQuery.device.is.ipad){
									setTimeout(jQuery.proxy(this.handleFocus,
											this), 150);
									// }
								}
							}
						};
						this._oSectionList.addEventDelegate(
								this._oListOnAfterRenderingDelegate, this);

						// Footer options are now handled in the controller
						var that = this;
						this.oHeaderFooterOptions3UI = {
								buttonList : [
										{
											// sI18nBtnTxt :
											// this._get_i18n_Text("DETAIL_BUTTON_ADDPICTURE"),
											// onBtnPressed : function(evt) {
											// that.handleSectionAddPicture(evt);
											// }
											// }, {
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_DELETE"),
											onBtnPressed : function(evt) {
												that.displayDataLoss(evt);
											}
										},
										{
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_ADDTO"),
											onBtnPressed : function(evt) {
												that.openAddToDialog(evt);
											}
										},
										{
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_CREATEAPPOINTMENT"),
											onBtnPressed : function(evt) {
												that.navToAppointments(evt);
											},
										},
										{
											sI18nBtnTxt : this
													._get_i18n_Text("DETAIL_BUTTON_CREATETASK"),
											onBtnPressed : function(evt) {
												that.navToTasks(evt);
											}
										} ],
								oJamOptions : {
									oShareSettings : {
										object : {
											id : "",
											share : ""
										}
									},
									fGetShareSettings : function() {
										return {
											object : {
												id : "",
												share : that._getSelectedText()
											}
										};
									}
								},
								oEmailSettings : {
									// sSubject :
									// this._get_i18n_Text("EMAIL_HEADER"),
									// sRecepient :
									// this._get_i18n_Text("EMAIL_DEFAULT_RECEIVER"),
									fGetMailBody : function() {
										return that._getSelectedText();
									}
								},
								oAddBookmarkSettings : {
									icon : "sap-icon://Fiori2/F0006"
								},
								sDetailTitle : ""
							};

							this.oHeaderFooterOptions4UI = {
									buttonList : [
											{
												// sI18nBtnTxt :
												// this._get_i18n_Text("DETAIL_BUTTON_ADDPICTURE"),
												// onBtnPressed : function(evt) {
												// that.handleSectionAddPicture(evt);
												// }
												// }, {
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_DELETE"),
												onBtnPressed : function(evt) {
													that.displayDataLoss(evt);
												}
											},
											{
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_ADDTO"),
												onBtnPressed : function(evt) {
													that.openAddToDialog(evt);
												}
											},
											{
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_CREATEAPPOINTMENT"),
												onBtnPressed : function(evt) {
													that.navToAppointmentDialog(evt);
												},
											},
											{
												sI18nBtnTxt : this
														._get_i18n_Text("DETAIL_BUTTON_CREATETASK"),
												onBtnPressed : function(evt) {
													that.navToTaskDialog(evt);
												}
											} ],
									oJamOptions : {
										oShareSettings : {
											object : {
												id : "",
												share : ""
											}
										},
										fGetShareSettings : function() {
											return {
												object : {
													id : "",
													share : that._getSelectedText()
												}
											};
										}
									},
									oEmailSettings : {
										// sSubject :
										// this._get_i18n_Text("EMAIL_HEADER"),
										// sRecepient :
										// this._get_i18n_Text("EMAIL_DEFAULT_RECEIVER"),
										fGetMailBody : function() {
											return that._getSelectedText();
										}
									},
									oAddBookmarkSettings : {
										icon : "sap-icon://Fiori2/F0006"
									},
									sDetailTitle : ""
								};
							
							this.sBackendVersion = cus.crm.notes.util.Schema._getServiceSchemaVersion(this.oModel,"NoteHeader");
							this.oVersioningModel = new sap.ui.model.json.JSONModel({});
							this._loadVersionSpecificUI(this.sBackendVersion);


						
						// EXTENSION POINT to be able to extend header footer
						// options
						/**
						 * @ControllerHook extHookGetHeaderFooterOptions is the
						 *                 controller hook where the
						 *                 headerFooterOptions can be extended.
						 *                 Attributes like add note, delete note
						 *                 can be defined in addition to
						 *                 the existing headerFooterOptions
						 * 
						 * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetHeaderFooterOptions
						 * @param {object}
						 *            oHeaderFooterOptions
						 * @return {void}
						 */
						if (this.extHookGetHeaderFooterOptions)
							this
									.extHookGetHeaderFooterOptions(oHeaderFooterOptions);

						this.setHeaderFooterOptions(this.oHeaderFooterOptions);

					},

					_loadVersionSpecificUI : function(sBackendVersion){	
						
						
						if(parseFloat(sBackendVersion) >= 2){
							this.oHeaderFooterOptions = this.oHeaderFooterOptions4UI;
						}
						else{
							this.oHeaderFooterOptions = this.oHeaderFooterOptions3UI;
						}
						 
						 	
					},	
					
					_loadWave3UI :function()
					{
						
					},
					
					_loadWave4UI :function()
					{
						
					},
					


					handleFocus : function() {
						var $textArea = this._oSectionList.getItems()[this._iTextAreaToFocus]
								.$().find("textarea");
						/*
						 * use triggerHandler instead of focus() as bug reported
						 * in IE check doc in http://api.jquery.com/focus/
						 */

						$textArea.focus();
						// $textArea.triggerHandler("focus");
						$textArea.prop("selectionStart",
								this._iTextAreaToFocusCursorPos);
						$textArea.prop("selectionEnd",
								this._iTextAreaToFocusCursorPos);
					},

					navToSubview : function() {
						this.oRouter.navTo("subDetail",
								{
									contextPath : this.getView()
											.getBindingContext().sPath
											.substr(1)
								});
					},

					navToEmpty : function() {
						this.oRouter.navTo("noData");
					},

					destroy : function() {
						if (sap.ca.scfld.md.controller.BaseDetailController.prototype.destroy) {
							sap.ca.scfld.md.controller.BaseDetailController.prototype.destroy
									.apply(this);
						}
						this._oSectionList
								.removeEventDelegate(this._oListOnAfterRenderingDelegate);
						if (this._oNetworkErrorMessageDialog)
							this._oNetworkErrorMessageDialog.destroy();
						if (this.oSharingDialogComponent)
							this.oSharingDialogComponent.destroy();
					},
					checkEtag :function(bForceUpdate){

						 this.bForceUpdate = bForceUpdate;
				         
					       var nBackendVersion = parseFloat(this.sBackendVersion);
					       var oETag = null;
					        //INTEROP CHECK - for waves 6 and below bForceUpdate must not be honored
					        	
								if(nBackendVersion >= 2.0){
									oETag = {sETag : ((bForceUpdate) ? "*" : null)};
									
								}
								else{
									bForceUpdate = false;
									
								}
								
								
						 this.oETag = oETag;
						 
					},

					handleSectionChange : function(evt) {
						if (!this._isBlurCalled) {
							this._cancelAutoSave();
							var path = evt.getSource()
									.getBindingContext("json").getPath();

							this.checkEtag(false);
							this.oModelHandler.updateSection(path,false, this.oETag,this);
							this.refreshDetailTitle();
							// trigger event for New Changed
							sap.ui.getCore().getEventBus().publish(
									"cus.crm.notes", "SectionChanged", {
										context : true
									});
						} else {
							this._isBlurCalled = false;
						}
					},

					handleSectionLiveChange : function(evt) {
						this.checkEtag(false);
						var textArea = evt.getSource();
						var path = textArea.getBindingContext("json").getPath();
						var textValue = textArea.getValue();
						var iSplitPosition = textValue.indexOf("\n\n");
						var domRefTextArea = textArea.getDomRef();
						var textarea = $(domRefTextArea).find("textarea");

						var scrollDelegate = undefined;

						if (iSplitPosition != -1) { // Double return pressed
							var list = this.getView().byId("sectionList");
							var index = list.indexOfItem(textArea.getParent());

							this._cancelAutoSave();
							this._iTextAreaToFocus = index + 1;
							this._iTextAreaToFocusCursorPos = 0;
							// trigger event for New Changed
							sap.ui.getCore().getEventBus().publish(
									"cus.crm.notes", "SectionChanged", {
										context : true
									});

							this.oModelHandler.splitSection(path,
									iSplitPosition);
							this.refreshDetailTitle();
							setTimeout(this.enableScrolling(this.getPage()
									.getScrollDelegate()), 50);
						} else { // this is just a regular insert, we need to
									// run the autosave function.

							this._iTextAreaToFocusCursorPos = textarea
									.prop("selectionStart"); // keep cursor
																// pos in case
																// of
																// handleFocus
																// is triggered

							textarea[0].style.overflow = "auto";
							textarea[0].style.height = "100%";
							textarea[0].style.height = textarea[0].scrollHeight
									+ 'px';
							textarea[0].style.overflow = "hidden";

							// Need to store the scrollheight in the cuastom
							// data attribute
							// textArea.data('scrollValue',
							// textarea[0].scrollHeight);

							if (!this._bWaitingToAutoSave) {
								this._bWaitingToAutoSave = true;
								this._iAutoSaveID = setTimeout(jQuery.proxy(
										function() {
											this._autoSave(textArea);
										}, this), this._iAutoSaveTimeout);
							}
						}
					},

					enableScrolling : function(scrollDelegate) {
						scrollDelegate.onBeforeRendering();
						scrollDelegate.onAfterRendering();
					},

					handleDeleteSection : function() {
						if(this.oDataLossDialog)
							this.oDataLossDialog.close();
						
						var list = this.getView().byId("sectionList"), listItems = list
								.getItems(), iIndexOfItemToFocus = undefined;

						if (1 === 1) { // add check, if mock mode is off here
							var aBindingPaths = [];

							for ( var i = listItems.length - 1; i >= 0; i--) {
								if (listItems[i].getSelected() == true) {
									iIndexOfItemToFocus = i - 1;
									var path = listItems[i].getBindingContext(
											"json").getPath();
									aBindingPaths.push(path);
								}
							}
							if (iIndexOfItemToFocus < 0) {
								this._iTextAreaToFocus = 0;
							} else {
								this._iTextAreaToFocus = iIndexOfItemToFocus;
							}
							if (aBindingPaths.length === 0
									|| aBindingPaths.length === listItems.length
									|| listItems === 0) {
								// delete complete note
								sap.ui.getCore().getEventBus().publish(
										"cus.crm.notes",
										"DeleteNote",
										{
											path : this.getView()
													.getBindingContext()
													.getPath()
										});
								this.oModelHandler.oJSONModel.getData().navNoteSection = [];// TODO:
																							// remove
																							// or
																							// refactor
								if (jQuery.device.is.phone) {
									this._navBack();
								}
							} else {
								this.oModelHandler
								.deleteSections(aBindingPaths);
								this.refreshDetailTitle();
							}
							this._oSectionList.removeSelections(true);
						}
					},

					cancelDeleteSection : function() {
						this.oDataLossDialog.close();
					},

					mergeHandler : function(evt) {
						this._cancelAutoSave();
						
						var path = evt.getSource().getBindingContext("json")
								.getPath();
						var sFirstPath = null;
						var sSecondPath = null;

						var list = this.getView().byId("sectionList");
						var listItems = list.getItems();

						switch (evt.getParameter("Key")) {
						case "backspace":
							sSecondPath = path;

							for ( var i = 1; i < listItems.length; i++) {
								if (listItems[i].getBindingContext("json")
										.getPath() == sSecondPath) {
									sFirstPath = listItems[i - 1]
											.getBindingContext("json")
											.getPath();

									this._iTextAreaToFocus = i - 1;
									this._iTextAreaToFocusCursorPos = listItems[i - 1]
											.$().find("textarea").val().length;
									// listItems[i-1].$().find("textarea").blur();
									listItems[i].setSelected(false);
								}
							}

							break;
						case "delete":
							sFirstPath = path;

							for ( var i = 0; i < listItems.length - 1; i++) {
								if (listItems[i].getBindingContext("json")
										.getPath() == sFirstPath) {
									sSecondPath = listItems[i + 1]
											.getBindingContext("json")
											.getPath();

									this._iTextAreaToFocus = i;
									this._iTextAreaToFocusCursorPos = listItems[i]
											.$().find("textarea").val().length;
									// listItems[i].$().find("textarea").blur();
									listItems[i + 1].setSelected(false);
								}
							}

							break;
						}

						if (sFirstPath != null && sSecondPath != null) {
							this.oModelHandler.mergeSection(sFirstPath,
									sSecondPath);
							this.refreshDetailTitle();
						}
						setTimeout(this.enableScrolling(this.getPage()
								.getScrollDelegate()), 50);
					},

					_autoSave : function(oTextArea) {
						var path = oTextArea.getBindingContext("json")
								.getPath();

						this.checkEtag(false);
						this.oModelHandler.updateSection(path,false, this.oETag,this);
						this.refreshDetailTitle();

						this._bWaitingToAutoSave = false;
					},

					_cancelAutoSave : function() {
						clearTimeout(this._iAutoSaveID);
						this._bWaitingToAutoSave = false;
					},

					displayDataLoss : function(evt) {
						// display DataLossPopup as xml fragment
						if (!this.oDataLossDialog) {
							this.oDataLossDialog = sap.ui.xmlfragment(
									"cus.crm.notes.view.DataLossDialog", this);

							this.oDataLossDialog.setModel(this.getView()
									.getModel());
							this.oDataLossDialog.setModel(this.getView()
									.getModel("i18n"), "i18n");
						}
						var list = this.getView().byId("sectionList"), listItems = list
						.getSelectedItems().length;
						if(listItems>=1){
							this.oDataLossDialog.getContent()[0].getContent()[0].setText( sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DELETE_SELECTED_NOTE_QUESTION"));
						}else{
							this.oDataLossDialog.getContent()[0].getContent()[0].setText( sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DELETE_ALL_NOTE_QUESTION"));
						}
						this.oDataLossDialog.open();
					},

					// Appointment Process Type Dialog when click on create an
					// appointment

					navToAppointmentDialog : function(oEvent) {
						this.oActionSheet = sap.ui.xmlfragment(
								"cus.crm.notes.view.ProcessTypeDialog",

								this);
						this.oActionSheet.setModel(this.getView().getModel(
								"i18n"), "i18n");
						var oModel = this.getView().getModel();
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1;
						oModel.read( ((parseFloat(this.sBackendVersion) >= 3) ? "ApptTransactionTypeSet": "ApptTransactionTypes"), null, null, false,
								function(oData, resp) // [
														// "$filter=ProcessType
														// eq '" + pType+ "'" ]
								{
									data1 = {
										ProcessTypes : resp.data.results
									};

								});
						
						this.appointmentFlag = true;
						
						if(data1.ProcessTypes.length == 0)
						{ 
							this.appointmentFlag = false;
							sap.ca.ui.message.showMessageBox({
						            type: sap.ca.ui.message.Type.ERROR,
						            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR"),
						            details: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR")
						        });
						
						}
						else if(data1.ProcessTypes.length==1)
							{
								this.onlyOneAppointmentProcessType=true;
								this.processType = data1.ProcessTypes[0].ProcessTypeCode;
								this.ProcessTypeDescription = data1.ProcessTypes[0].Description;
								this.privateFlag = data1.ProcessTypes[0].PrivateFlag;
								this.selectProcess();
							}
						else{
								jsonModel.setData(data1);
								this.oActionSheet.setModel(jsonModel, "json");
		
								this.oActionSheet._searchField
										.setPlaceholder(sap.ca.scfld.md.app.Application
												.getImpl().getResourceBundle().getText(
														"SEARCH"));
								this.oActionSheet._list.setGrowingScrollToLoad(true);
		
								this.oActionSheet._dialog.setVerticalScrolling(true);
		
								this.oActionSheet.open();
						}

						// setting appointment flag to navigate to Appointment
						// application
						

					},

					navToTaskDialog : function(oEvent) {
						this.oActionSheet = sap.ui.xmlfragment(
								"cus.crm.notes.view.ProcessTypeDialog",

								this);
						this.oActionSheet.setModel(this.getView().getModel(
								"i18n"), "i18n");
						var oModel = this.getView().getModel();
						var jsonModel = new sap.ui.model.json.JSONModel();
						var data1;
						oModel.read(( (parseFloat(this.sBackendVersion) >= 3) ? "TaskTransactionTypeSet" : "TaskTransactionTypes"), null, null, false,
								function(oData, resp) // [
														// "$filter=ProcessType
														// eq '" + pType+ "'" ]
								{
									data1 = {
										ProcessTypes : resp.data.results
									};

								});
						
						this.appointmentFlag = false;
						
						if(data1.ProcessTypes.length == 0)
						{ 
							sap.ca.ui.message.showMessageBox({
						            type: sap.ca.ui.message.Type.ERROR,
						            message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR"),
						            details: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FOLLOWUPERROR")
						        });
						
						}
						else if(data1.ProcessTypes.length==1)
						{
							this.onlyOneTaskProcessType=true;
							this.processType = data1.ProcessTypes[0].ProcessTypeCode;
							this.ProcessTypeDescription = data1.ProcessTypes[0].Description;
							this.privateFlag = data1.ProcessTypes[0].PrivateFlag;
							this.selectProcess();
						}
					else{
						jsonModel.setData(data1);
						this.oActionSheet.setModel(jsonModel, "json");

						this.oActionSheet._searchField
								.setPlaceholder(sap.ca.scfld.md.app.Application
										.getImpl().getResourceBundle().getText(
												"SEARCH"));
						this.oActionSheet._list.setGrowingScrollToLoad(true);

						this.oActionSheet._dialog.setVerticalScrolling(true);

						this.oActionSheet.open();

						// setting appointment flag to navigate to Appointment
						// application
					}
						

					},

					// search in process type dialog
					searchProcess : function(oEvent) {
						var sValue = oEvent.getParameter("value");
						if (sValue !== undefined) {
							// apply the filter to the bound items, and the
							// Select Dialog will update
							oEvent
									.getParameter("itemsBinding")
									.filter(
											[ new sap.ui.model.Filter(
													"Description",
													sap.ui.model.FilterOperator.Contains,
													sValue) ]);
						}
					},

					selectProcess : function(oEvent) {

						// Getting context path

						var aItemPaths = this._getSelectedItemPaths();

						if(!(this.onlyOneAppointmentProcessType || this.onlyOneTaskProcessType) ){
						var selectedItem = oEvent.getParameter("selectedItem");
						if (selectedItem) {
							this.processType = selectedItem.data("ProcessTypeCode");
							this.ProcessTypeDescription = selectedItem.data("ProcessTypeDescription");
							this.privateFlag = selectedItem.data("PrivateFlag");
						}
						}

						// console.log("window location" + this.processType);
						// console.log("window location" + oEvent);

						// var aItemPaths =
						// this.getView().getBindingContext().sPath.substr(1);

						// *XNav* (1) obtain cross app navigation interface
						var fgetService = sap.ushell && sap.ushell.Container
								&& sap.ushell.Container.getService;
						this.oCrossAppNavigator = fgetService
								&& fgetService("CrossApplicationNavigation");
						// console.log("window location" +this.appointmentFlag);

						if (this.appointmentFlag) {

							// *XNav (2) generate cross application link
							
							var toApp = this.oCrossAppNavigator
									&& this.oCrossAppNavigator
											.hrefForExternal({
												target : {
													// semanticObject :
													// "Appointment",
													// action: "myAppointments"
													semanticObject : "Appointment",
													action : "myAppointments"
												},												
												params : {
													"processType" : this.processType,
												//	"ProcessTypeDescription" : this.ProcessTypeDescription,
													"createFromNote" : "X",
													"itemPaths" : aItemPaths,
												//	"privateFlag" : this.privateFlag
												// "itemPaths" : aItemPaths
												}
											}) || "";

							// Navigate to the target
							window.location = toApp;
							this.appointmentFlag = false;
						}

						else {
							// *XNav (2) generate cross application link
							var oContext = this.getView().getBindingContext();
							var toApp = this.oCrossAppNavigator
									&& this.oCrossAppNavigator
											.hrefForExternal({
												target : {
													semanticObject : "Task",
													action : "manageTasks"
												},
												appSpecificRoute : [ "&", "newTask",
																		this.processType ].join("/"),
												params : {
													"processType" : this.processType,
												//	"ProcessTypeDescription" : this.ProcessTypeDescription,
													"createFromNote" : "X",
													"itemPaths" : aItemPaths
												}												
											}) || "";

							// Navigate to the target
							window.location = toApp;
							//
							this.appointmentFlag = false;

						}

					},

					/**
					 * Cross navigation to the appointment app to create an
					 * appointment
					 * 
					 * @param oEvent
					 */

					navToAppointments : function(oEvent) 
					{ 
						var aItemPaths =	  this._getSelectedItemPaths();
						// XNav (1) obtain cross app navigation interface var
						var fgetService = sap.ushell && sap.ushell.Container &&
						sap.ushell.Container.getService; this.oCrossAppNavigator =
							fgetService && fgetService("CrossApplicationNavigation");
						// XNav (2) generate cross application link 
						var toApp = 	  this.oCrossAppNavigator &&
						this.oCrossAppNavigator.hrefForExternal({ target: {
							semanticObject : "Appointment", action: "myAppointments" },
							params : { "createFromNote" : "X", "itemPaths" :
								aItemPaths} }) || "";

						//Navigate to the target 
						window.location = toApp ;
						
					},

						// Cross navigation to the appointment app to create an
						//appointment @param oEvent / 
						navToTasks :	  function(oEvent)

						{ var aItemPaths =
							this._getSelectedItemPaths();
						// XNav (1) obtain cross app navigation interface var
						var fgetService = sap.ushell && sap.ushell.Container &&
						sap.ushell.Container.getService; this.oCrossAppNavigator =
							fgetService && fgetService("CrossApplicationNavigation");
						// XNav (2) generate cross application link 
						var toApp =
						this.oCrossAppNavigator &&
						this.oCrossAppNavigator.hrefForExternal({ target: {
							semanticObject : "Task", action: "manageTasks" }, params : {
								"createFromNote" : "X", "itemPaths" : aItemPaths } }) ||
								"";

						//Navigate to the target 

						window.location = toApp ;

						},





					/**
					 * Helper function to read text out of i18n. This is needed
					 * in a controller, because coding is not being parsed like
					 * in the xml views.
					 */
					_get_i18n_Text : function(textName) {
						return this.oApplicationFacade.getResourceBundle()
								.getText(textName);
					},

					/**
					 * Reads the selected texts in the section list. If no item
					 * is selected, the text of all items will be returned.
					 * 
					 * @returns {String}
					 */
					_getSelectedText : function() {
						var aItemPaths = this._getSelectedItemPaths();
						var selectedText = this.oModelHandler
								.getSectionsText(aItemPaths);

						return selectedText;
					},

					/**
					 * Returns the selected item paths in the section list. If
					 * no item is selected, all items will be returned.
					 * 
					 * @returns {Array}
					 */
					_getSelectedItemPaths : function() {
						var list = this.getView().byId("sectionList");
						var listItems = list.getItems();
						var aAllPaths = [];
						var aItemPaths = [];
						var selectAll = true;
						var path = null;

						// Loop over all sections and check if section has been
						// checked
						for ( var i = 0; i < listItems.length; i++) {
							path = listItems[i].getBindingContext("json")
									.getPath();

							if (listItems[i].getSelected()) {
								selectAll = false;

								aItemPaths.push(path);
							}

							if (selectAll) {
								aAllPaths.push(path);
							}
						}

						if (selectAll) {
							aItemPaths = aAllPaths;
						}

						return aItemPaths;
					},

					refreshDetailTitle : function() {
						this._setDetailTitel(null, null, {
							context : this.oModelHandler.getFirstSectionText()
						});
					},

					_setDetailTitel : function(channelId, eventId, data) {
						if (data.context === "") {
							data.context = this._get_i18n_Text("DETAIL_TITLE");
						}
						this.oHeaderFooterOptions.sDetailTitle = data.context;
						this.setHeaderFooterOptions(this.oHeaderFooterOptions);
					},

					/***********************************************************
					 * Common Dialog functions
					 **********************************************************/

					/**
					 * Open a dialog with a specific fragmentName. If the dialog
					 * was not already create, a new instance is built.
					 * 
					 * @param oDialog
					 * @param sFragmentName
					 * @param oModel
					 * @param sBindingPath
					 * @param oFilter
					 * @returns
					 */
					openDialog : function(oDialog, sFragmentName, oModel,
							sBindingPath, bGrowing, oFilter) {
						oDialog = this.getDialog(oDialog, sFragmentName);

						if (bGrowing) {
							// TODO: This is a Workaround because the growing
							// options are not exposed to the SelectDialog.
							// This will be implemented by the core team
							// directly in the select dialog
							oDialog._list.setGrowing(true);
							oDialog._list.setGrowingScrollToLoad(true);
							oDialog._list.setGrowingThreshold(20);
						}

						this.bindAggregation(oDialog, sBindingPath, oFilter);

						// It is important to set all binding, filter and
						// sorting informations before this call will be
						// executed
						oDialog.setModel(this.getView().getModel());
						oDialog.setModel(this.getView().getModel("i18n"),
								"i18n");
						oDialog.setModel(oModel, "model");

						if (oFilter) {
							oDialog.open(oFilter.oValue1);
						} else {
							oDialog.open();
						}

						return oDialog;
					},

					/**
					 * Get dialog. If the dialog does not exist, it will be
					 * created by given fragment name
					 * 
					 * @param oDialog
					 * @param sFragmentName
					 * @returns
					 */
					getDialog : function(oDialog, sFragmentName) {
						if (!oDialog) {
							oDialog = sap.ui.xmlfragment(sFragmentName, this);
						}

						return oDialog;
					},

					/**
					 * Set the binding path and the filter and triggers a
					 * reloading
					 * 
					 * @param oDialog
					 * @param sBindingPath
					 * @param oFilter
					 */
					bindAggregation : function(oDialog, sBindingPath, oFilter) {
						var aFilters = [];

						if (oFilter) {
							aFilters.push(oFilter);
						}

						if (sBindingPath) {
							oDialog
									.bindAggregation(
											"items",
											{
												path : sBindingPath,
												template : oDialog
														.getBindingInfo("items").template,
												filters : aFilters
											});
						} else {
							if (aFilters.length > 0) {
								oDialog.getBinding("items").filter(aFilters);
							}
						}
					},

					/**
					 * Creates an entry (with the parameters in the object
					 * oEntry) for the given binding path and the model of the
					 * current view
					 * 
					 * @param oEntry
					 * @param bindingPath
					 */
					createEntry : function(oEntry, bindingPath) {
						var that = this;
						var oModel = this.getView().getModel();

						jQuery.sap.require("sap.m.MessageToast");
						var messageText = this
								._get_i18n_Text("MSG_CREATION_OBJECT_SUCCESS"); // 'Entry
																				// created
																				// successfully!';

						if (bindingPath === "/Appointments") {
							messageText = this
									._get_i18n_Text("MSG_UPDATING_APPOINTMENT_SUCCESS"); // 'Appointment
																							// created
																							// successfully!';
						} else {
							if (bindingPath === "/Tasks") {
								messageText = this
										._get_i18n_Text("MSG_UPDATING_TASK_SUCCESS"); // 'Task
																						// created
																						// successfully!';
							}
						}

						oModel
								.create(
										bindingPath,
										oEntry,
										null,
										function() {
											// console.log('Entry created
											// successfully!');
											sap.m.MessageToast
													.show(messageText);

										},
										jQuery
												.proxy(function() {
													// sap.ca.ui.message.showMessageBox({
													// type:
													// sap.ca.ui.message.Type.ERROR,
													// message:
													// that._get_i18n_Text("MSG_CREATION_OBJECT_FAILED"),
													// details:
													// that._get_i18n_Text("MSG_LONG_CREATION_OBJECT_FAILED")
													// });
													sap.m.MessageToast
															.show(that
																	._get_i18n_Text("MSG_CREATION_OBJECT_FAILED"));
												}));

						oModel.refresh();
					},

					/**
					 * Run a search by a given filter name on a select dialog
					 * 
					 * @param oDialog
					 * @param sFilterName
					 */
					doSelectDialogSearch : function(oDialog, sFilterName) {
						var sSearchValue = oDialog._searchField
								.getProperty("value");
						var oIdFilter = new sap.ui.model.Filter(sFilterName,
								sap.ui.model.FilterOperator.Contains,
								sSearchValue);
						oDialog.getBinding("items").filter([ oIdFilter ]);
					},

					/**
					 * Update a property of the local json model "model"
					 * 
					 * @param oDialog
					 * @param sPropertyName
					 * @param sPropertyValue
					 */
					updateProperty : function(oDialog, sPropertyName,
							sPropertyValue) {
						if (oDialog) {
							var oModel = oDialog.getModel('model');
							oModel.setProperty(sPropertyName, sPropertyValue);
							oDialog.setModel(oModel, 'model');
						}
					},

					/***********************************************************
					 * Controller functions for the Network Error Dialog
					 **********************************************************/

					openNetworkErrorDialog : function(sErrorMessage) {
						// show the erorr message in a MessageBox
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : this._get_i18n_Text("NETWORK_ERROR_MSG"),
							details : sErrorMessage
						}, jQuery.proxy(this.okNetworkErrorDialog, this));
					},

					okNetworkErrorDialog : function(oEvent) {
						var that = this;
						var fnSuccess = jQuery
								.proxy(function() {
									sap.m.MessageToast
											.show(
													that
															._get_i18n_Text("MSG_SYNCHRONIZATION_SUCCEEDED"),
													{
														at : sap.ui.core.Popup.Dock.CenterCenter
													});
								});

						this.oModelHandler.retryBatchOperations(fnSuccess);
					},

					/***********************************************************
					 * Controller functions for the Exception Dialog
					 **********************************************************/

					openExceptionDialog : function(sErrorMessage) {
						// show the erorr message in a MessageBox
						sap.ca.ui.message.showMessageBox({
							type : sap.ca.ui.message.Type.ERROR,
							message : this
									._get_i18n_Text("EXCEPTION_ERROR_MSG"),
							details : sErrorMessage
						}, jQuery.proxy(this.okExceptionDialog, this));
					},

					okExceptionDialog : function(oEvent) {
						var that = this;
						var fnSuccess = jQuery.proxy(function() {
							sap.m.MessageToast.show(that
									._get_i18n_Text("MSG_CHANGES_DISCARDED"), {
								at : sap.ui.core.Popup.Dock.CenterCenter
							});
						});

						this.oModelHandler.discardBatchOperations(fnSuccess);
					},

					/***********************************************************
					 * Controller functions for fragment
					 * AddToDialog.fragment.xml
					 **********************************************************/

					openAddToDialog : function(oEvent) {
						this.getView().getModel().setCountSupported(true); // no
																			// inlinecount
																			// supported
						var oModel = new sap.ui.model.json.JSONModel();
						var oData = {
							text : this._getSelectedText()
						};
						oModel.setData(oData);

						this.oAddToDialog = this.openDialog(this.oAddToDialog,
								"cus.crm.notes.view.AddToDialog", oModel);
					},

					getOpportunityList : function() {
						return sap.ui.getCore().byId("opportunityList");
					},

					doSearchOpportunity : function(oEvent) {
						var sFilterPattern = oEvent.getParameters().query;
						var oBinding = this.getOpportunityList().getBinding(
								"items");
						var oDescriptionFilter = new sap.ui.model.Filter(
								"Description",
								sap.ui.model.FilterOperator.Contains,
								sFilterPattern);
						var aFilters = [ oDescriptionFilter ];
						oBinding.filter(aFilters);
					},

					cancelAddToDialog : function(oEvent) {
						// TODO Show data loss popup
						this.closeAddToDialog();
					},

					closeAddToDialog : function() {
						this.oAddToDialog.close();
						this.oAddToDialog.destroy();
						this.oAddToDialog = undefined;
						this.getView().getModel().setCountSupported(false); // reset
					},

					navigateToOpportunities : function(oEvent) {
						var navContainer = this.oAddToDialog.getContent()[0];
						navContainer.to("page2", "slide",
								oEvent.getSource().getBindingContext());
					},

					navigateFromOpportunities : function(oEvent) {
						var navContainer = this.oAddToDialog.getContent()[0];
						navContainer.back(oEvent.getSource().getBindingContext());
					},

					triggerOkButtonVisibility : function(oEvent) {

						if (oEvent.getParameter('fromId') == 'page2') {
							this.oAddToDialog.destroyBeginButton();
						} else {
							this.oAddToDialog.setBeginButton(new sap.m.Button({
								text : this._get_i18n_Text('ADD_TO_OK'),
								enabled: false,
							    press : jQuery.proxy(function() {
									this.okAddToDialog();
								}, this)
							}));
						}
					},

					handleOpportunityPress : function(oEvent) {
						var isSelected = oEvent.getSource().getSelected();
						oEvent.getSource().setSelected(!isSelected);
						
						if(isSelected == false)
							{
							this.oAddToDialog.getBeginButton().setEnabled(true);
							}else{
								this.oAddToDialog.getBeginButton().setEnabled(false);
							};
					},

					okAddToDialog : function(oEvent) {
						var oModel = this.getView().getModel();
						var oParams = null;
						var oEntry = null;
						var that = this;
						var oOpportunityList = this.getOpportunityList();
						var aSelectedItems = oOpportunityList
								.getSelectedItems();

						for ( var i = 0; i < aSelectedItems.length; i++) {
							oParams = {
								fnSuccess : jQuery
										.proxy(function() {
											sap.m.MessageToast
													.show(that
															._get_i18n_Text(
																	"MSG_UPDATING_OPPORTUNITY_SUCCEEDED")
															.replace(
																	"{0}",
																	aSelectedItems[i]
																			.getProperty("title")));
										}),
								fnError : jQuery
										.proxy(function() {
											sap.m.MessageToast
													.show(that
															._get_i18n_Text(
																	"MSG_UPDATING_OPPORTUNITY_FAILED")
															.replace(
																	"{0}",
																	aSelectedItems[i]
																			.getProperty("title")));
										})
							};

							oEntry = {
								Guid : aSelectedItems[i].getBindingContext()
										.getProperty('Guid'),
								Content : this.oAddToDialog.getModel('model')
										.getData().text
							};

							oModel.update(aSelectedItems[i].getBindingContext()
									.getPath(), oEntry, oParams);
						}

						this.closeAddToDialog();
					},

					/***********************************************************
					 * Controller functions for fragment
					 * AccountSelectDialog.fragment.xml
					 **********************************************************/

					displayAccounts : function(oEvent) {
						var oModel = oEvent.getSource().getModel('model');
						var accountName = oModel.getData().accountName;
						var oFilter = null;
						var sBindingPath = "/AccountCollection";

						if (accountName) {
							oFilter = new sap.ui.model.Filter("name1",
									sap.ui.model.FilterOperator.Contains,
									accountName);
						}

						this.oAccountSelectDialog = this.openDialog(
								this.oAccountSelectDialog,
								"cus.crm.notes.view.AccountSelectDialog",
								oModel, sBindingPath, true, oFilter);
					},

					doSearchAccount : function(oEvent) {
						this.doSelectDialogSearch(oEvent.getSource(), "name1");
					},

					selectAccount : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {
							if (oEvent.getParameter("selectedItem").data("id") != oDialog
									.getModel('model').getData().accountId) {
								// Account has changed -> Delete Contact
								this.updateProperty(oDialog, "/contactEntered",
										false);
								this.updateProperty(oDialog, "/contactId", "");
								this
										.updateProperty(oDialog,
												"/contactName", "");
							}
							;

							var horizontalLayoutId = '#accountHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId, 'customSelectField',
									'customSelectFieldRemoveIcon');
							this.updateProperty(oDialog, "/accountEntered",
									true);
							this.updateProperty(oDialog, "/accountId", oEvent
									.getParameter("selectedItem").data("id"));
							this.updateProperty(oDialog, "/accountName", oEvent
									.getParameter("selectedItem").getProperty(
											'title'));

							oDialog.getModel('model').refresh();
						}
					},

					deleteAccount : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {

							var horizontalLayoutId = '#accountHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId,
									'customSelectFieldRemoveIcon',
									'customSelectField');
							this.updateProperty(oDialog, "/accountEntered",
									false);
							this.updateProperty(oDialog, "/accountId", "");
							this.updateProperty(oDialog, "/accountName", "");

							// No account => No contact
							var contactHorizontalLayoutId = '#contactHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									contactHorizontalLayoutId,
									'customSelectFieldRemoveIcon',
									'customSelectField');
							this.updateProperty(oDialog, "/contactEntered",
									false);
							this.updateProperty(oDialog, "/contactId", "");
							this.updateProperty(oDialog, "/contactName", "");

							oDialog.getModel('model').refresh();
						}
					},

					/***********************************************************
					 * Controller functions for fragment
					 * ContactSelectDialog.fragment.xml
					 **********************************************************/

					displayContacts : function(oEvent) {
						var oModel = oEvent.getSource().getModel('model');
						var accountId = oModel.getData().accountId;
						var accountName = oModel.getData().accountName;
						var contactName = oModel.getData().contactName;
						var oFilter = null;
						var sBindingPath = null;
						var showInfoToolbar = false;

						// Filter the contact data by account id - don't bind
						// path if empty string
						if (accountId && accountId !== "") {
							sBindingPath = "/AccountCollection('" + accountId
									+ "')/Contacts";
							showInfoToolbar = true;
						} else {
							sBindingPath = "/ContactCollection";
						}

						if (contactName) {
							oFilter = new sap.ui.model.Filter("lastName",
									sap.ui.model.FilterOperator.Contains,
									contactName);
						}

						this.oContactSelectDialog = this.openDialog(
								this.oContactSelectDialog,
								"cus.crm.notes.view.ContactSelectDialog",
								oModel, sBindingPath, true, oFilter);

						// TODO: Unfortunately it is not possible to add this
						// toolbar directly in the SelectDialog (in the XML
						// fragment),
						// because there is no Getter/Setter for the Toolbar
						// object in the SelectDialog
						this.oContactSelectDialog._list
								.setInfoToolbar(new sap.m.Toolbar(
										{
											visible : showInfoToolbar,
											active : true,
											content : [ new sap.m.Label(
													{
														text : this
																._get_i18n_Text("CONTACT_SEARCH_FILTERED")
																+ ": "
																+ accountName
													})
											// We don't want to be able to
											// remove the filter on the contact
											// view once an account has been
											// entered.
											/*
											 * , new sap.m.ToolbarSpacer(), new
											 * sap.ui.core.Icon({ src :
											 * "sap-icon://decline" })
											 */
											]
										/*
										 * , press : this.removeContactFilter
										 */}));
					},

					removeContactFilter : function(oEvent) {
						oEvent.getSource().setVisible(false);

						// if the toolbar creation is moved to the XML, this
						// coding can be replaced by the function usage
						// this.setBindingPath
						oEvent.getSource().getParent().bindAggregation("items", {
							path : "/ContactCollection",
							template : oEvent.getSource().getParent()
									.getBindingInfo("items").template,
							filters : oEvent.getSource().getParent()
									.getBindingInfo("items").filters
						});
					},

					doSearchContact : function(oEvent) {
						this.doSelectDialogSearch(oEvent.getSource(),
								"lastName");
					},

					selectContact : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {
							var horizontalLayoutId = '#contactHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId, 'customSelectField',
									'customSelectFieldRemoveIcon');
							this.updateProperty(oDialog, "/contactEntered",
									true);
							this.updateProperty(oDialog, "/contactId", oEvent
									.getParameter("selectedItem").data("id"));
							this.updateProperty(oDialog, "/contactName", oEvent
									.getParameter("selectedItem").getProperty(
											'title'));

							if (oDialog.getModel('model').getData().accountId == null
									|| oDialog.getModel('model').getData().accountId == "") {
								this.updateProperty(oDialog,
										"/accountFieldWidth", "22rem");
								this.updateProperty(oDialog, "/accountEntered",
										true);
								this.updateProperty(oDialog, "/accountId",
										oEvent.getParameter("selectedItem")
												.data("accountId"));
								this.updateProperty(oDialog, "/accountName",
										oEvent.getParameter("selectedItem")
												.data("accountName"));
							}

							oDialog.getModel('model').refresh();
						}
					},

					deleteContact : function(oEvent) {
						var oDialog = null;

						if (this.oCreateAppointmentDialog
								&& this.oCreateAppointmentDialog.isOpen())
							oDialog = this.oCreateAppointmentDialog;
						else if (this.oCreateTaskDialog
								&& this.oCreateTaskDialog.isOpen())
							oDialog = this.oCreateTaskDialog;

						if (oDialog) {
							var horizontalLayoutId = '#contactHorizontalLayout'
									+ oDialog.getModel('model').getData().id;
							cus.crm.notes.util.DomHelper.replaceCssClassById(
									horizontalLayoutId,
									'customSelectFieldRemoveIcon',
									'customSelectField');
							this.updateProperty(oDialog, "/contactEntered",
									false);
							this.updateProperty(oDialog, "/contactId", "");
							this.updateProperty(oDialog, "/contactName", "");

							oDialog.getModel('model').refresh();
						}
					},

					/***********************************************************
					 * Controller functions for section attachment upload
					 **********************************************************/

					handleSectionAddPicture : function(oEvent) {
						var list = this.getView().byId("sectionList");
						var listItems = list.getItems();
						var sUploadUrl = null;
						var path = null;
						var sectionSelected = 0;

						// Loop over all sections and check if section has been
						// checked
						for ( var i = 0; i < listItems.length; i++) {
							if (listItems[i].getSelected()) {
								sectionSelected++;
								path = listItems[i].getBindingContext("json")
										.getPath();
								sUploadUrl = this.oModelHandler
										.getSectionAttachmentUploadUrl(path);
							}
						}

						if (sectionSelected === 0) {
							// No section has been selected or this simply no
							// section
							// TODO Create new section (directly with the
							// attachment or upload the attachment after the
							// creation)
						} else if (sectionSelected === 1) {
							this.uploadFile(sUploadUrl);
						} else {
							sap.ca.ui.message
									.showMessageBox({
										type : sap.ca.ui.message.Type.ERROR,
										message : this
												._get_i18n_Text("MSG_SELECT_ONE_SECTION")
									// ,details: sErrorMessage
									});
						}

					},

					/**
					 * Upload the file from the hidden input field to the given
					 */
					uploadFile : function(sUploadUrl) {
						var sHiddenInputFieldId = this.getView().getId()
								+ '--addPicture' + '-capture';
						var oHiddenInputField = jQuery("#"
								+ sHiddenInputFieldId);

						// Set the upload url in the fileupload input field
						oHiddenInputField.fileupload({
							multipart : false,
							url : sUploadUrl,
							type : "PUT",
							add : jQuery.proxy(function(e, data) {
								this.onAdd(e, data);
							}, this),
							done : jQuery.proxy(function(e, data) {
								this.uploadDone(e, data);
							}, this),
							fail : jQuery.proxy(function(e, data) {
								this.handleUploadFailure(e, data);
							}, this),
							beforeSend : jQuery.proxy(function(xhr, data) {
								// allow consumer to handle before file upload
								// in case they want to set custom headers based
								// on file info
								// this.fireBeforeUploadFile(data.files[0]);
								this._setRequestHeaders(xhr);
							}, this)
						});

						// Fire click event on the fileupload input field to
						// upload the attachment
						jQuery.sap.domById(sHiddenInputFieldId).click();
					},

					/***********************************************************
					 * Controller functions for image upload
					 **********************************************************/

					onAfterRendering : function(oEvt) {
						// var sId =
						// '#'+this.getView().getId()+'--addPicture-capture';
						// jQuery(sId).focusin(function(evt) {
						// $(sId).click();
						// //release the focus
						// $(sId).blur();
						// });
						// var that = this;
						// console.error('aaaa');
						// setTimeout(function() {
						// sectionList = that._oSectionList;
						// that._oSectionList.invalidate();
						// },10);
					},

					/**
					 * set common request headers
					 */
					_setRequestHeaders : function(xhr) {

						xhr.setRequestHeader("Accept", "application/json");

						if (this.getXsrfToken()) {
							xhr.setRequestHeader('x-csrf-token', this
									.getXsrfToken());
						}
					},

					/**
					 * gets the Xsrf token if it exists, if not, request it
					 * explicitly
					 */
					getXsrfToken : function() {
						var sToken = this.getView().getModel().getHeaders()['x-csrf-token'];
						if (!sToken) {

							this
									.getView()
									.getModel()
									.refreshSecurityToken(
											function(e, o) {
												sToken = o.headers['x-csrf-token'];
											},
											function() {
												sap.ca.ui.message
														.showMessageBox({
															type : sap.ca.ui.message.Type.ERROR,
															message : 'Could not get XSRF token',
															details : ''
														});
											}, false);
						}
						return sToken;
					},

					/**
					 * Handles error uploading pictures
					 * 
					 * @param e
					 * @param data
					 */
					handleUploadFailure : function(e, data) {
					},

					/**
					 * Execute before upload a picture to the server
					 * 
					 * @param e
					 * @param data
					 */
					onAdd : function(e, data) {
						data.submit();
					},

					/**
					 * Executes when the upload is finish
					 * 
					 * @param e
					 * @param data
					 */
					uploadDone : function(e, data) {
						this.oModelHandler.readSections();
					},
		
					_saveETag : function(sETag){
						this.sETag = sETag;
					}

				});

},
	"cus/crm/notes/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" \n\txmlns:layout="sap.ui.layout" \n    controllerName="cus.crm.notes.view.S3" xmlns:html="http://www.w3.org/1999/xhtml">\n    <Page id="page" title="{TeaserText}">\n        <content>\n\t\t\t<!-- <ObjectHeader title="{TeaserText}" number="{NoteGuid}" numberUnit="{NoteGuid}"></ObjectHeader> -->\n\t        <layout:VerticalLayout width="100%">  \n\t           \t<Label id="changeDateLabel" text="{ path:\'ChangedAt\', formatter:\'cus.crm.notes.util.Formatter.sectionDate\' }"  width="100%" textAlign="Right" class="sapMInputBase customNoteSectionDate"/>\n\t           \t<core:ExtensionPoint name="noteDetailExtension" />\n\t\t\t</layout:VerticalLayout>    \n\t\t\t<!--  Extension point to add additional note section  -->\n\t\t\t<core:ExtensionPoint name="noteSectionListExtension">        \n\t            <List id="sectionList" mode="MultiSelect" items="{path: \'json>/navNoteSection\'}" showNoData="false" showSeparators="Inner">\n\t                <items>\n\t                <!-- Extension point to add additional note section items -->\n\t                \t<core:ExtensionPoint name="noteSectionItemExtension">\n\t\t                    <CustomListItem xmlns="sap.m" id="sectionListItem">\n\t\t                        <content>\n<!--                         \t\t\t<layout:VerticalLayout width="100%"> -->\n\t\t\t                            <SectionTextArea xmlns="cus.crm.notes.control" id="item" width="100%" height="100%"\n\t\t\t                                value="{json>ContentText}" liveChange="handleSectionLiveChange"\n\t\t\t                                change="handleSectionChange" merge="mergeHandler">\n\t\t\t                            </SectionTextArea>\n<!-- \t                            \t\t<Image width="50%" visible="{json>navAttachment/Exist}" src="{json>navAttachment/__metadata/media_src}"/> -->\n<!-- \t                         \t\t</layout:VerticalLayout> -->\n<!-- Extension point to add additional note section content -->\n\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="noteSectionContentExtension" />\n\t\t                        </content>\n\t\t                    </CustomListItem>\n\t                    </core:ExtensionPoint>\n\t                </items>\n\t            </List>\n<!--             <html:input style="display:noneC" capture="camera" type="file" accept="image/*" id="addPicture-capture" /> -->\n\t\t\t</core:ExtensionPoint>\n        </content>\n    </Page>\n</core:View>\n'
}});
