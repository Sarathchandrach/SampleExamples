/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.util.DomHelper");cus.crm.notes.util.DomHelper={replaceCssClassById:function(i,o,n){jQuery.sap.delayedCall(20,this,function(){$(i).removeClass(o).addClass(n)})}};
