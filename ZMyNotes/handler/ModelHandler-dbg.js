/*
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