/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.util.Util");cus.crm.notes.util.Util={refreshHeaderETag:function(p,c){var m=c.oModel;if(m.getContext("/"+p)){m.deleteCreatedEntry(m.getContext("/"+p))}m.createBindingContext("/"+p,null,function(C){},true)},show412ErrorDialog:function(c,o){sap.ca.ui.message.showMessageBox({type:sap.ca.ui.message.Type.ERROR,message:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')},o)}};
