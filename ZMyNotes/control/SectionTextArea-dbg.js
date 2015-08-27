/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.notes.control.SectionTextArea");

sap.m.TextArea.extend("cus.crm.notes.control.SectionTextArea", {
	
	 metadata:{
	      events: {
	          "merge" : {}
	      }  
	    },
	
	onAfterRendering : function(evt){
		var oListItem = this.getParent();
		var oList = oListItem.getParent();
		
		if (sap.m.TextArea.prototype.onAfterRendering) {   // check whether superclass has an onAfterRendering() method
            sap.m.TextArea.prototype.onAfterRendering.apply(this, evt);  // call super.onAfterRendering()
         }
		
		if (oList.indexOfItem(oListItem) === 0){
			this.setPlaceholder(this.getModel("i18n").getResourceBundle().getText("SECTION_NO_DATA_TEXT"));
		};
		
		var domRefTextArea = this.getDomRef();
        var textarea = $(domRefTextArea).find("textarea");

        if(textarea[0].scrollHeight) {
        	textarea[0].style.height = textarea[0].scrollHeight + 'px';
        }
     
        textarea[0].style.overflow = "hidden";
        if(jQuery.browser.mozilla){
	        textarea[0].style.paddingTop = "0px";
	        textarea[0].style.paddingBottom = "0px";        
	    }
        $(textarea[0]).addClass("customNoteSection");
	},
	
	onsapbackspace : function(evt){
	
		var textarea = this.$().find("textarea");
		var bIsSelection = textarea[0].selectionStart != textarea[0].selectionEnd;
    	if (textarea.cursorPos() === 0 && !bIsSelection){
    		evt.preventDefault();
    		this.fireMerge({originalEvent: evt, Key: "backspace"});
    	}
		
	},
	
	onsapdelete : function(evt){
		var textLength = this.getValue().length;
		var cursorPos = this.$().find("textarea").cursorPos();
    	if (cursorPos === textLength){
    		evt.preventDefault();
    		this.fireMerge({originalEvent: evt, Key: "delete"});
    	}
		
	},
	
	renderer : "sap.m.TextAreaRenderer"
});
