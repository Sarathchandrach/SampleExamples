/*
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