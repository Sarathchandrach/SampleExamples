/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.util.Util");

cus.crm.mycalendar.util.Util = {


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

	// search function object to attach to search dialogs
	getSearch : function(sAttr, oList) {

		var doSearch = function(oEvent) {

			jQuery.sap.log.info("in do search");
			var aFilter = [];
			var itemsBinding;
			var sVal;

			if (oList) {
				sVal = oEvent.getSource().getValue();
			} else {
				sVal = oEvent.getParameter("value");
			}

			if (sVal !== undefined) {
				// Get the binded items
				if (oList) {
					itemsBinding = oList.getBinding("items");
				} else {
					// for the SearchDialog
					itemsBinding = oEvent.getParameter("itemsBinding");
				}

				//clear aApplicationFilters
			    itemsBinding.aApplicationFilters = [];
			    
				// filter on lastName -> anyway search on all attr due to enterprise search
				var selectFilter = new sap.ui.model.Filter(sAttr, sap.ui.model.FilterOperator.Contains, sVal);
				aFilter.push(selectFilter);

				// and apply the filter to the bound items, and the Select Dialog will update
				itemsBinding.filter(aFilter);
			}

		};

		return doSearch;

	},

	// live search function object to attach to search dialogs
	getLiveSearch : function(sAttr, oList) {
		var liveChangeTimer;
		var doSearch = function(oEvent) {

			jQuery.sap.log.info("in do live search");
			var aFilter = [];
			var itemsBinding;
			var sVal;

			if (oList) {
				sVal = oEvent.getSource().getValue();
			} else {
				sVal = oEvent.getParameter("value");
			}

			if (sVal.length === 0 || sVal.length > 3) {
				// Get the binded items
				// Get the binded items
				if (oList) {
					itemsBinding = oList.getBinding("items");
				} else {
					itemsBinding = oEvent.getParameter("itemsBinding");
				}

				// filter on lastName -> anyway search on all attr due to
				// enterprise search
				var selectFilter = new sap.ui.model.Filter(sAttr, sap.ui.model.FilterOperator.Contains, sVal);
				aFilter.push(selectFilter);

				// and apply the filter to the bound items, and the Select
				// Dialog will update
				clearTimeout(liveChangeTimer);
				liveChangeTimer = setTimeout(function(oEvent) {
					itemsBinding.filter(aFilter);
				}, 1000);
			}
		};

		return doSearch;
	},

	// creates a contactsearch fragment with a given id
	createContactSearchFragment : function(id, oController) {

		var oFragment = sap.ui.xmlfragment(id, "cus.crm.mycalendar.view.ContactSearch", oController);
		var oSearchList = sap.ui.core.Fragment.byId(id, "lsc");
		var oIB = oSearchList.getInfoToolbar();
		var oLIT = sap.ui.core.Fragment.byId(id, "lsci");
		var oSF = sap.ui.core.Fragment.byId(id, "sfc");
		
		oSearchList.removeItem(oLIT);
		// get function object for search and keep it in the fragment
		oFragment.onContactSearch = cus.crm.mycalendar.util.Util.getSearch("lastName", oSearchList);
		oFragment.onContactLiveChange = cus.crm.mycalendar.util.Util.getLiveSearch("lastName", oSearchList);

		// helper method to trigger contact search -> 2 different collections
		oFragment.triggerSearch = function(input) {
			var aFilter = [];
			
		  // remove template, because data binding will clone this template / avoid empty oData call
			oSearchList.removeItem(oLIT);
			if (input.searchvalue) {
				var selectFilter = new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, input.searchvalue);
				aFilter.push(selectFilter);
				oSF.setValue(input.searchvalue);
			} else {
				oSF.setValue("");
			}

			if (input.accountid) {

				// add account txt to the label of the info tool bar
				var sFilteredby = oController.oBundle.getText("view.Appointment.filteredby");
				sFilteredby = sFilteredby + " " + (input.accounttext === "" ? input.accountid : input.accounttext);
				oIB.getContent()[0].setProperty("text", sFilteredby);
				oSearchList.getInfoToolbar().setVisible(true);

				// and set search collection to the Contacts collection of the specific account
				var sPath = "sm>/AccountCollection('" + input.accountid + "')/Contacts";
				oSearchList.bindAggregation("items", {
					path : sPath,
					template : oLIT,
					filters : aFilter
				});

			} else {
				// no account info passed -> normal f4 contact collection
				oIB.setVisible(false);
				var sPath = "sm>/ContactCollection";
				oSearchList.bindAggregation("items", {
					path : sPath,
					template : oLIT,
					filters : aFilter
				});
			}

		};

		return oFragment;
	},

	// keep an own search model for the search helps because of the count issue
	// and because to keep the app model separated -> refresh of bindings
	// same oData service of course
	getSearchModel : function(oModel, isMock) {

		if (this.oSearchModel === undefined) {

			if (isMock) {
				// mock mode / default mode
				this.oSearchModel = new sap.ui.model.json.JSONModel();
				this.oSearchModel.loadData("/cus.crm.mycalendar/model/SearchModel.json", "", true);

			} else {

				this.oSearchModel = oModel;
				this.oSearchModel.attachRequestFailed(this, this.onRequestFailed, this);
			}
		}

		return this.oSearchModel;
	},

	onRequestFailed : function(oError) {
		jQuery.sap.log.error("oData search request failed");
		this.showErrorMessagePopup(oError);
	},
	//added some function
  formatAccountPlace: function(city, country){
		
		var sResult = city;
		
		if (country) {
			if (city) {
				sResult = sResult + ", " + country;
			} else {
				sResult = country;
			}
		}
		return sResult;
	},
	getAccountF4Description : function (city, country, accountID) {
		var text = "";
		var idPrefix = "";
		
		if (accountID){
			idPrefix = accountID + " / ";
			text = accountID;
		}
		if(!city && country){
			text = idPrefix + country;
		}
		else if(!country && city){
			text = idPrefix + city;
		}
		else if(country && city){
			text = idPrefix + city +", " + country;
		}
		return text;
	},
	getAccountF4Title : function(fullName){
		var text = "";
		if (fullName){
			text = fullName;
		}
		else{
			text = " ";
		}
		return text;
	},
	
	///////////////////////////////////
	


	showErrorMessagePopup : function(oError) {

		var sDetails = "", sMessage = "";

		if (oError.response && oError.response.body) {

			try{
				var oResponse = JSON.parse(oError.response.body);
				if (oResponse.error && oResponse.error.message) {
	        // directly display this as message
					sMessage = oResponse.error.message.value;
				} else {
					sMessage = oError.message;
					sDetails = oError.response.body;
				}
      }catch(e){
        // catch json parse error  
        sMessage = oError.message;
        sDetails = oError.response.body;
      }
		
		}

	/*	if (oError.mParameters) {
			sMessage = oError.mParameters.message;

			if (oError.mParameters.responseText) {
				sDetails = oError.mParameters.responseText;
			}
		}*/

		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sMessage,
			details : sDetails
		});

	},
	
	initEmployeeF4 : function(oController,oSource,oModel){
		
		    var oResourceBundle = oController.getView().getModel('i18n').getResourceBundle();
		    oController.onEmpSelect = this.getEmployeeSelect(oController,oSource,oModel);
		    oController.searchEmp   = this.getEmployeeSearch(oController,oSource);
		    oController.searchEmpLive = this.getEmployeeSearchLive(oController);
		    oController.onEmpToolbarClose = this.getEmpInfoBarClose(oController);
		    oController.closeEmpF4 = this.getCloseEmpF4(oController);
			oController.oEmpF4 = new sap.ui.xmlfragment("cus.crm.mycalendar.view.EmployeeF4",oController);
			oController.oEmpF4.setModel(new sap.ui.model.json.JSONModel(),"json");
			oController.oEmpF4.getModel('json').setSizeLimit(5000);
			oController.oEmpF4.setModel(oController.getView().getModel('i18n'),"i18n");
			oController.oEmpF4._list = oController.oEmpF4.getContent()[0];
		    oController.oEmpF4._infoToolbar = oController.oEmpF4._list.getInfoToolbar();
		    oController.oEmpF4._infoBarLabel = oController.oEmpF4._infoToolbar.getContent()[0];
		    oController.oEmpF4._searchField = oController.oEmpF4.getSubHeader().getContentLeft()[0];
		    oController.oEmpF4._loadingText = oResourceBundle.getText('view.Appointment.loaddatatext');
		    oController.oEmpF4._noDataText = oResourceBundle.getText('view.Appointment.empsea_nodata');
	},  
	
	
	showEmployeeF4 : function(oController,sEmpText,sAccount,sAccountTxt){
	   
		var oModel = oController.getView().getModel();
	    var aFilters = [];
	    var sPath = "";
	    if(sEmpText !== ""){
	    	aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,sEmpText));
	    	
	    }
	    oController.oEmpF4._searchField.setValue(sEmpText);
	    
	    if(sAccount !== "" ){
	    	sPath = "AccountCollection(accountID='"+ sAccount + "')/EmployeeResponsibles";
	    	var sFilterText = oController.getView().getModel('i18n').getResourceBundle().getText('view.Appointment.filteredby') + " ";
	         sFilterText +=  (sAccountTxt === "") ?  sAccount : sAccountTxt;
	    	oController.oEmpF4._infoBarLabel.setText(sFilterText);
	    	oController.oEmpF4._infoToolbar.setVisible(true);
	    	
	    }
	    else{
	    	sPath = "EmployeeCollection";
	    	oController.oEmpF4._infoToolbar.setVisible(false);
	    }
	    oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);
	    oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
	    oModel.read(sPath,{
            async : true,
            context : null,
            urlParameters : null,
            filters : aFilters,
	    	success : function(odata,response){
	    	
	        oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);	
	    	oController.oEmpF4.getModel('json').setData({ 
	    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
	    	 });
	                   },
	        error : function(oError){
	        	
	                }
	    });
		oController.oEmpF4.data('account',sAccount);
		oController.oEmpF4.open();
	},
	
	getEmployeeSelect : function(oController,oSource,oModel){ var that = this ;
		return function(oEvent){
	        var oSelectedItem =  oEvent.getParameter('listItem');
	        var oData = oSelectedItem.getBindingContext('json').getObject();
	        
			if(oSource instanceof sap.m.Input){
	             oSource.setValue((oData.fullName === "") ? oData.employeeID : oData.fullName);	 
	         }   		
			oModel.oData.Responsible = oData.employeeID;
			oModel.oData.ResponsibleTxt = oData.fullName;
           
			// disable private flag if not login Employee
			if(parseFloat(oController.sBackendVersion) >= 4.0){
				oController._setPrivateFlag(oData);
			}

			oController.oEmpF4._list.removeSelections();
			oController.oEmpF4.close();
		};
	},
	

	getEmployeeSearch : function(oController){
		return function(oEvent){
			var oModel = oController.getView().getModel();
			var sEmpText = oController.oEmpF4._searchField.getValue();
			var sPath = "";
			var sAccount = oController.oEmpF4.data('account');
			var aFilters = [];
			
			if(sAccount !== ""){
				 sPath = "/AccountCollection(accountID='" + sAccount + "')/EmployeeResponsibles";
			}
			else{
				sPath = "/EmployeeCollection";
			}
			
			if(sEmpText !== ""){
				aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains, sEmpText));
			}
		  
		  oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);	
		  oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
		  oModel.read(sPath,{
			  async : true,
			  context : null,
			  urlParameters : null,
			  filters : aFilters,
			  success : function(oData,response){
				   oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);
					oController.oEmpF4.getModel('json').setData({ 
			    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
			    	 });
			              },
			  error : function(oError){
					
				        }
			  
		  });
		};
	},
	
	getEmpInfoBarClose : function(oController){
		return function(oEvent){
		var oModel = oController.getView().getModel();
		var sEmpText = oController.oEmpF4._searchField.getValue();
		var sPath = "/EmployeeCollection";	
		var aFilters = [];
		
		oController.oEmpF4.data('account',"");
		if(sEmpText !== ""){
			aFilters.push(new sap.ui.model.Filter("fullName",sap.ui.model.FilterOperator.Contains,sEmpText));
		}
		
		oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);
		oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
		
		oModel.read(sPath,{
			async : true,
			urlParameters : null,
			context : null,
			filters : aFilters,
			success : function(oData,response){
				
				 oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);
				oController.oEmpF4.getModel('json').setData({ 
		    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
		    	 });
		              },
			error : function(oError){
				
			        }
		});
		oController.oEmpF4._infoToolbar.setVisible(false);
	};
		
	},
	
	getEmployeeSearchLive : function(oController){
		return function(oEvent){
			
			var oModel = oController.getView().getModel();
			var sEmpText = oController.oEmpF4._searchField.getValue();
			
			if(sEmpText.length > 0 &&sEmpText.length <= 3){
				return;
			}
			var sPath = "";
			var sAccount = oController.oEmpF4.data('account');
			var aFilters = [];
			
			if(sAccount !== ""){
				 sPath = "/AccountCollection(accountID='" + sAccount + "')/EmployeeResponsibles";
			}
			else{
				sPath = "/EmployeeCollection";
			}
			
			if(sEmpText !== ""){
				aFilters.push("$filter=substringof('" + sEmpText + "',fullName)");
			}
		  
		  oController.oEmpF4._list.setNoDataText(oController.oEmpF4._loadingText);	
		  oController.oEmpF4.getModel('json').setData({EmployeeCollection : []});
		  oModel.read(sPath,null,aFilters,true,
			   function(oData,response){
				   oController.oEmpF4._list.setNoDataText(oController.oEmpF4._noDataText);
					oController.oEmpF4.getModel('json').setData({ 
			    		 EmployeeCollection :   response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]	        		
			    	 });
			              },
			   function(oError){
					
				        }
			  
		  );
		};
	},
	
	getCloseEmpF4 : function(oController){
	   return function(){
		oController.oEmpF4._list.removeSelections();
		oController.oEmpF4.close();
		
	   };
	},
	filterStatusesByProcessType : function(aStatuses,sProcessType){
		
	},
	
	handleErrors : function(oError){
		
		jQuery.sap.log.error(JSON.stringify(oError));
		sap.ca.ui.message
				.showMessageBox(
						{
							type : sap.ca.ui.message.Type.ERROR,
							message : oError.message,
							details : JSON
									.parse(oError.response.body).error.message.value
						}, function(oResult) {
							
						});

	},
	
	initCustomizingModel : function(oController){
		
		oController.oApplicationFacade.setApplicationModel("customizing",new sap.ui.model.json.JSONModel({}));
	},
	
	getStatusesForTxType : function(aStatuses,sTxType){
		var i = 0; 
		var aFilteredStatuses = [];
		var length = aStatuses.length;
		for(;i<length;i++){
			if(aStatuses[i].TransactionType === sTxType){
				aFilteredStatuses.push(aStatuses[i]);
			}
		}
		
		if(aFilteredStatuses.length === 0){
			return null;
		}
		
		return aFilteredStatuses;
	},
	
	getDefaultStatus : function(aStatuses){
		
		for(var i = 0; i < aStatuses.length; i++){
			if(aStatuses[i].Default === true){
				return aStatuses[i];
			}
		}
		
		return null;
	},
	
	getPrioritiesForTxType : function(aPriorities,sTxType){
		
	},
	
	getDefaultPriority : function(sTxType,oController){
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData;
        var sDefaultPrio = "";
		if(oData.TransactionTypeSet && oData.TransactionTypeSet.length !== 0){
			    
	            for(var i = 0; i < oData.TransactionTypeSet.length; i++){
	                  if(oData.TransactionTypeSet[i].ProcessTypeCode === sTxType){
	                	  sDefaultPrio =  oData.TransactionTypeSet[i].Priority
	                	  break;
	                  }            	
	            }
	            
	            if(sDefaultPrio !== "" && oData.UserPriorities){	
	            	for(var i = 0 ;  i < oData.UserPriorities.length;i++){
	            		if(oData.UserPriorities[i].Priority === sDefaultPrio){
	            			return oData.UserPriorities[i];
	            		}
	            	}
	            	
	            }
	            else{
	            	return null;
	            }
		}
		
		else{
			return null;
		}
		
	},
	
	showErrMsgBox : function(sErrMsg){
		sap.ca.ui.message.showMessageBox({
			type : sap.ca.ui.message.Type.ERROR,
			message : sErrMsg,
		}, function(oResult) {
			
		});
	},
	
	handleBatchCustomizingRead : function(aResponses,oController){
		
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData;
		var bFail = false;
		var sErrTitle = "";
		var sErrMsg = "";
		
		if(parseInt(aResponses.__batchResponses[0].statusCode) >= 400){
			sErrTitle = oResponses.__batchResponses[0].statusText;
			sErrMsg = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value + "\n";
			bFail = true;
		}
		
		else{
			oData.UserPriorities = aResponses.__batchResponses[0].data.results;
		}
		
		if(parseInt(aResponses.__batchResponses[1].statusCode) >= 400){
			sErrTitle = oResponses.__batchResponses[1].statusText;
			sErrMsg = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value + "\n";
			bFail = true;
		}
		
		else{
			oData.UserStatuses = aResponses.__batchResponses[1].data.results;
		}
		if(!oData.TransactionTypeSet){
		if(parseInt(aResponses.__batchResponses[2].statusCode) >= 400){
			sErrTitle = oResponses.__batchResponses[2].statusText;
			sErrMsg = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value + "\n";
			bFail = true;
		}
		
		else{
			oData.TransactionTypeSet = aResponses.__batchResponses[2].data.results;
		}
		}
		
		if(bFail){
			//this.showErrMsgBox(sErrTitle,sErrMsg);
			if(oController._setViewMode){
				oController._setViewMode("ERROR");
				oController.sErrMsg = sErrMsg;
				return !bFail;
			}
			this.showErrMsgBox(sErrMsg);
			
		}
		
		return !bFail;
	},
	filterDropDowns : function(sTxType,oController){
		
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData;
	
		if(oData.UserPriorities && oData.UserPriorities.length === 0){
		  //  var sErrTitle = "Error";
		    var sErrMsg = oController.getView().getModel("i18n").getResourceBundle().getText("CUSTOMIZING_INCOMPLETE");
			//this.showErrMsgBox(sErrTitle,sErrMsg);
		    if(oController._setViewMode){
				oController._setViewMode("ERROR");
				oController.sErrMsg = sErrMsg;
				return false;
			}
		    this.showErrMsgBox(sErrMsg);
			return false;
		}
		var aFilteredStatuses = this.getStatusesForTxType(oData.UserStatuses, sTxType);
		
		if(aFilteredStatuses === null){
			//var sErrTitle = "Error";
			 var sErrMsg = oController.getView().getModel("i18n").getResourceBundle().getText("CUSTOMIZING_INCOMPLETE");
			//this.showErrMsgBox(sErrTitle,sErrMsg);
			 if(oController._setViewMode){
					oController._setViewMode("ERROR");
					oController.sErrMsg = sErrMsg;
					return false;
				}
			 this.showErrMsgBox(sErrMsg);
			return false;
		}
		
		if(!oData.mStatuses){
			oData.mStatuses = {};
		}
		oData.mStatuses[sTxType] = aFilteredStatuses;
			
		return true;
		
		
	},
	isTransactionTypeActive : function(sTransactionType,oController){
		
		var bReturn;
	
		oController.oModel.read("readAppointStatusCust",null,{Guid : "''",TransactionType : "'" + sTransactionType + "'"},false,function(oData,response){
			
			bReturn = true;
			var oCustomizingModel = oController.oApplicationFacade.getApplicationModel("customizing");
			var oCustData = oCustomizingModel.oData;
			if(!oCustData.mStatuses){
				oCustData.mStatuses = {};
			}
			oCustomizingModel.oData.mStatuses[sTransactionType] = oData.results;
			
		},function(oError){
		   cus.crm.mycalendar.util.Util.handleErrors(oError);	
		   bReturn  = false;
		});
		
		return bReturn;
	},
getCustomizing : function(sTransactionType,oController){
	
	if(parseFloat(oController.sBackendVersion)  >= 4){
		 var bReturn;
		var oCustModel = oController.oApplicationFacade.getApplicationModel("customizing");
		var oData = oCustModel.oData
		if(oController._getViewMode){
			var i = 0;
			var mRequests = {
					
			};
			var sViewState = oController._getViewMode();
			if(sViewState === "EDIT"){
				  if(!oData.mNextPossibleStatuses){
					  oData.mNextPossibleStatuses = {};
				  }
				  
				  if(!oData.mNextPossibleStatuses[sTransactionType]){
					  oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation(oController.sEntityPath.substr(1) + "/AppointmentStatuses", "GET")]);
					  mRequests["NEXTSTATUS"] = i;
					  i++;
				  }
				  
				  if(!oData.UserPriorities){
					  oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("UserPriorities","GET")]);
					  mRequests["PRIO"] = i;
					  i++;
				  }
				  
				  if(i > 0){
					  oController.oModel.submitBatch(function(aResponses){
						  
						  var bFail = false;
						  var sErrTitle = "";
						  var sErrMsg = "";
						  var key;
						  //if(parseInt(aResponses.__batchResponses[0].statusCode) >= 400){
						  
						  if(mRequests["NEXTSTATUS"] !== null && mRequests["NEXTSTATUS"] !== undefined){
							  var index = mRequests["NEXTSTATUS"];
							  if(parseInt(aResponses.__batchResponses[index].statusCode) >= 400){
								  bFail = true;
								  sErrTitle = oResponses.__batchResponses[index].statusText;
								  sErrMsg = JSON.parse(oResponses.__batchResponses[index].response.body).error.message.value + "\n";
								  
							  }
							  else{
								  
								  oData.mNextPossibleStatuses[sTransactionType] = aResponses.__batchResponses[index].data.results;
							  }
						  }
						  if(mRequests["PRIO"] !==null && mRequests["PRIO"] !== undefined){
							  var index = mRequests["PRIO"];
							  if(parseInt(aResponses.__batchResponses[index].statusCode) >= 400){
								  bFail = true;
								  sErrTitle = oResponses.__batchResponses[index].statusText;
								  sErrMsg = JSON.parse(oResponses.__batchResponses[index].response.body).error.message.value + "\n";
								  
							  }
							  else{
								  
								  oData.UserPriorities = aResponses.__batchResponses[index].data.results;
							  }
						  }
						  
						  if(bFail){
							  cus.crm.mycalendar.util.Util.showErrMsgBox(sErrMsg);
							  return !bFail;
						  }
						  
					  },function(oError){
						  cus.crm.mycalendar.util.Util.handleErrors(oError);
						  bReturn = false;
					  },false);
					  
					  if(bReturn === false){
						  return false;
					  }
				  }
			}
		}
		
		if(!oData.UserStatuses || !oData.UserPriorities){
		 oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("UserPriorities","GET")]);
		 oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("UserStatuses","GET")]);
		 
		 if(!oData.TransactionTypeSet){
			 oController.oModel.addBatchReadOperations([oController.oModel.createBatchOperation("TransactionTypes","GET")]);
		 }
		 var that = oController;
		 
		 
		 oController.oModel.submitBatch(function(aResponses){
			bReturn =  cus.crm.mycalendar.util.Util.handleBatchCustomizingRead(aResponses,that);
			
			if(bReturn === true){
			bReturn = cus.crm.mycalendar.util.Util.filterDropDowns(sTransactionType,oController);
			}
		 },function(oError){
			 cus.crm.mycalendar.util.Util.handleErrors(oError);
			 bReturn = false;
		 },false);
		 
		 if(bReturn === false){
			 return false;
		 }
		}
		else{
			bReturn = cus.crm.mycalendar.util.Util.filterDropDowns(sTransactionType,oController);
			
			if(bReturn === false){
				return false
			}
		}
	}
	else{
 	var bTransactionActive  = cus.crm.mycalendar.util.Util.isTransactionTypeActive(sTransactionType,oController);
	
 	
	if(!bTransactionActive){
		return false;
	}
	
}
	
},

initControllersModel : function(oController){
	var oControllersModel = new sap.ui.model.json.JSONModel({});
	oController.oApplicationFacade.setApplicationModel("controllers",oControllersModel);
	
	return oControllersModel
},

_fetchETag : function(sEntityPath,oModel){
	
	var oContext = oModel.getContext(sEntityPath);

	if(oContext){
		oModel.deleteCreatedEntry(oContext);
	}
	
     oModel.createBindingContext(sEntityPath,null,function(oContext){
		cus.crm.mycalendar.util.Util._saveETag(oContext.getObject().__metadata.etag);
	},true);
},


_saveETag  : function(sETag){
	this.sETag = sETag;
},

_getETag : function(){
	return this.sETag;
}
	
	
	
	

};
