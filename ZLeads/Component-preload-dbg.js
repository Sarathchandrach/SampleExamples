jQuery.sap.registerPreloadedModules({
"name":"cus/crm/lead/Component-preload",
"version":"2.0",
"modules":{
	"cus/crm/lead/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("cus.crm.lead.Component");
//jQuery.sap.require("sap.ui.core.UIComponent");
//jQuery.sap.require("sap.ushell.services.sap.ca.navigation.AppNavigator");
//jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
//jQuery.sap.require("cus.crm.lead.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("cus.crm.lead.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD",{
		"name": "Master Detail Sample",
		"version" : "1.5.4",
		"library" : "cus.crm.lead",
		"includes" : [ 
		],  
		"dependencies" : { 
			"libs" : [ 
				"sap.m",
				"sap.me"
			],  
			"components" : [ 
			], 
			
		},
		"config" : {
			
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" :   "SHELL_TITLE",
			 "icon":"sap-icon://Fiori2/F0014",
			 "favIcon":"./resources/sap/ca/ui/themes/base/img/favicon/F0014_My_Leads.ico",
			 "homeScreenIconPhone":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/57_iPhone_Desktop_Launch.png",
			 "homeScreenIconPhone@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/114_iPhone-Retina_Web_Clip.png",
			 "homeScreenIconTablet":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/72_iPad_Desktop_Launch.png",
			 "homeScreenIconTablet@2":"./resources/sap/ca/ui/themes/base/img/launchicon/F0014_My_Leads/144_iPad_Retina_Web_Clip.png",
			 "startupImage320x460":"./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
			 "startupImage640x920":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
			 "startupImage640x1096":"./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
			 "startupImage768x1004":"./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
			 "startupImage748x1024":"./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
			 "startupImage1536x2008":"./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
			 "startupImage1496x2048":"./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
			
			
			
			
		},
		
		"viewPath" : "cus.crm.lead.view",
		"detailPageRoutes" :{  
            "detail" : {
            			"pattern" : "detail/{contextPath}",
            			"view" : "S3"
            },
		    "edit"  :  {
		    	         "pattern" : "edit/{contextPath}",
		    	         "view"  : "S4"
		    	 
		    },
            "noData" : {
            	         "pattern"  : "noData",
            	         "viewPath" : "sap.ca.scfld.md.view",
            	         "view"    :  "empty"
             }    
       
          },
          
          "fullScreenPageRoutes" : {  
	        	"fullScreen"  : {
	        		"view":"MainSplitContainer",
					"viewPath":"sap.ca.scfld.md.view",
					"targetControl":"fioriContent",
					"targetAggregation":"pages",
					"pattern":"_neverusethispattern_",              
	         	},
				
				"display": {
					pattern : "display/{contextPath}",
					view : "S3",
				},
				"editFullScreen" : {
					pattern : "editFullScreen/{contextPath}",
					view : "S4",
					
				}
	         	
	        }
        
    }),
   
	/**
	 * Initialize the application 
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
	  var oViewData = {component: this};

    var oMainView = sap.ui.view({
      viewName : "cus.crm.lead.Main",
      type : sap.ui.core.mvc.ViewType.XML,
      viewData : oViewData
    });
    
    oMainView.setModel(new sap.ui.model.json.JSONModel({
    	s2Controller : null,
    	s3Controller : null,
    	s4Controller : null
    }),"controllers");
    return oMainView;
	}
  
});
},
	"cus/crm/lead/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.declare("cus.crm.lead.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("cus.crm.lead.Configuration", {

    oServiceParams: {
        serviceList: [
            {
                name: "CRM_LEAD",
                masterCollection: "Leads",
                serviceUrl:URI("/sap/opu/odata/sap/CRM_LEAD/").directory(),
                isDefault: true,
                countSupported : true,
                mockedDataSource: "/cus.crm.lead/model/metadata.xml"
            }
            
        ]
    },
    
   
    getServiceParams: function () {
      return this.oServiceParams;
  },

  /**
   * @inherit
   */
  getServiceList: function () {
      return this.oServiceParams.serviceList;
  },
  
  getMasterKeyAttributes : function() {
      return ["Id"];
  },
});

},
	"cus/crm/lead/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("cus.crm.lead.Main", {

	onInit : function() {
    jQuery.sap.require("sap.ca.scfld.md.Startup");        
    sap.ca.scfld.md.Startup.init('cus.crm.lead', this);
  },
  
  /**
   * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
   * 
   * @memberOf MainXML
   */
  onExit : function() {
    //exit cleanup code here
  } 

	
});
},
	"cus/crm/lead/Main.view.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m" controllerName="cus.crm.lead.Main" displayBlock="true" height="100%">\r\n\t<App id="fioriContent" showHeader="false">                                                             \r\n\t</App>  \r\n</core:View>',
	"cus/crm/lead/fragment/AddProducts.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog title="{i18n>PRODUCT_CATALOG}" xmlns="sap.m"  contentHeight="640px">\n     <subHeader>\n\t\t\t<Bar>\n\t\t\t\t<contentLeft>\n\t\t\t\t\t<SearchField  search="filterProducts"\n\t\t\t\t\t\tplaceholder="{i18n>SEARCH}"></SearchField>\n\t\t\t\t</contentLeft>\n\t\t\t</Bar>\n\n\t\t</subHeader>\n            <content>\n               \n                 <List id="productList" noDataText="{i18n>NO_PRODUCTS}" items="{json>/Products}" mode="MultiSelect" growing="true" selectionChange="enableProductsAddButton">\n                    <ObjectListItem id="productListItem" title="{json>ProductDescription}">\n                       <attributes>\n                           <ObjectAttribute text="{json>CategoryDescription}">\n                           </ObjectAttribute>\n                        </attributes>\n                    </ObjectListItem>\n                  \n                 </List>\n            </content>\n           <beginButton>\n              <Button text="{i18n>ADD}" press="addProductsToBasket">\n              </Button>\n           </beginButton>\n            <endButton>\n             <Button text="{i18n>CANCEL}" press="closeProductDialog">\n             </Button>\n           </endButton> \n        </Dialog>\n',
	"cus/crm/lead/fragment/ChangeLog.fragment.xml":'<!--\r\n\r\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\r\n\r\n-->\r\n<Dialog xmlns:ca="sap.ca.ui" xmlns="sap.m" title="{i18n>CHANGE_LOGS}" id="logchange" placement="Top" contentWidth="30em" contentHeight="640px">\r\n\r\n\t\t<content>\r\n\t\t\t<List id="ChangeLog" noDataText="{i18n>NO_LOG}" items="{/LeadChangeDocs}">\r\n\r\n\t\t\t\t<items>\r\n\t\t\t\t\t<ca:ExpansibleFeedListItem id="dproduct1" showIcon="false" sender="{PartnerName}" \r\n\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'OldValue\'}, {path:\'NewValue\'},\r\n\t\t\t\t\t\t\t\t\t {path:\'UpdateFieldText\'}], formatter:\'cus.crm.lead.util.formatter.formatChangeLog\'}"\r\n\t\t\t\t\t\t\t\t\t   \r\n\t\t\t\t\t\t\t\t\t timestamp="{path: \'UpdateDate\', formatter:\'cus.crm.lead.util.formatter.formatDate\'}">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t</ca:ExpansibleFeedListItem>\r\n\t\t\t\t</items>\r\n\t\t\t</List>\r\n\t\t</content>\r\n\r\n\t\t<beginButton>\r\n\t\t\t<Button text="{i18n>OK}" press="onCancelLogChange"></Button>\r\n\t\t</beginButton>\r\n\r\n\t</Dialog>',
	"cus/crm/lead/fragment/ContactF4.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog id="dialogContactF4"  xmlns="sap.m"  title="{i18n>SELECT_CONTACT}" contentWidth="480px" contentHeight="720px">\n          <subHeader>\n            <Bar>\n               <contentLeft>\n           <SearchField placeholder="{i18n>SEARCH_CONTACTS}" search="searchContact" liveChange="searchContact"></SearchField>\n              </contentLeft>\n           </Bar>\n           </subHeader>\n           <content>\n              <List id="contactList" noDataText="{i18n>NO_CONTACTS}" mode="SingleSelectMaster"  items="{json>/ContactCollection}"  selectionChange="setContact" growing="true" >\n                  <items>\n                     <ObjectListItem \n\t\t\ttitle="{parts : [\'json>fullName\',\'json>contactID\'],formatter : \'cus.crm.lead.util.formatter.formatDescription\'}" >\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute text="{json>company}">\n\t\t\t\t</ObjectAttribute>\n\t\t\t\t<ObjectAttribute text="{json>function}">\n\t\t\t\t</ObjectAttribute>\n\t\t\t</attributes>\n\t\t</ObjectListItem>\n                  </items>\n                    <infoToolbar>\n                    <Toolbar id="contactF4Toolbar" active="false">\n          <content>\n                   <Label id="filterByLabel"  text=""></Label>\n                   <ToolbarSpacer ></ToolbarSpacer>\n                   <Button id="XButton" type="Transparent"  icon="sap-icon://sys-cancel-2" press="closeToolbar"></Button>\n              \n          </content>\n        </Toolbar>\n                  </infoToolbar>  \n              </List>\n          </content>\n          <beginButton>\n              <Button text="{i18n>CANCEL}" press="closeContactF4" >\n              </Button>\n           </beginButton>\n        </Dialog>\n',
	"cus/crm/lead/fragment/EmployeeF4.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog id="dialogEmployeeF4"  xmlns="sap.m"  title="{i18n>SELECT_EMPLOYEE}" contentWidth="480px" contentHeight="720px">\n          <subHeader>\n            <Bar>\n               <contentLeft>\n           <SearchField placeholder="{i18n>SEARCH_EMPLOYEE}" search="searchEmployee" liveChange="searchEmployee"></SearchField>\n              </contentLeft>\n           </Bar>\n           </subHeader>\n           <content>\n              <List id="employeeList" noDataText="{i18n>NO_EMPLOYEE}" mode="SingleSelectMaster"  items="{json>/EmployeeCollection}"  selectionChange="setEmployee" growing="true" >\n                  <items>\n                    <ObjectListItem\n\t\t\t\t\ttitle="{path:\'json>fullName\'}">\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute text="{json>employeeID}">\n\t\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t</attributes>\n\t\t\t\t</ObjectListItem>          \n\t\t          </items>\n                    <infoToolbar>\n                    <Toolbar id="employeeF4Toolbar" active="false">\n          <content>\n                   <Label id="filterByLabel"  text=""></Label>\n                   <ToolbarSpacer ></ToolbarSpacer>\n                   <Button id="XButton" type="Transparent"  icon="sap-icon://sys-cancel-2" press="closeEmpToolbar"></Button>\n              \n          </content>\n        </Toolbar>\n                  </infoToolbar>  \n              </List>\n          </content>\n          <beginButton>\n              <Button text="{i18n>CANCEL}" press="closeEmployeeF4" >\n              </Button>\n           </beginButton>\n        </Dialog>\n',
	"cus/crm/lead/fragment/ParticipantsF4.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog id="dialogParticipantsF4" xmlns="sap.m" xmlns:core="sap.ui.core"\n\ttitle="{i18n>ADD_PARTICIPANTS}" contentWidth="480px" contentHeight="720px">\n\t<Select id="selectParticipants" items="{json>/PartnerFunctions}" autoAdjustWidth="false" width=\'100%\' >\n\t\t<items>\n\t\t\t\t<core:Item text="{json>PartnerFunctionName}" key="{json>PartnerFunctionCategory}"> </core:Item >\n\t\t</items>\n\t</Select>\n\t<SearchField \n\t\tsearch="searchParticipants" liveChange="searchEmployee"></SearchField>\n\t<content>\n\t\t<List id="participantsList"  mode="MultiSelect"\n\t\t selectionChange="checkMinMaxRules"\n\t\t\tgrowing="true">\n\t   </List>\n\t</content>\n\t<beginButton>\n\t\t<Button text="{i18n>ADD}" press="addParticipants">\n\t\t</Button>\n\t</beginButton>\n\t<endButton>\n\t\t<Button text="{i18n>CANCEL}" press="closeParticipantsF4">\n\t\t</Button>\n\t</endButton>\n</Dialog>\n',
	"cus/crm/lead/fragment/ProdBasket.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n\t<Table xmlns="sap.m" xmlns:ui="sap.ui.layout" xmlns:core="sap.ui.core"  id="productBasketEdit" headerDesign="Standard"   items="{/Products}"  noDataText="{i18n>EMPTY_BASKET}"> \n\t\t\t\t <headerToolbar>\n\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t<Label text="{i18n>PRODUCT_BASKET}">\n\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t<ToolbarSpacer>\n\t\t\t\t\t\t</ToolbarSpacer>\n\t\t\t\t\t\t<Button icon="sap-icon://add" text="{i18n>ADD_MORE_PRODUCTS}" press="showProductDialog">\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</headerToolbar>\n\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t<Column vAlign="Middle" width="50%">\n\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>PRODUCT_OR_CATEGORY}" design="Bold"></Label>\n\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t<Column vAlign="Middle" width="30%" design="Bold">\n\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t<Label text="{i18n>QUANTITY}" design="Bold"></Label>\n\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<Column vAlign="Middle"  width="20%">\n\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t<Label></Label>\n\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<items >\n\t\t\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t<ui:VerticalLayout hAlign="Left">\n\t\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t\t<Label design="Bold" text="{path : \'ProductGuid\', formatter : \'util.formatter.formatProductName\'}"  ></Label>\n\t\t\t\t\t\t\t\t\t\t<Label text="{path: \'ProductGuid\',formatter : \'util.formatter.formatProdClassification\'}" ></Label>\n\t\t\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t\t\t</ui:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t<ui:HorizontalLayout width="70%">\n\t\t\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t\t<Input   width="50%"  value="{Quantity}"  editable="{path : \'ProductGuid\', formatter : \'util.formatter.formatQuantityField\'}" liveChange="quantityChanged" ></Input>\n\t\t\t\t\t\t\t\t\t\t<Text text="{Unit}" class="UnitPadding" ></Text>\n\t\t\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t\t\t\t</ui:HorizontalLayout >\n\t\t\t\t\t\t\t\t\t\t<ui:VerticalLayout hAlign="Right"\t>\n\t\t\t\t\t\t\t\t\t\t<Button  icon="sap-icon://sys-cancel-2" type="Transparent" press="deleteProduct" visible="{path : \'ProductGuid\',formatter : \'util.formatter.formatDeleteButton\'}"></Button>\n\t\t\t\t\t\t\t\t\t   </ui:VerticalLayout>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t\n\t\t\t\t\t\t</Table>',
	"cus/crm/lead/fragment/ProdBasketMobile.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n <Table  xmlns="sap.m" xmlns:ui="sap.ui.layout" noDataText="{i18n>EMPTY_BASKET}" items="{/Products}" headerText="{i18n>PRODUCT_BASKET}" id="productBasketEdit" >\n            <columns>\n               <Column vAlignn="Middle">\n               \n                  <header> \n                           <Label text="{i18n>PRODUCT_OR_CATEGORY}"></Label>\n                  </header>\n               </Column>\n                <Column hAlign="Right">\n               \n                  <header> \n                           <Label text="{i18n>QUANTITY}"></Label>\n                  </header>\n               </Column>\n               </columns>\n                 <items>\n                 <ColumnListItem>\n                   <cells>\n                       <ui:VerticalLayout hAlign="Left">\n\t\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t\t<Label deign="Bold" text="{ProductName}"  ></Label>\n\t\t\t\t\t\t\t\t\t\t<Label text="{path: \'ProductGuid\',formatter : \'util.formatter.formatProdClassification\'}" ></Label>\n\t\t\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t\t\t</ui:VerticalLayout>\n                        <ui:VerticalLayout>\n                         <ui:content>\n                             <ui:HorizontalLayout width="70%">\n\t\t\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t\t<Input  width="50%"  value="{Quantity}"  editable="{path : \'ProductGuid\', formatter : \'util.formatter.formatQuantityField\'}" ></Input>\n\t\t\t\t\t\t\t\t\t\t<Text  text="{Unit}"  ></Text>\n\t\t\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t\t\t\t</ui:HorizontalLayout>\n\t\t\t\t\t\t\t<Button type="Transparent" icon="sap-icon://delete" press="deleteProduct" visible="{path : \'ProductGuid\', formatter: \'util.formatter.formatDeleteButton\'}"></Button>\t\t\t\n                         </ui:content>\n                        </ui:VerticalLayout>                        \n                   </cells> \n                   </ColumnListItem>\n                 </items>\n         </Table>',
	"cus/crm/lead/i18n/i18n.properties":'# Leads (View, Edit): Receive leads and follow-up with potential customers\n# __ldi.translation.uuid=b75598f0-1628-11e3-8ffd-0800200c9a66\n# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\n\n# Note: This file was created according to the conventions that can be found at \n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\n\n#XTIT: this is the title for the master section\nMASTER_TITLE=Leads ({0})\n\n#XTIT: shell title\nSHELL_TITLE=Leads \n\n#XTIT: this is the title for the detail section\nDETAIL_TITLE=Lead\n\n#XTIT: this is the title for the detail section\nLEAD_ID=Lead ID\n\n#XTIT: this is the title for the detail section\nLEAD_TYPE=Type\n\n#XTIT: title for Employee buissness card\nEMPLOYEE=Employee\n\n#XFLD: start date text\nSTART_DATE=Start Date\n\n#XFLD: closing date text\nEND_DATE=End Date\n\n#XFLD: origin dropdown text\nORIGIN=Origin\n\n#XFLD: priority dropdown text\nPRIORITY=Priority\n\n#XFLD: qualification dropdown text\nQUALIFICATION=Qualification\n\n#XFLD: status dropdown text\nSTATUS=Status\n\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\nPRODUCT=Product\n\n#XFLD: quantity in product basket\nQUANTITY=Quantity\n\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\nINFO=Info\n\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\nNOTES=Notes\n\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\nATTACHMENT=Attachment\n\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\nTEAM=Parties Involved\n\n#XTOL: product basket is empty\nEMPTY_BASKET=Product basket empty\n\n#XBUT: edit button text\nEDIT=Edit\n\n#XBUT : show result\nSHOW_SETTING = List Settings\n\n#XBUT : list setting button text\nLIST_SETTING = Settings\n\n#XTXT : Show instructions\nSHOW_INST = Maximum number of Leads to be displayed:\n\n#XTXT : Show notes\nSHOW_INS_NOTES = *Please note that if there are a large number of Leads, the performance of the application will be affected.\n\n\n#XBUT: ADD Contact button text\nADDCONTACT=Add Contact\n\n#XBUT: OK button text\nOK= OK\n\n#YMSG, 30:  no salesteam\nNOPARTIES=No parties involved are currently available\n\n#XTIT: this is the title for the SalesTeam Tab\nSALES_TEAM=Participants\n\n#XTIT: this is the title for the SalesTeam Tab\nPARTICIPANTS=Participants ({0})\n\n#XFLD: campaign label\nCAMPAIGN=Campaign\n\n#XFLD: name of account/prospect\nNAME=Name\n\n#XFLD: Customer label  \nCUSTOMER=Customer\n\n#XFLD: main contact label\nMAIN_CONTACT=Main Contact\n\n#XFLD: Employee Responsible label\nEMPLOYEE_RESPONSIBLE= Employee Responsible\n\n#XTIT: product basket title\nPRODUCT_BASKET=Product Basket\n\n#XFLD: column in product basket\nPRODUCT_OR_CATEGORY=Product/Category\n\n#XFLD: Unit column in product basket\nUNIT=Unit\n\n#XFLD: View in info for Log of changes\nVIEW=View\n\n#XFLD: partner functon in sales team\nPARTNERFUNCTION=Partner Function\n\n#XBUT: add more products button of the product basket\nADD_MORE_PRODUCTS=Add More Products\n\n#XBUT: save button in edit page \nSAVE=Save\n\n#XBUT: cancel button in dialog,edit\nCANCEL=Cancel\n\n#XACT: search placeholder\nSEARCH=Search\n\n#XTIT: title for product dialog\nPRODUCT_CATALOG=Product Catalog\n\n#XBUT: Add in dialogs\nADD=Add\n\n#XFLD: Account Label in edit page\nACCOUNT=Account\n\n#XTIT: add account text\nADD_ACCOUNT:Add Account\n\n#XACT: search accounts place holder\nSEARCH_ACCOUNTS:Search accounts\n\n#YMSG: date invalid message\nINVALID_DATE:End date must not be earlier than start date\n\n#YMSG: lead saved\nLEAD_SAVED=Lead saved\n\n#YMSG: note saved\nNOTES_ADDED = Note saved\n\n#YMSG: lead could not be saved\nSAVE_FAILED=Could not save the lead\n\n#YMSG: No Lead Found\nNO_LEAD_ERROR=No leads are currently available\n\n#YMSG: error\nERROR=Error\n\n#XTIT: contact title for contact F4\nCONTACT=Contact\n\n#XACT: search contacts place holder\nSEARCH_CONTACTS=Search contacts\n\n#XACT: search participants place holder\nSEARCH_PARTICIPANTS=Search for participants\n\n#XACT: search employees place holder\nSEARCH_EMPLOYEE=Search Employees\n\n#XTOL: filtered by text in contact F4\nFILTER=Filtered by \n\n#XFLD: Field "From" on View tab\nFROM=From\n\n#XFLD: Field "To" on View tab\nTO=To\n\n#XFLD: Field "Changed" on View tab\nCHANGED=Changed\n\n#XBUT\nS3_EDIT=Edit\n\n#XBUT\nS3_NEGATIVE=Reject\n\n#XBUT\nS3_POSITIVE=Accept\n\n#XTIT: Product Category\nCATEGORY=Product Category\n\n#XTIT: Filter by in leads list\nFILTER_BY=Filtered By\n\n#XLST: "All" filter by option in leads list footer\nALL=All\n\n#XLST: "New" filter by option in leads list footer\nNEW=New\n\n#XTIT: "Sort by" title for sorting in leads list footer\nSORT_BY=Sort By\n\n#XTIT: Log of changes\nCHANGE_LOGS=Log of changes\n\n#XTOL: No products found\nNO_PRODUCTS=No products are currently available\n\n#XTOL: No notes found\nNO_NOTES=No notes are currently available\n\n#XFLD,20: Loading text when loading/searching list\nLOADING_TEXT=Loading...\n\n#XTOL: No contacts found\nNO_CONTACTS=No contacts are currently available\n\n#XTOL: No employees found\nNO_EMPLOYEE=No employees are currently available\n\n#XTOL: No log of changes found found\nNO_LOG=No changes are currently available\n\n#XTOL: No participants found\nNO_PARTICIPANTS1=No participants are currently available\n\n#XACT: Maximum of 40 characters\nMAX_CHARS=Add description (a maximum of 40 characters)\n\n#YMSG: contact not assigned to this account\nNOT_IN_MAIN_CONTACT =You can only view business cards of contacts that has been assigned to this account\n\n#YMSG: not a contact or account\nNOT_CONTACT_OR_ACCOUNT =You can only view business cards of accounts or contacts\n\n#YMSG: account is null\nACCOUNT_IS_NULL =To view a business card, there must be details available for the specified account\n\n#YMSG: some info missing\nINFO_MISSING =To view a business card, all required details must be available for the specified account\n\n#XFLD, 30: Field in sorter\nAccountAscending=Account (Ascending)\n\n#XFLD, 30:  Field in sorter\nAccountDescending=Account (Descending)\n\n#XFLD, 30:  Field in sorter\nStatusAscending=Status (Ascending)\n\n#XFLD, 30:  Field in sorter\nStatusDescending=Status (Descending)\n\n#XFLD, 30:  Field in sorter\nClosingDateAscending=End Date (Ascending)\n\n#XFLD, 30:  Field in sorter\nClosingDateDescending=End Date (Descending)\n\n#XFLD, 30:  Field in filter\nOPEN=Open\n\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\nVALUE_TURNED_ON=Changed: {0} from Off to On\n\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\nVALUE_TURNED_OFF=Changed: {0} from On to Off\n\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\nVALUE_CHANGED_FROM_NULL=Changed: {0} from No Value to {1}\n\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\nVALUE_CHANGED_FROM=Changed: {0} from {1} to {2}\n\n#YMSG: junk value entered for dates\nJUNK_DATE=Enter valid values for dates\n\n#YMSG: you must enter end date\nEND_DATE_MANDATORY=You must enter an end date\n\n#YMSG: note added sucessfully\nNOTE_ADDED=Note added \n\n#YMSG: note create failed\nCREATE_NOTE_FAILED=Could not create note\n\n#YMSG: no details for account to view business card\nNO_ACCOUNT_DETAILS=To view a business card, there must be details available for the specified account\n\n#YMSG: no required account details to view business card\nNO_REQUIRED_ACCOUNT_DETAILS=To view a business card, all required details must be available for the specified account\n\n#YMSG: business card only for main contact\nBCARD_ONLY_FOR_MAIN_CONTACT=You can only view business cards of accounts that have been specified as main contacts\n\n#YMSG: business card only for account or contacts\nBCARD_ONLY_FOR_CONTACTS=You can only view business cards of accounts or contacts\n\n#XFLD: Only your tasks are displayed \nLIST_FILTERED_BY_MYITEMS=You are responsible for ({0}) out of ({1}) leads. Only your leads are displayed\n\n#XACT: Loading\nLOADING=Loading...\n\n#YMSG: Lead saved with error\nPARTIAL_SAVE=Lead saved with errors\n\n#YMSG: confirmation question for lead accept\nCONFIRM_LEAD_ACCEPT=Do you want to accept the lead "{0}"?\n\n#YMSG: confirmation question for lead reject\nCONFIRM_LEAD_REJECT=Do you want to reject the lead "{0}"?\n\n#YMSG: Do you want to confirm your action\nCONFIRMATION_MESSAGE=Choose the relevant pushbutton to confirm your decision.\n\n#XTIT: select contact\nSELECT_CONTACT=Select Contact\n\n#XTIT: select participant\nADD_PARTICIPANTS=Add Participants\n\n#XTIT: select contact\nSELECT_EMPLOYEE=Select Employee\n\n#YMSG: contact not assigned to this account\nACCOUNT_IS_NULL_S3=You can only view business cards of contacts that have been assigned to this account\n\n#XTIT: Warning title for data loss pop-up\nWARNING=Warning\n\n#YMSG: data loss message\nDATA_LOSS=Any unsaved changes will be lost.Are you sure you want to continue?\n\n#XBUT: continue button\nCONTINUE=Continue\n\n#YMSG: no participants\nNO_PARTICIPANTS=No participants found\n\n#YMSG: enter further participants\nTOO_FEW_PARTICIPANTS=You must select a minimum of {0} participants for this participant type\n\n#YMSG: too many participants\nTOO_MANY_PARTICIPANTS=You can only select a maximum of {0} participants for this participant type\n\n#YMSG: enter further participants\nMUST_HAVE_PARTICIPANTS=You must have a minimum of {0} participants for this participant type\n\n#YMSG: enter further participants\nMUST_HAVE_PARTICIPANTS_1=You must have a minimum of {0} participant for this participant type\n\n#YMSG: enter further participants\nTOO_FEW_PARTICIPANTS_1=You must select a minimum of {0} participant for this participant type\n\n#YMSG: too many participants\nTOO_MANY_PARTICIPANTS_1=You can only select a maximum of {0} participant for this participant type\n\n#YMSG:participant already exists\nPARTICIPANT_EXISTS={0} has already been added as a participant with the participant type {1}\n\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\nMSG_CONFLICTING_DATA=Data has been changed by another user. Click OK to fetch the latest.',
	"cus/crm/lead/i18n/i18n_ar.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u0641\\u0631\\u0635 \\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u0641\\u0631\\u0635\\u0629 \\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u0645\\u0639\\u0631\\u0641 \\u0641\\u0631\\u0635\\u0629 \\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=\\u0627\\u0644\\u0646\\u0648\\u0639\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u0623\\u0635\\u0644\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u0627\\u0644\\u0623\\u0641\\u0636\\u0644\\u064A\\u0629\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u0627\\u0644\\u0645\\u0624\\u0647\\u0644\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u0627\\u0644\\u0643\\u0645\\u064A\\u0629\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0648\\u0646\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0645\\u0646\\u062A\\u062C\\u0627\\u062A \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u062A\\u062D\\u0631\\u064A\\u0631\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=\\u0639\\u0631\\u0636 \\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=\\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=\\u0627\\u0644\\u062D\\u062F \\u0627\\u0644\\u0623\\u0642\\u0635\\u0649 \\u0644\\u0639\\u062F\\u062F \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 \\u0627\\u0644\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0639\\u0631\\u0636\\u0647\\u0627\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u0627\\u0644\\u0631\\u062C\\u0627\\u0621 \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629 \\u0623\\u0646\\u0647 \\u0641\\u064A \\u062D\\u0627\\u0644\\u0629 \\u0648\\u062C\\u0648\\u062F \\u0639\\u062F\\u062F \\u0643\\u0628\\u064A\\u0631 \\u0645\\u0646 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\\u060C \\u0633\\u064A\\u062A\\u0623\\u062B\\u0631 \\u0623\\u062F\\u0627\\u0621 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XBUT: OK button text\r\nOK=\\u0645\\u0648\\u0627\\u0641\\u0642\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u0644\\u0627 \\u064A\\u062A\\u0648\\u0641\\u0631 \\u0645\\u0634\\u0627\\u0631\\u0643\\u0648\\u0646 (\\u0623\\u0637\\u0631\\u0627\\u0641 \\u0645\\u0639\\u0646\\u064A\\u0629) \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0648\\u0646\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0648\\u0646 ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u0627\\u0644\\u062D\\u0645\\u0644\\u0629 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u0627\\u0644\\u0627\\u0633\\u0645\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0631\\u0626\\u064A\\u0633\\u064A\\u0629\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u0627\\u0644\\u0645\\u0648\\u0638\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0624\\u0648\\u0644\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u0633\\u0644\\u0629 \\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\\u0627\\u062A\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u0627\\u0644\\u0645\\u0646\\u062A\\u062C/\\u0627\\u0644\\u0641\\u0626\\u0629\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u0627\\u0644\\u0648\\u062D\\u062F\\u0629\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u0639\\u0631\\u0636\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u0648\\u0638\\u064A\\u0641\\u0629 \\u0627\\u0644\\u0634\\u0631\\u064A\\u0643\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0632\\u064A\\u062F \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\\u0627\\u062A\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u062D\\u0641\\u0638\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u0628\\u062D\\u062B\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u062F\\u0644\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\\u0627\\u062A\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u0625\\u0636\\u0627\\u0641\\u0629\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0639\\u0645\\u064A\\u0644\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u0628\\u062D\\u062B\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u064A\\u062C\\u0628 \\u0623\\u0644 \\u064A\\u0643\\u0648\\u0646 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 \\u0642\\u0628\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0628\\u062F\\u0627\\u064A\\u0629\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u062A\\u0639\\u0630\\u0631 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0641\\u0631\\u0635 \\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#YMSG: error\r\nERROR=\\u062E\\u0637\\u0623\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u062C\\u0647\\u0629 \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u0628\\u062D\\u062B\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0645\\u0648\\u0638\\u0641\\u064A\\u0646\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u0645\\u0646\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u0625\\u0644\\u0649\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0647\r\n\r\n#XBUT\r\nS3_EDIT=\\u062A\\u062D\\u0631\\u064A\\u0631\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u0631\\u0641\\u0636\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u0642\\u0628\\u0648\\u0644\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u0641\\u0626\\u0629 \\u0627\\u0644\\u0645\\u0646\\u062A\\u062C\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u062A\\u0635\\u0641\\u064A\\u0629 \\u062D\\u0633\\u0628\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u0627\\u0644\\u0643\\u0644\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u062C\\u062F\\u064A\\u062F\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u062A\\u0631\\u062A\\u064A\\u0628 \\u062D\\u0633\\u0628\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u0633\\u062C\\u0644 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0645\\u0646\\u062A\\u062C\\u0627\\u062A \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u0645\\u0644\\u0627\\u062D\\u0638\\u0627\\u062A \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u062C\\u0647\\u0627\\u062A \\u0627\\u062A\\u0635\\u0627\\u0644 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u0644\\u0627 \\u064A\\u062A\\u0648\\u0641\\u0631 \\u0645\\u0648\\u0638\\u0641\\u0648\\u0646 \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u0644\\u0627 \\u064A\\u062A\\u0648\\u0641\\u0631 \\u0645\\u0634\\u0627\\u0631\\u0643\\u0648\\u0646 (\\u0623\\u0637\\u0631\\u0627\\u0641 \\u0645\\u0639\\u0646\\u064A\\u0629) \\u062D\\u0627\\u0644\\u064A\\u064B\\u0627\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u0623\\u0636\\u0641 \\u0648\\u0635\\u0641\\u064B\\u0627 (\\u0628\\u062D\\u062F \\u0623\\u0642\\u0635\\u0649 40 \\u062D\\u0631\\u0641\\u064B\\u0627)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0639\\u0645\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0639\\u064A\\u0646\\u0629 \\u0625\\u0644\\u0649 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0627\\u0644\\u0639\\u0645\\u0644 \\u0641\\u0642\\u0637 \\u0644\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621 \\u0623\\u0648 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u0644\\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0629 \\u0639\\u0645\\u0644\\u060C \\u064A\\u062C\\u0628 \\u062A\\u0648\\u0641\\u0651\\u064F\\u0631 \\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u0644\\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0629 \\u0639\\u0645\\u0644\\u060C \\u064A\\u062C\\u0628 \\u062A\\u0648\\u0641\\u0651\\u064F\\u0631 \\u0643\\u0644 \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0637\\u0644\\u0648\\u0628\\u0629 \\u0644\\u0644\\u0639\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644 (\\u062A\\u0635\\u0627\\u0639\\u062F\\u064A)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u0627\\u0644\\u0639\\u0645\\u064A\\u0644 (\\u062A\\u0646\\u0627\\u0632\\u0644\\u064A)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629 (\\u062A\\u0635\\u0627\\u0639\\u062F\\u064A)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u0627\\u0644\\u062D\\u0627\\u0644\\u0629 (\\u062A\\u0646\\u0627\\u0632\\u0644\\u064A)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 (\\u062A\\u0635\\u0627\\u0639\\u062F\\u064A)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621 (\\u062A\\u0646\\u0627\\u0632\\u0644\\u064A)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u0641\\u062A\\u062D\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\: {0} \\u0645\\u0646 "\\u0625\\u064A\\u0642\\u0627\\u0641 \\u0627\\u0644\\u062A\\u0634\\u063A\\u064A\\u0644" \\u0625\\u0644\\u0649 "\\u062A\\u0634\\u063A\\u064A\\u0644"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\: {0} \\u0645\\u0646 "\\u062A\\u0634\\u063A\\u064A\\u0644" \\u0625\\u0644\\u0649 "\\u0625\\u064A\\u0642\\u0627\\u0641 \\u0627\\u0644\\u062A\\u0634\\u063A\\u064A\\u0644"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\: {0} \\u0645\\u0646 "\\u0628\\u0644\\u0627 \\u0642\\u064A\\u0645\\u0629" \\u0625\\u0644\\u0649  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\: "{0}" \\u0645\\u0646 "{1}" \\u0625\\u0644\\u0649 "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u0623\\u062F\\u062E\\u0644 \\u0642\\u064A\\u0645\\u064B\\u0627 \\u0635\\u0627\\u0644\\u062D\\u0629 \\u0644\\u0644\\u062A\\u0648\\u0627\\u0631\\u064A\\u062E\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u064A\\u062C\\u0628 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u062A\\u0645\\u062A \\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u062A\\u0639\\u0630\\u0631 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u0644\\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0629 \\u0639\\u0645\\u0644\\u060C \\u064A\\u062C\\u0628 \\u062A\\u0648\\u0641\\u0651\\u064F\\u0631 \\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u0644\\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0629 \\u0639\\u0645\\u0644\\u060C \\u064A\\u062C\\u0628 \\u062A\\u0648\\u0641\\u0651\\u064F\\u0631 \\u0643\\u0644 \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0637\\u0644\\u0648\\u0628\\u0629 \\u0644\\u0644\\u0639\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0627\\u0644\\u0639\\u0645\\u0644 \\u0644\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621 \\u0627\\u0644\\u0630\\u064A\\u0646 \\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062F\\u0647\\u0645 \\u0643\\u062C\\u0647\\u0627\\u062A \\u0627\\u062A\\u0635\\u0627\\u0644 \\u0631\\u0626\\u064A\\u0633\\u064A\\u0629\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0627\\u0644\\u0639\\u0645\\u0644 \\u0641\\u0642\\u0637 \\u0644\\u0644\\u0639\\u0645\\u0644\\u0627\\u0621 \\u0623\\u0648 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u0623\\u0646\\u062A \\u0645\\u0633\\u0624\\u0648\\u0644 \\u0639\\u0646 {0} \\u0645\\u0646 {1} \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629. \\u064A\\u062A\\u0645 \\u0639\\u0631\\u0636 \\u0627\\u0644\\u0641\\u0631\\u0635 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643 \\u0641\\u0642\\u0637.\r\n\r\n#XACT: Loading\r\nLOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 \\u0645\\u0639 \\u0623\\u062E\\u0637\\u0627\\u0621\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u0647\\u0644 \\u062A\\u0631\\u063A\\u0628 \\u0641\\u064A \\u0642\\u0628\\u0648\\u0644 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u0647\\u0644 \\u062A\\u0631\\u063A\\u0628 \\u0641\\u064A \\u0631\\u0641\\u0636 \\u0627\\u0644\\u0641\\u0631\\u0635\\u0629 \\u0627\\u0644\\u062A\\u0633\\u0648\\u064A\\u0642\\u064A\\u0629 "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u0627\\u062E\\u062A\\u0631 \\u0632\\u0631 \\u0627\\u0644\\u0636\\u063A\\u0637 \\u0627\\u0644\\u0645\\u0646\\u0627\\u0633\\u0628 \\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u0642\\u0631\\u0627\\u0631\\u0643.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u062A\\u062D\\u062F\\u064A\\u062F \\u062C\\u0647\\u0629 \\u0627\\u062A\\u0635\\u0627\\u0644\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0645\\u0648\\u0638\\u0641\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u0639\\u0631\\u0636 \\u0628\\u0637\\u0627\\u0642\\u0627\\u062A \\u0639\\u0645\\u0644 \\u062C\\u0647\\u0627\\u062A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0645\\u0639\\u064A\\u0646\\u0629 \\u0625\\u0644\\u0649 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u062A\\u062D\\u0630\\u064A\\u0631\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u0633\\u064A\\u062A\\u0645 \\u0641\\u0642\\u062F \\u0623\\u064A \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u063A\\u064A\\u0631 \\u0645\\u062D\\u0641\\u0648\\u0638\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\\u061F\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u064A\\u062C\\u0628 \\u062A\\u062D\\u062F\\u064A\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646 \\u0628\\u062D\\u062F \\u0623\\u062F\\u0646\\u0649 \\u0644\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0647\\u0630\\u0627\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u062A\\u062D\\u062F\\u064A\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646 \\u0628\\u062D\\u062F \\u0623\\u0642\\u0635\\u0649 \\u0644\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0647\\u0630\\u0627\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=\\u064A\\u0644\\u0632\\u0645 \\u0648\\u062C\\u0648\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0642\\u0644 \\u0644\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0647\\u0630\\u0627\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=\\u064A\\u0644\\u0632\\u0645 \\u0648\\u062C\\u0648\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0642\\u0644 \\u0644\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0647\\u0630\\u0627\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u064A\\u062C\\u0628 \\u062A\\u062D\\u062F\\u064A\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646 \\u0628\\u062D\\u062F \\u0623\\u062F\\u0646\\u0649 \\u0644\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0647\\u0630\\u0627\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u064A\\u0645\\u0643\\u0646\\u0643 \\u0641\\u0642\\u0637 \\u062A\\u062D\\u062F\\u064A\\u062F {0} \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u064A\\u0646 \\u0628\\u062D\\u062F \\u0623\\u0642\\u0635\\u0649 \\u0644\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0647\\u0630\\u0627\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u062A\\u0645\\u062A \\u0625\\u0636\\u0627\\u0641\\u062A\\u0647 \\u0628\\u0627\\u0644\\u0641\\u0639\\u0644 \\u0643\\u0645\\u0634\\u0627\\u0631\\u0643 \\u0628\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643 {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0627\\u0644\\u0628\\u064A\\u0627\\u0646\\u0627\\u062A \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631. \\u0627\\u062E\\u062A\\u0631 \'\\u0645\\u0648\\u0627\\u0641\\u0642\' \\u0644\\u0627\\u0633\\u062A\\u0631\\u062C\\u0627\\u0639 \\u0622\\u062E\\u0631 \\u0628\\u064A\\u0627\\u0646\\u0627\\u062A.\r\n',
	"cus/crm/lead/i18n/i18n_bg.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u0418\\u0414 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=\\u0412\\u0438\\u0434\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u0421\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u041D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u041F\\u0440\\u043E\\u0438\\u0437\\u0445\\u043E\\u0434\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u041A\\u0432\\u0430\\u043B\\u0438\\u0444\\u0438\\u043A\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u0438\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u0435\\u043D \\u0431\\u0440\\u043E\\u0439 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u041C\\u043E\\u043B\\u044F \\u0438\\u043C\\u0430\\u0439\\u0442\\u0435 \\u043F\\u0440\\u0435\\u0434\\u0432\\u0438\\u0434, \\u0447\\u0435 \\u0433\\u043E\\u043B\\u0435\\u043C\\u0438\\u044F\\u0442 \\u0431\\u0440\\u043E\\u0439 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0449\\u0435 \\u0437\\u0430\\u0441\\u0435\\u0433\\u043D\\u0435 \\u043F\\u0440\\u043E\\u0438\\u0437\\u0432\\u043E\\u0434\\u0438\\u0442\\u0435\\u043B\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 (\\u0443\\u0447\\u0430\\u0441\\u0442\\u0432\\u0430\\u0449\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438)\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u041A\\u0430\\u043C\\u043F\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u0418\\u043C\\u0435\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u0435\\u043D \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u0435\\u043D \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u041A\\u043E\\u0448\\u043D\\u0438\\u0446\\u0430 \\u0441 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u0438\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442/\\u043A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u0415\\u0434\\u0438\\u043D\\u0438\\u0446\\u0430\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u0410\\u0441\\u043F\\u0435\\u043A\\u0442\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u0424\\u0443\\u043D\\u043A\\u0446\\u0438\\u044F \\u043D\\u0430 \\u043F\\u0430\\u0440\\u0442\\u043D\\u044C\\u043E\\u0440\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043E\\u0449\\u0435 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u0438\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u043E\\u0432 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u0442\\u043D\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430\\u0442\\u0430 \\u0434\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0435 \\u043F\\u043E-\\u0440\\u0430\\u043D\\u043E \\u043E\\u0442 \\u043D\\u0430\\u0447\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0430\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\\u0442\\u0430 \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0430\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u041D\\u0435\\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u0437\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#YMSG: error\r\nERROR=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\\u0438\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u041E\\u0442\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u0414\\u043E\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\r\n\r\n#XBUT\r\nS3_EDIT=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0446\\u0438\\u044F\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u041F\\u0440\\u0438\\u0435\\u043C\\u0430\\u043D\\u0435\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u0424\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438 \\u043F\\u043E\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u0412\\u0441\\u0438\\u0447\\u043A\\u0438\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u041D\\u043E\\u0432\\u0438\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043F\\u043E\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u0416\\u0443\\u0440\\u043D\\u0430\\u043B \\u0441 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u0438\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0438\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\\u0438\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u0412 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 (\\u0443\\u0447\\u0430\\u0441\\u0442\\u0432\\u0430\\u0449\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438)\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435 (\\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0443\\u043C 40 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u0430)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438, \\u043A\\u043E\\u0438\\u0442\\u043E \\u0441\\u0430 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438 \\u043A\\u044A\\u043C \\u0442\\u043E\\u0437\\u0438 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u0442\\u043D\\u0438 \\u0438\\u043B\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u0417\\u0430 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0430, \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u0441\\u043E\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u0417\\u0430 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0430, \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0441\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u0437\\u0430\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u043D\\u0438 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u0441\\u043E\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442 (\\u0432\\u044A\\u0437\\u0445\\u043E\\u0434\\u044F\\u0449\\u043E)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u0410\\u043A\\u0430\\u0443\\u043D\\u0442 (\\u043D\\u0438\\u0437\\u0445\\u043E\\u0434\\u044F\\u0449\\u043E)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 (\\u0432\\u044A\\u0437\\u0445\\u043E\\u0434\\u044F\\u0449\\u043E)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 (\\u043D\\u0438\\u0437\\u0445\\u043E\\u0434\\u044F\\u0449\\u043E)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 (\\u0432\\u044A\\u0437\\u0445\\u043E\\u0434\\u044F\\u0449\\u043E)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u041A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430 (\\u043D\\u0438\\u0437\\u0445\\u043E\\u0434\\u044F\\u0449\\u043E)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u041E\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\: {0}" \\u043E\\u0442 "\\u0418\\u0437\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D" \\u043D\\u0430 "\\u0412\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\: {0} \\u043E\\u0442 "\\u0418\\u0437\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D" \\u043D\\u0430 "\\u0412\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\: {0} \\u043E\\u0442 "\\u0411\\u0435\\u0437 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442" \\u043D\\u0430  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\: "{0}" \\u043E\\u0442 "{1}" \\u043D\\u0430 "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u0438 \\u0441\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0437\\u0430 \\u0434\\u0430\\u0442\\u0438\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u0422\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u043A\\u0440\\u0430\\u0439\\u043D\\u0430 \\u0434\\u0430\\u0442\\u0430\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u0411\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\\u0442\\u0430 \\u0435 \\u0434\\u043E\\u0431\\u0430\\u0432\\u0435\\u043D\\u0430\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u041D\\u0435\\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u0441\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u0417\\u0430 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0430, \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u0441\\u043E\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u0417\\u0430 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0430, \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0441\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u0437\\u0430\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u043D\\u0438 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u0441\\u043E\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\\u0438, \\u043A\\u043E\\u0438\\u0442\\u043E \\u0441\\u0430 \\u043F\\u043E\\u0441\\u043E\\u0447\\u0435\\u043D\\u0438 \\u043A\\u0430\\u0442\\u043E \\u043E\\u0441\\u043D\\u043E\\u0432\\u043D\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u0430\\u043A\\u0430\\u0443\\u0442\\u043D\\u0438 \\u0438\\u043B\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u041E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\u043D\\u0438 \\u0441\\u0442\\u0435 \\u0437\\u0430 {0} \\u043E\\u0442 {1} \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438. \\u0421\\u0430\\u043C\\u043E \\u0412\\u0430\\u0448\\u0438\\u0442\\u0435 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0438 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0441\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0438.\r\n\r\n#XACT: Loading\r\nLOADING=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 \\u0435 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0430 \\u0441 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0438\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043F\\u0440\\u0438\\u0435\\u043C\\u0435\\u0442\\u0435 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043E\\u0442\\u043A\\u0430\\u0436\\u0435\\u0442\\u0435 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u043D\\u0430\\u0442\\u0430 \\u0432\\u044A\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442 "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u0438\\u044F \\u0431\\u0443\\u0442\\u043E\\u043D \\u0437\\u0430 \\u043F\\u043E\\u0442\\u0432\\u044A\\u0440\\u0436\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0435\\u0448\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E \\u0432\\u0438.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u041C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043A\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438, \\u043A\\u043E\\u0438\\u0442\\u043E \\u0441\\u0430 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438 \\u043A\\u044A\\u043C \\u0442\\u043E\\u0437\\u0438 \\u0430\\u043A\\u0430\\u0443\\u043D\\u0442\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u041F\\u0440\\u0435\\u0434\\u0443\\u043F\\u0440\\u0435\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u041D\\u0435\\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u0438\\u0437\\u0433\\u0443\\u0431\\u0435\\u043D\\u0438. \\u0421\\u0438\\u0433\\u0443\\u0440\\u043D\\u0438 \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435?\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u041F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0430\\u0432\\u0430\\u043D\\u0435\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u041D\\u0435 \\u0441\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u0422\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C {0} \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0437\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u0422\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0443\\u043C {0} \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0437\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=\\u041F\\u043E\\u043D\\u0435 {0} \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 \\u0441\\u0435 \\u0438\\u0437\\u0438\\u0441\\u043A\\u0432\\u0430\\u0442 \\u0437\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u0443\\u0447\\u0430\\u0442\\u043D\\u0438\\u043A\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=\\u041F\\u043E\\u043D\\u0435 {0} \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u0446\\u0438 \\u0441\\u0435 \\u0438\\u0437\\u0438\\u0441\\u043A\\u0432\\u0430\\u0442 \\u0437\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u0443\\u0447\\u0430\\u0442\\u043D\\u0438\\u043A\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u0422\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C {0} \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0437\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u0422\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0443\\u043C {0} \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0437\\u0430 \\u0442\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u0432\\u0435\\u0447\\u0435 \\u0435 \\u0434\\u043E\\u0431\\u0430\\u0432\\u0435\\u043D \\u043A\\u0430\\u0442\\u043E \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A \\u0441 \\u0432\\u0438\\u0434\\u044A\\u0442 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438 \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 OK \\u0437\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0437\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u0435 \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u0434\\u0430\\u043D\\u043D\\u0438.\r\n',
	"cus/crm/lead/i18n/i18n_cs.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Tipy ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Tipy\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Tip\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID tipu\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Typ\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Zam\\u011Bstnanec\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Datum zah\\u00E1jen\\u00ED\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Koncov\\u00E9 datum\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=P\\u016Fvod\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorita\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifikace\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Stav\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produkt\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Mno\\u017Estv\\u00ED\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Info\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Pozn\\u00E1mky\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=P\\u0159\\u00EDloha\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u00DA\\u010Dastn\\u00EDci\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Aktu\\u00E1ln\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 produkty\r\n\r\n#XBUT: edit button text\r\nEDIT=Upravit\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Zobrazen\\u00ED - nastaven\\u00ED\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Nastaven\\u00ED\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maxim\\u00E1ln\\u00ED po\\u010Det tip\\u016F k zobrazen\\u00ED\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Pokud existuje velk\\u00FD po\\u010Det tip\\u016F, bude to m\\u00EDt dopad na v\\u00FDkon aplikace.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=P\\u0159idat kontakt\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Aktu\\u00E1ln\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00ED \\u00FA\\u010Dastn\\u00EDci (zahrnut\\u00E9 strany)\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u00DA\\u010Dastn\\u00EDci\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u00DA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampa\\u0148\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Jm\\u00E9no\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Hlavn\\u00ED kontakt\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Odpov\\u011Bdn\\u00FD zam\\u011Bstnanec\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Ko\\u0161\\u00EDk produkt\\u016F\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produkt/kategorie\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Jednotka\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Pohled\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funkce partnera\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=P\\u0159idat v\\u00EDce produkt\\u016F\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Ulo\\u017Eit\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Zru\\u0161it\r\n\r\n#XACT: search placeholder\r\nSEARCH=Hledat\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Katalog produkt\\u016F\r\n\r\n#XBUT: Add in dialogs\r\nADD=P\\u0159idat\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Z\\u00E1kazn\\u00EDk\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=P\\u0159idat z\\u00E1kazn\\u00EDka\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Hledat\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Koncov\\u00E9 datum nesm\\u00ED b\\u00FDt d\\u0159\\u00EDv\\u011Bj\\u0161\\u00ED ne\\u017E po\\u010D\\u00E1te\\u010Dn\\u00ED datum\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Tip ulo\\u017Een\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Pozn\\u00E1mka ulo\\u017Eena\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Tip se nepoda\\u0159ilo ulo\\u017Eit\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 tipy\r\n\r\n#YMSG: error\r\nERROR=Chyba\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Hledat\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Hledat \\u00FA\\u010Dastn\\u00EDky\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Hledat zam\\u011Bstnance\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtr podle\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Od\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Do\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Zm\\u011Bn\\u011Bno\r\n\r\n#XBUT\r\nS3_EDIT=Upravit\r\n\r\n#XBUT\r\nS3_NEGATIVE=Zam\\u00EDtnout\r\n\r\n#XBUT\r\nS3_POSITIVE=P\\u0159ijmout\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Kategorie produktu\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtr podle\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=V\\u0161e\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nov\\u00FD\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=T\\u0159\\u00EDdit podle\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Protokol zm\\u011Bn\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Aktu\\u00E1ln\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 produkty\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Aktu\\u00E1ln\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 pozn\\u00E1mky\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Zav\\u00E1d\\u00ED se...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici kontakty\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00ED zam\\u011Bstnanci\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=V sou\\u010Dasn\\u00E9 dob\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00E9 zm\\u011Bny\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Aktu\\u00E1ln\\u011B nejsou k dispozici \\u017E\\u00E1dn\\u00ED \\u00FA\\u010Dastn\\u00EDci (zahrnut\\u00E9 strany)\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=P\\u0159idat popis (maxim\\u00E1ln\\u011B 40 znak\\u016F)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=M\\u016F\\u017Eete zobrazit pouze vizitky kontakt\\u016F, kter\\u00E9 byly p\\u0159i\\u0159azeny tomuto z\\u00E1kazn\\u00EDkovi\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=M\\u016F\\u017Eete zobrazit pouze vizitky z\\u00E1kazn\\u00EDk\\u016F \\u010Di kontakt\\u016F\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Chcete-li zobrazit vizitku, mus\\u00ED b\\u00FDt pro specifikovan\\u00E9ho z\\u00E1kazn\\u00EDka k dispozici vizitka\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Chcete-li zobrazit vizitku, v\\u0161echny povinn\\u00E9 detaily mus\\u00ED b\\u00FDt pro specifikovan\\u00E9ho z\\u00E1kazn\\u00EDka dostupn\\u00E9\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Z\\u00E1kazn\\u00EDk (vzestupn\\u011B)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Z\\u00E1kazn\\u00EDk (sestupn\\u011B)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (vzestupn\\u011B)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (sestupn\\u011B)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Koncov\\u00E9 datum (vzestupn\\u011B)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Koncov\\u00E9 datum (sestupn\\u011B)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Otev\\u0159eno\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Zm\\u011Bn\\u011Bno\\: {0}" z Vyp. na Zap.\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Zm\\u011Bn\\u011Bno\\: {0}" ze Zap. na Vyp.\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Zm\\u011Bn\\u011Bno\\: {0} z \\u017E\\u00E1dn\\u00E9 hodnoty na   {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Zm\\u011Bn\\u011Bno\\: "{0}" z "{1}" na "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Zadejte platn\\u00E9 hodnoty pro data\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Mus\\u00EDte zadat koncov\\u00E9 datum\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Pozn\\u00E1mka p\\u0159id\\u00E1na\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Pozn\\u00E1mku se nepoda\\u0159ilo vytvo\\u0159it\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Chcete-li zobrazit vizitku, mus\\u00ED b\\u00FDt pro specifikovan\\u00E9ho z\\u00E1kazn\\u00EDka k dispozici vizitka\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Chcete-li zobrazit vizitku, v\\u0161echny povinn\\u00E9 detaily mus\\u00ED b\\u00FDt pro specifikovan\\u00E9ho z\\u00E1kazn\\u00EDka dostupn\\u00E9\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=M\\u016F\\u017Eete zobrazit pouze vizitky z\\u00E1kazn\\u00EDk\\u016F, kte\\u0159\\u00ED byli specifikov\\u00E1ni jako hlavn\\u00ED kontakty\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=M\\u016F\\u017Eete zobrazit pouze vizitky z\\u00E1kazn\\u00EDk\\u016F \\u010Di kontakt\\u016F\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Zodpov\\u00EDd\\u00E1te za {0} z {1} tip\\u016F. Jsou zobrazeny pouze va\\u0161e tipy.\r\n\r\n#XACT: Loading\r\nLOADING=Zav\\u00E1d\\u00ED se...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Tip ulo\\u017Een s chybami\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Chcete p\\u0159ijmout tip \\u201E{0}\\u201C?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Chcete odm\\u00EDtnout tip \\u201E{0}\\u201C?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Potvr\\u010Fte sv\\u00E9 rozhodnut\\u00ED volbou relevatn\\u00EDho tla\\u010D\\u00EDtka.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Vybrat kontakt\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=P\\u0159idat \\u00FA\\u010Dastn\\u00EDky\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Vybrat zam\\u011Bstnance\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=M\\u016F\\u017Eete zobrazit pouze vizitky kontakt\\u016F, kter\\u00E9 byly p\\u0159i\\u0159azeny tomuto z\\u00E1kazn\\u00EDkovi\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Upozorn\\u011Bn\\u00ED\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=V\\u0161echny neulo\\u017Een\\u00E9 zm\\u011Bny budou ztraceny. Opravdu chcete pokra\\u010Dovat?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Pokra\\u010Dovat\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Nebyli nalezeni \\u017E\\u00E1dn\\u00ED \\u00FA\\u010Dastn\\u00EDci\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Pro tento typ \\u00FA\\u010Dastn\\u00EDka mus\\u00EDte vybrat alespo\\u0148 tento po\\u010Det \\u00FA\\u010Dastn\\u00EDk\\u016F\\: {0}\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=M\\u016F\\u017Eete vybrat maxim\\u00E1ln\\u011B {0} \\u00FA\\u010Dastn\\u00EDk\\u016F pro tento typ \\u00FA\\u010Dastn\\u00EDka\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Tento typ \\u00FA\\u010Dastn\\u00EDka vy\\u017Eaduje alespo\\u0148 n\\u00E1sleduj\\u00EDc\\u00ED po\\u010Det \\u00FA\\u010Dastn\\u00EDk\\u016F\\: {0} \r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Tento typ \\u00FA\\u010Dastn\\u00EDka vy\\u017Eaduje alespo\\u0148 n\\u00E1sleduj\\u00EDc\\u00ED po\\u010Det \\u00FA\\u010Dastn\\u00EDk\\u016F\\: {0} \r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Pro tento typ \\u00FA\\u010Dastn\\u00EDka mus\\u00EDte vybrat alespo\\u0148 tento po\\u010Det \\u00FA\\u010Dastn\\u00EDk\\u016F\\: {0}\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=M\\u016F\\u017Eete vybrat maxim\\u00E1ln\\u011B {0} \\u00FA\\u010Dastn\\u00EDk\\u016F pro tento typ \\u00FA\\u010Dastn\\u00EDka\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} ji\\u017E byl p\\u0159id\\u00E1n jako \\u00FA\\u010Dastn\\u00EDk s typem \\u00FA\\u010Dastn\\u00EDka {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Data zm\\u011Bnil jin\\u00FD u\\u017Eivatel. Zvolte OK a na\\u010Dt\\u011Bte nejnov\\u011Bj\\u0161\\u00ED data.\r\n',
	"cus/crm/lead/i18n/i18n_de.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Leads ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leads\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=Lead-ID\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Typ\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Mitarbeiter\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Startdatum\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Enddatum\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Herkunft\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorit\\u00E4t\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Qualifizierung\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produkt\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Menge\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informationen\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notizen\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Anlage\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Teilnehmer\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Derzeit sind keine Produkte verf\\u00FCgbar\r\n\r\n#XBUT: edit button text\r\nEDIT=Bearbeiten\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Einstellungen anzeigen\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Einstellungen\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maximale Anzahl an anzuzeigenden Leads\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Beachten Sie bitte, dass sich eine gro\\u00DFe Anzahl von Leads negativ auf die Performance auswirkt.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Ansprechpartner hinzuf\\u00FCgen\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Derzeit sind keine Teilnehmer (Beteiligte) verf\\u00FCgbar\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Teilnehmer\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Teilnehmer ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampagne\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Bezeichnung\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Kunde\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Hauptansprechpartner\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Zust\\u00E4ndiger Mitarbeiter\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Produktkorb\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produkt/Kategorie\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Einheit\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Anzeigen\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Partnerfunktion\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Weitere Produkte hinzuf\\u00FCgen\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Sichern\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Abbrechen\r\n\r\n#XACT: search placeholder\r\nSEARCH=Suchen\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Produktkatalog\r\n\r\n#XBUT: Add in dialogs\r\nADD=Hinzuf\\u00FCgen\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Account\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Account hinzuf\\u00FCgen\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Suchen\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Enddatum darf nicht vor dem Startdatum liegen\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead gesichert\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Notiz gesichert\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Lead konnte nicht gesichert werden\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Derzeit sind keine Leads verf\\u00FCgbar\r\n\r\n#YMSG: error\r\nERROR=Fehler\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Ansprechpartner\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Suchen\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Teilnehmer suchen\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Mitarbeiter suchen\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Gefiltert nach\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Von\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=bis\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Ge\\u00E4ndert\r\n\r\n#XBUT\r\nS3_EDIT=Bearbeiten\r\n\r\n#XBUT\r\nS3_NEGATIVE=Ablehnen\r\n\r\n#XBUT\r\nS3_POSITIVE=Annehmen\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Produktkategorie\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Gefiltert nach\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Alle\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Neu\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Sortieren nach\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u00C4nderungsprotokoll\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Derzeit sind keine Produkte verf\\u00FCgbar\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Derzeit sind keine Notizen verf\\u00FCgbar\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Ladevorgang l\\u00E4uft...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Derzeit sind keine Ansprechpartner verf\\u00FCgbar\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Derzeit sind keine Mitarbeiter verf\\u00FCgbar\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Derzeit sind keine \\u00C4nderungen verf\\u00FCgbar\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Derzeit sind keine Teilnehmer (Beteiligte) verf\\u00FCgbar\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Beschreibung hinzuf\\u00FCgen (maximal 40 Zeichen)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Sie k\\u00F6nnen nur Visitenkarten von Ansprechpartnern ansehen, die diesem Account zugeordnet wurden\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Sie k\\u00F6nnen nur Visitenkarten von Accounts oder Ansprechpartnern ansehen\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Um eine Visitenkarte ansehen zu k\\u00F6nnen, m\\u00FCssen die Details f\\u00FCr den angegebenen Account verf\\u00FCgbar sein\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Um eine Visitenkarte ansehen zu k\\u00F6nnen, m\\u00FCssen alle ben\\u00F6tigen Details f\\u00FCr den angegebenen Account verf\\u00FCgbar sein\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Account (aufsteigend)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Account (absteigend)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (aufsteigend)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (absteigend)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Enddatum (aufsteigend)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Enddatum (absteigend)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u00D6ffnen\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Ge\\u00E4ndert\\: {0} von "Aus" in "Ein"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Ge\\u00E4ndert\\: {0} von "Ein" in "Aus"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Ge\\u00E4ndert\\: {0} von "Kein Wert" in  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Ge\\u00E4ndert\\: "{0}" von "{1}" in "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Geben Sie f\\u00FCr die Daten g\\u00FCltige Werte ein\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Geben Sie ein Enddatum ein.\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Notiz hinzugef\\u00FCgt\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Anlegen von Notiz nicht m\\u00F6glich\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Um eine Visitenkarte ansehen zu k\\u00F6nnen, m\\u00FCssen die Details f\\u00FCr den angegebenen Account verf\\u00FCgbar sein\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Um eine Visitenkarte ansehen zu k\\u00F6nnen, m\\u00FCssen alle ben\\u00F6tigen Details f\\u00FCr den angegebenen Account verf\\u00FCgbar sein\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Sie k\\u00F6nnen nur Visitenkarten von Accounts ansehen, die als Hauptansprechpartner angegeben wurden\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Sie k\\u00F6nnen nur Visitenkarten von Accounts oder Ansprechpartnern ansehen\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Sie sind f\\u00FCr {0} von {1} Leads zust\\u00E4ndig. Es werden nur Ihre Leads angezeigt.\r\n\r\n#XACT: Loading\r\nLOADING=Ladevorgang l\\u00E4uft...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead mit Fehlern gesichert\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=M\\u00F6chten Sie das Lead "{0}" annehmen?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=M\\u00F6chten Sie das Lead "{0}" ablehnen?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=W\\u00E4hlen Sie die entsprechende Drucktaste, um Ihre Auswahl zu best\\u00E4tigen.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Ansprechpartner ausw\\u00E4hlen\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Teilnehmer hinzuf\\u00FCgen\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Mitarbeiter ausw\\u00E4hlen\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Sie k\\u00F6nnen nur Visitenkarten von Ansprechpartnern ansehen, die diesem Account zugeordnet wurden\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Warnung\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Ungesicherte \\u00C4nderungen gehen verloren. M\\u00F6chten Sie wirklich fortfahren?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Weiter\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Keine Teilnehmer gefunden\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=F\\u00FCr diesen Teilnehmertyp m\\u00FCssen Sie mindestens {0} Teilnehmer ausw\\u00E4hlen\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=F\\u00FCr diesen Teilnehmertyp k\\u00F6nnen Sie maximal {0} Teilnehmer ausw\\u00E4hlen\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=F\\u00FCr diesen Teilnehmertyp werden mindestens {0} Teilnehmer ben\\u00F6tigt\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=F\\u00FCr diesen Teilnehmertyp werden mindestens {0} Teilnehmer ben\\u00F6tigt\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=F\\u00FCr diesen Teilnehmertyp m\\u00FCssen Sie mindestens {0} Teilnehmer ausw\\u00E4hlen\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=F\\u00FCr diesen Teilnehmertyp k\\u00F6nnen Sie maximal {0} Teilnehmer ausw\\u00E4hlen\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} wurde bereits als Teilnehmer hinzugef\\u00FCgt f\\u00FCr den Teilnehmertyp {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Daten wurden von einem anderen Benutzer ge\\u00E4ndert. W\\u00E4hlen Sie \'OK\', um die neuesten Daten abzurufen.\r\n',
	"cus/crm/lead/i18n/i18n_en.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Leads ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leads\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=Lead ID\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Type\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Employee\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Start Date\r\n\r\n#XFLD: closing date text\r\nEND_DATE=End Date\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Origin\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priority\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Qualification\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Product\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Quantity\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Info\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notes\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Attachment\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Participants\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=No products are currently available\r\n\r\n#XBUT: edit button text\r\nEDIT=Edit\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Display Settings\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Settings\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maximum number of leads to be displayed\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Please note that if there are many leads, the performance of the application will be affected\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Add Contact\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=No participants (parties involved) are currently available\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Participants\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Participants ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Campaign\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Name\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Customer\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Main Contact\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Employee Responsible\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Product Basket\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Product/Category\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Unit\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=View\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Partner Function\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Add More Products\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Save\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Cancel\r\n\r\n#XACT: search placeholder\r\nSEARCH=Search\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Product Catalog\r\n\r\n#XBUT: Add in dialogs\r\nADD=Add\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Account\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Add Account\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Search\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=End date must not be earlier than start date\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead saved\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Note saved\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Could not save the lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=No leads are currently available\r\n\r\n#YMSG: error\r\nERROR=Error\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Contact\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Search\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Search for Participants\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Search for Employees\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtered By\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=From\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=To\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Changed\r\n\r\n#XBUT\r\nS3_EDIT=Edit\r\n\r\n#XBUT\r\nS3_NEGATIVE=Reject\r\n\r\n#XBUT\r\nS3_POSITIVE=Accept\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Product Category\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtered By\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=All\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=New\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Sort By\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Log of Changes\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=No products are currently available\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=No notes are currently available\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Loading...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=No contacts are currently available\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=No employees are currently available\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=No changes are currently available\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=No participants (parties involved) are currently available\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Add description (a maximum of 40 characters)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=You can only view business cards of contacts that have been assigned to this account\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=You can only view business cards of accounts or contacts\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=To view a business card, there must be details available for the specified account\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=To view a business card, all required details must be available for the specified account\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Account (Ascending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Account (Descending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (Ascending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (Descending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=End Date (Ascending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=End Date (Descending)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Open\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Changed\\: {0} from "Off" to "On"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Changed\\: {0} from "On" to "Off"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Changed\\: {0} from "No Value" to  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Changed\\: "{0}" from "{1}" to "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Enter valid values for dates\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=You must enter an end date\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Note added\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Could not create note\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=To view a business card, there must be details available for the specified account\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=To view a business card, all required details must be available for the specified account\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=You can only view business cards of accounts that have been specified as main contacts\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=You can only view business cards of accounts or contacts\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=You are responsible for {0} out of {1} leads. Only your leads are displayed.\r\n\r\n#XACT: Loading\r\nLOADING=Loading...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead saved with errors\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Do you want to accept the lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Do you want to reject the lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Choose the relevant pushbutton to confirm your decision.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Select Contact\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Add Participants\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Select Employee\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=You can only view business cards of contacts that have been assigned to this account\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Warning\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Any unsaved changes will be lost. Are you sure you want to continue?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Continue\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=No participants found\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=You must select a minimum of {0} participants for this participant type\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=You can only select a maximum of {0} participants for this participant type\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=At least {0} participants are required for this participant type\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=At least {0} participants are required for this participant type\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=You must select a minimum of {0} participants for this participant type\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=You can only select a maximum of {0} participants for this participant type\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} has already been added as a participant with the participant type {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Data has been changed by another user. Choose OK to retrieve the latest data.\r\n',
	"cus/crm/lead/i18n/i18n_en_US_sappsd.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=[[[\\u013B\\u0113\\u0105\\u018C\\u015F ({0})]]]\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=[[[\\u013B\\u0113\\u0105\\u018C\\u015F ]]]\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=[[[\\u013B\\u0113\\u0105\\u018C]]]\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=[[[\\u013B\\u0113\\u0105\\u018C \\u012C\\u010E]]]\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=[[[\\u0162\\u0177\\u03C1\\u0113]]]\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113]]]\r\n\r\n#XFLD: start date text\r\nSTART_DATE=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: closing date text\r\nEND_DATE=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113]]]\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=[[[\\u014E\\u0157\\u012F\\u011F\\u012F\\u014B]]]\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=[[[\\u01A4\\u0157\\u012F\\u014F\\u0157\\u012F\\u0163\\u0177]]]\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=[[[\\u01EC\\u0171\\u0105\\u013A\\u012F\\u0192\\u012F\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F]]]\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163]]]\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=[[[\\u01EC\\u0171\\u0105\\u014B\\u0163\\u012F\\u0163\\u0177]]]\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=[[[\\u012C\\u014B\\u0192\\u014F]]]\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=[[[\\u0143\\u014F\\u0163\\u0113\\u015F]]]\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163]]]\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=[[[\\u01A4\\u0105\\u0157\\u0163\\u012F\\u0113\\u015F \\u012C\\u014B\\u028B\\u014F\\u013A\\u028B\\u0113\\u018C]]]\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0183\\u0105\\u015F\\u0137\\u0113\\u0163 \\u0113\\u0271\\u03C1\\u0163\\u0177]]]\r\n\r\n#XBUT: edit button text\r\nEDIT=[[[\\u0114\\u018C\\u012F\\u0163]]]\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=[[[\\u013B\\u012F\\u015F\\u0163 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=[[[\\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F]]]\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=[[[\\u039C\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157 \\u014F\\u0192 \\u013B\\u0113\\u0105\\u018C\\u015F \\u0163\\u014F \\u0183\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C\\:]]]\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=[[[*\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u014B\\u014F\\u0163\\u0113 \\u0163\\u0125\\u0105\\u0163 \\u012F\\u0192 \\u0163\\u0125\\u0113\\u0157\\u0113 \\u0105\\u0157\\u0113 \\u0105 \\u013A\\u0105\\u0157\\u011F\\u0113 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157 \\u014F\\u0192 \\u013B\\u0113\\u0105\\u018C\\u015F, \\u0163\\u0125\\u0113 \\u03C1\\u0113\\u0157\\u0192\\u014F\\u0157\\u0271\\u0105\\u014B\\u010B\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u0105\\u03C1\\u03C1\\u013A\\u012F\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u0105\\u0192\\u0192\\u0113\\u010B\\u0163\\u0113\\u018C.]]]\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=[[[\\u0100\\u018C\\u018C \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XBUT: OK button text\r\nOK=[[[\\u014E\\u0136]]]\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=[[[\\u0143\\u014F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u0113\\u015F \\u012F\\u014B\\u028B\\u014F\\u013A\\u028B\\u0113\\u018C \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=[[[\\u01A4\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=[[[\\u01A4\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F ({0})]]]\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=[[[\\u0108\\u0105\\u0271\\u03C1\\u0105\\u012F\\u011F\\u014B]]]\r\n\r\n#XFLD: name of account/prospect\r\nNAME=[[[\\u0143\\u0105\\u0271\\u0113]]]\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271\\u0113\\u0157]]]\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=[[[\\u039C\\u0105\\u012F\\u014B \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113]]]\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0181\\u0105\\u015F\\u0137\\u0113\\u0163]]]\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163/\\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177]]]\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=[[[\\u016E\\u014B\\u012F\\u0163]]]\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=[[[\\u01B2\\u012F\\u0113\\u0175]]]\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=[[[\\u01A4\\u0105\\u0157\\u0163\\u014B\\u0113\\u0157 \\u0191\\u0171\\u014B\\u010B\\u0163\\u012F\\u014F\\u014B]]]\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=[[[\\u0100\\u018C\\u018C \\u039C\\u014F\\u0157\\u0113 \\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F]]]\r\n\r\n#XBUT: save button in edit page \r\nSAVE=[[[\\u015C\\u0105\\u028B\\u0113]]]\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A]]]\r\n\r\n#XACT: search placeholder\r\nSEARCH=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125]]]\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0108\\u0105\\u0163\\u0105\\u013A\\u014F\\u011F]]]\r\n\r\n#XBUT: Add in dialogs\r\nADD=[[[\\u0100\\u018C\\u018C]]]\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=[[[\\u0100\\u018C\\u018C \\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F]]]\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=[[[\\u0114\\u014B\\u018C \\u018C\\u0105\\u0163\\u0113 \\u0271\\u0171\\u015F\\u0163 \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u0113\\u0105\\u0157\\u013A\\u012F\\u0113\\u0157 \\u0163\\u0125\\u0105\\u014B \\u015F\\u0163\\u0105\\u0157\\u0163 \\u018C\\u0105\\u0163\\u0113]]]\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=[[[\\u013B\\u0113\\u0105\\u018C \\u015F\\u0105\\u028B\\u0113\\u018C]]]\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=[[[\\u0143\\u014F\\u0163\\u0113 \\u015F\\u0105\\u028B\\u0113\\u018C]]]\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u015F\\u0105\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u018C]]]\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=[[[\\u0143\\u014F \\u013A\\u0113\\u0105\\u018C\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#YMSG: error\r\nERROR=[[[\\u0114\\u0157\\u0157\\u014F\\u0157]]]\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=[[[\\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F]]]\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113\\u015F]]]\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0183\\u0177 ]]]\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=[[[\\u0191\\u0157\\u014F\\u0271]]]\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=[[[\\u0162\\u014F]]]\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C]]]\r\n\r\n#XBUT\r\nS3_EDIT=[[[\\u0114\\u018C\\u012F\\u0163]]]\r\n\r\n#XBUT\r\nS3_NEGATIVE=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163]]]\r\n\r\n#XBUT\r\nS3_POSITIVE=[[[\\u0100\\u010B\\u010B\\u0113\\u03C1\\u0163]]]\r\n\r\n#XTIT: Product Category\r\nCATEGORY=[[[\\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163 \\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177]]]\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=[[[\\u0191\\u012F\\u013A\\u0163\\u0113\\u0157\\u0113\\u018C \\u0181\\u0177]]]\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=[[[\\u0100\\u013A\\u013A]]]\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=[[[\\u0143\\u0113\\u0175]]]\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=[[[\\u015C\\u014F\\u0157\\u0163 \\u0181\\u0177]]]\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=[[[\\u013B\\u014F\\u011F \\u014F\\u0192 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F]]]\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=[[[\\u0143\\u014F \\u03C1\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=[[[\\u0143\\u014F \\u014B\\u014F\\u0163\\u0113\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=[[[\\u0143\\u014F \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=[[[\\u0143\\u014F \\u0113\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=[[[\\u0143\\u014F \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=[[[\\u0143\\u014F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113]]]\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=[[[\\u0100\\u018C\\u018C \\u018C\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B (\\u0105 \\u0271\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 40 \\u010B\\u0125\\u0105\\u0157\\u0105\\u010B\\u0163\\u0113\\u0157\\u015F)]]]\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0163\\u0125\\u0105\\u0163 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u0163\\u0125\\u012F\\u015F \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F \\u014F\\u0157 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=[[[\\u0162\\u014F \\u028B\\u012F\\u0113\\u0175 \\u0105 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C, \\u0163\\u0125\\u0113\\u0157\\u0113 \\u0271\\u0171\\u015F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u015F\\u03C1\\u0113\\u010B\\u012F\\u0192\\u012F\\u0113\\u018C \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=[[[\\u0162\\u014F \\u028B\\u012F\\u0113\\u0175 \\u0105 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C, \\u0105\\u013A\\u013A \\u0157\\u0113\\u01A3\\u0171\\u012F\\u0157\\u0113\\u018C \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0271\\u0171\\u015F\\u0163 \\u0183\\u0113 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u015F\\u03C1\\u0113\\u010B\\u012F\\u0192\\u012F\\u0113\\u018C \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 (\\u0100\\u015F\\u010B\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F)]]]\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=[[[\\u0100\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163 (\\u010E\\u0113\\u015F\\u010B\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F)]]]\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F (\\u0100\\u015F\\u010B\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F)]]]\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=[[[\\u015C\\u0163\\u0105\\u0163\\u0171\\u015F (\\u010E\\u0113\\u015F\\u010B\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F)]]]\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113 (\\u0100\\u015F\\u010B\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F)]]]\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=[[[\\u0114\\u014B\\u018C \\u010E\\u0105\\u0163\\u0113 (\\u010E\\u0113\\u015F\\u010B\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F)]]]\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=[[[\\u014E\\u03C1\\u0113\\u014B]]]\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C\\: {0} \\u0192\\u0157\\u014F\\u0271 \\u014E\\u0192\\u0192 \\u0163\\u014F \\u014E\\u014B]]]\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C\\: {0} \\u0192\\u0157\\u014F\\u0271 \\u014E\\u014B \\u0163\\u014F \\u014E\\u0192\\u0192]]]\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C\\: {0} \\u0192\\u0157\\u014F\\u0271 \\u0143\\u014F \\u01B2\\u0105\\u013A\\u0171\\u0113 \\u0163\\u014F ]]]{1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C\\: {0} \\u0192\\u0157\\u014F\\u0271 {1} \\u0163\\u014F ]]]{2}\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u028B\\u0105\\u013A\\u012F\\u018C \\u028B\\u0105\\u013A\\u0171\\u0113\\u015F \\u0192\\u014F\\u0157 \\u018C\\u0105\\u0163\\u0113\\u015F]]]\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=[[[\\u0176\\u014F\\u0171 \\u0271\\u0171\\u015F\\u0163 \\u0113\\u014B\\u0163\\u0113\\u0157 \\u0105\\u014B \\u0113\\u014B\\u018C \\u018C\\u0105\\u0163\\u0113]]]\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=[[[\\u0143\\u014F\\u0163\\u0113 \\u0105\\u018C\\u018C\\u0113\\u018C ]]]\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113 \\u014B\\u014F\\u0163\\u0113]]]\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=[[[\\u0162\\u014F \\u028B\\u012F\\u0113\\u0175 \\u0105 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C, \\u0163\\u0125\\u0113\\u0157\\u0113 \\u0271\\u0171\\u015F\\u0163 \\u0183\\u0113 \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u015F\\u03C1\\u0113\\u010B\\u012F\\u0192\\u012F\\u0113\\u018C \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=[[[\\u0162\\u014F \\u028B\\u012F\\u0113\\u0175 \\u0105 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C, \\u0105\\u013A\\u013A \\u0157\\u0113\\u01A3\\u0171\\u012F\\u0157\\u0113\\u018C \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0271\\u0171\\u015F\\u0163 \\u0183\\u0113 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u015F\\u03C1\\u0113\\u010B\\u012F\\u0192\\u012F\\u0113\\u018C \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F \\u0163\\u0125\\u0105\\u0163 \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u015F\\u03C1\\u0113\\u010B\\u012F\\u0192\\u012F\\u0113\\u018C \\u0105\\u015F \\u0271\\u0105\\u012F\\u014B \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163\\u015F \\u014F\\u0157 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F]]]\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=[[[\\u0176\\u014F\\u0171 \\u0105\\u0157\\u0113 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u012F\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 ({0}) \\u014F\\u0171\\u0163 \\u014F\\u0192 ({1}) \\u013A\\u0113\\u0105\\u018C\\u015F. \\u014E\\u014B\\u013A\\u0177 \\u0177\\u014F\\u0171\\u0157 \\u013A\\u0113\\u0105\\u018C\\u015F \\u0105\\u0157\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C]]]\r\n\r\n#XACT: Loading\r\nLOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...]]]\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=[[[\\u013B\\u0113\\u0105\\u018C \\u015F\\u0105\\u028B\\u0113\\u018C \\u0175\\u012F\\u0163\\u0125 \\u0113\\u0157\\u0157\\u014F\\u0157\\u015F]]]\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u0105\\u010B\\u010B\\u0113\\u03C1\\u0163 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u018C "{0}"?]]]\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u018C "{0}"?]]]\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=[[[\\u0108\\u0125\\u014F\\u014F\\u015F\\u0113 \\u0163\\u0125\\u0113 \\u0157\\u0113\\u013A\\u0113\\u028B\\u0105\\u014B\\u0163 \\u03C1\\u0171\\u015F\\u0125\\u0183\\u0171\\u0163\\u0163\\u014F\\u014B \\u0163\\u014F \\u010B\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271 \\u0177\\u014F\\u0171\\u0157 \\u018C\\u0113\\u010B\\u012F\\u015F\\u012F\\u014F\\u014B.]]]\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0108\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163]]]\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=[[[\\u0100\\u018C\\u018C \\u01A4\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F]]]\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113]]]\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u028B\\u012F\\u0113\\u0175 \\u0183\\u0171\\u015F\\u012F\\u014B\\u0113\\u015F\\u015F \\u010B\\u0105\\u0157\\u018C\\u015F \\u014F\\u0192 \\u010B\\u014F\\u014B\\u0163\\u0105\\u010B\\u0163\\u015F \\u0163\\u0125\\u0105\\u0163 \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u0163\\u0125\\u012F\\u015F \\u0105\\u010B\\u010B\\u014F\\u0171\\u014B\\u0163]]]\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=[[[\\u0174\\u0105\\u0157\\u014B\\u012F\\u014B\\u011F]]]\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=[[[\\u0100\\u014B\\u0177 \\u0171\\u014B\\u015F\\u0105\\u028B\\u0113\\u018C \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u013A\\u014F\\u015F\\u0163.\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u010B\\u014F\\u014B\\u0163\\u012F\\u014B\\u0171\\u0113?]]]\r\n\r\n#XBUT: continue button\r\nCONTINUE=[[[\\u0108\\u014F\\u014B\\u0163\\u012F\\u014B\\u0171\\u0113]]]\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=[[[\\u0143\\u014F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C]]]\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=[[[\\u0176\\u014F\\u0171 \\u0271\\u0171\\u015F\\u0163 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0271\\u012F\\u014B\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 {0} \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0271\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 {0} \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=[[[\\u0176\\u014F\\u0171 \\u0271\\u0171\\u015F\\u0163 \\u0125\\u0105\\u028B\\u0113 \\u0105 \\u0271\\u012F\\u014B\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 {0} \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163\\u015F \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=[[[\\u0176\\u014F\\u0171 \\u0271\\u0171\\u015F\\u0163 \\u0125\\u0105\\u028B\\u0113 \\u0105 \\u0271\\u012F\\u014B\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 {0} \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=[[[\\u0176\\u014F\\u0171 \\u0271\\u0171\\u015F\\u0163 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0271\\u012F\\u014B\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 {0} \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=[[[\\u0176\\u014F\\u0171 \\u010B\\u0105\\u014B \\u014F\\u014B\\u013A\\u0177 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0271\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014F\\u0192 {0} \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113]]]\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0}[[[ \\u0125\\u0105\\u015F \\u0105\\u013A\\u0157\\u0113\\u0105\\u018C\\u0177 \\u0183\\u0113\\u0113\\u014B \\u0105\\u018C\\u018C\\u0113\\u018C \\u0105\\u015F \\u0105 \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0175\\u012F\\u0163\\u0125 \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u0157\\u0163\\u012F\\u010B\\u012F\\u03C1\\u0105\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113 ]]]{1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=[[[\\u010E\\u0105\\u0163\\u0105 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0183\\u0177 \\u0105\\u014B\\u014F\\u0163\\u0125\\u0113\\u0157 \\u0171\\u015F\\u0113\\u0157. \\u0108\\u013A\\u012F\\u010B\\u0137 \\u014E\\u0136 \\u0163\\u014F \\u0192\\u0113\\u0163\\u010B\\u0125 \\u0163\\u0125\\u0113 \\u013A\\u0105\\u0163\\u0113\\u015F\\u0163.]]]\r\n',
	"cus/crm/lead/i18n/i18n_en_US_saptrc.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=h9TqBqLwDFK81SMqdR5/qA_Leads ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=DnSiFgWqa5i91odfhsmS9g_Leads \r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=gAFejt3aYGVN8/+H70JVeQ_Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=bl1j4rYF5R629icIM+kjvg_Lead ID\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=CxFAoDKXLHxAKAHqx0u71Q_Type\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=FPwLNATzt+Uo1rWAcaixTg_Employee\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Y+9rJTk2x2XXiNY5i/O3cQ_Start Date\r\n\r\n#XFLD: closing date text\r\nEND_DATE=kiUpV5HD47vDXob8AUKEQQ_End Date\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=dTAPzv9NlBE8IfM8uxKJbg_Origin\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=20jmg4Sqf4CLxnQQP28iyA_Priority\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=ea70Pt3D6Tz7xR57X9inOg_Qualification\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=1KCah/PVa/I2qh2pwtOWmg_Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=b8jL1bjM0hdJEzXgQ4aEsg_Product\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=8VKBxo+iMKLRXuYzonYQzw_Quantity\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=x75/v/cMpj14pdurIc317A_Info\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=nr8SpMm2HSEdoXggayzsRQ_Notes\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=j4PxuH3z+jyCRAuGNXnehw_Attachment\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=HyjzNvqnEnD4SJQbE63FQg_Parties Involved\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=+DbJqPIOTJGD5NPvpZqjfw_Product basket empty\r\n\r\n#XBUT: edit button text\r\nEDIT=RNIA+dcxB7KJybCnVdJVgQ_Edit\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=fl6eaEa0ZMKUUCaYGzGVow_List Settings\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=gZtfJ0zdu4wSZAefbkgLhA_Settings\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=BbjuKoLl0k1zF8E9Etkq/w_Maximum number of Leads to be displayed\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=K/5rg9T3ov6blL+A0lq2bA_*Please note that if there are a large number of Leads, the performance of the application will be affected.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=WO2nJp5wOx2y1MZeRQRGTw_Add Contact\r\n\r\n#XBUT: OK button text\r\nOK=0rXdCPNfA3LatZBG2c8bbg_OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=VD4DZu4LIcNvJ44m60D6gA_No parties involved are currently available\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=oZLTXethZZvoJb81WRHiTg_Participants\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=NpuNnsX8h39r5+VLkjuAdA_Participants ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=XDVRq9OB4UkoX7aJ72m53w_Campaign\r\n\r\n#XFLD: name of account/prospect\r\nNAME=dH/kDRkigpy/Df2ll9IDXw_Name\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Djy09T1CQ8Hbt5pBN+5hiw_Customer\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=JrcOXGvgOCnEhIKlM61Fmw_Main Contact\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=JZ5MnLzTvOH0n2EoMnaCTg_Employee Responsible\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=rhJFH5PIYFsS+UPS0ZnPng_Product Basket\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=pbwJOP3bc95ciyu4TbXh2w_Product/Category\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=zqHgFMZFZwkCFrWew86QDQ_Unit\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=oItP2Q9hbcWUFLpxIcpe3w_View\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=IZjc6zVKBiU3b2lS7zFR+A_Partner Function\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=+Z9B8A0L3VSbBgjTHmG7pA_Add More Products\r\n\r\n#XBUT: save button in edit page \r\nSAVE=G5WIfgiPspuIR1pOQ3vyYQ_Save\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=pLp48IMP35u/3+WesuUC6Q_Cancel\r\n\r\n#XACT: search placeholder\r\nSEARCH=m0Vveifgvs/0OVjPuB830g_Search\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=mHEjawNuXe/4WgvsZaVg7A_Product Catalog\r\n\r\n#XBUT: Add in dialogs\r\nADD=tUcuWInoyhFZHPpAOR/ILw_Add\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=daxt+3lWGwSElKNAukMWFQ_Account\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=RmJYSOZDZlUSdTXXyq0UuA_Add Account\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=dFwFBrgkj6Ipxx9XfHYiMQ_Search accounts\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Xt4PF1GIE6QZe+oxqANj9g_End date must not be earlier than start date\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=u9QpcB3cN6kpAdeuFmc0BA_Lead saved\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=1STBUDjqyjoStlQ6L6nTJA_Note saved\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=G/BAgSVqc1W9WLCS4Y221w_Could not save the lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=aUiTYOWoC3Ak9zb/h22wOw_No leads are currently available\r\n\r\n#YMSG: error\r\nERROR=ppeqKCsx+wjdnQzh3qkrMg_Error\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=8R/d1Sq+PcKtNZDA+ZzmoA_Contact\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=+rmN2CzTztPC3CA1qfzNUg_Search contacts\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=0kjGB1xQbi1N3ZwmMGBxUw_Search for participants\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=ZsyvyVtP9Rd4xx7oeTsZyw_Search Employees\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=eZesgIKrXM/kdtwwi/r1sw_Filtered by \r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=84RWvKtkffon9dVFdcMk8Q_From\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=e4GH7BwLlJG5wlsKevSUQw_To\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=+r2TBgjCdkcNI40YUtDIOA_Changed\r\n\r\n#XBUT\r\nS3_EDIT=kI0CvorivY0EzIUR9aJRzw_Edit\r\n\r\n#XBUT\r\nS3_NEGATIVE=IdJcXtx1QYrJL+SeWieoEg_Reject\r\n\r\n#XBUT\r\nS3_POSITIVE=tDZ7zlddvFcNjtlG1hVtFQ_Accept\r\n\r\n#XTIT: Product Category\r\nCATEGORY=CyqI+o85Tn1/KkZL/tlSpg_Product Category\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=7Ap5+AzJ0xt2bujKDqFtmQ_Filtered By\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Qn5i5SQ9TPMV2nv48KlY5w_All\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=aPmyVIzixrtbTp4enHFzLA_New\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=W5gcPcUk4CPirDx3dagCRA_Sort By\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=YARs0Po/68k8ESPDe1oh3w_Log of changes\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=RvWB+dmC0qYvh2oTJQkz4g_No products are currently available\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=uetQJKIgjfx+NFzwY+noug_No notes are currently available\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=rUI1ZSglc4Kffo4VXzXHeQ_Loading...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=4FfikCK1avhZfguQAgACgw_No contacts are currently available\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=P83S7Okl+2tig8p+pYw4YQ_No employees are currently available\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=NQTfcwUo6/3ibizHWs7y7Q_No changes are currently available\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=xK/I7+20/oGVjWbHu0eqPg_No participants are currently available\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=zIGdQX9gqNp2ThN3inJTYg_Add description (a maximum of 40 characters)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=BiOpTyhXpEj23uAwi1tzSQ_You can only view business cards of contacts that has been assigned to this account\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=1edEYq08Zft89tdeJxiX2Q_You can only view business cards of accounts or contacts\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=S7SYdnYxEjrHDaLQfugw3Q_To view a business card, there must be details available for the specified account\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=jBDEKouKkOHWyyoDqGMHrQ_To view a business card, all required details must be available for the specified account\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=YPn2a12tkA+vi41ly50dDw_Account (Ascending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=tpscrR/JpVPkLxjJFtaeHQ_Account (Descending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=1uNvgsUlEQZHe8GdoiHgNQ_Status (Ascending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=ltJHDrPIECrm/fkyaSY5Ig_Status (Descending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=CAz+rOHJfc5MNDPvBuLzcg_End Date (Ascending)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=sJYJwEejAXkXQlew7JQ4wg_End Date (Descending)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=uaCuSgQXXCHP0C2mhMhUFQ_Open\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=HmgskMJCKihe1LnX1EHTIQ_Changed\\: {0} from Off to On\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=QciV9iphzdHAidAHVMS5kA_Changed\\: {0} from On to Off\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=wayV4BWXojiwJRMJKTNwXA_Changed\\: {0} from No Value to {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=g/NpYGCrkcwLShosEy4t9A_Changed\\: {0} from {1} to {2}\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=U1LrBES6N/vMMvVyMMoeuA_Enter valid values for dates\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=DtK6rxC6OKXPvAdk1cTLbw_You must enter an end date\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=t4q5Ca+ufagEdhq5+06F7w_Note added \r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=TOMrC3lkHD8nT7p7biQhtA_Could not create note\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=29Bz4MygBZcJP15m08Es0w_To view a business card, there must be details available for the specified account\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=8sA4jAw7kHYfzHCqKTxTiA_To view a business card, all required details must be available for the specified account\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=ragBWf3J4Ya/5yz9Hobsew_You can only view business cards of accounts that have been specified as main contacts\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=O6kVBc0wDY6by0j2++6Tug_You can only view business cards of accounts or contacts\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=kkcShqtVa/2xXUgKVKjceg_You are responsible for ({0}) out of ({1}) leads. Only your leads are displayed\r\n\r\n#XACT: Loading\r\nLOADING=ixrhAKdu146ZKIlMZ5QLuQ_Loading...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=T0QRhF/f2mF8/S25MctA+A_Lead saved with errors\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=dRus6suSM1gZMcWaIHJQIw_Do you want to accept the lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=SSLeHCLMeP0H/3BgDRF6Ig_Do you want to reject the lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=iZyZzcnx6ZjlRzfW/o4new_Choose the relevant pushbutton to confirm your decision.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=7OZf1n1bf9m7GUtqo7P45Q_Select Contact\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=2keoerlkFtZuQ6LhwVeSGg_Add Participants\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=ZMtpe7EmLN472Flon6i9QQ_Select Employee\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=NYoiETSCVH3zv9T7xtYjxA_You can only view business cards of contacts that have been assigned to this account\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=F52HglpP8ThDAcvqVMfuoA_Warning\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=VGftsAC9/D1L19alzMWpiw_Any unsaved changes will be lost.Are you sure you want to continue?\r\n\r\n#XBUT: continue button\r\nCONTINUE=dYTV+lUFIdfFt17zDncaPQ_Continue\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=01hVOZZPMpUZcXMPN+jFTw_No participants found\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=za5uGEwFkROC6tdKjroSmQ_You must select a minimum of {0} participants for this participant type\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=2+qSwd+AMdL7WEuWgGckZw_You can only select a maximum of {0} participants for this participant type\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=MiAAgmH3XaNYZosNNmte+w_You must have a minimum of {0} participants for this participant type\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=A/Rr7uIPMNYPUsMHGEl6sQ_You must have a minimum of {0} participant for this participant type\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=6FNpRsD9hBw2zGHsi2df/A_You must select a minimum of {0} participant for this participant type\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=u5WC5UXvpF5855UFmrVdaw_You can only select a maximum of {0} participant for this participant type\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS=xbp83hEmaFk/At4E/o0bZg_{0} has already been added as a participant with the participant type {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=RKvP+uZL6bzS01rtljXWvQ_Data has been changed by another user. Click OK to fetch the latest.\r\n',
	"cus/crm/lead/i18n/i18n_es.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Leads ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leads\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID de lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tipo\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Empleado\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Fecha de inicio\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Fecha de fin\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Origen\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioridad\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Calificaci\\u00F3n\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Estado\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Producto\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Cantidad\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informaci\\u00F3n\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notas\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Anexo\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Participantes\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=No hay productos disponibles actualmente\r\n\r\n#XBUT: edit button text\r\nEDIT=Editar\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Visualizar opciones\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Opciones\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=N\\u00FAmero m\\u00E1ximo de incidentes a visualizar\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Tenga en cuenta que si hay un gran n\\u00FAmero de incidentes, se ver\\u00E1 afectado el rendimiento de la aplicaci\\u00F3n\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=A\\u00F1adir contacto\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=No hay participantes disponibles actualmente\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Participantes\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Participantes ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Campa\\u00F1a\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Nombre\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Cliente\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Contacto principal\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Empleado responsable\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Cesta de productos\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Producto/Categor\\u00EDa\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Unidad\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Visualizar\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funci\\u00F3n de socio comercial\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=A\\u00F1adir m\\u00E1s productos\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Guardar\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Cancelar\r\n\r\n#XACT: search placeholder\r\nSEARCH=Buscar\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Cat\\u00E1logo de productos\r\n\r\n#XBUT: Add in dialogs\r\nADD=A\\u00F1adir\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Cliente\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=A\\u00F1adir cliente\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Buscar\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=La fecha de fin no puede ser anterior a la de inicio\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead guardado\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Nota guardada\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=No se ha podido guardar el lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=No hay leads disponibles actualmente\r\n\r\n#YMSG: error\r\nERROR=Error\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Contacto\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Buscar\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Buscar participantes\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Buscar empleados\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrado por\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=De\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Para\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Modificados\r\n\r\n#XBUT\r\nS3_EDIT=Editar\r\n\r\n#XBUT\r\nS3_NEGATIVE=Rechazar\r\n\r\n#XBUT\r\nS3_POSITIVE=Aceptar\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Categor\\u00EDa de producto\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrado por\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Todo\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nuevos\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Clasificar por\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Log de modificaciones\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=No hay productos disponibles actualmente\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=No hay notas disponibles actualmente\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Cargando...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=No hay contactos disponibles actualmente\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=No hay empleados disponibles actualmente\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=No hay modificaciones disponibles actualmente\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=No hay participantes disponibles actualmente\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=A\\u00F1adir descripci\\u00F3n (m\\u00E1ximo de 40 caracteres)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Solo puede ver las tarjetas de presentaci\\u00F3n de contactos asignados a este cliente.\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Solo puede ver las tarjetas de presentaci\\u00F3n de clientes o contactos.\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Para ver una tarjeta de presentaci\\u00F3n, debe haber detalles disponibles para el cliente especificado.\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Para ver la tarjeta de presentaci\\u00F3n, todos los detalles necesarios deben estar disponibles para el cliente especificado.\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Cliente (ascendente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Cliente (descendiente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Estado (ascendente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Estado (descendente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Fecha de fin (ascendente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Fecha de fin (descendente)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Abiertos\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Modificado el\\: {0} de "Off" a "On"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Modificado el\\: {0} de "On" a "Off"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Modificado el\\: {0} de "Ning\\u00FAn valor" a  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Modificado el\\: "{0}" de "{1}" a "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Introduzca valores para fechas v\\u00E1lidos\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Debe indicar una fecha de fin\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Nota a\\u00F1adida\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=No se puedo crear la nota\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Para ver una tarjeta de presentaci\\u00F3n, debe haber detalles disponibles para el cliente especificado.\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Para ver la tarjeta de presentaci\\u00F3n, todos los detalles necesarios deben estar disponibles para el cliente especificado.\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Solo puede ver las tarjetas de presentaci\\u00F3n de clientes que se han especificado como contactos principales.\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Solo puede ver las tarjetas de presentaci\\u00F3n de clientes o contactos.\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Es responsable de {0} de {1} leads. Solo se visualizar\\u00E1n sus leads.\r\n\r\n#XACT: Loading\r\nLOADING=Cargando...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead guardado con errores\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u00BFDesea aceptar el lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u00BFDesea rechazar el lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Seleccione la opci\\u00F3n correspondiente para confirmar su decisi\\u00F3n.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Seleccionar contacto\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=A\\u00F1adir participantes\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Seleccionar empleado\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Solo puede ver las tarjetas de presentaci\\u00F3n de contactos asignados a este cliente.\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Advertencia\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Se perder\\u00E1n las modificaciones sin guardar. \\u00BFSeguro que desea continuar?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Continuar\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=No hay participantes\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Debe seleccionar un m\\u00EDnimo de {0} participantes para este tipo de participante\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Solo puede seleccionar un m\\u00E1ximo de {0} participantes para este tipo de participante\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Se necesitan al menos {0} participantes para este tipo de participante\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Se necesitan al menos {0} participantes para este tipo de participante\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Debe seleccionar un m\\u00EDnimo de {0} participantes para este tipo de participante\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Solo puede seleccionar un m\\u00E1ximo de {0} participantes para este tipo de participante\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} ya se ha a\\u00F1adido como participante con el tipo {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Otro usuario ha modificado los datos. Seleccione OK para recuperar los datos m\\u00E1s recientes.\r\n',
	"cus/crm/lead/i18n/i18n_fr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Int\\u00E9r\\u00EAts potentiels ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Int\\u00E9r\\u00EAts potentiels\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Int\\u00E9r\\u00EAt potentiel\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID de l\'int\\u00E9r\\u00EAt potentiel\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Type\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Salari\\u00E9\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Date de d\\u00E9but\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Date de fin\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Origine\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorit\\u00E9\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Qualification\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Statut\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produit\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Quantit\\u00E9\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Infos\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notes\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Pi\\u00E8ce jointe\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Participants\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Aucun produit disponible actuellement\r\n\r\n#XBUT: edit button text\r\nEDIT=Modifier\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Options d\'affichage\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Options\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Nombre maximal d\'int\\u00E9r\\u00EAts potentiels \\u00E0 afficher \\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Notez que si le nombre d\'int\\u00E9r\\u00EAts potentiels est important, la performance de l\'application en sera affect\\u00E9e.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Ajouter contact\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Aucun participant (personnes/organisations concern\\u00E9es) disponible(s) actuellement\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Participants\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Personnes/Organisations concern\\u00E9es ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Campagne\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Nom\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Client\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Contact principal\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Responsable\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Panier de produits\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produit/Cat\\u00E9gorie\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Unit\\u00E9\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Afficher\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Fonction partenaire\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Ajouter produits\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Sauvegarder\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Interrompre\r\n\r\n#XACT: search placeholder\r\nSEARCH=Rechercher\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Catalogue de produits\r\n\r\n#XBUT: Add in dialogs\r\nADD=Ajouter\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Compte\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Ajouter compte\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Rechercher\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Date de cl\\u00F4ture ne doit pas \\u00EAtre ant\\u00E9rieure \\u00E0 la date de d\\u00E9but\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Int\\u00E9r\\u00EAt potentiel sauvegard\\u00E9\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Note sauvegard\\u00E9e\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Impossible de sauvegarder l\'int\\u00E9r\\u00EAt potentiel\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Aucun int\\u00E9r\\u00EAt potentiel actuellement disponible\r\n\r\n#YMSG: error\r\nERROR=Erreur\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Contact\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Rechercher\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Rechercher personne/organisation concern\\u00E9e\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Rechercher des salari\\u00E9s\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtr\\u00E9 par\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=du\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=au\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Modifi\\u00E9\r\n\r\n#XBUT\r\nS3_EDIT=Traiter\r\n\r\n#XBUT\r\nS3_NEGATIVE=Refuser\r\n\r\n#XBUT\r\nS3_POSITIVE=Accepter\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Cat\\u00E9gorie de produit\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtr\\u00E9 par\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Tout\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nouv.\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Trier par\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Journal des modifications\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Aucun produit disponible actuellement\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Aucune note disponible actuellement\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Chargement...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Aucun contact disponible actuellement\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Actuellement, aucun salari\\u00E9 n\'est disponible.\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Aucune modification disponible actuellement\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Aucun participant (personnes/organisations concern\\u00E9es) disponible actuellement\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Ajouter description (40 caract\\u00E8res maximum)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Vous pouvez uniquement afficher les cartes de visite des contacts affect\\u00E9s \\u00E0 ce compte.\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Vous pouvez uniquement afficher les cartes de visite de comptes ou contacts.\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Pour afficher une carte de visite, les d\\u00E9tails du compte indiqu\\u00E9 doivent \\u00EAtre disponibles.\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Pour afficher une carte de visite, tous les d\\u00E9tails requis du compte indiqu\\u00E9 doivent \\u00EAtre disponibles.\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Compte (croissant)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Compte (d\\u00E9croissant)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Statut (croissant)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Statut (d\\u00E9croissant)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Date de fin (croissant)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Date de fin (d\\u00E9croissant)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=En cours\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Modifi\\u00E9\\u00A0\\: {0} de "D\\u00E9sactiv\\u00E9" \\u00E0 "Activ\\u00E9"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Modifi\\u00E9\\u00A0\\: {0} d\'\'"Activ\\u00E9" \\u00E0 "D\\u00E9sactiv\\u00E9"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Modifi\\u00E9\\u00A0\\: {0} de "Aucune valeur" \\u00E0  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Modifi\\u00E9\\u00A0\\: "{0}" de "{1}" \\u00E0 "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Saisissez des valeurs valides pour les dates.\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Vous devez entrer une date de fin.\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Note ajout\\u00E9e\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Impossible de cr\\u00E9er la note\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Pour afficher une carte de visite, les d\\u00E9tails du compte indiqu\\u00E9 doivent \\u00EAtre disponibles.\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Pour afficher une carte de visite, tous les d\\u00E9tails requis du compte indiqu\\u00E9 doivent \\u00EAtre disponibles.\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Vous pouvez uniquement afficher les cartes de visite des comptes indiqu\\u00E9s comme contacts principaux.\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Vous pouvez uniquement afficher les cartes de visite de comptes ou contacts.\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Vous avez la responsabilit\\u00E9 de {0}\\u00A0/\\u00A0{1} int\\u00E9r\\u00EAts potentiels. Seuls vos int\\u00E9r\\u00EAts potentiels s\'\'affichent.\r\n\r\n#XACT: Loading\r\nLOADING=Chargement...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Int\\u00E9r\\u00EAt potentiel sauvegard\\u00E9 avec erreurs\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Voulez-vous accepter l\'\'int\\u00E9r\\u00EAt potentiel "{0}"\\u00A0?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Voulez-vous refuser l\'\'int\\u00E9r\\u00EAt potentiel "{0}"\\u00A0?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Utilisez le bouton de commande pertinent pour confirmer votre d\\u00E9cision.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=S\\u00E9lectionner contact\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Ajout de personne/organisation concern\\u00E9e\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=S\\u00E9lection de salari\\u00E9\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Vous pouvez uniquement afficher les cartes de visite des contacts affect\\u00E9s \\u00E0 ce compte.\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Avertissement\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Toutes les modifications non sauvegard\\u00E9es seront perdues. Voulez-vous continuer ?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Suite\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Aucune personne/organisation concern\\u00E9e trouv\\u00E9e\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Vous devez s\\u00E9lectionner au moins {0} personnes/organisations pour ce type de personne/organisation.\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Vous pouvez s\\u00E9lectionner au maximum {0} personnes/organisations pour ce type de personne/organisation.\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Au moins {0} personnes/organisations sont requises pour ce type de personne/d\'\'organisation.\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Au moins {0} personnes/organisations sont requises pour ce type de personne/d\'\'organisation.\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Vous devez s\\u00E9lectionner au moins {0} personnes/organisations pour ce type de personne/d\'\'organisation.\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Vous pouvez s\\u00E9lectionner au maximum {0} personnes/organisations pour ce type de personne/d\'\'organisation.\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} a d\\u00E9j\\u00E0 \\u00E9t\\u00E9 ajout\\u00E9 comme personne/organisation avec le type de personne/d\'\'organisation {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Donn\\u00E9es modifi\\u00E9es par un autre utilisateur. S\\u00E9lectionnez OK pour r\\u00E9cup\\u00E9rer les donn\\u00E9es les plus r\\u00E9centes.\r\n',
	"cus/crm/lead/i18n/i18n_hr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Leadovi ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leadovi\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID leada\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tip\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Zaposlenik\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Po\\u010Detni datum\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Datum zavr\\u0161etka\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Porijeklo\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioritet\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifikacija\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Proizvod\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Koli\\u010Dina\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Info\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Bilje\\u0161ke\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Prilog\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Sudionici\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Proizvodi trenutno nisu raspolo\\u017Eivi\r\n\r\n#XBUT: edit button text\r\nEDIT=Uredi\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Prika\\u017Ei postave\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Postave\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maksimalni broj leadova za prikaz\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Uzmite u obzir da ako postoji veliki broj leadova, to mo\\u017Ee utjecati na izvedbu aplikacije\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Dodaj kontakt\r\n\r\n#XBUT: OK button text\r\nOK=U redu\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Sudionici (uklju\\u010Dene strane) trenutno nisu raspolo\\u017Eivi\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Sudionici\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Sudionici ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampanja\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Naziv\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Kupac\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Glavni kontakt\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Odgovorni zaposlenik\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Ko\\u0161arica proizvoda\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Proizvod/kategorija\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Jedinica\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Pogled\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funkcija partnera\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Dodaj vi\\u0161e proizvoda\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Snimi\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Otka\\u017Ei\r\n\r\n#XACT: search placeholder\r\nSEARCH=Tra\\u017Eenje\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Katalog proizvoda\r\n\r\n#XBUT: Add in dialogs\r\nADD=Dodaj\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Klijent\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Dodaj klijenta\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Tra\\u017Eenje\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Zavr\\u0161ni datum ne smije biti prije po\\u010Detnog datuma\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead snimljen\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Bilje\\u0161ka snimljena\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Nije bilo mogu\\u0107e snimiti lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Leadovi trenutno nisu raspolo\\u017Eivi\r\n\r\n#YMSG: error\r\nERROR=Gre\\u0161ka\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Tra\\u017Eenje\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Tra\\u017Ei sudionike\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Tra\\u017Ei zaposlenike\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrirano po\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Od\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Do\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Promijenjeno\r\n\r\n#XBUT\r\nS3_EDIT=Uredi\r\n\r\n#XBUT\r\nS3_NEGATIVE=Odbij\r\n\r\n#XBUT\r\nS3_POSITIVE=Prihvati\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Kategorija proizvoda\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrirano po\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Sve\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Novo\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Sortiraj po\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Protokol promjena\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Proizvodi trenutno nisu raspolo\\u017Eivi\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Bilje\\u0161ke trenutno nisu raspolo\\u017Eive\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=U\\u010Ditavanje...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Kontakti trenutno nisu raspolo\\u017Eivi\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Zaposlenici trenutno nisu raspolo\\u017Eivi\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Promjene trenutno nisu raspolo\\u017Eive\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Sudionici (uklju\\u010Dene strane) trenutno nisu raspolo\\u017Eivi\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Dodaj opis (maksimalno 40 znakova)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Mo\\u017Eete pregledati samo posjetnice kontakata koji su dodijeljeni ovom klijentu\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Mo\\u017Eete prikazati samo posjetnice klijenta ili kontakata\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Za prikaz posjetnice moraju postojati detalji za navedenog klijenta\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Za prikaz posjetnice svi potrebni detalji moraju biti raspolo\\u017Eivi za navedenog klijenta\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Klijent (uzlazno)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Klijent (silazno)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (uzlazno)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (silazno)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Zavr\\u0161ni datum (uzlazno)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Zavr\\u0161ni datum (silazno)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Otvori\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Promijenjeno\\: {0} iz "Isklju\\u010Deno" u "Uklju\\u010Deno"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Promijenjeno\\: {0} iz "Uklju\\u010Deno" u "Isklju\\u010Deno"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Promijenjeno\\: {0} iz "Nema vrijednosti" u  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Promijenjeno\\: "{0}" iz "{1}" u "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Unesite va\\u017Ee\\u0107e vrijednosti za datume\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Morate unijeti zavr\\u0161ni datum\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Bilje\\u0161ka dodana\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Kreiranje bilje\\u0161ke nije bilo mogu\\u0107e\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Za prikaz posjetnice moraju postojati detalji za navedenog klijenta\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Za prikaz posjetnice svi potrebni detalji moraju biti raspolo\\u017Eivi za navedenog klijenta\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Mo\\u017Eete pregledati samo posjetnice klijenata koji su navedeni kao glavni kontakti\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Mo\\u017Eete prikazati samo posjetnice klijenta ili kontakata\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Odgovorni ste za {0} od {1} leadova. Prikazani su samo va\\u0161i leadovi.\r\n\r\n#XACT: Loading\r\nLOADING=U\\u010Ditavanje...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead snimljen s gre\\u0161kama\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u017Delite li prihvatiti lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u017Delite li odbiti lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Izaberite odgovaraju\\u0107i gumb za potvrdu odluke.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Odaberi kontakt\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Dodaj sudionike\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Odaberi zaposlenika\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Mo\\u017Eete pregledati samo posjetnice kontakata koji su dodijeljeni ovom klijentu\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Upozorenje\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Nesnimljene promjene \\u0107e se izgubiti. \\u017Delite li zaista nastaviti?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Nastavi\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Sudionici nisu na\\u0111eni\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Morate odabrati minimalno {0} sudionika za ovaj tip sudionika\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Mo\\u017Eete odabrati maksimalno {0} sudionika za ovaj tip sudionika\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Najmanje  {0} sudionika potrebno je za ovaj tip sudionika\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Najmanje {0} sudionika potrebno je za ovaj tip sudionika\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Morate odabrati minimalno {0} sudionika za ovaj tip sudionika\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Mo\\u017Eete odabrati maksimalno {0} sudionika za ovaj tip sudionika\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} ve\\u0107 je dodan kao sudionik s tipom sudionika {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Podatke je promijenio drugi korisnik. Izaberite OK za dohva\\u0107anje najnovijih podataka.\r\n',
	"cus/crm/lead/i18n/i18n_hu.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Lead-ek ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leadek\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=Lead-ID\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Fajta\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Dolgoz\\u00F3\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Kezd\\u0151 d\\u00E1tum\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Befejez\\u00E9s d\\u00E1tuma\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Eredet\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorit\\u00E1s\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifik\\u00E1ci\\u00F3\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=St\\u00E1tus\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Term\\u00E9k\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Mennyis\\u00E9g\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Inform\\u00E1ci\\u00F3\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Megjegyz\\u00E9sek\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Mell\\u00E9klet\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=R\\u00E9sztvev\\u0151k\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Jelenleg nincs el\\u00E9rhet\\u0151 term\\u00E9k\r\n\r\n#XBUT: edit button text\r\nEDIT=Feldolgoz\\u00E1s\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Be\\u00E1ll\\u00EDt\\u00E1sok megjelen\\u00EDt\\u00E9se\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Be\\u00E1ll\\u00EDt\\u00E1sok\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Megjelen\\u00EDtend\\u0151 lead-ek maxim\\u00E1lis sz\\u00E1ma\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*K\\u00E9rem, vegye figyelembe, hogy amennyiben nagy sz\\u00E1m\\u00FA lead \\u00E1ll rendelkez\\u00E9sre, az az alkalmaz\\u00E1si performance-ot is \\u00E9rinti.\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Kapcsolattart\\u00F3 hozz\\u00E1ad\\u00E1sa\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre r\\u00E9sztvev\\u0151 (\\u00E9rintett)\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=R\\u00E9sztvev\\u0151k\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=R\\u00E9sztvev\\u0151k ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kamp\\u00E1ny\r\n\r\n#XFLD: name of account/prospect\r\nNAME=N\\u00E9v\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Vev\\u0151\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=F\\u0151 t\\u00E1rgyal\\u00F3partner\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Illet\\u00E9kes dolgoz\\u00F3\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Term\\u00E9kkos\\u00E1r\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Term\\u00E9k/kateg\\u00F3ria\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Egys\\u00E9g\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Megjelen\\u00EDt\\u00E9s\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Partnerfunkci\\u00F3\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=T\\u00F6bb term\\u00E9k hozz\\u00E1ad\\u00E1sa\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Ment\\u00E9s\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=M\\u00E9gse\r\n\r\n#XACT: search placeholder\r\nSEARCH=Keres\\u00E9s\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Term\\u00E9kkatal\\u00F3gus\r\n\r\n#XBUT: Add in dialogs\r\nADD=Hozz\\u00E1ad\\u00E1s\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u00DCgyf\\u00E9l\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Fi\\u00F3k hozz\\u00E1ad\\u00E1sa\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Keres\\u00E9s\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=A z\\u00E1r\\u00F3 d\\u00E1tum nem lehet kor\\u00E1bbi a kezd\\u0151 d\\u00E1tumn\\u00E1l\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead elmentve\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Megjegyz\\u00E9s elmentve\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Nem siker\\u00FClt elmenteni a leadet\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre lead\r\n\r\n#YMSG: error\r\nERROR=Hiba\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=T\\u00E1rgyal\\u00F3partner\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Keres\\u00E9s\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=R\\u00E9sztvev\\u0151k keres\\u00E9se\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Dolgoz\\u00F3k keres\\u00E9se\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\:\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Kezd\\u00E9s\\:\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=A k\\u00F6vetkez\\u0151ig\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=M\\u00F3dos\\u00EDtott\r\n\r\n#XBUT\r\nS3_EDIT=Feldolgoz\\u00E1s\r\n\r\n#XBUT\r\nS3_NEGATIVE=Elutas\\u00EDt\\u00E1s\r\n\r\n#XBUT\r\nS3_POSITIVE=Elfogad\\u00E1s\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Term\\u00E9kkateg\\u00F3ria\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Sz\\u0171r\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\:\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u00D6sszes\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u00DAj\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Rendez\\u00E9s a k\\u00F6vetkez\\u0151 szerint\\:\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=M\\u00F3dos\\u00EDt\\u00E1snapl\\u00F3\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Jelenleg nincs el\\u00E9rhet\\u0151 term\\u00E9k\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Jelenleg nem \\u00E1llnak rendelkez\\u00E9sre megjegyz\\u00E9sek\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Bet\\u00F6lt\\u00E9s...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Jelenleg nem \\u00E1llnak rendelkez\\u00E9sre t\\u00E1rgyal\\u00F3partnerek\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre dolgoz\\u00F3\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Jelenleg nem \\u00E1llnak rendelkez\\u00E9sre m\\u00F3dos\\u00EDt\\u00E1sok\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Jelenleg nem \\u00E1ll rendelkez\\u00E9sre r\\u00E9sztvev\\u0151 (\\u00E9rintett)\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Le\\u00EDr\\u00E1s hozz\\u00E1ad\\u00E1sa (maximum 40 karakter)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Csak olyan t\\u00E1rgyal\\u00F3partnerek n\\u00E9vjegyk\\u00E1rty\\u00E1it l\\u00E1thatja, akik hozz\\u00E1 vannak rendelve ehhez a fi\\u00F3khoz\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Csak fi\\u00F3kok vagy t\\u00E1rgyal\\u00F3partnerek n\\u00E9vjegyk\\u00E1rty\\u00E1it l\\u00E1thatja\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=N\\u00E9vjegyk\\u00E1rtya megtekint\\u00E9s\\u00E9hez rendelkez\\u00E9sre kell \\u00E1lljanak a megadott fi\\u00F3k r\\u00E9szletei\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=N\\u00E9vjegyk\\u00E1rtya megtekint\\u00E9s\\u00E9hez rendelkez\\u00E9sre kell \\u00E1lljon a megadott fi\\u00F3k \\u00F6sszes sz\\u00FCks\\u00E9ges r\\u00E9szlete\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Fi\\u00F3k (n\\u00F6vekv\\u0151)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Fi\\u00F3k (cs\\u00F6kken\\u0151)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=St\\u00E1tus (n\\u00F6vekv\\u0151)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=St\\u00E1tus (cs\\u00F6kken\\u0151)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=ZH\\u00E1r\\u00F3 d\\u00E1tum (n\\u00F6vekv\\u0151)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Z\\u00E1r\\u00F3 d\\u00E1tum (cs\\u00F6kken\\u0151)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Megnyit\\u00E1s\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=M\\u00F3dosult\\: {0} Ki -> Be\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=M\\u00F3dosult\\: {0} Be -> Ki\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=M\\u00F3dosult\\: {0} "Nincs \\u00E9rt\\u00E9k" -> erre\\:  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=M\\u00F3dosult\\: "{0}" err\\u0151l "{1}" erre "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Adjon meg az adatokhoz \\u00E9rv\\u00E9nyes \\u00E9rt\\u00E9keket\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Meg kell adnia egy z\\u00E1r\\u00F3d\\u00E1tumot\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Megjegyz\\u00E9s hozz\\u00E1ad\\u00E1sa\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Nem siker\\u00FClt l\\u00E9trehozni a megjegyz\\u00E9st\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=N\\u00E9vjegyk\\u00E1rtya megtekint\\u00E9s\\u00E9hez rendelkez\\u00E9sre kell \\u00E1lljanak a megadott fi\\u00F3k r\\u00E9szletei\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=N\\u00E9vjegyk\\u00E1rtya megtekint\\u00E9s\\u00E9hez rendelkez\\u00E9sre kell \\u00E1lljon a megadott fi\\u00F3k \\u00F6sszes sz\\u00FCks\\u00E9ges r\\u00E9szlete\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Csak olyan fi\\u00F3kok n\\u00E9vjegyk\\u00E1rty\\u00E1it tekintheti meg, amelyek f\\u0151 t\\u00E1rgyal\\u00F3partnerk\\u00E9nt vannak megadva\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Csak fi\\u00F3kok vagy t\\u00E1rgyal\\u00F3partnerek n\\u00E9vjegyk\\u00E1rty\\u00E1it l\\u00E1thatja\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u00D6n felel\\u0151s {0} lead-\\u00E9rt {1} leadb\\u0151l. Csak a saj\\u00E1t lead-jei jelennek meg.\r\n\r\n#XACT: Loading\r\nLOADING=Bet\\u00F6lt\\u00E9s...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=A lead el van mentve, de hib\\u00E1kkal\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Szeretn\\u00E9 elfogadni "{0}" lead-et?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Szeretn\\u00E9 elutas\\u00EDtani "{0}" lead-et?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=V\\u00E1lassza ki a megfelel\\u0151 nyom\\u00F3gombot a d\\u00F6nt\\u00E9s visszaigazol\\u00E1s\\u00E1ra\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=T\\u00E1rgyal\\u00F3partner kiv\\u00E1laszt\\u00E1sa\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=R\\u00E9sztvev\\u0151k hozz\\u00E1ad\\u00E1sa\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Dolgoz\\u00F3 kiv\\u00E1laszt\\u00E1sa\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Csak olyan t\\u00E1rgyal\\u00F3partnerek n\\u00E9vjegyk\\u00E1rty\\u00E1it l\\u00E1thatja, akik hozz\\u00E1 vannak rendelve ehhez a fi\\u00F3khoz\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Figyelmeztet\\u00E9s\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Elv\\u00E9sz minden el nem mentett m\\u00F3dos\\u00EDt\\u00E1s. Val\\u00F3ban szeretn\\u00E9 folytatni?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Folytat\\u00E1s\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Nem tal\\u00E1lhat\\u00F3 r\\u00E9sztvev\\u0151\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Legal\\u00E1bb {0} r\\u00E9sztvev\\u0151t ki kell v\\u00E1lasztani enn\\u00E9l a r\\u00E9sztvev\\u0151t\\u00EDpusn\\u00E1l\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Maximum {0} r\\u00E9sztvev\\u0151t lehet kiv\\u00E1lasztani enn\\u00E9l a r\\u00E9sztvev\\u0151t\\u00EDpusn\\u00E1l\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Legal\\u00E1bb {0} r\\u00E9sztvev\\u0151 sz\\u00FCks\\u00E9ges ehhez a r\\u00E9sztvev\\u0151t\\u00EDpushoz\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Legal\\u00E1bb {0} r\\u00E9sztvev\\u0151 sz\\u00FCks\\u00E9ges ehhez a r\\u00E9sztvev\\u0151t\\u00EDpushoz\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Legal\\u00E1bb {0} r\\u00E9sztvev\\u0151t ki kell v\\u00E1lasztani enn\\u00E9l a r\\u00E9sztvev\\u0151t\\u00EDpusn\\u00E1l\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Maximum {0} r\\u00E9sztvev\\u0151t lehet kiv\\u00E1lasztani enn\\u00E9l a r\\u00E9sztvev\\u0151t\\u00EDpusn\\u00E1l\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} m\\u00E1r hozz\\u00E1 van adva r\\u00E9sztvev\\u0151k\\u00E9nt r\\u00E9sztvev\\u0151t\\u00EDpussal {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Az adatokat egy m\\u00E1sik felhaszn\\u00E1l\\u00F3 m\\u00F3dos\\u00EDtotta. A legfrissebb adatok h\\u00EDv\\u00E1s\\u00E1hoz v\\u00E1lassza az OK-t.\r\n',
	"cus/crm/lead/i18n/i18n_it.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Iniziative ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leads\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tipo\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Dipendente\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Data di inizio\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Data di fine\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Origine\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorit\\u00E0\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Qualificazione\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Stato\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Prodotto\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Quantit\\u00E0\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informazioni\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Note\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Allegato\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Partecipanti\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Nessun prodotto attualmente disponibile\r\n\r\n#XBUT: edit button text\r\nEDIT=Elabora\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Visualizza impostazioni\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Impostazioni\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Numero massimo di lead da visualizzare\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Si noti che un numero troppo elevato di lead incide negativamente sulla performance dell\'applicazione\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Aggiungi contatto\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Nessun partecipante (parte interessata) attualmente disponibile\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Partecipanti\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Partecipanti ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Campagna\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Nome\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Cliente\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Contatto principale\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Dipendente responsabile\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Cestino prodotti\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Prodotto/Categoria\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Unit\\u00E0\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Visualizza\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funzione partner\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Aggiungi altri prodotti\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Salva\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Annulla\r\n\r\n#XACT: search placeholder\r\nSEARCH=Cerca\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Catalogo prodotti\r\n\r\n#XBUT: Add in dialogs\r\nADD=Aggiungi\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Cliente\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Aggiungi cliente\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Cerca\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=La data di fine non deve precedere la data di inizio\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead salvato\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Nota salvata\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Lead non salvato\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Nessun lead attualmente disponibile\r\n\r\n#YMSG: error\r\nERROR=Errore\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Contatto\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Cerca\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Cerca partecipanti\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Cerca dipendenti\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrato in base a\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Da\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=A\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Modificato\r\n\r\n#XBUT\r\nS3_EDIT=Elabora\r\n\r\n#XBUT\r\nS3_NEGATIVE=Rifiuta\r\n\r\n#XBUT\r\nS3_POSITIVE=Accetta\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Categoria di prodotto\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrato in base a\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Tutto\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nuovo\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Classifica in base a\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Registro modifiche\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Nessun prodotto attualmente disponibile\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Nessuna nota attualmente disponibile\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=In caricamento...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Nessun contatto attualmente disponibile\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Nessun dipendente attualmente disponibile\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Nessuna modifica attualmente disponibile\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Nessun partecipante (parte interessata) attualmente disponibile\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Aggiungi descrizione (massimo 40 caratteri)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Puoi visualizzare solo biglietti da visita di contatti attribuiti a questo cliente\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Puoi visualizzare solo biglietti da visita di clienti o contatti\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Per vedere un biglietto da visita, devono esistere dei dettagli per il cliente indicato\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Per vedere un biglietto da visita, devono esistere tutti i necessari dettagli per il cliente indicato\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Cliente (crescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Cliente (decrescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Stato (crescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Stato (decrescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Data di fine (crescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Data di fine (decrescente)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Apri\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Modifica\\: {0} da "Disattivato" ad "Attivato"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Modifica\\: {0} da "Attivato" a "Disattivato"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Modifica\\: {0} da "Nessun valore" a  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Modifica\\: "{0}" da "{1}" a "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Inserisci valori validi per le date\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u00C8 necessario inserire una data di fine\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Nota aggiunta\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Nota non creata\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Per vedere un biglietto da visita, devono esistere dei dettagli per il cliente indicato\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Per vedere un biglietto da visita, devono esistere tutti i necessari dettagli per il cliente indicato\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Puoi visualizzare solo biglietti da visita di clienti specificati come contatti principali\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Puoi visualizzare solo biglietti da visita di clienti o contatti\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Sei responsabile di {0} iniziative su un totale di {1}. Vengono visualizzate solo le tue iniziative.\r\n\r\n#XACT: Loading\r\nLOADING=In caricamento...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead salvato con errori\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Accettare l\'\'iniziativa "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Rifiutare l\'\'iniziativa "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Seleziona l\'apposito pulsante per confermare la tua decisione.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Seleziona contatto\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Aggiungi partecipanti\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Seleziona dipendente\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Puoi visualizzare solo biglietti da visita di contatti attribuiti a questo cliente\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Avvertimento\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Le modifiche non salvate andranno perse. Proseguire ugualmente?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Continua\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Nessun partecipante trovato\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u00C8 necessario selezionare un minimo di {0} partecipanti per questo tipo di partecipante\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u00C8 necessario selezionare solo un massimo di {0} partecipanti per questo tipo di partecipante\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Per questo tipo di partecipante sono richiesti almeno {0} partecipanti\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Per questo tipo di partecipante sono richiesti almeno {0} partecipanti\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u00C8 necessario selezionare un minimo di {0} partecipanti per questo tipo di partecipante\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u00C8 necessario selezionare un massimo di {0} partecipanti per questo tipo di partecipante\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u00E8 stato gi\\u00E0 aggiunto come partecipante con il tipo di partecipante {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Dati modificati da un altro utente. Fai clic su OK per chiamare gli ultimi dati.\r\n',
	"cus/crm/lead/i18n/i18n_iw.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 Lead ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=\\u05E1\\u05D5\\u05D2\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u05DE\\u05E7\\u05D5\\u05E8\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u05E2\\u05D3\\u05D9\\u05E4\\u05D5\\u05EA\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u05D4\\u05E2\\u05E8\\u05DB\\u05D4\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u05DE\\u05D5\\u05E6\\u05E8\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u05DB\\u05DE\\u05D5\\u05EA\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u05DE\\u05D9\\u05D3\\u05E2\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u05D4\\u05E2\\u05E8\\u05D5\\u05EA\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u05E7\\u05D5\\u05D1\\u05E5 \\u05DE\\u05E6\\u05D5\\u05E8\\u05E3\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05DE\\u05D5\\u05E6\\u05E8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u05E2\\u05E8\\u05D5\\u05DA\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=\\u05D4\\u05E6\\u05D2 \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=\\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=\\u05DE\\u05E1\\u05E4\\u05E8 \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05DC\\u05D9 \\u05E9\\u05DC \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 Lead \\u05E9\\u05E0\\u05D9\\u05EA\\u05DF \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u05E9\\u05D9\\u05DD \\u05DC\\u05D1 \\u05DB\\u05D9 \\u05D0\\u05DD \\u05D9\\u05E9 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 Lead \\u05E8\\u05D1\\u05D9\\u05DD, \\u05D1\\u05D9\\u05E6\\u05D5\\u05E2\\u05D9 \\u05D4\\u05D9\\u05D9\\u05E9\\u05D5\\u05DD \\u05D9\\u05D5\\u05E9\\u05E4\\u05E2\\u05D5\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD (\\u05D2\\u05D5\\u05E8\\u05DE\\u05D9\\u05DD \\u05DE\\u05E2\\u05D5\\u05E8\\u05D1\\u05D9\\u05DD) \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u05E7\\u05DE\\u05E4\\u05D9\\u05D9\\u05DF\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u05E9\\u05DD\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8 \\u05E8\\u05D0\\u05E9\\u05D9\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u05E2\\u05D5\\u05D1\\u05D3 \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u05E1\\u05DC \\u05DE\\u05D5\\u05E6\\u05E8\\u05D9\\u05DD\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u05DE\\u05D5\\u05E6\\u05E8/\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D4\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u05D9\\u05D7\\u05D9\\u05D3\\u05D4\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u05D4\\u05E6\\u05D2\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u05E4\\u05D5\\u05E0\\u05E7\\u05E6\\u05D9\\u05D9\\u05EA \\u05E9\\u05D5\\u05EA\\u05E3\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05E2\\u05D5\\u05D3 \\u05DE\\u05D5\\u05E6\\u05E8\\u05D9\\u05DD\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u05E9\\u05DE\\u05D5\\u05E8\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u05D1\\u05D8\\u05DC\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u05D7\\u05E4\\u05E9\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u05E7\\u05D8\\u05DC\\u05D5\\u05D2 \\u05DE\\u05D5\\u05E6\\u05E8\\u05D9\\u05DD\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u05D4\\u05D5\\u05E1\\u05E3\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05DC\\u05E7\\u05D5\\u05D7\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u05D7\\u05E4\\u05E9\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05E1\\u05D9\\u05D5\\u05DD \\u05DC\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC \\u05DC\\u05D7\\u05D5\\u05DC \\u05DC\\u05E4\\u05E0\\u05D9 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05D4\\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead \\u05E0\\u05E9\\u05DE\\u05E8\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u05D4\\u05E2\\u05E8\\u05D4 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E9\\u05DE\\u05D5\\u05E8 Lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u05D0\\u05D9\\u05DF \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 Lead \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD \\u05DB\\u05E8\\u05D2\\u05E2\r\n\r\n#YMSG: error\r\nERROR=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u05D7\\u05E4\\u05E9\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u05D7\\u05E4\\u05E9 \\u05D0\\u05D7\\u05E8 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u05D7\\u05E4\\u05E9 \\u05D0\\u05D7\\u05E8 \\u05E2\\u05D5\\u05D1\\u05D3\\u05D9\\u05DD\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u05DE-\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u05E2\\u05D3\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u05E9\\u05D5\\u05E0\\u05D4\r\n\r\n#XBUT\r\nS3_EDIT=\\u05E2\\u05E8\\u05D5\\u05DA\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u05D3\\u05D7\\u05D4\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u05E7\\u05D1\\u05DC\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D9\\u05EA \\u05DE\\u05D5\\u05E6\\u05E8\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u05E1\\u05D5\\u05E0\\u05DF \\u05DC\\u05E4\\u05D9\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u05D4\\u05DB\\u05D5\\u05DC\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u05D7\\u05D3\\u05E9\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u05DE\\u05D9\\u05D9\\u05DF \\u05DC\\u05E4\\u05D9\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u05D9\\u05D5\\u05DE\\u05DF \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05DE\\u05D5\\u05E6\\u05E8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05D4\\u05E2\\u05E8\\u05D5\\u05EA \\u05D6\\u05DE\\u05D9\\u05E0\\u05D5\\u05EA\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E2\\u05D5\\u05D1\\u05D3\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u05D0\\u05D9\\u05DF \\u05DB\\u05E8\\u05D2\\u05E2 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD (\\u05D2\\u05D5\\u05E8\\u05DE\\u05D9\\u05DD \\u05DE\\u05E2\\u05D5\\u05E8\\u05D1\\u05D9\\u05DD) \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05EA\\u05D9\\u05D0\\u05D5\\u05E8 (\\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05D5\\u05DD 40 \\u05EA\\u05D5\\u05D5\\u05D9\\u05DD)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 \\u05E9\\u05D4\\u05D5\\u05E7\\u05E6\\u05D5 \\u05DC\\u05DC\\u05E7\\u05D5\\u05D7 \\u05D6\\u05D4\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05DC\\u05E7\\u05D5\\u05D7\\u05D5\\u05EA \\u05D0\\u05D5 \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8, \\u05D7\\u05D9\\u05D9\\u05D1\\u05D9\\u05DD \\u05DC\\u05D4\\u05D9\\u05D5\\u05EA \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D4\\u05DC\\u05E7\\u05D5\\u05D7 \\u05E9\\u05E6\\u05D5\\u05D9\\u05DF\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8, \\u05DB\\u05DC \\u05D4\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD \\u05D4\\u05D3\\u05E8\\u05D5\\u05E9\\u05D9\\u05DD \\u05D7\\u05D9\\u05D9\\u05D1\\u05D9\\u05DD \\u05DC\\u05D4\\u05D9\\u05D5\\u05EA \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D4\\u05DC\\u05E7\\u05D5\\u05D7 \\u05E9\\u05E6\\u05D5\\u05D9\\u05DF\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u05DC\\u05E7\\u05D5\\u05D7 (\\u05D1\\u05E1\\u05D3\\u05E8 \\u05E2\\u05D5\\u05DC\\u05D4)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u05DC\\u05E7\\u05D5\\u05D7 (\\u05D1\\u05E1\\u05D3\\u05E8 \\u05D9\\u05D5\\u05E8\\u05D3)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1 (\\u05D1\\u05E1\\u05D3\\u05E8 \\u05E2\\u05D5\\u05DC\\u05D4)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1 (\\u05D1\\u05E1\\u05D3\\u05E8 \\u05D9\\u05D5\\u05E8\\u05D3)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD (\\u05D1\\u05E1\\u05D3\\u05E8 \\u05E2\\u05D5\\u05DC\\u05D4)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD (\\u05D1\\u05E1\\u05D3\\u05E8 \\u05D9\\u05D5\\u05E8\\u05D3)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u05E4\\u05EA\\u05D5\\u05D7\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u05D4\\u05E9\\u05EA\\u05E0\\u05D4\\: {0} \\u05DE\'\'\\u05DB\\u05D1\\u05D5\\u05D9\'\' \\u05DC\'\'\\u05E4\\u05D5\\u05E2\\u05DC\'\'\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u05D4\\u05E9\\u05EA\\u05E0\\u05D4\\: {0} \\u05DE\'\'\\u05E4\\u05D5\\u05E2\\u05DC\'\' \\u05DC\'\'\\u05DB\\u05D1\\u05D5\\u05D9\'\'\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u05D4\\u05E9\\u05EA\\u05E0\\u05D4\\: {0} \\u05DE\'\'\\u05DC\\u05DC\\u05D0 \\u05E2\\u05E8\\u05DA\'\' \\u05DC-  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u05D4\\u05E9\\u05EA\\u05E0\\u05D4\\: "{0}" \\u05DE"{1}" \\u05DC"{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u05D4\\u05D6\\u05DF \\u05E2\\u05E8\\u05DB\\u05D9\\u05DD \\u05D7\\u05D5\\u05E7\\u05D9\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DB\\u05D9\\u05DD\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u05E2\\u05DC\\u05D9\\u05DA \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA \\u05E1\\u05D9\\u05D5\\u05DD\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u05D4\\u05E2\\u05E8\\u05D4 \\u05E0\\u05D5\\u05E1\\u05E4\\u05D4\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D9\\u05E6\\u05D5\\u05E8 \\u05D4\\u05E2\\u05E8\\u05D4\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8, \\u05D7\\u05D9\\u05D9\\u05D1\\u05D9\\u05DD \\u05DC\\u05D4\\u05D9\\u05D5\\u05EA \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D4\\u05DC\\u05E7\\u05D5\\u05D7 \\u05E9\\u05E6\\u05D5\\u05D9\\u05DF\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8, \\u05DB\\u05DC \\u05D4\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD \\u05D4\\u05D3\\u05E8\\u05D5\\u05E9\\u05D9\\u05DD \\u05D7\\u05D9\\u05D9\\u05D1\\u05D9\\u05DD \\u05DC\\u05D4\\u05D9\\u05D5\\u05EA \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D4\\u05DC\\u05E7\\u05D5\\u05D7 \\u05E9\\u05E6\\u05D5\\u05D9\\u05DF\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05DC\\u05E7\\u05D5\\u05D7\\u05D5\\u05EA \\u05E9\\u05E6\\u05D5\\u05D9\\u05E0\\u05D5 \\u05DB\\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 \\u05E8\\u05D0\\u05E9\\u05D9\\u05D9\\u05DD\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05DC\\u05E7\\u05D5\\u05D7\\u05D5\\u05EA \\u05D0\\u05D5 \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u05D0\\u05EA\\u05D4 \\u05D0\\u05D7\\u05E8\\u05D0\\u05D9 \\u05DC-{0} \\u05DE\\u05EA\\u05D5\\u05DA {1} \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 lead. \\u05E8\\u05E7 \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9 \\u05D4-lead \\u05E9\\u05DC\\u05DA \\u05DE\\u05D5\\u05E6\\u05D2\\u05D9\\u05DD.\r\n\r\n#XACT: Loading\r\nLOADING=\\u05D8\\u05D5\\u05E2\\u05DF...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead \\u05E0\\u05E9\\u05DE\\u05E8 \\u05E2\\u05DD \\u05E9\\u05D2\\u05D9\\u05D0\\u05D5\\u05EA\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E7\\u05D1\\u05DC \\u05D0\\u05EA \\u05D4-lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D4-lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u05D1\\u05D7\\u05E8 \\u05D0\\u05EA \\u05D4\\u05DC\\u05D7\\u05E6\\u05DF \\u05D4\\u05E8\\u05DC\\u05D5\\u05D5\\u05E0\\u05D8\\u05D9 \\u05DC\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05D4\\u05D4\\u05D7\\u05DC\\u05D8\\u05D4 \\u05E9\\u05DC\\u05DA.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u05D1\\u05D7\\u05E8 \\u05D0\\u05D9\\u05E9 \\u05E7\\u05E9\\u05E8\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u05D1\\u05D7\\u05E8 \\u05E2\\u05D5\\u05D1\\u05D3\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05E8\\u05E7 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9 \\u05D1\\u05D9\\u05E7\\u05D5\\u05E8 \\u05E9\\u05DC \\u05D0\\u05E0\\u05E9\\u05D9 \\u05E7\\u05E9\\u05E8 \\u05E9\\u05D4\\u05D5\\u05E7\\u05E6\\u05D5 \\u05DC\\u05DC\\u05E7\\u05D5\\u05D7 \\u05D6\\u05D4\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u05D0\\u05D6\\u05D4\\u05E8\\u05D4\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC\\u05D0 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5 \\u05D9\\u05D0\\u05D1\\u05D3\\u05D5. \\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA?\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u05D4\\u05DE\\u05E9\\u05DA\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u05E2\\u05DC\\u05D9\\u05DA \\u05DC\\u05D1\\u05D7\\u05D5\\u05E8 \\u05DE\\u05D9\\u05E0\\u05D9\\u05DE\\u05D5\\u05DD {0} \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D6\\u05D4\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05DC\\u05D1\\u05D7\\u05D5\\u05E8 \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05D5\\u05DD {0} \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D6\\u05D4\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=\\u05DC\\u05E4\\u05D7\\u05D5\\u05EA {0} \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E0\\u05D3\\u05E8\\u05E9\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E3 \\u05D6\\u05D4\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=\\u05DC\\u05E4\\u05D7\\u05D5\\u05EA {0} \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E0\\u05D3\\u05E8\\u05E9\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05EA\\u05EA\\u05E3 \\u05D6\\u05D4\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u05E2\\u05DC\\u05D9\\u05DA \\u05DC\\u05D1\\u05D7\\u05D5\\u05E8 \\u05DE\\u05D9\\u05E0\\u05D9\\u05DE\\u05D5\\u05DD {0} \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D6\\u05D4\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u05D1\\u05D0\\u05E4\\u05E9\\u05E8\\u05D5\\u05EA\\u05DA \\u05DC\\u05D1\\u05D7\\u05D5\\u05E8 \\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05D5\\u05DD {0} \\u05DE\\u05E9\\u05EA\\u05EA\\u05E4\\u05D9\\u05DD \\u05E2\\u05D1\\u05D5\\u05E8 \\u05E1\\u05D5\\u05D2 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D6\\u05D4\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u05DB\\u05D1\\u05E8 \\u05E0\\u05D5\\u05E1\\u05E3 \\u05DB\\u05DE\\u05E9\\u05EA\\u05EA\\u05E3 \\u05E2\\u05DD \\u05E1\\u05D5\\u05D2 \\u05D4\\u05DE\\u05E9\\u05EA\\u05EA\\u05E3 {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=\\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05E9\\u05D5\\u05E0\\u05D5 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8. \\u05D1\\u05D7\\u05E8 OK \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D0\\u05D7\\u05D6\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E0\\u05EA\\u05D5\\u05E0\\u05D9\\u05DD \\u05D4\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D9\\u05DD.\r\n',
	"cus/crm/lead/i18n/i18n_ja.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u30EA\\u30FC\\u30C9 ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u30EA\\u30FC\\u30C9\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u30EA\\u30FC\\u30C9\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u30EA\\u30FC\\u30C9 ID\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=\\u30BF\\u30A4\\u30D7\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u5F93\\u696D\\u54E1\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u958B\\u59CB\\u65E5\\u4ED8\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u7D42\\u4E86\\u65E5\\u4ED8\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u30BD\\u30FC\\u30B9\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u512A\\u5148\\u5EA6\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u9078\\u5B9A\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u88FD\\u54C1\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u6570\\u91CF\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u60C5\\u5831\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u30E1\\u30E2\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u6DFB\\u4ED8\\u6587\\u66F8\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u53C2\\u52A0\\u8005\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u88FD\\u54C1\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u7DE8\\u96C6\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=\\u8A2D\\u5B9A\\u8868\\u793A\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=\\u8A2D\\u5B9A\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=\\u8868\\u793A\\u3055\\u308C\\u308B\\u30EA\\u30FC\\u30C9\\u306E\\u6700\\u5927\\u6570\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u591A\\u6570\\u306E\\u30EA\\u30FC\\u30C9\\u304C\\u5B58\\u5728\\u3059\\u308B\\u5834\\u5408\\u306F\\u3001\\u30A2\\u30D7\\u30EA\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\\u306E\\u30D1\\u30D5\\u30A9\\u30FC\\u30DE\\u30F3\\u30B9\\u304C\\u5F71\\u97FF\\u3092\\u53D7\\u3051\\u308B\\u53EF\\u80FD\\u6027\\u304C\\u3042\\u308B\\u3053\\u3068\\u306B\\u6CE8\\u610F\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u62C5\\u5F53\\u8005\\u8FFD\\u52A0\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u53C2\\u52A0\\u8005 (\\u95A2\\u4FC2\\u8005) \\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u53C2\\u52A0\\u8005\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u53C2\\u52A0\\u8005 ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u30AD\\u30E3\\u30F3\\u30DA\\u30FC\\u30F3\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u6C0F\\u540D\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u9867\\u5BA2\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u4E3B\\u8981\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u7BA1\\u7406\\u8CAC\\u4EFB\\u8005\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u88FD\\u54C1\\u30D0\\u30B9\\u30B1\\u30C3\\u30C8\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u88FD\\u54C1/\\u30AB\\u30C6\\u30B4\\u30EA\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u5358\\u4F4D\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u30D3\\u30E5\\u30FC\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u53D6\\u5F15\\u5148\\u6A5F\\u80FD\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u88FD\\u54C1\\u3092\\u8FFD\\u52A0\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u4E2D\\u6B62\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u691C\\u7D22\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u88FD\\u54C1\\u30AB\\u30BF\\u30ED\\u30B0\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u8FFD\\u52A0\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u9867\\u5BA2\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u9867\\u5BA2\\u8FFD\\u52A0\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u691C\\u7D22\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u7D42\\u4E86\\u65E5\\u4ED8\\u3092\\u958B\\u59CB\\u65E5\\u4ED8\\u3088\\u308A\\u3082\\u524D\\u306B\\u3059\\u308B\\u3053\\u3068\\u306F\\u3067\\u304D\\u307E\\u305B\\u3093\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=\\u30EA\\u30FC\\u30C9\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u30E1\\u30E2\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u30EA\\u30FC\\u30C9\\u3092\\u4FDD\\u5B58\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30EA\\u30FC\\u30C9\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#YMSG: error\r\nERROR=\\u30A8\\u30E9\\u30FC\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u691C\\u7D22\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u53C2\\u52A0\\u8005\\u691C\\u7D22\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u5F93\\u696D\\u54E1\\u691C\\u7D22\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u958B\\u59CB\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u7D42\\u4E86\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u5909\\u66F4\\u6E08\r\n\r\n#XBUT\r\nS3_EDIT=\\u7DE8\\u96C6\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u5374\\u4E0B\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u627F\\u8A8D\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u88FD\\u54C1\\u30AB\\u30C6\\u30B4\\u30EA\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u30D5\\u30A3\\u30EB\\u30BF\\u57FA\\u6E96\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u3059\\u3079\\u3066\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u65B0\\u898F\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u30BD\\u30FC\\u30C8\\u57FA\\u6E96\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u5909\\u66F4\\u30ED\\u30B0\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u88FD\\u54C1\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u30E1\\u30E2\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u5F93\\u696D\\u54E1\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u5909\\u66F4\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u73FE\\u5728\\u5229\\u7528\\u3067\\u304D\\u308B\\u53C2\\u52A0\\u8005 (\\u95A2\\u4FC2\\u8005) \\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u30C6\\u30AD\\u30B9\\u30C8\\u3092\\u8FFD\\u52A0\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044 (\\u6700\\u5927 40 \\u6587\\u5B57)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u3053\\u306E\\u9867\\u5BA2\\u306B\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u3066\\u3044\\u308B\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u9867\\u5BA2\\u307E\\u305F\\u306F\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u540D\\u523A\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F\\u3001\\u6307\\u5B9A\\u3057\\u305F\\u9867\\u5BA2\\u306B\\u3064\\u3044\\u3066\\u8A73\\u7D30\\u304C\\u767B\\u9332\\u3055\\u308C\\u3066\\u3044\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u540D\\u523A\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F\\u3001\\u6307\\u5B9A\\u3057\\u305F\\u9867\\u5BA2\\u306B\\u3064\\u3044\\u3066\\u5FC5\\u8981\\u306A\\u8A73\\u7D30\\u304C\\u3059\\u3079\\u3066\\u767B\\u9332\\u3055\\u308C\\u3066\\u3044\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u9867\\u5BA2 (\\u6607\\u9806)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u9867\\u5BA2 (\\u964D\\u9806)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9 (\\u6607\\u9806)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9 (\\u964D\\u9806)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u7D42\\u4E86\\u65E5\\u4ED8 (\\u6607\\u9806)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u7D42\\u4E86\\u65E5\\u4ED8 (\\u964D\\u9806)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u672A\\u51E6\\u7406\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u5909\\u66F4\\u6E08\\:  {0} ("\\u30AA\\u30D5" -> "\\u30AA\\u30F3")\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u5909\\u66F4\\u6E08\\:  {0} ("\\u30AA\\u30F3" -> "\\u30AA\\u30D5")\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u5909\\u66F4\\u6E08\\:  {0}  ("\\u5024\\u306A\\u3057" -> {1})\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u5909\\u66F4\\u6E08\\:  "{0}" ( "{1}" -> "{2}")\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u65E5\\u4ED8\\u306B\\u6709\\u52B9\\u306A\\u5024\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u7D42\\u4E86\\u65E5\\u4ED8\\u3092\\u5165\\u529B\\u3059\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u30E1\\u30E2\\u304C\\u8FFD\\u52A0\\u3055\\u308C\\u307E\\u3057\\u305F\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u30E1\\u30E2\\u3092\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u540D\\u523A\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F\\u3001\\u6307\\u5B9A\\u3057\\u305F\\u9867\\u5BA2\\u306B\\u3064\\u3044\\u3066\\u8A73\\u7D30\\u304C\\u767B\\u9332\\u3055\\u308C\\u3066\\u3044\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u540D\\u523A\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F\\u3001\\u6307\\u5B9A\\u3057\\u305F\\u9867\\u5BA2\\u306B\\u3064\\u3044\\u3066\\u5FC5\\u8981\\u306A\\u8A73\\u7D30\\u304C\\u3059\\u3079\\u3066\\u767B\\u9332\\u3055\\u308C\\u3066\\u3044\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u4E3B\\u8981\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u3068\\u3057\\u3066\\u6307\\u5B9A\\u3055\\u308C\\u3066\\u3044\\u308B\\u9867\\u5BA2\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u9867\\u5BA2\\u307E\\u305F\\u306F\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS={0}/{1} \\u30EA\\u30FC\\u30C9\\u306E\\u8CAC\\u4EFB\\u8005\\u306B\\u306A\\u3063\\u3066\\u3044\\u307E\\u3059\\u3002 \\u81EA\\u5206\\u306E\\u30EA\\u30FC\\u30C9\\u306E\\u307F\\u304C\\u8868\\u793A\\u3055\\u308C\\u307E\\u3059\\u3002\r\n\r\n#XACT: Loading\r\nLOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=\\u30EA\\u30FC\\u30C9\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F (\\u30A8\\u30E9\\u30FC\\u3042\\u308A)\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u30EA\\u30FC\\u30C9 "{0}" \\u3092\\u53D7\\u3051\\u5165\\u308C\\u307E\\u3059\\u304B\\u3002\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u30EA\\u30FC\\u30C9 "{0}" \\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u95A2\\u9023\\u3059\\u308B\\u62BC\\u30DC\\u30BF\\u30F3\\u3092\\u9078\\u629E\\u3057\\u3066\\u6C7A\\u5B9A\\u3092\\u78BA\\u8A8D\\u3057\\u307E\\u3059\\u3002\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u9078\\u629E\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u53C2\\u52A0\\u8005\\u8FFD\\u52A0\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u5F93\\u696D\\u54E1\\u9078\\u629E\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u3053\\u306E\\u9867\\u5BA2\\u306B\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u3066\\u3044\\u308B\\u53D6\\u5F15\\u5148\\u62C5\\u5F53\\u8005\\u306E\\u540D\\u523A\\u306E\\u307F\\u8868\\u793A\\u3059\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u8B66\\u544A\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u672A\\u4FDD\\u5B58\\u306E\\u5909\\u66F4\\u306F\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u7D9A\\u884C\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u53C2\\u52A0\\u8005\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u3053\\u306E\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7\\u3067\\u306F\\u3001\\u6700\\u4F4E\\u3067 {0} \\u4EBA\\u306E\\u53C2\\u52A0\\u8005\\u3092\\u9078\\u629E\\u3059\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u3053\\u306E\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7\\u3067\\u306F\\u3001\\u6700\\u5927\\u3067 {0} \\u4EBA\\u306E\\u53C2\\u52A0\\u8005\\u3057\\u304B\\u9078\\u629E\\u3067\\u304D\\u307E\\u305B\\u3093\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=\\u3053\\u306E\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7\\u3067\\u306F\\u3001\\u5C11\\u306A\\u304F\\u3068\\u3082 {0} \\u4EBA\\u306E\\u53C2\\u52A0\\u8005\\u304C\\u5FC5\\u8981\\u3067\\u3059\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=\\u3053\\u306E\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7\\u3067\\u306F\\u3001\\u5C11\\u306A\\u304F\\u3068\\u3082 {0} \\u4EBA\\u306E\\u53C2\\u52A0\\u8005\\u304C\\u5FC5\\u8981\\u3067\\u3059\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u3053\\u306E\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7\\u3067\\u306F\\u3001\\u6700\\u4F4E\\u3067 {0} \\u4EBA\\u306E\\u53C2\\u52A0\\u8005\\u3092\\u9078\\u629E\\u3059\\u308B\\u5FC5\\u8981\\u304C\\u3042\\u308A\\u307E\\u3059\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u3053\\u306E\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7\\u3067\\u306F\\u3001\\u6700\\u5927\\u3067 {0} \\u4EBA\\u306E\\u53C2\\u52A0\\u8005\\u3057\\u304B\\u9078\\u629E\\u3067\\u304D\\u307E\\u305B\\u3093\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u306F\\u3059\\u3067\\u306B\\u53C2\\u52A0\\u8005\\u30BF\\u30A4\\u30D7 {1} \\u306E\\u53C2\\u52A0\\u8005\\u3068\\u3057\\u3066\\u8FFD\\u52A0\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=\\u30C7\\u30FC\\u30BF\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u308A\\u5909\\u66F4\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002OK \\u3092\\u9078\\u629E\\u3057\\u3066\\u6700\\u65B0\\u30C7\\u30FC\\u30BF\\u3092\\u53D6\\u5F97\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\r\n',
	"cus/crm/lead/i18n/i18n_no.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Lead ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=Lead-ID\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Type\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Medarbeider\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Startdato\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Sluttdato\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Opprinnelse\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioritet\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifisering\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produkt\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Kvantum\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Info\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Merknader\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Vedlegg\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Deltakere\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Ingen produkter er tilgjengelige n\\u00E5\r\n\r\n#XBUT: edit button text\r\nEDIT=Rediger\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Vis innstillinger\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Innstillinger\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maks. antall leads som skal vises\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*V\\u00E6r oppmerksom p\\u00E5 at et stort antall leads vil p\\u00E5virke applikasjonen negativt\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Tilf\\u00F8y kontakt\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Ingen deltakere (involverte parter) er tilgjengelige n\\u00E5\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Deltakere\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Deltakere ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampanje\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Navn\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Kunde\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Hovedkontakt\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Ansvarlig medarbeider\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Produktkurv\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produkt/kategori\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Enhet\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Vis\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Partnerfunksjon\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Tilf\\u00F8y flere produkter\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Lagre\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Avbryt\r\n\r\n#XACT: search placeholder\r\nSEARCH=S\\u00F8k\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Produktkatalog\r\n\r\n#XBUT: Add in dialogs\r\nADD=Tilf\\u00F8y\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Kunde\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Tilf\\u00F8y kunde\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=S\\u00F8k\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Sluttdato kan ikke komme f\\u00F8r startdato\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead lagret\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Merknad lagret\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Kan ikke lagre lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Ingen lead er tilgjengelige for \\u00F8yeblikket\r\n\r\n#YMSG: error\r\nERROR=Feil\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=S\\u00F8k\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=S\\u00F8k etter deltakere\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=S\\u00F8k etter medarbeidere\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrert etter\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Fra\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Til\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Endret\r\n\r\n#XBUT\r\nS3_EDIT=Rediger\r\n\r\n#XBUT\r\nS3_NEGATIVE=Avvis\r\n\r\n#XBUT\r\nS3_POSITIVE=Godkjenn\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Produktkategori\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrert etter\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Alle\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Ny\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Sorter etter\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Endringsprotokoll\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Ingen produkter er tilgjengelige n\\u00E5\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Ingen merknader er tilgjengelige n\\u00E5\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Laster ...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Ingen kontakter er tilgjengelige n\\u00E5\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Ingen medarbeidere er tilgjengelige n\\u00E5\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Ingen endringer er tilgjengelige n\\u00E5\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Ingen deltakere (involverte parter) er tilgjengelige n\\u00E5\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Tilf\\u00F8y beskrivelse (maksimalt 40 tegn)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Du kan bare vise visittkort for kontakter som er tilordnet til denne kunden\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Du kan bare vise visittkort for kunder eller kontakter\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=For at du skal kunne se et visittkort, m\\u00E5 det v\\u00E6re detaljer tilgjengelig for den oppgitte kunden\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=For at du skal kunne se et visittkort, m\\u00E5 alle n\\u00F8dvendige detaljer v\\u00E6re tilgjengelige for den oppgitte kunden\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Kunde (stigende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Kunde (synkende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (stigende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (synkende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Sluttdato (stigende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Sluttdato (synkende)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u00C5pne\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Endret\\: {0} fra "Av" til "P\\u00E5"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Endret\\: {0} fra "P\\u00E5" til "Av"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Endret\\: {0} fra "Ingen verdi" til  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Endret\\: "{0}" fra "{1}" til "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Oppgi gyldige verdier for datoer\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Du m\\u00E5 oppgi en sluttdato\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Merknad tilf\\u00F8yd\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Kan ikke opprette merknad\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=For at du skal kunne se et visittkort, m\\u00E5 det v\\u00E6re detaljer tilgjengelig for den oppgitte kunden\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=For at du skal kunne se et visittkort, m\\u00E5 alle n\\u00F8dvendige detaljer v\\u00E6re tilgjengelige for den oppgitte kunden\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Du kan bare vise visittkort for kunder som er oppgitt som hovedkontakter\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Du kan bare vise visittkort for kunder eller kontakter\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Du er ansvarlig for {0} av {1} lead. Bare dine lead vises.\r\n\r\n#XACT: Loading\r\nLOADING=Laster ...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead lagret med feil\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Vil du godkjenne lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Vil du avvise lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Velg den relevante knappen for \\u00E5 bekrefte valget\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Velg kontakt\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Tilf\\u00F8y deltakere\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Velg medarbeider\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Du kan bare vise visittkort for kontakter som er tilordnet til denne kunden\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Advarsel\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Du vil miste endringer som ikke er lagret. Er du sikker p\\u00E5 at du vil fortsette?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Fortsett\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Finner ingen deltakere\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Du m\\u00E5 velge minst {0} deltakere for denne deltakertypen\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Du kan bare velge maksimalt {0} deltakere for denne deltakertypen\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Minst {0} deltakere er n\\u00F8dvendig for denne deltakertypen\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Minst {0} deltakere er n\\u00F8dvendig for denne deltakertypen\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Du m\\u00E5 velge minst {0} deltakere for denne deltakertypen\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Du kan bare velge maksimalt {0} deltakere for denne deltakertypen\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} er allerede tilf\\u00F8yd som deltaker med deltakertype {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Data er endret av en annen bruker. Velg OK for \\u00E5 hente siste data.\r\n',
	"cus/crm/lead/i18n/i18n_pl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Potencjalne szanse ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Potencjalne szanse\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Potencjalna szansa\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID potencjalnej szansy\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Typ\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Pracownik\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Data rozpocz\\u0119cia\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Data zako\\u0144czenia\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Pochodzenie\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorytet\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kwalifikacja\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produkt\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Ilo\\u015B\\u0107\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informacje\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notatki\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Za\\u0142\\u0105cznik\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Uczestnicy\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Aktualnie brak dost\\u0119pnych produkt\\u00F3w\r\n\r\n#XBUT: edit button text\r\nEDIT=Edytuj\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Wy\\u015Bwietl ustawienia\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Ustawienia\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maksymalna liczba potencjalnych szans do wy\\u015Bwietlenia\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Pami\\u0119taj, \\u017Ce du\\u017Ca liczba potencjalnych szans mo\\u017Ce wp\\u0142ywa\\u0107 na wydajno\\u015B\\u0107 aplikacji\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Dodaj kontakt\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Aktualnie brak dost\\u0119pnych uczestnik\\u00F3w (partner\\u00F3w)\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Uczestnicy\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Uczestnicy ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampania\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Nazwa\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Klient\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=G\\u0142\\u00F3wny kontakt\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Odpowiedzialny pracownik\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Koszyk produkt\\u00F3w\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produkt/kategoria\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Jednostka\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Wgl\\u0105d\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funkcja partnera\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Dodaj wi\\u0119cej produkt\\u00F3w\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Zapisz\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Anuluj\r\n\r\n#XACT: search placeholder\r\nSEARCH=Szukaj\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Katalog produkt\\u00F3w\r\n\r\n#XBUT: Add in dialogs\r\nADD=Dodaj\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Klient\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Dodawanie klienta\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Szukaj\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Data zako\\u0144czenia nie mo\\u017Ce by\\u0107 wcze\\u015Bniejsza ni\\u017C data rozpocz\\u0119cia\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Zapisano potencjaln\\u0105 szans\\u0119\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Zapisano notatk\\u0119\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Nie mo\\u017Cna zapisa\\u0107 potencjalnej szansy\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Obecnie brak potencjalnych szans\r\n\r\n#YMSG: error\r\nERROR=B\\u0142\\u0105d\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Szukaj\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Szukaj uczestnik\\u00F3w\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Szukaj pracownik\\u00F3w\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrowanie wed\\u0142ug\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Od\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Do\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Zmienione\r\n\r\n#XBUT\r\nS3_EDIT=Edytuj\r\n\r\n#XBUT\r\nS3_NEGATIVE=Odrzu\\u0107\r\n\r\n#XBUT\r\nS3_POSITIVE=Akceptuj\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Kategoria produktu\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrowanie wed\\u0142ug\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Wszystkie\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nowy\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Sortowanie wed\\u0142ug\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Log zmian\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Aktualnie brak dost\\u0119pnych produkt\\u00F3w\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Aktualnie brak dost\\u0119pnych notatek\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Wczytywanie...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Aktualnie brak dost\\u0119pnych kontakt\\u00F3w\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Aktualnie brak dost\\u0119pnych pracownik\\u00F3w\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Aktualnie brak dost\\u0119pnych zmian\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Aktualnie brak dost\\u0119pnych uczestnik\\u00F3w (partner\\u00F3w)\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Dodaj opis (maksymalnie 40 znak\\u00F3w)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Mo\\u017Cesz wy\\u015Bwietla\\u0107 wizyt\\u00F3wki wy\\u0142\\u0105cznie kontakt\\u00F3w przypisanych do tego klienta\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Mo\\u017Cesz wy\\u015Bwietla\\u0107 tylko wizyt\\u00F3wki klient\\u00F3w lub kontakt\\u00F3w\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Do wy\\u015Bwietlenia wizyt\\u00F3wki musz\\u0105 by\\u0107 dost\\u0119pne szczeg\\u00F3\\u0142y okre\\u015Blonego klienta\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Do wy\\u015Bwietlenia wizyt\\u00F3wki musz\\u0105 by\\u0107 dost\\u0119pne wszystkie wymagane szczeg\\u00F3\\u0142y okre\\u015Blonego klienta\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Klient (rosn\\u0105co)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Klient (malej\\u0105co)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (rosn\\u0105co)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (malej\\u0105co)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Data zako\\u0144czenia (rosn\\u0105co)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Data zako\\u0144czenia (malej\\u0105co)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Otwarte\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Zmieniono\\: {0} z "Wy\\u0142." na "W\\u0142."\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Zmieniono\\: {0} z "W\\u0142." na "Wy\\u0142."\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Zmieniono\\: {0} z "Brak warto\\u015Bci" na  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Zmieniono\\: "{0}" z "{1}" na "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Wpisz prawid\\u0142owe warto\\u015Bci dla dat\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Musisz wpisa\\u0107 dat\\u0119 ko\\u0144cow\\u0105\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Dodano notatk\\u0119\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Nie mo\\u017Cna utworzy\\u0107 notatki\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Do wy\\u015Bwietlenia wizyt\\u00F3wki musz\\u0105 by\\u0107 dost\\u0119pne szczeg\\u00F3\\u0142y okre\\u015Blonego klienta\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Do wy\\u015Bwietlenia wizyt\\u00F3wki musz\\u0105 by\\u0107 dost\\u0119pne wszystkie wymagane szczeg\\u00F3\\u0142y okre\\u015Blonego klienta\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Mo\\u017Cesz wy\\u015Bwietla\\u0107 wizyt\\u00F3wki wy\\u0142\\u0105cznie klient\\u00F3w okre\\u015Blonych jako g\\u0142\\u00F3wne osoby kontaktowe\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Mo\\u017Cesz wy\\u015Bwietla\\u0107 tylko wizyt\\u00F3wki klient\\u00F3w lub kontakt\\u00F3w\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Jeste\\u015B odpowiedzialny za {0} z {1} potencjalnych szans. Wy\\u015Bwietlane s\\u0105 tylko Twoje potencjalne szanse.\r\n\r\n#XACT: Loading\r\nLOADING=Wczytywanie...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Potencjalna szansa zapisana z b\\u0142\\u0119dami\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Czy chcesz zaakceptowa\\u0107 potencjaln\\u0105 szans\\u0119 "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Czy chcesz odrzuci\\u0107 potencjaln\\u0105 szans\\u0119 "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Aby potwierdzi\\u0107 decyzj\\u0119, wybierz odpowiedni przycisk.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Wybierz kontakt\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Dodaj uczestnik\\u00F3w\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Wybierz pracownika\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Mo\\u017Cesz wy\\u015Bwietla\\u0107 wizyt\\u00F3wki wy\\u0142\\u0105cznie kontakt\\u00F3w przypisanych do tego klienta\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Ostrze\\u017Cenie\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Niezapisane zmiany zostan\\u0105 utracone. Czy na pewno chcesz kontynuowa\\u0107?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Kontynuuj\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Nie znaleziono uczestnik\\u00F3w\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Musisz wybra\\u0107 co najmniej {0} uczestnik\\u00F3w dla tego typu uczestnika\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Maksymalnie mo\\u017Cesz wybra\\u0107 tylko {0} uczestnik\\u00F3w dla tego typu uczestnika\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Dla tego typu uczestnika wymaganych jest co najmniej {0} uczestnik\\u00F3w\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Dla tego typu uczestnika wymaganych jest co najmniej {0} uczestnik\\u00F3w\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Musisz wybra\\u0107 co najmniej {0} uczestnik\\u00F3w dla tego typu uczestnika\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Maksymalnie mo\\u017Cesz wybra\\u0107 tylko {0} uczestnik\\u00F3w dla tego typu uczestnika\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} zost. ju\\u017C dod. jako uczestnik typu {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Dane zosta\\u0142y zmienione przez innego u\\u017Cytkownika. Wybierz OK, aby pobra\\u0107 najnowsze dane.\r\n',
	"cus/crm/lead/i18n/i18n_pt.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Leads ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Leads\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID de lead\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tipo\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Funcion\\u00E1rio\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Data de in\\u00EDcio\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Data final\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Origem\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioridade\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Qualifica\\u00E7\\u00E3o\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produto\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Quantidade\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Info\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notas\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Anexo\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Participantes\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Nenhum produto atualmente dispon\\u00EDvel\r\n\r\n#XBUT: edit button text\r\nEDIT=Editar\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Exibir configura\\u00E7\\u00F5es\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Configura\\u00E7\\u00F5es\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=N\\u00FAmero m\\u00E1ximo de leads a exibir\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Note que um grande n\\u00FAmero de leads prejudica a performance do aplicativo\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Adic.contato\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Nenhum participante (partes envolvidas) atualmente dispon\\u00EDvel\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Participantes\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Participantes ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Campanha\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Nome\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Cliente\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Contato principal\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Funcion\\u00E1rio respons\\u00E1vel\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Cesta de produtos\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produto/categoria\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Unidade\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Exibir\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Fun\\u00E7\\u00E3o do parceiro\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Adc.mais prds.\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Gravar\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Anular\r\n\r\n#XACT: search placeholder\r\nSEARCH=Procurar\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Cat\\u00E1logo de produtos\r\n\r\n#XBUT: Add in dialogs\r\nADD=Adicionar\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Conta\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Adicionar conta\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Procurar\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=A data final n\\u00E3o pode ser anterior \\u00E0 data de in\\u00EDcio\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Lead gravado\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Nota gravada\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=N\\u00E3o foi poss\\u00EDvel gravar o lead\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Nenhum lead atualmente dispon\\u00EDvel\r\n\r\n#YMSG: error\r\nERROR=Erro\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Contato\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Procurar\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Procurar por participantes\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Procurar por funcion\\u00E1rios\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrado por\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=De\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=At\\u00E9\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Modificado\r\n\r\n#XBUT\r\nS3_EDIT=Editar\r\n\r\n#XBUT\r\nS3_NEGATIVE=Rejeitar\r\n\r\n#XBUT\r\nS3_POSITIVE=Aceitar\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Categoria de produto\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrado por\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Todos\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nova\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Ordenar por\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Log de modifica\\u00E7\\u00F5es\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Nenhum produto atualmente dispon\\u00EDvel\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Nenhuma nota atualmente dispon\\u00EDvel\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Carregando...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Nenhum contato atualmente dispon\\u00EDvel\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Nenhum funcion\\u00E1rio atualmente dispon\\u00EDvel\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Nenhuma modifica\\u00E7\\u00E3o atualmente dispon\\u00EDvel\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Nenhum participante (partes envolvidas) atualmente dispon\\u00EDvel\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Inserir descri\\u00E7\\u00E3o (m\\u00E1ximo de 40 caracteres)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contatos atribu\\u00EDdos a essa conta\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contas ou contatos\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Para exibir cart\\u00E3o de visita, detalhes da respectiva conta devem estar dispon\\u00EDveis.\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Para exibir cart\\u00E3o de visita, todos os detalhes necess\\u00E1rios da respectiva conta devem estar dispon\\u00EDveis\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Conta (crescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Conta (decrescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (crescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (decrescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Data final (crescente)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Data final (decrescente)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Pendentes\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Modificado\\: {0} de "Off" para "On"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Modificado\\: {0} de "On" para "Off"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Modificado\\: {0} de "Nenhum valor" para  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Modificado\\: "{0}" de "{1}" para "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Inserir valores v\\u00E1lidos de datas\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Voc\\u00EA deve inserir uma data de t\\u00E9rmino\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Nota adicionada\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Falha ao criar nota\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Para exibir cart\\u00E3o de visita, detalhes da respectiva conta devem estar dispon\\u00EDveis.\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Para exibir cart\\u00E3o de visita, todos os detalhes necess\\u00E1rios da respectiva conta devem estar dispon\\u00EDveis\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contas indicadas como contatos principais\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contas ou contatos\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Voc\\u00EA \\u00E9 respons\\u00E1vel por {0} de {1} leads. Somente seus leads s\\u00E3o exibidos.\r\n\r\n#XACT: Loading\r\nLOADING=Carregando...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Lead gravado com erros\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Aceitar o lead "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Rejeitar o lead "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Selecione o bot\\u00E3o relevante para confirmar sua decis\\u00E3o.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Selecionar contato\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Adicionar participantes\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Selecionar funcion\\u00E1rio\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=S\\u00F3 \\u00E9 poss\\u00EDvel exibir cart\\u00F5es de visita de contatos atribu\\u00EDdos a essa conta\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Advert\\u00EAncia\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=As modifica\\u00E7\\u00F5es n\\u00E3o gravadas se perder\\u00E3o. Continuar?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Continuar\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Nenhum participante encontrado\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Voc\\u00EA deve selecionar um m\\u00EDnimo de {0} participantes para o tipo de participante\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Voc\\u00EA s\\u00F3 pode selecionar um m\\u00EDnimo de {0} participantes para o tipo de participante\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=S\\u00E3o necess\\u00E1rios pelo menos {0} participantes para esse tipo de participante\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=S\\u00E3o necess\\u00E1rios pelo menos {0} participantes para esse tipo de participante\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Voc\\u00EA deve selecionar um m\\u00EDnimo de {0} participantes para esse tipo de participante\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Voc\\u00EA s\\u00F3 pode selecionar um m\\u00EDnimo de {0} participantes para esse tipo de participante\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} j\\u00E1 adicionado como participante, com o tipo de participante {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Dados modificados por outro usu\\u00E1rio. Selecione OK para chamar os dados mais recentes.\r\n',
	"cus/crm/lead/i18n/i18n_ro.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Interese poten\\u0163iale ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Interese poten\\u0163iale\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Interes poten\\u0163ial\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID interes poten\\u0163ial\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tip\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Angajat\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Dat\\u0103 \\u00EEnceput\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Dat\\u0103 de sf\\u00E2r\\u015Fit\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Origine\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioritate\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Calificare\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Stare\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produs\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Cantitate\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informa\\u0163ii\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Note\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Anex\\u0103\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Participan\\u0163i\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u00CEn prezent nu sunt disponibile produse\r\n\r\n#XBUT: edit button text\r\nEDIT=Editare\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Afi\\u015Fare set\\u0103ri\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Set\\u0103ri\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Num\\u0103r maxim de interese poten\\u0163iale de afi\\u015Fat\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Re\\u0163ine\\u0163i c\\u0103 dac\\u0103 exist\\u0103 multe interese poten\\u0163iale, va fi afectat\\u0103 performan\\u0163a aplica\\u0163iei\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Ad\\u0103ugare persoan\\u0103 de contact\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u00CEn prezent nu sunt disponibili participan\\u0163i (persoane/organiza\\u0163ii implicate)\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Participan\\u0163i\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Participan\\u0163i ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Campanie\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Nume\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Client\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Persoan\\u0103 de contact principal\\u0103\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Angajat responsabil\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Co\\u015F de produse\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produs/categorie\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Unitate\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Afi\\u015Fare\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Func\\u0163ie partener\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Ad\\u0103ugare mai multe produse\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Salvare\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Anulare\r\n\r\n#XACT: search placeholder\r\nSEARCH=C\\u0103utare\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Catalog de produse\r\n\r\n#XBUT: Add in dialogs\r\nADD=Ad\\u0103ugare\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Cont\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Ad\\u0103ugare cont\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=C\\u0103utare\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Data de sf\\u00E2r\\u015Fit nu trebuie s\\u0103 fie \\u00EEnainte de data de \\u00EEnceput\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Interes poten\\u0163ial salvat\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Not\\u0103 salvat\\u0103\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Imposibil de salvat interesul poten\\u0163ial\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u00CEn prezent nu sunt disponibile interese poten\\u0163iale\r\n\r\n#YMSG: error\r\nERROR=Eroare\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Persoan\\u0103 de contact\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=C\\u0103utare\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=C\\u0103utare participan\\u0163i\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=C\\u0103utare angaja\\u0163i\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrat dup\\u0103\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=De la\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=P\\u00E2n\\u0103 la\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Modificat\r\n\r\n#XBUT\r\nS3_EDIT=Editare\r\n\r\n#XBUT\r\nS3_NEGATIVE=Respingere\r\n\r\n#XBUT\r\nS3_POSITIVE=Acceptare\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Categorie produs\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrat dup\\u0103\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Tot\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nou\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Sortare dup\\u0103\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Jurnal de modific\\u0103ri\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u00CEn prezent nu sunt disponibile produse\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u00CEn prezent nu sunt disponibile note\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u00CEnc\\u0103rcare ...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u00CEn prezent nu sunt disponibile persoane de contact\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u00CEn prezent nu sunt disponibili angaja\\u0163i\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u00CEn prezent nu sunt disponibile modific\\u0103ri\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u00CEn prezent nu sunt disponibili participan\\u0163i (persoane/organiza\\u0163ii implicate)\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Ad\\u0103ugare descriere (de maximum 40 caractere)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Pute\\u0163i s\\u0103 vede\\u0163i doar c\\u0103r\\u0163ile de vizit\\u0103 pt.persoanele de contact care au fost alocate la acest cont\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Pute\\u0163i vedea doar c\\u0103r\\u0163i de vizit\\u0103 pt.conturi sau persoane de contact\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Pt.a vedea o carte de vizit\\u0103, trebuie s\\u0103 fie disponibile detalii pt.contul specificat\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Pt.a vedea o carte de vizit\\u0103, trebuie s\\u0103 fie disponibile toate detaliile necesare pt.contul specificat\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Cont (ascendent)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Cont (descendent)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Stare (ascendent)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Stare (descendent)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Dat\\u0103 de sf\\u00E2r\\u015Fit (ascendent)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Dat\\u0103 de sf\\u00E2r\\u015Fit (descendent)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Deschis\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Modificat\\: {0} din "Dezactivat" \\u00EEn "Activat"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Modificat\\: {0} din "Activat" \\u00EEn "Dezactivat"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Modificat\\: {0} din "Nicio valoare" \\u00EEn  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Modificat\\: "{0}" din "{1}" \\u00EEn "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Introduce\\u0163i valori valabile pt.termene\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Trebuie s\\u0103 introduce\\u0163i o dat\\u0103 de sf\\u00E2r\\u015Fit\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Not\\u0103 ad\\u0103ugat\\u0103\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Imposibil de creat not\\u0103\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Pt.a vedea o carte de vizit\\u0103, trebuie s\\u0103 fie disponibile detalii pt.contul specificat\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Pt.a vedea o carte de vizit\\u0103, trebuie s\\u0103 fie disponibile toate detaliile necesare pt.contul specificat\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Pute\\u0163i vedea doar c\\u0103r\\u0163ile de vizit\\u0103 pt.conturile care au fost specificate ca persoane de contact principale\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Pute\\u0163i vedea doar c\\u0103r\\u0163i de vizit\\u0103 pt.conturi sau persoane de contact\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Sunte\\u0163i responsabil pt. {0} din {1} interese poten\\u0163iale. Doar interesele dvs. poten\\u0163iale sunt afi\\u015Fate.\r\n\r\n#XACT: Loading\r\nLOADING=\\u00CEnc\\u0103rcare ...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Interes poten\\u0163ial salvat cu erori\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Dori\\u0163i s\\u0103 accepta\\u0163i interesul poten\\u0163ial "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Dori\\u0163i s\\u0103 respinge\\u0163i interesul poten\\u0163ial "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Alege\\u0163i butonul de comand\\u0103 relevant pt.a confirma decizia dvs.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Selectare persoan\\u0103 de contact\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Ad\\u0103ugare participan\\u0163i\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Selectare angajat\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Pute\\u0163i s\\u0103 vede\\u0163i doar c\\u0103r\\u0163ile de vizit\\u0103 pt.persoanele de contact care au fost alocate la acest cont\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Avertizare\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Orice modific\\u0103ri nesalvate vor fi pierdute. Sigur dori\\u0163i s\\u0103 continua\\u0163i?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Continuare\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=F\\u0103r\\u0103 participan\\u0163i g\\u0103si\\u0163i\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Trebuie s\\u0103 selecta\\u0163i minim {0} participan\\u0163i pt. acest tip de participant\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Pute\\u0163i s\\u0103 selecta\\u0163i doar maxim {0} participan\\u0163i pt. acest tip de participant\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Cel pu\\u0163in {0} participan\\u0163i sunt necesari pt. acest tip de participant\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Cel pu\\u0163in {0} participan\\u0163i sunt necesari pt. acest tip de participant\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Trebuie s\\u0103 selecta\\u0163i minim {0} participan\\u0163i pt. acest tip de participant\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Pute\\u0163i s\\u0103 selecta\\u0163i doar maxim {0} participan\\u0163i pt. acest tip de participant\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} a fost deja ad\\u0103ugat ca participant cu tipul de participant {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Datele au fost modificate de alt utilizator. Alege\\u0163i OK pt.a reg\\u0103si ultimele date.\r\n',
	"cus/crm/lead/i18n/i18n_ru.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u044B\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u044B\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0430\\u044F \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u0418\\u0434. \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u043E\\u0439 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=\\u0412\\u0438\\u0434\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u0421\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u0414\\u0430\\u0442\\u0430 \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u0414\\u0430\\u0442\\u0430 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u041F\\u0440\\u043E\\u0438\\u0441\\u0445\\u043E\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u041F\\u0440\\u0438\\u043E\\u0440\\u0438\\u0442\\u0435\\u0442\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u041A\\u0432\\u0430\\u043B\\u0438\\u0444\\u0438\\u043A\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u0417\\u0430\\u043C\\u0435\\u0442\\u043A\\u0438\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u044B \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=\\u041D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=\\u041C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u0447\\u0438\\u0441\\u043B\\u043E \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0435\\u0439 \\u0434\\u043B\\u044F \\u043E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0438\\u044F\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u0411\\u043E\\u043B\\u044C\\u0448\\u043E\\u0435 \\u0447\\u0438\\u0441\\u043B\\u043E \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0435\\u0439 \\u0432\\u043B\\u0438\\u044F\\u0435\\u0442 \\u043D\\u0430 \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XBUT: OK button text\r\nOK=\\u041E\\u041A\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 (\\u0443\\u0447\\u0430\\u0441\\u0442\\u0432\\u0443\\u044E\\u0449\\u0438\\u0435 \\u0441\\u0442\\u043E\\u0440\\u043E\\u043D\\u044B) \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u041A\\u0430\\u043C\\u043F\\u0430\\u043D\\u0438\\u044F\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u0418\\u043C\\u044F\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u041E\\u0441\\u043D\\u043E\\u0432\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u041E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u041A\\u043E\\u0440\\u0437\\u0438\\u043D\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u043E\\u0432\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442/\\u043A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u0415\\u0434\\u0438\\u043D\\u0438\\u0446\\u0430\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u0424\\u0443\\u043D\\u043A\\u0446\\u0438\\u044F \\u043F\\u0430\\u0440\\u0442\\u043D\\u0435\\u0440\\u0430\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0435\\u0449\\u0435 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u044B\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u041A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433 \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u043E\\u0432\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u0414\\u0430\\u0442\\u0430 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F \\u043D\\u0435 \\u0434\\u043E\\u043B\\u0436\\u043D\\u0430 \\u0431\\u044B\\u0442\\u044C \\u0440\\u0430\\u043D\\u044C\\u0448\\u0435 \\u0434\\u0430\\u0442\\u044B \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0430\\u044F \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043E\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0443\\u044E \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u044B\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#YMSG: error\r\nERROR=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u041F\\u043E\\u0438\\u0441\\u043A\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u041F\\u043E\\u0438\\u0441\\u043A \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u041F\\u043E\\u0438\\u0441\\u043A \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u043E\\u0432\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u0421\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u041F\\u043E\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\r\n\r\n#XBUT\r\nS3_EDIT=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u041F\\u0440\\u0438\\u043D\\u044F\\u0442\\u044C\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F \\u043F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u0430\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u041E\\u0442\\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u0412\\u0441\\u0435\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u041D\\u043E\\u0432\\u044B\\u0439\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u0421\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0430 \\u043F\\u043E\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u0416\\u0443\\u0440\\u043D\\u0430\\u043B \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0439\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u041F\\u0440\\u043E\\u0434\\u0443\\u043A\\u0442\\u044B \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u044F \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u041A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u044B \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u0421\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0438 \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 (\\u0443\\u0447\\u0430\\u0441\\u0442\\u0432\\u0443\\u044E\\u0449\\u0438\\u0435 \\u0441\\u0442\\u043E\\u0440\\u043E\\u043D\\u044B) \\u0432 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043C\\u043E\\u043C\\u0435\\u043D\\u0442 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435 (\\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0443\\u043C 40 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u043E\\u0432)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432, \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u044B\\u0435 \\u044D\\u0442\\u043E\\u043C\\u0443 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0443\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u043E\\u0432 \\u0438\\u043B\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0445 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u0435\\u043A \\u0434\\u043B\\u044F \\u0443\\u043A\\u0430\\u0437\\u0430\\u043D\\u043D\\u043E\\u0433\\u043E \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 \\u0434\\u043E\\u043B\\u0436\\u043D\\u0430 \\u0431\\u044B\\u0442\\u044C \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0430\\u044F \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0445 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u0435\\u043A \\u0434\\u043B\\u044F \\u0443\\u043A\\u0430\\u0437\\u0430\\u043D\\u043D\\u043E\\u0433\\u043E \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 \\u0434\\u043E\\u043B\\u0436\\u043D\\u0430 \\u0431\\u044B\\u0442\\u044C \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0430 \\u0432\\u0441\\u044F \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0430\\u044F \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442 (\\u043F\\u043E \\u0432\\u043E\\u0441\\u0445\\u043E\\u0434\\u044F\\u0449\\u0435\\u0439)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442 (\\u043F\\u043E \\u043D\\u0438\\u0441\\u0445\\u043E\\u0434\\u044F\\u0449\\u0435\\u0439)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 (\\u043F\\u043E \\u0432\\u043E\\u0441\\u0445\\u043E\\u0434\\u044F\\u0449\\u0435\\u0439)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 (\\u043F\\u043E \\u043D\\u0438\\u0441\\u0445\\u043E\\u0434\\u044F\\u0449\\u0435\\u0439)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u041A\\u043E\\u043D\\u0435\\u0447\\u043D\\u0430\\u044F \\u0434\\u0430\\u0442\\u0430 (\\u043F\\u043E \\u0432\\u043E\\u0441\\u0445\\u043E\\u0434\\u044F\\u0449\\u0435\\u0439)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u041A\\u043E\\u043D\\u0435\\u0447\\u043D\\u0430\\u044F \\u0434\\u0430\\u0442\\u0430 (\\u043F\\u043E \\u043D\\u0438\\u0441\\u0445\\u043E\\u0434\\u044F\\u0449\\u0435\\u0439)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u041E\\u0442\\u043A\\u0440\\u044B\\u0442\\u043E\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\\: {0} \\u0441 "\\u0432\\u044B\\u043A\\u043B." \\u043D\\u0430 "\\u0432\\u043A\\u043B."\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\\: {0} \\u0441 "\\u0432\\u043A\\u043B." \\u043D\\u0430 "\\u0432\\u044B\\u043A\\u043B."\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\\: {0} \\u0441 "\\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0443\\u0435\\u0442" \\u043D\\u0430  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\\: "{0}" \\u0441 "{1}" \\u043D\\u0430 "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0435 \\u0437\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u044F \\u0434\\u0430\\u0442\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0434\\u0430\\u0442\\u0443 \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435 \\u0434\\u043E\\u0431\\u0430\\u0432\\u043B\\u0435\\u043D\\u043E\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u043F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0445 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u0435\\u043A \\u0434\\u043B\\u044F \\u0443\\u043A\\u0430\\u0437\\u0430\\u043D\\u043D\\u043E\\u0433\\u043E \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 \\u0434\\u043E\\u043B\\u0436\\u043D\\u0430 \\u0431\\u044B\\u0442\\u044C \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0430\\u044F \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0445 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u0435\\u043A \\u0434\\u043B\\u044F \\u0443\\u043A\\u0430\\u0437\\u0430\\u043D\\u043D\\u043E\\u0433\\u043E \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 \\u0434\\u043E\\u043B\\u0436\\u043D\\u0430 \\u0431\\u044B\\u0442\\u044C \\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0430 \\u0432\\u0441\\u044F \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0430\\u044F \\u0438\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u043E\\u0432, \\u0443\\u043A\\u0430\\u0437\\u0430\\u043D\\u043D\\u044B\\u0445 \\u0432 \\u043A\\u0430\\u0447\\u0435\\u0441\\u0442\\u0432\\u0435 \\u043E\\u0441\\u043D\\u043E\\u0432\\u043D\\u044B\\u0445 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u043E\\u0432 \\u0438\\u043B\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u0412\\u044B \\u043E\\u0442\\u0432\\u0435\\u0447\\u0430\\u0435\\u0442\\u0435 \\u0437\\u0430 {0} \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446. \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D. \\u0438\\u0437 {1}. \\u041E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0430\\u044E\\u0442\\u0441\\u044F \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0432\\u0430\\u0448\\u0438 \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u044B\\u0435 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438.\r\n\r\n#XACT: Loading\r\nLOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=\\u041F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0430\\u044F \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430 \\u0441 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430\\u043C\\u0438\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u041F\\u0440\\u0438\\u043D\\u044F\\u0442\\u044C \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0443\\u044E \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u043F\\u043E\\u0442\\u0435\\u043D\\u0446\\u0438\\u0430\\u043B\\u044C\\u043D\\u0443\\u044E \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u044C "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u0441\\u043E\\u043E\\u0442\\u0432\\u0435\\u0442\\u0441\\u0442\\u0432\\u0443\\u044E\\u0449\\u0443\\u044E \\u043A\\u043D\\u043E\\u043F\\u043A\\u0443 \\u0434\\u043B\\u044F \\u043F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u044F \\u0440\\u0435\\u0448\\u0435\\u043D\\u0438\\u044F.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u0412\\u044B \\u043C\\u043E\\u0436\\u0435\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0440\\u043E\\u0441\\u043C\\u0430\\u0442\\u0440\\u0438\\u0432\\u0430\\u0442\\u044C \\u0432\\u0438\\u0437\\u0438\\u0442\\u043D\\u044B\\u0435 \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u043A\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0430\\u043A\\u0442\\u043E\\u0432, \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u044B\\u0435 \\u044D\\u0442\\u043E\\u043C\\u0443 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0443\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u041F\\u0440\\u0435\\u0434\\u0443\\u043F\\u0440\\u0435\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u0412\\u0441\\u0435 \\u043D\\u0435\\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0431\\u0443\\u0434\\u0443\\u0442 \\u043F\\u043E\\u0442\\u0435\\u0440\\u044F\\u043D\\u044B. \\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C?\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u041F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u0423\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u041D\\u0435\\u043E\\u0431\\u0445\\u043E\\u0434\\u0438\\u043C\\u043E \\u0432\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C {0} \\u0434\\u043B\\u044F \\u044D\\u0442\\u043E\\u0433\\u043E \\u0432\\u0438\\u0434\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u0414\\u043B\\u044F \\u044D\\u0442\\u043E\\u0433\\u043E \\u0432\\u0438\\u0434\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432 \\u043C\\u043E\\u0436\\u043D\\u043E \\u0432\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0443\\u043C \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E {0}\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=\\u0414\\u043B\\u044F \\u044D\\u0442\\u043E\\u0433\\u043E \\u0442\\u0438\\u043F\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0442\\u0440\\u0435\\u0431\\u0443\\u044E\\u0442\\u0441\\u044F \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438\\: \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C {0} \r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=\\u0414\\u043B\\u044F \\u044D\\u0442\\u043E\\u0433\\u043E \\u0442\\u0438\\u043F\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0442\\u0440\\u0435\\u0431\\u0443\\u044E\\u0442\\u0441\\u044F \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0438\\: \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C {0} \r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u0414\\u043B\\u044F \\u044D\\u0442\\u043E\\u0433\\u043E \\u0442\\u0438\\u043F\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432 \\u043D\\u0435\\u043E\\u0431\\u0445\\u043E\\u0434\\u0438\\u043C\\u043E \\u0432\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\\: \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C {0} \r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u0414\\u043B\\u044F \\u044D\\u0442\\u043E\\u0433\\u043E \\u0442\\u0438\\u043F\\u0430 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432 \\u043C\\u043E\\u0436\\u043D\\u043E \\u0432\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u043E\\u0432\\: \\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0443\\u043C {0}\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u0443\\u0436\\u0435 \\u0434\\u043E\\u0431\\u0430\\u0432\\u043B\\u0435\\u043D \\u0432 \\u043A\\u0430\\u0447\\u0435\\u0441\\u0442\\u0432\\u0435 \\u0443\\u0447\\u0430\\u0441\\u0442\\u043D\\u0438\\u043A\\u0430 \\u0442\\u0438\\u043F\\u0430 {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=\\u0414\\u0430\\u043D\\u043D\\u044B\\u0435 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u044B \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C. \\u041D\\u0430\\u0436\\u043C\\u0438\\u0442\\u0435 \\u041E\\u041A \\u0434\\u043B\\u044F \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u0438\\u044F \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u044C\\u043D\\u044B\\u0445 \\u0434\\u0430\\u043D\\u043D\\u044B\\u0445.\r\n',
	"cus/crm/lead/i18n/i18n_sh.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Potencijalni klijenti ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Potencijalni klijenti\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Potencijalni klijent\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID potencijalnog klijenta\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tip\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Zaposleni\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Datum po\\u010Detka\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Datum zavr\\u0161etka\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Poreklo\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioritet\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifikacija\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Proizvod\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Koli\\u010Dina\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informacije\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Bele\\u0161ke\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Dodatak\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=U\\u010Desnici\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Proizvodi trenutno nisu dostupni\r\n\r\n#XBUT: edit button text\r\nEDIT=Uredi\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Pode\\u0161avanja prikaza\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Pode\\u0161avanja\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maksimalni broj potencijalnih klijenata za prikaz\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Uzmite u obzir da ako postoji veliki broj potencijalnih klijenata, to \\u0107e uticati na izvo\\u0111enje aplikacije\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Dodaj kontakt\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=U\\u010Desnici (uklju\\u010Dene strane) trenutno nisu dostupni\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=U\\u010Desnici\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=U\\u010Desnici ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampanja\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Naziv\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Kupac\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Glavni kontakt\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Odgovorni zaposleni\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Korpa proizvoda\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Proizvod/kategorija\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Jedinica\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Pogled\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funkcija partnera\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Dodaj vi\\u0161e proizvoda\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Sa\\u010Duvaj\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Odustani\r\n\r\n#XACT: search placeholder\r\nSEARCH=Tra\\u017Ei\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Katalog proizvoda\r\n\r\n#XBUT: Add in dialogs\r\nADD=Dodaj\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Ra\\u010Dun\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Dodaj klijenta\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Tra\\u017Ei\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Datum zavr\\u0161etka ne sme biti pre datuma po\\u010Detka\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Potencijalni klijent sa\\u010Duvan\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Bele\\u0161ka sa\\u010Duvana\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Potencijalnog klijenta nije mogu\\u0107e sa\\u010Duvati\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Potencijalni klijenti trenutno nisu dostupni\r\n\r\n#YMSG: error\r\nERROR=Gre\\u0161ka\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Tra\\u017Ei\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Tra\\u017Ei u\\u010Desnike\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Tra\\u017Eenje zaposlenih\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrirano po\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Od\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Do\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Promenjeno\r\n\r\n#XBUT\r\nS3_EDIT=Uredi\r\n\r\n#XBUT\r\nS3_NEGATIVE=Odbij\r\n\r\n#XBUT\r\nS3_POSITIVE=Prihvati\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Kategorija proizvoda\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrirano po\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Sve\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Novo\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Pore\\u0111aj po\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Protokol promena\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Proizvodi trenutno nisu dostupni\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Bele\\u0161ke trenutno nisu dostupne\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=U\\u010Ditavanje...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Kontakti trenutno nisu dostupni\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Zaposleni trenutno nisu dostupni\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Promene trenutno nisu dostupne\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=U\\u010Desnici (uklju\\u010Dene strane) trenutno nisu dostupni\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Dodaj opis (maksimalno 40 znakova)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Mo\\u017Eete da pogledate samo vizitkarte kontakata koji su dodeljeni ovom klijentu\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Mo\\u017Eete da pogledate samo vizitkarte klijenata ili kontakata\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Za prikaz vizitkarte detalji moraju biti dostupni za navedenog klijenta\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Za prikaz vizitkarte svi zahtevani detalji moraju biti dostupni za navedenog klijenta\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Klijent (rastu\\u0107e)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Klijent (opadaju\\u0107e)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (rastu\\u0107e)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (opadaju\\u0107e)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Datum zavr\\u0161etka (rastu\\u0107e)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Datum zavr\\u0161etka (opadaju\\u0107e)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Otvoreno\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Promenjeno\\: {0} iz "Isklju\\u010Deno" na "uklju\\u010Deno"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Promenjeno\\: {0} iz "uklju\\u010Deno" na "isklju\\u010Deno"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Promenjeno\\: {0} iz "Nema vrednosti" na  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Promenjeno\\: "{0}" iz "{1}" na "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Unesite va\\u017Ee\\u0107e vrednosti za datume\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Morate da unesete datum zavr\\u0161etka\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Bele\\u0161ka dodata\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Bele\\u0161ku nije mogu\\u0107e kreirati\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Za prikaz vizitkarte detalji moraju biti dostupni za navedenog klijenta\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Za prikaz vizitkarte svi zahtevani detalji moraju biti dostupni za navedenog klijenta\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Mo\\u017Eete da pogledate samo vizitkarte klijenata koji su navedeni kao glavne kontakt osobe\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Mo\\u017Eete da pogledate samo vizitkarte klijenata ili kontakata\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Odgovorni ste za {0} od {1} potencijalnih klijenata. Prikazani su samo va\\u0161i potencijalni klijenti.\r\n\r\n#XACT: Loading\r\nLOADING=U\\u010Ditavanje...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Potencijalni klijent sa\\u010Duvan s gre\\u0161kama\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Da li \\u017Eelite da prihvatite potencijalnog klijenta "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Da li \\u017Eelite da odbijete potencijalnog klijenta "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Izaberite relevantno dugme za potvrdu odluke.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Odaberi kontakt\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Dodaj u\\u010Desnike\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Odaberi zaposlenog\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Mo\\u017Eete da pogledate samo vizitkarte kontakata koji su dodeljeni ovom klijentu\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Upozorenje\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Sve nesa\\u010Duvane promene \\u0107e biti izgubljene. Da li sigurno \\u017Eelite da nastavite?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Nastavi\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=U\\u010Desnici nisu na\\u0111eni\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Morate da odaberete najmanje {0} u\\u010Desnika za ovaj tip u\\u010Desnika\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Mo\\u017Eete da odaberete najvi\\u0161e {0} u\\u010Desnika za ovaj tip u\\u010Desnika\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Najmanje {0} u\\u010Desnika je potrebno za ovaj tip u\\u010Desnika\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Najmanje {0} u\\u010Desnika je potrebno za ovaj tip u\\u010Desnika\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Morate da odaberete najmanje {0} u\\u010Desnika za ovaj tip u\\u010Desnika\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Mo\\u017Eete da odaberete najvi\\u0161e {0} u\\u010Desnika za ovaj tip u\\u010Desnika\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} je ve\\u0107 dodat kao u\\u010Desnik sa tipom u\\u010Desnika {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Podatke je promenio drugi korisnik. Kliknite na dugme OK za pozivanje najnovijih podataka.\r\n',
	"cus/crm/lead/i18n/i18n_sk.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Tipy ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Tipy\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Tip\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID typu\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Typ\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Pracovn\\u00EDk\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Koncov\\u00FD d\\u00E1tum\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=P\\u00F4vod\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Priorita\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifik\\u00E1cia\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Stav\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Produkt\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Mno\\u017Estvo\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Inform\\u00E1cia\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Pozn\\u00E1mky\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Pr\\u00EDloha\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u00DA\\u010Dastn\\u00EDci\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne produkty\r\n\r\n#XBUT: edit button text\r\nEDIT=Upravi\\u0165\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Zobrazi\\u0165 nastavenia\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Nastavenia\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maxim\\u00E1lny po\\u010Det tipov na zobrazenie\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Berte do \\u00FAvahy, \\u017Ee ak existuje ve\\u013Ek\\u00FD po\\u010Det tipov, m\\u00E1 do vplyv na v\\u00FDkon aplik\\u00E1cie\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Prida\\u0165 kontakt\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadni \\u00FA\\u010Dastn\\u00EDci (z\\u00FA\\u010Dastnen\\u00E9 strany)\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u00DA\\u010Dastn\\u00EDci\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u00DA\\u010Dastn\\u00EDci ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampa\\u0148\r\n\r\n#XFLD: name of account/prospect\r\nNAME=N\\u00E1zov\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Z\\u00E1kazn\\u00EDk\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Hlavn\\u00FD kontakt\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Zodpovedn\\u00FD zamestnanec\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Ko\\u0161\\u00EDk produktov\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Produkt/kateg\\u00F3ria\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Jednotka\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Zobrazi\\u0165\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Partnersk\\u00E1 funkcia\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Prida\\u0165 viac produktov\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Ulo\\u017Ei\\u0165\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Zru\\u0161i\\u0165\r\n\r\n#XACT: search placeholder\r\nSEARCH=H\\u013Eada\\u0165\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Katal\\u00F3g produktov\r\n\r\n#XBUT: Add in dialogs\r\nADD=Prida\\u0165\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Z\\u00E1kazn\\u00EDk\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Prida\\u0165 z\\u00E1kazn\\u00EDka\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=H\\u013Eada\\u0165\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Koncov\\u00FD d\\u00E1tum nesmie by\\u0165 skor\\u0161\\u00ED ako po\\u010Diato\\u010Dn\\u00FD d\\u00E1tum\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Tip ulo\\u017Een\\u00FD\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Pozn\\u00E1mka ulo\\u017Een\\u00E1\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Nepodarilo sa ulo\\u017Ei\\u0165 tip\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne tipy\r\n\r\n#YMSG: error\r\nERROR=Chyba\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=H\\u013Eada\\u0165\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=H\\u013Eada\\u0165 \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=H\\u013Eada\\u0165 zamestnancov\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrovan\\u00E9 pod\\u013Ea\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Od\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Pre\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Zmenen\\u00E9\r\n\r\n#XBUT\r\nS3_EDIT=Upravi\\u0165\r\n\r\n#XBUT\r\nS3_NEGATIVE=Zamietnutie\r\n\r\n#XBUT\r\nS3_POSITIVE=Prija\\u0165\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Kateg\\u00F3ria produktu\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrovan\\u00E9 pod\\u013Ea\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=V\\u0161etky\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Nov\\u00E9\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Zoradi\\u0165 pod\\u013Ea\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Denn\\u00EDk zmien\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne produkty\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne pozn\\u00E1mky\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Na\\u010D\\u00EDtava sa...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne kontakty\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadni zamestnanci\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne zmeny\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Aktu\\u00E1lne nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadni \\u00FA\\u010Dastn\\u00EDci (z\\u00FA\\u010Dastnen\\u00E9 strany)\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Prida\\u0165 popis (maxim\\u00E1lne 40 znakov)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky kontaktov, ktor\\u00E9 boli priraden\\u00E9 tomuto z\\u00E1kazn\\u00EDkovi\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky z\\u00E1kazn\\u00EDkov alebo kontaktov\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Ak chcete zobrazi\\u0165 vizitku, musia by\\u0165 pre ur\\u010Dit\\u00E9ho z\\u00E1kazn\\u00EDka k dispoz\\u00EDcii detaily\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Ak chcete zobrazi\\u0165 vizitku, musia by\\u0165 pre ur\\u010Dit\\u00E9ho z\\u00E1kazn\\u00EDka k dispoz\\u00EDcii v\\u0161etky potrebn\\u00E9 detaily\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Z\\u00E1kazn\\u00EDk (vzostupne)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Z\\u00E1kazn\\u00EDk (zostupne)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Stav (vzostupne)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Stav (zostupne)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Koncov\\u00FD d\\u00E1tum (vzostupne)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Koncov\\u00FD d\\u00E1tum (zostupne)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Otvoren\\u00E1\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Zmenen\\u00E9\\: {0} z "Vyp." na "Zap."\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Zmenen\\u00E9\\: {0} zo "Zap." na "Vyp."\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Zmenen\\u00E9\\: {0} zo "\\u017Diadna hodnota" na  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Zmenen\\u00E9\\: "{0}" z "{1}" na "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Zadajte platn\\u00E9 hodnoty pre d\\u00E1tumy\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Mus\\u00EDte zada\\u0165 koncov\\u00FD d\\u00E1tum\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Pozn\\u00E1mka pridan\\u00E1\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Pozn\\u00E1mku sa nepodarilo vytvori\\u0165\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Ak chcete zobrazi\\u0165 vizitku, musia by\\u0165 pre ur\\u010Dit\\u00E9ho z\\u00E1kazn\\u00EDka k dispoz\\u00EDcii detaily\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Ak chcete zobrazi\\u0165 vizitku, musia by\\u0165 pre ur\\u010Dit\\u00E9ho z\\u00E1kazn\\u00EDka k dispoz\\u00EDcii v\\u0161etky potrebn\\u00E9 detaily\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky t\\u00FDch z\\u00E1kazn\\u00EDkov, ktor\\u00ED boli \\u0161pecifikovan\\u00ED ako hlavn\\u00E9 kontakty\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky z\\u00E1kazn\\u00EDkov alebo kontaktov\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Ste zodpovedn\\u00FD za {0} z {1} tipov. Zobrazia sa len va\\u0161e tipy.\r\n\r\n#XACT: Loading\r\nLOADING=Na\\u010D\\u00EDtava sa...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Tip ulo\\u017Een\\u00FD s chybami\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=Chcete akceptova\\u0165 tip "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=Chcete odmietnu\\u0165 tip "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Va\\u0161e rozhodnutie potvr\\u010Fte vybrat\\u00EDm pr\\u00EDslu\\u0161n\\u00E9ho tla\\u010Didla.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Vybra\\u0165 kontakt\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Prida\\u0165 \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Vybra\\u0165 zamestnanca\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=M\\u00F4\\u017Eete zobrazi\\u0165 len vizitky kontaktov, ktor\\u00E9 boli priraden\\u00E9 tomuto z\\u00E1kazn\\u00EDkovi\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Upozornenie\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=V\\u0161etky neulo\\u017Een\\u00E9 zmeny sa stratia. Naozaj chcete pokra\\u010Dova\\u0165?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Pokra\\u010Dova\\u0165\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Neboli n\\u00E1jden\\u00ED \\u017Eiadni \\u00FA\\u010Dastn\\u00EDci\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Pre tento typ \\u00FA\\u010Dastn\\u00EDka mus\\u00EDte vybra\\u0165 minim\\u00E1lne {0} \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Pre tento typ \\u00FA\\u010Dastn\\u00EDka mus\\u00EDte vybra\\u0165 maxim\\u00E1lne {0} \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Pre tento typ \\u00FA\\u010Dastn\\u00EDka sa vy\\u017Eaduje aspo\\u0148 {0} \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Pre tento typ \\u00FA\\u010Dastn\\u00EDka sa vy\\u017Eaduje aspo\\u0148 {0} \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Pre tento typ \\u00FA\\u010Dastn\\u00EDka mus\\u00EDte vybra\\u0165 minim\\u00E1lne {0} \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Pre tento typ \\u00FA\\u010Dastn\\u00EDka mus\\u00EDte vybra\\u0165 maxim\\u00E1lne {0} \\u00FA\\u010Dastn\\u00EDkov\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} u\\u017E bol pridan\\u00FD ako \\u00FA\\u010Dastn\\u00EDk s typom \\u00FA\\u010Dastn\\u00EDka {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=D\\u00E1ta zmenil in\\u00FD pou\\u017E\\u00EDvate\\u013E. Zvo\\u013Ete OK, aby sa na\\u010D\\u00EDtali najnov\\u0161ie d\\u00E1ta.\r\n',
	"cus/crm/lead/i18n/i18n_sl.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Potencialne stranke ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Potencialne stranke\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Potencialna stranka\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=ID potencialne stranke\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=Tip\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=Zaposleni\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Datum za\\u010Detka\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Datum konca\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Izvor\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=Prioriteta\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Kvalifikacija\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Status\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=Proizvod\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Koli\\u010Dina\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Informacije\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Zabele\\u017Eke\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Priloga\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Udele\\u017Eenci\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=Proizvodi trenutno niso na voljo\r\n\r\n#XBUT: edit button text\r\nEDIT=Obdelava\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Prikaz nastavitev\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Nastavitve\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=Maksimalno \\u0161tevilo potencialnih strank za prikaz\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*Upo\\u0161tevajte, da bo v primeru velikega \\u0161tevila potencialnih strank to vplivalo na aplikacijo\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=Dodajanje kontaktne osebe\r\n\r\n#XBUT: OK button text\r\nOK=OK\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Udele\\u017Eenci trenutno niso na voljo\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Udele\\u017Eenci\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Udele\\u017Eenci ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampanja\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Naziv\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=Stranka\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Glavna kontaktna oseba\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Odgovorni zaposleni\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=Ko\\u0161arica izdelkov\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=Proizvod/kategorija\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Enota\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=Prikaz\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Funkcija partnerja\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Dodajanje ve\\u010D proizvodov\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Shranjevanje\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=Prekinitev\r\n\r\n#XACT: search placeholder\r\nSEARCH=Iskanje\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=Katalog proizvodov\r\n\r\n#XBUT: Add in dialogs\r\nADD=Dodajanje\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=Stranka\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=Dodajanje stranke\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Iskanje\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Datum konca ne sme biti pred datumom za\\u010Detka\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Potencialna stranka shranjena\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Zabele\\u017Eka shranjena\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Shranjevanje potencialne stranke ni bilo mogo\\u010De\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=Potencialne stranke trenutno niso na voljo\r\n\r\n#YMSG: error\r\nERROR=Napaka\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=Kontakt\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Iskanje\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Iskanje udele\\u017Eencev\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=Iskanje zaposlenih\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtrirano po\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Od\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Do\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=Spremenjeno\r\n\r\n#XBUT\r\nS3_EDIT=Obdelava\r\n\r\n#XBUT\r\nS3_NEGATIVE=Zavrnitev\r\n\r\n#XBUT\r\nS3_POSITIVE=Sprejem\r\n\r\n#XTIT: Product Category\r\nCATEGORY=Kategorija proizvoda\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtrirano po\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=Vsi\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Novo\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=Razvr\\u0161\\u010Danje po\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=Zapisnik sprememb\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=Proizvodi trenutno niso na voljo\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=Zabele\\u017Eke trenutno niso na voljo\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Nalaganje ...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=Kontaktne osebe trenutno niso na voljo\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=Zaposleni trenutno niso na voljo\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=Spremembe trenutno niso na voljo\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Udele\\u017Eenci trenutno niso na voljo\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Dodajanje opisa (najve\\u010D 40 znakov)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Prika\\u017Eete lahko le vizitke kontaktnih oseb, ki so bile dodeljene tej stranki\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Prika\\u017Eete lahko samo vizitke ra\\u010Dunov ali kontaktnih oseb\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Za prikaz vizitke morajo biti na voljo detajli za dolo\\u010Deno stranko\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Za prikaz vizitke morajo biti na voljo vsi potrebni detajli za dolo\\u010Deno stranko\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=Stranka (nara\\u0161\\u010Dajo\\u010De)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=Stranka (padajo\\u010De)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Status (nara\\u0161\\u010Dajo\\u010De)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Status (padajo\\u010De)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Datum konca (nara\\u0161\\u010Dajo\\u010De)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Datum konca (padajo\\u010De)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=Odpiranje\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=Spremenjeno\\: {0} iz "Izklju\\u010Deno" v "Vklju\\u010Deno"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=Spremenjeno\\: {0} iz "Vklju\\u010Deno" v "Izklju\\u010Deno"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=Spremenjeno\\: {0} iz "Brez vrednosti" v  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=Spremenjeno\\: "{0}" iz "{1}" v "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Vnesite veljavne vrednosti za datume\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Vnesti morate datum konca\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Zabele\\u017Eka dodana\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Kreiranje zabele\\u017Eke ni bilo mogo\\u010De\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Za prikaz vizitke morajo biti na voljo detajli za dolo\\u010Deno stranko\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Za prikaz vizitke morajo biti na voljo vsi potrebni detajli za dolo\\u010Deno stranko\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Prika\\u017Eete lahko le vizitke strank, ki so bile dolo\\u010Dene kot glavne kontaktne osebe\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Prika\\u017Eete lahko samo vizitke ra\\u010Dunov ali kontaktnih oseb\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=Odgovorni ste za {0} od {1} potencialnih strank. Prikazane so samo va\\u0161e potencialne stranke.\r\n\r\n#XACT: Loading\r\nLOADING=Nalaganje ...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Potencialna stranka shranjena z napakami\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u017Delite sprejeti svojo potencialno stranko "{0}"?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u017Delite zavrniti svojo potencialno stranko "{0}"?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Izberite ustrezni gumb, da potrdite svojo odlo\\u010Ditev.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=Izbira kontakta\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Dodajanje udele\\u017Eencev\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=Izbira zaposlenega\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Prika\\u017Eete lahko le vizitke kontaktnih oseb, ki so bile dodeljene tej stranki\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Opozorilo\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Vse neshranjene spremembe bodo izgubljene. \\u017Delite res nadaljevati?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Naprej\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Udele\\u017Eenci niso najdeni\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Izbrati morate vsaj {0} udele\\u017Eencev za ta tip udele\\u017Eenca\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Izberete lahko najve\\u010D {0} udele\\u017Eencev za ta tip udele\\u017Eenca\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Vsaj {0} udele\\u017Eencev je potrebnih za ta tip udele\\u017Eenca\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Vsaj {0} udele\\u017Eencev je potrebnih za ta tip udele\\u017Eenca\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Izbrati morate vsaj {0} udele\\u017Eencev za ta tip udele\\u017Eenca\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Izberete lahko najve\\u010D {0} udele\\u017Eencev za ta tip udele\\u017Eenca\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} je \\u017Ee bil dodan kot udele\\u017Eenec s tipom udele\\u017Eenca {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Podatke je spremenil drug uporabnik. Izberite OK za priklic najnovej\\u0161ih podatkov.\r\n',
	"cus/crm/lead/i18n/i18n_tr.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=Aday m\\u00FC\\u015Fteriler ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=Aday m\\u00FC\\u015Fteriler\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=Aday m\\u00FC\\u015Fteri\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=Aday m\\u00FC\\u015Fteri tan\\u0131t\\u0131c\\u0131s\\u0131\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=T\\u00FCr\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u00C7al\\u0131\\u015Fan\r\n\r\n#XFLD: start date text\r\nSTART_DATE=Ba\\u015Flang\\u0131\\u00E7 tarihi\r\n\r\n#XFLD: closing date text\r\nEND_DATE=Biti\\u015F tarihi\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=Kaynak\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u00D6ncelik\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=Nitelik\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=Durum\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u00DCr\\u00FCn\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=Miktar\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=Bilgi\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=Notlar\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=Ek\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=Kat\\u0131l\\u0131mc\\u0131lar\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u015Eu anda \\u00FCr\\u00FCn mevcut de\\u011Fil\r\n\r\n#XBUT: edit button text\r\nEDIT=D\\u00FCzenle\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=Ayarlar\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=Ayarlar\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=G\\u00F6r\\u00FCnt\\u00FClenecek aday m\\u00FC\\u015Fterilerin azami say\\u0131s\\u0131\\:\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u00C7ok say\\u0131da aday m\\u00FC\\u015Fteri varsa uygulama performans\\u0131n\\u0131n etkilenece\\u011Fini unutmay\\u0131n\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u0130lgili ki\\u015Fi ekle\r\n\r\n#XBUT: OK button text\r\nOK=Tamam\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=Kat\\u0131l\\u0131mc\\u0131lar (ilgili taraflar) \\u015Fu anda mevcut de\\u011Fil\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=Kat\\u0131l\\u0131mc\\u0131lar\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=Kat\\u0131l\\u0131mc\\u0131lar ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=Kampanya\r\n\r\n#XFLD: name of account/prospect\r\nNAME=Ad\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=M\\u00FC\\u015Fteri\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=Ana ilgili ki\\u015Fi\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=Sorumlu \\u00E7al\\u0131\\u015Fan\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u00DCr\\u00FCn sepeti\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u00DCr\\u00FCn/kategori\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=Birim\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=G\\u00F6r\\u00FCnt\\u00FCle\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=Muhatap i\\u015Flevi\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=Daha fazla \\u00FCr\\u00FCn ekle\r\n\r\n#XBUT: save button in edit page \r\nSAVE=Kaydet\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u0130ptal\r\n\r\n#XACT: search placeholder\r\nSEARCH=Ara\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u00DCr\\u00FCn katalo\\u011Fu\r\n\r\n#XBUT: Add in dialogs\r\nADD=Ekle\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=M\\u00FC\\u015Fteri\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=M\\u00FC\\u015Fteri ekle\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=Ara\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=Biti\\u015F tarihi ba\\u015Flang\\u0131\\u00E7 tarihinden daha \\u00F6nce olamaz\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=Aday m\\u00FC\\u015Fteri kaydedildi\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=Not kaydedildi\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=Aday m\\u00FC\\u015Fteri kaydedilemedi\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u015Eu anda aday m\\u00FC\\u015Fteri mevcut de\\u011Fil\r\n\r\n#YMSG: error\r\nERROR=Hata\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u0130lgili ki\\u015Fi\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=Ara\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=Kat\\u0131l\\u0131mc\\u0131lar i\\u00E7in arama\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u00C7al\\u0131\\u015Fanlar i\\u00E7in arama\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=Ba\\u015Flang\\u0131\\u00E7\\:\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=Biti\\u015F\\:\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=De\\u011Fi\\u015Ftirildi\r\n\r\n#XBUT\r\nS3_EDIT=D\\u00FCzenle\r\n\r\n#XBUT\r\nS3_NEGATIVE=Reddet\r\n\r\n#XBUT\r\nS3_POSITIVE=Kabul et\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u00DCr\\u00FCn kategorisi\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=Filtreleme \\u00F6l\\u00E7\\u00FCt\\u00FC\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=T\\u00FCm\\u00FC\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=Yeni\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=S\\u0131ralama \\u00F6l\\u00E7\\u00FCt\\u00FC\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=De\\u011Fi\\u015Fiklikler g\\u00FCnl\\u00FC\\u011F\\u00FC\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u015Eu anda \\u00FCr\\u00FCn mevcut de\\u011Fil\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u015Eu anda not mevcut de\\u011Fil\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=Y\\u00FCkleniyor...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u015Eu anda ilgili ki\\u015Fi mevcut de\\u011Fil\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u00C7al\\u0131\\u015Fanlar \\u015Fu anda mevcut de\\u011Fil\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u015Eu anda de\\u011Fi\\u015Fiklikler mevcut de\\u011Fil\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=Kat\\u0131l\\u0131mc\\u0131lar (ilgili taraflar) \\u015Fu anda mevcut de\\u011Fil\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=Tan\\u0131m ekle (azami 40 karakter)\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=Yaln\\u0131z bu m\\u00FC\\u015Fteriye tayin etti\\u011Finiz ilgili ki\\u015Filerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=Yaln\\u0131z m\\u00FC\\u015Fterilerin veya ilgili ki\\u015Filerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=Kartviziti g\\u00F6r\\u00FCnt\\u00FClemek i\\u00E7in belirlenen m\\u00FC\\u015Fteriye ili\\u015Fkin ayr\\u0131nt\\u0131lar mevcut olmal\\u0131\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=Kartviziti g\\u00F6r\\u00FCnt\\u00FClemek i\\u00E7in belirlenen m\\u00FC\\u015Fteriye ili\\u015Fkin gerekli t\\u00FCm ayr\\u0131nt\\u0131lar mevcut olmal\\u0131\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=M\\u00FC\\u015Fteri (artan d\\u00FCzende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=M\\u00FC\\u015Fteri (azalan d\\u00FCzende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=Durum (artan d\\u00FCzende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=Durum (azalan d\\u00FCzende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=Biti\\u015F tarihi (artan d\\u00FCzende)\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=Biti\\u015F tarihi (azalan d\\u00FCzende)\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=A\\u00E7\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=De\\u011Fi\\u015Ftirildi\\: {0} "Kapal\\u0131" iken "A\\u00E7\\u0131k"\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=De\\u011Fi\\u015Ftirildi\\: {0} "A\\u00E7\\u0131k" iken "Kapal\\u0131"\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=De\\u011Fi\\u015Ftirildi\\: {0} "De\\u011Fer yok" iken  {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=De\\u011Fi\\u015Ftirildi\\: "{0}", "{1}" iken "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=Tarihler i\\u00E7in ge\\u00E7erli de\\u011Ferleri girin\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=Biti\\u015F tarihi girmelisiniz\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=Not eklendi\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=Not olu\\u015Fturulamad\\u0131\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=Kartviziti g\\u00F6r\\u00FCnt\\u00FClemek i\\u00E7in belirlenen m\\u00FC\\u015Fteriye ili\\u015Fkin ayr\\u0131nt\\u0131lar mevcut olmal\\u0131\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=Kartviziti g\\u00F6r\\u00FCnt\\u00FClemek i\\u00E7in belirlenen m\\u00FC\\u015Fteriye ili\\u015Fkin gerekli t\\u00FCm ayr\\u0131nt\\u0131lar mevcut olmal\\u0131\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=Yaln\\u0131z ana ilgili ki\\u015Filer olarak belirlenen m\\u00FC\\u015Fterilerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=Yaln\\u0131z m\\u00FC\\u015Fterilerin veya ilgili ki\\u015Filerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS={0} / {1} aday m\\u00FC\\u015Fteri i\\u00E7in sorumlusunuz. Yaln\\u0131z aday m\\u00FC\\u015Fterileriniz g\\u00F6r\\u00FCnt\\u00FCleniyor.\r\n\r\n#XACT: Loading\r\nLOADING=Y\\u00FCkleniyor...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=Aday m\\u00FC\\u015Fteri hatalarla kaydedildi\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT="{0}" aday m\\u00FC\\u015Fterisini kabul etmek istiyor musunuz?\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT="{0}" aday m\\u00FC\\u015Fterisini reddetmek istiyor musunuz?\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=Karar\\u0131n\\u0131z\\u0131 teyit etmek i\\u00E7in ilgili d\\u00FC\\u011Fmeyi se\\u00E7in.\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u0130lgili ki\\u015Fi se\\u00E7\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=Kat\\u0131l\\u0131mc\\u0131lar\\u0131 ekle\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u00C7al\\u0131\\u015Fan se\\u00E7\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=Yaln\\u0131z bu m\\u00FC\\u015Fteriye tayin etti\\u011Finiz ilgili ki\\u015Filerin kartvizitlerini g\\u00F6r\\u00FCnt\\u00FCleyebilirsiniz\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=Uyar\\u0131\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=Kaydedilmeyen de\\u011Fi\\u015Fiklikler kaybolacak. Devam etmek istedi\\u011Finizden emin misiniz?\r\n\r\n#XBUT: continue button\r\nCONTINUE=Devam\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=Kat\\u0131l\\u0131mc\\u0131 bulunamad\\u0131\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=Bu kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC i\\u00E7in asgari {0} kat\\u0131l\\u0131mc\\u0131 se\\u00E7melisiniz\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=Bu kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC i\\u00E7in yaln\\u0131zca azami {0} kat\\u0131l\\u0131mc\\u0131 se\\u00E7ebilirsiniz\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=Bu kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC i\\u00E7in en az {0} kat\\u0131l\\u0131mc\\u0131 gerekli\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=Bu kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC i\\u00E7in en az {0} kat\\u0131l\\u0131mc\\u0131 gerekli\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=Bu kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC i\\u00E7in asgari {0} kat\\u0131l\\u0131mc\\u0131 se\\u00E7melisiniz\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=Bu kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC i\\u00E7in yaln\\u0131zca azami {0} kat\\u0131l\\u0131mc\\u0131 se\\u00E7ebilirsiniz\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} zaten kat\\u0131l\\u0131mc\\u0131 olarak kat\\u0131l\\u0131mc\\u0131 t\\u00FCr\\u00FC ile eklendi {1}\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=Veriler ba\\u015Fka kullan\\u0131c\\u0131 taraf\\u0131ndan de\\u011Fi\\u015Ftirildi. En son verileri almak i\\u00E7in Tamam\'\\u0131 se\\u00E7in.\r\n',
	"cus/crm/lead/i18n/i18n_zh_CN.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u7EBF\\u7D22 ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u7EBF\\u7D22\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u7EBF\\u7D22\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u7EBF\\u7D22\\u6807\\u8BC6\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_TYPE=\\u7C7B\\u578B\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u5458\\u5DE5\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u6765\\u6E90\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u4F18\\u5148\\u7EA7\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u8D44\\u683C\\u5BA1\\u6838\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u72B6\\u6001\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u4EA7\\u54C1\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u6570\\u91CF\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u4FE1\\u606F\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u6CE8\\u91CA\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u9644\\u4EF6\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u53C2\\u4E0E\\u8005\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u4EA7\\u54C1\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u7F16\\u8F91\r\n\r\n#XBUT : show result\r\nSHOW_SETTING=\\u663E\\u793A\\u8BBE\\u7F6E\r\n\r\n#XBUT : list setting button text\r\nLIST_SETTING=\\u8BBE\\u7F6E\r\n\r\n#XTXT : Show instructions\r\nSHOW_INST=\\u8981\\u663E\\u793A\\u7684\\u6700\\u5927\\u7EBF\\u7D22\\u6570\\uFF1A\r\n\r\n#XTXT : Show notes\r\nSHOW_INS_NOTES=*\\u8BF7\\u6CE8\\u610F\\uFF0C\\u5982\\u679C\\u7EBF\\u7D22\\u6570\\u91CF\\u8F83\\u591A\\uFF0C\\u5E94\\u7528\\u7684\\u6027\\u80FD\\u4F1A\\u53D7\\u5230\\u5F71\\u54CD\r\n\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u6DFB\\u52A0\\u8054\\u7CFB\\u4EBA\r\n\r\n#XBUT: OK button text\r\nOK=\\u786E\\u5B9A\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u53C2\\u4E0E\\u8005\\uFF08\\u76F8\\u5173\\u65B9\\uFF09\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u53C2\\u4E0E\\u8005\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nPARTICIPANTS=\\u53C2\\u4E0E\\u8005 ({0})\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u8425\\u9500\\u6D3B\\u52A8\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u540D\\u79F0\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u5BA2\\u6237\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u4EA7\\u54C1\\u7BEE\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u4EA7\\u54C1/\\u7C7B\\u522B\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u5355\\u4F4D\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u67E5\\u770B\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u5408\\u4F5C\\u4F19\\u4F34\\u804C\\u80FD\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u6DFB\\u52A0\\u66F4\\u591A\\u4EA7\\u54C1\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u53D6\\u6D88\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u641C\\u7D22\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u4EA7\\u54C1\\u76EE\\u5F55\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u6DFB\\u52A0\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u5BA2\\u6237\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u6DFB\\u52A0\\u5BA2\\u6237\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u641C\\u7D22\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u7ED3\\u675F\\u65E5\\u671F\\u4E0D\\u5F97\\u65E9\\u4E8E\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=\\u5DF2\\u4FDD\\u5B58\\u7EBF\\u7D22\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u6CE8\\u91CA\\u5DF2\\u4FDD\\u5B58\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u65E0\\u6CD5\\u4FDD\\u5B58\\u7EBF\\u7D22\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u7EBF\\u7D22\r\n\r\n#YMSG: error\r\nERROR=\\u9519\\u8BEF\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u8054\\u7CFB\\u4EBA\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u641C\\u7D22\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u641C\\u7D22\\u53C2\\u4E0E\\u8005\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u641C\\u7D22\\u5458\\u5DE5\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u7B5B\\u9009\\u6761\\u4EF6\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u4ECE\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u81F3\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u5DF2\\u66F4\\u6539\r\n\r\n#XBUT\r\nS3_EDIT=\\u7F16\\u8F91\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u62D2\\u7EDD\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u63A5\\u53D7\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u4EA7\\u54C1\\u7C7B\\u522B\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u7B5B\\u9009\\u6761\\u4EF6\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u5168\\u90E8\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u65B0\\u5EFA\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u6392\\u5E8F\\u65B9\\u5F0F\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u4EA7\\u54C1\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u6CE8\\u91CA\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u8054\\u7CFB\\u4EBA\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u5458\\u5DE5\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u66F4\\u6539\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS1=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u53C2\\u4E0E\\u8005\\uFF08\\u76F8\\u5173\\u65B9\\uFF09\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u6DFB\\u52A0\\u63CF\\u8FF0\\uFF08\\u6700\\u591A 40 \\u4E2A\\u5B57\\u7B26\\uFF09\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u53EA\\u80FD\\u67E5\\u770B\\u5206\\u914D\\u7ED9\\u6B64\\u5BA2\\u6237\\u7684\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u53EA\\u80FD\\u67E5\\u770B\\u5BA2\\u6237\\u6216\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6709\\u53EF\\u7528\\u7684\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6240\\u6709\\u6240\\u9700\\u8BE6\\u7EC6\\u4FE1\\u606F\\u90FD\\u53EF\\u7528\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u5BA2\\u6237\\uFF08\\u5347\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u5BA2\\u6237\\uFF08\\u964D\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u72B6\\u6001\\uFF08\\u5347\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u72B6\\u6001\\uFF08\\u964D\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u7ED3\\u675F\\u65E5\\u671F\\uFF08\\u5347\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u7ED3\\u675F\\u65E5\\u671F\\uFF08\\u964D\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u5F85\\u5904\\u7406\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u5DF2\\u66F4\\u6539\\uFF1A{0} \\u7531\\u201C\\u5173\\u95ED\\u201D\\u53D8\\u4E3A\\u201C\\u5F00\\u542F\\u201D\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u5DF2\\u66F4\\u6539\\uFF1A{0} \\u7531\\u201C\\u5F00\\u542F\\u201D\\u53D8\\u4E3A\\u201C\\u5173\\u95ED\\u201D\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u5DF2\\u66F4\\u6539\\uFF1A{0} \\u7531\\u201C\\u65E0\\u503C\\u201D\\u53D8\\u4E3A {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u5DF2\\u66F4\\u6539\\uFF1A  "{0}" \\u7531 "{1}" \\u53D8\\u4E3A "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u65E5\\u671F\\u503C\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u60A8\\u5FC5\\u987B\\u8F93\\u5165\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u5DF2\\u6DFB\\u52A0\\u6CE8\\u91CA\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u65E0\\u6CD5\\u521B\\u5EFA\\u6CE8\\u91CA\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6709\\u53EF\\u7528\\u7684\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6240\\u6709\\u6240\\u9700\\u8BE6\\u7EC6\\u4FE1\\u606F\\u90FD\\u53EF\\u7528\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u53EA\\u80FD\\u67E5\\u770B\\u5DF2\\u6307\\u5B9A\\u4E3A\\u4E3B\\u8054\\u7CFB\\u4EBA\\u7684\\u5BA2\\u6237\\u7684\\u540D\\u7247\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u53EA\\u80FD\\u67E5\\u770B\\u5BA2\\u6237\\u6216\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u60A8\\u8D1F\\u8D23 {0} \\u4E2A\\u7EBF\\u7D22\\uFF08\\u5171 {1} \\u4E2A\\uFF09\\u3002 \\u4EC5\\u663E\\u793A\\u60A8\\u7684\\u7EBF\\u7D22\\u3002\r\n\r\n#XACT: Loading\r\nLOADING=\\u6B63\\u5728\\u52A0\\u8F7D...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=\\u5DF2\\u4FDD\\u5B58\\u7EBF\\u7D22\\uFF0C\\u4F46\\u6709\\u9519\\u8BEF\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u662F\\u5426\\u8981\\u63A5\\u53D7\\u7EBF\\u7D22 "{0}"\\uFF1F\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u662F\\u5426\\u8981\\u62D2\\u7EDD\\u7EBF\\u7D22 "{0}"\\uFF1F\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u9009\\u62E9\\u76F8\\u5173\\u6309\\u94AE\\u786E\\u8BA4\\u64CD\\u4F5C\\u3002\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u9009\\u62E9\\u8054\\u7CFB\\u4EBA\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u6DFB\\u52A0\\u53C2\\u4E0E\\u8005\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u9009\\u62E9\\u5458\\u5DE5\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u53EA\\u80FD\\u67E5\\u770B\\u5206\\u914D\\u7ED9\\u6B64\\u5BA2\\u6237\\u7684\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u8B66\\u544A\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u7EE7\\u7EED\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u672A\\u627E\\u5230\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u81F3\\u5C11\\u5FC5\\u987B\\u4E3A\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u9009\\u62E9 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u6700\\u591A\\u53EA\\u80FD\\u4E3A\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u9009\\u62E9 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS=\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u81F3\\u5C11\\u5FC5\\u987B\\u6709 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: enter further participants\r\nMUST_HAVE_PARTICIPANTS_1=\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u81F3\\u5C11\\u5FC5\\u987B\\u6709 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS_1=\\u81F3\\u5C11\\u5FC5\\u987B\\u4E3A\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u9009\\u62E9 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS_1=\\u6700\\u591A\\u53EA\\u80FD\\u4E3A\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u9009\\u62E9 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG:participant already exists\r\nPARTICIPANT_EXISTS={0} \\u5DF2\\u6DFB\\u52A0\\u4E3A {1} \\u7C7B\\u578B\\u7684\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: message that will be displayed in case of conflicting data during Lead editing\r\nMSG_CONFLICTING_DATA=\\u5176\\u4ED6\\u7528\\u6237\\u5DF2\\u66F4\\u6539\\u6570\\u636E\\u3002\\u8BF7\\u9009\\u62E9\\u201C\\u786E\\u5B9A\\u201D\\u83B7\\u53D6\\u6700\\u65B0\\u6570\\u636E\\u3002\r\n',
	"cus/crm/lead/i18n/i18n_zh_CN_.properties":'# GUID to be created with http://www.famkruithof.net/uuid/uuidgen\r\n\r\n# Note: This file was created according to the conventions that can be found at \r\n# https://wiki.wdf.sap.corp/wiki/display/LeanDI/Lean+DI+Translation+Process\r\n# https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=1445717842\r\n\r\n#XTIT: this is the title for the master section\r\nMASTER_TITLE=\\u7EBF\\u7D22 ({0})\r\n\r\n#XTIT: shell title\r\nSHELL_TITLE=\\u7EBF\\u7D22\r\n\r\n#XTIT: this is the title for the detail section\r\nDETAIL_TITLE=\\u7EBF\\u7D22\r\n\r\n#XTIT: this is the title for the detail section\r\nLEAD_ID=\\u7EBF\\u7D22\\u6807\\u8BC6\r\n\r\n#XTIT: title for Employee buissness card\r\nEMPLOYEE=\\u5458\\u5DE5\r\n\r\n#XFLD: start date text\r\nSTART_DATE=\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#XFLD: closing date text\r\nEND_DATE=\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#XFLD: origin dropdown text\r\nORIGIN=\\u6765\\u6E90\r\n\r\n#XFLD: priority dropdown text\r\nPRIORITY=\\u4F18\\u5148\\u7EA7\r\n\r\n#XFLD: qualification dropdown text\r\nQUALIFICATION=\\u8D44\\u683C\\u5BA1\\u6838\r\n\r\n#XFLD: status dropdown text\r\nSTATUS=\\u72B6\\u6001\r\n\r\n#XTIT,16: product tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nPRODUCT=\\u4EA7\\u54C1\r\n\r\n#XFLD: quantity in product basket\r\nQUANTITY=\\u6570\\u91CF\r\n\r\n#XTIT,16: Info tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nINFO=\\u4FE1\\u606F\r\n\r\n#XTIT,16: notes tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nNOTES=\\u6CE8\\u91CA\r\n\r\n#XTIT,16: attachment tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nATTACHMENT=\\u9644\\u4EF6\r\n\r\n#XTIT,16: team tab Text appears below tab icon on detail screen. Max. 14-16 characters (depending on character widths).\r\nTEAM=\\u53C2\\u4E0E\\u8005\r\n\r\n#XTOL: product basket is empty\r\nEMPTY_BASKET=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u4EA7\\u54C1\r\n\r\n#XBUT: edit button text\r\nEDIT=\\u7F16\\u8F91\r\n\r\n#XBUT: ADD Contact button text\r\nADDCONTACT=\\u6DFB\\u52A0\\u8054\\u7CFB\\u4EBA\r\n\r\n#XBUT: OK button text\r\nOK=\\u786E\\u5B9A\r\n\r\n#YMSG, 30:  no salesteam\r\nNOPARTIES=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u53C2\\u4E0E\\u8005\\uFF08\\u76F8\\u5173\\u65B9\\uFF09\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\nSALES_TEAM=\\u53C2\\u4E0E\\u8005\r\n\r\n#XTIT: this is the title for the SalesTeam Tab\r\n\r\n#XFLD: campaign label\r\nCAMPAIGN=\\u8425\\u9500\\u6D3B\\u52A8\r\n\r\n#XFLD: name of account/prospect\r\nNAME=\\u540D\\u79F0\r\n\r\n#XFLD: Customer label  \r\nCUSTOMER=\\u5BA2\\u6237\r\n\r\n#XFLD: main contact label\r\nMAIN_CONTACT=\\u4E3B\\u8981\\u8054\\u7CFB\\u4EBA\r\n\r\n#XFLD: Employee Responsible label\r\nEMPLOYEE_RESPONSIBLE=\\u8D1F\\u8D23\\u4EBA\r\n\r\n#XTIT: product basket title\r\nPRODUCT_BASKET=\\u4EA7\\u54C1\\u7BEE\r\n\r\n#XFLD: column in product basket\r\nPRODUCT_OR_CATEGORY=\\u4EA7\\u54C1/\\u7C7B\\u522B\r\n\r\n#XFLD: Unit column in product basket\r\nUNIT=\\u5355\\u4F4D\r\n\r\n#XFLD: View in info for Log of changes\r\nVIEW=\\u67E5\\u770B\r\n\r\n#XFLD: partner functon in sales team\r\nPARTNERFUNCTION=\\u5408\\u4F5C\\u4F19\\u4F34\\u804C\\u80FD\r\n\r\n#XBUT: add more products button of the product basket\r\nADD_MORE_PRODUCTS=\\u6DFB\\u52A0\\u66F4\\u591A\\u4EA7\\u54C1\r\n\r\n#XBUT: save button in edit page \r\nSAVE=\\u4FDD\\u5B58\r\n\r\n#XBUT: cancel button in dialog,edit\r\nCANCEL=\\u53D6\\u6D88\r\n\r\n#XACT: search placeholder\r\nSEARCH=\\u641C\\u7D22\r\n\r\n#XTIT: title for product dialog\r\nPRODUCT_CATALOG=\\u4EA7\\u54C1\\u76EE\\u5F55\r\n\r\n#XBUT: Add in dialogs\r\nADD=\\u6DFB\\u52A0\r\n\r\n#XFLD: Account Label in edit page\r\nACCOUNT=\\u5BA2\\u6237\r\n\r\n#XTIT: add account text\r\nADD_ACCOUNT=\\u6DFB\\u52A0\\u5BA2\\u6237\r\n\r\n#XACT: search accounts place holder\r\nSEARCH_ACCOUNTS=\\u641C\\u7D22\r\n\r\n#YMSG: date invalid message\r\nINVALID_DATE=\\u7ED3\\u675F\\u65E5\\u671F\\u4E0D\\u5F97\\u65E9\\u4E8E\\u5F00\\u59CB\\u65E5\\u671F\r\n\r\n#YMSG: lead saved\r\nLEAD_SAVED=\\u5DF2\\u4FDD\\u5B58\\u7EBF\\u7D22\r\n\r\n#YMSG: note saved\r\nNOTES_ADDED=\\u6CE8\\u91CA\\u5DF2\\u4FDD\\u5B58\r\n\r\n#YMSG: lead could not be saved\r\nSAVE_FAILED=\\u65E0\\u6CD5\\u4FDD\\u5B58\\u7EBF\\u7D22\r\n\r\n#YMSG: No Lead Found\r\nNO_LEAD_ERROR=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u7EBF\\u7D22\r\n\r\n#YMSG: error\r\nERROR=\\u9519\\u8BEF\r\n\r\n#XTIT: contact title for contact F4\r\nCONTACT=\\u8054\\u7CFB\\u4EBA\r\n\r\n#XACT: search contacts place holder\r\nSEARCH_CONTACTS=\\u641C\\u7D22\r\n\r\n#XACT: search participants place holder\r\nSEARCH_PARTICIPANTS=\\u641C\\u7D22\\u53C2\\u4E0E\\u8005\r\n\r\n#XACT: search employees place holder\r\nSEARCH_EMPLOYEE=\\u641C\\u7D22\\u5458\\u5DE5\r\n\r\n#XTOL: filtered by text in contact F4\r\nFILTER=\\u8FC7\\u6EE4\\u6761\\u4EF6\r\n\r\n#XFLD: Field "From" on View tab\r\nFROM=\\u4ECE\r\n\r\n#XFLD: Field "To" on View tab\r\nTO=\\u81F3\r\n\r\n#XFLD: Field "Changed" on View tab\r\nCHANGED=\\u5DF2\\u66F4\\u6539\r\n\r\n#XBUT\r\nS3_EDIT=\\u7F16\\u8F91\r\n\r\n#XBUT\r\nS3_NEGATIVE=\\u62D2\\u7EDD\r\n\r\n#XBUT\r\nS3_POSITIVE=\\u63A5\\u53D7\r\n\r\n#XTIT: Product Category\r\nCATEGORY=\\u4EA7\\u54C1\\u7C7B\\u522B\r\n\r\n#XTIT: Filter by in leads list\r\nFILTER_BY=\\u8FC7\\u6EE4\\u6761\\u4EF6\r\n\r\n#XLST: "All" filter by option in leads list footer\r\nALL=\\u5168\\u90E8\r\n\r\n#XLST: "New" filter by option in leads list footer\r\nNEW=\\u65B0\\u5EFA\r\n\r\n#XTIT: "Sort by" title for sorting in leads list footer\r\nSORT_BY=\\u6392\\u5E8F\\u65B9\\u5F0F\r\n\r\n#XTIT: Log of changes\r\nCHANGE_LOGS=\\u53D8\\u66F4\\u65E5\\u5FD7\r\n\r\n#XTOL: No products found\r\nNO_PRODUCTS=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u4EA7\\u54C1\r\n\r\n#XTOL: No notes found\r\nNO_NOTES=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u6CE8\\u91CA\r\n\r\n#XFLD,20: Loading text when loading/searching list\r\nLOADING_TEXT=\\u52A0\\u8F7D\\u4E2D...\r\n\r\n#XTOL: No contacts found\r\nNO_CONTACTS=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u8054\\u7CFB\\u4EBA\r\n\r\n#XTOL: No employees found\r\nNO_EMPLOYEE=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u5458\\u5DE5\r\n\r\n#XTOL: No log of changes found found\r\nNO_LOG=\\u5F53\\u524D\\u65E0\\u53EF\\u7528\\u66F4\\u6539\r\n\r\n#XTOL: No participants found\r\nNO_PARTICIPANTS=No participants are currently available\r\n\r\n#XACT: Maximum of 40 characters\r\nMAX_CHARS=\\u6DFB\\u52A0\\u63CF\\u8FF0\\uFF08\\u6700\\u591A 40 \\u4E2A\\u5B57\\u7B26\\uFF09\r\n\r\n#YMSG: contact not assigned to this account\r\nNOT_IN_MAIN_CONTACT=\\u53EA\\u80FD\\u67E5\\u770B\\u5206\\u914D\\u7ED9\\u6B64\\u5BA2\\u6237\\u7684\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#YMSG: not a contact or account\r\nNOT_CONTACT_OR_ACCOUNT=\\u53EA\\u80FD\\u67E5\\u770B\\u5BA2\\u6237\\u6216\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#YMSG: account is null\r\nACCOUNT_IS_NULL=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6709\\u53EF\\u7528\\u7684\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#YMSG: some info missing\r\nINFO_MISSING=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6240\\u6709\\u6240\\u9700\\u8BE6\\u7EC6\\u4FE1\\u606F\\u90FD\\u53EF\\u7528\r\n\r\n#XFLD, 30: Field in sorter\r\nAccountAscending=\\u5BA2\\u6237\\uFF08\\u5347\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nAccountDescending=\\u5BA2\\u6237\\uFF08\\u964D\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusAscending=\\u72B6\\u6001\\uFF08\\u5347\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nStatusDescending=\\u72B6\\u6001\\uFF08\\u964D\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateAscending=\\u7ED3\\u675F\\u65E5\\u671F\\uFF08\\u5347\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in sorter\r\nClosingDateDescending=\\u7ED3\\u675F\\u65E5\\u671F\\uFF08\\u964D\\u5E8F\\uFF09\r\n\r\n#XFLD, 30:  Field in filter\r\nOPEN=\\u672A\\u5904\\u7406\r\n\r\n#XFLD, 40: Field "Changed: [value] from off to on" on View tab\r\nVALUE_TURNED_ON=\\u5DF2\\u66F4\\u6539\\uFF1A{0} \\u7531\\u201C\\u5173\\u95ED\\u201D\\u53D8\\u4E3A\\u201C\\u5F00\\u542F\\u201D\r\n\r\n#XFLD, 40: Field "Changed: [value] from on to off" on View tab\r\nVALUE_TURNED_OFF=\\u5DF2\\u66F4\\u6539\\uFF1A{0} \\u7531\\u201C\\u5F00\\u542F\\u201D\\u53D8\\u4E3A\\u201C\\u5173\\u95ED\\u201D\r\n\r\n#XFLD, 40: Field "Changed: [value] from No value to [new value]" on View tab\r\nVALUE_CHANGED_FROM_NULL=\\u5DF2\\u66F4\\u6539\\uFF1A{0} \\u7531\\u201C\\u65E0\\u503C\\u201D\\u53D8\\u4E3A {1}\r\n\r\n#XFLD, 40: Field "Changed: [value] from [old value] to [new value]" on View tab\r\nVALUE_CHANGED_FROM=\\u5DF2\\u66F4\\u6539\\uFF1A  "{0}" \\u7531 "{1}" \\u53D8\\u4E3A "{2}"\r\n\r\n#YMSG: junk value entered for dates\r\nJUNK_DATE=\\u8F93\\u5165\\u6709\\u6548\\u7684\\u65E5\\u671F\\u503C\r\n\r\n#YMSG: you must enter end date\r\nEND_DATE_MANDATORY=\\u60A8\\u5FC5\\u987B\\u8F93\\u5165\\u7ED3\\u675F\\u65E5\\u671F\r\n\r\n#YMSG: note added sucessfully\r\nNOTE_ADDED=\\u5DF2\\u6DFB\\u52A0\\u6CE8\\u91CA\r\n\r\n#YMSG: note create failed\r\nCREATE_NOTE_FAILED=\\u65E0\\u6CD5\\u521B\\u5EFA\\u6CE8\\u91CA\r\n\r\n#YMSG: no details for account to view business card\r\nNO_ACCOUNT_DETAILS=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6709\\u53EF\\u7528\\u7684\\u8BE6\\u7EC6\\u4FE1\\u606F\r\n\r\n#YMSG: no required account details to view business card\r\nNO_REQUIRED_ACCOUNT_DETAILS=\\u8981\\u67E5\\u770B\\u540D\\u7247\\uFF0C\\u6307\\u5B9A\\u5BA2\\u6237\\u5FC5\\u987B\\u6240\\u6709\\u6240\\u9700\\u8BE6\\u7EC6\\u4FE1\\u606F\\u90FD\\u53EF\\u7528\r\n\r\n#YMSG: business card only for main contact\r\nBCARD_ONLY_FOR_MAIN_CONTACT=\\u53EA\\u80FD\\u67E5\\u770B\\u5DF2\\u6307\\u5B9A\\u4E3A\\u4E3B\\u8054\\u7CFB\\u4EBA\\u7684\\u5BA2\\u6237\\u7684\\u540D\\u7247\r\n\r\n#YMSG: business card only for account or contacts\r\nBCARD_ONLY_FOR_CONTACTS=\\u53EA\\u80FD\\u67E5\\u770B\\u5BA2\\u6237\\u6216\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#XFLD: Only your tasks are displayed \r\nLIST_FILTERED_BY_MYITEMS=\\u60A8\\u8D1F\\u8D23 {0} \\u4E2A\\u7EBF\\u7D22\\uFF08\\u5171 {1} \\u4E2A\\uFF09\\u3002 \\u4EC5\\u663E\\u793A\\u60A8\\u7684\\u7EBF\\u7D22\\u3002\r\n\r\n#XACT: Loading\r\nLOADING=\\u52A0\\u8F7D\\u4E2D...\r\n\r\n#YMSG: Lead saved with error\r\nPARTIAL_SAVE=\\u5DF2\\u4FDD\\u5B58\\u7EBF\\u7D22\\uFF0C\\u4F46\\u6709\\u9519\\u8BEF\r\n\r\n#YMSG: confirmation question for lead accept\r\nCONFIRM_LEAD_ACCEPT=\\u662F\\u5426\\u8981\\u63A5\\u53D7\\u7EBF\\u7D22 "{0}"\\uFF1F\r\n\r\n#YMSG: confirmation question for lead reject\r\nCONFIRM_LEAD_REJECT=\\u662F\\u5426\\u8981\\u62D2\\u7EDD\\u7EBF\\u7D22 "{0}"\\uFF1F\r\n\r\n#YMSG: Do you want to confirm your action\r\nCONFIRMATION_MESSAGE=\\u9009\\u62E9\\u76F8\\u5173\\u6309\\u94AE\\u786E\\u8BA4\\u64CD\\u4F5C\\u3002\r\n\r\n#XTIT: select contact\r\nSELECT_CONTACT=\\u9009\\u62E9\\u8054\\u7CFB\\u4EBA\r\n\r\n#XTIT: select participant\r\nADD_PARTICIPANTS=\\u6DFB\\u52A0\\u53C2\\u4E0E\\u8005\r\n\r\n#XTIT: select contact\r\nSELECT_EMPLOYEE=\\u9009\\u62E9\\u5458\\u5DE5\r\n\r\n#YMSG: contact not assigned to this account\r\nACCOUNT_IS_NULL_S3=\\u53EA\\u80FD\\u67E5\\u770B\\u5206\\u914D\\u7ED9\\u6B64\\u5BA2\\u6237\\u7684\\u8054\\u7CFB\\u4EBA\\u7684\\u540D\\u7247\r\n\r\n#XTIT: Warning title for data loss pop-up\r\nWARNING=\\u8B66\\u544A\r\n\r\n#YMSG: data loss message\r\nDATA_LOSS=\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u7EE7\\u7EED\\uFF1F\r\n\r\n#XBUT: continue button\r\nCONTINUE=\\u7EE7\\u7EED\r\n\r\n#YMSG: no participants\r\nNO_PARTICIPANTS=\\u672A\\u627E\\u5230\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: enter further participants\r\nTOO_FEW_PARTICIPANTS=\\u81F3\\u5C11\\u5FC5\\u987B\\u4E3A\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u9009\\u62E9 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n\r\n#YMSG: too many participants\r\nTOO_MANY_PARTICIPANTS=\\u6700\\u591A\\u53EA\\u80FD\\u4E3A\\u6B64\\u53C2\\u4E0E\\u8005\\u7C7B\\u578B\\u9009\\u62E9 {0} \\u4E2A\\u53C2\\u4E0E\\u8005\r\n',
	"cus/crm/lead/util/Util.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.lead.util.Util");

cus.crm.lead.util.Util ={
refreshHeaderETag : function(sPath,oController){
	 
	 var oModel = oController.oModel;
	 
	 if(oModel.getContext("/" + sPath)){
	        oModel.deleteCreatedEntry(oModel.getContext("/" + sPath));	 
	 }
	 	 oModel.createBindingContext("/"+ sPath,null,function(oContext){
			 
			 //dispatch the latest object to S3 view as well
			 var oData = oContext.getObject();
			 var oControllersModel = oController.getView().getModel("controllers");
			 var oS3Controller = oControllersModel.getProperty("/s3Controller");
			 
			 if(oS3Controller){
				 oS3Controller.bindS3Header(oData);
			 }
			 
		 },true);
	 },
	 
	 show412ErrorDialog : function(oController,fnOKCallback){
			sap.ca.ui.message.showMessageBox({
				type : sap.ca.ui.message.Type.ERROR,
				message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
			},fnOKCallback);
		},
		
		mPartnerDetermination : null,
		getPartnerFunctions : function(){
			return this.mPartnerDetermination;
		},
		
		
		aggregatePartnerFunctions : function(aFunctions){
			
			if(this.mPartnerDetermination === null){
				this.mPartnerDetermination = {};
			}
		     for(var i =0 ; i < aFunctions.length;i++){
		    	
		    	 if(!this.mPartnerDetermination[aFunctions[i].TransactionType]){
		    		 this.mPartnerDetermination[aFunctions[i].TransactionType] = [];
		    	 }
		    	 this.mPartnerDetermination[aFunctions[i].TransactionType].push(aFunctions[i]);
		     }
		},
		
		fetchPartnerFunctions : function(oModel){
			
			oModel.read("PartnerFunctions",null,null,false,function(oData,response){
				
				cus.crm.lead.util.Util.aggregatePartnerFunctions(oData.results);
				
			},function(oError){
				cus.crm.lead.util.Util.handleErrors(oError);
			});
		},
		
		handleErrors : function(oError)
		{
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			jQuery.sap.log.error(JSON.stringify(oError));
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message : oError.message,
				details: JSON.parse(oError.response.body).error.message.value
			},function(oResult){});
		},
	 
};
},
	"cus/crm/lead/util/formatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.lead.util.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

cus.crm.lead.util.formatter = {
		
		
		formatDate : function(dateObj)
		{
			if(dateObj){
				
		  		/*var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "dd-MMM-yyyy", style: "short"}); 
		  		var date = oDateFormat.format(dateObj);
		  		return date;*/
		  		var oLocale = sap.ui.getCore().getConfiguration().getLocale();
		  	    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({style:"medium"} ,oLocale); 
	            return oDateFormat.format(new Date(dateObj));
		  }
		  else
			  return dateObj;
		},
		
		

		
		mimeTypeFormatter : function(value) {

		       switch (value)
		       {
		              case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		              case 'application/vnd.ms-powerpoint':                  
		                     return 'pptx';
		                     break;
		              case 'application/msword':
		              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		                     return 'doc';
		                     break;
		              case 'application/vnd.ms-excel':
		              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		                     return 'xls';
		                     break;               
		              case 'image/jpeg':
		              case 'image/png':
		              case 'image/tiff':
		              case 'image/gif':          
		                     return 'jpg';
		                     break;
		              case 'application/pdf':    
		                     return 'pdf';
		                     break;
		              case 'text/plain':   
		                     return 'txt';
		                     break;
		              default:
		                     return 'unknown';    
		       }
		},
		

		formatDescription : function(sText,sDescription)
		{
			
			return sText + "  " + sDescription;
			
		},
		
		
		formatSearchPlaceHolder : function(sText)
		{
			return sText;
			
		},
		
		formatQuantityField : function(oValue)
		{
			
			if(oValue === null)
				return false;
			
			return true;
			
		},
		
		formatDeleteButton : function(oValue)
		{
			
			if(oValue === null)
				return false;
			
			return true;
			
		},
		formatProdClassification : function(oValue)
		{
			var oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
			if(oValue !== null)
				return oResourceBundle.getText('PRODUCT');
			else
				return oResourceBundle.getText('CATEGORY');
			
			
			
		},
		formatProductName : function(oValue)
		{
			
			if(oValue !== null)
				return this.getBindingContext('json').getObject().ProductName;
			return this.getBindingContext('json').getObject().ProductCategory;
			
		},
		formatProductNameJson : function(oValue)
		{
			
			if(oValue !== null)
				return this.getBindingContext('json').getObject().ProductName;
			return this.getBindingContext('json').getObject().ProductCategory;
			
		},
		formatProdClassificationJson : function(oValue)
		{
			var oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle();
			if(oValue !== null)
				return oResourceBundle.getText('PRODUCT');
			else
				return oResourceBundle.getText('CATEGORY');
			
			
			
		},
		PARTNERFUNCTION_Label : function(sText){
			
			return  " "+ " : " +"  " + sText;
		},
		
		//for change log
		formatChangeLog : function (value, value1, val3) {
	        // NLUN - CodeScan Changes - Global variable
	        var val;
	        if (value1 === "X") {
	        	val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_ON",[val3]);
	        }
	        else if ((value === "X")) {
	        	val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_TURNED_OFF",[val3]);
	        }
	        else{
	        	if(value1 === " "){
	        		val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM_NULL",[val3,value1]);
	        	}
	        	else{
	        		val=sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("VALUE_CHANGED_FROM",[val3, value, value1]);
	        	}
	        }
	        return val;

	    },
		
		showNavButton : function()
		{
			
			return sap.ca.scfld.md.app.Application.getImpl().bIsPhone;
			
		},
		formatUnit : function(oValue)
		{
			this.addStyleClass("UnitPadding");
			this.addStyleClass(".UnitPadding");
			return oValue;
			
			
			
		},
		
		formatQuantity : function (value, unit) {
			
			return sap.ca.ui.model.format.NumberFormat.getInstance().format(value)+" "+ unit;
	    	
	    },
	    formatCampaign : function(sCampaignId,sCampaignDescription)
	    {
	    	if(sCampaignDescription === "")
	    		return sCampaignId;
	    	
	    	return sCampaignDescription;
	    	
	    	
	    	
	    },
     formatAddMoreProductsText : function(sAddMoreProductsText){
	    	
	    	if(jQuery.device.is.phone)
	    		return "";
	    	
	    	return  sAddMoreProductsText;
	    	
	    },
	    
	    formatParticipantDelete : function(sPartnerFunctionCode){
	    	
	    	
	    	var s3Controller = this.getParent().getParent().data("controller");
	    	
	    	//check backend schema versioning - if it is less than 2.0 the visibility should be false
	    	if(parseFloat(s3Controller.sBackendVersion)   < 2)
	    		return false;
			
	    	var oPartnerFunctionRule = s3Controller.getRuleForPartnerFunction(sPartnerFunctionCode);
			
			if(oPartnerFunctionRule === null){
				return false;
			}
			
			/*if(!s3Controller.partnerFunctionMap.hasOwnProperty(sPartnerFunctionCode)){
			      s3Controller.partnerFunctionMap[sPartnerFunctionCode] = 1;	
			}
			else{
				
				  s3Controller.partnerFunctionMap[sPartnerFunctionCode]++;
			}
			
			if(!oPartnerFunctionRule.ChangeableFlag && s3Controller.partnerFunctionMap[sPartnerFunctionCode] >  oPartnerFunctionRule.CountHigh){
				
				return true;
			}
			
	        if(!oPartnerFunctionRule.ChangeableFlag && s3Controller.partnerFunctionMap[sPartnerFunctionCode] <=  oPartnerFunctionRule.CountHigh){
				
				return false;
			}*/
			
			 if(!oPartnerFunctionRule.ChangeableFlag){
				 return false;
			 }
			
			
			return true;
	    	
	    },
	    
	    formatEmployeeRespField : function(sBackendVersion){
	       	
	    	if(parseInt(sBackendVersion) < 2){
	    		return false;
	    	}
	    	
	    	return true;
	    },
	    formatPhotoUrl : function(mediaUrl) {
			return mediaUrl ? mediaUrl : "sap-icon://person-placeholder";
		},
		urlConverter : function(value) {

			var sapServer = jQuery.sap.getUriParameters().get("sap-server");
			var sapHost = jQuery.sap.getUriParameters().get("sap-host");
			var sapHostHttp = jQuery.sap.getUriParameters().get("sap-host-http");
			var sapClient = jQuery.sap.getUriParameters().get("sap-client");
			var oUriString;
								
			var oUri = URI(value);
			var sCurrentProtocol = location.protocol.replace(':','');
			if (sCurrentProtocol !== oUri.protocol()) {
					oUri.protocol(sCurrentProtocol);
			}
			if (sapServer) {
				oUri.addSearch('sap-server', sapServer);
			}
			if (sapHost) {
				oUri.addSearch('sap-host', sapHost);		
			}
			if (sapHostHttp) {
				oUri.addSearch('sap-host-http', sapHostHttp);
			}
			if (sapClient) {
				oUri.addSearch('sap-client', sapClient);		
			}
			oUriString = oUri.toString();
			if (oUriString == "") {
				value = value.replace("https", "http");
				return value;
			}
			else {
				return oUri.toString();
			}
				
		},
		
		formatBusinessCardCaller : function(sPartnerName){
			
		var s3Controller = this.getParent().getParent().getParent().data("controller");
	    var sPartnerFunctionCode = this.getBindingContext('json').getObject().PartnerFunctionCode;
			switch (sPartnerFunctionCode){
			case  '00000014' :
				                this.attachPress(s3Controller.onEmpBusCardLaunch,s3Controller);
		    break;
			case  '00000015' :
			case  '00000021' :	
			   this.attachPress(s3Controller.onEmployeeLaunch,s3Controller);
				break;
		    default : 
		    	this.attachPress(s3Controller.onAccountBusCardLaunch,s3Controller);
			}
			
			
		return sPartnerName;	
		}
	    
	    
		
		
		
		
};
},
	"cus/crm/lead/util/schema.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cus.crm.lead.util.schema");

cus.crm.lead.util.schema = {
		
		_getEntityAnnotation : function(oModel, sAnnotationName,
				sEntityName) {
			// retrieve the metadata of the passed OData model
			var oModelMetadata = oModel.getServiceMetadata();
			// check for proper metadata structure
			if ((oModelMetadata != null)
					&& (oModelMetadata.dataServices != null)
					&& (oModelMetadata.dataServices.schema != null)
					&& (oModelMetadata.dataServices.schema.length > 0)
					&& (oModelMetadata.dataServices.schema[0].entityType != null)) {
				// determine the annotation by name using the first
				// annotated entity
				var entityTypes = oModelMetadata.dataServices.schema[0].entityType;
				// loop the entities
				for ( var i = 0; i < entityTypes.length; i++) {
					if (sEntityName === entityTypes[i].name
							&& entityTypes[i].extensions != null)
						// loop the annotations of the the entity
						for ( var j = 0; j < entityTypes[i].extensions.length; j++) {
							if (entityTypes[i].extensions[j].name === sAnnotationName)
								return entityTypes[i].extensions[j].value;
						}

				}
			}
			return null;
		},

		_getServiceSchemaVersion : function(oModel, sEntityName) { 
			var version = this._getEntityAnnotation(oModel,
					"service-schema-version", sEntityName);
			// defaults to initial service schema version (1)
			return (version != null) ? version : "1";
		},

		_getServiceVersion : function(oModel, sEntityName) {
			var version = this._getEntityAnnotation(oModel,
					"service-version", sEntityName);
			// defaults to initial service version (1)
			return (version != null) ? parseInt(version) : 1;
		},
      
	
		
};
},
	"cus/crm/lead/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("cus.crm.lead.util.formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("cus.crm.lead.util.schema");
jQuery.sap.require("cus.crm.lead.util.Util");

sap.ca.scfld.md.controller.ScfldMasterController.extend("cus.crm.lead.view.S2", {
	
	numberOfLeads: 0,
	sPath : "",
	bAppLaunched : false,
	accountID: undefined, 
	bFilterOpen : false,

	onInit : function() {
		
		// execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.BaseMasterController.prototype.onInit.call(this);
		
		var view = this.getView();
		var self = this;
		
		//Get accountID query parameter
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var myComponent = sap.ui.component(sComponentId);
		this.oModel = this.byId('list').getModel();
	
		if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
			jQuery.sap.log.debug("startup parameters are " + JSON.stringify(myComponent.getComponentData().startupParameters));
			if (undefined != myComponent.getComponentData().startupParameters.accountID) {
				this.accountID = myComponent.getComponentData().startupParameters.accountID[0]; //this.accountID is the contextual filter from accounts app
			}
			else if(myComponent.getComponentData().startupParameters.leadID != null){
				this.leadID = myComponent.getComponentData().startupParameters.leadID[0];
			}
		}
		this.oResourceBundle = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle(); 
		var oList = this.getList();
		this.oShowSheet = sap.ui.xmlfragment(this
				.createId("showLeadFragment"),
				"cus.crm.lead.view.showMaxHit",
		
				this);
		
		this.oAppImpl = sap.ca.scfld.md.app.Application.getImpl();
		 this.oTemplate = oList.getItems()[0].clone();
		var afilters = this.getFilters(); //dynamic filters
		oList.bindAggregation("items" , {path:'/Leads' , template :this.oTemplate, filters:afilters });       
		var oModel = this.getView().getModel();
		oModel.bRefreshAfterChange = false;
		// register success handler
		var successHandler = function(oEvent) {
			
			if(this.accountID !== undefined)
			   {
				var oListBinding = this.getList().getBinding('items');
				if(oListBinding && oListBinding.getLength() > 0)
				   this.setAccountName();
				else
					this.accountID = undefined;
			   }
			
			var numberOfLeads = this.getList().getBinding('items').getLength();
			if (typeof cus.crm.myaccounts !== 'undefined' && typeof cus.crm.myaccounts.NavigationHelper !== 'undefined' 
			&& typeof cus.crm.myaccounts.NavigationHelper.qty !== 'undefined'){
				if (cus.crm.myaccounts.NavigationHelper.qty >  numberOfLeads && typeof this.accountID  !== 'undefined'){					
					sap.ca.ui.message.showMessageToast(this.oApplicationFacade.getResourceBundle().getText("LIST_FILTERED_BY_MYITEMS", [numberOfLeads,cus.crm.myaccounts.NavigationHelper.qty]));
				};
			//Not needed again. Clear the variable
			cus.crm.myaccounts.NavigationHelper.qty = undefined;
			};			
		};
		if(this.oModel)
	    	this.oModel.attachRequestCompleted(jQuery.proxy(successHandler, this));
		
		 this.oPopOverSort = this.byId('popoverSorter');
		 this.oPopOverFilter=this.byId('popoverFilter');
		
		 this.sFilterSelectedItemKey = "ALL";
		 this.sSortSelectedItemKey = "EndDate";
		 this.sBackendVersion = cus.crm.lead.util.schema._getServiceSchemaVersion(this.oModel,"Lead");
	 	},
	 	
	 	onBeforeRendering : function(){
	 		
	 		this.getView().getModel('controllers').getData().s2Controller = this;
	 	},

getFilters : function(){
    var filters = [];
      if (undefined != this.accountID){
          filters.push(new sap.ui.model.Filter("ProspectNumber", sap.ui.model.FilterOperator.EQ,  this.accountID ));  
      }
      if (undefined != this.leadID){
		  filters.push(new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ,  this.leadID ));
	  }
      
      return filters;
},  
showPopupforsort : function(oEvent) {
  this.oPopOverSort.setModel(oEvent.getSource().getModel());
  this.oPopOverSort.openBy(oEvent.getSource());
 
},

showPopupforfilter : function(oEvent){
  this.oPopOverFilter.setModel(oEvent.getSource().getModel());
  this.oPopOverFilter.openBy(oEvent.getSource());
},
handleErrors : function(oError) {
	sap.ca.ui.utils.busydialog.releaseBusyDialog();
	jQuery.sap.log.error(JSON.stringify(oError));
	sap.ca.ui.message
			.showMessageBox(
					{
						type : sap.ca.ui.message.Type.ERROR,
						message : oError.message,
						details : JSON
								.parse(oError.response.body).error.message.value
					}, function(oResult) {
						
					});

},
onShow : function(oEvent) {
	var that=this;
	var oModel = this.getView().getModel();
	 var maxHitData;
	 // RetrieveMaxHit offline 
	oModel.read((parseFloat(this.sBackendVersion) >= 4) ? "RetrieveMaxHitSet" : "RetrieveMaxHit",null,null,false,function(oData,resp) 
	{ 
		maxHitData = {
				  RetrieveMaxHit : ((parseFloat(that.sBackendVersion) >= 4) ? oData.results[0] : resp.data.RetrieveMaxHit)
	    };
		
        
	});
	this.oldValue = maxHitData.RetrieveMaxHit.MaxHitNumber;
	
	this.oShowSheet.setModel(this.getView().getModel(
	"i18n"), "i18n");
	var jsonModel = new sap.ui.model.json.JSONModel();
	jsonModel.setData(maxHitData);
    this.oShowSheet.setModel(jsonModel,"showJson");
	
	this.oShowSheet.open();
	
	
},


closeShow :function(oEvent) {

	this.oShowSheet.close();	
},

saveMaxHit :function(oEvent){


var oModel = this.getView().getModel();
	var value=this.oShowSheet.getContent()[1].getValue();

if(value != this.oldValue)
	
	
	oModel.create("UpdateMaxHit", null,
			{
			success : 
			        jQuery.proxy(function() {
			        
			           
			        this.oModel.bRefreshAfterChange = false; 
			        this.oModel.refresh();
			           
			                },this),
			error :                  
			      jQuery.proxy(function(oError) {
			                this.handleErrors(oError);
			               
			                this.oModel.bRefreshAfterChange = false;
			                    },this),
			async : true,
			urlParameters : ["MaxHitNumber='" + value + "'"]
			}
			);

	
this.oShowSheet.close();
},



getHeaderFooterOptions : function() {
  var that = this;
  var self = this.getView();
  var oListItems = this.getList().getItems();
  var numberOfLeads = 0;
  if(this.getList().getBinding('items'))
     numberOfLeads = this.getList().getBinding('items').getLength();
  var oHeaderFooterOptions= {
    onBack : jQuery.proxy(this.onBack,this),
    sI18NMasterTitle : this.oApplicationFacade.getResourceBundle().getText("MASTER_TITLE",numberOfLeads),
    oSortOptions : {
      sSelectedItemKey : this.sSortSelectedItemKey,
      aSortItems : [  {
          text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ClosingDateAscending'),
          key : "EndDate"
   },{
       text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ClosingDateDescending'),
       key : "EndDate2"
 },{
            text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('AccountAscending'),
            key : "ProspectName"
     },
      {
          text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('AccountDescending'),
          key : "ProspectName2"
   }, {
            text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('StatusAscending'),
            key : "UserStatusText"
     },
     {
         text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('StatusDescending'),
         key : "UserStatusText2"
  }
   ],               //sSelectedItemKey : " ",
                  onSortSelected : function(key) {
                    
                    that.applySort(key);
                    that.sSortSelectedItemKey = key;
                    
                  } 
            },
              
            oFilterOptions : {
              sSelectedItemKey : this.sFilterSelectedItemKey,
              aFilterItems : [{
            	  text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ALL'),
                  key : "ALL"
             }, {
            	 text : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('OPEN'),
                 key : "I1002"
                    
             }],
            
          	onFilterSelected : jQuery.proxy(function(sKey) {
              var aFilters = [];
              this.sFilterSelectedItemKey = sKey;
              this.getList().setNoDataText(this.oResourceBundle.getText('LOADING'));
              aFilters = this.getFilters();
              var searchPattern = this._oControlStore.oMasterSearchField.getValue();
              
              if(searchPattern && searchPattern.length > 0)
                aFilters.push(new sap.ui.model.Filter("Description","EQ",searchPattern));
              if(sKey === "I1002"){
        		  aFilters.push(new sap.ui.model.Filter("UserStatusText","EQ","I1002"));
        		  this.bFilterOpen = true;
        	  }
        	  else
        		  this.bFilterOpen = false;
              var oBinding = this.getList().getBinding('items');
              oBinding.aApplicationFilters = [aFilters];
              //oBinding.filter(aFilters);
              this.oAppImpl.oMHFHelper.refreshList(this);
        
       },this)
             

   },
   aAdditionalSettingButtons : [{
		sI18nBtnTxt:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LIST_SETTING'),
		sId : "BTN_SHOW",
		sIcon : "sap-icon://settings",
		onBtnPressed : function(sKey) {
			jQuery.proxy(that.onShow(sKey), this);
		}
		},
		]
  };
  /**
   * @ControllerHook extHookGetHeaderFooterOptions is the
   *                 controller hook where the
   *                 headerFooterOptions can be extended.
   *                 Attributes like master list title,
   *                 filters can be defined in addition to
   *                 the existing headerFooterOptions
   * 
   * @callback sap.ca.scfld.md.controller.BaseMasterController~extHookGetHeaderFooterOptions
   * @param {object}
   *            oHeaderFooterOptions
   * @return {void}*/
  if(this.extHookGetHeaderFooterOptions){
   this.extHookGetHeaderFooterOptions(oHeaderFooterOptions);
  }
	return oHeaderFooterOptions;
},	

  applySort : function(key){
    if (key==="ProspectName2" || key==="UserStatusText2" || key==="EndDate2"){
      if (key==="ProspectName2"){
      key = "ProspectName";
      }
      else if (key==="UserStatusText2"){
      key = "UserStatusText";
      }
      else
        key = "EndDate";
      var oSorter = new sap.ui.model.Sorter(key,true, false);
    }
    else
    var oSorter = new sap.ui.model.Sorter(key,false, false);
  

this.getView().byId('list').getBinding("items").aSorters = [];
this.getView().byId('list').getBinding("items").aSorters = [ oSorter ];
this.getView().byId('list').getBinding("items")
    .sort(oSorter);
 
},



onSort : function(oEvent){
  this.oPopOverSort.setModel(oEvent.getSource().getModel());
  this.oPopOverSort.openBy(oEvent.getSource());
},

onFilter : function(oEvent){
  this.oPopOverFilter.setModel(oEvent.getSource().getModel());
  this.oPopOverFilter.openBy(oEvent.getSource());
},

  /**
   * @override
   *
   * @param oItem
   * @param sFilterPattern
   * @returns {*}
   */
   /**
   * @override
   */  
 isBackendSearch : function(){
  // sap.ca.scfld.md.controller.BaseMasterController.prototype.applyBackendSearchPattern.call(this);
   return true;
 },

  applyBackendSearchPattern :function(sFilterPattern,oBinding){
	  this.getList().setNoDataText(this.oResourceBundle.getText('LOADING'));
    var aFilters = [];
    aFilters = this.getFilters();
    oBinding.aApplicationFilters = [];
    if(this.bFilterOpen)
      aFilters.push(new sap.ui.model.Filter("UserStatusText",sap.ui.model.FilterOperator.EQ,"I1002"));
    
    if(sFilterPattern && sFilterPattern.length > 0)
      aFilters.push(new sap.ui.model.Filter("Description",sap.ui.model.FilterOperator.Contains,sFilterPattern));
   // if(sFilterPattern!=""){
    oBinding.aApplicationFilters = [];   
		oBinding.filter(aFilters);
		
//    }
    
    	
 
 
},
 

applyFilterPatternToListItem : function(oItems,sFilterPattern){
 // oItem.getBindingContext().getProperty();
  var aListItems = this.getList().getItems();
  if (sFilterPattern.toUpperCase() == "ALL")
    {
    for(var i =0;i<aListItems.length;i++){
      aListItems[i].setVisible(true);
    }
   // sap.ca.scfld.md.controller.BaseMasterController.prototype.setListItem.call(aListItems[0]);
    this.setListItem(aListItems[0]);
    }
  
  
  
    else{
    	var  counter;
      for(var i =0;i<aListItems.length;i++){
           var visibility = this.searchFilterPattern(aListItems[i], sFilterPattern) ;
           if (visibility == true){
              counter = i;
           }
           aListItems[i].setVisible(visibility);
    }
      this.setListItem(aListItems[counter]);
      //sap.ca.scfld.md.controller.BaseMasterController.prototype.setListItem.call(aListItems[counter]);
  }
  
  //sap.ca.scfld.md.controller.BaseMasterController.prototype.setListItem.call(aListItems);
},

	/**
	 * Overrrides scaffolding setListItem
	 */
	setListItem : function(oItem){
		if(!this.bAppLaunched){
			this.prevItem = oItem;
			
		}
	    
			this.oItem = oItem;
		this.getList().removeSelections();
		if(this.prevItem)
		  this.getList().setSelectedItem(this.prevItem);
		
	   var currentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
	   var editController = this.getView().getModel('controllers').getData().s4Controller;
	   if(this.bAppLaunched && currentDetailPage && editController && (editController.getView() === currentDetailPage))
		   {
		    //we are in the edit page 
		    var s4Controller = this.getS4Controller();
		     if(s4Controller && s4Controller.pageNeedsUpdate())
		    	 {
		    	 sap.ca.ui.dialog.confirmation.open({
		 			question :this.oResourceBundle.getText('DATA_LOSS'),
		 			title : this.oResourceBundle.getText('WARNING'),
		 			confirmButtonLabel : this.oResourceBundle.getText('CONTINUE')  	
		 			
		 		},jQuery.proxy(this.datalossDismissed,this));
		 			
		 		 return;
		    	 }
		   }
		
	   this.goToDetailPage(oItem);
	   
	},
	goToDetailPage : function(oItem){

		if(oItem === undefined)
			return;
		
		this.prevItem = oItem;
		   var oList=this.getList();
		      oList.removeSelections();
		      oItem.setSelected(true);
		      oList.setSelectedItem(oItem,true);
		      this.sPath = oItem.getBindingContext().sPath;
		      if(this.bAppLaunched && this.getS3Controller())
		         this.oRouter.attachRouteMatched(this.getS3Controller().routeMatched,this.getS3Controller());
		      this.oRouter.navTo("detail", {
		        contextPath : oItem.getBindingContext().sPath.substr(1)
		      }, !jQuery.device.is.phone);
		
		
		
	},
	datalossDismissed : function(oResult){
		var s4Controller = this.getS4Controller();
    	
    	this.getList().getModel().clearBatch();
    	if(oResult.isConfirmed === false){
    		if(this.prevItem)
    		  this.getList().setSelectedItem(this.prevItem);
    		return;
    	}
    		
    	if(s4Controller)
    		s4Controller.deleteBuffer = [];
    	this.goToDetailPage(this.oItem);
		
		
	},
	
	
searchFilterPattern : function(oItem, sFilterPattern) {
 
  
  var oIteshellata = oItem.getBindingContext().getProperty();
  if (oIteshellata.SystemStatusCode.toUpperCase() == sFilterPattern.toUpperCase())
      {
        return true;
      }
  else
     return false;
},

applySortPatternToListItem : function(sSortPattern){
  
   var aListItems = this.getList().getItems();
   if (sSortPattern == "Status")
     {
     for(var i=0;i<aListItems.length;i++)
     {
       for(var j=0;j<aListItems.length-i-1;j++)
        {
           if(aListItems[j].getBindingContext().getProperty().UserStatusText<aListItems[j+1].getBindingContext().getProperty().UserStatusText)
               {
                   var tmp = aListItems[j];
                   aListItems[j] = aListItems[j+1];
                   aListItems[j+1] = tmp;
                   
               }
        }
     }
     for(var i=0;i<aListItems.length;i++)
       {
         this.getList().addItem(aListItems[i]);
       }  
     
     this.setListItem(aListItems[0]);
         }
   else if (sSortPattern == "Account")
           {
        for(var i=0;i<aListItems.length;i++)
     {
       for(var j=0;j<aListItems.length-i-1;j++)
        {
           if(aListItems[j].getBindingContext().getProperty().ProspectName.toString()<aListItems[j+1].getBindingContext().getProperty().ProspectName.toString())
               {
                   var tmp = aListItems[j];
                   aListItems[j] = aListItems[j+1];
                   aListItems[j+1] = tmp;
                   
               }
        }
     }
     for(var i=0;i<aListItems.length;i++)
       {
         this.getList().addItem(aListItems[i]);
       }  
     this.setListItem(aListItems[0]);
           }
   
   else if (sSortPattern == "Closing Date")
     {
      for(var i=0;i<aListItems.length;i++)
     {
       for(var j=0;j<aListItems.length-i-1;j++)
        {
           if(aListItems[j].getBindingContext().getProperty().EndDate<aListItems[j+1].getBindingContext().getProperty().EndDate)
               {
                   var tmp = aListItems[j];
                   aListItems[j] = aListItems[j+1];
                   aListItems[j+1] = tmp;
                   
               }
        }
     }
     for(var i=0;i<aListItems.length;i++)
       {
         this.getList().addItem(aListItems[i]);
       }  
     
     this.setListItem(aListItems[0]);
     
   }
    
 },
sortbyGroup : function(oEvent) {
  var item = oEvent.getParameters().listItem;
 if (item.getTitle() == "Closing Date") {
      /*var sSortPattern = item.getTitle();
      this.applySortPatternToListItem(sSortPattern);*/
      this.sortClosingDate();
  }
  else if (item.getTitle()== "Status"){
    this.sortStatus();
  }
  else if (item.getTitle()== "Account"){
    this.sortAccount();
  }
  
},

sortClosingDate : function() {
  this.applySort("Closing Date");
},

sortStatus : function() {
  this.applySort("Status");
},

sortAccount : function() {
  this.applySort("Account");
},

groupItems : function(contact) {
  // if we are grouping by customer name, then use the full customer name, otherwise group by first letter
  return this.currentSort.sPath==="CustomerName" ? contact.getProperty("CustomerName") : contact.getProperty(this.currentSort.sPath).charAt(0);
},
leadRejected : function()
{
    var s3Controller = this.getView().getModel('controllers').getData().s3Controller;
    if(s3Controller && s3Controller.bRejectLead)
    	{
    	    var items = this.byId('list').getItems();
    	    if(items.length > 0){
    	    	this.setListItem(items[0]);
    	    	s3Controller.bRejectLead = false;
    	    }
    	    else if(s3Controller.nLeads === 1){
    	    	  this.oRouter.navTo("noData", {viewTitle:"DETAIL_TITLE", languageKey:"NO_ITEMS_AVAILABLE"});
    	    	  s3Controller.bRejectLead = false;  
    	    }
    	}
    if(s3Controller && s3Controller.bRejectLead == false)
      this.byId('list').getBinding('items').detachChange(this.leadRejected,this);

},
leadAccepted : function()
{
    var s3Controller = this.getView().getModel('controllers').getData().s3Controller;
    if(s3Controller && s3Controller.bAcceptLead)
    	{
    	    var items = this.byId('list').getItems();
    	    if(items.length > 0)
    	    	{
    	    	var oModel = this.byId('list').getModel();
    	    	 var sPath = "/" + "Leads(guid'" + s3Controller.sHeaderGuid + "')";
    	    	 var context  = this.byId('list').getModel().getContext(sPath);
    	    	 var i;
    	    	 s3Controller.byId('info').getModel('json').setData(JSON.parse(JSON.stringify(oModel.getData(sPath))));
    	    	}
    	    	
    	       	
    	}
    if(s3Controller && s3Controller.bAcceptLead == false)
      this.byId('list').getBinding('items').detachChange(this.leadAccepted,this);

},
editSaved : function()
{
	var i;
	var detailPages;
	
     	var s4Controller = this.getView().getModel('controllers').getData().s4Controller;
     	
     	if(s4Controller.bNavOnUpdate === true)
     		{
     	
     	
     	var sPath = "/" + "Leads(guid'" + s4Controller.headerGuid + "')";	        	
     	var oModel = this.byId('list').getModel();
     	var context = oModel.getContext(sPath);	        	
     	var items = this.byId('list').getItems();
     	
     	for(i=0;i<items.length;i++){
     		
     		if(context === items[i].getBindingContext()) {
     			items[i].setSelected(true);
     		//	this.byId('list').setSelectedItem(items[i],true);
     			if(jQuery.device.is.phone)
     		    	this.setListItem(items[i]);
     			s4Controller.bNavOnUpdate = false;
     			
     		}
     	
     }
     		}
      if(s4Controller.bNavOnUpdate === false)
    	   this.byId('list').getBinding('items').detachChange(this.editSaved,this);


},
getS3Controller : function()
{
	return this.getView().getModel('controllers').getData().s3Controller;
},
getS4Controller : function()
{
	return this.getView().getModel('controllers').getData().s4Controller;
},

onDataLoaded : function()
{
if(!this.bAppLaunched){	
	//attaching leadsRefreshed as callback whenever the list gets refreshed,filtered,searched
	 this.getList().getBinding('items').attachChange(this.leadsRefreshed,this); 
	 
	 //selectDetail selects ths first element of the list if any, shows empty view otherwise - only on app launch
	 //this._selectDetail();
	 
	 //app has launched  - all one time operations are prevented from further execution with an if check upon this attribute
	 this.bAppLaunched = true;
}
 


},

leadsRefreshed : function()
{
 //get s3Controller - for accept/reject lead scenarios 	
  var s3Controller = this.getS3Controller();
	if(s3Controller !== null)
		{
		
		   // get the data from s2 view and bind it to the s3 view - instead of fetching separately for the s3 view again
		   //for accept lead scenario
		   if(s3Controller.bAcceptLead === true)
			   {
			           var sPath = "/" + s3Controller.sPath;
			            var data = JSON.parse(JSON.stringify(this.oModel.getContext(sPath).getObject()));
			           s3Controller.byId('info').getModel('json').setData(data);
			           s3Controller.bAcceptLead = false;
			   }
		   //for reject lead scenario
		   if(s3Controller.bRejectLead === true)
			   {
			      if(this.getList().getItems().length > 0){
		    	   this.setListItem(this.getList().getItems()[0]);
		           s3Controller.bRejectLead = false; 
			      }
			   }
		
		}
	
	 //if there are no items found - either by filtering/searching - display the no data text for the list
     if(this.getList().getBinding('items').getLength() === 0){
    	 this.getList().setNoDataText(this.oResourceBundle.getText('NO_LEAD_ERROR'));
    	 
    	 //navigate to empty view only on contextual filter - accountID    	 
    	 if(this.accountID !== undefined)
    		 this.navToEmptyView();
    	 
    	 
     }
     else
    	 {
    	 //checking the possibility of a selected list item with an empty detail page - changing to detail page if so
    	 var item = this.getList().getSelectedItem();
    	 if(item && this.getSplitContainer().getCurrentDetailPage().sViewName === "sap.ca.scfld.md.view.empty")
    		 {
    		     if(!jQuery.device.is.phone && this.getS3Controller())
    		    	 this.oRouter.attachRouteMatched(this.getS3Controller().routeMatched,this.getS3Controller());
    		     this.oRouter.navTo("detail",{contextPath : item.getBindingContext().sPath.substr(1)},!jQuery.device.is.phone);
    		 
    		 }
           	 
    	 }


},
navToEmptyView : function() {
    
	//happens only when there is no data to display from the backend, and an empty result returned on a contextual filter/search
	
	 if(this.s4Controller)
 	{
 	    if(this.s4Controller.bNavOnUpdate && (this.s4Controller.bHeaderUpdateSuccess || 
 	    		this.s4Controller.bContactUpdateSuccess || this.s4Controller.bUserUpdateSuccess))
 	      {
 	    	this.s4Controller.bNavOnUpdate = false;
 	    	this.bHeaderUpdateSuccess = this.bStatusUpdateSuccess = this.bContactUpdateSuccess = false;
 	    	
 	      }
 	
 	return;
 	}
    this.getList().setNoDataText(this.oResourceBundle.getText('NO_LEAD_ERROR'));
    this.oRouter.navTo("noData");
			},
			
closeToolbar : function(oEvent){
				
				var aFilters = [];
				this.byId('toolbarAccountInfo').setVisible(false);
				this.accountID = undefined;
				this.getList().getBinding('items').aApplicationFilters = [];
				aFilters = this.getFilters();
				
				if(this.bFilterOpen)
					aFilters.push(new sap.ui.model.Filter("UserStatusText","EQ","I1002"));
				
				var searchPattern = this._oControlStore.oMasterSearchField.getValue();
			    if(searchPattern && searchPattern.length > 0)
			      aFilters.push(new sap.ui.model.Filter("Description","EQ",searchPattern));
				
				this.getList().getBinding('items').aApplicationFilters = aFilters;
				this.oAppImpl.oMHFHelper.refreshList(this);
			},

setAccountName : function(){
					this.byId('toolbarAccountInfo').setVisible(true);   
					this.byId('labelAccountInfo').setText(this.oResourceBundle.getText('FILTER_BY') + " " + this.getList().getItems()[0].getBindingContext().getObject().ProspectName);	
				
			},
applyFilterFromContext : function(sContext){
		//to allow bookmarking for growing list		
	          // if(!jQuery.device.is.phone)
	           this.sContext = sContext;
	    
	           var list = this.getList();
	   		if(list.attachUpdateFinished){
	   	       list.attachUpdateFinished(null,this.onGrowingFinished,this);
	   		}
	             if(this.getS3Controller())
	        	   this.oRouter.attachRouteMatched(this.getS3Controller().routeMatched,this.getS3Controller());
				this.oRouter.navTo("detail",{contextPath : sContext.substr(1)},!jQuery.device.is.phone);
			},
			
			onBack : function(oEvent){
				var currentDetailPage = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getCurrentDetailPage();
				var editController = this.getView().getModel('controllers').getData().s4Controller;
				
				if(currentDetailPage && editController && (editController.getView() === currentDetailPage)){
					 if(editController.pageNeedsUpdate())
			    	 {
						 this.getList().getModel().clearBatch();	 
			    	 sap.ca.ui.dialog.confirmation.open({
			    		 	question :sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('DATA_LOSS'),
							title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('WARNING'),
							confirmButtonLabel : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTINUE')  	
			 			
			 		},jQuery.proxy(this.dataLossForExit,this));
			 			
			 		 return;
			    	 }
				}
				window.history.back(1);
			},
			
			dataLossForExit : function(oResult){
				if(oResult.isConfirmed === true){
				       window.history.back(1);
			}
			
			},
			onGrowingFinished : function(oEvent){
				if(this.sContext){
					var list = this.getList();
					var items = list.getItems();
					for(var i = 0; i < items.length; i++){
						if(this.sContext === items[i].getBindingContextPath()){
							items[i].setSelected(true);
							this.sContext = null;	
							list.detachUpdateFinished(this.onGrowingFinished,this);
							this.prevItem = items[i];
						}
						else{
						items[i].setSelected(false);
						}
					}
				}
			}
	
});
},
	"cus/crm/lead/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View id="masterListView" xmlns:core="sap.ui.core"\n\txmlns="sap.m" controllerName="cus.crm.lead.view.S2">\n\t<Page id="masterListPage"  title="{i18n>MASTER_TITLE}">\n\t\t<content>\n\t\t \t<List id="list" selectionChange="_handleSelect" mode="{device>/listMode}" growing="true" growingScrollToLoad="true" noDataText="{i18n>LOADING}"\n\t\t \t>\n\t\t \t<!-- extension to define a custom lead list item -->\n\t\t \t<core:ExtensionPoint name="leadItemExtension"></core:ExtensionPoint>\n\t\t\t\t<ObjectListItem id="MAIN_LIST_ITEM" press="_handleItemPress" type="{device>/listItemType}" title="{Description}">\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute id="objAttribute2" text="{QualificationText}" />\n\t\t\t\t\t\t<ObjectAttribute text="{path:\'EndDate\', formatter: \'cus.crm.lead.util.formatter.formatDate\'}" />\n\t\t\t\t\t\t<!-- extension to add new attribute -->\n\t\t\t\t\t\t<core:ExtensionPoint name="leadItemAttributeExtension"></core:ExtensionPoint>\n\t\t\t\t\t</attributes>\n\t\t\t\t\t<firstStatus>\n\t\t\t\t\t     <!-- extension to add new Status -->\n\t\t\t\t\t\t<core:ExtensionPoint name="leadItemStatusExtension"></core:ExtensionPoint>\n\t\t\t\t\t</firstStatus>\t\n\t\t\t\t\t<secondStatus>\n\t\t\t\t\t\t\t<ObjectStatus id="objstatus" text="{UserStatusText}" >\n\t\t\t\t\t\t\t</ObjectStatus> \n\t\t\t\t\t</secondStatus>\n\t\t\t\t</ObjectListItem>\n\t\t\t\t<infoToolbar id="listToolbar">\n                    <Toolbar id="toolbarAccountInfo" visible="false">\n                        <Label id="labelAccountInfo" text=""/>\n                        <ToolbarSpacer id="listSpacer" />\n                        <core:Icon id="crossIcon" src="sap-icon://sys-cancel" press="closeToolbar"/>\n                    </Toolbar>\n            </infoToolbar>\n\t\t\t</List>\n\t\t</content>\n\t \t</Page>\n\t\n</core:View>',
	"cus/crm/lead/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cus.crm.lead.util.formatter");
jQuery.sap.require("cus.crm.lead.util.schema");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("cus.crm.lead.util.Util");


sap.ca.scfld.md.controller.BaseDetailController
.extend(
		"cus.crm.lead.view.S3",
		{
			Origins : [],
			Priorities : [],
			QualificationsLevels : [],
			bAcceptLead : false,
			bRejectLead : false,
			sHeaderGuid : "",
			nLeads : 0,
			bAppLaunched : true,
			navToOtherApp : false,
			partnerFunctionMap : {},
			partnerDeterminationMap : {},
			//['json>fullName','json>contactID'],formatter : 'cus.crm.lead.util.formatter.formatDescription'
			accountListItemTemplate : new sap.m.ObjectListItem(	{title : '{json>name1}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>accountID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>accountID}'})),
		    
		    
		    contactListItemTemplate : new sap.m.ObjectListItem({title : '{json>fullName}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>contactID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>contactID}'})),
			
		    
		
			employeeListItemTemplate : new sap.m.ObjectListItem({title : '{json>fullName}'})
			.addAttribute(new sap.m.ObjectAttribute ({text : '{json>employeeID}'}))
			.addCustomData(new sap.ui.core.CustomData({key : 'ID', value : '{json>employeeID}'})),
			onInit : function() {
				this.fullScreenMode = false;
				// execute the onInit for the base class
				// BaseDetailController
				sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit
				.call(this);
				
				//using css padding alone 
				jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.lead.css.Leads",".css"),"sap-ui-theme-sap.crm");
				
				//i18n models and resource bundles
				this.oI18nModel = sap.ca.scfld.md.app.Application.getImpl().AppI18nModel;
				this.oResourceBundle = this.oI18nModel.getResourceBundle();
			
				
				//odata model 
				this.oModel = this.getView().getModel();
				
				//changing the model to json to make s3 view independent of s2 view
				this.getView().setModel(new sap.ui.model.json.JSONModel());
				 
				//add custom data to the participants tab, the s3Controller 
				this.byId('salesteam').addCustomData(new sap.ui.core.CustomData({key : 'controller', value : this}));
				
				//TODO : interoperability 
				this.sBackendVersion = cus.crm.lead.util.schema
				._getServiceSchemaVersion(this.oModel,
						"Lead");
		        this.oVersioningModel = new sap.ui.model.json.JSONModel({});
				this._loadVersionSpecificUI(this.sBackendVersion);			
				//fragments - contact dialog & change logs 
				this.contactF4Fragment  =  new sap.ui.xmlfragment(this.createId("contactF4_S3"), 'cus.crm.lead.fragment.ContactF4', this);
				this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
				this.contactF4Fragment.setModel(this.oI18nModel,'i18n');
				  	
			     this.changeLogFragment = new sap.ui.xmlfragment(this.createId("changeLog_S3"), 'cus.crm.lead.fragment.ChangeLog', this);
				 this.changeLogFragment.setModel(new sap.ui.model.json.JSONModel());
				 this.changeLogFragment.setModel(this.oI18nModel,'i18n');
				  	
					
				  	
				//setting named json models - for individual tabs of icon tab filter - salesteam, info, products & header
				this.byId('salesteam').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('info').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('Product_Tab').setModel(new sap.ui.model.json.JSONModel(),"json");
				this.byId('S3_Header').setModel(new sap.ui.model.json.JSONModel(),"json");
				
				
				/*this.byId('ChangeLog').setModel(new sap.ui.model.json.JSONModel(),"json");*/
				
				//setting a named json model
				this.getView().setModel(new sap.ui.model.json.JSONModel(),"json");
				
				var oFileUpload = this.byId('fileupload');
				var sUrlParams = this.getView().getModel().sUrlParams;
				//if upload enabled, must set xsrf token
				//and the base64 encodingUrl service for IE9 support!
				if (oFileUpload.getUploadEnabled()) {
				oFileUpload.setXsrfToken(this.getXsrfToken());
				oFileUpload.setEncodeUrl("/sap/bc/ui2/encode_file" + (sUrlParams ? '?' + sUrlParams
				: ''));
				}
			
				//navigation pattern match callback - detail pattern for s3
				this.oRouter
				.attachRouteMatched(
						this.routeMatched, this);

				
			
				
			},
			
			/**
			* gets the Xsrf token if it exists, if not, request it explicitly
			**/
			getXsrfToken: function() {
			var sToken = this.oModel.getHeaders()['x-csrf-token'];
			if (!sToken) {
			this.oModel.refreshSecurityToken(
			function(e, o) {
			sToken = o.headers['x-csrf-token'];
			},
			function() {
			sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: 'Could not get XSRF token',
			details: ''
			});
			},
			false);
			
			}
			
			return sToken;
			},
			
			
			_loadVersionSpecificUI : function(sBackendVersion){
							
				if(parseFloat(sBackendVersion) >= 2){
					//Wave 4 and above
	 			    this._loadWave4UI();
				}
                
				else{
					//Wave 3 and below
					 this._loadWave3UI();
				}
				
				
			},
		
		   _loadWave3UI : function(){
			 
			   //i18n text key for sales team
			   this.oVersioningModel.getData().sParticipantsNoDataTextKey  = 'NO_CONTACTS';
			   this.oVersioningModel.getData().setHeaderTextForParticipants = jQuery.proxy(function(response) {},this);
			   //sales team tab - add contact button that allows to add contacts to the sales team
			   this.byId('salesTeam').insertContent(new sap.m.Button({
				   text : "{i18n>ADDCONTACT}",
				   icon : "sap-icon://add",
				   press : jQuery.proxy(this.addContact,this),
				   type : "Transparent",
			   }),0);
		   },
		   
		   _loadWave4UI : function(){
			 
			   //i18n text key for participants
			   this.oVersioningModel.getData().sParticipantsNoDataTextKey  = 'NO_PARTICIPANTS1';
			   this.oVersioningModel.getData().setHeaderTextForParticipants = jQuery.proxy(function(response) {
				   
				   this.byId('salesteam').getHeaderToolbar().getContent()[0].setText(this.oResourceBundle.getText('PARTICIPANTS',[response.data.SalesTeam.results.length]));
					
			   },this);
			   //employee responsible to be added at the object header 
			   this.byId('S3_Header').addAggregation("attributes",new  sap.m.ObjectAttribute(
					                                              {  text : "{json>/EmployeeResponsibleName}",
					                                            	 active : true,
					                                            	 press :  jQuery.proxy(this.onEmpBusCardLaunch,this),
					                                            	 customData : [new sap.ui.core.CustomData({key : "PartnerNumber", value : "{json>/EmployeeResponsibleNumber}"}),
					                                            	               new sap.ui.core.CustomData({key : "PartnerFunctionCode", value : "00000014"}),
					                                            	 			   new sap.ui.core.CustomData({key : "Image", value : "{json>/ContactImgSrc}"}),
					                                            	 			   new sap.ui.core.CustomData({key : "Imager", value : "{json>/ImgSrc}"}),
					                                            	             ]
					                                                
					                                              }));
			   
			  //participants tab - add contact button now becomes the add participants - a title "Participants (count)" gets added    
			   this.byId('salesteam').setHeaderToolbar(new sap.m.Toolbar({
				   content : [new sap.m.Label(),
				              new sap.m.ToolbarSpacer(),
				              new sap.m.Button({
				            	  text : "",
				            	  icon : "sap-icon://add",
				            	  type : "Transparent",
				            	  press : jQuery.proxy(this.showParticipantsF4,this)
				              })]
			   }));
			   
			   
		   },
		
			/* Add Note handling:Changes in Notes Tab with the FeedInput control*/
			_handleAddNote : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				if (sValue) {
			    var that = this;	
				var oModel = this.oModel;
				var headerGuid = this.byId('info').getModel('json').getData().Guid;
				var oEntry = {
						HeaderGuid : headerGuid,
						Content : sValue

				};
				
				oModel.create('/LeadNotes',
						oEntry,
						null,
						jQuery.proxy(function() {
						    var that = this;
							oModel.read( that.sPath, null, [ "$expand=Notes" ],true, function(odata,response){
								
								that.byId('listItem').setModel(new sap.ui.model.json.JSONModel({LeadNotes : odata.Notes.results}),"json");
								
								});
							    
							     
							
							},this),
							function(oMessage) {
					that.displayResponseErrorMessage(
									oMessage,
									sap.ca.scfld.md.app.Application
											.getImpl()
											.getResourceBundle()
											.getText(
													'SAVE_FAILED'));
				});
				
				              }
							},
					displayResponseErrorMessage : function(oMessage,
									sDefaultMessage) {
								var sMessage;
								if (oMessage.response) {
									sMessage = jQuery.parseJSON(oMessage.response.body).error.message.value;
								}
							    sap.m.MessageToast.show(sMessage || sDefaultMessage);
							},


			selectedTab : function(oControlEvent) {

				
				var oModel = this.oModel;
				//   
				var tab_selection = oControlEvent.getSource().getSelectedKey();

								var that = this;
								
								
				// EXTENSION POINT 
				/**
				* @ControllerHook extHookCustomTabSelectHandler is the controller hook that provides for extension of newly added custom tabs
				* 
				* @callback sap.ca.scfld.md.controller.BaseDetailController~extHookCustomTabSelectHandler
				* 
				* @param {string}
				*            tab_selection
				* @return {void}
				*/
				if (this.extHookCustomTabSelectHandler){
				       this.extHookCustomTabSelectHandler(tab_selection);
					}
				var that = this;
				if (tab_selection == "Product") {
										}
				
	//Changes in Notes Tab  with the FeedInput control-On Tab selection
				if (tab_selection == "Notes") {
					
					this.byId("listItem").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
					this.byId('listItem').getModel('json').setData({LeadNotes : []});
				
								
					oModel.read(
							this.sPath,
							null,
							[ "$expand=Notes" ],
							true,
							jQuery.proxy(function(odata, response) {
								var tab = this.getView().byId("listItem");
								var jsonModel = new sap.ui.model.json.JSONModel();
							var	data = {LeadNotes : response.data.Notes.results};
							if(data.LeadNotes.length == 0)
							{
							that.byId("listItem").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_NOTES'));
							}
							
												
							jsonModel.setData(data);
								tab.setModel(jsonModel,"json")
								   
								  

							},this),
							jQuery.proxy(function(oError){
								
								this.handleErrors(oError);
							},this));
				}


				if (tab_selection == "Attachment") {

					
					var headerGuid = this.byId('info').getModel('json').getData().Guid;

                    // get the list to set the post url param   
                    var that = this.getView();
                    var file = that.byId("fileupload");
                    if(file.getEditMode() == true){
                    	
                    	file.setEditMode(false);
                    }
                    
                    //refresh to get xcsrf Token
                    oModel.refreshSecurityToken();
                    
                    // get token
                    var oModelHeaders = oModel.getHeaders();
                    file.setXsrfToken(oModelHeaders['x-csrf-token']);
                    
                    // remove - from guid
                    var nheaderGuid = headerGuid.replace(/-/g, '');
                    //set custom header
                    file.setCustomHeader("slug",nheaderGuid);

					oModel.read(this.sPath,null,[ "$expand=Attachments" ],true,
							function(odata, response) {

								var data = {LeadsAttachments : [] };
								var length = response.data.Attachments.results.length;
								var i;
								for (i = 0; i < length; i++) {
									var value = response.data.Attachments.results[i];
									var attachmentUrl = response.data.Attachments.results[i].Url;
									var URL = value.__metadata.media_src ;
								//	URL = URL.replace(/^https:\/\//i, 'http://');
									var o = {
											name : value.Name,
											size : value.fileSize,
											url :  (attachmentUrl === "") ? URL : attachmentUrl,
											uploadedDate :cus.crm.lead.util.formatter.formatDate(value.CreatedAt),
											contributor : value.CreatedBy,
											fileExtension : cus.crm.lead.util.formatter.mimeTypeFormatter(value.MimeType),
											fileId : value.DocumentID , 
											media_src : value.__metadata.media_src
									};
									data.LeadsAttachments.push(o);
								}

								that.byId('fileupload').setModel(new sap.ui.model.json.JSONModel(data));
							},jQuery.proxy(this.handleErrors,this));

				}
			// when parties involved is selected
				if (tab_selection == "Team") {
					var	data;
					var oLogo = [];
					var that =this;
					if(parseFloat(this.sBackendVersion) >= 2.0){
						//partner determination only vaild from wave 4 onwards
						
						
					if(parseFloat(this.sBackendVersion) >= 4){
						//the game changes a bit from wave 7 onwards
						var oUTIL = cus.crm.lead.util.Util;
						if(oUTIL.getPartnerFunctions() === null){
							oUTIL.fetchPartnerFunctions(this.oModel);
						}
						
						this.partnerDeterminationMap = oUTIL.getPartnerFunctions();
					}	
					else{
						//wave 4 and above - uptill wave 6
					if(!this.partnerDeterminationMap[this.transactionType]){
						
						this.oModel.read("LeadPartnerFctTypes",null,["TransactionType='" + this.transactionType +"'"],false,jQuery.proxy(function(odata,response){
		            		
		            		this.partnerDeterminationMap[this.transactionType] = response.data.results;
		            	},this),jQuery.proxy(function(oError){
		            		
		            		this.handleErrors(oError);
		            	},this));
					
					}
					this.partnerFunctionMap = {};
					}
					}
					this.byId("salesteam").setNoDataText(this.oResourceBundle.getText('LOADING_TEXT'));
					this.byId('salesteam').getModel('json').setData({LeadSalesTeamSet : []});
					oModel.read(this.sPath,null,[ "$expand=SalesTeam" ], true,
							function(odata, response) {
								var tab = that.getView().byId("salesteam");
								var jsonModel = new sap.ui.model.json.JSONModel();
								
								data = { LeadSalesTeamSet : response.data.SalesTeam.results };
								
								that.oVersioningModel.getData().setHeaderTextForParticipants(response);
							 if(data.LeadSalesTeamSet.length == 0)
								{
								
								that.byId("salesteam").setNoDataText(that.oResourceBundle.getText(that.oVersioningModel.getData().sParticipantsNoDataTextKey));
								}
							 
							 var aBatchReads = [];
							
							 	for(var i = 0; i<data.LeadSalesTeamSet.length; i++)
							 		{
							 		var accountID = data.LeadSalesTeamSet[i].PartnerNumber ; 
							 		var sPath = "/AccountCollection('" + accountID + "')?$expand=Logo";
							 		oLogo[i]=  "sap-icon://person-placeholder";
							 		aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       
							 		
							 			
							 		};
							
							 		oModel.addBatchReadOperations(aBatchReads);
									oModel.submitBatch(jQuery.proxy(function(oResponses){
										for(var j = 0; j<data.LeadSalesTeamSet.length; j++)
										{
											if(oResponses.__batchResponses[j].data && oResponses.__batchResponses[j].data.Logo && oResponses.__batchResponses[j].data.Logo.__metadata.media_src   )
											{  var oMetadata = oResponses.__batchResponses[j].data.Logo.__metadata.media_src ? oResponses.__batchResponses[j].data.Logo.__metadata.media_src : "sap-icon://person-placeholder";
											var  URl = oMetadata;
											oLogo[j] = URl.toString();
											}

											data.LeadSalesTeamSet[j].ImgSrc = oLogo[j];	
										}

										jsonModel.setData(data);
										tab.setModel(jsonModel,"json");

									},this),jQuery.proxy(function(oError){

															sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));


																},this),true);});	
				}
			},

			getParticipants : function(){

				var	data;
				var oLogo = [];
				var that =this;
				this.partnerFunctionMap = {};
				this.byId("salesteam").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'));
				this.byId('salesteam').getModel('json').setData({LeadSalesTeamSet : []});
				this.oModel.read(this.sPath,null,[ "$expand=SalesTeam" ], true,
						function(odata, response) {
					
					        that.bindS3Header(response.data);
							var tab = that.getView().byId("salesteam");
							var jsonModel = new sap.ui.model.json.JSONModel();
						
							
							data = { LeadSalesTeamSet : response.data.SalesTeam.results };
							that.oVersioningModel.getData().setHeaderTextForParticipants(response);
						 if(data.LeadSalesTeamSet.length == 0)
							{
							
							that.byId("salesteam").setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_CONTACTS'));
							}
						 
						 var aBatchReads = [];
						
						 	for(var i = 0; i<data.LeadSalesTeamSet.length; i++)
						 		{
						 		var accountID = data.LeadSalesTeamSet[i].PartnerNumber ; 
						 		var sPath = "/AccountCollection('" + accountID + "')?$expand=Logo";
						 		oLogo[i]=  "sap-icon://person-placeholder";
						 		aBatchReads.push(that.oModel.createBatchOperation(sPath,"GET"));       
						 		
						 			
						 		};
						
						 		that.oModel.addBatchReadOperations(aBatchReads);
								that.oModel.submitBatch(jQuery.proxy(function(oResponses){
									for(var j = 0; j<data.LeadSalesTeamSet.length; j++)
									{
										if(oResponses.__batchResponses[j].data && oResponses.__batchResponses[j].data.Logo && oResponses.__batchResponses[j].data.Logo.__metadata.media_src   )
										{  var oMetadata = oResponses.__batchResponses[j].data.Logo.__metadata.media_src ? oResponses.__batchResponses[j].data.Logo.__metadata.media_src : "sap-icon://person-placeholder";
										var  URl = oMetadata;
										oLogo[j] = URl.toString();
										}
										

										data.LeadSalesTeamSet[j].ImgSrc = oLogo[j];	
									}

									jsonModel.setData(data);
									tab.setModel(jsonModel,"json");

								},this),jQuery.proxy(function(oError){

														sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));


															},this),true);});	
			
			},
			onUploadFile : function(oResponse){
				
				var oFile ;
				if (oResponse.getParameters() && oResponse.getParameters().d)
					oFile = oResponse.getParameters().d;
					else
					oFile= oResponse.getParameters();
				
                //get uloaded data
              //  var oFile = oResponse.getParameter("d");
                //in url replace https to http
                if(oFile.__metadata.media_src)
                    var URL = oFile.__metadata.media_src;
    				else 
    				var URL = oFile.url;
               // URL = URL.replace(/^https:\/\//i, 'http://');
                
                //date in correct formate
                var date = parseInt((oFile.CreatedAt).substr(6));
                var fName = decodeURIComponent(oFile.Name);
                

                //set the object
                var object = {
                       
                              "fileExtension" :cus.crm.lead.util.formatter.mimeTypeFormatter(oFile.MimeType),
                              "contributor" : oFile.CreatedBy,
                              "uploadedDate" :cus.crm.lead.util.formatter.formatDate(new Date(date)),
                              "name": fName,
                              "url": URL,
                              "size": oFile.fileSize,
                              "fileId" : oFile.DocumentID,
                             
                       
                };
                              
                
                //commit change
                this.byId('fileupload').commitFileUpload(object);
                
                },
                
                onDeleteFile: function(oEvent){
                	 
                	var Parameters = oEvent.getParameters();
                      var URL = Parameters.media_src;
                      var removStartVal;
                      if(!URL)
                   removStartVal = Parameters.url.split("(").pop();
                      else 
                    	  removStartVal = URL.split("(").pop();
                      var sPath = "LeadAttachments(";
                      var url = sPath + removStartVal ;
                      this.oModel.remove(url);
                     //removing the file from the UI
                      this.byId('fileupload').removeFile(Parameters.fileId);
                
                	
                },
			
			
			onAttachmentSelected : function(oEvent) {
				var selectedAttachment = oEvent
				.getParameter('listItem').getBindingContext()
				.getObject();
				var win = window.open(
						selectedAttachment.__metadata.media_src,
				'_blank');
				win.focus();

			},

			onEmployeeLaunchheader : function(oEvent)
			{ 
				var contactId = oEvent.getSource().data("PartnerNumber");
				var sPath = "/AccountCollection('" + contactId + "')";
		    	var  oLogo=  "sap-icon://person-placeholder";
		    	 
		    	var oModel = this.oModel;
		    	oModel.read(sPath, null, ["$expand=Logo"], false, function (odata, response) {
		            jQuery.sap.log.info("oData account response");
		            if (odata.Logo && odata.Logo.__metadata) {

		                var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src: "sap-icon://person-placeholder";

		                var URl = oMetadata.replace(/^https:\/\//i, 'http://'); 
		                oLogo = URl.toString();

		            }

		        });

		       var oModel = this.oModel;

				var accountId = this.byId('info').getModel('json').getData().ProspectNumber;
				var event = oEvent.getSource();
				//var PartnerFunctionCode = oEvent.getSource().data("PartnerFunctionCode");
				var Image = oLogo;
		        
				if (accountId && contactId) {
					this.AccountId = accountId;
					this.ContactId = contactId;
					
					var sPath = "/ContactCollection(accountID='"+accountId+"',contactID='"+contactId+"')?$expand=WorkAddress,Account,Account/MainAddress,Account/MainContact,Account/MainContact/WorkAddress";
					 
					var aBatchReads = [];
					
						aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       



					oModel.addBatchReadOperations(aBatchReads);
					
					
					oModel.submitBatch(jQuery.proxy(function(oResponses){
						
						var data = { Value : "" } ;
						data.Value = oResponses.__batchResponses[0].data ; 
						
						
						var fnCallbackNavPara = jQuery.proxy(function(oEvent){
							 
							var oNavConfig = {};
							oNavConfig.target = {};
							oNavConfig.target.semanticObject = "ContactPerson";
							oNavConfig.target.action = "MyContacts";
							oNavConfig.params = { accountID : this.AccountId,
												 contactID : this.ContactId, };
							this.navToOtherApp = true;
							 	
							return oNavConfig;
                           
                        
						
                        
						 
					 },this);
						
						
						
						if(data.Value.Account){     
						if(data.Value.Account.MainContact){
							if(data.Value.Account.MainContact.WorkAddress){
								if(data.Value.WorkAddress){
									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : Image,
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//Only Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(oEvent.getSource());
									}                                                                                                      
								}
								//work address is null and check main address
								else{

									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//work address and Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,

												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,
													maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
													maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
													maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									} 


								}

							}
							//main contact's work address is null and check work address and main address
							else{
								if(data.Value.WorkAddress){

									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//main contact's work address is null and  Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}                                                                                                      


								}
								//work address is null and main contacts work address is also null , check for main address
								else{


									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//main contacts work address is null and work address and Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,

												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

													maincontactname : data.Value.Account.MainContact.fullName,

													maincontactemailsubj : "Automatic Mail for Maincontact",
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									} 



								}
							}

						}
						//account != null and maincontact is null and so is main contact's work address and work address and main address

						//main contact's work address is null and check work address and main address
						else{
							if(data.Value.WorkAddress){

								if(data.Value.Account.MainAddress){
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,
											contactmobile : data.Value.WorkAddress.mobilePhone,
											contactphone : data.Value.WorkAddress.phone,
											contactemail : data.Value.WorkAddress.email,
											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											companyaddress : data.Value.Account.MainAddress.address,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",
												companyphone : data.Value.Account.MainAddress.phone,
											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								}
								//Only Mainaddress is null
								else{
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,
											contactmobile : data.Value.WorkAddress.mobilePhone,
											contactphone : data.Value.WorkAddress.phone,
											contactemail : data.Value.WorkAddress.email,
											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",

											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								}                                                                                                      


							}
							//
							else{


								if(data.Value.Account.MainAddress){
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,
											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											companyaddress : data.Value.Account.MainAddress.address,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",
												companyphone : data.Value.Account.MainAddress.phone,

											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								}
								//work address and Mainaddress is null
								else{
									var oEmpConfig = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
											name : data.Value.fullName,
											imgurl : Image,
											department : data.Value.department,

											contactemailsubj : "App Genrated Mail",
											companyname : data.Value.Account.name1,
											beforeExtNav : fnCallbackNavPara,
											// optional: if the following attributes
											// are
											// provided - a link to company card is
											// available
											companycard : {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
												imgurl : "sap-icon://person-placeholder",


											}
									};

									// call 'Business Card' reuse component
									var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
											oEmpConfig);
									oEmployeeLaunch.openBy(event);
								} 



							}
						}

					}
						
						else {
							sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT_IS_NULL_S3'));
						}
							
					},this),jQuery.proxy(
							function(oError){

								//sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));	
								sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));

							},this),true);
					
					
				}
				
				else
					{
					sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));	
					
					}
			},
			onEmpBusCardLaunch : function(oEvt){
				
				if (oEvt.getSource().data("PartnerNumber") !== '') {
					var sPath = "/EmployeeCollection('" + oEvt.getSource().data("PartnerNumber") + "')";
					var sURLparameters = "$expand=WorkAddress,Company,Photo";
							
					var oSource = oEvt.getSource();
					var that = this;
					this.oModel.read(sPath, null, [sURLparameters], true, function(odata, response) {
						jQuery.sap.log.info("oData employee response");

						// initializing the attributes used for the business card
						var oTitle = that.oResourceBundle.getText("EMPLOYEE");
						var oEmployeeMobile = "";
						var oEmployeePhone = "";
						var oEmployeeEmail = "";
						var oEmployeeDepartment = "";
						var oCompanyAddress = "";
						var oCompanyName = "";
						var oEmployeeName = "";
						var oPhoto = "";

						if (odata.WorkAddress) {
							oEmployeeMobile = odata.WorkAddress.mobilePhone;
							oEmployeePhone = odata.WorkAddress.phone;
							oEmployeeEmail = odata.WorkAddress.email;
							oEmployeeDepartment = odata.WorkAddress.department;
							oCompanyAddress = odata.WorkAddress.address;
						}
						// get company name
						if (odata.Company && odata.Company.name1) {
							oCompanyName = odata.Company.name1;
						}
						if (odata.fullName && odata.fullName !== "") {
							oEmployeeName = odata.fullName;
						}
						// get employee photo
						if (odata.Photo && odata.Photo.__metadata) {
							var oMetadata = cus.crm.lead.util.formatter.formatPhotoUrl(odata.Photo.__metadata.media_src);
							oPhoto = cus.crm.lead.util.formatter.urlConverter(oMetadata);
						}
						var oEmpConfig = {
							title : oTitle,
							name : oEmployeeName,
							imgurl : oPhoto,
							department : oEmployeeDepartment,
							contactmobile : oEmployeeMobile,
							contactphone : oEmployeePhone,
							contactemail : oEmployeeEmail,
							contactemailsubj : "",
							companyname : oCompanyName,
							companyaddress : oCompanyAddress
						};
						// call 'Business Card' reuse component
						var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
						oEmployeeLaunch.openBy(oSource);
					}, function(oError) {
						jQuery.sap.log.error("oData request for employee failed");
					});
				}
				
			},
			
			onEmployeeLaunch : function(oEvent) {
				
				if(oEvent.getSource().data("PartnerFunctionCode") === "00000014"){
					this.onEmpBusCardLaunch(oEvent);
					return;
				}
				
				
				var oModel = this.oModel;

				var accountId = this.byId('info').getModel('json').getData().ProspectNumber;
				var event = oEvent.getSource();

				var contactId = oEvent.getSource().data("PartnerNumber");
				var PartnerFunctionCode = oEvent.getSource().data("PartnerFunctionCode");
				var Image = oEvent.getSource().data("Image");

				if (PartnerFunctionCode == "00000015") {
					var    data;
					if (accountId && contactId) {
						
						this.AccountId = accountId;
						this.ContactId = contactId;
						
						var sPath = "/ContactCollection(accountID='"+accountId+"',contactID='"+contactId+"')?$expand=WorkAddress,Account,Account/MainAddress,Account/MainContact,Account/MainContact/WorkAddress";
						 
						var aBatchReads = [];
						
							aBatchReads.push(oModel.createBatchOperation(sPath,"GET"),o);       



						oModel.addBatchReadOperations(aBatchReads);
						
						
						oModel.submitBatch(jQuery.proxy(function(oResponses){
							
							var data = { Value : "" } ;
							data.Value = oResponses.__batchResponses[0].data ; 
							
							var fnCallbackNavPara = jQuery.proxy(function(oEvent){
								 
								var oNavConfig = {};
								oNavConfig.target = {};
								oNavConfig.target.semanticObject = "ContactPerson";
								oNavConfig.target.action = "MyContacts";
								oNavConfig.params = { accountID : this.AccountId,
													 contactID : this.ContactId, };
								this.navToOtherApp = true;
								 	
								return oNavConfig;
	                           
							 
						 },this);
							
							
							if(data.Value.Account){     
							if(data.Value.Account.MainContact){
								if(data.Value.Account.MainContact.WorkAddress){
									if(data.Value.WorkAddress){
										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactmobile : data.Value.WorkAddress.mobilePhone,
													contactphone : data.Value.WorkAddress.phone,
													contactemail : data.Value.WorkAddress.email,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													companyaddress : data.Value.Account.MainAddress.address,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : Image,
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//Only Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactmobile : data.Value.WorkAddress.mobilePhone,
													contactphone : data.Value.WorkAddress.phone,
													contactemail : data.Value.WorkAddress.email,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(oEvent.getSource());
										}                                                                                                      
									}
									//work address is null and check main address
									else{

										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													companyaddress : data.Value.Account.MainAddress.address,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//work address and Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,

													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,
														maincontactmobile : data.Value.Account.MainContact.WorkAddress.mobilePhone,
														maincontactphone : data.Value.Account.MainContact.WorkAddress.phone,
														maincontactemail : data.Value.Account.MainContact.WorkAddress.email,
														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										} 


									}

								}
								//main contact's work address is null and check work address and main address
								else{
									if(data.Value.WorkAddress){

										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactmobile : data.Value.WorkAddress.mobilePhone,
													contactphone : data.Value.WorkAddress.phone,
													contactemail : data.Value.WorkAddress.email,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													companyaddress : data.Value.Account.MainAddress.address,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//main contact's work address is null and  Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactmobile : data.Value.WorkAddress.mobilePhone,
													contactphone : data.Value.WorkAddress.phone,
													contactemail : data.Value.WorkAddress.email,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}                                                                                                      


									}
									//work address is null and main contacts work address is also null , check for main address
									else{


										if(data.Value.Account.MainAddress){
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,
													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													companyaddress : data.Value.Account.MainAddress.address,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",
														companyphone : data.Value.Account.MainAddress.phone,
														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										}
										//main contacts work address is null and work address and Mainaddress is null
										else{
											var oEmpConfig = {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
													name : data.Value.fullName,
													imgurl : Image,
													department : data.Value.department,

													contactemailsubj : "App Genrated Mail",
													companyname : data.Value.Account.name1,
													beforeExtNav : fnCallbackNavPara,
													// optional: if the following attributes
													// are
													// provided - a link to company card is
													// available
													companycard : {
														title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
														imgurl : "sap-icon://person-placeholder",

														maincontactname : data.Value.Account.MainContact.fullName,

														maincontactemailsubj : "Automatic Mail for Maincontact",
													}
											};

											// call 'Business Card' reuse component
											var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
													oEmpConfig);
											oEmployeeLaunch.openBy(event);
										} 



									}
								}

							}
							//account != null and maincontact is null and so is main contact's work address and work address and main address

							//main contact's work address is null and check work address and main address
							else{
								if(data.Value.WorkAddress){

									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,
												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//Only Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactmobile : data.Value.WorkAddress.mobilePhone,
												contactphone : data.Value.WorkAddress.phone,
												contactemail : data.Value.WorkAddress.email,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",

												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}                                                                                                      


								}
								//
								else{


									if(data.Value.Account.MainAddress){
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,
												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												companyaddress : data.Value.Account.MainAddress.address,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",
													companyphone : data.Value.Account.MainAddress.phone,

												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									}
									//work address and Mainaddress is null
									else{
										var oEmpConfig = {
												title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('CONTACT'),
												name : data.Value.fullName,
												imgurl : Image,
												department : data.Value.department,

												contactemailsubj : "App Genrated Mail",
												companyname : data.Value.Account.name1,
												beforeExtNav : fnCallbackNavPara,
												// optional: if the following attributes
												// are
												// provided - a link to company card is
												// available
												companycard : {
													title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
													imgurl : "sap-icon://person-placeholder",


												}
										};

										// call 'Business Card' reuse component
										var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
												oEmpConfig);
										oEmployeeLaunch.openBy(event);
									} 



								}
							}

						}
							else{
							sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT_IS_NULL_S3'));
							}
						},this),jQuery.proxy(
								function(oError){

									//sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));
									sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));


								},this),true);
						
						
					}
					
					else
						{
						sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NOT_IN_MAIN_CONTACT'));	
						
						}
					
				}
				
				
				else if (PartnerFunctionCode == "00000021") {
					this.accountNum = accountId;
					if (accountId)  
					{
					var sPath = "AccountCollection(accountID='"+ accountId + "')?$expand=MainAddress,MainContact/WorkAddress,MainContact" ; 
					 
					var aBatchReads = [];
					
					
						aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       



					oModel.addBatchReadOperations(aBatchReads);
					
					
					oModel.submitBatch(jQuery.proxy(function(oResponses){
						
						var oMainContact = { Value : "" } ;
						oMainContact.Value = oResponses.__batchResponses[0].data ;
						
						
						
						 
							
						var fnCallbackNavParaComp = jQuery.proxy(function(oEvent){
							 
								var oNavConfig = {};
								oNavConfig.target = {};
								oNavConfig.target.semanticObject = "Account";
								oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + accountId + "')";
								
								this.navToOtherApp = true;
								 	
								return oNavConfig;
	                      
							 
						 },this); 
						 

					
						
						
						if (oMainContact.Value.MainContact) 
						{	
							if (oMainContact.Value.MainContact.WorkAddress) 

							{   
								if(oMainContact.Value.MainAddress) {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											companyphone : oMainContact.Value.MainAddress.phone,
											companyaddress : oMainContact.Value.MainAddress.address,
											maincontactname : oMainContact.Value.MainContact.fullName,
											maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
											maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
											maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
											maincontactemailsubj : "Automatic Mail for Maincontact",
										    beforeExtNav:fnCallbackNavParaComp,
									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);
								} 

								else {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,

											maincontactname : oMainContact.Value.MainContact.fullName,
											maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
											maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
											maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
											maincontactemailsubj : "Automatic Mail for Maincontact",
											beforeExtNav:fnCallbackNavParaComp,
									};
									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);

								}

							}	

							else
							{
								if(oMainContact.Value.MainAddress) {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											companyphone : oMainContact.Value.MainAddress.phone,
											companyaddress : oMainContact.Value.MainAddress.address,
											maincontactname : oMainContact.Value.MainContact.fullName,
											beforeExtNav:fnCallbackNavParaComp,

									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);



								}

								else {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											maincontactname : oMainContact.Value.MainContact.fullName,
											beforeExtNav:fnCallbackNavParaComp,

									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);


								}


							}

						}

						else {

							if(oMainContact.Value.MainAddress) {

								var oCompanycard = {
										title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
										imgurl : Image,
										companyname : oMainContact.Value.name1,
										companyphone : oMainContact.Value.MainAddress.phone,
										companyaddress : oMainContact.Value.MainAddress.address,
										beforeExtNav:fnCallbackNavParaComp,

								};

								var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
										oCompanycard);
								oCompanyLaunch.openBy(event);



							}
							else  {



								var oCompanycard = {
										title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
										imgurl : Image,
										companyname : oMainContact.Value.name1,
										beforeExtNav:fnCallbackNavParaComp,


								};

								var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
										oCompanycard);
								oCompanyLaunch.openBy(event);
							}


						}

					},this),jQuery.proxy(
							function(oError){

								sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));
								
							},this),true);

				} 
					
						
				}

				//Nither a contact or account
				else {

					sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('BCARD_ONLY_FOR_CONTACTS'));
				}

			},

		onLogChange : function(oEvent) {
				/*var appImpl = sap.ca.scfld.md.app.Application.getImpl();
				var oModel = this.oModel;
				var data;
				this.changeLogFragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('LOADING_TEXT'))
				this.changeLogFragment.getModel().setData({LeadChangeDocs : []});
				var that = this;
				oModel.read(
						that.sPath,
						null,
						[ "$expand=ChangeDocs" ],
						true,
						function(odata, response) {
							
								data  = {LeadChangeDocs : response.data.ChangeDocs.results};
								that.changeLogFragment.getModel().setData(data)
								if(data.LeadChangeDocs.length == 0){ 
									that.changeLogFragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('NO_LOG'))
								}

						},jQuery.proxy(this.handleErrors,this));
				*/
				this.changeLogFragment.open(oEvent);

			},

			onCancelLogChange : function(oEvent) {

				this.changeLogFragment.close();

			},
			
			
			showContactF4 : function(oEvent)
			{
				
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];
				var searchText = this.contactF4Fragment.getSubHeader().getContentLeft()[0].getValue();
				if(this.HeaderObject.ProspectNumber != "")
					{
					toolbar.setVisible(true);
				     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + this.HeaderObject.ProspectName);
				     this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
				     this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,
				    		   ["$filter=substringof'" + searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
				    		 {
				    	        this.contactF4Fragment.getModel('json').setData({ 
				                            ContactCollection : response.data.results 	        		
				    	        });
				    	        if(response.data.results.length === 0)
				    	        	  this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    	      
				    		 },this),jQuery.proxy(function(oError)
				    	        {
				    	        	this.contactF4Fragment.getModel('json').setData({
				    	        		
				    	        		ContactCollection : []
				    	        	});
				    	        	this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    	        },this));
				
				    	 
				    		 }
				    
				else
					{
				    toolbar.setVisible(false);
				    this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
				    this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
				    		 {
				    	      
				    	  this.contactF4Fragment.getModel('json').setData({ 
		                      ContactCollection : response.data.results 	        		
			        });
				    	  if(response.data.results.length === 0)
				    	  this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    		 },this),jQuery.proxy(function(oError)
				    	        {
				    			  this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				    	        	
				    	        },this));
				    
					}
				
				//this.byId('dialogContactF4').open();
				
				this.contactF4Fragment.open();
				
				
				
			},
			
			addContact: function(){
				
				var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
				var toolbarLabel = toolbar.getContent()[0];
				var Lead_Data =this.byId('info').getModel('json').getData();
				if(Lead_Data.ProspectNumber != "")
					{
					toolbar.setVisible(true);
				     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + Lead_Data.ProspectName);
				     
				     this.oModel.read("/AccountCollection(accountID='" + Lead_Data.ProspectNumber + "')/Contacts",null,null,true,jQuery.proxy(function(odata,response)
				    		 {
				    	        this.contactF4Fragment.getModel('json').setData({ 
				                            ContactCollection : response.data.results 	        		
				    	        });
				    	      
				    		 },this),jQuery.proxy(function(oError)
				    	        {
				    	        	this.contactF4Fragment.getModel('json').setData({
				    	        		
				    	        		ContactCollection : []
				    	        	});
				    	        	
				    	        },this));
				
				    		 }
				    
				else
					{
				    toolbar.setVisible(false);
				    this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
				    		 {
				    	      
				    	  this.contactF4Fragment.getModel('json').setData({ 
		                      ContactCollection : response.data.results 	        		
			        });
				    	     
				    		 },this),function(oError)
				    	        {
				    	        	
				    	        	
				    	        });
				    
					}
				
				//this.byId('dialogContactF4').open();
				
				this.contactF4Fragment.open();
				
			},
			
			searchParticipants  : function(){
			    var selectParticipants = this.participantsF4Fragment.getContent()[0];
			    this.participantsF4Fragment.getBeginButton().setEnabled(false);
			    selectParticipants.fireChange({selectedItem : selectParticipants.getSelectedItem()});
			},
			onPartnerFunctionChange : function(oEvent){
			 
			    this.checkMinMaxRules(null);
			   
				var curPartnerFunctionCategory = oEvent.getParameter('selectedItem').getKey();
				var curPartnerFunctionName = oEvent.getParameter('selectedItem').getText();
				var searchText = this.participantsF4Fragment.getContent()[1].getValue();
				 this.participantsF4Fragment.getBeginButton().setEnabled(false);
				this.participantsF4Fragment.getContent()[2].setNoDataText(this.oResourceBundle.getText("LOADING"));
				this.participantsF4Fragment.getContent()[1].setPlaceholder(this.oResourceBundle.getText('SEARCH_PARTICIPANTS'));
				switch(curPartnerFunctionCategory){
			
				case "0005" : 
				case "0008" :	 
			         //Employee Responsible partner function - fire Employees Collection 
					this.oModel.read("EmployeeCollection",null, ["$filter=substringof('" + searchText + "',fullName)" ],false,jQuery.proxy(function(odata,response){
						
						this.participantsF4Fragment.getModel('json').getData().Employees = response.data.results;
						this.participantsF4Fragment.getModel('json').updateBindings();
						this.participantsF4Fragment.getContent()[2].bindItems("json>/Employees",this.employeeListItemTemplate,null,[]);
					},this),jQuery.proxy(function(oError){},this));
					break;
					
				case "0007" : 
					//Contact partner function - fire Contact collection
	            this.oModel.read("ContactCollection",null, ["$filter=substringof('" + searchText + "',fullName)"],false,jQuery.proxy(function(odata,response){
						
						this.participantsF4Fragment.getModel('json').getData().Contacts = response.data.results;
						this.participantsF4Fragment.getModel('json').updateBindings();
						this.participantsF4Fragment.getContent()[2].bindItems("json>/Contacts",this.contactListItemTemplate,null,[]);
					},this),jQuery.proxy(function(oError){},this));
					break;
					
				default : 	
				  
					 //fire Account Collection 
	            this.oModel.read("AccountCollection",null, [ "$filter=substringof('" + searchText + "',name1)"],false,jQuery.proxy(function(odata,response){
						
						this.participantsF4Fragment.getModel('json').getData().Accounts = response.data.results;
						this.participantsF4Fragment.getModel('json').updateBindings();
						this.participantsF4Fragment.getContent()[2].bindItems("json>/Accounts",this.accountListItemTemplate,null,[]);
					},this),jQuery.proxy(function(oError){},this));
					break;
				}
				
				this.participantsF4Fragment.getContent()[2].setNoDataText(this.oResourceBundle.getText("NO_PARTICIPANTS"));
				
				
			},
			   enableAddParticipantsButton : function(){
              	 
              	 var participantsList =  this.participantsF4Fragment.getContent()[2];
              	 if(participantsList.getSelectedItems().length > 0){
		            	   this.participantsF4Fragment.getBeginButton().setEnabled(true);
		               }
		               else{
		            	   this.participantsF4Fragment.getBeginButton().setEnabled(false);
		               }
               },
				
			
			getCountForPartnerFunction : function(sPartnerFunctionCode){
				
				var count = 0;
				var participantsCollection  = this.byId('salesteam').getModel('json').getData().LeadSalesTeamSet;
				
				for(var i = 0; i<participantsCollection.length;i++){
					if(participantsCollection[i].PartnerFunctionCode === sPartnerFunctionCode){
						count++;
					}
					
				}
				
				return count;
			},
			
			checkMinMaxRules : function(oEvent){
			    
				//to check if a participant of specific participant type is already added
                var currentPartnerFunctionCode = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionCode;
                var currentPartnerFunctionName= this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionName;
                var oldItems = this.byId('salesteam').getModel('json').oData.LeadSalesTeamSet;
               
                if(oEvent){
                       var selectedItemName = oEvent.getParameters().listItem.getTitle();
                    var selectedItem=oEvent.getParameters().listItem.data("ID");
                                
                for ( var i = 0; i < oldItems.length; i++)
                {
                if (oldItems[i].PartnerNumber == selectedItem && oldItems[i].PartnerFunctionCode == currentPartnerFunctionCode)
                {
                       sap.m.MessageToast.show(this.oResourceBundle.getText('PARTICIPANT_EXISTS',[selectedItemName,currentPartnerFunctionName]),{
                              duration : 3500});
                       oEvent.getParameters().listItem.setSelected(false);
                       return;
                }
                }
                   
                }
				//checks the selection in the participants list against the customizing for the partner function
				var numberSelected = this.participantsF4Fragment.getContent()[2].getSelectedItems().length;
				var oCurrentRule = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject();
				var numberInParticipantsTab = this.getCountForPartnerFunction(oCurrentRule.PartnerFunctionCode);
				
				if(numberSelected + numberInParticipantsTab > oCurrentRule.CountHigh){
					//Too many participants for the current partner function
					if(oEvent){
					oEvent.getParameters().listItem.setSelected(false);
					}
					if(oCurrentRule.CountHigh === 1){
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_MANY_PARTICIPANTS_1',[oCurrentRule.CountHigh]),{
							duration : 3500
						});
					}
					else{
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_MANY_PARTICIPANTS',[oCurrentRule.CountHigh]),{
							duration : 3500
						});
					}
					this.enableAddParticipantsButton();
					return;
				}
				if(numberSelected + numberInParticipantsTab < oCurrentRule.CountLow){
					//Too few participants for the current partner function
					
					if(oCurrentRule.CountLow === 1){
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_FEW_PARTICIPANTS',[oCurrentRule.CountLow]),{
							duration : 3500
						});
					}
					else{
						sap.m.MessageToast.show(this.oResourceBundle.getText('TOO_FEW_PARTICIPANTS',[oCurrentRule.CountLow]),{
							duration : 3500
						});
					}
					this.enableAddParticipantsButton();
					return;
					
				}
				this.enableAddParticipantsButton();
			},
			onDeleteParticipant : function(oEvent){
		               
				var oCurrentPartner = oEvent.getSource().getBindingContext('json').getObject();
				var oCurrentRule = this.getRuleForPartnerFunction(oCurrentPartner.PartnerFunctionCode);
    	    	if(this.getCountForPartnerFunction(oCurrentPartner.PartnerFunctionCode) - 1 < oCurrentRule.CountLow){
    	    		
    	    		if(oCurrentRule.CountLow === 1){
    	    		 sap.ca.ui.message.showMessageToast(this.oResourceBundle.getText('MUST_HAVE_PARTICIPANTS_1',[oCurrentRule.CountLow]));
    	    		}
    	    		else{
    	    			 sap.ca.ui.message.showMessageToast(this.oResourceBundle.getText('MUST_HAVE_PARTICIPANTS',[oCurrentRule.CountLow]));	
    	    		}
    	    		 return;
    	    	}
				var sPath = ["LeadSalesTeamSet(HeaderGuid=guid'",this.headerGuid,"',PartnerNumber='",oCurrentPartner.PartnerNumber,"',PartnerFunctionCode='",oCurrentPartner.PartnerFunctionCode,"')"].join("");
				
				this.oModel.remove(sPath,null,jQuery.proxy(function(){
					
					this.getParticipants();
					this.getDataForDetailScreen(false);
					this.oModel.refresh();
					
				},this),jQuery.proxy(function(oError){
					
					
					this.handleErrors(oError);
					
				},this));
				
				
			},
			getRuleForPartnerFunction : function(sPartnerFunctionCode){
				
				for(var i = 0; i < this.partnerDeterminationMap[this.transactionType].length; i++){
					if(this.partnerDeterminationMap[this.transactionType][i].PartnerFunctionCode === sPartnerFunctionCode){
						return this.partnerDeterminationMap[this.transactionType][i];
					}
				}
				return null;
			},
    showParticipantsF4: function(){
				var selectParticipants;
	            if(!this.participantsF4Fragment){
	            	this.participantsF4Fragment  =  new sap.ui.xmlfragment(this.createId("participantsF4_S3"), 'cus.crm.lead.fragment.ParticipantsF4', this);
					this.participantsF4Fragment.setModel(new sap.ui.model.json.JSONModel({}),"json");
					this.participantsF4Fragment.setModel(this.oI18nModel,'i18n');
					
					//attach change event 
					var selectParticipants = this.participantsF4Fragment.getContent()[0]; 
					selectParticipants.attachChange(null,this.onPartnerFunctionChange,this);
					
	            }
	            
	            selectParticipants = this.participantsF4Fragment.getContent()[0];
	             this.participantsF4Fragment.getBeginButton().setEnabled(false);
	            //bind the customizing of partner functions 
				this.participantsF4Fragment.getModel('json').getData().PartnerFunctions = this.partnerDeterminationMap[this.transactionType];
                this.participantsF4Fragment.getModel('json').updateBindings();
               
                if(selectParticipants.getItems().length > 0){
	            selectParticipants.setSelectedItem(selectParticipants.getItems()[0]);
	            selectParticipants.fireChange({selectedItem : selectParticipants.getItems()[0]});
	            }
				this.participantsF4Fragment.open();
				
			},
			addParticipants : function(){
			    
			
				this.oModel.clearBatch();
				var changeSet = [];
				var currentPartnerFunctionCode = this.participantsF4Fragment.getContent()[0].getSelectedItem().getBindingContext('json').getObject().PartnerFunctionCode;
				var headerGuid =  this.byId('info').getModel('json').getData().Guid;
				var items = this.participantsF4Fragment.getContent()[2].getSelectedItems();
				var oEntry;
				
				for(var i = 0; i<items.length;i++){
					    oEntry = {
					    		HeaderGuid : headerGuid,
					    		PartnerNumber : items[i].data("ID"),
					    	    PartnerFunctionCode : currentPartnerFunctionCode
					    
					    };
			    		    
				      	changeSet.push(this.oModel.createBatchOperation("LeadSalesTeamSet","POST",oEntry,null));
				}
				
				if(changeSet.length > 0){
					this.oModel.addBatchChangeOperations(changeSet);
					this.oModel.submitBatch(jQuery.proxy(function(oResponses){
						
						this.getParticipants();
						this.getDataForDetailScreen(false);
						this.participantsF4Fragment.getContent()[2].removeSelections();
						this.participantsF4Fragment.getContent()[1].clear();
						this.participantsF4Fragment.close();
				       
						this.handleAddParticipantsBatchResponses(oResponses);
						
					},this),jQuery.proxy(function(oError){
						
						this.handleErrors(oError);
						
					},this));
				}
			},

			setContact : function(oEvent)
			{
				
				var oModel = this.oModel;
				this.oSelectedContact = oEvent.getParameter('listItem').getBindingContext('json').getObject();
				
				var headerGuid = this.byId('info').getModel('json').getData().Guid;

				
				
				oModel.refreshSecurityToken();
				oModel.update("LeadSalesTeamSet(PartnerNumber='"+this.oSelectedContact.contactID+"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+headerGuid+"')",{

					HeaderGuid  : headerGuid,
					PartnerNumber : this.oSelectedContact.contactID,
					PartnerFunctionCode : '00000015'

				},{
					fnSuccess : jQuery.proxy(function()
					{	
                        this.contactF4Fragment.getSubHeader().getContentLeft()[0].clear();
						var	data;
						var oLogo = [];
						var that =this;
						this.getParticipants();
						cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);


					},this),
					
					fnError : jQuery.proxy(function (oError){
						if(oError.response.statusCode === 412){
                      		 
                      		 cus.crm.lead.util.Util.show412ErrorDialog(this,
                      	jQuery.proxy(function(){
                      			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this); 
                      		 },this));
                      		 
                      		 return;
                      	 }
                           this.handleErrors(oError);
					},this),
					bMerge : true


				});
				this.contactF4Fragment.getContent()[0].removeSelections();
				this.contactF4Fragment.close();
				 
			},
					closeToolbar : function(oEvent)
			{
				
				this.contactF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
				this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
				this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
						{
					       this.contactF4Fragment.getModel('json').setData({
					    	   ContactCollection :  response.data.results
					    	   });
					       if(response.data.results.length === 0)
					    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
					    	   
						},this),
						jQuery.proxy(function(oError)
						{
							this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
							this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
							 
						},this));
							
			},
			
		
			closeContactF4 : function(oEvent)
			{	
				
				this.contactF4Fragment.close();
				this.contactF4Fragment.getSubHeader().getContentLeft()[0].clear();
			},
			closeParticipantsF4 : function(oEvent)
			{
				this.participantsF4Fragment.getContent()[2].removeSelections();
				this.participantsF4Fragment.getContent()[1].clear();
				this.participantsF4Fragment.close();
			},


			searchContact : function(oEvent)
			{
			    var searchText;
			    var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
			    toolbar.setVisible(false);
			    var oEventParameters = oEvent.getParameters();
			    if(oEventParameters.hasOwnProperty("newValue"))
			    	{
			    	searchText = oEventParameters.newValue;
			    	if(searchText.length < 4)
			    		return;
			    	}
			    else
			    	searchText = oEventParameters.query;
				this.contactF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
				this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
				this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
			    this.oModel.read("ContactCollection",null,{"filter" : "fullName eq '"+searchText+"'"},true,jQuery.proxy(function(odata,response)
						{
					       this.contactF4Fragment.getModel('json').setData({
					    	   ContactCollection :  response.data.results
					    	   });
					       if(response.data.results.length === 0)
					    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
						},this),
						jQuery.proxy(function(oError)
						{
							this.contactF4Fragment.getModel('json').setData({
								
								ContactCollection : []
								
							});
							 this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
						},this));
				
			},
			
			cliked : function(oEvent) {

				var acID = this.getView().byId("acsheet2");

				acID.openBy(oEvent.getSource());

			},

			onEdit : function() {
				var ctx = this.sPath;
				var ctx1 = this.byId('info').getModel('json').getData().Guid;
				
				var that = this;
				
				var oModel = this.oModel;
				
				this.sBackendVersion = cus.crm.lead.util.schema._getServiceSchemaVersion(this.oModel,"Lead");
				
				if(parseFloat(this.sBackendVersion) >= 3){
				oModel.read("EditAuthorizationCheck", null, {
					ObjectGuid :oModel.formatValue(ctx1,
					"Edm.Guid")},
						false, function(oData, resp){
							if(resp.data.EditAuthorizationCheck.ActionSuccessful == "X"){
								if(!that.fullScreenMode)
								{
								that.oRouter.navTo("edit", {
									contextPath : ctx
								}, !jQuery.device.is.phone);
								
								}
							else
								{
								that.oRouter.navTo("editFullScreen", {
									contextPath : ctx
								}, !jQuery.device.is.phone);
								
								}
							}
							else{
								sap.ca.ui.message.showMessageBox({
									type : sap.ca.ui.message.Type.ERROR,
									message : resp.data.EditAuthorizationCheck.Message,
									details : null
								});
							}		
						},null);
				}
				else{
					if(!that.fullScreenMode)
					{
					that.oRouter.navTo("edit", {
						contextPath : ctx
					}, !jQuery.device.is.phone);
					
					}
				else
					{
					that.oRouter.navTo("editFullScreen", {
						contextPath : ctx
					}, !jQuery.device.is.phone);
					
					}
				}
				
					},
			_refresh : function(channel, eventType, data) {
				sap.ca.scfld.md.controller.BaseDetailController.prototype._refresh
				.apply(this, [ channel, eventType, data ]);

			
			},

			onAccept : function() {
				
				sap.ca.ui.dialog.confirmation.open({
					question :this.oResourceBundle.getText('CONFIRM_LEAD_ACCEPT',[this.byId('info').getModel('json').getData().Description]),
					title : this.oResourceBundle.getText('S3_POSITIVE'),
					confirmButtonLabel : this.oResourceBundle.getText('OK')  	
					
				},jQuery.proxy(this.acceptLead,this));
				

		},

			acceptLead :function(oResult) {
				if(oResult.isConfirmed ===false)
					return;
				this.oModel.bRefreshAfterChange = true;
				this.bAcceptLead = true;
				
				var oModel = this.oModel;
				var id = this.byId('info').getModel('json').getData().Id;
			//	this.s2Controller.byId('list').getBinding('items').attachChange(this.s2Controller.leadAccepted,this.s2Controller);
				
				oModel.create("AcceptLead", null,
						{
					success : 
					        jQuery.proxy(function() {
					        	
					        	   
					        		this.oModel.bRefreshAfterChange = false;	
					        		this.oModel.refresh();
						            this.byId('accept').setVisible(false);
					 	            this.byId('reject').setVisible(false);
						            this.byId('edit').setVisible(true);
						            this.getDataForDetailScreen(true);

					                 },this),
					error :                  
					       jQuery.proxy(function(oError) {
						                 this.handleErrors(oError);
						                 this.bAcceptLead  = false;
						                 this.oModel.bRefreshAfterChange = false;
					                    },this),
					async : true,
					urlParameters : ["ObjectId='" + id + "'"]
						}
				);
			},

			onReject : function() {
				sap.ca.ui.dialog.confirmation.open({
					question :this.oResourceBundle.getText('CONFIRM_LEAD_REJECT',[this.byId('info').getModel('json').getData().Description]),
					title : this.oResourceBundle.getText('S3_NEGATIVE'),
					confirmButtonLabel : this.oResourceBundle.getText('OK')  	
					
				},jQuery.proxy(this.rejectLead,this));
			
			},

			rejectLead : function(oResult) {
				if(oResult.isConfirmed ===false)
					return;
				this.oModel.bRefreshAfterChange = true;
				this.bRejectLead = true;
				
				var oModel = this.oModel;
				var id = this.byId('info').getModel('json').getData().Id;
			//	this.s2Controller.byId('list').getBinding('items').attachChange(this.s2Controller.leadRejected,this.s2Controller);
				oModel.create("RejectLead",null,
						{
					success : jQuery.proxy(function() {
					        this.oModel.refresh();
							this.oModel.bRefreshAfterChange = false;
							
					},this),
					error :jQuery.proxy(function(oError) {
						this.handleErrors(oError);
						this.bRejectLead = false;
						 this.oModel.bRefreshAfterChange = false;	
					},this),
					async : true,
					urlParameters : ["ObjectId='" + id + "'"]
						}
				);

			},
			cancelPopupAccept : function() {
				this.byId("accept1").close();
			},

			cancelPopupReject : function() {
				this.byId("reject1").close();
			},
			navToEmpty : function() {
				this.oRouter.navTo("noData");
			},

			onBeforeRendering : function()
			{
				
				
				this.getView().getModel('controllers').getData().s3Controller = this;
			
				if( this.byId('info') && this.byId('info').getModel('json'))
					{
					var oHeader = this.byId('info').getModel('json').getData();
					
				if( oHeader.SystemStatusCode == 'I1002' && oHeader.EmployeeResponsibleNumber === this.EmployeeForUser){
					this.byId('accept').setVisible(true);
					this.byId('reject').setVisible(true);
					this.byId('edit').setVisible(false); 
				

				}
				else /*if( this.byId('info').getModel('json').getData().SystemStatusCode == 'I1003')*/{
					this.byId('accept').setVisible(false);
					this.byId('reject').setVisible(false);
					this.byId('edit').setVisible(true);
				

				}
				
					}
			},
             navBack : function(oEvent)
             {
            	 
            	 this.oRouter.navTo("master");
            	 
             },
             
             handleErrors : function(oError)
             {
            	// sap.ca.ui.utils.busydialog.releaseBusyDialog();
            	 jQuery.sap.log.error(JSON.stringify(oError));
            	 if(oError.hasOwnProperty("message") && oError.hasOwnProperty("response")){
            	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : oError.message,
					    details: (typeof oError.response.body == "string") ? oError.response.body : JSON.parse(oError.response.body).error.message.value
					},function(oResult){});
		    	
            	 }
            	 
             },
            handleCustomizationBatchResponses : function(oResponses)
            {
            
            	var errorMessage = "";
                var errorTitle = "";
            	var bFail = false;
            	if(oResponses.__batchResponses[0].statusCode === "200"){
					this.Origins = oResponses.__batchResponses[0].data.results;
					this.Origins.splice(0, 0, {
						LanguageCode : "",
						OriginCode : "",
						OriginText : ""
					});
					}
					else{
						
						bFail = true;
						errorTitle = oResponses.__batchResponses[0].statusText;
						errorMessage = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value +"\n";						
						this.Origins.push([{
							LanguageCode : "",
							OriginCode : "",
							OriginText : ""
							
						}]);
					}
						
					if(oResponses.__batchResponses[1].statusCode === "200"){
					this.Priorities = oResponses.__batchResponses[1].data.results;
					this.Priorities.splice(0, 0, {
						LanguageCode : "",
						PriorityCode : "",
						PriorityText : ""
					});
					}
					else
						{
						
						   bFail = true;
						   errorTitle = oResponses.__batchResponses[1].statusText;
						   errorMessage = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value +"\n";
						   this.Priorities.push([{
						    	
						    	LanguageCode : "",
						    	PriorityCode : "",
						    	PriorityText : ""
						    	
						    }]);
						
						}
					if(oResponses.__batchResponses[2].statusCode === "200"){
					this.QualificationsLevels = oResponses.__batchResponses[2].data.results;
					this.QualificationsLevels.splice(0,
							0, {
						LanguageCode : "",
						QualificationCode : "",
					});
					}
					else 
						{
						   bFail = true;
						   errorTitle = oResponses.__batchResponses[2].statusText;
						   errorMessage = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value +"\n";
						    this.QualificationsLevels.push([{
						    	
						    	LanguageCode : "",
						    	QualificationCode : ""
						    	
						    }]);
						 
						}
				
					if(bFail){
						// sap.ca.ui.utils.busydialog.releaseBusyDialog();
	            	 jQuery.sap.log.error(errorMessage);
	            	  sap.ca.ui.message.showMessageBox({
						    type: sap.ca.ui.message.Type.ERROR,
						    message : errorTitle,
						    details: errorMessage
						},function(oResult){});
					}
            	
            	
            },
            handleExpandBatchResponse : function(oResponses)
            {
            	
            	
            	
            	
            },
            
            getDataForDetailScreen : function(bShowInfoTab)
            {
            	
            	//if the app is launched read the data for drop downs - customzing data
            //	var prospectNumber = this.oModel.getContext("/" + sPath).getObject().ProsectNumber;
            	
            	
            	if(parseFloat(this.sBackendVersion) >= 4){
            		var s4Controller = this.getView().getModel("controllers").getData().s4Controller;
            		
            		if(s4Controller && s4Controller.bSuccessSave){
            			delete s4Controller.bSuccessSave;
            		}
            		else{
            			//fetch ETag if we are not navigating into this page from the edit page
            			
            			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
            		}
            	}
            	if(this.bAppLaunched)
            		{
            	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Origins","GET")]);
            	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Priorities","GET")]);
            	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("QualificationsLevels","GET")]);
 	            	   if(this.sBackendVersion >= 4.0){
 	            		  this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("EmployeeForUserSet","GET")]);
 	            		  
 	            	   }
 	            	   else{
 	            		  this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("EmployeeForUser","GET")]);
 	            	   }
            	       
            	//expand products
            	this.oModel.addBatchReadOperations([this.oModel.createBatchOperation(this.sPath+"?$expand=Products,ChangeDocs","GET")]);
            	
            	
            	if(parseFloat(this.sBackendVersion)  >= 4){
            		var oUTIL = cus.crm.lead.util.Util;
           		  if(oUTIL.getPartnerFunctions() === null){
           			  this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("PartnerFunctions","GET")]);
           		  }
            	}
            	
            	/**
				 * @ControllerHook extHookGetAdditonalCustomizing is the controller hook  that provides for fetching of additional customizing values from the backend during 
				 *                 launch of the application. The response can be handled by the controller hook extHookHandleBatchResponses. 
				 *                                   
				 * @callback cus.crm.opportunity.S3.controller~extHookGetAdditionalCustomizing
				 * @return {void}
				 */
				if (this.extHookGetAdditionalCustomizing){
					this.extHookGetAdditionalCustomizing();
				
				}

            	this.oModel.submitBatch(jQuery.proxy(this.handleBatchResponses,this),jQuery.proxy(this.handleErrors,this));
                this.bAppLaunched = false;
            		}
            	else
            		this.oModel.read(this.sPath,null,["$expand=Products,ChangeDocs"],true,jQuery.proxy(function(odata,response)
            				{
            			           this.bindInfoAndProducts(response.data,bShowInfoTab);
            			
            				},this),jQuery.proxy(this.handleErrors,this));
            	
            	// EXTENSION POINT 
				/**
				 * @ControllerHook extHookGetAdditionalData is the controller hook to fetch additional data and bind it in the 
				 *                 detail screen. 
				 * 
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookGetAdditionalData
				 * 
				 * @return {void}
				 */
				if (this.extHookGetAdditionalData){
					this.extHookGetAdditionalData();
				}
            	
            },
            
            handleBatchResponses : function(oResponses)
            {
            	//batch responses from initial launch of s3 view
            	var bFail = false;
                var errorTitle= "";
                var errorMessage= "";
               
            		this.bAppLaunched = false;
                	if(oResponses.__batchResponses[0].statusCode === "200"){
    					this.Origins = oResponses.__batchResponses[0].data.results;
    					this.Origins.splice(0, 0, {
    						LanguageCode : "",
    						OriginCode : "",
    						OriginText : ""
    					});
    					}
    					else{
    						
    						bFail = true;
    						errorTitle = oResponses.__batchResponses[0].statusText;
    						errorMessage = JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value +"\n";						
    						this.Origins.push([{
    							LanguageCode : "",
    							OriginCode : "",
    							OriginText : ""
    							
    						}]);
    					}
    						
    					if(oResponses.__batchResponses[1].statusCode === "200"){
    					this.Priorities = oResponses.__batchResponses[1].data.results;
    					this.Priorities.splice(0, 0, {
    						LanguageCode : "",
    						PriorityCode : "",
    						PriorityText : ""
    					});
    					}
    					else
    						{
    						
    						   bFail = true;
    						   errorTitle = oResponses.__batchResponses[1].statusText;
    						   errorMessage = JSON.parse(oResponses.__batchResponses[1].response.body).error.message.value +"\n";
    						   this.Priorities.push([{
    						    	
    						    	LanguageCode : "",
    						    	PriorityCode : "",
    						    	PriorityText : ""
    						    	
    						    }]);
    						
    						}
    					if(oResponses.__batchResponses[2].statusCode === "200"){
    					this.QualificationsLevels = oResponses.__batchResponses[2].data.results;
    					this.QualificationsLevels.splice(0,
    							0, {
    						LanguageCode : "",
    						QualificationCode : "",
    					});
    					}
    					else 
    						{
    						   bFail = true;
    						   errorTitle = oResponses.__batchResponses[2].statusText;
    						   errorMessage = JSON.parse(oResponses.__batchResponses[2].response.body).error.message.value +"\n";
    						    this.QualificationsLevels.push([{
    						    	
    						    	LanguageCode : "",
    						    	QualificationCode : ""
    						    	
    						    }]);
    						 
    						}
    					if(oResponses.__batchResponses[3].statusCode === "200"){
    						if(this.sBackendVersion >= 4.0){
    							this.EmployeeForUser = oResponses.__batchResponses[3].data.results[0].EmployeeResponsibleNumber;
    						}
    						else{
    							this.EmployeeForUser = oResponses.__batchResponses[3].data.EmployeeForUser.EmployeeResponsibleNumber;
    						}
        					
        					}
        					else 
        						{
        						   bFail = true;
        						   errorTitle = oResponses.__batchResponses[3].statusText;
        						   errorMessage = JSON.parse(oResponses.__batchResponses[3].response.body).error.message.value +"\n";
        						    this.QualificationsLevels.push([{
        						    	
        						    	LanguageCode : "",
        						    	QualificationCode : ""
        						    	
        						    }]);
        						 
        						}
    					if(bFail){
    						// sap.ca.ui.utils.busydialog.releaseBusyDialog();
    	            	// jQuery.sap.log.error(JSON.stringify(oError));
    	            	  sap.ca.ui.message.showMessageBox({
    						    type: sap.ca.ui.message.Type.ERROR,
    						    message : errorTitle,
    						    details: errorMessage
    						},function(oResult){var i = 0;i++;});
    					}
    			  if(oResponses.__batchResponses[4].hasOwnProperty("data"))
            	     this.bindInfoAndProducts(oResponses.__batchResponses[4].data,true);
    			  else
    				  this.handleErrors(oResponses.__batchResponses[4]);
    			  
    			  
    			  if(parseFloat(this.sBackendVersion) >= 4){
    			  if(oResponses.__batchResponses[5] && oResponses.__batchResponses[5].hasOwnProperty("data")){
    				  
    				   var oUTIL = cus.crm.lead.util.Util;
    				   oUTIL.aggregatePartnerFunctions(oResponses.__batchResponses[5].data.results);
    				   this.partnerDeterminationmap  =  oUTIL.getPartnerFunctions();
    				   
    			  }
    			  else{
    				  this.handleErrors(oResponses.__batchResponses[5]);
    			  }
    			  }
    			// EXTENSION POINT 
    				/**
    				 * @ControllerHook extHookHandleBatchResponses extHookHandleBatchResponses is the controller
					 *                 hook to handle the response of additional customizing fetch during application launch 
    				 * 
    				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookHandleBatchResponses
    				 * 
    				 * @param {object}
    				 *            oResponses
    				 * @return {void}
    				 */
    				if (this.extHookHandleBatchResponses){
    					this.extHookHandleBatchResponses(oResponses);
    				}
             
            },
            
            bindS3Header : function(data){
            	
            	var s3Header = this.byId('S3_Header');
            	   var sPath = "/AccountCollection('" + data.ProspectNumber + "')";
                  	var oLogo=  "sap-icon://person-placeholder";
   		            this.oModel.read(sPath, null, ["$expand=Logo"], false, function (odata, response) {
   		                jQuery.sap.log.info("oData account response");
   		                if (odata.Logo && odata.Logo.__metadata) {
   		                   
   		                    var oMetadata = odata.Logo.__metadata.media_src ? odata.Logo.__metadata.media_src: "sap-icon://person-placeholder";
   		                    
   		                   /* var URl = oMetadata.replace(/^https:\/\//i, 'http://');*/ 
   		                    oLogo = oMetadata.toString();
   		                  
   		                }
   		                data.ImgSrc = oLogo;
   		                if(s3Header && s3Header.getModel('json'))
   	                    	s3Header.getModel('json').setData(data);
   		              
   		         
   		            },jQuery.proxy(this.handleErrors,this));
            },
            bindInfoAndProducts : function(data,bShowInfoTab)
            {
            	//bind data fetched to info, products tab and header too 
            	
            	var infoTab = this.byId('info');
            	var productsTab = this.byId('Product_Tab');
            	
            	//save the header guid at the controller level
            	this.headerGuid = data.Guid;
            	
            	//save the transaction type of the lead at the controller level as well
            	this.transactionType = data.ProcessType;
            	
            	if(infoTab && infoTab.getModel('json'))
            		infoTab.getModel('json').setData(data);
            
            	if(productsTab && productsTab.getModel('json'))
            		productsTab.getModel('json').setData({Products : data.Products.results});
            	
            	//if there aren't any results, hide the products tab
            	if(data.Products.results.length === 0)
            		this.byId('icntab').getItems()[1].setVisible(false);
            	else
            		this.byId('icntab').getItems()[1].setVisible(true);
            	
            	if(data.ChangeDocs.results.length === 0)
            		this.byId('changelog').setVisible(false);
            	else{
            		this.byId('changelog').setVisible(true);
            		this.changeLogFragment.getModel().setData({LeadChangeDocs : data.ChangeDocs.results});
            	}
            
            		this.setFooterButtons(this.byId('info').getModel('json').getData());
            		
            		if(bShowInfoTab){
            		this.setDefaultTabToInfo();
            		}
            		this.bindS3Header(data);
            			//  sap.ca.ui.utils.busydialog.releaseBusyDialog();

            },
            
        	getBackFunction: function(){
				if (this.fullScreenMode)
					return function(){window.history.back(1);};
				else
					return undefined;
			},

            
            getS4Controller : function()
            {
            	//needed for s4 Controllers reference
            	if(!sap.ca.scfld.md.app.Application.getImpl().hasOwnProperty("oSplitContainer"))
            		return null;
            	var detailPages = sap.ca.scfld.md.app.Application.getImpl().oSplitContainer.getDetailPages();
                if(detailPages.length > 0)
                	{
                	
                	    var i;
                	    for(i=0;i<detailPages.length;i++)
                	    	if(detailPages[i].getViewName() == "cus.crm.lead.view.S4")
                	    		return detailPages[i].getController();
                	
                	}
                return null;

            },
            
            setDefaultTabToInfo : function()
            {
            	//always default the tab to info whenever the s3 view loads
            	var oTabContainer = this.byId('icntab');
				if(oTabContainer && oTabContainer.getItems().length > 0){								
					
					if (oTabContainer.getSelectedKey() !== "info")
						oTabContainer.setSelectedKey("Info");
					oTabContainer.setExpanded(true);
				
				}
            	
            	
            },
            
            setFooterButtons : function(oHeader)
            {
            	
	            //control footer buttons for accept/reject scenario
				if (oHeader.SystemStatusCode == 'I1002' && oHeader.EmployeeResponsibleNumber === this.EmployeeForUser) {
					this.byId('accept').setVisible(true);
					this.byId('reject').setVisible(true);
					this.byId('edit').setVisible(false);
					

				} else {
					this.byId('accept').setVisible(false);
					this.byId('reject').setVisible(false);
					this.byId('edit').setVisible(true);
					

				}

            	
            	
            	
            	
            	
            },
           routeMatched  : function(oEvent) {
				
        	   
        	 
				if (oEvent.getParameter("name") === "detail") {
					//if(!jQuery.device.is.phone)
					
					   this.oRouter.detachRouteMatched(this.routeMatched,this);
				      if(this.navToOtherApp)
				        {
				    	  this.navToOtherApp = false;
				    	
				    	  return;
				        }
					//if s4 controller is not null, some actions need to be done based on actions in s4View
					var s4Controller = this.getS4Controller();
					
					if(s4Controller && s4Controller.bCancel)
						{
						    s4Controller.bCancel = false;
						    this.setDefaultTabToInfo();
						    return;
						}
					if(s4Controller && s4Controller.bEmployeeUpdateSuccess){
						s4Controller.bEmployeeUpdateSuccess = false;
						this.oModel.refresh();
						
					}
					//avoiding needless roundtrips if the details page changes
					this.byId('S3_Header').setIcon("sap-icon://person-placeholder");
					
					//sPath stored at s3 controller for further reference
					this.sPath = oEvent.getParameter("arguments").contextPath;
					
					//loading data for s3View
					//sap.ca.ui.utils.busydialog.requireBusyDialog();
					
						
					this.getDataForDetailScreen(true);
				
					
			
				}
				
				else 
					
					
					if (oEvent.getParameter("name") === "display") {
						//if(!jQuery.device.is.phone)
						this.fullScreenMode = true;
						
						this.byId('detailPage').setShowNavButton(true);
						
						
						   this.oRouter.detachRouteMatched(this.routeMatched,this);
					      if(this.navToOtherApp)
					        {
					    	  this.navToOtherApp = false;
					    	
					    	  return;
					        }
						//if s4 controller is not null, some actions need to be done based on actions in s4View
						var s4Controller = this.getS4Controller();
						
						if(s4Controller && s4Controller.bCancel)
							{
							    s4Controller.bCancel = false;
							    this.setDefaultTabToInfo();
							    return;
							}
						if(s4Controller && s4Controller.bEmployeeUpdateSuccess){
							s4Controller.bEmployeeUpdateSuccess = false;
							this.oModel.refresh();
							
						}
						//avoiding needless roundtrips if the details page changes
						this.byId('S3_Header').setIcon("sap-icon://person-placeholder");
						
						//sPath stored at s3 controller for further reference
						this.sPath = oEvent.getParameter("arguments").contextPath;
						
						//loading data for s3View
						//sap.ca.ui.utils.busydialog.requireBusyDialog();
						
							
						this.getDataForDetailScreen(true);
					
						
				
					}
					
			},
			onRenameFile : function(oEventData)
            {
                           
                            var newFileName = oEventData.getParameters().newFilename;
                                var fileId  = oEventData.getParameters().fileId;
                                var obj = {
                                                           
                                                            "newFileName" : newFileName + "",
                                                            "fileId"  : fileId +""
                                                           
                                };
                             
                                
                                
                                var Parameters = oEventData.getParameters();
                                            var URL = Parameters.media_src;
                           
                                            var removStartVal;
                                            if(!URL)
                                         removStartVal = Parameters.url.split("(").pop();
                                            else 
                                          	  removStartVal = URL.split("(").pop();
                                            var sPath = "LeadAttachments(";
                                            var url = sPath + removStartVal;
                                            this.oModel.setHeaders(obj);
                                            this.oModel
                                            .addBatchChangeOperations([ this.oModel
                                                                            .createBatchOperation(
                                                                                                            url, "PUT",obj,null) ]);
                                           
                                           
                                            /*var oParams = {};
                                            oParams.fnSuccess = function(){ alert("Update successful");  };
                                            oParams.fnError = function(){alert("Update failed");};
                                           
                                            this.oModel.setHeaders(obj);
                                            this.oModel.update(url,obj,oParams);
                               this.onSaveClicked();
                              
                               */
                           
                                           
                              // this.onSaveClicked();
                               
                                
                           
            },
           
            onSaveClicked : function(forceSave) {
                  //save to server here and determine success
                   this.oModel.submitBatch();

                  var ETagStr = null;
                  if(forceSave)
                	  ETagStr = "*";
                  var success = true;
           
                  var fileUploadControl = this.byId("fileupload");
           
                  if (success) {
                     fileUploadControl.commitPendingRenames();
                  } else {
                     fileUploadControl.abandonPendingRenames();
                  }
              },
              
              handleAddParticipantsBatchResponses : function(oResponses){
            	     var errorMessage = "";
            	     var bFail = false;
            	     if(oResponses.__batchResponses[0].hasOwnProperty("__changeResponses")){
                     var aChangeSetResponses = oResponses.__batchResponses[0].__changeResponses;
                     
                        for(var i = 0; i < aChangeSetResponses.length;i++){
                        	if(parseInt(aChangeSetResponses[i]) >= 400 ){
                        		bFail = true;
                        		errorMessage += (aChangeSetResponses[i].response.body).error.message.value +"\n";
                        	}
                        }
                        
                        if(bFail){
                        	  sap.ca.ui.message.showMessageBox({
          					    type: sap.ca.ui.message.Type.ERROR,
          					    message : this.oResourceBundle.getText('PARTIAL_SAVE'),
          					    details: errorMessage
          					},function(){});

                        }
            	     }
                     
                     
              },
              onAccountBusCardLaunch : function(oEvt){

					var accountId = oEvt.getSource().data("PartnerNumber");
					var Image = oEvt.getSource().data("Image");
					var oModel = this.oModel;
					var event = oEvt.getSource();
					if (accountId)  
					{
					var sPath = "AccountCollection(accountID='"+ accountId + "')?$expand=MainAddress,MainContact/WorkAddress,MainContact" ; 
					 
					var aBatchReads = [];
					
					
						aBatchReads.push(oModel.createBatchOperation(sPath,"GET"));       



					oModel.addBatchReadOperations(aBatchReads);
					
					
					oModel.submitBatch(jQuery.proxy(function(oResponses){
						
						var oMainContact = { Value : "" } ;
						oMainContact.Value = oResponses.__batchResponses[0].data ;
						
							
						var fnCallbackNavParaComp = jQuery.proxy(function(oEvent){
							 
								var oNavConfig = {};
								oNavConfig.target = {};
								oNavConfig.target.semanticObject = "Account";
								oNavConfig.target.action = "MyAccounts&/detail/AccountCollection('" + accountId + "')";
								
								this.navToOtherApp = true;
								 	
								return oNavConfig;
	                           
								
                  		 
						 },this); 
						 

					
						
						
						if (oMainContact.Value.MainContact) 
						{	
							if (oMainContact.Value.MainContact.WorkAddress) 

							{   
								if(oMainContact.Value.MainAddress) {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											companyphone : oMainContact.Value.MainAddress.phone,
											companyaddress : oMainContact.Value.MainAddress.address,
											maincontactname : oMainContact.Value.MainContact.fullName,
											maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
											maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
											maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
											maincontactemailsubj : "Automatic Mail for Maincontact",
										    beforeExtNav:fnCallbackNavParaComp,
									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);
								} 

								else {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,

											maincontactname : oMainContact.Value.MainContact.fullName,
											maincontactmobile : oMainContact.Value.MainContact.WorkAddress.mobilePhone,
											maincontactphone : oMainContact.Value.MainContact.WorkAddress.phone,
											maincontactemail : oMainContact.Value.MainContact.WorkAddress.email,
											maincontactemailsubj : "Automatic Mail for Maincontact",
											beforeExtNav:fnCallbackNavParaComp,
									};
									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);

								}

							}	

							else
							{
								if(oMainContact.Value.MainAddress) {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											companyphone : oMainContact.Value.MainAddress.phone,
											companyaddress : oMainContact.Value.MainAddress.address,
											maincontactname : oMainContact.Value.MainContact.fullName,
											beforeExtNav:fnCallbackNavParaComp,

									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);



								}

								else {

									var oCompanycard = {
											title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
											imgurl : Image,
											companyname : oMainContact.Value.name1,
											maincontactname : oMainContact.Value.MainContact.fullName,
											beforeExtNav:fnCallbackNavParaComp,

									};

									var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
											oCompanycard);
									oCompanyLaunch.openBy(event);


								}


							}

						}

						else {

							if(oMainContact.Value.MainAddress) {

								var oCompanycard = {
										title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
										imgurl : Image,
										companyname : oMainContact.Value.name1,
										companyphone : oMainContact.Value.MainAddress.phone,
										companyaddress : oMainContact.Value.MainAddress.address,
										beforeExtNav:fnCallbackNavParaComp,

								};

								var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
										oCompanycard);
								oCompanyLaunch.openBy(event);



							}
							else  {



								var oCompanycard = {
										title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ACCOUNT'),
										imgurl : Image,
										companyname : oMainContact.Value.name1,
										beforeExtNav:fnCallbackNavParaComp,


								};

								var oCompanyLaunch = new sap.ca.ui.quickoverview.CompanyLaunch(
										oCompanycard);
								oCompanyLaunch.openBy(event);
							}


						}

					},this),jQuery.proxy(
							function(oError){

								sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('ERROR'));
								
							},this),true);

				} 
					
						
				
              }
              
                  
			
			
            
		
		});

},
	"cus/crm/lead/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View id="detailView" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="cus.crm.lead.view.S3" xmlns:html="http://www.w3.org/1999/xhtml"\n\txmlns:ca="sap.ca.ui" xmlns:layout="sap.ui.layout" xmlns:ui="sap.ui.layout.form">\n\n\n\n\t<Page id="detailPage" title="{i18n>DETAIL_TITLE}" navButtonPress="getBackFunction"\n\t\tshowNavButton="{path :\'json>/ProspectNumber\',formatter: \'cus.crm.lead.util.formatter.showNavButton\'}">\n\t\t<content>\n\t\t    <!-- extension to add custom lead header -->\n\t\t\t<core:ExtensionPoint name="leadHeaderTopExtension">\n\t\t\t\t<ObjectHeader id="S3_Header" title="{json>/Description}"\n\t\t\t\t\ticon="{json>/ImgSrc}">\n\t\t\t\t\t<attributes>\n\t\t\t\t\t<!--  extension to add more attributes to the lead header -->\n\t\t\t\t\t\t<core:ExtensionPoint name="leadHeaderAttributeTopExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t<ObjectAttribute id="leadProspectName" text="{json>/ProspectName}"\n\t\t\t\t\t\t\tactive="true" press="onEmployeeLaunch">\n\n\t\t\t\t\t\t\t<customData>\n\t\t\t\t\t\t\t\t<core:CustomData key="PartnerNumber" value="{json>/ProspectNumber}" />\n\t\t\t\t\t\t\t\t<core:CustomData key="PartnerFunctionCode"\n\t\t\t\t\t\t\t\t\tvalue="00000021" />\n\t\t\t\t\t\t\t\t<core:CustomData key="Image" value="{json>/ImgSrc}" />\n\t\t\t\t\t\t\t</customData>\n\t\t\t\t\t\t</ObjectAttribute>\n\t\t\t\t\t\t<ObjectAttribute id="leadMainContact" text="{json>/MainContactName}"\n\t\t\t\t\t\t\tactive="true" press="onEmployeeLaunchheader">\n\n\t\t\t\t\t\t\t<customData>\n\t\t\t\t\t\t\t\t<core:CustomData key="PartnerNumber" value="{json>/MainContactId}" />\n\t\t\t\t\t\t\t\t<core:CustomData key="PartnerFunctionCode"\n\t\t\t\t\t\t\t\t\tvalue="00000015" />\n\t\t\t\t\t\t\t\t<core:CustomData key="Image" value="{json>/ImgSrc}" />\n\t\t\t\t\t\t\t</customData>\n\n\n\t\t\t\t\t\t</ObjectAttribute>\n                        <!-- extension to add more attributes below the standard provided attributes of the lead header -->\n\t\t\t\t\t\t<core:ExtensionPoint name="leadHeaderAttributeBottomExtension"></core:ExtensionPoint>\n\t\t\t\t\t</attributes>\n\n\t\t\t\t</ObjectHeader>\n\t\t\t</core:ExtensionPoint>\n\t\t\t<IconTabBar id="icntab" select="selectedTab">\n\t\t\t\t<items>\n\t\t\t\t<!--  extension to add content to in the icon tab bar -->\n\t\t\t\t\t<core:ExtensionPoint name="leadTabBarItemFirstExtension"></core:ExtensionPoint>\n\t\t\t\t\t<IconTabFilter id="info" text="{i18n>INFO}" icon="sap-icon://hint"\n\t\t\t\t\t\tkey="Info">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t<!--  extension to add more fields to the info tab -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="leadInfoTabContentTopExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t<ui:SimpleForm id="leadId_form">\n\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t<Label id="leadType_label" text="{i18n>LEAD_TYPE}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="leadType_text" text="{json>/ProcessTypeDescription}"></Text>\n\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t<Label id="leadId_label" text="{i18n>LEAD_ID}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="leadId_text" text="{json>/Id}"></Text>\n\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t</ui:SimpleForm>\n\n\t\t\t\t\t\t\t<ui:SimpleForm id="lead_Date">\n\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t<Label id="lead_start_date_label" text="{i18n>START_DATE}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_start_date_text"\n\t\t\t\t\t\t\t\t\t\ttext="{path: \'json>/StartDate\', formatter: \'cus.crm.lead.util.formatter.formatDate\'}"></Text>\n\t\t\t\t\t\t\t\t\t<Label id="lead_end_date_label" text="{i18n>END_DATE}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_end_date_text"\n\t\t\t\t\t\t\t\t\t\ttext="{path: \'json>/EndDate\', formatter: \'cus.crm.lead.util.formatter.formatDate\'}"></Text>\n\n\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t</ui:SimpleForm>\n\n\t\t\t\t\t\t\t<ui:SimpleForm id="lead_Origin">\n\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t<Label id="lead_origin_label" text="{i18n>ORIGIN}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_origin_text" text="{json>/OriginText}"></Text>\n\t\t\t\t\t\t\t\t\t<Label id="lead_campaign_label" text="{i18n>CAMPAIGN}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_campaign_text"\n\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path : \'json>/CampaignId\'},{path : \'json>/CampaignDescription\'}],formatter :\'cus.crm.lead.util.formatter.formatCampaign\'}"></Text>\n\t\t\t\t\t\t\t\t</ui:content>\n\n\t\t\t\t\t\t\t</ui:SimpleForm>\n\n\n\n\t\t\t\t\t\t\t<ui:SimpleForm id="lead_Priority">\n\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t<Label id="lead_priority_label" text="{i18n>PRIORITY}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_priority_text" text="{json>/PriorityText}"></Text>\n\t\t\t\t\t\t\t\t\t<Label id="lead_qualification_label" text="{i18n>QUALIFICATION}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_qualification_text" text="{json>/QualificationText}"></Text>\n\t\t\t\t\t\t\t\t\t<Label id="lead_status_label" text="{i18n>STATUS}"></Label>\n\t\t\t\t\t\t\t\t\t<Text id="lead_status_text" text="{json>/UserStatusText}"></Text>\n\n\t\t\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t\t</ui:SimpleForm>\n\n\n\t\t\t\t\t\t\t<ui:SimpleForm id="leadChangeLog">\n\t\t\t\t\t\t\t\t<ui:content>\n\t\t\t\t\t\t\t\t\t<Label id="lead_change_log_label" text="{i18n>CHANGE_LOGS}"></Label>\n\t\t\t\t\t\t\t\t\t<Link id="changelog" text="{i18n>VIEW}" press="onLogChange"\n\t\t\t\t\t\t\t\t\t\twidth="30%"></Link>\n\t\t\t\t\t\t\t\t</ui:content>\n\n\n\t\t\t\t\t\t\t</ui:SimpleForm>\n\n\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\n\n\t\t\t\t\t<IconTabFilter id="icnTabProduct" text="{i18n>PRODUCT}"\n\t\t\t\t\t\ticon="sap-icon://cart" key="Product">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t     <!-- extension to add more content along with the products table -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="leadProductTabContentExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t<Table id="Product_Tab" items="{json>/Products}" width="95%"\n\t\t\t\t\t\t\t\tnoDataText="{i18n>EMPTY_BASKET}">\n\t\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t<!--  extension to add more columns to the products table -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="leadProductTabColoumExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t\t\t<Column id="basketColumn1_S3" vAlign="Middle">\n\t\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t\t<Label id="productLabel_S3" text="{i18n>PRODUCT}"></Label>\n\t\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\t<Column id="basketColumn2_S3" vAlign="Middle" hAlign="Right">\n\t\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t\t<Label id="quantityLabel_S3" text="{i18n>QUANTITY}"></Label>\n\t\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t\t<ColumnListItem id="rowTemplate">\n\t\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t\t\t<ObjectIdentifier id="lead_Product_Name"\n\t\t\t\t\t\t\t\t\t\t\t\ttitle="{path : \'json>ProductGuid\', formatter : \'cus.crm.lead.util.formatter.formatProductNameJson\'}"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{path: \'json>ProductGuid\',formatter : \'cus.crm.lead.util.formatter.formatProdClassificationJson\'}">\n\t\t\t\t\t\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t\t\t\t\t\t<Text id="lead_product_quantity"\n\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'json>Quantity\'}, {path:\'json>Unit\'}], formatter:\'cus.crm.lead.util.formatter.formatQuantity\'}"\n\t\t\t\t\t\t\t\t\t\t\t\ttextAlign="Left"></Text>\n\t\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t\t</ColumnListItem>\n\n\t\t\t\t\t\t\t\t</items>\n\n\t\t\t\t\t\t\t</Table>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\n\t\t\t\t\t<!-- Changes in Notes Tab with the FeedInput control -->\n\t\t\t\t\t<IconTabFilter id="tab_notes" text="{i18n>NOTES}"\n\t\t\t\t\t\ticon="sap-icon://notes" key="Notes">\n\t\t\t\t\t\t<FeedInput id="Notes" textMaxLength="1000" text="{json>Content}"\n\t\t\t\t\t\t\tpost="_handleAddNote" showIcon="true" icon="{json>icon}"\n\t\t\t\t\t\t\tmaxLines="3">\n\t\t\t\t\t\t</FeedInput>\n\t\t\t\t\t\t<List id="listItem" growing="true"\n\t\t\t\t\t\t\tgrowingThreshold="4" growingScrollToLoad="false" items="{json>/LeadNotes}">\n\t\t\t\t\t\t\t<FeedListItem sender="{path : \'json>Creator\'}"\n\t\t\t\t\t\t\t\tsenderActive="false"\n\t\t\t\t\t\t\t\ttimestamp="{path : \'json>CreatedAt\', formatter : \'cus.crm.lead.util.formatter.formatDate\'}"\n\t\t\t\t\t\t\t\ttext="{path : \'json>Content\'}" />\n\t\t\t\t\t\t</List>\n\n\t\t\t\t\t</IconTabFilter>\n\n\n\n\t\t\t\t\t<IconTabFilter id="icnTabAttachment" text="{i18n>ATTACHMENT}"\n\t\t\t\t\t\ticon="sap-icon://attachment" key="Attachment">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<ca:FileUpload id="fileupload" items="/LeadsAttachments"\n\t\t\t\t\t\t\t\turl="url" size="size" fileName="name" acceptRequestHeader="application/json"\n\t\t\t\t\t\t\t\tuploadedDate="uploadedDate" contributor="contributor" fileId="fileId"\n\t\t\t\t\t\t\t\trenameEnabled="true" renameFile="onRenameFile" saveClicked="onSaveClicked"\n\t\t\t\t\t\t\t\tuseMultipart="false" uploadUrl="/sap/opu/odata/sap/CRM_LEAD/LeadAttachments"\n\t\t\t\t\t\t\t\txsrfToken="" fileExtension="fileExtension" useEditControls="true"\n\t\t\t\t\t\t\t\tuploadEnabled="true" uploadFile="onUploadFile" deleteFile="onDeleteFile"></ca:FileUpload>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<IconTabFilter id="salesTeam" text="{i18n>SALES_TEAM}"\n\t\t\t\t\t\tkey="Team" icon="sap-icon://group" iconColor="Neutral">\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t<!-- extension to add more content to the participants tab  -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="leadSalesTabCellsExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t<Table id="salesteam" noDataText="{i18n>NOPARTIES}" text="{i18n>TEAM}"\n\t\t\t\t\t\t\t\titems="{json>/LeadSalesTeamSet}">\n\n\t\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t\t<Column id="salesTeamColumn1" width="15%" />\n\t\t\t\t\t\t\t\t\t<Column id="salesTeamColumn2" width="75%" />\n\t\t\t\t\t\t\t\t\t<Column id="salesTeamColumn3" width="10%" />\n\t\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t\t<ColumnListItem id="salesTeamTemplate_S3">\n\t\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t\t<!-- extension to add more cells to the participant list item -->\n\t\t\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="leadSalesTabCellsExtension">\n\t\t\t\t\t\t\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t\t\t\t\t\t\t\t<ObjectHeader id="salesTeamHeader" icon="{json>ImgSrc}" />\n\t\t\t\t\t\t\t\t\t\t\t<layout:VerticalLayout id="salesTeamVLayout"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="ImagePadding">\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Link id="EmpLink"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{path : \'json>PartnerName\', formatter : \'cus.crm.lead.util.formatter.formatBusinessCardCaller\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<customData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<core:CustomData key="PartnerNumber"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalue="{json>PartnerNumber}" />\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<core:CustomData key="PartnerFunctionCode"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalue="{json>PartnerFunctionCode}" />\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<core:CustomData key="Image" value="{json>ImgSrc}" />\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</customData>\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Link>\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:HorizontalLayout id="salesTeamHLayout">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="salespartnerFunction_Label" text="{i18n>PARTNERFUNCTION}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdesign="Bold"></Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Text id="salespartnerFunction_text"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{path: \'json>PartnerFunctionText\', formatter:\'cus.crm.lead.util.formatter.PARTNERFUNCTION_Label\'}"></Text>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layout:HorizontalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectStatus id="callIcon" icon="sap-icon://outgoing-call"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{json>MobileNumber}"></ObjectStatus>\n\t\t\t\t\t\t\t\t\t\t\t\t</layout:content>\n\n\t\t\t\t\t\t\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t<Button id="participantDeleteButton" type="Transparent"\n\t\t\t\t\t\t\t\t\t\t\t\ticon="sap-icon://decline" press="onDeleteParticipant"\n\t\t\t\t\t\t\t\t\t\t\t\tvisible="{path : \'json>PartnerFunctionCode\', formatter : \'cus.crm.lead.util.formatter.formatParticipantDelete\'}"></Button>\n\t\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t\t</ColumnListItem>\n\n\t\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t\t</Table>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</IconTabFilter>\n\t\t\t\t\t<!-- extension to add more content to the icon tab bar -->\n\t\t\t\t\t<core:ExtensionPoint name="leadTabBarItemLastExtension">\n\t\t\t\t\t</core:ExtensionPoint>\n\t\t\t\t</items>\n\n\t\t\t</IconTabBar>\n\t\t</content>\n\t\t<footer id="footer">\n\t\t\t<Bar id="detailFooter" enableFlexBox="true">\n\n\t\t\t\t<contentRight>\n\t\t\t\t\t<Button id="edit" text="{i18n>S3_EDIT}" press="onEdit"\n\t\t\t\t\t\tvisible="true" enable="false" type="Emphasized"></Button>\n\t\t\t\t\t<Button id="accept" text="{i18n>S3_POSITIVE}" press="onAccept"\n\t\t\t\t\t\tvisible="true" enable="false" type="Accept"></Button>\n\t\t\t\t\t<Button id="reject" text="{i18n>S3_NEGATIVE}" press="onReject"\n\t\t\t\t\t\tvisible="true" enable="false" type="Reject"></Button>\n\n\t\t\t\t</contentRight>\n\n\t\t\t</Bar>\n\n\t\t</footer>\n\t\t<!-- <footer> <Bar> </Bar> </footer> -->\n\t</Page>\n\n\n\t<!-- <Dialog title="{i18n>CHANGE_LOGS}" id="logchange" placement="Top"> \n\t\t<content> <List id="ChangeLog" noDataText="{i18n>NO_LOG}" items="{json>/LeadChangeDocs}"> \n\t\t<items> <ca:ExpansibleFeedListItem id="dproduct1" showIcon="false" sender="{json>PartnerName}" \n\t\ttext="{parts:[{path:\'json>UpdateFieldText\'},{path: \'i18n>FROM\'},{path:\'json>OldValue\'}, \n\t\t{path:\'i18n>TO\'},{path: \'json>NewValue\'}], formatter: \'cus.crm.lead.util.formatter.formatChangeLog\'}" \n\t\ttimestamp="{path: \'json>UpdateDate\', formatter:\'cus.crm.lead.util.formatter.formatDate\'}"> \n\t\t</ca:ExpansibleFeedListItem> </items> </List> </content> <beginButton> <Button \n\t\ttext="{i18n>OK}" press="onCancelLogChange"></Button> </beginButton> </Dialog> -->\n\n</core:View>\t\n\t\n',
	"cus/crm/lead/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */

jQuery.sap.require("sap.ca.ui.message.message");	
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.DatePicker");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("cus.crm.lead.util.formatter");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("cus.crm.lead.util.schema");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("cus.crm.lead.util.Util");
sap.ca.scfld.md.controller.BaseDetailController.extend("cus.crm.lead.view.S4",{	
	//
	
	deleteBuffer : [],//to manage the objects that are to be deleted in the backend
	headerGuid : 0,
	userStatusCode : 0,
	UserStatuses : [],
	HeaderObject : {},
	accountObject : {},
    oSelectedAccount : {},
	oSelectedContact : {
		contactID : ""
	},
	oSelectedEmployee : {
		employeeID : ""
	},
	oMainPartner : {
		PartnerNumber : ""
	},
	currentDescription : "",
	currentQuantity : "",
	BackendProducts : {},
	requestNumber : 0,
	changeSetMapping : { HEADER : "",
		                 STATUS : "",
		                 CONTACT : "",
		                 BASKET : "",
	},	
	bBasketUpdate : false,
	bNavOnUpdate : false,
	oModel : {},
	sentStartDate : null,	
	sentEndDate : null,
    bHeaderUpdateSuccess : false,
    bStatusUpdateSuccess : false,	
    bContactUpdateSuccess : false,
    bCancel : false,
   onInit : function()
	{
	  
	   
	   
	sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
	jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("cus.crm.lead.css.Leads",".css"),"sap-ui-theme-sap.crm.lead");
		
	
	 
	//custom data for datepickers
	 this.byId('datePickerStartDate').addCustomData(new sap.ui.core.CustomData({key : "OldValue"}));
	 this.byId('datePickerEndDate').addCustomData(new sap.ui.core.CustomData({key : "OldValue"}));
	 
	 
	 this.oModel = this.getView().getModel();
	 
	 //interoperability with various backend versions 
	 var sBackendVersion = cus.crm.lead.util.schema._getServiceSchemaVersion(this.oModel,"Lead");
	 this.sBackendVersion = sBackendVersion;
	 this.oVersioningModel = new sap.ui.model.json.JSONModel({BackendSchemaVersion : sBackendVersion});
	 this.oVersioningModel.updateBindings();
	 this.getView().setModel(this.oVersioningModel,"versioning");
	 
	 //the entire view is backed by jsonmodel
	 this.getView().setModel(new sap.ui.model.json.JSONModel(),"json");
	 
	  //saving references of application implementation, i18n model and resource bundle for fast access   
	  this.oAppImpl = sap.ca.scfld.md.app.Application.getImpl();
	  this.oI18nModel = this.oAppImpl.AppI18nModel;
	  this.oResourceBundle = this.oI18nModel.getResourceBundle();
	  
	  //date formatter for this controller - locale specific formatting of dates
	  this.oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},new sap.ui.core.Locale(this.oAppImpl.getResourceBundle().sLocale));
	  
	  
	  	
	  //callback for "edit" pattern
	  this.oRouter.attachRouteMatched(jQuery.proxy(function(oEvent)
			  {
		  if (oEvent.getParameter("name") === "edit" )
			  {
			  this.fullScreenMode = false;
			  this.sPath = oEvent.getParameter('arguments').contextPath;
			       // all data from s3 screen is bound here 
		           this.bindEditView(false);
		         
			  }
		  
		  else if( oEvent.getParameter("name") === "editFullScreen")
			  {
			  this.sPath = oEvent.getParameter('arguments').contextPath;
			  this.fullScreenMode = true;
			  this.bindEditView(false);
			  }
		  
			  },this));
			  
	  
	  //change events for date pickers
	  this.byId('datePickerEndDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
			  {
		 
		       this.setValueState(sap.ui.core.ValueState.None);	        	  
			  },this.byId('datePickerEndDate')));
	  
	  this.byId('datePickerStartDate').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent)
			  {
		      
		           this.setValueState(sap.ui.core.ValueState.None);   
			  },this.byId('datePickerStartDate')));
	  
	  this.byId('datePickerEndDate').attachChange(null,function(oEvent){
		  
		  var dateString= oEvent.getParameter('newYyyymmdd');
		  if(dateString !== null){
		  var tempDate = new Date(parseInt(dateString.substr(0,4)),
				                  parseInt(dateString.substr(4,2) - 1),
				                  parseInt(dateString.substr(6,2)));
	     this.byId('datePickerEndDate').setValue(this.oDateFormatter.format(tempDate));   
		  }
		 this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
		 this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
		  
	  },this);
	  this.byId('datePickerStartDate').attachChange(null,function(oEvent){
		  this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
		  this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
		  
		  var dateString= oEvent.getParameter('newYyyymmdd');
		  
		  if(dateString !== null){
		  var tempDate = new Date(parseInt(dateString.substr(0,4)),
				                  parseInt(dateString.substr(4,2) - 1),
				                  parseInt(dateString.substr(6,2)));
		this.byId('datePickerStartDate').setValue(this.oDateFormatter.format(tempDate));  
		  }
	  },this);
	  
	 
	  //MainContact responds to enter/return key press
	  this.byId('inputMainContact').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent){
		  
		          if(oEvent.keyCode === 13){
		        	  this.showContactF4({});
		          }
		          else{
		        	  
		          }
		  
	  },this));
	  
	  //employee field responds too!
	  this.byId('inputEmpResponsible').attachBrowserEvent("keydown",jQuery.proxy(function(oEvent){
		    
		     if(oEvent.keyCode === 13){
		    	 this.showEmployeeF4({});
		     }
		  
	  },this));
	  //json model for product basket
	   this.byId('productBasketEdit').getModel('json').setSizeLimit(500);
	   //  this.oTableFragment.setModel(new sap.ui.model.json.JSONModel());
	   // this.oTableFragment.getModel().setSizeLimit(500);
	
	   //json models for dropdowns 
//	  this.byId('selectOrigin').setModel(new sap.ui.model.json.JSONModel(),"json");
//	  this.byId('selectPriority').setModel(new sap.ui.model.json.JSONModel(),"json");
//	  this.byId('selectQualification').setModel(new sap.ui.model.json.JSONModel(),"json");
//	  this.byId('selectStatus').setModel(new sap.ui.model.json.JSONModel(),'json');
//	  this.byId('selectStatus').mBindingInfos['items'].path = "/Statuses"; //workaround
	  this.bNav = false;
	   
	 
	},
	
	onBeforeRendering : function(){
		
		this.getView().getModel('controllers').getData().s4Controller = this;
		
		
		 //saving a reference of s3 controller 
		 this.s3Controller = this.getView().getModel('controllers').getData().s3Controller;
		 
		 //saving of reference of s4 controller in s3 controller 
		 if(this.s3Controller){
		 this.s3Controller.s4Controller = this;
		 }
		//saving refernce of s4 controller in s2 controller as well
		
		 
		 var s2Controller = this.getView().getModel('controllers').getData().s2Controller;
		 if(s2Controller){
		
			 s2Controller.s4Controller = this;
			 //saving reference of s2 controller over here in s4
			 this.s2Controller = s2Controller;
		 }
		
		
	},
	
	onCancel : function()
	{

        // check if pageNeeds update - throw data loss pop-up if it is the case
		if(this.pageNeedsUpdate()){
	   
	    		
		 sap.ca.ui.dialog.confirmation.open({
	 			question :this.oResourceBundle.getText('DATA_LOSS'),
	 			title : this.oResourceBundle.getText('WARNING'),
	 			confirmButtonLabel : this.oResourceBundle.getText('CONTINUE')  	
	 			
	 		},jQuery.proxy(this.datalossDismissed,this));
		 
		}
		else //simulating continue of dataloss dismiss - simlar to cancelling without any changes made in the page
              this.datalossDismissed({isConfirmed : true});	
		
		//always clear the batch constructed by pageNeedsUpdate
		this.oModel.clearBatch();
			
	
	
	},
     datalossDismissed : function(oResult){
		
		//if the user discards changes clear all buffers in s4 controler
		if(oResult.isConfirmed){
		
	    //clearing buffers
	    this.deleteBuffer = [];
		
	    var s3Controller = this.getDetailController();
	    
	    if(s3Controller === null){
	    	window.history.go(-1);
	    	return;
	    }
	    // user selected cancel - navigate to s3 screen
		this.bCancel = true;
		
		
		
		var ctx = "Leads(guid'" + this.headerGuid +"')";
		
		  
		 this.oRouter.attachRouteMatched(this.s3Controller.routeMatched,this.s3Controller);	
		  
		
		if(!jQuery.device.is.phone){
			  
			  		if(!this.fullScreenMode)
                this.oRouter.navTo("detail", {contextPath : ctx },true);
			  		else  this.oRouter.navTo("display", {contextPath : ctx },true);
		}
		
		else
		   this._navBack();
	       
		}
		
		
	},
	
	handleBatchReads : function(aResponses){

    	//batch responses from initial launch of s3 view
		var data = {};
    	var bFail = false;
        var errorTitle= "";
        var errorMessage= "";
        
    		
        	if(aResponses.__batchResponses[0].statusCode === "200"){
				this.Origins = aResponses.__batchResponses[0].data.results;
				this.Origins.splice(0, 0, {
					LanguageCode : "",
					OriginCode : "",
					OriginText : ""
				});
				}
				else{
					
					bFail = true;
					errorTitle = aResponses.__batchResponses[0].statusText;
					errorMessage = JSON.parse(aResponses.__batchResponses[0].response.body).error.message.value +"\n";						
					this.Origins.push([{
						LanguageCode : "",
						OriginCode : "",
						OriginText : ""
						
					}]);
				}
				
        	
        	
				if(aResponses.__batchResponses[1].statusCode === "200"){
				this.Priorities = aResponses.__batchResponses[1].data.results;
				this.Priorities.splice(0, 0, {
					LanguageCode : "",
					PriorityCode : "",
					PriorityText : ""
				});
				}
				else
					{
					
					   bFail = true;
					   errorTitle = aResponses.__batchResponses[1].statusText;
					   errorMessage = JSON.parse(aResponses.__batchResponses[1].response.body).error.message.value +"\n";
					   this.Priorities.push([{
					    	
					    	LanguageCode : "",
					    	PriorityCode : "",
					    	PriorityText : ""
					    	
					    }]);
					
					}
				if(aResponses.__batchResponses[2].statusCode === "200"){
				this.QualificationsLevels = aResponses.__batchResponses[2].data.results;
				this.QualificationsLevels.splice(0,
						0, {
					LanguageCode : "",
					QualificationCode : "",
				});
				}
				else 
					{
					   bFail = true;
					   errorTitle = aResponses.__batchResponses[2].statusText;
					   errorMessage = JSON.parse(aResponses.__batchResponses[2].response.body).error.message.value +"\n";
					    this.QualificationsLevels.push([{
					    	
					    	LanguageCode : "",
					    	QualificationCode : ""
					    	
					    }]);
					 
					}
				if(bFail){
					// sap.ca.ui.utils.busydialog.releaseBusyDialog();
            	// jQuery.sap.log.error(JSON.stringify(oError));
            	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : errorTitle,
					    details: errorMessage
					},function(oResult){var i = 0;i++;});
				}
				
				
		  if(aResponses.__batchResponses[3].hasOwnProperty("data")){
    	      data  = aResponses.__batchResponses[3].data;
    	      var aProducts = data.Products.results;
    	      var aStatuses = data.Statuses.results;
    	      delete data.Products;
    	      delete data.Statuses;
    	      data.Products = this._cloneProducts({Products : aProducts}).Products;
    	      data.Statuses = aStatuses;
    	      data.Origins = this.Origins;
			  data.Priorities = this.Priorities;
			  data.QualificationsLevels = this.QualificationsLevels;
    	      this.bindHeaderFormsExceptMainContact(data, false);
		  }
		  else
			  this.handleErrors(aResponses.__batchResponses[3]);
		  
	
	},
	
	
	getDetailController : function()
	{
		//get controller for detail page - utility function
		return this.getView().getModel('controllers').getData().s3Controller;
	},
	
	_cloneProducts : function(oProducts){
		var oProductsClone;
		
		if(oProducts.Products){
		
		oProductsClone = JSON.parse(JSON.stringify(oProducts));
		for(var i= 0;i<oProductsClone.Products.length;i++)
     	{
     	 if(oProductsClone.Products[i].ProductGuid === null)
     		 oProductsClone.Products[i].Backend = "CATEGORY";
          else
     	     oProductsClone.Products[i].Backend = "X";
     	  oProductsClone.Products[i].OldValue = oProductsClone.Products[i].Quantity;
     	  this.BackendProducts[oProductsClone.Products[i].ItemGuid] = JSON.parse(JSON.stringify(oProductsClone.Products[i]));
     	}
		}
		else{
			oProductsClone = {Products : []};
		}
		return oProductsClone;
	},
	
	bindEditView : function(bRefreshPage)
	{
		//this is where all the data needed to for edit page from detail page is bound
	
     //make all buffers empty 
	 this.deleteBuffer = [];     //delete buffer holds products that are to be deleted in the backend
	 this.BackendProducts = {};  //BackendProducts is a json as an associative array - holds original quantity of products coming from backend
	 
	 
	 
      var s3Controller = this.getDetailController();
      
      if(s3Controller === null || bRefreshPage){
    	  
    	  
    	  
    	  if(s3Controller == null && parseFloat(this.sBackendVersion) >= 4 && !bRefreshPage){
    		  //normal load of edit page in bookmarking scenario!! need to fetch eTag 
    		  cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
    	  }
           this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Origins","GET")]);
	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("Priorities","GET")]);
	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("QualificationsLevels","GET")]);
	       this.oModel.addBatchReadOperations([this.oModel.createBatchOperation("/" + this.sPath+"?$expand=Products,ChangeDocs,Statuses","GET")]);
	       
	       
	       this.oModel.submitBatch(jQuery.proxy(this.handleBatchReads,this),jQuery.proxy(this.handleErrors,this),true);
    
    	  return;
      }
      
		 //save Lead with Etag
      this._saveETag(s3Controller.sETag);
	 //binding starts from here
	 
        
      //entities to be expanded in s4 view if the data is not already fetched in s3 view. By default statuses is expanded everytime
      var expandEntities = "Statuses";	
      var data = s3Controller.byId('info').getModel('json').getData();
           
       data.Origins = s3Controller.Origins;
       data.Priorities = s3Controller.Priorities;
       data.QualificationsLevels = s3Controller.QualificationsLevels;
       
       
      //check if product basket data is already fetched in s3 view
	  var oProductsData = s3Controller.byId('Product_Tab').getModel('json').getData();
	  if(oProductsData && oProductsData.hasOwnProperty("Products"))
		 {
		    var oProductsClone;
		    if(oProductsData.Products){
		    oProductsClone = JSON.parse(JSON.stringify(oProductsData));
		   var i;
		   for(i=0;i<oProductsClone.Products.length;i++)
        	{
        	 if(oProductsClone.Products[i].ProductGuid === null)
        		 oProductsClone.Products[i].Backend = "CATEGORY";
             else
        	     oProductsClone.Products[i].Backend = "X";
        	  oProductsClone.Products[i].OldValue = oProductsClone.Products[i].Quantity;
        	  this.BackendProducts[oProductsClone.Products[i].ItemGuid] = JSON.parse(JSON.stringify(oProductsClone.Products[i]));
        	}
		    }
		    else{
		    	oProductsClone = {Products : []};
		    }
		data.Products = oProductsClone.Products;   
        //this.byId('productBasketEdit').getModel('json').setData(oProductsClone);
		
		}
	   
	else
		expandEntities += ",Products";
	var oSalesTeamData = s3Controller.byId('salesteam').getModel('json').getData();
		
	      var oModel = this.oModel;
		   var sPath = "Leads(guid'" + s3Controller.byId('info').getModel('json').getData().Guid + "')";
		   oModel.read(sPath,null,["$expand="+expandEntities],true,jQuery.proxy(function(odata,response)
				   {
			        
			        if(expandEntities.indexOf("Products") !== -1)
			        	{
			        var oProductsClone =  this._cloneProducts({Products : response.data.Products.results});
			        data.Products = oProductsClone.Products;
			        	}
			        data.Statuses = response.data.Statuses.results;
			        this.byId('selectStatus').getModel('json').setData({Statuses : response.data.Statuses.results});
			        this.byId('selectStatus').setSelectedKey(this.HeaderObject.UserStatusCode);
			        this.UserStatuses = response.data.Statuses.results;	
			        
			        
			        this.bindHeaderFormsExceptMainContact(data,false);
			        
				   },this));
		   
		   

		     
		   //EXTENSION POINT
		   var detailController = this.getDetailController();
		   /**
			 * @ControllerHook extHookBindAdditionalFields is the controller hook that provide for setting values for additional fields
			 *                 from the detail screen that can be modified in the edit screen. The customer can access the data of the detail
			 *                 page by calling the getDetailController function.
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookBindAdditionalFields
			 * @param {object}
			 *           detailController
			 * @return {void}
			 */
		  if (this.extHookBindAdditionalFields){
				this.extHookBindAdditionalFields(detailController);
			}
		
	},
	
	pageNeedsUpdate : function(){
		
		
		//pageNeedsUpdate checks for any changed fields in the edit page - returns true if update needed, else false
		
		//clear all changesetMappings for batch initially
		this.changeSetMapping.BASKET = "";
		this.changeSetMapping.HEADER = "";
		this.changeSetMapping.CONTACT = "";
		this.changeSetMapping.STATUS = "";
		this.changeSetMapping.EMPLOYEE = "";
		this.bBasketUpdate = false;
		this.oSentStartDate  = null;
		this.oSentEndDate = null;
		
		//empty changeset intially
		var changeSet = []; 
		var headerGuid = this.headerGuid;
	
	
		
		var oModel = this.oModel;  
		this.requestNumber = 0;
		
		//Etag implementation
		var nBackendVersion = cus.crm.lead.util.schema
				._getServiceSchemaVersion(this.oModel,
				"Lead");
		var oETag = null;
		// Inter-operability check - send {sETag : null} 
		if(nBackendVersion >= 4.0){
			oETag = {sETag : null };	
		}
					
		 /**
		 * @ControllerHook extHookCheckDeltaAndFrameRequests is the controller hook that provides for sending additional update requests to the
		 *                 backend with the delivered updates which are on the header, status, employee responsible (wave 4 and above), and the product basket. 
		 *                 The customer can check for changed fields and send update requests only for the fields that have actually been changed.  
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookCheckDeltaAndFrameRequests
		 * @param {object} changeSet
		 * @return {void}
		 */
		if (this.extHookCheckDeltaAndFrameRequests){
			this.extHookCheckDeltaAndFrameRequests(changeSet);
		}
		//construct the json from form fields using value getter functions
var tempEntry = {
        Guid : headerGuid,        
        Description : this.byId('inputName').getValue(),
        OriginCode : this.byId('selectOrigin').getSelectedKey(),
        QualificationCode : this.byId('selectQualification').getSelectedKey(),
        PriorityCode : this.byId('selectPriority').getSelectedKey(),
        StartDate : ($('#' + this.byId('datePickerStartDate').getIdForLabel()).val() !== "" ) ? 
        		         this.getDateTimeStampFromDatePicker(this.byId('datePickerStartDate')) : null,
        EndDate : ($('#' + this.byId('datePickerEndDate').getIdForLabel()).val() !== "" ) ?
        		          this.getDateTimeStampFromDatePicker(this.byId('datePickerEndDate')) : null
        };
    var entry = { Guid : headerGuid};
    
//compare the fields with the original HeaderObject and frame the entry to be sent as payload for header update
 
 var key;	
 var needsUpdate = false;
 
 for(key in tempEntry)
	 {
	     if(key === "StartDate" || key === "EndDate")
	    	 {
	    	 //check conditions on dates - if the dates should be updated on the backend 
	    	     if(!this._areDatesSame(this.HeaderObject[key],tempEntry[key]))
	    	    	 {
	    	    	 entry[key] = tempEntry[key];
	    	    	 if(key === "StartDate"){
	    	    		 this.oSentStartDate = tempEntry[key];
	    	    	 }
	    	    	 else{
	    	    		 this.oSentEndDate = tempEntry[key];
	    	    	 }
	    	    	 needsUpdate = true;	
	    	    	 }
	    	 }
	     else
	    	 {
	    	 
	    	  if(this.HeaderObject[key] !== tempEntry[key])
	    	   {
	    	     entry[key] = tempEntry[key];
	    	     needsUpdate = true;
	    	   }
	    	 }
	     
	 };
	 
	 if(this._hasUserStatusChanged() || this._hasMainContact() || this._hasEmployeeChanged()){
		 needsUpdate = true;
	 }
	 
	 var bCustomFieldsChanged = false;
	 /**
		 * @ControllerHook extHookAddCustomHeaderFields is the controller hook that provides for adding additional fields that are part of the opportunity header.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomHeaderFields
		 * @param {object}
		 *          entry
		 * @return {boolean}
		 */
		if (this.extHookAddCustomHeaderFields){
		    bCustomFieldsChanged =   this.extHookAddCustomHeaderFields(entry);
		}
		
	 //header needs update - frame requestnumber and batch changeset
	 if(needsUpdate || bCustomFieldsChanged)
		 {
		 
	          this.changeSetMapping.HEADER = this.requestNumber;
	          this.requestNumber++;
        	 changeSet.push(oModel.createBatchOperation("Leads(guid'"+headerGuid+"')","MERGE",entry,oETag));
		 }
	 else
		 //no updated required for header
		 this.changeSetMapping.HEADER = "";
		 
    //updating user status
    if(this._hasUserStatusChanged())
    	{
    	//first search for the correct status profile
    	this.changeSetMapping.STATUS = this.requestNumber;
    	this.requestNumber++;
    	var entry;
    	var statusProfile;
        var j,tempLength;
        tempLength = this.UserStatuses.length;
        for(j=0;j<tempLength;j++)
        	if(this.UserStatuses[j].UserStatusCode === this.userStatusCode)
        		{
        		  statusProfile = this.UserStatuses[j].StatusProfile; 
        		   break;
        		}
       //status profile found, now frame payload, changeset and request number
     	entry = {
			
			HeaderGuid : headerGuid,
			StatusProfile : statusProfile,
			UserStatusCode : this.byId('selectStatus').getSelectedKey()
	};
      	changeSet.push(oModel.createBatchOperation("LeadStatuses(StatusProfile='"+statusProfile+"',UserStatusCode='"+this.byId('selectStatus').getSelectedKey()+"',HeaderGuid=guid'"+headerGuid+"')","MERGE"
     			       ,entry,oETag));
    	}
    else
    	//no update required for status
    	this.changeSetMapping.STATUS = "";
    
    
    //updating main contact 
    if(this._hasMainContact()){
        	
        	  var url = "";
        	  var payload = {};
        	  if(this.byId('inputMainContact').getValue() === ""){
        		  url = "LeadSalesTeamSet(PartnerNumber='"+ "" +"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+this.headerGuid+"')";
        		  payload = { 
        	    		HeaderGuid : this.headerGuid,
        	    		PartnerFunctionCode : "00000015",
        	    		PartnerNumber : "",
        	    		MainPartner : true
        	      };
        	  }
        	  else{
        		url =   "LeadSalesTeamSet(PartnerNumber='"+this.oSelectedContact.contactID+"',PartnerFunctionCode='00000015',HeaderGuid=guid'"+this.headerGuid+"')";
        		 payload = { 
         	    		HeaderGuid : this.headerGuid,
         	    		PartnerFunctionCode : "00000015",
         	    		PartnerNumber : this.oSelectedContact.contactID,
         	    		MainPartner : true
         	      };
        	  }
        	   this.changeSetMapping.CONTACT = this.requestNumber;
        	   this.requestNumber++;
        	
        	   changeSet.push(oModel.createBatchOperation(url,
        			       "MERGE",payload,oETag));
        	   
        }
        else
        	//no update required for main contact
        	this.changeSetMapping.CONTACT = "";
    
    //updating employee responsible 
    //relevant only for backend versions 2.0 and above
    if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2.0){

		
	    if(this._hasEmployeeChanged()){
	    	
	    	var url; 
	    	var payload = {};
	    	if(this.byId('inputEmpResponsible').getValue() === ""){
	    		url = "LeadSalesTeamSet(PartnerNumber='"+"',PartnerFunctionCode='00000014',HeaderGuid=guid'"+this.headerGuid+"')";
	    		payload = {
	    				HeaderGuid : this.headerGuid,
	    	    		PartnerFunctionCode : "00000014",
	    	    		PartnerNumber : "",
	    	    		MainPartner : true
	    		};
	    	}
	    	else{
	    		url ="LeadSalesTeamSet(PartnerNumber='"+this.oSelectedEmployee.employeeID+"',PartnerFunctionCode='00000014',HeaderGuid=guid'"+this.headerGuid+"')";
	    		payload = {
	    				HeaderGuid : this.headerGuid,
	    	    		PartnerFunctionCode : "00000014",
	    	    		PartnerNumber : this.oSelectedEmployee.employeeID,
	    	    		MainPartner : true
	    		};
	    		
	    	}
	    	   this.changeSetMapping.EMPLOYEE = this.requestNumber;
	    	   this.requestNumber++;
	    	
	    	              changeSet.push(oModel.createBatchOperation(url,
	    			       "MERGE",payload,oETag));
	    }
	    else
	    	//no update required for employee responsible
	    	this.changeSetMapping.EMPLOYEE = "";
	    
		
    }

    //Delete of products
    var i;
   
    for(i=0;i<this.deleteBuffer.length;i++)
    	{
    	    
    	   this.bBasketUpdate = true;
    	    var entry = {
    	    		HeaderGuid : this.deleteBuffer[i].HeaderGuid,
    	    		ItemGuid : this.deleteBuffer[i].ItemGuid,
    	    		ProductGuid : this.deleteBuffer[i].ProductGuid,
    	    		ProcessingMode : "D"
    	    		
    	    };
    	  
    	    /**
			 * @ControllerHook extHookAddCustomColumnsForProductDelete is the controller hook that provides for adding new columns
			 *                 during deletion of products from the product basket.
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomColumnsForProductDelete
			 * @param {object} entry
			 * @param {object} deleteBuffer[i] 
			 */
			if (this.extHookAddCustomColumnsForProductDelete){
				  this.extHookAddCustomColumnsForProductDelete(entry,this.deleteBuffer[i]);
			}  
    	    // oModel.addBatchChangeOperations([oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+this.deleteBuffer[i].HeaderGuid+"',ItemGuid=guid'"+this.deleteBuffer[i].ItemGuid+"')","MERGE",entry,null)]);
    	changeSet.push(oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+this.deleteBuffer[i].HeaderGuid+"',ItemGuid=guid'"+this.deleteBuffer[i].ItemGuid+"')","MERGE",entry,null));//,oETag);    	
    	}
   
   
    //Update of products - modify existing products, create added products
    var basketData = this.byId('productBasketEdit').getModel('json').getData();
    //var basketData = this.oTableFragment.getModel().getData();
    	
    var i,length;
    length = basketData.Products.length;
   
    for(i=0;i<length;i++)
       {
    	if(basketData.Products[i].Backend === "X")
    		{
    		  //Search the BackendProducts if the update really needs to go through
    		    var oOldEntry = this.BackendProducts[basketData.Products[i].ItemGuid];
    		    var oNewEntry = basketData.Products[i];
    		    var bValue = false;
    		   
    		    /**
				 * @ControllerHook extHookCheckDeltaOnProductEntry is the controller hook that provides for checking of fields in the product entry that have changed
				 *                 from the original entry before they are edited.
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookCheckDeltaOnProductEntry
				 * @param {object} oOldEntry
				 * @param {object} oNewEntry   
				 * @return {boolean}     
				 */
				if (this.extHookCheckDeltaOnProductEntry){
				    bValue =  this.extHookCheckDeltaOnProductEntry(oOldEntry,oNewEntry);
				}    
    		    
				if(oOldEntry.Quantity !== oNewEntry.Quantity || bValue)
    		    	 {
    		    	 this.bBasketUpdate = true;
    		    	   var entry = {
	    	                         	HeaderGuid : basketData.Products[i].HeaderGuid,
	    	                         	ItemGuid : basketData.Products[i].ItemGuid,
	    	                         	ProductGuid : basketData.Products[i].ProductGuid,
	    	                         	Quantity : basketData.Products[i].Quantity,
	    	                         	ProcessingMode : "B"
	    		
                        };
    		    	   
    		    	   /**
      					 * @ControllerHook extHookAddCustomColumnsForProductModify is the controller hook that provides for adding new columns 
					     *                 during modification of products in the product basket.
      					 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomColumnsForProductModify
      					 * @param {object} entry
      					 * @param {object} oNewEntry         
      					 */
      					if (this.extHookAddCustomColumnsForProductModify){
      					      this.extHookAddCustomColumnsForProductModify(entry,oNewEntry);
      					}			
      //  oModel.addBatchChangeOperations([oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+basketData.Products[i].HeaderGuid+"',ItemGuid=guid'"+basketData.Products[i].ItemGuid+"')",
        		//  "MERGE",entry,null)]);
    		    	   changeSet.push(oModel.createBatchOperation("LeadProducts(HeaderGuid=guid'"+basketData.Products[i].HeaderGuid+"',ItemGuid=guid'"+basketData.Products[i].ItemGuid+"')",
    		    		        		  "MERGE",entry,oETag));
    		    	 }
       }
    	else if(basketData.Products[i].Backend === "")
    		{
    		 this.bBasketUpdate = true;
    		 var entry = {
    		    		HeaderGuid : basketData.Products[i].HeaderGuid,
    		    		ItemGuid : "00000000-0000-0000-0000-000000000001",
    		    		ProductId : basketData.Products[i].ProductId,
    		    		Quantity : basketData.Products[i].Quantity,
    		    		Unit : basketData.Products[i].Unit,
    		    		ProcessingMode : "A"
    		    		
    		    };
    		 
    		 /**
				 * @ControllerHook extHookAddCustomColumnsForProductCreate is the controller hook that provides for adding new columns
				 *                 during creation of products in the product basket.
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookAddCustomColumnsForProductCreate
				 * @param {object} entry
				 * @param {object} basketData.Products[i]         
				 */
				if (this.extHookAddCustomColumnsForProductCreate){
					 this.extHookAddCustomColumnsForProductCreate(entry,basketData.Products[i]);
				}
    		 changeSet.push(oModel.createBatchOperation("LeadProducts","POST",entry,oETag));
    		// oModel.addBatchChangeOperations([oModel.createBatchOperation("LeadProducts","POST",entry,null)]);
    		
    		}
       }
    
    
    if(this.bBasketUpdate === true)
    	{
    	//set the request number for product basket update
    	 this.changeSetMapping.BASKET = this.requestNumber;
    	 
         this.requestNumber++;
    	}
    else
    	//no changes required for product basket
    	this.changeSetMapping.BASKET = "";
    //oModel.addBatchChangeOperations(changeSet);
    if(changeSet.length > 0){
    	oModel.addBatchChangeOperations(changeSet);
    	return true;
    }      //some update needs to happen - header, status, main contact, employee responsible or product basket
    	
   
    
    return false;       //page needs no update
		
		
	
	},
	
	//ETag check on save
		_saveETag : function(sETag){
			this.sETag = sETag;
		},
		
		_refreshLead : function(){
			this.bindEditView(true);
			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
		},
		
		_is412Error : function(oResponses){
		
			for(var i = 0 ; i < oResponses.__batchResponses.length;i++){
				if(oResponses.__batchResponses[i].response.statusCode === "412"){
					return true;
				}
			}
			return false;
		},
		
	onSave : function(sETag){
		
	    
		//save only if if all data is validated 
		if(this.validateEditPage() === false)
			return;
		
		//pageNeedsUpdate frames the batch and changesets here.
		  //this.pageNeedsUpdate();
		if(this.pageNeedsUpdate()){
		  
    if(this.requestNumber > 0)       //page needs update
    	{
    	//sap.ca.ui.utils.busydialog.requireBusyDialog();
         //disable the save button until response from server
    	 //this.byId('buttonSaveLead').setEnabled(false);
    	this._oControlStore.oButtonListHelper.aButtons[0].oButton.setEnabled(false);
          this.oModel.submitBatch(jQuery.proxy(function(oResponses){
    	
        	//batch accepted - handle responses
    	   this.handleBatchResponses(oResponses);
    	
    	
    },this),
    jQuery.proxy(function(oError)
    {       
        	 // this.byId('buttonSaveLead').setEnabled(true); //enable the save button on response
    	this._oControlStore.oButtonListHelper.aButtons[0].oButton.setEnabled(true);
        	var sMessage; 
				if (oError.response) {
			//		sMessage = jQuery.parseJSON(oError.response.body).error.message.value;
				}
        	  sap.ca.ui.message.showMessageBox({
        		    type: sap.ca.ui.message.Type.ERROR,
        		    message: oError.message,
        		    details : "" +oError.response.body,
        		}, function(){});
    	
    },this),true
    
    		);
    	}	
	 
		}
		else{
			this.datalossDismissed({isConfirmed : true});	
			
			//always clear the batch constructed by pageNeedsUpdate
			this.oModel.clearBatch();
		}
	},
	
	showProductDialog : function()
	{
		 if(!this.oAddProductsFragment){
			 //initialize products fragment and it's models for once
			 this.oAddProductsFragment = new sap.ui.xmlfragment(this.createId("addProducts"),'cus.crm.lead.fragment.AddProducts',this);
			 this.oAddProductsFragment.setModel(new sap.ui.model.json.JSONModel(),"json");
			 this.oAddProductsFragment.setModel(this.oI18nModel,'i18n');
		 }
		//for loading text 
		 this.oAddProductsFragment.getBeginButton().setEnabled(false);
		this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oAddProductsFragment.getModel('json').setData({Products :[]});
		
		//read products and set no data text appropriately
		this.oModel.read("Products",null,null,true,jQuery.proxy(function(odata,response){
			
			if(response.data.results.length === 0)
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PRODUCTS'));
			this.oAddProductsFragment.getModel("json").setData({Products : response.data.results});
			
		},this),function(oError){
			
			
			
		});   
		
		 this.oAddProductsFragment.open();
		
		
	},
	
	closeProductDialog : function()
	{
		//remove any selections in the product list
		this.oAddProductsFragment.close();
		this.oAddProductsFragment.getContent()[0].removeSelections();
		//this.oAddProductsFragment.getSubHeader().getContentLeft()[0].clear();
		
	},
	
	
	addProductsToBasket : function()
	{
		
		var oProductList = this.oAddProductsFragment.getContent()[0];
		var oSelectedItems = oProductList.getSelectedItems();
		var productBasketData ={Products : []};
		var data = this.byId('productBasketEdit').getModel('json').getData();
		//var data = this.oTableFragment.getModel().getData();
		if(data && data.hasOwnProperty("Products"))
			productBasketData.Products = data.Products;
		var headerGuid = this.headerGuid;
		var i = 0;
		var length = oSelectedItems.length;
		var oListItem;
		for(i = 0;i<length;i++)
			{
			   oListItem = oSelectedItems[i]; 
			   var tempObject = oListItem.getBindingContext('json').getObject();
			   //frame the json to be added to the json model of the product basket
			    var pushObject = {
			    		
			    		    HeaderGuid: headerGuid,
			    			ItemGuid: "",
			    			ProcessingMode: "",
			    			ProductGuid: tempObject.ProductGuid,
			    			ProductId: tempObject.ProductId,
			    			ProductName: tempObject.ProductDescription,
			    			Quantity: "1",	//quantity is defaulted to 1
			    			Unit : tempObject.Unit,
			                Backend : "",   //this is a product added from client so the backend flag is ""
			                OldValue : "1"  //keep the old value in sync with the current value
			    };
			   
                 /**
				 * @ControllerHook extHookExtendProductEntry is the controller hook that provides for addition of extra fields to the product entry.
				 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookExtendProductEntry
				 * @param {object} pushObject
				 * @param {object} tempObject       
				 */
				if (this.extHookExtendProductEntry){
				     this.extHookExtendProductEntry(pushObject,tempObject);
				}
			    productBasketData.Products.push(pushObject);
			 
			}
		
		this.byId('productBasketEdit').getModel('json').updateBindings();
		//this.byId('productBasketEdit').getModel().updateBindings();
		//this.oTableFragment.getModel().setData(productBasketData);
		
		this.oAddProductsFragment.close();
		this.oAddProductsFragment.getContent()[0].removeSelections();
		//this.oAddProductsFragment.getSubHeader().getContentLeft()[0].clear();
		
	},
	
	deleteProduct : function(oEvent)
	{
		var data = oEvent.getSource().getModel('json').getData();
		var product = oEvent.getSource().getBindingContext('json').getObject();
		var i;
		var length = data.Products.length;
		
		
		
		for(i=0;i<length;i++)
			if(product == data.Products[i])
				{
				      data.Products.splice(i,1);
				     
				     if(product.Backend === "X")
				       this.deleteBuffer.push(product);
				      break;
				  
				}
	this.byId('productBasketEdit').getModel('json').updateBindings();
		//this.oTableFragment.getModel().setData(data);
		
	},
	formatDate : function(inputDateValue)
	{
		
		if(inputDateValue === "" || inputDateValue === null || inputDateValue === undefined)
			return "";
		var locale = new sap.ui.core.Locale(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().sLocale);
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"},locale);
		return formatter.format(inputDateValue);
	

	},
	filterProducts : function(oEvent)
	{
		//filter products based on Product description
        this.oAddProductsFragment.getBeginButton().setEnabled(false);
		this.oAddProductsFragment.getContent()[0].removeSelections();
		this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oAddProductsFragment.getModel('json').setData({Products : []});
		this.oModel.read("Products",null,["$filter=ProductDescription eq '"+ oEvent.getParameter('query') + "'"],true,jQuery.proxy(function(odata,response){
			
			if(response.data.results.length === 0)
				this.oAddProductsFragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PRODUCTS'));
			this.oAddProductsFragment.getModel('json').setData({Products : response.data.results});
			
			
		},this),function(oError){
			
			
		});
		
		
	},
	
	getDateTimeStampFromDatePicker : function(datePicker)
	{
	 	  //convert date from locale specific format to YYYY-MM-DDTXX:XX:XX
	 	  var labelDate = $('#' + datePicker.getIdForLabel()).val();
	 	  var currentDate = this.oDateFormatter.parse(labelDate);
	 	  var year = currentDate.getFullYear();
	 	  var month = currentDate.getMonth();
	 	  var day = currentDate.getDate();
	 	  return new Date(Date.UTC(year,month,day));
	 	 
		
	},
	showAccountF4 : function(oEvent)
	{
		 var appImpl = sap.ca.scfld.md.app.Application.getImpl();
		  var oModel = this.oModel;
		  this.byId('dialogAccountF4').setModel(oModel);
		this.byId('dialogAccountF4').open();
	},
	
	showContactF4 : function(oEvent)
	{
		//throw the contact f4 dialog
		if(!this.contactF4Fragment){
			 //contactF4 is backed  by json model
			  this.contactF4Fragment  =  new sap.ui.xmlfragment(this.createId("contactF4"), 'cus.crm.lead.fragment.ContactF4', this);
			  this.contactF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
			  this.contactF4Fragment.setModel(this.oI18nModel,'i18n');
		}
		var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
		var toolbarLabel = toolbar.getContent()[0];
		this.contactF4Fragment.getSubHeader().getContentLeft()[0].setValue(this.byId('inputMainContact').getValue());
		if(this.HeaderObject.ProspectNumber != "")
			{
			//if there is an account for the lead, show filtered by account in the toolbar
			toolbar.setVisible(true);
		     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + this.HeaderObject.ProspectName);
		     this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
		     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		     this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,["$filter=substringof('" + 
	    	      this.byId('inputMainContact').getValue() + "',fullName)"],false,jQuery.proxy(function(odata,response)
		    			    		    		        		   
		    		 {
		    	        this.contactF4Fragment.getModel('json').setData({ 
		                            ContactCollection : response.data.results 	        		
		    	        });
		    	        if(response.data.results.length === 0)
		    	        	this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
		    	      
		    		 },this),jQuery.proxy(function(oError)
		    	        {
		    	        	this.contactF4Fragment.getModel('json').setData({
		    	        		
		    	        		ContactCollection : []
		    	        	});
		    	        	this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
		    	        	
		    	        },this));
		    	 
		    		 }
		    
		else
			{
			//no account assigned to the lead, hiding the filtered by toolbar
		    toolbar.setVisible(false);
		    this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
		     this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		    this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
		    		 {
		    	      
		    	  this.contactF4Fragment.getModel('json').setData({ 
                      ContactCollection : response.data.results 	        		
	        });
		    	  if(response.data.results.length === 0)
	    	        	this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));     
		    		 },this),jQuery.proxy(function(oError)
		    	        {
		                	this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
		    	        	
		    	        },this));
		    
			}
		
		//this.byId('dialogContactF4').open();
		
		this.contactF4Fragment.open();
		
		
		
	
	},
	showEmployeeF4 : function(oEvent)
	{
	
		
		//throw the employee f4 dialog
		
		if(!this.employeeF4Fragment){
			 this.employeeF4Fragment  =  new sap.ui.xmlfragment(this.createId("employeeF4"), 'cus.crm.lead.fragment.EmployeeF4', this);  
				//employeeF4 is backed  by json model
				  this.employeeF4Fragment.setModel(new sap.ui.model.json.JSONModel(),"json");
				  this.employeeF4Fragment.setModel(this.oI18nModel,'i18n');
		}
		var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
		var toolbarLabel = toolbar.getContent()[0];
		
		var aFilters = [];
		var sText = this.byId('inputEmpResponsible').getValue();
		var aSplit = sText.split('/'); 
        var sSearchText = aSplit[0].replace("/\s+$/","");
        this.employeeF4Fragment.getSubHeader().getContentLeft()[0].setValue(sSearchText);
		
        if(sSearchText !== ""){
        	aFilters.push("$filter=substringof('" + sSearchText + "',fullName)");
        }
		if(this.HeaderObject.ProspectNumber != "")
			{
			//if there is an account for the lead, show filtered by account in the toolbar
			toolbar.setVisible(true);
		     toolbarLabel.setText(this.oI18nModel.getResourceBundle().getText('FILTER_BY') + " " + this.HeaderObject.ProspectName);
		     this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
		     this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		     this.oModel.read("/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/EmployeeResponsibles",null,aFilters,true,jQuery.proxy(function(odata,response)
		    		
		    		 {
	    	    	  this.employeeF4Fragment.getModel('json').setData({ 
	  					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
	  				});
		    	        	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
		    	      
		    		 },this),jQuery.proxy(function(oError)
		    	        {
		    	        	this.employeeF4Fragment.getModel('json').setData({
		    	        		
		    	        		EmployeeCollection : []
		    	        	});
		    	        	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
		    	        	
		    	        },this));
		    	 
		    		 }
		    
		else
			{
			//no account assigned to the lead, hiding the filtered by toolbar
		    toolbar.setVisible(false);
		    this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
		     this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		    this.oModel.read("EmployeeCollection",null,aFilters,true,jQuery.proxy(function(odata,response)
		    		 {
		    	      
		    	this.employeeF4Fragment.getModel('json').setData({ 
					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
				});
		    	  
	    	        	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));     
		    		 },this),jQuery.proxy(function(oError)
		    	        {
		                	this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
		    	        	
		    	        },this));
		    
			}
		
			
		this.employeeF4Fragment.open();
		
		
		
	},

	closeAccountF4 : function(oEvent)
	{
		
		this.byId('dialogAccountF4').close();
	},
	closeContactF4 : function(oEvent)
	{	
		
		this.contactF4Fragment.close();
	},
	closeEmployeeF4 : function(oEvent)
	{
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData({EmployeeCollection : []});
		this.employeeF4Fragment.setModel(jsonModel,"json");
		this.employeeF4Fragment.close();
	},
	
	setAccount : function(oEvent)
	{
		
		
		 var appImpl = sap.ca.scfld.md.app.Application.getImpl();
		 var oModel = this.oModel;
		 this.oSelectedAccount = oEvent.getParameter('listItem').getBindingContext().getObject();
		 
		this.byId('inputAccount').setValue(this.oSelectedAccount.name1);
	
		this.byId('accountList').removeSelections();
		this.byId('dialogAccountF4').close();
		
	},
	setContact : function(oEvent)
	{

		//contact selected from contactF4
		 this.oSelectedContact = oEvent.getParameter('listItem').getBindingContext('json').getObject();
		 if(this.oSelectedContact.fullName !== ""){
			 this.byId('inputMainContact').setValue(this.oSelectedContact.fullName);
		 }
	    else {
	        this.oSelectedContact.fullName = this.oSelectedContact.contactID;
	    	this.byId('inputMainContact').setValue(this.oSelectedContact.contactID);
	    }
			
	   	 this.contactF4Fragment.getContent()[0].removeSelections();
		 this.contactF4Fragment.close();
		 
	
	},
	setEmployee : function(oEvent)
	{
		//contact selected from employeeF4
		this.oSelectedEmployee = oEvent.getSource().getSelectedItem().getBindingContext("json").getObject();
		if(this.oSelectedEmployee.fullName !== "")
			this.byId('inputEmpResponsible').setValue(this.oSelectedEmployee.fullName);
		else 
			this.byId('inputEmpResponsible').setValue(this.oSelectedEmployee.employeeID);
		this.employeeF4Fragment.getContent()[0].removeSelections();
		 var jsonModel = new sap.ui.model.json.JSONModel();
			jsonModel.setData({EmployeeCollection : []});
			this.employeeF4Fragment.setModel(jsonModel,"json");
			this.employeeF4Fragment.close();
	},
	searchAccount : function(oEvent)
	{
		var filter = new sap.ui.model.Filter("name1","EQ",oEvent.getParameter('query'));
	    this.byId('accountList').bindAggregation('items',"/AccountCollection",this.byId("accountListItem"),null,filter);	
		
	},
	
	searchContact : function(oEvent)
	{

		//search contacts based on contacts' full name
	    var searchText;
	    var toolbar = this.contactF4Fragment.getContent()[0].getInfoToolbar();
	    var oEventParameters = oEvent.getParameters();
	    if(oEventParameters.hasOwnProperty("newValue"))
	    	{
	    	searchText = oEventParameters.newValue;
	    	if(searchText.length < 4)
	    		return;
	    	}
	    else
	    	searchText = oEventParameters.query;
		
	    this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
		this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
	    
	    if(toolbar.getVisible() === true && this.HeaderObject.ProspectNumber !== ""){
	    	
	    	this.oModel.read("AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/Contacts",null,["$filter=substringof('"+
	    	     searchText + "',fullName)" ],true,jQuery.proxy(function(odata,response)
	 					{
				       this.contactF4Fragment.getModel('json').setData({
				    	   ContactCollection :  response.data.results
				    	   });
				       if(response.data.results.length === 0)
				    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
					},this),
					jQuery.proxy(function(oError)
					{
						this.contactF4Fragment.getModel('json').setData({
							
							ContactCollection : []
							
						});
						this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
					},this));
	    	
	    }
	    
	    else{
	    	toolbar.setVisible(false);
	    	this.oModel.read("ContactCollection",null,["$filter=substringof('" +searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
					{
				       this.contactF4Fragment.getModel('json').setData({
				    	   ContactCollection :  response.data.results
				    	   });
				       if(response.data.results.length === 0)
				    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
					},this),
					jQuery.proxy(function(oError)
					{
						this.contactF4Fragment.getModel('json').setData({
							
							ContactCollection : []
							
						});
						this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
					},this));
	    	
	    	
	    	
	    }
		
		    	 
		
	
	},
	searchEmployee : function(oEvent)
	{
		  var searchText;
		    var toolbar = this.employeeF4Fragment.getContent()[0].getInfoToolbar();
		    var oEventParameters = oEvent.getParameters();
		    if(oEventParameters.hasOwnProperty("newValue"))
		    	{
		    	searchText = oEventParameters.newValue;
		    	if(searchText.length < 4)
		    		return;
		    	}
		    else
		    	searchText = oEventParameters.query;
		    
		    this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
			this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		    var sUrl;
			if(toolbar.getVisible() === false){
				sUrl = "EmployeeCollection";
			}
			else{
				sUrl = "/AccountCollection(accountID='" + this.HeaderObject.ProspectNumber + "')/EmployeeResponsibles";
			}
			this.oModel.read(sUrl,null,["$filter=substringof('" +searchText + "',fullName)"],true,jQuery.proxy(function(odata,response)
					{
		        	this.employeeF4Fragment.getModel('json').setData({ 
					EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
				});
				       
				    	   this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
					},this),
					jQuery.proxy(function(oError)
					{
						this.employeeF4Fragment.getModel('json').setData({
							
							EmployeeCollection : []
							
						});
						this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
					},this));
			    	 
	},
	closeToolbar : function(oEvent)
	{

		//filtered by toolbar closed - trigger blank search of contacts
		this.contactF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
		this.contactF4Fragment.getModel('json').setData({ContactCollection : []});
		this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oModel.read("ContactCollection",null,null,true,jQuery.proxy(function(odata,response)
				{
			       this.contactF4Fragment.getModel('json').setData({
			    	   ContactCollection :  response.data.results
			    	   });
			       if(response.data.results.length === 0)
			    	   this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				},this),
				jQuery.proxy(function(oError)
				{
					this.contactF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_CONTACTS'));
				},this));
		
		
	
	},
	closeEmpToolbar : function(oEvent)
	{
		//filtered by toolbar closed - trigger blank search of employees
		this.employeeF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
		this.employeeF4Fragment.getModel('json').setData({EmployeeCollection : []});
		this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		var sText = this.employeeF4Fragment.getSubHeader().getContentLeft()[0].getValue();
		var filter = (sText.length > 0) ? ["$filter=substringof('" + sText +  "',fullName)"] : null;
		this.oModel.read("EmployeeCollection",null,filter,true,jQuery.proxy(function(odata,response)
				{
			this.employeeF4Fragment.getModel('json').setData({ 
				EmployeeCollection :  response.data.hasOwnProperty("results")  ?  response.data.results : [response.data]        		
			});
			      
			    	   this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
				},this),
				jQuery.proxy(function(oError)
				{
					this.employeeF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_EMPLOYEE'));
				},this));
		
	},
	closeParticipantsToolbar : function(oEvent)
	{
		//filtered by toolbar closed - trigger blank search of participants
		this.participantsF4Fragment.getContent()[0].getInfoToolbar().setVisible(false);
		this.participantsF4Fragment.getModel('json').setData({AccountCollection : []});
		this.participantsF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('LOADING'));
		this.oModel.read("AccountCollection",null,null,true,jQuery.proxy(function(odata,response)
				{
			       this.participantsF4Fragment.getModel('json').setData({
			    	   AccountCollection :  response.data.results
			    	   });
			       if(response.data.results.length === 0)
			    	   this.participantsF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PARTICIPANTS'));
				},this),
				jQuery.proxy(function(oError)
				{
					this.participantsF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText('NO_PARTICIPANTS'));
				},this));
		
	},
	
	descriptionChanged : function(oEvent)
	{
		//description of lead should not exceed 40 chars
		var descriptionField = this.byId('inputName');
		if(oEvent.getParameter('newValue').length > 40)
			{
			    descriptionField.setValueState(sap.ui.core.ValueState.Error);
			    
			
			}
		else
			  descriptionField.setValueState(sap.ui.core.ValueState.None);
	    
		
	},
	quantityChanged : function(oEvent)
	{
		//quantity should involve only numbers
		var data = oEvent.getSource().getBindingContext('json').getObject();
		var newValue = oEvent.getParameter('newValue'); 
		var pattern = /[^0-9.]/;
		if(pattern.test(newValue) === false)
			{
			       if(newValue.split(".").length > 2)  //error
			    	   {
			    	      //  oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			    	      data.Quantity = data.OldValue;
			    	      oEvent.getSource().setValue(data.Quantity);
			    	   }
			       else // no error 
			    	   {
			    	      data.OldValue = newValue;
			    	      data.Quantity = newValue;
			    	    //  oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			    	   
			    	   }
			
			}
		else //error 
			{
			 //oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			data.Quantity = data.OldValue;
  	      oEvent.getSource().setValue(data.Quantity);
			}
		
		
	},
   validateEditPage : function()
   {

	   //date validations for edit page - called on save
	   var datePickerStart = this.byId('datePickerStartDate');
	   var datePickerEnd = this.byId('datePickerEndDate');
	   var labelStart = $('#' + datePickerStart.getIdForLabel()).val();
	   var labelEnd = $('#' + datePickerEnd.getIdForLabel()).val();
	   var bInvalidDates = false;
	   
	   //invalid start date
	   if(labelStart !== "" && (this.oDateFormatter.parse(labelStart)   === null))
		   {
		   bInvalidDates = true;
		   datePickerStart.setValueState(sap.ui.core.ValueState.Error);
		   sap.ca.ui.message.showMessageBox({
               type: sap.ca.ui.message.Type.ERROR,
               message: this.oI18nModel.getResourceBundle().getText('JUNK_DATE')
             });
		 
		  
		   }
	 
	  //invalid end date
	   if(labelEnd !== "" && (this.oDateFormatter.parse(labelEnd)   === null))
	   {
	      bInvalidDates = true;
		   sap.ca.ui.message.showMessageBox({
               type: sap.ca.ui.message.Type.ERROR,
               message: this.oI18nModel.getResourceBundle().getText('JUNK_DATE')
             });

	   datePickerEnd.setValueState(sap.ui.core.ValueState.Error);
	   
	   }
	   
	   if(bInvalidDates)
		   return false;
	   
	   //start date greater than end date
	   if(labelStart !== "" && labelEnd !== "" && this.oDateFormatter.parse(labelStart) > this.oDateFormatter.parse(labelEnd))
		   {
		   
		   sap.ca.ui.message.showMessageBox({
               type: sap.ca.ui.message.Type.ERROR,
               message: this.oI18nModel.getResourceBundle().getText('INVALID_DATE')
             });
		    
		   datePickerStart.setValueState(sap.ui.core.ValueState.Error);
		   datePickerEnd.setValueState(sap.ui.core.ValueStateError);
		   return false;
		   
		   }
	   
	   if(this.oSelectedContact.fullName !== this.byId('inputMainContact').getValue()
			     && this.byId('inputMainContact').getValue() !== ""){
				  
				  this.showContactF4({});
				    return false;  
			  }
	   
	   //EXTENSION POINT
	   /**
		 * @ControllerHook extHookValidateAdditionalFields is the controller hook that provides for the custom validations that can be implemented to validate additional fields.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookValidateAdditionalFields
		 * @return {boolean}
		 */
		if (this.extHookValidateAdditionalFields){
		   	var bValue = this.extHookValidateAdditionalFields(); 
		   		if(!bValue){
		   			return false;
		   		}
		   	}
	   
	   return true;		
	   
	   
	   
   
   },
   
   handleBatchResponses : function(oResponses)
   {

	   //handle all the responses received from the batch
	   var statuses = [];  //array of error texts to be shown to the user
	   var responseObject;
	   this.bHeaderUpdateSuccess = false;
	   this.bStatusUpdateSuccess = false;
	   this.bContactUpdateSuccess = false;
	   this.bEmployeeUpdateSuccess = false;
	   var bPartialUpdate = false;
	   var bFail = false;
	   var bBasketFail = false;
	   var errorMessage ="";
	   var b412Error = false;
	   //this.byId('buttonSaveLead').setEnabled(true);
	   this._oControlStore.oButtonListHelper.aButtons[0].oButton.setEnabled(true);
	   if(oResponses.__batchResponses[0].hasOwnProperty("__changeResponses")){
		   
		   /**
			 * @ControllerHook extHookHandleResponsesForCustomUpdates is the controller hook that provides for custom handling of the responses for the custom updates. The oResponses argument contains the responses for all the requests that are framed.
			 *                 The specific response can be identified by using the changeSetMapping number as an index in the oResponses array.
			 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookHandleResponsesForCustomUpdates
			 * @param {object}
			 *          oResponses
			 * @return {void}
			 */
			if (this.extHookHandleResponsesForCustomUpdates){
				this.extHookHandleResponsesForCustomUpdates(oResponses);
			}
		   
	   if(this.changeSetMapping.HEADER !== "")
		   {
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.HEADER];
		       
		        if(parseInt(responseObject.statusCode) >= 400)
		          {
		          //header update failure - push error text into statuses array
		           statuses.push(responseObject.statusText);
		           bFail = true;
		           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
		           if(parseInt(responseObject.statusCode) === 412){
						b412Error = true;
					}
		           this.bindHeaderFormsExceptMainContact(true);
              
	        	   }
		        else	
		        	{
		        	//header update success - refresh new values in HeaderObject 
		        	   this.HeaderObject.Description = this.byId('inputName').getValue();
		        	   if(this.oSentStartDate !== null){
		        		   if(this.oSentStartDate === "0000-00-00T00:00:00")
		        			   this.HeaderObject.StartDate = null;
		        		   else
		        			   this.HeaderObject.StartDate = new Date(this.oSentStartDate);
		        		   
		        	   }
		        	   
		        	   if(this.oSentEndDate !== null){
		        		   if(this.oSentEndDate === "0000-00-00T00:00:00")
		        			   this.HeaderObject.EndDate = null;
		        		   else
		        			   this.HeaderObject.EndDate = new Date(this.oSentEndDate);
		        		   
		        	   }
		        	   
		        	   this.HeaderObject.OriginText = this.byId('selectOrigin').getSelectedItem().getText();
		        	   this.HeaderObject.OriginCode = this.byId('selectOrigin').getSelectedKey();
		        	   this.HeaderObject.PriorityText = this.byId('selectPriority').getSelectedItem().getText();
		        	   this.HeaderObject.PriorityCode = this.byId('selectPriority').getSelectedKey();
		        	   this.HeaderObject.QualificationCode = this.byId('selectQualification').getSelectedKey();
		        	   this.HeaderObject.QualificationText = this.byId('selectQualification').getSelectedItem().getText();
		               bPartialUpdate = true;    	   
		        	   this.bHeaderUpdateSuccess = true;
		        	 
		        	   
		        
		        	}
		   }
	   if(this.changeSetMapping.STATUS !== "")
		   {
		   
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.STATUS];
		  
	        if(parseInt(responseObject.statusCode) < 400 )
	          {
	        	
	        	//status update success - maintain updated status in HeaderObject
	        	 this.HeaderObject.UserStatusCode = this.byId('selectStatus').getSelectedKey();
	        	   this.HeaderObject.UserStatusText = this.byId('selectStatus').getSelectedItem().getText();
	        	   
	        	    this.bStatusUpdateSuccess = true;
	        	    bPartialUpdate = true;
	          }
	        else
	        	{
	        	//status update failure  - push error text into statuses array
	        	 statuses.push(responseObject.statusText);
		           bFail  = true;
		           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
		           if(parseInt(responseObject.statusCode) === 412){
						b412Error = true;
					}
		           //revert 
		           this.byId('selectStatus').setSelectedKey(this.HeaderObject.UserStatusCode);
	        	  
	        	}
		   
		   }
	   if(this.changeSetMapping.CONTACT !== "")
		   {
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.CONTACT];
	        if(parseInt(responseObject.statusCode) >= 400)
	          {
	        	//main contact update failure - push error text into statuses array
	           statuses.push(responseObject.statusText);
	           bFail  = true;
	           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
	           if(parseInt(responseObject.statusCode) === 412){
					b412Error = true;
				}
	           this.oSelectedContact.contactID = this.HeaderObject.MainContactId;
	           this.oSelectedContact.fullName = this.HeaderObject.MainContactName;
	          }
	        else
	        	{
	        	//main contact update success  - maintain updated contact in HeaderObject
	        	 bPartialUpdate = true;
	        	    this.HeaderObject.MainContactId = this.oSelectedContact.contactID;
	        	    this.HeaderObject.MainContactName = this.oSelectedContact.fullName;
	        	    this.byId('inputMainContact').setValue(this.HeaderObject.MainContactName);
	        	    this.bContactUpdateSuccess = true;
	        	  
	        	}
		   
		   }
	   //relevant only for backend schema versions >= 2.0
	   if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2.0){
	   if(this.changeSetMapping.EMPLOYEE !== "")
	   {
		   responseObject = oResponses.__batchResponses[0].__changeResponses[this.changeSetMapping.EMPLOYEE];
        if(parseInt(responseObject.statusCode) >= 400)
          {
        	//main contact update failure - push error text into statuses array
           statuses.push(responseObject.statusText);
           bFail  = true;
           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
           if(parseInt(responseObject.statusCode) === 412){
				b412Error = true;
			}
           this.oSelectedEmployee.employeeID = this.HeaderObject.EmployeeResponsibleNumber;
           this.oSelectedEmployee.fullName = this.HeaderObject.EmployeeResponsibleName;
           
          }
        else
        	{
        	//main contact update success  - maintain updated contact in HeaderObject
        	 bPartialUpdate = true;
        	    this.HeaderObject.EmployeeResponsibleNumber = this.oSelectedEmployee.employeeID;
        	    this.HeaderObject.EmployeeResponsibleName = this.oSelectedEmployee.fullName;
        	    this.byId('inputMainContact').setValue(this.HeaderObject.EmployeeResponsibleName);
        	    this.bEmployeeUpdateSuccess = true;
        	   
        	  
        	}
	   
	   }
	   }
	   if(this.changeSetMapping.BASKET !== "")
		   {
		 //  length = oResponses.__batchResponses[this.changeSetMapping.BASKET].__changeResponses.length;
		   var i;
		   var length = oResponses.__batchResponses[0].__changeResponses.length; //length of batch responses array
		  //handling batch responses of product basket - always span from changeSetMapping.BASKET to end of the batch responses array
		   for(i = this.changeSetMapping.BASKET ;i < length;i++)
		        	{
		        	
		    	
			   responseObject = oResponses.__batchResponses[0].__changeResponses[i];
		        	if(parseInt(responseObject.statusCode) >= 400)
		              {
		        		//individual update failed - push error text into statuses array
			           statuses.push(responseObject.statusText);
			           bFail  = true;
			           errorMessage += JSON.parse(responseObject.response.body).error.message.value +"\n";
			           if(parseInt(responseObject.statusCode) === 412){
							b412Error = true;
						}
			           bBasketFail = true;
			          }
		        	else
		        		//individual update succeeded
		        		bPartialUpdate = true;
		        	
		        	}
		      //sap.ca.ui.utils.busydialog.releaseBusyDialog();
		      
		      if(bPartialUpdate && bFail) //partial success
		    	  {
		    	     if(bBasketFail) 
  		    	       this.fetchProductsOnFail();
		    	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : this.oI18nModel.getResourceBundle().getText('PARTIAL_SAVE'),
					    details: errorMessage
					},function(){});
		    	  return;
		    	  }
		      if(!bPartialUpdate && bFail) //all updates failed
		      {
		    	  if(bBasketFail)
		    	     this.fetchProductsOnFail();
		    	  sap.ca.ui.message.showMessageBox({
					    type: sap.ca.ui.message.Type.ERROR,
					    message : this.oI18nModel.getResourceBundle().getText('SAVE_FAILED'),
					    details: errorMessage
					},function(){});
		    	  return;
		    	  }
		   
		   
		   }
	   }
	   else{
		   if(this._is412Error(oResponses)){
				sap.ca.ui.message.showMessageBox({
					type : sap.ca.ui.message.Type.ERROR,
					message : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('MSG_CONFLICTING_DATA')
				},jQuery.proxy(function(){
					this._refreshLead();
					//this.oModel.refresh();
				},this));
				return;
			}
		   bPartialUpdate = true;
		   bFail = true;
		   sap.ca.ui.message.showMessageBox({
			    type: sap.ca.ui.message.Type.ERROR,
			    message : this.oI18nModel.getResourceBundle().getText('SAVE_FAILED'),
			    details: JSON.parse(oResponses.__batchResponses[0].response.body).error.message.value
			},function(){});
		   return; 
	   }
	   
	     if(bPartialUpdate && !bFail)  //all updates succeeded  
		   {
	    	 
	    	 //if any header fields are updated - refresh the corresponding list item
		     if((this.bHeaderUpdateSuccess || this.bStatusUpdateSuccess || this.bContactUpdateSuccess) && !this.bEmployeeUpdateSuccess)
		         this.refreshListItem();
		     
		     
		     this.bSuccessSave = true;
		   sap.ca.ui.message.showMessageToast(this.oAppImpl.getResourceBundle().getText('LEAD_SAVED')); 
		   this.bNavOnUpdate = true;
		   var ctx = "Leads(guid'"+this.headerGuid+"')";

		   // Notify listeners for the event that lead has been changed.
		   sap.ui.getCore().getEventBus().publish("cus.crm.leads", "leadChanged", {
				contextPath : ctx
			});

		   var s3Controller = this.getDetailController();
		   
		   if(s3Controller === null){
			   window.history.go(-1);
			   return;
		   }
		   
		   this.oRouter.attachRouteMatched(this.s3Controller.routeMatched,this.s3Controller);  
		   
		   
		   if(!jQuery.device.is.phone){
			 
			 if(!this.fullScreenMode)
		     this.oRouter.navTo("detail",{ contextPath : ctx},true);
			 else
				 this.oRouter.navTo("display",{ contextPath : ctx},true);	 
		     
		   }
		    else
		      this._navBack();
		   
		  
		   }
	     
	     //Refresh ETag	on Merge	
			cus.crm.lead.util.Util.refreshHeaderETag(this.sPath,this);
   
   },
   refreshListItem : function()
   {
	   
	   var sPath = "/" + "Leads(guid'" + this.headerGuid + "')";
	   var item = this.getItemFromSPath(sPath);
	   if(!item){
		   this.oModel.refresh();
		   return;
	   }
	   if(!this.s2Controller){
		   return;
	   }
	   
	   if(!this.s2Controller.getList().getSelectedItem()){
		   this.oModel.refresh();
		   return;
	   }
	   var data = this.s2Controller.getList().getSelectedItem().getBindingContext().getObject();
	   var key;
	   for(key in this.HeaderObject)
		   data[key] = this.HeaderObject[key];
	   
	   this.s2Controller.getList().updateItems();
	   
   },
   startDateChanged : function(oEvent)
   {
	   this.byId('datePickerStartDate').setValue(this.byId('datePickerStartDate').getCustomData()[1].getValue());
   },
   fetchProductsOnFail : function()
   {
	   //always clean up the delete buffer
	   this.deleteBuffer = []; 

	   this.oModel.read("Leads(guid'"+this.headerGuid+"')",null,["$expand=Products"],true,
					jQuery.proxy(function(odata, response) {
				//var tab = that.byId(
					//	"productBasketEdit");
				//var jsonModel = new sap.ui.model.json.JSONModel();
				
			var	oProductsClone = {
					Products : response.data.Products.results
				};
			 var length = oProductsClone.Products.length;
			 var i;
			//cleaning up the BackendProducts associative json-array
			 this.BackendProducts = {};
			    for(i=0;i<length;i++)
			    	{
			    	 if(oProductsClone.Products[i].ProductGuid === null)
			    		 oProductsClone.Products[i].Backend = "CATEGORY";
			         else
			    	     oProductsClone.Products[i].Backend = "X";
			    	  oProductsClone.Products[i].OldValue = oProductsClone.Products[i].Quantity;
			    	  this.BackendProducts[oProductsClone.Products[i].ItemGuid] = JSON.parse(JSON.stringify(oProductsClone.Products[i]));
			    	}
			  // this.oTableFragment.getModel().setData(s3ObjectClone);
			    var oData = this.byId('productsBasketEdit').getModel('json').getData();
			    
			    oData.Products = oProductsClone.Products;
			    
			    this.byId('productBasketEdit').getModel('json').updateBindings();

			},this));
	  
	   
   },
   
   getItemFromSPath : function(sPath)
   {
	   //search for s2 list item from sPath
	   if(!this.s2Controller){
		   return null;
	   }
	   var items = this.s2Controller.getList().getItems();
	   var i;
	   var context = this.oModel.getContext(sPath);
	   for(i=0;i<items.length;i++)
		   if(context === items[i].getBindingContext())
	           return items[i];
	   
	   return null;
   },
   
   bindHeaderFormsExceptMainContact : function(data,bExceptMainContact)
   {

	 	this.HeaderObject = data;
	 	
	 	if(typeof this.HeaderObject["StartDate"] === "string"){
	 		this.HeaderObject["StartDate"] = new Date(this.HeaderObject["StartDate"]);
	 	}
	 	
	 	if(typeof this.HeaderObject["EndDate"] === "string"){
	 		this.HeaderObject["EndDate"] = new Date(this.HeaderObject["EndDate"]);
	 	}
		this.headerGuid = data.Guid;
		this.userStatusCode = data.UserStatusCode;
		
		if(bExceptMainContact === false)
			{
	    	this.currentDescription = data.Description;
		    this.oSelectedContact.contactID = data.MainContactId;
		    this.oSelectedContact.fullName = data.MainContactName;
		    this.byId('inputMainContact').setValue(data.MainContactName);
			}
		
		//setting values for editable fields
	    this.byId('inputName').setValue(data.Description);  
	    this.byId('inputAccount').setText(data.ProspectName);
	    this.byId('textLeadId').setText(data.Id);
	    this.byId('leadTypetext').setText(data.ProcessTypeDescription);
	    //dates
	    this.byId('datePickerStartDate').setValue(this.formatDate(data.StartDate));  //Formatting the dates
	    this.byId('datePickerEndDate').setValue(this.formatDate(data.EndDate));
	    this.byId('datePickerStartDate').setValueState(sap.ui.core.ValueState.None);
	    this.byId('datePickerEndDate').setValueState(sap.ui.core.ValueState.None);
	    
	   //employee responsible - valid only since backend schema version 2.0
	    if(parseFloat(this.oVersioningModel.getData().BackendSchemaVersion)  >= 2.0){
	    
	    	this.byId('inputEmpResponsible').setValue(data.EmployeeResponsibleName);
	        this.oSelectedAccount.accountID = data.ProspectNumber;
		    this.oSelectedEmployee.employeeID = data.EmployeeResponsibleNumber;
	    }
	  
	    //setting the campaign field 
	    if(this.HeaderObject.CampaignId !== "")
	    	{
	    	     if(this.HeaderObject.CampaignDescription !== "")
	    	    	 this.byId('textCampaign').setValue(this.HeaderObject.CampaignDescription);
	    	     else
	    	    	 this.byId('textCampaign').setValue(this.HeaderObject.CampaignId);
	    	}
	    

	    //setting appropriate values for the dropdown from the le	ad header
//	    this.byId('selectOrigin').getModel('json').setData(s3Object);
//	    this.byId('selectPriority').getModel('json').setData(s3Object);
//	    this.byId('selectQualification').getModel('json').setData(s3Object);
	    
	    var oJsonModel = this.getView().getModel("json");
	    
	    oJsonModel.oData = JSON.parse(JSON.stringify(data));
	    
	    oJsonModel.updateBindings();
	    
	    this.UserStatuses = data.Statuses;
	    this.byId('selectOrigin').setSelectedKey(data.OriginCode);
	    this.byId('selectPriority').setSelectedKey(data.PriorityCode);
	    this.byId('selectQualification').setSelectedKey(data.QualificationCode);
	    this.byId('selectStatus').setSelectedKey(data.UserStatusCode);
		//this.getView().getModel().setData(s3Object);
       
   
   },
   getHeaderFooterOptions : function(){
	   
	   var fnBack;
	   var s3Controller = this.getDetailController();
	   if(jQuery.device.is.phone || (this.fullScreenMode &&  s3Controller === null)){
		   fnBack = jQuery.proxy(this.onBack,this);
	   }
	   else{
		   fnBack = null;
	   }
	   	return {
	   		onBack : fnBack,
			sI18NDetailTitle : this.oResourceBundle.getText('EDIT'),
			oEditBtn : {
				sI18nBtnTxt : "SAVE",
				onBtnPressed : jQuery.proxy(this.onSave,this)
			},
			buttonList : [{
							   sI18nBtnTxt : 'CANCEL',
							   onBtnPressed : jQuery.proxy(this.onCancel,this)
								
							}],
	   	     bSuppressBookmarkButton : true
			
	   	};
	   	
	},
	
	onBack : function(){
		this.onCancel();
	},
	enableProductsAddButton : function(oEvent){
    	
	       if(this.oAddProductsFragment.getContent()[0].getSelectedItems().length > 0){
	    	   this.oAddProductsFragment.getBeginButton().setEnabled(true);
	       }
	       else{
	    	   this.oAddProductsFragment.getBeginButton().setEnabled(false);
	       }
	    },
	    handleErrors : function(oError)
        {
       	// sap.ca.ui.utils.busydialog.releaseBusyDialog();
       	 jQuery.sap.log.error(JSON.stringify(oError));
       	 if(oError.hasOwnProperty("message") && oError.hasOwnProperty("response")){
       	  sap.ca.ui.message.showMessageBox({
				    type: sap.ca.ui.message.Type.ERROR,
				    message : oError.message,
				    details: (typeof oError.response.body == "string") ? oError.response.body : JSON.parse(oError.response.body).error.message.value
				},function(oResult){});
	    	
       	 }
       	 
        },
        
        _areDatesSame : function(oDate1,oDate2){
        	
        	if(oDate1 === null && oDate2 === null){
        		return true;
        	}
             if(!(oDate1 instanceof Date && oDate2 instanceof Date)){
            	 return false;
             }
	      
            //compare only DD MM YYYY
             if(oDate1.getDate() !== oDate2.getDate()){
            	 return false;
              }
             
             if(oDate1.getMonth() !== oDate2.getMonth()){
            	 return false;
             }
             
             if(oDate1.getFullYear() !== oDate2.getFullYear()){
            	 return false;
             }
       
             return true;
        },
        
        _hasUserStatusChanged : function(){
        	return (this.userStatusCode !== this.byId('selectStatus').getSelectedKey());
        },
        
        _hasMainContact : function(){
        return (this.HeaderObject.MainContactId !== this.oSelectedContact.contactID 
            || this.HeaderObject.MainContactName !== this.byId('inputMainContact').getValue());
        },
        
        _hasEmployeeChanged : function(){
        	return (this.HeaderObject.EmployeeResponsibleNumber !== this.oSelectedEmployee.employeeID ||
        	    	this.HeaderObject.EmployeeResponsibleName !== this.byId('inputEmpResponsible').getValue());
        }
   
    
   
  	
});

},
	"cus/crm/lead/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View id="editView" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:ui="sap.ui.layout" \n\t\tcontrollerName="cus.crm.lead.view.S4" xmlns:ca="sap.ca.ui" xmlns:html="http://www.w3.org/1999/xhtml">\n\t\t\n\t<Page id="editPage" title="{i18n>EDIT}"   enableScrolling="true" class="sapUiFioriObjectPage" >\n        <content>   \n        <!--  extension to add more content to the edit page -->\t\n       <core:ExtensionPoint name="leadEditContentTopExtension"></core:ExtensionPoint>\t\n       \t<ui:form.SimpleForm id="form1" minWidth="1024" \n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n       \t  <ui:content > \t  \n       \t  \n       \t    \n       \t    <Label id="descriptionLabel"  text="{i18n>NAME}"> </Label>  \n            <Input id="inputName" maxLength="40" placeholder="{i18n>MAX_CHARS}"></Input>\t \n       \t    \n       \t   \n       \t  </ui:content>\n       \t  </ui:form.SimpleForm>\n       \t  \n       \t     \t<ui:form.SimpleForm id="form2" minWidth="1024"\n\tmaxContainerCols="2"  layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" >   \n\t       <ui:content>\n       \t     <Label id="accountLabel" text="{i18n>ACCOUNT}"> </Label>  \n       \t   \t <Text id="inputAccount" value="{ProspectName}">\n       \t   \t </Text>\n       \t   </ui:content>\n       \t   </ui:form.SimpleForm> \n     \n       \t    \t<ui:form.SimpleForm id="form3" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n\t<ui:content> \n       \t     <Label id="mainContactLabel" text="{i18n>MAIN_CONTACT}"> </Label>   \n       \t     <Input  id="inputMainContact" value="" showValueHelp="true" valueHelpRequest="showContactF4"></Input>\n       \t     </ui:content>\n       \t     </ui:form.SimpleForm>\n       \t     <ui:form.SimpleForm id="form4" visible="{path : \'versioning>/BackendSchemaVersion\',formatter : \'cus.crm.lead.util.formatter.formatEmployeeRespField\'}" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n\t<ui:content> \n       \t     <Label id="empRespLabel"  text="{i18n>EMPLOYEE_RESPONSIBLE}" visible="{path : \'versioning>/BackendSchemaVersion\',formatter : \'cus.crm.lead.util.formatter.formatEmployeeRespField\'}"> </Label>   \n       \t     <Input  id="inputEmpResponsible" value="" showValueHelp="true" valueHelpRequest="showEmployeeF4" visible="{path : \'versioning>/BackendSchemaVersion\',formatter : \'cus.crm.lead.util.formatter.formatEmployeeRespField\'}"></Input>\n       \t     </ui:content>\n       \t     </ui:form.SimpleForm>\n       \t       \n       \t  \n       \t  \n     \n       \t   \t\n       \t  \n       \t  <ui:form.SimpleForm id="form5" minWidth="1024"\n\tmaxContainerCols="2"  layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm" >\n\t\t<ui:content>\n\t\t\t<Label id="leadTypelabel" text="{i18n>LEAD_TYPE}"></Label>\n\t\t\t<Text id="leadTypetext" text="{json>/ProcessTypeDescription}"></Text>\n\t\t</ui:content>\n       \t <ui:content >     \t  \n       \t\t  <Label  id="leadIdLabel" text="{i18n>LEAD_ID}" > </Label>  \n       \t      <Text id="textLeadId" ></Text>\t\t\n      \t</ui:content> \t\t\n       \t</ui:form.SimpleForm>\n       \t\n      \t\n      <ui:form.SimpleForm id="form6" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm" >\n       \t  <ui:content > \t  \t\t\t\n       \t  \t\t\t\t       \n       \t       <Label id="startDateLabel" text="{i18n>START_DATE}" > </Label>  \n       \t      <ca:DatePicker id="datePickerStartDate" liveChange="startDateChanged" >\n       \t     \n       \t      \n       \t      </ca:DatePicker>\n       \t      \n       \t     \n       \t   \n       \t   </ui:content>\n\n       \t</ui:form.SimpleForm>\n       \t\n       \t <ui:form.SimpleForm id="form7" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm" >\n       \t \n       \t   <Label  id="endDateLabel" text="{i18n>END_DATE}" > </Label>  \n       \t       <ca:DatePicker id="datePickerEndDate" ></ca:DatePicker>\n       \t   \n       \t  <ui:content > \t  \n       \t   </ui:content>\n\n       \t</ui:form.SimpleForm>\n       \t   \n       \t<ui:form.SimpleForm id="form8" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n       \t  <ui:content>    \n       \t       <Label id="originsLabel"  text="{i18n>ORIGIN}" > </Label>\n       \t        <Select id= "selectOrigin" items="{json>/Origins}" >\n       \t        \t<items>\n       \t        \t\t<core:Item key="{json>OriginCode}" text= "{json>OriginText}"> </core:Item >\n       \t        \t\t\n       \t        \t</items>\n       \t        </Select>\n       \t        \n       \t\n       \t</ui:content>\n\n       \t                  </ui:form.SimpleForm>\n       \t\t               <ui:form.SimpleForm id="form9" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n       \t                         <ui:content>    \n       \t                            <Label id="campaignLabel" text="{i18n>CAMPAIGN}" ></Label>\n       \t                             <Input id="textCampaign" text="{CampaignDescription}" editable="false"></Input>\n                          \t</ui:content>\n                         \t</ui:form.SimpleForm>\n       \t  \n       \t  \n       \t\n       \t\n       \t<ui:form.SimpleForm id="form10"  minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n       \t  <ui:content > \n       \t       \n       \t       <Label id="priorityLabel" text="{i18n>PRIORITY}" ></Label>  \n       \t       <Select id= "selectPriority" items="{json>/Priorities}" >\n       \t       \t\t<items>\n       \t        \t\t<core:Item key="{json>PriorityCode}" text= "{json>PriorityText}"> </core:Item >\n       \t        \t\t\n       \t        \t</items>\n       \t       \n       \t       </Select>\n       \t       \n       \t       \n       \t      \n\n       \t       \n       \t  </ui:content>\n\n       \t</ui:form.SimpleForm>\n       \t\n       \t <ui:form.SimpleForm id="form11" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n       \t  <ui:content > \n       \t    \n       \t     \t\n       \t       <Label id="qualificationLabel"  text="{i18n>QUALIFICATION}"></Label>  \n       \t       <Select id= "selectQualification" items="{json>/QualificationsLevels}"  >\n       \t       \t\t<items>\n       \t        \t\t<core:Item key="{json>QualificationCode}" text= "{json>QualificationText}"> </core:Item >\n       \t        \t\t\n       \t        \t</items>\n       \t       \n       \t       \n       \t       </Select>\n       \t       \n       \t </ui:content>\n\n       \t</ui:form.SimpleForm>\n       \t\n       \t\t<ui:form.SimpleForm id="form12" minWidth="1024"\n\tmaxContainerCols="2" editable="true" layout="ResponsiveGridLayout"\n\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4" columnsL="1"\n\tcolumnsM="1" class="editableForm">\n       \t  <ui:content> \n       \t       <Label id="statusLabel" class="StatusPadding" text="{i18n>STATUS}"></Label>  \n       \t       <Select id="selectStatus" items="{json>/Statuses}" >\n       \t       \t\t<items>\n       \t        \t\t<core:Item key="{json>UserStatusCode}" text= "{json>UserStatusText}"> </core:Item >\n       \t        \t</items>\n       \t       </Select>\n       \t </ui:content>\n       \t</ui:form.SimpleForm>\n       \t<!--  extension to add more content to the edit page -->\n       \t\t<core:ExtensionPoint name="leadEditContentBottomExtension"></core:ExtensionPoint>\n            <ui:ResponsiveFlowLayout id="responsiveBasket">\n             <ui:content>\n        \t<Table xmlns="sap.m" xmlns:ui="sap.ui.layout" xmlns:core="sap.ui.core"  id="productBasketEdit" headerDesign="Standard"  items="{json>/Products}"  noDataText="{i18n>EMPTY_BASKET}"> \n\t\t\t\t <headerToolbar >\n\t\t\t\t\t<Toolbar id="productToolbar" >\n\t\t\t\t\t\t<Label id="productText_S3" text="{i18n>PRODUCT_BASKET}">\n\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t<ToolbarSpacer id="productSpacer">\n\t\t\t\t\t\t</ToolbarSpacer>\n\t\t\t\t\t\t<Button icon="sap-icon://add" text="{path:\'i18n>ADD_MORE_PRODUCTS\',formatter :\'cus.crm.lead.util.formatter.formatAddMoreProductsText\'}" press="showProductDialog">\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</headerToolbar>\n\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t<!--  extension to add more columns to the product basket -->\n\t\t\t\t\t\t\t<core:ExtensionPoint name="leadProductTabColumnExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t\t<Column id="basketColumn1_S4" vAlign="Middle" width="50%">\n\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t<Label id="productLabel_S4" text="{i18n>PRODUCT_OR_CATEGORY}" design="Bold"></Label>\n\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t<Column id="basketColumn2_S4" vAlign="Middle"   design="Bold">\n\t\t\t\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t\t\t\t<Label id="quantityLabel_S4" text="{i18n>QUANTITY}" design="Bold" hAlign="Right"></Label>\n\t\t\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<Column id="basketColumn3_S4" vAlign="Middle" hAlign="Right" minScreenWidth="Tablet" demandPopin="true" >\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t<!-- extension to add more columns to the product basket -->\t\n\t\t\t\t\t\t\t<core:ExtensionPoint name="leadProductTabColumnEndExtension"></core:ExtensionPoint>\t\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<items >\n\t\t\t\t\t\t\t\t<ColumnListItem id="basketTemplate_S4">\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t<!--  extension to add cells to the product basket list item -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="leadProductTabCellsExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t\t\t<ObjectIdentifier id="productClassify"\n\t\t\t\t\t\t\t\t\t\t title="{path : \'json>ProductGuid\', formatter : \'cus.crm.lead.util.formatter.formatProductName\'}" \n\t\t\t\t\t\t\t\t\t\t text="{path: \'json>ProductGuid\',formatter : \'cus.crm.lead.util.formatter.formatProdClassification\'}">\n\t\t\t\t\t\t\t\t\t\t</ObjectIdentifier>\n\t\t\t\t\t\t\t\t\t\t<HBox id="basketHBox" height="100%">\n\t\t\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t\t\t<Input id="quantityValue_S4"  value="{json>Quantity}" width="70px" editable="{path : \'json>ProductGuid\', formatter : \'cus.crm.lead.util.formatter.formatQuantityField\'}" liveChange="quantityChanged" ></Input>\n\t\t\t\t\t\t\t\t\t\t<Label id="textUnit" text="{json>Unit}"  class="UnitPadding" ></Label>\n\t\t\t\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t\t\t\t\t</HBox>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<Button id="productDeleteButton_S4"  icon="sap-icon://sys-cancel-2" type="Transparent" press="deleteProduct" visible="{path : \'json>ProductGuid\',formatter : \'cus.crm.lead.util.formatter.formatDeleteButton\'}"></Button>\n\t\t\t\t\t\t\t\t\t<!--  extension to add more cells to the product basket list item -->\n\t\t\t\t\t\t\t\t\t<core:ExtensionPoint name="leadProductTabCellsEndExtension"></core:ExtensionPoint>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t\n\t\t\t\t\t\t</Table>\n\t\t\t\t\t\t</ui:content>\n\t\t\t\t\t\t</ui:ResponsiveFlowLayout>\n        </content>\n        \t\t\t\n    </Page>\n            \n        \t\t\t\n</core:View>\n',
	"cus/crm/lead/view/showMaxHit.fragment.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<Dialog xmlns="sap.m" xmlns:core="sap.ui.core" title="{i18n>SHOW_SETTING}" contentWidth="420px" contentHeight="180px" class="showdialog">\n\n    <content>\n    \n        <Text text="{i18n>SHOW_INST}"></Text>\n        <Input id="showInput" value="{showJson>/RetrieveMaxHit/MaxHitNumber}" ></Input>\n        <Text text="{i18n>SHOW_INS_NOTES}" class="showLabel"></Text>\n    </content>\n    <beginButton>\n        <Button text="{i18n>OK}" press="saveMaxHit">\n        </Button>\n    </beginButton>\n    <endButton>\n        <Button text="{i18n>CANCEL} " press="closeShow">\n        </Button>\n    </endButton>\n\n</Dialog>\n'
}});
