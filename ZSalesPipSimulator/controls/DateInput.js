/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.DateInput");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.m.Input");sap.m.Input.extend("sap.crm.DateInput",{});
sap.crm.DateInput.prototype._getValueHelpIcon=function(){var t=this;if(!this._oValueHelpIcon){var u=sap.ui.core.IconPool.getIconURI("appointment-2");this._oValueHelpIcon=sap.ui.core.IconPool.createControlByURI({id:this.getId()+"__vhi",src:u});this._oValueHelpIcon.addStyleClass("sapMInputValHelpInner");this._oValueHelpIcon.attachPress(function(e){t.fireValueHelpRequest()})}return this._oValueHelpIcon};
