/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// Bubble Item

jQuery.sap.declare("sap.crm.BubbleChart");
jQuery.sap.require("sap.m.library");
jQuery.sap.require("sap.ui.core.Control");

// Bubble Chart
sap.ui.core.Control
		.extend(
				"sap.crm.BubbleChart",
				{

					// the control API:
					metadata : {

						// ---- object ----
						publicMethods : [
						// methods
						"stepUp", "stepDown" ],

						properties : {
							"xStart" : {
								type : "any",
								defaultValue : null
							},

							"xEnd" : {
								type : "any",
								defaultValue : null
							},

							"xFStart" : {
								type : "any",
								defaultValue : null
							},

							"xFEnd" : {
								type : "any",
								defaultValue : null
							},

							"xLabelTexts" : {
								type : "any",
								defaultValue : []
							},

							"xLabelValues" : {
								type : "any",
								defaultValue : []
							},

							"yFStart" : {
								type : "any",
								defaultValue : null
							},
							"yFEnd" : {
								type : "any",
								defaultValue : null
							},

							"yStart" : {
								type : "any",
								defaultValue : null
							},
							"yEnd" : {
								type : "any",
								defaultValue : null
							},

							"yLabelTexts" : {
								type : "any",
								defaultValue : []
							},

							"yLabelValues" : {
								type : "any",
								defaultValue : []
							},

							"maxBubbleValue" : {
								type : "any",
								defaultValue : 1
							},

							"minBubbleValue" : {
								type : "any",
								defaultValue : 0
							},

							"bubbleStepValue" : {
								type : "any",
								defaultValue : 1
							},

							"visible" : {
								type : "boolean",
								defaultValue : true
							},

							"readonly" : {
								type : "boolean",
								defaultValue : false
							}

						},
						aggregations : {
							"items" : {
								type : "sap.crm.Bubble",
								multiple : true,
								singularName : "item"
							},
							defaultAggregation : "items",
						},
						events : {
							"change" : {},
							"liveChange" : {},
							"click" : {}
						}
					},

					_initVariable : function() {
						this._firstTime = false;
						this._handleRsize = 15;
						this._outerbubbleRsize = 0.3;
						this._outerbubble;
						this._handle;
						this._originalbubble;
						this._selectedbubble;
						this._overLappingBubbles;
						this._ghostline;
						this._skip = false;
						this._margin = {
							top : 40,
							right : 0,
							bottom : 40,
							left : 50
						};
						this.leftPadding = 38;
						this._containerWidth = 600;
						this._containerHeight = 0.5 * window.innerHeight;
						this._data = [];
						this._widthchartarea;
						this._heightchartarea;
						this._vis;
						this._xScale;
						this._yScale;
						this._rScale;
						this._bubbleMinRsize = 25;
						this._bubbleMaxRsize = 400;
						this._bubbleMinValue = 0;
						this._bubbleMaxValue = 1;
						this._bubbleStepValue = 0.01;
						this.xLabelHeight = 0.8;
						this._xAxis = {
							xStart : 0,
							xEnd : 0,
							xLabelTexts : [],
							xLabelValues : [],
							xSegStart : 0,
							xSegEnd : 0

						};

						this._yAxis = {
							yStart : 0,
							yEnd : 0,
							yLabelTexts : [],
							yLabelValues : [],
							ySegStart : 0,
							ySegEnd : 0

						};
						this._popover = null;

						this._readOnly = this.getReadonly();
					},

					redraw : function(xAxis, yAxis) {

						this._xAxis = xAxis;
						this._yAxis = yAxis;
						this._unregisterListener();
						this._bubbleMaxValue = this.getMaxBubbleValue();
						this._bubbleMinValue = this.getMinBubbleValue();
						this._bubbleStepValue = this.getBubbleStepValue();
						this._readOnly = this.getReadonly();
						this._redraw();
						this._registerListener();
					},

					_redraw : function() {

						var _chartControl = this;
						var arc;
						var aItems = this.getItems();
						var minCX, maxCY, minCY, maxCX;

						this._containerWidth = jQuery.sap.byId(this.sId)
								.width();
						/*
						 * this._containerHeight = screen.availHeight;
						 * this._containerHeight = 480;
						 */
						this._containerHeight = 0.5 * window.innerHeight;
						this._widthchartarea = this._containerWidth
								- this._margin.right - this._margin.left - 40;
						this._heightchartarea = this._containerHeight
								- this._margin.top - this._margin.bottom;

						var myheightchartarea = this._heightchartarea;
						var mywidthchartarea = this._widthchartarea;

						var Tooltip_Width = 160;
						var Tooltip_Height = 140;
						var ToolTip_BgColor = "#000005";
						var ToolTipText_Color = "#ffffff";
						var ToolTipText_FontSize = "12px";

						minCX = this._margin.left + this.leftPadding;
						maxCX = minCX + this._widthchartarea;
						minCY = this._margin.top;
						maxCY = minCY + this._heightchartarea;

						if (this._vis)
							this._vis.remove();
						if (this._svg)
							this._svg.remove();

						// $("#" + this.getId()).click(click_bubble);
						if ((this._containerWidth <= 0)
								|| (this._containerHeight <= 0))
							return;

						this._svg = d3.select("#" + this.getId()).append("svg")
								.attr("class", "svg").attr("height",
										this._containerHeight).attr("width",
										this._containerWidth);

						this._vis = this._svg.append("g");

						this._xScale = d3.time.scale().domain(
								[ this._xAxis.xStart, this._xAxis.xEnd ])
								.range([ 0, this._widthchartarea ]);

						this._bubbleMaxRsize = (cal_x(this._xAxis.xSegEnd) - cal_x(this._xAxis.xSegStart));

						// this._bubbleMaxRsize = this._containerHeight;

						this._yScale = d3.scale.linear().domain(
								[ this._yAxis.yStart, this._yAxis.yEnd ])
								.range([ this._heightchartarea, 0 ]);
						this._data = [];
						for ( var i = 0; i < aItems.length; i++) {
							var oEntry = {};
							for ( var j in aItems[i].mProperties) {
								oEntry[j] = aItems[i].mProperties[j];
							}
							if ((this._xAxis.xStart <= new Date(oEntry.x))
									&& (this._xAxis.xEnd >= new Date(oEntry.x)))
								this._data.push(oEntry);
						}

						this._rScale = d3.scale.linear().domain(
								[ this._bubbleMinValue, this._bubbleMaxValue ])
								.range(
										[ this._bubbleMinRsize,
												this._bubbleMaxRsize ]);

						function make_y_axis() {

							return (d3.svg.axis().scale(_chartControl._yScale)
									.orient("left").tickValues(
											_chartControl._yAxis.yLabelValues)
									.tickPadding(16).tickFormat(function(d, i) {
								return (_chartControl._yAxis.yLabelTexts[i]);
							}));

						}

						function cal_x(x) {
							return _chartControl._xScale(x)
									+ (_chartControl._margin.left)
									+ (_chartControl.leftPadding);
						}

						function cal_y(y) {
							return ((_chartControl._margin.top) + (_chartControl
									._yScale(y)));
						}

						function cal_inv_x(x) {
							var value = (_chartControl._xScale.invert(x
									- (_chartControl._margin.left)
									- (_chartControl.leftPadding)));
							var rem = value.getTime() % 86400000;
							value = value - rem;
							var rem = Math.round(rem / 86400000) * 86400000;
							value = value + rem;
							return new Date(value);

						}

						function cal_inv_y(y) {
							var value = (_chartControl._yScale.invert(y
									- (_chartControl._margin.top)));
							var rem = value % 1;
							value = value - rem;
							var rem = Math.round(rem / 1) * 1;
							value = value + rem;
							return value;

						}
						function cal_outer_bubble_r(r) {
							return (r * _chartControl._outerbubbleRsize);
							// return r;
						}
						function cal_r(r) {
							return _chartControl._rScale(r);
						}

						function cal_inv_r(r) {
							/*
							 * var value = _chartControl._rScale.invert(r); var
							 * rem = value % _chartControl._bubbleStepValue;
							 * value = value - rem; var rem = Math.round(rem /
							 * _chartControl._bubbleStepValue)
							 * _chartControl._bubbleStepValue; value = value +
							 * rem; return value;
							 */
							var value = _chartControl._rScale.invert(r);
							return Math.round(value);
						}

						// y axis

						this._vis
								.append("g")
								.attr("class", "grid")
								.attr("height", "5")
								.attr(
										"transform",
										("translate("
												+ (this._margin.left + this.leftPadding)
												+ "," + this._margin.top + ")"))
								.call(
										make_y_axis().tickSize(
												-this._widthchartarea, 0, 1))
								.attr("pointer-events", "none");

						var yAxisText = this.getModel("i18n").getProperty(
								"LBL_OD_CHANCEOFSUCCESS"), that = this, bIsRTL = sap.ui
								.getCore().getConfiguration().getRTL(), oBrowser = sap.ui.Device.browser;
						if (bIsRTL
								&& oBrowser.name !== oBrowser.BROWSER.INTERNET_EXPLORER) {
							var aTextElems = this._vis.selectAll("text")[0];
							for ( var ii = 0, jj = aTextElems.length; ii < jj; ii++)
								aTextElems[ii].setAttribute("text-anchor",
										"start");
						}

						$(window).on("orientationchange", function(event) {
							if (this.flg != event.orientation) {
								if (event.orientation == "landscape") {
									that.xLabelHeight = 0.92;
								} else if (event.orientation == "portrait") {
									that.xLabelHeight = 0.8;
								}
							}
							this.flg = event.orientation;
						});

						this._vis.append("text").attr("class", "y label").attr(
								"y", 16).attr(
								"x",
								-(window.innerHeight - that.xLabelHeight
										* window.innerHeight)).style(
								"font-size", "0.75rem").attr("dy", ".75em")
								.attr("text-anchor", "end").attr("transform",
										"rotate(-90)").text(yAxisText);
						var oYLabel = 0;
						if (sap.ui.Device.system.phone)
							oYLabel = this._vis.selectAll("text")[0][3];
						else
							oYLabel = this._vis.selectAll("text")[0][6];
						// var iYLblLength = oYLabel.textLength.baseVal.value;
						var iYLblLength = oYLabel.getComputedTextLength();
						var iSetVal = (iYLblLength - this._containerHeight) / 2;
						if (bIsRTL) {
							if (oBrowser.name === oBrowser.BROWSER.INTERNET_EXPLORER) {
								oYLabel.setAttribute('text-anchor', "start");
								iYLblLength = oYLabel.getComputedTextLength();
								iSetVal = (iYLblLength - this._containerHeight) / 2;
							}
							oYLabel.setAttribute('x', iSetVal - iYLblLength);
						} else
							oYLabel.setAttribute('x', iSetVal);
						var arrLV = this._xAxis.xLabelValues[""] ? this._xAxis.xLabelValues[""]
								: this._xAxis.xLabelValues;
						// x axis
						this._vis
								.append("g")
								.attr("height", "5")
								.attr("class", "x axis")
								.attr(
										"transform",
										("translate("
												+ (this._margin.left + this.leftPadding)
												+ ","
												+ (this._heightchartarea + this._margin.top) + ")"))
								.call(
										d3.svg
												.axis()
												.scale(this._xScale)
												.orient("bottom")
												.tickValues(arrLV)
												.tickPadding(16)
												.tickFormat(
														function(d, i) {
															/*
															 * if
															 * (_chartControl._xAxis.xLabelTexts.length >
															 * 12) if (i % 4 ==
															 * 0) return
															 * (_chartControl._xAxis.xLabelTexts[i]);
															 * else return "";
															 * else
															 */
															var arrLT = _chartControl._xAxis.xLabelTexts[""] ? _chartControl._xAxis.xLabelTexts[""]
																	: _chartControl._xAxis.xLabelTexts;
															if (i > 0) {
																var objText;
																if (sap.ui.Device.system.phone) {
																	objText = d3
																			.selectAll('.tick')[0][3];
																} else {
																	objText = d3
																			.selectAll('.tick')[0][6];
																}
																var length = sap.ui.version < "1.25" ? objText.parentNode.childNodes[1].textLength.baseVal.value
																		: objText.childNodes[1].textLength.baseVal.value;
																length = length + 10;
																var maxLbl = Math
																		.floor(_chartControl._widthchartarea
																				/ length);
																var skipCount = Math
																		.ceil(arrLT.length
																				/ maxLbl);

																if (arrLT.length > maxLbl) {
																	if (i
																			% skipCount == 0)
																		return (arrLT[i]);
																	else
																		return "";
																} else {
																	return (arrLT[i]);
																}
															} else {
																return (arrLT[i]);
															}
														})).attr(
										"pointer-events", "none");
						if (this._xAxis.xSegStart >= this._xAxis.xStart)
							this._vis.append("line").attr("x1",
									cal_x(this._xAxis.xSegStart)).attr("y1",
									this._margin.top).attr("x2",
									cal_x(this._xAxis.xSegStart)).attr("y2",
									this._margin.top + this._heightchartarea)
									.style("stroke", "rgba(63,183,227,1)")
									.attr("stroke-width", "1").attr(
											"pointer-events", "none").attr(
											"stroke-dasharray", ("4,2"));
						;

						if (this._xAxis.xSegEnd <= this._xAxis.xEnd)
							this._vis.append("line").attr("x1",
									cal_x(this._xAxis.xSegEnd)).attr("y1",
									this._margin.top).attr("x2",
									cal_x(this._xAxis.xSegEnd)).attr("y2",
									this._margin.top + this._heightchartarea)
									.style("stroke", "rgba(63,183,227,1)")
									.attr("stroke-width", "1").attr(
											"pointer-events", "none").attr(
											"stroke-dasharray", ("4,2"));
						;

						/* bubbles */

						/* bubbles and Text grouping */

						var elem = this._vis.selectAll("g bubbles").data(
								this._data);

						var elemEnter = elem.enter().append("g");
						// var elemEnter = elem.enter().append("g").attr(
						// "transform",
						// function(d) {
						// return "transform(" + cal_x(d.x) + ","
						// + cal_y(d.y) + ")";
						// });

						/* Bubbles Creation */

						elemEnter.append("circle").data(this._data).attr(
								"class", "circle").attr("id", function(d) {
							return (d.key);
						}).attr("class", "bubbles").attr("cx", function(d) {
							return cal_x(d.x);
						}).attr("cy", function(d) {
							return cal_y(d.y);
						}).attr("r", function(d) {
							return cal_r(d.z);
						}).style("fill", "rgba(92,186,230,0.75)").style(
								"stroke", "rgba(92,186,230,1)").style(
								"stroke-width", "1").on("click", clickbubble);

						/* Text Creation */
						if (oBrowser.name == oBrowser.BROWSER.INTERNET_EXPLORER) {

							elemEnter
									.append("text")
									.attr("id", (function(d) {
										return (d.key + "text");
									}))
									.attr("dx", function(d) {
										return cal_x(d.x) - cal_r(0.5 * (d.z));
									})
									.attr("dy", function(d) {
										return (cal_y(d.y));
									})
									.attr("x", "3")
									.attr("text-anchor", "start")
									.style("font-size", "12px")
									.text(function(d) {

									})
									.each(
											function(d) {

												var svgNS = "http://"
														+ "www.w3.org/2000/svg";

												// var text = "asdf
												// qwerty_zxcv*upio_pkmpm&zxcvv
												// qwerty";
												var text = d.description, iCutIndex = 0, words = [], sCopy = text;
												while (sCopy.search(/\W|\s|_/i) != -1) {
													iCutIndex = sCopy
															.search(/\W|\s|_/i) + 1;
													words.push(sCopy.substring(
															0, iCutIndex));
													sCopy = sCopy
															.substring(iCutIndex);
												}
												words.push(sCopy);
												// var words = text.split(' ');
												var text_element = document
														.getElementById(d.key
																+ "text");
												var tspan_element = document
														.createElementNS(svgNS,
																"tspan");
												// Create first tspan element
												var text_node = document
														.createTextNode(words[0]);
												// Create text in tspan element

												tspan_element
														.appendChild(text_node);
												// Add tspan element to DOM
												text_element
														.appendChild(tspan_element);

												for ( var i = 1; i < words.length; i++) {
													var len = tspan_element.firstChild.data.length;
													// Find number of letters in
													// string
													tspan_element.firstChild.data += words[i];
													// Add next word

													if (tspan_element
															.getComputedTextLength() > (cal_r(d.z) * Math
															.sqrt(2))) {
														tspan_element.firstChild.data = tspan_element.firstChild.data
																.slice(0, len);
														// Remove added word

														var tspan_element = document
																.createElementNS(
																		svgNS,
																		"tspan");
														// Create new tspan
														// element
														tspan_element
																.setAttributeNS(
																		null,
																		"x",
																		(cal_x(d.x) - cal_r(0.5 * (d.z))) + 2);
														tspan_element
																.setAttributeNS(
																		null,
																		"dy",
																		18);
														text_node = document
																.createTextNode(words[i]);
														tspan_element
																.appendChild(text_node);
														text_element
																.appendChild(tspan_element);

													}

												}
												for ( var j = 1; j < words.length; j++) {
													if (text_element.getBBox().height
															* Math.sqrt(2) > (cal_r(d.z) * Math
															.sqrt(2))) {
														var lastChild = text_element.lastChild;
														text_element
																.removeChild(lastChild);

													}
												}

											});
						}

						else {
							elemEnter.append("foreignObject").attr('width',
									function(d) {
										return (Math.sqrt(2) * cal_r(d.z));
									}).attr('height', function(d) {
								return (Math.sqrt(2) * cal_r(d.z));
							}).attr(
									"x",
									function(d) {
										return (cal_x(d.x) - (cal_r(d.z) / Math
												.sqrt(2)));
									}).attr(
									"y",
									function(d) {
										return (cal_y(d.y) - (cal_r(d.z) / Math
												.sqrt(2)));
									}).style("pointer-events", "none").append(
									"xhtml:div").attr("class", "circleText")
									.style("pointer-events", "none").style(
											"position", "inherit").style(
											"height",
											function(d) {
												return (Math.sqrt(2)
														* cal_r(d.z) + "px");
											}).style(
											"width",
											function(d) {
												return (Math.sqrt(2)
														* cal_r(d.z) + "px");
											}).text(function(d) {
										return d.description;
									});

						}

						// Tooltip
						var tooltip = this._vis.append("g").style("display",
								"none");

						var tooltipcontent = tooltip.append("rect").attr(
								"fill", ToolTip_BgColor).attr("width",
								Tooltip_Width).attr("height", Tooltip_Height)
								.style("opacity", 0.5);
						var expectedRevenue = this.getModel("i18n")
								.getProperty("LBL_OD_EXPECTEDREVENUEHEADER");
						var bIsRTL = sap.ui.getCore().getConfiguration()
								.getRTL(), sAnchorVal = oBrowser.name === oBrowser.BROWSER.INTERNET_EXPLORER ? "end"
								: "start", iXoffset = bIsRTL ? Tooltip_Width - 5
								: 5;
						tooltip.append("text").attr("x", iXoffset)
								.attr("y", 20).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color)
								.text(expectedRevenue);
						var closingDate = this.getModel("i18n").getProperty(
								"LBL_OD_ENDDATE");

						tooltip.append("text").attr("x", iXoffset)
								.attr("y", 60).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color).text(closingDate);

						tooltip.append("text").attr("x", iXoffset).attr("y",
								100).attr("text-anchor", sAnchorVal).attr(
								"font-size", ToolTipText_FontSize).attr(
								"font-weight", "bold").attr("fill",
								ToolTipText_Color).text(yAxisText);

						var t1 = tooltip.append("text").attr("x", iXoffset)
								.attr("y", 40).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color);
						var t2 = tooltip.append("text").attr("x", iXoffset)
								.attr("y", 80).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color);

						var t3 = tooltip.append("text").attr("x", iXoffset)
								.attr("y", 120).attr("text-anchor", sAnchorVal)
								.attr("font-size", ToolTipText_FontSize).attr(
										"font-weight", "bold").attr("fill",
										ToolTipText_Color);

						function display_tooltip(display) {
							if (!display)
								tooltip.style("display", "none");
							else
								/* tooltip.style("display", "inherit"); */
								tooltip.style("display", "inline");

						}

						function move_tooltip() {

							if (_chartControl._selectedbubble.cx.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Width
									&& _chartControl._selectedbubble.cy.baseVal.value <= Tooltip_Height / 2) {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- Tooltip_Width - 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- (Tooltip_Height / 4);

								tooltip.selectAll('path').remove();
								var x = Tooltip_Width + 10;
								var y = Tooltip_Height / 4;

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l -10 -10 l  0 20 z';

											'M  0 0 l -4 -4 l 8 0 z'
										});

							}

							else if (_chartControl._selectedbubble.cx.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Width
									&& _chartControl._selectedbubble.cy.baseVal.value >= myheightchartarea)

							{

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- Tooltip_Width - 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- (Tooltip_Height);

								tooltip.selectAll('path').remove();
								var x = Tooltip_Width + 10;
								var y = Tooltip_Height - 10;

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l -10 -10 l  0 20 z';

										});

							}

							else if (_chartControl._selectedbubble.cx.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Width)

							{

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- Tooltip_Width - 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- (Tooltip_Height / 2);

								tooltip.selectAll('path').remove();
								var x = Tooltip_Width + 10;
								var y = Tooltip_Height / 2;

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l -10 -10 l  0 20 z';

											'M  0 0 l -4 -4 l 8 0 z'
										});

							}

							else if (_chartControl._selectedbubble.cy.baseVal.value
									- _chartControl._selectedbubble.r.baseVal.value
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value) >= Tooltip_Height)

							{
								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- (Tooltip_Width / 2);
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										- _chartControl._selectedbubble.r.baseVal.value
										- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										- (Tooltip_Height) - 10;
								tooltip.selectAll('path').remove();
								var x = Tooltip_Width / 2, y = Tooltip_Height + 10;
								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ 'l -10 -10 l 20 0 z';

										});
							}

							else if (myheightchartarea
									- (_chartControl._selectedbubble.cy.baseVal.value
											+ _chartControl._selectedbubble.r.baseVal.value + cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)) >= Tooltip_Height) {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										- (Tooltip_Width / 2);
								var ypos = _chartControl._selectedbubble.cy.baseVal.value
										+ _chartControl._selectedbubble.r.baseVal.value
										+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										+ (Tooltip_Height / 5);
								tooltip.selectAll('path').remove();
								var x = Tooltip_Width / 2, y = -10;
								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ 'l 10 10 l -20 0 z';

										});

							}

							else {

								var xpos = _chartControl._selectedbubble.cx.baseVal.value
										+ _chartControl._selectedbubble.r.baseVal.value
										+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value)
										+ 10;
								var ypos = _chartControl._selectedbubble.cy.baseVal.value

										- (Tooltip_Height / 2);

								tooltip.selectAll('path').remove();
								var x = -10;
								var y = Tooltip_Height / 2;
								if (_chartControl._selectedbubble.cy.baseVal.value <= Tooltip_Height / 2) {
									var ypos = _chartControl._selectedbubble.cy.baseVal.value

											- (Tooltip_Height / 4);
									var x = -10;
									var y = Tooltip_Height / 4;

								}

								var toolArrow = tooltip.append('path').style(
										"fill", ToolTip_BgColor).style(
										"opacity", 0.5).attr(
										'd',
										function(d) {

											return 'M ' + x + ' ' + y
													+ ' l 10 10 l 0 -20 z';
										});
							}

							tooltip.attr("transform", "translate(" + xpos + ","
									+ ypos + ")")
							t1
									.text(cal_inv_r(_chartControl._selectedbubble.r.baseVal.value));
							t2
									.text(sap.ui.core.format.DateFormat
											.getDateInstance({
												style : "medium"
											})
											.format(
													cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value)));
							t3
									.text(cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value)
											+ "%")
						}

						// Action sheet

						function clickbubble() {

							if (_chartControl._selectedbubble) {
								if (_chartControl._outerbubble) {
									d3.select(_chartControl._outerbubble[0][0])
											.remove();
								}
								if (_chartControl._handle) {
									d3.select(_chartControl._handle[0][0])
											.remove();
								}

								d3.select(_chartControl._selectedbubble).style(
										"stroke-width", "1").style("fill",
										"rgba(92,186,230,0.8)").style("stroke",
										"	rgba(92,186,230,1)").call(
										d3.behavior.drag()
												.on("dragstart", null).on(
														"drag", null).on(
														"dragend", null)).on(
										"touchstart", null).on("touchmove",
										null).on("touchend", null);

							}

							_chartControl._selectedbubble = this;
							_chartControl._overLappingBubbles = overlapping_bubbles();

							arc = d3.svg
									.arc()
									.innerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value
													+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value))
									.startAngle(0).endAngle(360);

							var transform = "translate("
									+ _chartControl._selectedbubble.cx.baseVal.value
									+ ","
									+ _chartControl._selectedbubble.cy.baseVal.value
									+ ")";

							_chartControl._outerbubble = _chartControl._vis
									.append("path").attr("d", arc).attr(
											"transform", transform).style(
											"fill", "rgba(255,255,255,0.9)")
									.style("stroke", "rgba(0,143,211,0.5)")
									.style("stroke-width", "1").on("click",
											click_circle);

							if (_chartControl._readOnly == false) {
								_chartControl._handle = _chartControl._vis
										.append("circle")
										.attr("id", "drag_cicle2")
										.attr("class", "bubbles")
										.attr(
												"cy",
												_chartControl._selectedbubble.cy.baseVal.value
														+ _chartControl._selectedbubble.r.baseVal.value
														+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value))
										.attr(
												"cx",
												_chartControl._selectedbubble.cx.baseVal.value)
										.attr("r", _chartControl._handleRsize)
										.style("fill", "rgba(151,156,163,0.8)")
										.style("stroke", "rgba(151,156,163,1)")
										.style("stroke-width", "1").call(
												d3.behavior.drag().on(
														"dragstart",
														resize_start).on(
														"drag", resize).on(
														"dragend", resize_end))
										.on("touchstart", resize_start).on(
												"touchmove", resize).on(
												"touchend", resize_end);
							}

							_chartControl._selectedbubble.parentNode.parentNode
									.appendChild(_chartControl._selectedbubble.parentNode);

							d3.select(_chartControl._selectedbubble).style(
									"fill", "rgba(0,143,211,0.8)").style(
									"stroke", "rgba(153,209,1,1)").style(
									"stroke-width", "1").style(
									"stroke-dasharray", ("1,1"));

							if (_chartControl._readOnly == false) {
								d3.select(_chartControl._selectedbubble).call(
										d3.behavior.drag().on("dragstart",
												move_start).on("drag", move)
												.on("dragend", move_end)).on(
										"touchstart", move_start).on(
										"touchmove", move).on("touchend",
										move_end);
							} else {
								_chartControl._skip = true;
							}

							var _chartNew = _chartControl;
							var f2 = function() {
								// _chartControl = _chartNew;
								_chartNew
										.fireClick({
											item : {
												key : _chartNew._selectedbubble.__data__.key,
												description : _chartNew._selectedbubble.__data__.description,
												x : cal_inv_x(_chartNew._selectedbubble.cx.baseVal.value),
												y : cal_inv_y(_chartNew._selectedbubble.cy.baseVal.value),
												z : cal_inv_r(_chartNew._selectedbubble.r.baseVal.value),
												selected : _chartNew._selectedbubble,
												handle : _chartNew._handle,
												overlappedbubbles : _chartNew._overLappingBubbles
											}
										});
							};

							if (!(_chartControl._skip)) {

								if (!(document.getElementById("Infopopup"))) {

									function closei() {
										_chartControl.oPopover.close();
									}

									_chartControl.oPopover = new sap.m.ActionSheet(
											{
												placement : sap.m.PlacementType.Auto,
												showHeader : false,
												offsetX : 25,
												offsetY : 10,
												id : "Infopopup",
												enableScrolling : false,
												afterOpen : function() {
													window.setTimeout(closei,
															5000);

												},

												buttons : [ new sap.m.Button({
													icon : "sap-icon://hint",
													press : f2
												})

												],
											});
								}
								_chartControl.oPopover
										.openBy(document
												.getElementById(_chartControl._selectedbubble.__data__.key));
								_chartControl.oPopover._parent

								.addStyleClass("cusCrmSalesPipelineSimAS");

							} else {
								_chartControl._skip = false;
								_chartControl
										.fireClick({
											item : {
												key : _chartControl._selectedbubble.__data__.key,
												description : _chartControl._selectedbubble.__data__.description,
												x : cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
												y : cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
												z : cal_inv_r(_chartControl._selectedbubble.r.baseVal.value),
												selected : _chartControl._selectedbubble,
												handle : _chartControl._handle,
												overlappedbubbles : _chartControl._overLappingBubbles
											}
										});
							}

						}

						function overlapping_bubbles() {

							var xCo_sel = _chartControl._selectedbubble.cx.baseVal.value;
							var yCo_sel = _chartControl._selectedbubble.cy.baseVal.value;
							var r = _chartControl._selectedbubble.r.baseVal.value;
							var xCo;
							var yCo;
							var overlappingBubbles = [];

							for ( var i = 0; i < _chartControl._data.length; i++) {
								xCo = cal_x(_chartControl._data[i].x);
								yCo = cal_y(_chartControl._data[i].y);
								if (Math.pow((xCo - xCo_sel), 2)
										+ Math.pow((yCo - yCo_sel), 2) <= Math
										.pow(r, 2)) {
									overlappingBubbles
											.push(document
													.getElementById(_chartControl._data[i].key));
								}
								xCo = null;
								yCo = null;
							}
							return overlappingBubbles;
						}

						function click_circle() {

							var coord = d3.mouse(_chartControl._selectedbubble);
							var origin = {
								x : _chartControl._selectedbubble.cx.baseVal.value,
								y : _chartControl._selectedbubble.cy.baseVal.value
							};
							var i_point = {
								x : coord[0],
								y : coord[1]
							};
							var des = findHandleCoordinate(
									origin,
									i_point,
									_chartControl._selectedbubble.r.baseVal.value
											+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value));
							_chartControl._handle[0][0].cy.baseVal.value = des.y;
							_chartControl._handle[0][0].cx.baseVal.value = des.x;

							function findHandleCoordinate(origin, ipoint, r) {
								var res = {};

								var interVal = (ipoint.y - origin.y)
										/ (ipoint.x - origin.x);

								var angle = Math.atan(interVal);

								var factor = 1;

								if ((ipoint.x - origin.x) < 0) {
									factor = -1;
								}

								res.x = origin.x + r * Math.cos(angle) * factor;
								res.y = origin.y + r * Math.sin(angle) * factor;

								return res;

							}

						}

						function resize_start() {

							var arc = d3.svg
									.arc()
									.innerRadius(0)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.startAngle(0).endAngle(360);

							var transform = "translate("
									+ _chartControl._selectedbubble.cx.baseVal.value
									+ ","
									+ _chartControl._selectedbubble.cy.baseVal.value
									+ ")";

							_chartControl._originalbubble = _chartControl._vis
									.append("path").attr("d", arc).attr(
											"transform", transform).style(
											"stroke", "green").style("fill",
											"rgba(0,143,211,0.15)").style(
											"stroke-width", "1").style(
											"stroke-dasharray", ("3, 3")).attr(
											"pointer-events", "none");

						}

						function resize_end() {

							d3.select(_chartControl._originalbubble[0][0])
									.remove();
							display_tooltip(false);
							_chartControl
									.fireChange({
										item : {
											key : _chartControl._selectedbubble.__data__.key,
											description : _chartControl._selectedbubble.__data__.description,
											/*
											 * x :
											 * cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
											 * y :
											 * cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
											 */
											z : cal_inv_r(_chartControl._selectedbubble.r.baseVal.value)
										}
									});
						}

						function resize() {

							var coord = [];
							var coord_touch = [];
							if (d3.event.type == "drag") {
								coord = d3.mouse(this);
							}

							if (d3.event.type == "touchmove") {
								coord_touch = d3.touches(this);
								coord[0] = coord_touch[0][0];
								coord[1] = coord_touch[0][1];
							}

							var dx = _chartControl._selectedbubble.cx.baseVal.value
									- coord[0];
							var dy = _chartControl._selectedbubble.cy.baseVal.value
									- coord[1];
							var d = (dx * dx) + (dy * dy);
							var r = Math.sqrt(d);
							var innerR = r
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value);
							if (innerR < _chartControl._bubbleMinRsize
									|| innerR > _chartControl._bubbleMaxRsize)
								return;
							_chartControl._handle[0][0].cy.baseVal.value = coord[1];
							_chartControl._handle[0][0].cx.baseVal.value = coord[0];

							_chartControl._selectedbubble.r.baseVal.value = r
									- cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value);
							arc
									.innerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value
													+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value));
							_chartControl._outerbubble.attr("d", arc);
							if (oBrowser.name !== oBrowser.BROWSER.INTERNET_EXPLORER) {
								d3
										.select(
												_chartControl._selectedbubble.nextElementSibling)
										.attr(
												"x",
												(_chartControl._selectedbubble.cx.baseVal.value - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))))
										.attr(
												"y",
												(_chartControl._selectedbubble.cy.baseVal.value - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))))
										.attr(
												'width',
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)))
										.attr(
												'height',
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)));

								/* add this code in function resize() */

								$(
										_chartControl._selectedbubble.nextElementSibling.childNodes)
										.css(
												"height",
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)))

										.css(
												"width",
												(_chartControl._selectedbubble.r.baseVal.value * Math
														.sqrt(2)));
							}
							display_tooltip(true);
							move_tooltip();

						}

						function move_start() {
							var arc = d3.svg
									.arc()
									.innerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.outerRadius(
											_chartControl._selectedbubble.r.baseVal.value)
									.startAngle(0).endAngle(360);

							var transform = "translate("
									+ _chartControl._selectedbubble.cx.baseVal.value
									+ ","
									+ _chartControl._selectedbubble.cy.baseVal.value
									+ ")";

							_chartControl._originalbubble = _chartControl._vis
									.append("path").attr("d", arc).attr(
											"transform", transform).style(
											"stroke", "green").style("fill",
											"rgba(255,255,255,0.1)").style(
											"stroke-width", "1").style(
											"stroke-dasharray", ("3, 3")).attr(
											"pointer-events", "none");

							_chartControl._ghostline = _chartControl._vis
									.append("line")
									.attr(
											"x1",
											_chartControl._selectedbubble.cx.baseVal.value)
									.attr(
											"y1",
											_chartControl._selectedbubble.cy.baseVal.value)
									.attr(
											"x2",
											_chartControl._selectedbubble.cx.baseVal.value)
									.attr(
											"y2",
											_chartControl._selectedbubble.cy.baseVal.value)
									.style("stroke", "green").style(
											"stroke-width", "1").style(
											"stroke-dasharray", ("3, 3")).attr(
											"pointer-events", "none");
							display_tooltip(true);
							move_tooltip();

						}

						function move_end() {
							d3.select(_chartControl._originalbubble[0][0])
									.remove();
							d3.select(_chartControl._ghostline[0][0]).remove();
							_chartControl
									.fireChange({
										item : {
											key : _chartControl._selectedbubble.__data__.key,
											description : _chartControl._selectedbubble.__data__.description,
											x : cal_inv_x(_chartControl._selectedbubble.cx.baseVal.value),
											y : cal_inv_y(_chartControl._selectedbubble.cy.baseVal.value),
										// z :
										// cal_inv_r(_chartControl._selectedbubble.r.baseVal.value)
										}
									});
							display_tooltip(false);

						}

						function move() {

							var coord = [];
							var coord_touch = [];

							if (d3.event.type == "drag") {
								coord = d3.mouse(this);
							}
							if (d3.event.type == "touchmove") {
								coord_touch = d3.touches(this);
								coord[0] = coord_touch[0][0];
								coord[1] = coord_touch[0][1];
							}
							if (coord[0] < minCX || coord[0] > maxCX
									|| coord[1] < minCY || coord[1] > maxCY)
								return;
							if (oBrowser.name != oBrowser.BROWSER.INTERNET_EXPLORER) {

								d3
										.select(
												_chartControl._selectedbubble.nextElementSibling)
										.attr(
												"x",
												(coord[0] - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))))
										.attr(
												"y",
												(coord[1] - (_chartControl._selectedbubble.r.baseVal.value / Math
														.sqrt(2))));
							}

							this.cx.baseVal.value = coord[0];
							this.cy.baseVal.value = coord[1];
							_chartControl._outerbubble.attr("transform",
									"translate(" + this.cx.baseVal.value + ","
											+ this.cy.baseVal.value + ")");
							_chartControl._handle[0][0].cy.baseVal.value = this.cy.baseVal.value
									+ this.r.baseVal.value
									+ cal_outer_bubble_r(_chartControl._selectedbubble.r.baseVal.value);
							_chartControl._handle[0][0].cx.baseVal.value = this.cx.baseVal.value;
							d3.select(_chartControl._ghostline[0][0]).attr(
									"x2", coord[0]).attr("y2", coord[1]);
							move_tooltip();

						}

					},

					onAfterRendering : function() {

						var xAxis = {
							xStart : this.getXStart(),
							xEnd : this.getXEnd(),
							xLabelTexts : this.getXLabelTexts(),
							xLabelValues : this.getXLabelValues(),
							xSegStart : this.getXFStart(),
							xSegEnd : this.getXFEnd()

						};

						var yAxis = {
							yStart : parseInt(this.getYStart()),
							yEnd : parseInt(this.getYEnd()),
							yLabelTexts : this.getYLabelTexts(),
							yLabelValues : this.getYLabelValues(),
							ySegStart : parseInt(this.getYFStart()),
							ySegEnd : parseInt(this.getYFEnd())

						};
						this.redraw(xAxis, yAxis);
						var controllerInfo = sap.ca.scfld.md.app.Application
								.getImpl();
						if (controllerInfo.oCurController.FullCtrl.reRenderTopNSlider) {
							controllerInfo.oCurController.FullCtrl
									.showTopNOpp();
							this._unregisterListener();
							this._redraw();
							this._registerListener();
							controllerInfo.oCurController.FullCtrl.reRenderTopNSlider = false;
						}
					},

					setSelection : function(key) {
						this._skip = true;
						document.getElementById(key).__onclick(this._skip);

					}
				});

jQuery.sap.require("sap.ui.core.EnabledPropagator");
sap.ui.core.EnabledPropagator.apply(sap.crm.BubbleChart.prototype, [ true ]);

sap.crm.BubbleChart.M_EVENTS = {
	'change' : 'change',
	'liveChange' : 'liveChange'
};

sap.crm.BubbleChart.prototype.init = function() {
	this._initVariable();

	// device.resize.attachHandler(this.onresize, this);
};

sap.crm.BubbleChart.prototype._unregisterListener = function() {
	if (this._sResizeListenerId) {
		sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
		delete this._sResizeListenerId;
	}
};
sap.crm.BubbleChart.prototype._registerListener = function() {
	this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this
			.getDomRef(), jQuery.proxy(this.onresize, this));
};

sap.crm.BubbleChart.prototype.onresize = function(o) {
	this._unregisterListener();
	this._redraw();
	this._registerListener();
};