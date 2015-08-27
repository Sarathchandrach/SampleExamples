/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.BubbleChartRenderer");sap.crm.BubbleChartRenderer={};
sap.crm.BubbleChartRenderer.render=function(r,c){if(!c.getVisible())return;r.write("<div");r.writeControlData(c);r.addClass("bubble");r.writeClasses();r.write(">");r.write("</div>")};
