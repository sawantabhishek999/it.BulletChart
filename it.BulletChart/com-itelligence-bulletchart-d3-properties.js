/**
 * @creator Erik Wetterberg (ewg)
 * @modifier @owner Torben Seebach itelligence
 * @contributer Patrik Lundblad
 */

define( [], function () {

	return {
		type: "items",
		component: "accordion",
		items: {
			
			measures: {
				uses: "measures",
				min: 1,
				max: 5,
				items: {
					myColor: {
//                             ref: "color.singleColor",
                             ref: "qDef.color",
                             translation: "properties.color",
                             type: "string",
                             component: "color-picker",
                             defaultValue: 3
					},
					customProp: {
						ref: "qDef.viz",
						label: "Show as",
						component: "dropdown",
						options: [ {
								        value: "m",
								        label: "measure line"
								    }, {
								        value: "t",
								        label: "target line"
								    } ,
 									{
								        value: "b",
								        label: "background"
								    } ],
//						options: {"measure line","target line","background"},
						type: "string",
						defaultValue: "m"
					}
				}
			},
			settings: {
				uses: "settings",
				items: {
					fonts: {
						type: "items",
						label: "Fonts",
						items: {
							minFontSize: {
								ref: "fontSize.min",
								translation: "Min Font Size",
								type: "number",
								defaultValue: 8
							},
							maxFontSize: {
								ref: "fontSize.max",
								translation: "Max Font Size",
								type: "number",
								defaultValue: 24
							}
						}
					},
				customProp: {
						ref: "qDef.Label",
						label: "Label",
						//component: "bo",
						type: "string",
						defaultValue: ""
					},
				customProp2: {
						ref: "qDef.SubLabel",
						label: "Sub Label",
						//component: "bo",
						type: "string",
						defaultValue: ""
					}					
				}
			}
		}
	};

} );
