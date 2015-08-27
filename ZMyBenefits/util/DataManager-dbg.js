/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.emp.mybenefits.util.Formatter");

jQuery.sap.declare("hcm.emp.mybenefits.util.DataManager");

hcm.emp.mybenefits.util.DataManager = (function() {

	// NOTE: CODE CLEANUP & REFACTORING YET TO COMPLETE

	var _modelBase = null;
	var _resourceBundle = null;
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;

	return {

		init : function(oDataModel, oresourceBundle) {
			_modelBase = oDataModel;
			_modelBase.setCountSupported(false);
			//TODO:optimize calls
			//_modelBase.setUseBatch(true);
			_resourceBundle = oresourceBundle;
		},

		getBaseODataModel : function() {
			return _modelBase;
		},	
		
		
		setCachedModelObjProp: function(propName, propObj) {
			_cachedModelObj[propName] = propObj;
		},

		getCachedModelObjProp : function(propName) {
			return _cachedModelObj[propName];
		},
		getMasterList: function(refreshFlag,dateChangeFlag,filter,successCallback, errorCallback) {
			var sPath = "Benefits";
			if(/*!_cachedModelObj.benefitsPlan||*/!_cachedModelObj.benefitsPlan.length||refreshFlag||dateChangeFlag){//after setting _cachedModelObj.benefitsPlan to {} (initially it'll be undefined) ,it becomes object and hence !_cachedModelObj.benefitsPlan will b false but .length parameter will give undefined as o/p(so it is added)
				this._getOData(sPath, null, filter,jQuery.proxy( function(objResponse) {
				/*	_cachedModelObj.benefitsPlan = objResponse.results;	*/		
					this.setCachedModelObjProp("benefitsPlan",objResponse.results);
					successCallback(objResponse.results);
				},this), function(objResponse) {
					errorCallback(objResponse);
				});
				
			}else{
				successCallback(_cachedModelObj.benefitsPlan.Benefits);
			}

		},
		
		getbothMasterList: function(filter,successCallback, errorCallback) {
			var sPath = "Benefits";
			this._getOData(sPath, null, filter, function(objResponse) {
					var enrldPlns=hcm.emp.mybenefits.util.DataManager.getCachedModelObjProp("benefitsPlan");
					$.merge(enrldPlns.Benefits,objResponse.results)
					successCallback(enrldPlns);
				}, function(objResponse) {
					errorCallback(objResponse);
				});
				
			},
		
		getHealthDependants :function(_this,curntBnftPlan,successCallback, errorCallback) {
			//this.oDataModel.read("Benefits", null, filter, true, jQuery.proxy(successCallback,this));
            var uri=curntBnftPlan.__metadata.id
			var sPath = uri.slice(uri.indexOf("/Benefits"),uri.length);
			var oParams = ['$expand=Dependants'];
			
				this._getOData(sPath, null, oParams, function(objResponse) {
					jQuery.proxy(successCallback(objResponse),_this);
					
				}, function(objResponse) {
					errorCallback(objResponse);
				});
				
		
		}, 
		
		getBeneficiaries :function(_this,curntBnftPlan,successCallback, errorCallback) {
			//this.oDataModel.read("Benefits", null, filter, true, jQuery.proxy(successCallback,this));
            var uri=curntBnftPlan.__metadata.id
			var sPath = uri.slice(uri.indexOf("/Benefits"),uri.length);
			var oParams = ['$expand=Beneficiary'];
			
				this._getOData(sPath, null, oParams, function(objResponse) {
					jQuery.proxy(successCallback(objResponse),_this);
					
				}, function(objResponse) {
					errorCallback(objResponse);
				});
				
		
		}, 
		
		 getInvestment:function(_this,curntBnftPlan,successCallback, errorCallback) {
				//this.oDataModel.read("Benefits", null, filter, true, jQuery.proxy(successCallback,this));
	            var uri=curntBnftPlan.__metadata.id
				var sPath = uri.slice(uri.indexOf("/Benefits"),uri.length);
				var oParams = ['$expand=Investment'];
				
					this._getOData(sPath, null, oParams, function(objResponse) {
						jQuery.proxy(successCallback(objResponse),_this);
						
					}, function(objResponse) {
						errorCallback(objResponse);
					});
					
			
			}, 
			getMasterListonDateChange: function(filter,successCallback, errorCallback) {
				var sPath = "Benefits";
				
					this._getOData(sPath, null, filter, function(objResponse) {	
						successCallback(objResponse.results);
					}, function(objResponse) {
						errorCallback(objResponse);
					});
					
				
			},
			parseErrorMessages : function(objResponse) {

				if (objResponse.response.body) {
					try {
						var oResponse = JSON.parse(objResponse.response.body);
						if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
							var result = [];
							result.push(oResponse.error.message.value);
							if (oResponse.error.innererror && oResponse.error.innererror.errordetails
									&& oResponse.error.innererror.errordetails instanceof Array) {
								for ( var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
									if (oResponse.error.innererror.errordetails[i].message) {
										var message = oResponse.error.innererror.errordetails[i].message;
										if (oResponse.error.innererror.errordetails[i].code) {
											message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
										}
										if (oResponse.error.innererror.errordetails[i].severity) {
											message += " (" + oResponse.error.innererror.errordetails[i].severity + ")";
										}
										result.push(message);
									};
								};
							}
							return result;
						};
					} catch (e) {
						// NOP
					};
				} else {
					return [_resourceBundle.getText("LR_DD_COMM_ERR") + objResponse.message];
				};
			},
		
		_getOData : function(sPath, oContext, oUrlParams, successCallback, errorCallback) {

			_modelBase.read(sPath, oContext, oUrlParams, true, function(response) {
				successCallback(response);
			}, function(response) {
				errorCallback(response);
			});

		}
	};

}());