/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.mgr.approve.timesheet.utility.Parser");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

hcm.mgr.approve.timesheet.utility.Parser = (function() {
	if (!this.oApplication) {
		this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
	}
	var oBundle = this.oApplication.getResourceBundle();
	var _objTimePendingCacheData = null;
	var _cntrlrInst = null;
	return {
		
		setCachedData : function(oData){
			_objTimePendingCacheData = oData;
		},
		getCachedData : function(oData){
			return _objTimePendingCacheData;
		},
		setControllerInstance : function(oControllerInst) {
			_cntrlrInst = oControllerInst;
		},

		getControllerInstance : function() {
			return _cntrlrInst;
		},
		EmployeeData: function(modelData) {
			var timeEntry = modelData;

			var Employee = [];

			if (timeEntry.length > 0) {

				var emp = {
					"EmpName": timeEntry[0].Empname,
					"Pernr": timeEntry[0].Pernr,
					"Posname": timeEntry[0].Posname,
					"Completion": "",
					"NumberState": "",// added as part of ux requirement to set the number state
					"Weeks": [{
						"Weeknr": timeEntry[0].Weeknr,
						"Weekstart": timeEntry[0].Weekstart,
						"Weekend": timeEntry[0].Weekend,
						"Plannedhours": timeEntry[0].Plannedhours,
						"Actualhours": timeEntry[0].Actualhours,
						"Percentage": "",
						"Overtime": "",
						"Days": [{
							"Workdate": timeEntry[0].Workdate,

							"Conr": timeEntry[0].Conr,
							"Cotype": timeEntry[0].Cotype,
							"Codesc": timeEntry[0].Codesc,
							"Counter": timeEntry[0].Counter,
							"Catstype": timeEntry[0].Catstype,
							"Catsdesc": timeEntry[0].Catsdesc,
							"CatsText": timeEntry[0].CatsText,
							"Actualhours": timeEntry[0].Actualhours,
							"Plannedhours": timeEntry[0].Plannedhours,
							"TimeText":timeEntry[0].Awart,
							/*"TimeText": this.getTimeText(
								timeEntry[0].Actualhours,
								timeEntry[0].Plannedhours), */
							"Status": "A",
							"Lstar":timeEntry[0].Lstar,
							"Lgart":timeEntry[0].Lgart,
							"RejectionReason": "",
							"RejectionReasonText": "",
						}],
					}]

				};

				Employee.push(emp);

				for (var idx = 1; idx < timeEntry.length; idx++) {
					for (var i in Employee) {
						if (Employee[i].Pernr === timeEntry[idx].Pernr) {
							var Week = Employee[i].Weeks;
							for (var j in Week) {
								if (Week[j].Weeknr === timeEntry[idx].Weeknr) {
									var Day = Employee[i].Weeks[j].Days;
									var actual = parseFloat(Employee[i].Weeks[j].Actualhours) + parseFloat(timeEntry[idx].Actualhours);
									var planned = parseFloat(Employee[i].Weeks[j].Plannedhours) + parseFloat(timeEntry[idx].Plannedhours);
									Employee[i].Weeks[j].Actualhours = actual;
									Employee[i].Weeks[j].Plannedhours = planned;

									if (Day.length === 0) {
										Employee[i].Weeks[j].Actualhours = 0;
										Employee[i].Weeks[j].Plannedhours = 0;
									}
									var day = {};
									day.Workdate = timeEntry[idx].Workdate;

									day.Conr = timeEntry[idx].Conr;
									day.Cotype = timeEntry[idx].Cotype;
									day.Codesc = timeEntry[idx].Codesc;
									day.Counter = timeEntry[idx].Counter;
									day.Catstype = timeEntry[idx].Catstype;
									day.Catsdesc = timeEntry[idx].Catsdesc;
									day.CatsText = timeEntry[idx].CatsText;
									day.Actualhours = timeEntry[idx].Actualhours;
									day.Plannedhours = timeEntry[idx].Plannedhours;
									day.TimeText = timeEntry[idx].Awart;
									day.Lstar = timeEntry[idx].Lstar;
									day.Lgart = timeEntry[idx].Lgart;
									/*"TimeText": this.getTimeText(
									timeEntry[0].Actualhours,
									timeEntry[0].Plannedhours), */
									day.Status = "A";
									day.RejectionReason = "";
									day.RejectionReasonText = "";
									Employee[i].Weeks[j].Days.push(day);
									break;

								} else {
									var flag = 0;
									for (var k in Week){
										if (Week[k].Weeknr === timeEntry[idx].Weeknr){
											flag = 1;
										}
									}
									if (flag === 0) {
										var week = {};
										week.Weeknr = timeEntry[idx].Weeknr;
										week.Weekstart = timeEntry[idx].Weekstart;
										week.Weekend = timeEntry[idx].Weekend;
										week.Plannedhours = timeEntry[idx].Plannedhours;
										week.Actualhours = timeEntry[idx].Actualhours;
										week.Weekstart = timeEntry[idx].Weekstart;
										week.Percentage = "";
										week.Overtime = "";
										var day = {};
										day.Workdate = timeEntry[idx].Workdate;
										//Note 2027185: Missing cotype and codesc
										day.Cotype = timeEntry[idx].Cotype;
										day.Codesc = timeEntry[idx].Codesc;
										//Note 2027185:end Missing cotype and codesc
										day.Catstype = timeEntry[idx].Catstype;
										day.Catsdesc = timeEntry[idx].Catsdesc;
										day.CatsText = timeEntry[idx].CatsText;
										day.Counter = timeEntry[idx].Counter;
										day.Actualhours = timeEntry[idx].Actualhours;
										day.Plannedhours = timeEntry[idx].Plannedhours;
										day.TimeText = timeEntry[idx].Awart;
										day.Lstar = timeEntry[idx].Lstar;
										day.Lgart = timeEntry[idx].Lgart;
										/*"TimeText": this.getTimeText(
										timeEntry[0].Actualhours,
										timeEntry[0].Plannedhours), */
										day.Status = "A";
										day.RejectionReason = "";
										day.RejectionReasonText = "";
										week.Days = [];
										week.Days.push(day);
										Employee[i].Weeks.push(week);
									}
								}
							}
						} else {
							var flag = 0;
							for (var index in Employee) {
								if (Employee[index].Pernr === timeEntry[idx].Pernr)
									flag = 1;
							}
							if (flag === 0) {
								var emp = {
									"EmpName": timeEntry[idx].Empname,
									"Pernr": timeEntry[idx].Pernr,
									"Posname": timeEntry[idx].Posname,
									"Completion": "",
									"Weeks": [{
										"Weeknr": timeEntry[idx].Weeknr,
										"Weekstart": timeEntry[idx].Weekstart,
										"Weekend": timeEntry[idx].Weekend,
										"Actualhours": timeEntry[idx].Actualhours,
										"Plannedhours": timeEntry[idx].Plannedhours,
										"Percentage": "",
										"Overtime": "",
										"Days": [{
											"Workdate": timeEntry[idx].Workdate,

											"Conr": timeEntry[idx].Conr,
											"Cotype": timeEntry[idx].Cotype,
											"Codesc": timeEntry[idx].Codesc,
											"Counter": timeEntry[idx].Counter,
											"Catstype": timeEntry[idx].Catstype,
											"Catsdesc": timeEntry[idx].Catsdesc,
											"CatsText": timeEntry[idx].CatsText,
											"Actualhours": timeEntry[idx].Actualhours,
											"Plannedhours": timeEntry[idx].Plannedhours,
											"TimeText":timeEntry[idx].Awart,
											"Lstar":timeEntry[idx].Lstar,
											"Lgart":timeEntry[idx].Lgart,
											/*"TimeText": this.getTimeText(
												timeEntry[0].Actualhours,
												timeEntry[0].Plannedhours), */
											"Status": "A",
											"RejectionReason": "",
											"RejectionReasonText": "",
										}]
									}]
								};

								Employee.push(emp);
							}
						}

					}
				}
			}

			for (var id in Employee) {
				var complete = 0;
				var percent = 0;
				var EmpOvertime = 0;
				var oModelData = Employee[id].Weeks;
				for (var i in oModelData) {
					percent = (parseFloat(oModelData[i].Actualhours) / parseFloat(oModelData[i].Plannedhours)) * 100;
					var OT = parseFloat(oModelData[i].Actualhours) - parseFloat(oModelData[i].Plannedhours);

					if (percent > 100)
						percent = 100;
					complete = percent + complete;
					if (OT > 0) {
						EmpOvertime = EmpOvertime + OT;
						Employee[id].Weeks[i].Overtime = this
							.overtimeFormatter(OT) + " " + oBundle.getText("TSA_OVERTIME");
					} else {
						Employee[id].Weeks[i].Overtime = "";
					}
					Employee[id].Weeks[i].Percentage = parseInt(percent, 0) + "%";
					Employee[id].Weeks[i].DayVisible = false;
					Employee[id].Weeks[i].DayVisibleText = oBundle
						.getText("TSA_SHOW");
				}
				if (EmpOvertime > 0) {
					Employee[id].Overtime = this.overtimeFormatter(EmpOvertime) + " " + oBundle.getText("TSA_OVERTIME");
				} else {
					Employee[id].Overtime = "";
				}
				Employee[id].Completion = parseInt(complete / Employee[id].Weeks.length, 0) + "%";
				// set the number state based on the value 'number' - added as part of ux design review
				Employee[id].NumberState= (Employee[id].Completion === "100%")?sap.ui.core.ValueState.Success:sap.ui.core.ValueState.Error; 

				var weeksText = oBundle.getText("TSA_WEEK");
				if (Employee[id].Weeks.length > 1) {
					weeksText = oBundle.getText("TSA_WEEKS");
				}
				Employee[id].No_Week = Employee[id].Weeks.length + " " + weeksText;
			}

			return Employee;
		},

		CostAssignmentData: function(modelData) {
			var timeEntry = modelData;
			// var Employee = [];
			var CA = [];

			if (timeEntry.length > 0) {

				var ca = {
					"Conr": timeEntry[0].Conr,
					"Cotype": timeEntry[0].Cotype,
					"Codesc": timeEntry[0].Codesc,
					"No_People": "",
					"Peoples": [{
						"EmpName": timeEntry[0].Empname,
						"Pernr": timeEntry[0].Pernr,
						"Posname": timeEntry[0].Posname,
						"Actualhours": timeEntry[0].Actualhours,
						"Plannedhours": timeEntry[0].Plannedhours,
						"Completion": "",
						"Overtime": "",
						"Days": [{
							"Workdate": timeEntry[0].Workdate,

							"Catstype": timeEntry[0].Catstype,
							"Catsdesc": timeEntry[0].Catsdesc,
							"CatsText": timeEntry[0].CatsText,
							"Counter": timeEntry[0].Counter,
							"Actualhours": timeEntry[0].Actualhours,
							"Plannedhours": timeEntry[0].Plannedhours,
							"TimeText":timeEntry[0].Awart,
							"Lstar":timeEntry[0].Lstar,
							"Lgart":timeEntry[0].Lgart,
							/*"TimeText": this.getTimeText(
								timeEntry[0].Actualhours,
								timeEntry[0].Plannedhours), */
							"Status": "A",
							"RejectionReason": "",
							"RejectionReasonText": "",
						}]
					}]

				};

				CA.push(ca);

				for (var idx = 1; idx < timeEntry.length; idx++) {
					for (var i in CA) {
						if (CA[i].Conr === timeEntry[idx].Conr) {
							var People = CA[i].Peoples;
							for (var j in People) {
								if (People[j].Pernr === timeEntry[idx].Pernr) {
									var Day = CA[i].Peoples[j].Days;
									if (Day.length === 0 || Day === undefined) {
										CA[i].Peoples[j].Actualhours = 0;
										CA[i].Peoples[j].Plannedhours = 0;
									}

									var actual = parseFloat(CA[i].Peoples[j].Actualhours) + parseFloat(timeEntry[idx].Actualhours);
									var planned = parseFloat(CA[i].Peoples[j].Plannedhours) + parseFloat(timeEntry[idx].Plannedhours);
									CA[i].Peoples[j].Actualhours = actual;
									CA[i].Peoples[j].Plannedhours = planned;
									var day = {};
									day.Workdate = timeEntry[idx].Workdate;

									day.Conr = timeEntry[idx].Conr; // changes
									// by Pankaj
									// for
									// receiver
									// issue
									day.Cotype = timeEntry[idx].Cotype;
									day.Codesc = timeEntry[idx].Codesc;
									day.Catstype = timeEntry[idx].Catstype;
									day.Catsdesc = timeEntry[idx].Catsdesc;
									day.CatsText = timeEntry[idx].CatsText;
									day.Counter = timeEntry[idx].Counter;
									day.Actualhours = timeEntry[idx].Actualhours;
									day.Plannedhours = timeEntry[idx].Plannedhours;
									day.TimeText = timeEntry[idx].Awart;
									day.Lstar = timeEntry[idx].Lstar;
									day.Lgart = timeEntry[idx].Lgart;
										/*"TimeText": this.getTimeText(
											timeEntry[0].Actualhours,
											timeEntry[0].Plannedhours), */
									day.Status = "A";
									day.RejectionReason = "";
									day.RejectionReasonText = "";
									CA[i].Peoples[j].Days.push(day);
									break;

								} else {
									var flag = 0;
									for (var k in People){
										if (People[k].Pernr === timeEntry[idx].Pernr){
											flag = 1;
										}
									}
									if (flag === 0) {
										var people = {};
										people.EmpName = timeEntry[idx].Empname;
										people.Pernr = timeEntry[idx].Pernr;
										people.Posname = timeEntry[idx].Posname;
										people.Actualhours = timeEntry[idx].Actualhours;
										people.Plannedhours = timeEntry[idx].Plannedhours;
										people.Completion = "";
										people.Overtime = "";
										var day = {};
										day.Workdate = timeEntry[idx].Workdate;

										day.Conr = timeEntry[idx].Conr; // changes
										// by
										// Pankaj
										// for
										// receiver
										// issue
										day.Cotype = timeEntry[idx].Cotype;
										day.Codesc = timeEntry[idx].Codesc;
										day.Catstype = timeEntry[idx].Catstype;
										day.Catsdesc = timeEntry[idx].Catsdesc;
										day.CatsText = timeEntry[idx].CatsText;
										day.Counter = timeEntry[idx].Counter;
										day.Actualhours = timeEntry[idx].Actualhours;
										day.Plannedhours = timeEntry[idx].Plannedhours;
										day.TimeText = timeEntry[idx].Awart;
										day.Lstar = timeEntry[idx].Lstar;
										day.Lgart = timeEntry[idx].Lgart;
										/*"TimeText": this.getTimeText(
										timeEntry[0].Actualhours,
										timeEntry[0].Plannedhours), */
										day.Status = "A";
										day.RejectionReason = "";
										day.RejectionReasonText = "";
										people.Days = [];
										people.Days.push(day);
										CA[i].Peoples.push(people);
									}
								}
							}
						} else {
							var flag = 0;
							for (var index in CA) {
								if (CA[index].Conr === timeEntry[idx].Conr){
									flag = 1;
								}
							}
							if (flag === 0) {
								var ca = {
									"Conr": timeEntry[idx].Conr,
									"Cotype": timeEntry[idx].Cotype,
									"Codesc": timeEntry[idx].Codesc,
									"No_People": "",
									"Peoples": [{
										"EmpName": timeEntry[idx].Empname,
										"Pernr": timeEntry[idx].Pernr,
										"Posname": timeEntry[idx].Posname,
										"Actualhours": timeEntry[idx].Actualhours,
										"Plannedhours": timeEntry[idx].Plannedhours,
										"Completion": "",
										"Overtime": "",
										"Days": [{
											"Workdate": timeEntry[idx].Workdate,

											"Catstype": timeEntry[idx].Catstype,
											"Catsdesc": timeEntry[idx].Catsdesc,
											"CatsText": timeEntry[idx].CatsText,
											"Counter": timeEntry[idx].Counter,
											"Actualhours": timeEntry[idx].Actualhours,
											"Plannedhours": timeEntry[idx].Plannedhours,
											"TimeText":timeEntry[idx].Awart,
											"Lstar":timeEntry[idx].Lstar,
											"Lgart":timeEntry[idx].Lgart,
											/*"TimeText": this.getTimeText(
												timeEntry[0].Actualhours,
												timeEntry[0].Plannedhours), */
											"Status": "A",
											"RejectionReason": "",
											"RejectionReasonText": "",
										}]
									}]

								};
								CA.push(ca);
							}
						}

					}
				}
			}

			for (var id in CA) {
				var complete = 0;
				var percent = 0;
				var ProjOvertime = 0;
				var oModelData = CA[id].Peoples;
				for (var i in oModelData) {
					percent = (parseFloat(oModelData[i].Actualhours) / parseFloat(oModelData[i].Plannedhours)) * 100;
					var OT = parseFloat(oModelData[i].Actualhours) - parseFloat(oModelData[i].Plannedhours);
					if (percent > 100)
						percent = 100;
					complete = percent + complete;
					if (OT > 0) {
						ProjOvertime = ProjOvertime + OT;
						CA[id].Peoples[i].Overtime = this.overtimeFormatter(OT) + " " + oBundle.getText("TSA_OVERTIME");
					} else {
						CA[id].Peoples[i].Overtime = "";
					}

					CA[id].Peoples[i].Completion = parseInt(percent, 0) + "%";
					CA[id].Peoples[i].DayVisible = false;
					CA[id].Peoples[i].DayVisibleText = oBundle
						.getText("TSA_SHOW");
				}
				if (ProjOvertime > 0) {
					CA[id].Overtime = this.overtimeFormatter(ProjOvertime) + " " + oBundle.getText("TSA_OVERTIME");
				} else {
					CA[id].Overtime = "";
				}
				// CA[id].Completion = parseInt(complete /
				// CA[id].Peoples.length) + "%";
				CA[id].No_People = CA[id].Peoples.length;
			}

			return CA;

		},
	/*	getTimeText: function(actual, planned) {
			var time = parseFloat(actual) - parseFloat(planned);
			var timeText = "";
			if (time > 0) {
				timeText = oBundle.getText("TSA_OVERTIME");
			} else {
				timeText = oBundle.getText("TSA_REGULARTIME");
			}
			return timeText;
		}, */
		overtimeFormatter: function(c) {
			var hours = parseInt(c, 0);
			var minutes = (c - hours) * 60;
			var h = oBundle.getText("TSA_HOUR_SHORT");
			var m = oBundle.getText("TSA_MIN_SHORT");
			return (hours + h + " " + minutes + m);
		},
		parseDateWeek : function(start, end) {
			var formatedDate = sap.ca.ui.model.format.DateFormat.getDateInstance({pattern : "YYYYMMdd"});
			return formatedDate.parse(start).toDateString().substring(4, 16)+ " - "+ formatedDate.parse(end).toDateString().substring(4, 16);

		},
		parseTimeDisplay : function(data) {
			if (data != undefined && data !== "") {
				var hours = parseInt(data);
				var minutes = parseInt((data - hours) * 60);
				var hour = oBundle.getText("TSA_HOUR_SHORT");
				var min = oBundle.getText("TSA_MIN_SHORT");
				return hours + hour + " " + minutes + min;
			} else
				return "";

		},
		parseDateDay : function(data) {
			if (data !== undefined && data !== null) {
				var formattedData = sap.ui.core.format.DateFormat.getDateInstance({
							pattern : "YYYYMMdd"
						});
				return formattedData.parse(data).toDateString();
			}
		},
		projectCode : function(Cotype, Codesc) {
			return Cotype + " - " + Codesc;
		},
		projectTitle : function(cotype, codesc) {
			return cotype + ':' + codesc;
		},
		statusToBoolean : function(status) {
			return status == "A" ? true : false;
		},
		parseOverTime : function(data) {
			if (data !== null && data.length !== 0) {
				var values = data.split(" ");
				var min = oBundle.getText("TSA_MIN_SHORT");
				return values[0] + " " + parseInt(values[1]) + min + " "
						+ values[2];
			} else {
				return data;
			}
		}
	};
}());