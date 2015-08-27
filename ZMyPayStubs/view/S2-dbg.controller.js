/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.emp.payslip.view.S2", {

    onInit : function() {
        // execute the onInit for the base class ScfldMasterController
        sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);
        
        this._page = this.getView().byId("PAYSLIP_MASTER_PAGE");
        
        if (jQuery.device.is.phone) {
            this.getView().addEventDelegate({onBeforeShow : jQuery.proxy(this.onBeforeShow , this)}, this);
        }
        
        
        
    },
    
    onBeforeShow : function () {

        if (this._lastScrollY != null) {
            this._page.scrollTo(this._lastScrollY ,10);
        }
    },
	/**
	 * @override
	 *
	 * @param oItem
	 * @param sFilterPattern
	 * @returns {*}
	 */
    
    applySearchPatternToListItem:function(oItem, sFilterPattern) {
        if (sFilterPattern == "") {
            return true;
        }
        //uncomment to search in oModel data Note: may mislead user!
        /*var oIteshellata = oItem.getBindingContext(this.sModelName).getProperty();
        for (var sKey in oIteshellata) {
            var sValue = oIteshellata[sKey];
            // if (sValue instanceof Date) {
            // //just for the filter take each number as string
            // sValue = sValue.getDate() + "." +
            // sValue.getMonth() + "." + sValue.getFullYear();
            // }
            if (typeof sValue == "string") {
                if (sValue.toLowerCase().indexOf(sFilterPattern) != -1) {
                    return true;
                }
            }
        }*/
        // if nothing found in unformatted data, check UI
        // elements
        if ((oItem.getIntro() && oItem.getIntro().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getTitle() && oItem.getTitle().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getNumber() && oItem.getNumber().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getNumberUnit() && oItem.getNumberUnit().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getFirstStatus() && oItem.getFirstStatus().getText().toLowerCase().indexOf(sFilterPattern) != -1) 
        || (oItem.getSecondStatus() && oItem.getSecondStatus().getText().toLowerCase().indexOf(sFilterPattern) != -1)) {
            return true;
        }
        // last source is attribute array
        var aAttributes = oItem.getAttributes();
        for (var j = 0; j < aAttributes.length; j++) {
            if (aAttributes[j].getText().toLowerCase().indexOf(sFilterPattern) != -1) {
                return true;
            }
        }
        return false;
    },
	
	getHeaderFooterOptions : function() {
		return {
			sI18NMasterTitle : "DISPLAY_NAME_LIST"
	//		onEditPress : function() {
	//			jQuery.sap.log.info("master list: edit pressed");
	//		}
		};
	},
	
    setListItem: function(oItem) {
    	
    	var oList = this.getList();
    	 
        oList.removeSelections();

        oItem.setSelected(true);
        oList.setSelectedItem(oItem, true);
        
        
        if(jQuery.device.is.desktop){
        this.oRouter.navTo("detail", {   
            from: oItem.getTitle(),
            contextPath: oItem.getBindingContext().sPath.substr(1)
        },!jQuery.device.is.phone);
        
        }
        else{
        	this.oRouter.navTo("detail_p", {   
                from: oItem.getTitle(),
                contextPath: oItem.getBindingContext().sPath.substr(1)
            },!jQuery.device.is.phone);
        }

        // tell detail to update
//        sap.ui.getCore().getEventBus().publish("app", "RefreshDetail", {
//            context:  oItem.getBindingContext()
//        });
    },
    
    //Number Formatter for amount
    numberFormat: function(number){
    	try {
			if (!isNaN(parseFloat(number)) && isFinite(number)) {
				var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
				return numberFormatter.format(number);
			}
		} catch (e) {
			jQuery.sap.log.warning(number+" couldn't be formatted to Number","numberFormat in S2 Controller","Payslip");
		}
		return number;
    }
});