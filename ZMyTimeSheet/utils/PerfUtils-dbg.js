/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.emp.mytimesheet.utils.PerfUtils");

hcm.emp.mytimesheet.utils.PerfUtils = {
		
	TIMESHEET_MAIN_LOAD : "hcm.emp.mytimesheet.TIMESHEET_MAIN_LOAD",
	TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT : "hcm.emp.mytimesheet.TIMESHEET_MAIN_QUICK_ENTRY_SUBMIT",
	TIMESHEET_SETTINGS_INIT : "hcm.emp.mytimesheet.TIMESHEET_SETTINGS_INIT",
	WEEK_ENTRY_LOAD : "hcm.emp.mytimesheet.WEEK_ENTRY_LOAD",
	EDIT_ENTRY_LOAD : "hcm.emp.mytimesheet.EDIT_ENTRY_LOAD",
	COST_ASSIGNMENT_LOAD : "hcm.emp.mytimesheet.COST_ASSIGNMENT_LOAD",
	COST_ASSIGNMENT_SEARCH_LOAD : "hcm.emp.mytimesheet.COST_ASSIGNMENT_SEARCH_LOAD",
	WEEK_ENTRY_SUBMIT : "hcm.emp.mytimesheet.WEEK_ENTRY_SUBMIT",
	SERVICE_GET_WORK_DAYS : "hcm.emp.mytimesheet.SERVICE_GET_WORK_DAYS",
	SERVICE_GET_PROJECT_SUMMARY : "hcm.emp.mytimesheet.SERVICE_GET_PROJECT_SUMMARY",
	SERVICE_GET_WORKLIST_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_WORKLIST_COLLECTION",
	SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_COLLECTION",
	SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_COST_ASSIGNMENT_WORKLIST_TYPE_COLLECTION",
	SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION : "hcm.emp.mytimesheet.SERVICE_GET_COST_ASSIGNMENT_TYPE_LIST_COLLECTION",
	SERVICE_GET_INITIAL_INFOS : "hcm.emp.mytimesheet.SERVICE_GET_INITIAL_INFOS",
	SERVICE_GET_TIME_ENTRY : "hcm.emp.mytimesheet.SERVICE_GET_TIME_ENTRY",
	SERVICE_GET_PROJECTS : "hcm.emp.mytimesheet.SERVICE_GET_PROJECTS",
	SERVICE_GET_TASK_TYPES : "hcm.emp.mytimesheet.SERVICE_GET_TASK_TYPES",
	SERVICE_SUBMIT_QUICK_ENTRY : "hcm.emp.mytimesheet.SERVICE_SUBMIT_QUICK_ENTRY",
	SERVICE_GET_SETTINGS : "hcm.emp.mytimesheet.SERVICE_GET_SETTINGS",
	SERVICE_SET_SETTINGS : "hcm.emp.mytimesheet.SERVICE_SET_SETTINGS",
	HELP_INIT : "hcm.emp.mytimesheet.HELP_INIT",
	_mCounter : {},
	getMeasurements : function() {
		var aMeasures = jQuery.sap.measure.getAllMeasurements();
		var aOutputs = [];
		for ( var i in aMeasures) {
			var oMeasure = aMeasures[i];
			if (oMeasure.id.indexOf("sap.hcm.timesheet") === 0) {
				var oOutput = {
					"id" : oMeasure.id,
					"info" : (oMeasure.info ? oMeasure.info : ''),
					"start" : oMeasure.start.toString(),
					"end" : oMeasure.end.toString(),
					"time" : oMeasure.time,
					"duration" : oMeasure.duration
				};
				aOutputs.push(oOutput);
			}
		}
		var sOutput = JSON.stringify(aOutputs);
		return sOutput;
	},
	getStartId : function(id) {
		if (hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] === undefined) {
			hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] = -1;
		}
		hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id]++;
		return id + " ("
				+ hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] + ")";
	},
	getEndId : function(id) {
		if (hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] === undefined) {
			hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] = 0;
		}
		return id + " ("
				+ hcm.emp.mytimesheet.utils.PerfUtils._mCounter[id] + ")";
	},
	start : function(id, subId) {
		if (subId) {
			id += "_" + subId;
		}
		jQuery.sap.measure.start(hcm.emp.mytimesheet.utils.PerfUtils
				.getStartId(id));
	},
	end : function(id, subId) {
		if (subId) {
			id += "_" + subId;
		}
		jQuery.sap.measure.end(hcm.emp.mytimesheet.utils.PerfUtils
				.getEndId(id));
	}

};
