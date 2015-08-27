/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.mycalendar.util.ApptListItem");
jQuery.sap.require("sap.m.ListItemBase");

sap.m.ListItemBase.extend("cus.crm.mycalendar.util.ApptListItem", {

	metadata : {
		// ---- control specific ----
		library : "cus.crm.mycalendar.util",
		defaultAggregation : "content",
		aggregations : {
			"content" : {
				type : "sap.ui.core.Control",
				multiple : true,
				singularName : "content",
				bindable : "bindable"
			}
		},

		properties : {
			"title" : {
				type : "string"
			},
			"subtitle" : {
				type : "string"
			},
			"account" : {
				type : "string"
			},
			"location" : {
				type : "string"
			},
			"time" : {
				type : "string"
			},
			"duration" : {
				type : "string"
			},
			"privat" : {
				type : "boolean"
			}
		}
	},

	renderer : {

		renderLIContent : function(oRm, oControl) {
          
			var bRTL = sap.ui.getCore().getConfiguration().getRTL();
            
			oRm.write("<div class='listItemCSS'");
			oRm.write(">");			

			oRm.write("<div ");
			oRm.addClass("cusMyApptLiOutter");
			oRm.writeClasses();
			oRm.write(">");
			
			// attachment needle first
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiAttch");
			
			if(bRTL){
			   oRm.addClass("cusMyApptLiAttchRTL");	
			}
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.getContent()[1]); 
			oRm.write("</div>");			
			
			// - left part of item
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiLeft");
			if (jQuery.device.is.phone) {
				oRm.addClass("cusMyApptLiLeftPhone");// different width as no Duration is needed
			}
			oRm.addClass("cusMyApptLiPadding");
			oRm.writeClasses();
			oRm.write(">");
			// -- Time
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiTime");
			oRm.addClass("cusMyApptLiEllipsis");
			oRm.addClass("sapMSLITitle");
			oRm.addClass("sapThemeText-asColor");
			oRm.writeClasses();
			oRm.write(">");
			if (oControl.getTime()) {
				oRm.writeEscaped(oControl.getTime());
			}
			oRm.write("</div>");

			// -- Duration
			if (!jQuery.device.is.phone) { // Duration is not shown in phone layout
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.addClass("sapMSLIDescription");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getDuration()) {
					oRm.writeEscaped(oControl.getDuration());
				}
				oRm.write("</div>");
			}
			oRm.write("</div>");

			// - middle part Item

			oRm.write("<div ");
			oRm.addClass("cusMyApptLiMiddle");
			oRm.addClass("cusMyApptLiPadding");
			if (jQuery.device.is.phone) {
				oRm.addClass("cusMyApptLiMiddlePhone");// different width as there is no right part
			}
			oRm.writeClasses();
			oRm.write(">");

			// -- Titel
			oRm.write("<div ");
			oRm.addClass("cusMyApptLiEllipsis");
			oRm.addClass("cusMyApptLiTitel");
			oRm.addClass("sapThemeFontSize");
			oRm.addClass("sapMSLITitle");
			oRm.writeClasses();
			oRm.write(">");
			if (oControl.getTitle()) {
				oRm.writeEscaped(oControl.getTitle());
			}
			oRm.write("</div>");

			// -- Subtitle
			if (jQuery.device.is.phone) {
				// --- Phone--> Location only
				oRm.write("<div ");
				oRm.addClass("sapMSLIDescription");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getLocation()) {
					oRm.writeEscaped(oControl.getLocation());
				}
				oRm.write("</div>");
			} else { // Desktop + Tablet
				oRm.write("<div ");
				oRm.addClass("sapMSLIDescription");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getSubtitle()) {
					oRm.writeEscaped(oControl.getSubtitle());
				}
				oRm.write("</div>");
			}
			oRm.write("</div>");

			// - right part of item
			// is not relevant in phone layout
			if (!jQuery.device.is.phone) {
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiRight");
				oRm.addClass("cusMyApptLiPadding");
				oRm.writeClasses();
				oRm.write(">");

				// Status
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.addClass("cusMyApptLiStatus");
				oRm.addClass("sapMSLIDescription");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getContent()[0]) {
					oRm.renderControl(oControl.getContent()[0]);
				}
				oRm.write("</div>");

				// private Icon
				oRm.write("<div ");
				oRm.addClass("cusMyApptLiEllipsis");
				oRm.addClass("sapMSLIDescription");
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getPrivat()) {
					oRm.writeEscaped(cus.crm.mycalendar.util.Util.geti18NText("view.Appointment.private"));
				}
				oRm.write("</div>");

				oRm.write("</div>");
			}

			oRm.write("</div>");
			oRm.write("</div>");
		}
	}

});
