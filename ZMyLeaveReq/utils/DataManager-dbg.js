/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.emp.myleaverequests.utils.Formatters");

jQuery.sap.declare("hcm.emp.myleaverequests.utils.DataManager");

hcm.emp.myleaverequests.utils.DataManager = (function() {

	// NOTE: CODE CLEANUP & REFACTORING YET TO COMPLETE 

	var _modelBase = null;
	var _resourceBundle = null;
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;

	return {

		init : function(oDataModel, oresourceBundle) {
			_modelBase = oDataModel;
			_modelBase.setCountSupported(false);
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


		getApprover : function(successCallback, errorCallback) {

			var sPath = "ApproverCollection";
			var arrParams = ["$select=ApproverEmployeeName"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var sApproverName = undefined;
				try {
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
						for ( var i = 0; i < oResult.length; i++) {
							sApproverName = oResult[i].ApproverEmployeeName;
						};
					}
					if (sApproverName == undefined) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_APPROVER") + " (DataManager.getApprover)"]);
						return;
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getApprover)"]);
					return;
				}
				successCallback(sApproverName);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});

		},

		getConfiguration : function() {
			
			var deferredDefaultType = $.Deferred();
			
			var sPath = "ConfigurationCollection";
			var arrParams = ['$select=DefaultAbsenceTypeCode'];

			
			if(!_cachedModelObj.DefaultAbsenceTypeCode){
				this._getOData(sPath, null, arrParams, function(objResponse) {
					var oConfiguration = undefined;
					try {
						var oResult = objResponse.results;
						if (oResult instanceof Array) {
							oConfiguration = oResult[0];
						}					
						if (oConfiguration == undefined) {
							deferredDefaultType.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
							return;
						}
					} catch (e) {
						deferredDefaultType.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(e));
						return;
					}
					_cachedModelObj.DefaultAbsenceTypeCode = oConfiguration;			
					//successCallback(oConfiguration);
					deferredDefaultType.resolve(oConfiguration);
					
				}, function(objResponse) {
					deferredDefaultType.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
				});
		}else{
			deferredDefaultType.resolve(_cachedModelObj.DefaultAbsenceTypeCode);
		}			
			return deferredDefaultType.promise();
		},

		getAbsenceTypeCollection : function() {
			
			var deferredAbsTypeColl = $.Deferred();
			
			var sPath = "AbsenceTypeCollection";

			var oParams = ['$select=AbsenceTypeName,AbsenceTypeCode,AllowedDurationPartialDayInd,AllowedDurationMultipleDayInd'];
			
			if(!_cachedModelObj.AbsenceTypeCollection){
			
				this._getOData(sPath, null, oParams, function(objResponse) {
					
					_cachedModelObj.AbsenceTypeCollection = objResponse.results;					
					//successCallback(objResponse.results);
					deferredAbsTypeColl.resolve(objResponse.results);
					
				}, function(objResponse) {
					deferredAbsTypeColl.reject(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
				});
				
			}else{
				deferredAbsTypeColl.resolve(_cachedModelObj.AbsenceTypeCollection);
			}
			return deferredAbsTypeColl.promise();
			
		},

		getBalancesForAbsenceType : function(sAbsenceTypeCode, successCallback, errorCallback) {

			var sDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(new Date()) + 'T00%3A00%3A00';
			var sPath = "AbsenceTypeCollection(EmployeeID='',StartDate=datetime'" + sDate + "',AbsenceTypeCode='" + sAbsenceTypeCode + "')/absenceTypeTimeAccount";

			var arrParams = ["$select=BalancePlannedQuantity,BalanceAvailableQuantity,BalanceUsedQuantity,TimeUnitName,TimeAccountTypeName"];

			this._getOData(
							sPath,
							null,
							arrParams,
							function(objResponse) {
								var sBalancePlanned, sBalanceAvailable, sTimeUnitNamePlanned = _resourceBundle.getText("LR_DAYS"), sTimeUnitNameAvailable = _resourceBundle
										.getText("LR_DAYS"), sTimeAccountTypeName = undefined,sBalanceTotalUsedQuantity;
								try {
									// var oResult = JSON.parse(sResponse).d.results;
									var oResult = objResponse.results;
									var iBalancePlanned = 0, iBalanceAvailable = 0, iBalanceUsed = 0;
									if (oResult instanceof Array) {
										for ( var i = 0; i < oResult.length; i++) {
											iBalancePlanned += oResult[i].BalancePlannedQuantity * 1;
											iBalanceAvailable += oResult[i].BalanceAvailableQuantity * 1;
											iBalanceUsed += oResult[i].BalanceUsedQuantity * 1;
											sTimeUnitNamePlanned = oResult[i].TimeUnitName;
											sTimeUnitNameAvailable = oResult[i].TimeUnitName;
											sTimeAccountTypeName = oResult[i].TimeAccountTypeName;
										}
										//TODO: 
										/*
										 * if (oUserData.iBalanceRoundToDigits) { iBalanceAvailable = Math.round(iBalanceAvailable *
										 * Math.pow(10, oUserData.iBalanceRoundToDigits)) / Math.pow(10, oUserData.iBalanceRoundToDigits); }
										 */
									}
									sBalancePlanned = hcm.emp.myleaverequests.utils.Formatters.BALANCE(iBalancePlanned + "");
									sBalanceAvailable = hcm.emp.myleaverequests.utils.Formatters.BALANCE(iBalanceAvailable + "");
									var sBalanceUsed; // additional property, can be used in App Designer as a so far not used one
									sBalanceUsed = hcm.emp.myleaverequests.utils.Formatters.BALANCE(iBalanceUsed + "");
									
									sBalanceTotalUsedQuantity = hcm.emp.myleaverequests.utils.Formatters.BALANCE(parseFloat(iBalanceUsed) + parseFloat(iBalancePlanned) + "");
									
								} catch (e) {
									errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getBalancesForAbsenceType)"]);
									return;
								}
								successCallback(sBalancePlanned, sTimeUnitNamePlanned, sBalanceAvailable, sTimeUnitNameAvailable,
										sTimeAccountTypeName, sBalanceUsed, sBalanceTotalUsedQuantity);
							}, function(objResponse) {
								errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
							});
		},

		getPendingLeaves : function(successCallback, errorCallback) {

			this.getConsolidatedLeaveRequests(function(sPendingLeaves) {
				var aLeaveRequests = sPendingLeaves.LeaveRequestCollection;
				var iPendingLeaves = 0;
				for ( var i = 0; i < aLeaveRequests.length; i++) {
					if (aLeaveRequests[i].StatusCode == "SENT") {
						iPendingLeaves++;
					} else if (aLeaveRequests[i].aRelatedRequests != undefined && aLeaveRequests[i].aRelatedRequests.length > 0) {
						if (aLeaveRequests[i].aRelatedRequests[0].StatusCode == "SENT") {
							iPendingLeaves++;
						}
					}
				}
				successCallback(iPendingLeaves + "");
			}, errorCallback);
		},

		getConsolidatedLeaveRequests : function(successCallback, errorCallback) {

			var sPath = "LeaveRequestCollection";

			var oParams = ['$select=EmployeeID,RequestID,ChangeStateID,LeaveKey,ActionCode,StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime,WorkingHoursDuration,WorkingDaysDuration,Notes,ActionDeleteInd,ActionModifyInd,LeaveRequestType'];

			// var _today = new Date();
			// var sRelativeUrl = "LeaveRequestCollection?$filter=StartDate gt datetime'1950-01-01T00:00:00' and EndDate eq
			// datetime'"
			// + (_today.getFullYear() + 3).toString()
			// +
			// "-01-01T00:00:00'&$select=EmployeeID,RequestID,ChangeStateID,LeaveKey,ActionCode,StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime,WorkingHoursDuration,WorkingDaysDuration,Notes,ActionDeleteInd,ActionModifyInd,LeaveRequestType";

			this._getOData(sPath, null, oParams, function(objResponse) {
				var aLeaveRequests = [];
				try {
					// var oResult = this.getLeaveRequestCollectionDataFromXml(this.parseXml(sResponse));

					var oResult = objResponse.results;
					if (!oResult instanceof Array) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_CFG") + " (DataManager.getConsolidatedLeaveRequests)"]);
						return;
					}
					var oRelatedRequestsByLeaveKey = {}; // object of arrays
					for ( var i = 0; i < oResult.length; i++) {
						if ((oResult[i].LeaveRequestType == "2" || oResult[i].LeaveRequestType == "3") && oResult[i].LeaveKey) {
							if (!oRelatedRequestsByLeaveKey[oResult[i].LeaveKey]) {
								oRelatedRequestsByLeaveKey[oResult[i].LeaveKey] = [];
							}
							oRelatedRequestsByLeaveKey[oResult[i].LeaveKey].push(oResult[i]);
						}
					}
					for ( var i = 0; i < oResult.length; i++) {
						if (oResult[i].LeaveRequestType != "2" && oResult[i].LeaveRequestType != "3") {
							if (oResult[i].LeaveKey && oRelatedRequestsByLeaveKey[oResult[i].LeaveKey]) {
								oResult[i].aRelatedRequests = oRelatedRequestsByLeaveKey[oResult[i].LeaveKey];
								for ( var j = 0; j < oResult[i].aRelatedRequests.length; j++) {
								      oResult[i].Notes =oResult[i].aRelatedRequests[j].Notes + oResult[i].Notes;
								}
							}
							aLeaveRequests.push(oResult[i]);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getConsolidatedLeaveRequests)"]);
					return;
				}
				successCallback({
					LeaveRequestCollection : aLeaveRequests
				});
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getTimeAccountCollection : function(successCallback, errorCallback) {

			var sPath = "TimeAccountCollection";
			this._getOData(sPath, null, null, function(objResponse) {
				var aTimeAccounts = [];
				try {
					// var oResult = this.getTimeAccountCollectionDataFromXml(this.parseXml(sResponse));
					var oResult = objResponse.results;
					if (!oResult instanceof Array) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_CFG") + " (DataManager.getTimeAccountCollection)"]);
						return;
					}
					for ( var i = 0; i < oResult.length; i++) {
						delete oResult[i]['__metadata'];
						aTimeAccounts.push(oResult[i]);
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getTimeAccountCollection)"]);
					return;
				}
				successCallback({
					TimeAccountCollection : aTimeAccounts
				});
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		submitLeaveRequest : function(sStartDate, sStartTime, sEndDate, sEndTime, sAbsenceTypeCode, sNotes,
				bProcessCheckOnlyInd, successCallback, errorCallback) {

			// oResult example:
			// {
			// "EmployeeID": "14000002",
			// "RequestID": "B3D85951A07B020FE10000000A42D033",
			// "ChangeStateID": "0000000001",
			// "LeaveKey": "",
			// "ActionCode": 0,
			// "ProcessCheckOnlyInd": true,
			// "StatusCode": "SENT",
			// "StatusName": "Sent",
			// "AbsenceTypeCode": "0100",
			// "AbsenceTypeName": "Vacation",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// "WorkingHoursDuration": "7.20",
			// "WorkingDaysDuration": "1.00",
			// "ApproverEmployeeID": "14000002",
			// "ApproverEmployeeName": "John Doe",
			// "Notes": " 02.04.2013 16:05:38 (CET) John Doe \r\n test notice \r\n",
			// "ActionDeleteInd": true,
			// "ActionModifyInd": true,
			// "LastChangeDate": Date,
			// "LastChangeTime": "PT16H05M38S",
			// "LastChangeEmployeeName": "",
			// "SequenceID": 0,
			// "LeaveRequestType": 1,
			// "FirstSubmissionDate": Date,
			// "FirstSubmissionTime": "PT16H05M38S"
			// }

			var sBody = {};

			sBody.StartDate = sStartDate;
			sBody.StartTime = sStartTime;
			sBody.Notes = sNotes;
			sBody.ProcessCheckOnlyInd = (bProcessCheckOnlyInd ? true : false);
			sBody.AbsenceTypeCode = sAbsenceTypeCode;
			sBody.EndDate = sEndDate;
			sBody.EndTime = sEndTime;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if(objResponse.headers["sap-message"]){
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		changeLeaveRequest : function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, sStartDate, sStartTime, sEndDate,
				sEndTime, sAbsenceTypeCode, sNotes, bProcessCheckOnlyInd, successCallback, errorCallback) {

			// oResult example:
			// {
			// "EmployeeID": "14000002",
			// "RequestID": "B3D85951A07B020FE10000000A42D033",
			// "ChangeStateID": "0000000001",
			// "LeaveKey": "",
			// "ActionCode": 0,
			// "ProcessCheckOnlyInd": true,
			// "StatusCode": "SENT",
			// "StatusName": "Sent",
			// "AbsenceTypeCode": "0100",
			// "AbsenceTypeName": "Vacation",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// "WorkingHoursDuration": "7.20",
			// "WorkingDaysDuration": "1.00",
			// "ApproverEmployeeID": "14000002",
			// "ApproverEmployeeName": "John Doe",
			// "Notes": " 02.04.2013 16:05:38 (CET) John Doe \r\n test notice \r\n",
			// "ActionDeleteInd": true,
			// "ActionModifyInd": true,
			// "LastChangeDate": Date,
			// "LastChangeTime": "PT16H05M38S",
			// "LastChangeEmployeeName": "",
			// "SequenceID": 0,
			// "LeaveRequestType": 1,
			// "FirstSubmissionDate": Date,
			// "FirstSubmissionTime": "PT16H05M38S"
			// }

			var sBody = {};
			sBody.ActionCode = 02;
			sBody.EmployeeID = sEmployeeId;
			sBody.RequestID = sRequestId;
			sBody.ChangeStateID = sChangeStateId;
			sBody.LeaveKey = sLeaveKey;
			sBody.StartDate = sStartDate;
			sBody.StartTime = sStartTime;
			sBody.Notes = sNotes;
			sBody.ProcessCheckOnlyInd = (bProcessCheckOnlyInd ? true : false);
			sBody.AbsenceTypeCode = sAbsenceTypeCode;
			sBody.EndDate = sEndDate;
			sBody.EndTime = sEndTime;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if(objResponse.headers["sap-message"]){
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		withdrawLeaveRequest : function(sStatusCode, sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
				errorCallback) {

			if (this.isRecallableLeaveRequest(sStatusCode, sLeaveKey)) {
				this.recallLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback);
			} else {
				this.createDeleteLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
						errorCallback);
			}
		},

		getLeaveRequestsForTimePeriod : function(oStartDate, oEndDate, successCallback, errorCallback) {

			// aLeaveRequests example:
			// [{
			// "StatusCode": "REJECTED",
			// "StatusName": "Abgelehnt",
			// "AbsenceTypeCode": "0148",
			// "AbsenceTypeName": "Krankheit",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// },
			// {
			// "StatusCode": "REJECTED",
			// "StatusName": "Abgelehnt",
			// "AbsenceTypeCode": "0148",
			// "AbsenceTypeName": "Krankheit",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// }]

			// GET
			// /sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/LeaveRequestCollection?$format=json&$filter=StartDate%20eq%20datetime'2013-01-01T00%3A00%3A00'
			// HTTP/1.1

			var sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oStartDate) + 'T00:00:00';
			var sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oEndDate) + 'T00:00:00';
			var sPath = "LeaveRequestCollection";

			var arrParams = ["$filter=StartDate eq datetime'" + sStartDate + "' and EndDate eq datetime'" + sEndDate + "'",
					"$select=StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var aLeaveRequests = [];
				try {
					var oResult = objResponse.results;

					if (oResult instanceof Array) {
						for ( var i = 0; i < oResult.length; i++) {
							var oRequest = new Object();
							oRequest.StatusCode = oResult[i].StatusCode;
							oRequest.StatusName = oResult[i].StatusName;
							oRequest.AbsenceTypeCode = oResult[i].AbsenceTypeCode;
							oRequest.AbsenceTypeName = oResult[i].AbsenceTypeName;
							oRequest.StartDate = oResult[i].StartDate;
							oRequest.StartTime = oResult[i].StartTime;
							oRequest.EndDate = oResult[i].EndDate;
							oRequest.EndTime = oResult[i].EndTime;
							aLeaveRequests.push(oRequest);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getLeaveRequestsForTimePeriod)"]);
					return;
				}
				successCallback(aLeaveRequests);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getWorkSchedulesForTimePeriod : function(oStartDate, oEndDate, successCallback, errorCallback) {

			// aWorkSchedules example:
			// [{
			// "StartDate": Date,
			// "EndDate": Date,
			// "StatusValues": "222000000220200222200000",
			// },
			// {
			// "StartDate": Date,
			// "EndDate": Date,
			// "StatusValues": "222000000220200222200000",
			// }]

			// GET
			// /sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/WorkScheduleCollection?$format=json&$filter=StartDate%20eq%20datetime'2013-3-1T00%3A00'and%20EndDate%20eq%20datetime'2013-5-31T00%3A00'
			// HTTP/1.1

			var sStartDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oStartDate) + 'T00:00:00';
			var sEndDate = hcm.emp.myleaverequests.utils.Formatters.DATE_YYYYMMdd(oEndDate) + 'T00:00:00';
			var sPath = "WorkScheduleCollection";

			var arrParams = ["$filter=StartDate eq datetime'" + sStartDate + "' and EndDate eq datetime'" + sEndDate + "'", "$select=StartDate,EndDate,StatusValues"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var aWorkSchedules = [];
				try {
					// var oResult = this.getWorkScheduleCollectionDataFromXml(this.parseXml(sResponse));
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
						for ( var i = 0; i < oResult.length; i++) {
							var oSchedule = new Object();
							oSchedule.StartDate = oResult[i].StartDate;
							oSchedule.EndDate = oResult[i].EndDate;
							oSchedule.StatusValues = oResult[i].StatusValues;
							aWorkSchedules.push(oSchedule);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getWorkSchedulesForTimePeriod)"]);
					return;
				}
				successCallback(aWorkSchedules);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		// =======
		// private
		// =======

		isRecallableLeaveRequest : function(sStatusCode, sLeaveKey) {
			if (sStatusCode == "CREATED")
				return true;
			if (!sLeaveKey)
				return true;
			for ( var i = 0; i < sLeaveKey.length; i++) {
				var c = sLeaveKey.charAt(i);
				if (c != " " && c != "\t" && c != "\v" && c != "\r" && c != "\n" && c != "0")
					return false;
			}
			return true;
		},

		createDeleteLeaveRequest : function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
				errorCallback) {

			var sBody = {};
			sBody.ActionCode = 03;
			sBody.EmployeeID = sEmployeeId;
			sBody.RequestID = sRequestId;
			sBody.ChangeStateID = sChangeStateId;
			sBody.LeaveKey = sLeaveKey;
			sBody.ProcessCheckOnlyInd = false;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if(objResponse.headers["sap-message"]){
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		recallLeaveRequest : function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback) {

			this._deleteOData("LeaveRequestCollection(EmployeeID='" + sEmployeeId + "',RequestID='" + sRequestId + "',ChangeStateID='" + sChangeStateId + "',LeaveKey='" + sLeaveKey + "')", function(objResponse) {
				successCallback(objResponse);
			}, function(objResponse) {
				errorCallback(hcm.emp.myleaverequests.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		parseErrorMessages : function(objResponse) {

			if (objResponse.response.body && objResponse.response) {
				var dynamicSort = function(property) {
					var sortOrder = 1;
					if(property[0] === "-") {
						sortOrder = -1;
						property = property.substr(1);
					}
					return function (a,b) {
						var result;
						if(a[property] < b[property]){
							result =-1;
						}else if(a[property] > b[property]){
							result=1;
						}else{
							result=0;
						}
						return result * sortOrder;
					};
				};
				try {
					var oResponse = JSON.parse(objResponse.response.body);
					if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
						var result = [];
						result.push(oResponse.error.message.value);
						if (oResponse.error.innererror && oResponse.error.innererror.errordetails
								&& oResponse.error.innererror.errordetails instanceof Array) {
							oResponse.error.innererror.errordetails.sort(dynamicSort("severity"));
							for ( var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
								if (oResponse.error.innererror.errordetails[i].message) {
									var message = oResponse.error.innererror.errordetails[i].message;
									/*if (oResponse.error.innererror.errordetails[i].code) {
										message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
									}*/
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

		getXmlNodeValue : function(oNode) {

			try {
				if (oNode.childNodes.length != 1)
					return null;
				switch (oNode.childNodes[0].nodeType) {
					case 3 :
						return oNode.childNodes[0].data;
				}
			} catch (e) {
				return null;
			};
		},

		getDateFromString : function(sValue) {

			// creates a date from yyyy-mm-ddTHH:MM:SS without timezone shift
			if (sValue.length != 19)
				return null;
			if (sValue.charAt(4) != '-' || sValue.charAt(7) != '-' || sValue.charAt(10) != 'T' || sValue.charAt(13) != ':' || sValue.charAt(16) != ':')
				return null;
			var year = sValue.substring(0, 4) * 1;
			var month = sValue.substring(5, 7) * 1;
			var day = sValue.substring(8, 10) * 1;
			var hour = sValue.substring(11, 13) * 1;
			var minute = sValue.substring(14, 16) * 1;
			var second = sValue.substring(17, 19) * 1;
			return new Date(year, month - 1, day, hour, minute, second);
		},

		populateLeaveRequest : function(leaveRequestProperties) {

			var oLeaveRequest = {};
			for ( var leaveRequestPropertyIdx = 0; leaveRequestPropertyIdx < leaveRequestProperties.length; leaveRequestPropertyIdx++) {
				var value = hcm.emp.myleaverequests.utils.DataManager.getXmlNodeValue(leaveRequestProperties[leaveRequestPropertyIdx]);
				if (value) {
					switch (leaveRequestProperties[leaveRequestPropertyIdx].localName) {
						case "ActionCode" :
						case "LeaveRequestType" :
						case "SequenceID" :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = value * 1;
							break;
						case "ActionDeleteInd" :
						case "ActionModifyInd" :
						case "ProcessCheckOnlyInd" :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = value == "true";
							break;
						case "EndDate" :
						case "FirstSubmissionDate" :
						case "LastChangeDate" :
						case "StartDate" :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = hcm.emp.myleaverequests.utils.DataManager.getDateFromString(value);
							break;
						default :
							oLeaveRequest[leaveRequestProperties[leaveRequestPropertyIdx].localName] = value;
					}
				}
			}
			return oLeaveRequest;
		},

		populateTimeAccount : function(timeAccountProperties) {

			var oLeaveRequest = {};
			for ( var timeAccountPropertyIdx = 0; timeAccountPropertyIdx < timeAccountProperties.length; timeAccountPropertyIdx++) {
				var value = hcm.emp.myleaverequests.utils.DataManager.getXmlNodeValue(timeAccountProperties[timeAccountPropertyIdx]);
				if (value) {
					switch (timeAccountProperties[timeAccountPropertyIdx].localName) {
						case "DeductionStartDate" :
						case "DeductionEndDate" :
							oLeaveRequest[timeAccountProperties[timeAccountPropertyIdx].localName] = hcm.emp.myleaverequests.utils.DataManager.getDateFromString(value);
							break;
						default :
							oLeaveRequest[timeAccountProperties[timeAccountPropertyIdx].localName] = value;
					}
				}
			}
			return oLeaveRequest;
		},

		_getOData : function(sPath, oContext, oUrlParams, successCallback, errorCallback) {

			_modelBase.read(sPath, oContext, oUrlParams, true, function(response) {
				successCallback(response);
			}, function(response) {
				errorCallback(response);
			});

		},

		_postOData : function(sPath, sBody, successCallback, errorCallback) {
			_modelBase.create(sPath, sBody, null, successCallback, errorCallback);
		},

		_deleteOData : function(sPath, successCallback, errorCallback) {

			var oParameters = {};
			oParameters.fnSuccess = successCallback;
			oParameters.fnError = errorCallback;
			_modelBase.remove(sPath, oParameters);
		}

	};

}());