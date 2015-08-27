/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mytasks.util.Schema");

cus.crm.mytasks.util.Schema = {
	_iServiceSchemaVersion : null,
	_iServiceVersion : null,
	_oModel : null,
	getServiceVersion : function() {
		return this._iServiceVersion;
	},

	getServiceSchemaVersion : function() {
		return this._iServiceSchemaVersion;
	},

	getModel : function() {
		return this._oModel;
	},

	_setModel : function(oModel) {
		this._oModel = oModel;
	},

	initServiceSchemaVersion : function(oModel, sEntityName) {
		this._setModel(oModel);
		var iVa = this._getEntityAnnotation(oModel, "service-schema-version",
				sEntityName);
		var iVb = this._getEntityAnnotation(oModel, "service-version",
				sEntityName);
		// defaults to initial service version (1)
		this._iServiceVersion = iVa != null ? parseInt(iVb) : 1;
		this._iServiceSchemaVersion = iVb != null ? parseInt(iVa) : 1;
	},

	_getEntityAnnotation : function(oModel, sAnnotationName, sEntityName) {
		// retrieve the metadata of the passed OData model
		var oMMd = oModel.getServiceMetadata();
		// check for proper metadata structure
		if (oMMd && oMMd.dataServices && oMMd.dataServices.schema
				&& oMMd.dataServices.schema.length > 0
				&& oMMd.dataServices.schema[0].entityType) {
			// determine the annotation by name using the first
			// annotated entity
			var aEntityTypes = oMMd.dataServices.schema[0].entityType;
			for ( var i = -1, oCurEntity; oCurEntity = aEntityTypes[++i];)
				if (sEntityName === oCurEntity.name && oCurEntity.extensions)
					for ( var j = -1, oCurExtn; oCurExtn = oCurEntity.extensions[++j];)
						if (oCurExtn.name === sAnnotationName)
							return oCurExtn.value;
		}
		return null;
	},

	_getPropertyInfoOfEntity : function(sEntityName, sPropertyName) {
		var oModel = this.getModel(), oMMd = oModel.getServiceMetadata();
		if (oMMd && oMMd.dataServices && oMMd.dataServices.schema
				&& oMMd.dataServices.schema.length > 0
				&& oMMd.dataServices.schema[0].entityType) {
			var aEntityTypes = oMMd.dataServices.schema[0].entityType;
			for ( var i = -1, oCurEntity; oCurEntity = aEntityTypes[++i];)
				if (sEntityName === oCurEntity.name && oCurEntity.property)
					for ( var j = -1, oCurProperty; oCurProperty = oCurEntity.property[++j];)
						if (oCurProperty.name === sPropertyName)
							return oCurProperty;
		}
		return null;
	},
};