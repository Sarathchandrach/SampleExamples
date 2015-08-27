/*
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