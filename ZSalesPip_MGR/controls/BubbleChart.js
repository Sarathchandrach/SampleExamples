/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.crm.BubbleChart");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.crm.BubbleChart",{metadata:{publicMethods:["stepUp","stepDown"],properties:{"xStart":{type:"any",defaultValue:null},"xEnd":{type:"any",defaultValue:null},"xFStart":{type:"any",defaultValue:null},"xFEnd":{type:"any",defaultValue:null},"xLabelTexts":{type:"any",defaultValue:[]},"xLabelValues":{type:"any",defaultValue:[]},"yFStart":{type:"any",defaultValue:null},"yFEnd":{type:"any",defaultValue:null},"yStart":{type:"any",defaultValue:null},"yEnd":{type:"any",defaultValue:null},"yLabelTexts":{type:"any",defaultValue:[]},"yLabelValues":{type:"any",defaultValue:[]},"maxBubbleValue":{type:"any",defaultValue:1},"minBubbleValue":{type:"any",defaultValue:0},"bubbleStepValue":{type:"any",defaultValue:1},"visible":{type:"boolean",defaultValue:true},"readonly":{type:"boolean",defaultValue:false}},aggregations:{"items":{type:"sap.crm.Bubble",multiple:true,singularName:"item"},defaultAggregation:"items",},events:{"change":{},"liveChange":{},"click":{}}},_initVariable:function(){this._firstTime=false;this._handleRsize=15;this._outerbubbleRsize=0.3;this._outerbubble;this._handle;this._originalbubble;this._selectedbubble;this._overLappingBubbles;this._ghostline;this._skip=false;this._margin={top:40,right:0,bottom:40,left:50};this.leftPadding=38;this._containerWidth=600;this._containerHeight=0.5*window.innerHeight;this._data=[];this._widthchartarea;this._heightchartarea;this._vis;this._xScale;this._yScale;this._rScale;this._bubbleMinRsize=25;this._bubbleMaxRsize=400;this._bubbleMinValue=0;this._bubbleMaxValue=1;this._bubbleStepValue=0.01;this.xLabelHeight=0.8;this._xAxis={xStart:0,xEnd:0,xLabelTexts:[],xLabelValues:[],xSegStart:0,xSegEnd:0};this._yAxis={yStart:0,yEnd:0,yLabelTexts:[],yLabelValues:[],ySegStart:0,ySegEnd:0};this._popover=null;this._readOnly=this.getReadonly()},redraw:function(x,y){this._xAxis=x;this._yAxis=y;this._unregisterListener();this._bubbleMaxValue=this.getMaxBubbleValue();this._bubbleMinValue=this.getMinBubbleValue();this._bubbleStepValue=this.getBubbleStepValue();this._readOnly=this.getReadonly();this._redraw();this._registerListener()},_redraw:function(){var _=this;var a;var I=this.getItems();var m,b,c,e;this._containerWidth=jQuery.sap.byId(this.sId).width();this._containerHeight=0.5*window.innerHeight;this._widthchartarea=this._containerWidth-this._margin.right-this._margin.left-40;this._heightchartarea=this._containerHeight-this._margin.top-this._margin.bottom;var f=this._heightchartarea;var g=this._widthchartarea;var T=160;var h=140;var k="#000005";var l="#ffffff";var n="12px";m=this._margin.left+this.leftPadding;e=m+this._widthchartarea;c=this._margin.top;b=c+this._heightchartarea;if(this._vis)this._vis.remove();if(this._svg)this._svg.remove();if((this._containerWidth<=0)||(this._containerHeight<=0))return;this._svg=d3.select("#"+this.getId()).append("svg").attr("class","svg").attr("height",this._containerHeight).attr("width",this._containerWidth);this._vis=this._svg.append("g");this._xScale=d3.time.scale().domain([this._xAxis.xStart,this._xAxis.xEnd]).range([0,this._widthchartarea]);this._bubbleMaxRsize=(p(this._xAxis.xSegEnd)-p(this._xAxis.xSegStart));this._yScale=d3.scale.linear().domain([this._yAxis.yStart,this._yAxis.yEnd]).range([this._heightchartarea,0]);this._data=[];for(var i=0;i<I.length;i++){var E={};for(var j in I[i].mProperties){E[j]=I[i].mProperties[j]}if((this._xAxis.xStart<=new Date(E.x))&&(this._xAxis.xEnd>=new Date(E.x)))this._data.push(E)}this._rScale=d3.scale.linear().domain([this._bubbleMinValue,this._bubbleMaxValue]).range([this._bubbleMinRsize,this._bubbleMaxRsize]);function o(){return(d3.svg.axis().scale(_._yScale).orient("left").tickValues(_._yAxis.yLabelValues).tickPadding(16).tickFormat(function(d,i){return(_._yAxis.yLabelTexts[i])}))}function p(x){return _._xScale(x)+(_._margin.left)+(_.leftPadding)}function q(y){return((_._margin.top)+(_._yScale(y)))}function s(x){var d=(_._xScale.invert(x-(_._margin.left)-(_.leftPadding)));var r=d.getTime()%86400000;d=d-r;var r=Math.round(r/86400000)*86400000;d=d+r;return new Date(d)}function t(y){var d=(_._yScale.invert(y-(_._margin.top)));var r=d%1;d=d-r;var r=Math.round(r/1)*1;d=d+r;return d}function u(r){return(r*_._outerbubbleRsize)}function v(r){return _._rScale(r)}function w(r){var d=_._rScale.invert(r);return Math.round(d)}this._vis.append("g").attr("class","grid").attr("height","5").attr("transform",("translate("+(this._margin.left+this.leftPadding)+","+this._margin.top+")")).call(o().tickSize(-this._widthchartarea,0,1)).attr("pointer-events","none");var z=this.getModel("i18n").getProperty("LBL_OD_CHANCEOFSUCCESS"),A=this,B=sap.ui.getCore().getConfiguration().getRTL(),C=sap.ui.Device.browser;if(B&&C.name!==C.BROWSER.INTERNET_EXPLORER){var D=this._vis.selectAll("text")[0];for(var F=0,G=D.length;F<G;F++)D[F].setAttribute("text-anchor","start")}$(window).on("orientationchange",function(d){if(this.flg!=d.orientation){if(d.orientation=="landscape"){A.xLabelHeight=0.92}else if(d.orientation=="portrait"){A.xLabelHeight=0.8}}this.flg=d.orientation});this._vis.append("text").attr("class","y label").attr("y",16).attr("x",-(window.innerHeight-A.xLabelHeight*window.innerHeight)).style("font-size","0.75rem").attr("dy",".75em").attr("text-anchor","end").attr("transform","rotate(-90)").text(z);var Y=0;if(sap.ui.Device.system.phone)Y=this._vis.selectAll("text")[0][3];else Y=this._vis.selectAll("text")[0][6];var H=Y.getComputedTextLength();var S=(H-this._containerHeight)/2;if(B){if(C.name===C.BROWSER.INTERNET_EXPLORER){Y.setAttribute('text-anchor',"start");H=Y.getComputedTextLength();S=(H-this._containerHeight)/2}Y.setAttribute('x',S-H)}else Y.setAttribute('x',S);var J=this._xAxis.xLabelValues[""]?this._xAxis.xLabelValues[""]:this._xAxis.xLabelValues;this._vis.append("g").attr("height","5").attr("class","x axis").attr("transform",("translate("+(this._margin.left+this.leftPadding)+","+(this._heightchartarea+this._margin.top)+")")).call(d3.svg.axis().scale(this._xScale).orient("bottom").tickValues(J).tickPadding(16).tickFormat(function(d,i){var r=_._xAxis.xLabelTexts[""]?_._xAxis.xLabelTexts[""]:_._xAxis.xLabelTexts;if(i>0){var x;if(sap.ui.Device.system.phone){x=d3.selectAll('.tick')[0][3]}else{x=d3.selectAll('.tick')[0][6]}var y=sap.ui.version<"1.25"?x.parentNode.childNodes[1].textLength.baseVal.value:x.childNodes[1].textLength.baseVal.value;y=y+10;var j1=Math.floor(_._widthchartarea/y);var k1=Math.ceil(r.length/j1);if(r.length>j1){if(i%k1==0)return(r[i]);else return""}else{return(r[i])}}else{return(r[i])}})).attr("pointer-events","none");if(this._xAxis.xSegStart>=this._xAxis.xStart)this._vis.append("line").attr("x1",p(this._xAxis.xSegStart)).attr("y1",this._margin.top).attr("x2",p(this._xAxis.xSegStart)).attr("y2",this._margin.top+this._heightchartarea).style("stroke","rgba(63,183,227,1)").attr("stroke-width","1").attr("pointer-events","none").attr("stroke-dasharray",("4,2"));;if(this._xAxis.xSegEnd<=this._xAxis.xEnd)this._vis.append("line").attr("x1",p(this._xAxis.xSegEnd)).attr("y1",this._margin.top).attr("x2",p(this._xAxis.xSegEnd)).attr("y2",this._margin.top+this._heightchartarea).style("stroke","rgba(63,183,227,1)").attr("stroke-width","1").attr("pointer-events","none").attr("stroke-dasharray",("4,2"));;var K=this._vis.selectAll("g bubbles").data(this._data);var L=K.enter().append("g");L.append("circle").data(this._data).attr("class","circle").attr("id",function(d){return(d.key)}).attr("class","bubbles").attr("cx",function(d){return p(d.x)}).attr("cy",function(d){return q(d.y)}).attr("r",function(d){return v(d.z)}).style("fill","rgba(92,186,230,0.75)").style("stroke","rgba(92,186,230,1)").style("stroke-width","1").on("click",a1);if(C.name==C.BROWSER.INTERNET_EXPLORER){L.append("text").attr("id",(function(d){return(d.key+"text")})).attr("dx",function(d){return p(d.x)-v(0.5*(d.z))}).attr("dy",function(d){return(q(d.y))}).attr("x","3").attr("text-anchor","start").style("font-size","12px").text(function(d){}).each(function(d){var r="http://"+"www.w3.org/2000/svg";var x=d.description,y=0,j1=[],k1=x;while(k1.search(/\W|\s|_/i)!=-1){y=k1.search(/\W|\s|_/i)+1;j1.push(k1.substring(0,y));k1=k1.substring(y)}j1.push(k1);var l1=document.getElementById(d.key+"text");var m1=document.createElementNS(r,"tspan");var n1=document.createTextNode(j1[0]);m1.appendChild(n1);l1.appendChild(m1);for(var i=1;i<j1.length;i++){var o1=m1.firstChild.data.length;m1.firstChild.data+=j1[i];if(m1.getComputedTextLength()>(v(d.z)*Math.sqrt(2))){m1.firstChild.data=m1.firstChild.data.slice(0,o1);var m1=document.createElementNS(r,"tspan");m1.setAttributeNS(null,"x",(p(d.x)-v(0.5*(d.z)))+2);m1.setAttributeNS(null,"dy",18);n1=document.createTextNode(j1[i]);m1.appendChild(n1);l1.appendChild(m1)}}for(var j=1;j<j1.length;j++){if(l1.getBBox().height*Math.sqrt(2)>(v(d.z)*Math.sqrt(2))){var p1=l1.lastChild;l1.removeChild(p1)}}})}else{L.append("foreignObject").attr('width',function(d){return(Math.sqrt(2)*v(d.z))}).attr('height',function(d){return(Math.sqrt(2)*v(d.z))}).attr("x",function(d){return(p(d.x)-(v(d.z)/Math.sqrt(2)))}).attr("y",function(d){return(q(d.y)-(v(d.z)/Math.sqrt(2)))}).style("pointer-events","none").append("xhtml:div").attr("class","circleText").style("pointer-events","none").style("position","inherit").style("height",function(d){return(Math.sqrt(2)*v(d.z)+"px")}).style("width",function(d){return(Math.sqrt(2)*v(d.z)+"px")}).text(function(d){return d.description})}var M=this._vis.append("g").style("display","none");var N=M.append("rect").attr("fill",k).attr("width",T).attr("height",h).style("opacity",0.5);var O=this.getModel("i18n").getProperty("LBL_OD_EXPECTEDREVENUEHEADER");var B=sap.ui.getCore().getConfiguration().getRTL(),P="left",X=B?T-5:5;M.append("text").attr("x",X).attr("y",20).attr("text-anchor",P).attr("font-size",n).attr("font-weight","bold").attr("fill",l).text(O);var Q=this.getModel("i18n").getProperty("LBL_OD_ENDDATE");M.append("text").attr("x",X).attr("y",60).attr("text-anchor",P).attr("font-size",n).attr("font-weight","bold").attr("fill",l).text(Q);M.append("text").attr("x",X).attr("y",100).attr("text-anchor",P).attr("font-size",n).attr("font-weight","bold").attr("fill",l).text(z);var R=M.append("text").attr("x",X).attr("y",40).attr("text-anchor",P).attr("font-size",n).attr("font-weight","bold").attr("fill",l);var U=M.append("text").attr("x",X).attr("y",80).attr("text-anchor",P).attr("font-size",n).attr("font-weight","bold").attr("fill",l);var V=M.append("text").attr("x",X).attr("y",120).attr("text-anchor",P).attr("font-size",n).attr("font-weight","bold").attr("fill",l);function W(d){if(!d)M.style("display","none");else M.style("display","inline")}function Z(){if(_._selectedbubble.cy.baseVal.value<=h/2&&_._selectedbubble.cx.baseVal.value>=g){var r=_._selectedbubble.cx.baseVal.value-_._selectedbubble.r.baseVal.value-u(_._selectedbubble.r.baseVal.value)-T-10;var j1=_._selectedbubble.cy.baseVal.value-(h/4);M.selectAll('path').remove();var x=T+10;var y=h/4;var k1=M.append('path').style("fill",k).style("opacity",0.5).attr('d',function(d){return'M '+x+' '+y+' l -10 -10 l  0 20 z';'M  0 0 l -4 -4 l 8 0 z'})}else if(_._selectedbubble.cy.baseVal.value>=f&&_._selectedbubble.cx.baseVal.value>=g){var r=_._selectedbubble.cx.baseVal.value-_._selectedbubble.r.baseVal.value-u(_._selectedbubble.r.baseVal.value)-T-10;var j1=_._selectedbubble.cy.baseVal.value-(h);M.selectAll('path').remove();var x=T+10;var y=h-10;var k1=M.append('path').style("fill",k).style("opacity",0.5).attr('d',function(d){return'M '+x+' '+y+' l -10 -10 l  0 20 z';'M  0 0 l -4 -4 l 8 0 z'})}else if(_._selectedbubble.cy.baseVal.value>=f){var r=_._selectedbubble.cx.baseVal.value-(T/2);var j1=_._selectedbubble.cy.baseVal.value-_._selectedbubble.r.baseVal.value-u(_._selectedbubble.r.baseVal.value)-(h)-10;M.selectAll('path').remove();var x=T/2,y=h+10;var k1=M.append('path').style("fill",k).style("opacity",0.5).attr('d',function(d){return'M '+x+' '+y+'l -10 -10 l 20 0 z'})}else if(_._selectedbubble.cy.baseVal.value<=h/2){var r=_._selectedbubble.cx.baseVal.value-(T/2);var j1=_._selectedbubble.cy.baseVal.value+_._selectedbubble.r.baseVal.value+u(_._selectedbubble.r.baseVal.value)+(h/5);M.selectAll('path').remove();var x=T/2,y=-10;var k1=M.append('path').style("fill",k).style("opacity",0.5).attr('d',function(d){return'M '+x+' '+y+'l 10 10 l -20 0 z'})}else if(_._selectedbubble.cx.baseVal.value>=g-T*2){var r=_._selectedbubble.cx.baseVal.value-_._selectedbubble.r.baseVal.value-u(_._selectedbubble.r.baseVal.value)-T-10;var j1=_._selectedbubble.cy.baseVal.value-(h/2);M.selectAll('path').remove();var x=T+10;var y=h/2;var k1=M.append('path').style("fill",k).style("opacity",0.5).attr('d',function(d){return'M '+x+' '+y+' l -10 -10 l  0 20 z';'M  0 0 l -4 -4 l 8 0 z'})}else{var r=_._selectedbubble.cx.baseVal.value+_._selectedbubble.r.baseVal.value+u(_._selectedbubble.r.baseVal.value)+10;var j1=_._selectedbubble.cy.baseVal.value-(h/2);M.selectAll('path').remove();var x=-10;var y=h/2;var k1=M.append('path').style("fill",k).style("opacity",0.5).attr('d',function(d){return'M '+x+' '+y+' l 10 10 l 0 -20 z'})}M.attr("transform","translate("+r+","+j1+")");R.text(w(_._selectedbubble.r.baseVal.value));U.text(sap.ui.core.format.DateFormat.getDateInstance({style:"medium"}).format(s(_._selectedbubble.cx.baseVal.value)));V.text(t(_._selectedbubble.cy.baseVal.value)+"%")}function a1(){if(_._selectedbubble){if(_._outerbubble){d3.select(_._outerbubble[0][0]).remove()}if(_._handle){d3.select(_._handle[0][0]).remove()}d3.select(_._selectedbubble).style("stroke-width","1").style("fill","rgba(92,186,230,0.8)").style("stroke","	rgba(92,186,230,1)").call(d3.behavior.drag().on("dragstart",null).on("drag",null).on("dragend",null)).on("touchstart",null).on("touchmove",null).on("touchend",null)}_._selectedbubble=this;_._overLappingBubbles=b1();a=d3.svg.arc().innerRadius(_._selectedbubble.r.baseVal.value).outerRadius(_._selectedbubble.r.baseVal.value+u(_._selectedbubble.r.baseVal.value)).startAngle(0).endAngle(360);var d="translate("+_._selectedbubble.cx.baseVal.value+","+_._selectedbubble.cy.baseVal.value+")";_._outerbubble=_._vis.append("path").attr("d",a).attr("transform",d).style("fill","rgba(255,255,255,0.9)").style("stroke","rgba(0,143,211,0.5)").style("stroke-width","1").on("click",c1);if(_._readOnly==false){_._handle=_._vis.append("circle").attr("id","drag_cicle2").attr("class","bubbles").attr("cy",_._selectedbubble.cy.baseVal.value+_._selectedbubble.r.baseVal.value+u(_._selectedbubble.r.baseVal.value)).attr("cx",_._selectedbubble.cx.baseVal.value).attr("r",_._handleRsize).style("fill","rgba(151,156,163,0.8)").style("stroke","rgba(151,156,163,1)").style("stroke-width","1").call(d3.behavior.drag().on("dragstart",d1).on("drag",f1).on("dragend",e1)).on("touchstart",d1).on("touchmove",f1).on("touchend",e1)}_._selectedbubble.parentNode.parentNode.appendChild(_._selectedbubble.parentNode);d3.select(_._selectedbubble).style("fill","rgba(0,143,211,0.8)").style("stroke","rgba(153,209,1,1)").style("stroke-width","1").style("stroke-dasharray",("1,1"));if(_._readOnly==false){d3.select(_._selectedbubble).call(d3.behavior.drag().on("dragstart",g1).on("drag",i1).on("dragend",h1)).on("touchstart",g1).on("touchmove",i1).on("touchend",h1)}else{_._skip=true}var r=_;var x=function(){r.fireClick({item:{key:r._selectedbubble.__data__.key,description:r._selectedbubble.__data__.description,x:s(r._selectedbubble.cx.baseVal.value),y:t(r._selectedbubble.cy.baseVal.value),z:w(r._selectedbubble.r.baseVal.value),selected:r._selectedbubble,handle:r._handle,overlappedbubbles:r._overLappingBubbles}})};if(!(_._skip)){if(!(document.getElementById("Infopopup"))){function y(){_.oPopover.close()};_.oPopover=new sap.m.ActionSheet({placement:sap.m.PlacementType.Auto,showHeader:false,offsetX:25,offsetY:10,id:"Infopopup",enableScrolling:false,afterOpen:function(){window.setTimeout(y,5000)},buttons:[new sap.m.Button({icon:"sap-icon://hint",press:x})],})}_.oPopover.openBy(document.getElementById(_._selectedbubble.__data__.key));_.oPopover._parent.addStyleClass("cusCrmSalesPipelineSimAS")}else{_._skip=false;_.fireClick({item:{key:_._selectedbubble.__data__.key,description:_._selectedbubble.__data__.description,x:s(_._selectedbubble.cx.baseVal.value),y:t(_._selectedbubble.cy.baseVal.value),z:w(_._selectedbubble.r.baseVal.value),selected:_._selectedbubble,handle:_._handle,overlappedbubbles:_._overLappingBubbles}})}}function b1(){var x=_._selectedbubble.cx.baseVal.value;var y=_._selectedbubble.cy.baseVal.value;var r=_._selectedbubble.r.baseVal.value;var d;var j1;var k1=[];for(var i=0;i<_._data.length;i++){d=p(_._data[i].x);j1=q(_._data[i].y);if(Math.pow((d-x),2)+Math.pow((j1-y),2)<=Math.pow(r,2)){k1.push(document.getElementById(_._data[i].key))}d=null;j1=null}return k1}function c1(){var d=d3.mouse(_._selectedbubble);var x={x:_._selectedbubble.cx.baseVal.value,y:_._selectedbubble.cy.baseVal.value};var y={x:d[0],y:d[1]};var j1=k1(x,y,_._selectedbubble.r.baseVal.value+u(_._selectedbubble.r.baseVal.value));_._handle[0][0].cy.baseVal.value=j1.y;_._handle[0][0].cx.baseVal.value=j1.x;function k1(x,l1,r){var m1={};var n1=(l1.y-x.y)/(l1.x-x.x);var o1=Math.atan(n1);var p1=1;if((l1.x-x.x)<0){p1=-1}m1.x=x.x+r*Math.cos(o1)*p1;m1.y=x.y+r*Math.sin(o1)*p1;return m1}}function d1(){var a=d3.svg.arc().innerRadius(0).outerRadius(_._selectedbubble.r.baseVal.value).startAngle(0).endAngle(360);var d="translate("+_._selectedbubble.cx.baseVal.value+","+_._selectedbubble.cy.baseVal.value+")";_._originalbubble=_._vis.append("path").attr("d",a).attr("transform",d).style("stroke","green").style("fill","rgba(0,143,211,0.15)").style("stroke-width","1").style("stroke-dasharray",("3, 3")).attr("pointer-events","none")}function e1(){d3.select(_._originalbubble[0][0]).remove();W(false);_.fireChange({item:{key:_._selectedbubble.__data__.key,description:_._selectedbubble.__data__.description,x:s(_._selectedbubble.cx.baseVal.value),y:t(_._selectedbubble.cy.baseVal.value),z:w(_._selectedbubble.r.baseVal.value)}})}function f1(){var x=[];var y=[];if(d3.event.type=="drag"){x=d3.mouse(this)}if(d3.event.type=="touchmove"){y=d3.touches(this);x[0]=y[0][0];x[1]=y[0][1]}var dx=_._selectedbubble.cx.baseVal.value-x[0];var dy=_._selectedbubble.cy.baseVal.value-x[1];var d=(dx*dx)+(dy*dy);var r=Math.sqrt(d);var j1=r-u(_._selectedbubble.r.baseVal.value);if(j1<_._bubbleMinRsize||j1>_._bubbleMaxRsize)return;_._handle[0][0].cy.baseVal.value=x[1];_._handle[0][0].cx.baseVal.value=x[0];_._selectedbubble.r.baseVal.value=r-u(_._selectedbubble.r.baseVal.value);a.innerRadius(_._selectedbubble.r.baseVal.value).outerRadius(_._selectedbubble.r.baseVal.value+u(_._selectedbubble.r.baseVal.value));_._outerbubble.attr("d",a);if(C.name!==C.BROWSER.INTERNET_EXPLORER){d3.select(_._selectedbubble.nextElementSibling).attr("x",(_._selectedbubble.cx.baseVal.value-(_._selectedbubble.r.baseVal.value/Math.sqrt(2)))).attr("y",(_._selectedbubble.cy.baseVal.value-(_._selectedbubble.r.baseVal.value/Math.sqrt(2)))).attr('width',(_._selectedbubble.r.baseVal.value*Math.sqrt(2))).attr('height',(_._selectedbubble.r.baseVal.value*Math.sqrt(2)));$(_._selectedbubble.nextElementSibling.childNodes).css("height",(_._selectedbubble.r.baseVal.value*Math.sqrt(2))).css("width",(_._selectedbubble.r.baseVal.value*Math.sqrt(2)))}W(true);Z()}function g1(){var a=d3.svg.arc().innerRadius(_._selectedbubble.r.baseVal.value).outerRadius(_._selectedbubble.r.baseVal.value).startAngle(0).endAngle(360);var d="translate("+_._selectedbubble.cx.baseVal.value+","+_._selectedbubble.cy.baseVal.value+")";_._originalbubble=_._vis.append("path").attr("d",a).attr("transform",d).style("stroke","green").style("fill","rgba(255,255,255,0.1)").style("stroke-width","1").style("stroke-dasharray",("3, 3")).attr("pointer-events","none");_._ghostline=_._vis.append("line").attr("x1",_._selectedbubble.cx.baseVal.value).attr("y1",_._selectedbubble.cy.baseVal.value).attr("x2",_._selectedbubble.cx.baseVal.value).attr("y2",_._selectedbubble.cy.baseVal.value).style("stroke","green").style("stroke-width","1").style("stroke-dasharray",("3, 3")).attr("pointer-events","none");W(true);Z()}function h1(){d3.select(_._originalbubble[0][0]).remove();d3.select(_._ghostline[0][0]).remove();_.fireChange({item:{key:_._selectedbubble.__data__.key,description:_._selectedbubble.__data__.description,x:s(_._selectedbubble.cx.baseVal.value),y:t(_._selectedbubble.cy.baseVal.value),z:w(_._selectedbubble.r.baseVal.value)}});W(false)}function i1(){var d=[];var r=[];if(d3.event.type=="drag"){d=d3.mouse(this)}if(d3.event.type=="touchmove"){r=d3.touches(this);d[0]=r[0][0];d[1]=r[0][1]}if(d[0]<m||d[0]>e||d[1]<c||d[1]>b)return;if(C.name!==C.BROWSER.INTERNET_EXPLORER){d3.select(_._selectedbubble.nextElementSibling).attr("x",(d[0]-(_._selectedbubble.r.baseVal.value/Math.sqrt(2)))).attr("y",(d[1]-(_._selectedbubble.r.baseVal.value/Math.sqrt(2))))}this.cx.baseVal.value=d[0];this.cy.baseVal.value=d[1];_._outerbubble.attr("transform","translate("+this.cx.baseVal.value+","+this.cy.baseVal.value+")");_._handle[0][0].cy.baseVal.value=this.cy.baseVal.value+this.r.baseVal.value+u(_._selectedbubble.r.baseVal.value);_._handle[0][0].cx.baseVal.value=this.cx.baseVal.value;d3.select(_._ghostline[0][0]).attr("x2",d[0]).attr("y2",d[1]);Z()}},onAfterRendering:function(){var x={xStart:this.getXStart(),xEnd:this.getXEnd(),xLabelTexts:this.getXLabelTexts(),xLabelValues:this.getXLabelValues(),xSegStart:this.getXFStart(),xSegEnd:this.getXFEnd()};var y={yStart:parseInt(this.getYStart()),yEnd:parseInt(this.getYEnd()),yLabelTexts:this.getYLabelTexts(),yLabelValues:this.getYLabelValues(),ySegStart:parseInt(this.getYFStart()),ySegEnd:parseInt(this.getYFEnd())};this.redraw(x,y);var c=sap.ca.scfld.md.app.Application.getImpl();if(c.oCurController.FullCtrl.reRenderTopNSlider){c.oCurController.FullCtrl.showTopNOpp();this._unregisterListener();this._redraw();this._registerListener();c.oCurController.FullCtrl.reRenderTopNSlider=false}},setSelection:function(k){this._skip=true;document.getElementById(k).__onclick(this._skip)}});jQuery.sap.require("sap.ui.core.EnabledPropagator");sap.ui.core.EnabledPropagator.apply(sap.crm.BubbleChart.prototype,[true]);sap.crm.BubbleChart.M_EVENTS={'change':'change','liveChange':'liveChange'};
sap.crm.BubbleChart.prototype.init=function(){this._initVariable()};
sap.crm.BubbleChart.prototype._unregisterListener=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);delete this._sResizeListenerId}};
sap.crm.BubbleChart.prototype._registerListener=function(){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),jQuery.proxy(this.onresize,this))};
sap.crm.BubbleChart.prototype.onresize=function(o){this._unregisterListener();this._redraw();this._registerListener()};
