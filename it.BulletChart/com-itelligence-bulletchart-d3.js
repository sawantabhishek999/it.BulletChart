/*globals define, console*/
/*
	ToDo:
		labels in dimension centered, if there is no sublabel
		Show multiple diemensions
		Animate after selections 
		add a max value
*/
requirejs.config({
	shim : {
		"extensions/com-itelligence-bulletchart-d3/itelligence-bulletchart-d3-bullet-lib" : {
			"deps" : ["extensions/com-itelligence-bulletchart-d3/d3"]
		}
	}
});// 
define(["jquery","text!./styles.css","./com-itelligence-bulletchart-d3-properties", "./itelligence-bulletchart-d3-bullet-lib"], function($, cssProperties,properties) {
	'use strict';$("<style>").html(cssProperties).appendTo("head");
	var runCount = 0;

	return {
		type : "BulletChart",
		//Refer to the properties file
		definition : properties,

		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 6,
					qHeight : 6
				}]
			},
			fontSize : {
				min : 8,
				max : 24
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) { 
			runCount = runCount+1;
			log('paint '+runCount);
			log(layout);
			
			// color palette from Patrik Lundblad
			var palette = [
                         '#b0afae',
                         '#7b7a78',
                         '#545352',
                         '#4477aa',
                         '#7db8da',
                         '#b6d7ea',
                         '#46c646',
                         '#f93f17',
                         '#ffcf02',
                         '#276e27',
                         '#ffffff',
                         '#000000'
			            ];
 

//			d3.select($element[0]).append("p").text("loading");
			//check that we have data to render
			if(layout.qHyperCube.qDataPages[0].qMatrix.length>=1 ) { 
			var dimensions = layout.qHyperCube.qDataPages[0].qMatrix.length;	
			// || layout.qHyperCube.qDataPages[0].qMatrix.length) {	
			$element.html("");
			
			var maxFont = layout.fontSize.max;
			var minFont = layout.fontSize.min;

			// get id object id, to use in css classes
			var qId = layout.qInfo.qId;

			var count = 0;
			var salt = Math.round( Math.random() *10000);
			var datastring = []; //'[\n';
			var qData = layout.qHyperCube.qDataPages[0];
			var qMeasures = layout.qHyperCube.qMeasureInfo;
			// log(qMeasures);
			// do we have dimensions?
			var dimFlag = layout.qHyperCube.qDimensionInfo.length;
			 
			var vizArray = [];
			var colorArray = [];
			var scale  =-1;

			$.each(qMeasures, function(key, row) {
				//get type of viz
				vizArray.push(qMeasures[key].viz);
				// get color for viz
				colorArray.push(qMeasures[key].color);
			});

			$.each(qData.qMatrix, function(key, row) { 
				var valueArray = [];

				var label = '';
				var sublabel = '';				
				var maxValue = 0;
				// log loop into rows
				$.each(row, function(index, cell) {
				// log(index);
					label = disclosureLabelText(  layout.qDef['Label'] ,$element.width(),layout.qDef['Label'].length,disclosureFontSize(elementHeight,minFont,maxFont));
					sublabel = disclosureLabelText(  layout.qDef['SubLabel'] ,$element.width(),layout.qDef['SubLabel'].length ,disclosureFontSize(elementHeight,minFont,maxFont));
					maxValue = layout.qDef['MaxValue'] ;

					log(maxValue);

					if( label.length>3 || sublabel.length>3) {
						dimFlag = 1;
					} else {
						dimFlag = 0;
					}

						
					if(!isNaN(cell.qNum)) {

						valueArray.push(cell.qNum);
					}						
				//	});	
				});
				

				scale = Math.max(scale,valueArray[0],valueArray[1],valueArray[2])

				if (typeof valueArray[2] === 'undefined') {
				// get the highest value to create background chart area 
				valueArray[2] = ((valueArray[0]>valueArray[1]) ? valueArray[0] : valueArray[1]);
				}
				// check if we need to add a , to seperate data arrays
				// create data array
				var dataPairs = { "title":label,"subtitle":sublabel,"ranges":[0],"measures":[0],"markers":[maxValue] }; //,"measures":{valueArray[0]},"markers":{valueArray[1]} };

//				var dataPairs = { "title":label,"ranges":[0],"measures":[0],"markers":[0] }; //,"measures":{valueArray[0]},"markers":{valueArray[1]} };
				
				// insert values into array
				var valueLength = valueArray.length;
				for (var i = 0; i < valueLength; i++) {
				    if(vizArray[i]==='m') {
						dataPairs["measures"].push(valueArray[i])
				    }
				    if(vizArray[i]==='t') {
						dataPairs["markers"].push(valueArray[i])
					}
				    if(vizArray[i]==='b') {
						dataPairs["ranges"].push(valueArray[i])
				    }
				}
				//log(dataPairs);
				datastring.push(dataPairs);
					
				count = count+1;	
				
			});

}
		// required markers (,"markers":[2100]),ranges (,"ranges":[1400,2500])
		// optional subtitle ("subtitle":"US$, in thousands")
/*		var data2=[
				  {"title":"Revenue","subtitle":"US$, in thousands","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
				  {"title":"Profit","subtitle":"%","ranges":[20,25,30],"measures":[21,23],"markers":[26]},
				  {"title":"Order Size","subtitle":"US$, average","ranges":[350,500,600],"measures":[100,320],"markers":[550]},
		//		  {"title":"New Customers","subtitle":"count","ranges":[1400,2000,2500],"measures":[1000,1650],"markers":[2100]},
				  {"title":"New Customers","measures":[1000],"ranges":[2500],"markers":[2100]},
		//		  {"title":"Satisfaction","subtitle":"out of 5","ranges":[3.5,4.25,5],"measures":[3.2,4.7],"markers":[4.4]}
				]
			; */

		var data = datastring;
//	    log(data);


	    var divHeight = $element.height();
	    var divWidth = $element.width();
	    var divMarginLabel = disclosureLabelWidth(divWidth,dimFlag);
	    var divMarginRight = disclosureRightMargin(divWidth);
	    var divMarginText = ''; 
	    var elementHeight = (divHeight)*0.95;
	    var elementRelativeMargin = 25;
	    var elementRelativeHeight = 25;
	    var marginTop = (elementHeight*0.1) ;
	    var marginBottom = disclosureLegendHeight(elementHeight*0.3);
	    // log('h:'+divHeight+' w:'+divWidth +' eh:'+elementHeight);

		var margin = {top: 5, right: 40, bottom: 20, left: 120},
		    width = $element.width() - divMarginLabel - divMarginRight,
		    // todo: divide by total number of elements in dimensions
		    height = elementHeight - marginTop - marginBottom;
		//log('mt:'+marginTop +' mb:'+ marginBottom+' h:'+height);

		var chart = d3.bullet()
		    .width(width)
		    .height(height)
		    .qId(qId)
		    .tickCount( disclosureTick(width,1) );

		var w = $element.width(), h = $element.height();

		var svg = d3.select($element[0]).selectAll("svg")
		      .data(data)
		    .enter().append("svg")
		      .attr("class", "bullet")
		      .attr("width", width + divMarginLabel + divMarginRight)
		      .attr("height", height + marginTop + marginBottom)
//		      .attr("width", width + divMarginLabel + divMarginRight)
//		      .attr("height", height + marginTop + marginBottom)			
		    .append("g")
		      .attr("transform", "translate(" + divMarginLabel + "," + marginTop + ")")
		     // .transition()
		      .call(chart);


		var title = svg.append("g")
		      .style("text-anchor", "end")
		      .attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text")
		      .attr("class", "title")
		      //.fontSize('8px')
		      //.style("font-size", function(d) {	return d.size + "px";
		      .style("font-size",  disclosureFontSize(elementHeight,minFont,maxFont)+"px" )
		      .text(function(d) { return d.title; });

		title.append("text")
		      .attr("class", "subtitle")
		      .attr("dy", "1em")
		      .style("font-size",  disclosureFontSize(elementHeight-2,minFont,maxFont)+"px" )
		      .text(function(d) { return d.subtitle; });

		
		// set colors
//		$("rect.range.s0").css("fill","red");
//		$("rect.measure.s0").css("fill","red");
//		$(".marker").css("stroke","red");
		var range = 0;
		var marker = 0;
		var measure = 0;
		var colorShow = '';

		var vizLength = vizArray.length;
		for (var i = 0; i < vizLength; i++) {
		    var colorShow = palette[colorArray[i]];
			
		    if(vizArray[i]==='m') {
				$("rect.measure.s"+measure+'-'+qId).css("fill",colorShow);
				measure++;
			//    log(i + ' m '+ vizArray[i] + ' - '+colorShow);
		    }
		    if(vizArray[i]==='t') {
				$("line.marker.s"+marker+'-'+qId).css("stroke",colorShow);
				marker++;
			   //log(i + ' t '+ vizArray[i] + ' - '+colorShow);
		    }
		    if(vizArray[i]==='b') {
				$("rect.range.s"+range+'-'+qId).css("fill",colorShow);
				range++;
			//    log(i + ' b '+ vizArray[i] + ' - '+colorShow);
		    }
		}
		// hide dummy row
		$("line.marker.s"+marker+'-'+qId).css("display","none");

	// disclosure functions 	
		// adjust title 
		function disclosureFontSize (elementHeight,minFont,maxFont) {
			var size = maxFont;
			if (elementHeight>80) {
				size = maxFont;
			} 
			if (elementHeight>=20 & elementHeight<=80) {

				size = Math.round( (elementHeight/80)*maxFont);

			} 
			if (elementHeight<20) {
					size = minFont;
			}
			//log(size+' '+elementHeight);
			size = size<minFont ? minFont : size;

			return size;
		} 
	

		function disclosureLabelText(dimLabel,divWidth,dimFlag,fontSize) {
			var label = '';
			var letterLength = Math.round(fontSize/2);
/*			if( noDimension()===true){
				return label;
			} */
//				log(letterLength);
			if(divWidth<=100 ) {
				label = '';''
			} else 

			if (dimLabel.length*letterLength >= disclosureLabelWidth(divWidth,dimFlag) ) {
				if(dimLabel.length <1 ) 
				{			
				 label = '';
				 } else {
				// determine how many letters to cut, add 3 to total because of dots..
							var letters = 3+Math.floor(((dimLabel.length*letterLength)-disclosureLabelWidth(divWidth))/letterLength);
			//					log('letters '+letters);
							label =  dimLabel.slice( 0,dimLabel.length-letters )+'...';
			}			} else {
				label = dimLabel;
			} 
		
			return label;
		}

		function disclosureTick(divWidth,dimFlag) {
			var ticks = 3;
			if( dimFlag===0 ) {
				return ticks;
			}
			if( divWidth<=500) {
				ticks = Math.ceil(divWidth/120);
			} else if (divWidth>=500){	
				ticks = 8;
			}
//			log('ticks:'+ticks);
			return ticks;
		}

		function disclosureLabelWidth(divWidth,dimFlag) {
			var width = 0;
			if( dimFlag===0 ) {
				return width;
			}
/*			if( noDimension()===true){
				return width;
			} */
			//log(divWidth);
			// show label if there is space enough
			if(divWidth>=200 && divWidth<=400) {
				width = divWidth*0.3;
			} else if (divWidth>=400){	
				width = 140;
			}
			//log('w:'+width);
			return width;
		}

		function disclosureRightMargin(divWidth) {
			var width = 0;
			// show label if there is space enough
			if (divWidth>=400){	
				width = 20;
			}
			//log('w:'+width);
			return width;
		}
		function disclosureLegendHeight(divHeight) {
			var height = 5;
//			log(divHeight);
			// show lengend if there is space enough
			if(divHeight>=20) {
				height = divHeight;
			}
			return height;
		}

		function randomize(d) {
			  if (!d.randomizer) d.randomizer = randomizer(d);
			  d.markers = d.markers.map(d.randomizer);
			  d.measures = d.measures.map(d.randomizer);
			  return d;
			};

		function randomizer(d) {
				  var k = d3.max(d.ranges) * .2;
				  return function(d) {
				    return Math.max(0, d + k * (Math.random() - .5));
				  };
			};	 
		 // i use this logging function so its easy to turn logging on or off
		 function log(obj) {
				  console.log(obj);
//				  dump(obj);
			};
//
function dump(object) {
        if (window.JSON && window.JSON.stringify)
            console.log(JSON.stringify(object));
        else
            console.log(object);
    };
//
		},
		clearSelectedValues : function($element) {
			//jQuery can not change class of SVG element, need d3 for that
			d3.select($element[0]).selectAll(".selected").classed("selected", false);
		},
/*		noDimension : function ($element,layout) {
				if(layout.qHyperCube.qDimensionInfo[0].length>=1) {
					return true;
				}
				return false;
		};
*/
	};
});
