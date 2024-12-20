
// import React, { useState } from 'react';
// import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
// import { scaleQuantile } from 'd3-scale';
// // import ReactTooltip from 'react-tooltip';
// import { Tooltip } from 'react-tooltip'

// import LinearGradient from './LinearGradient';
// // import './App.css';

// /**
// * Courtesy: https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json
// * Looking topojson for other countries/world? 
// * Visit: https://github.com/markmarkoh/datamaps
// */
// const INDIA_TOPO_JSON = require('./india.topo.json');

// const PROJECTION_CONFIG = {
//   scale: 350,
//   center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
// };

// // Red Variants
// const COLOR_RANGE = [
//   '#ffedea',
//   '#ffcec5',
//   '#ffad9f',
//   '#ff8a75',
//   '#ff5533',
//   '#e2492d',
//   '#be3d26',
//   '#9a311f',
//   '#782618'
// ];

// const DEFAULT_COLOR = '#EEE';

// const geographyStyle = {
//   default: {
//     outline: 'none'
//   },
//   hover: {
//     fill: '#ccc',
//     transition: 'all 250ms',
//     outline: 'none'
//   },
//   pressed: {
//     outline: 'none'
//   }
// };

// // Sample heatmap data
// const getHeatMapData = () => [
//     { "state_id": "29", "ModalPrice": 2918.625, "state_name": "Karnataka" },
//     { "state_id": "19", "ModalPrice": 2600, "state_name": "West Bengal" },
//     { "state_id": "24", "ModalPrice": 2455.72, "state_name": "Gujarat" },
//     { "state_id": "27", "ModalPrice": 2441.76, "state_name": "Maharashtra" },
//     { "state_id": "7", "ModalPrice": 2291, "state_name": "NCT of Delhi" },
//     { "state_id": "9", "ModalPrice": 2197.65, "state_name": "Uttar Pradesh" },
//     { "state_id": "8", "ModalPrice": 2177.34, "state_name": "Rajasthan" },
//     { "state_id": "23", "ModalPrice": 2102.27, "state_name": "Madhya Pradesh" },
//     { "state_id": "10", "ModalPrice": 2100, "state_name": "Bihar" },
//     { "state_id": "22", "ModalPrice": 2096, "state_name": "Chhattisgarh" }
//   ];
// function Maps() {
//   const [tooltipContent, setTooltipContent] = useState('');
//   const [data, setData] = useState(getHeatMapData());

//   const gradientData = {
//     fromColor: COLOR_RANGE[0],
//     toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
//     min: 0,
//     max: data.reduce((max, item) => (item.ModalPrice > max ? item.ModalPrice : max), 0)
//   };

//   const colorScale = scaleQuantile()
//     .domain(data.map(d => d.ModalPrice))
//     .range(COLOR_RANGE);

//   const onMouseEnter = (geo, current = { ModalPrice: 'NA' }) => {
//     return () => {
//       setTooltipContent(`${geo.properties.name}: ${current.ModalPrice}`);
//     };
//   };

//   const onMouseLeave = () => {
//     setTooltipContent('');
//   };

//   const onChangeButtonClick = () => {
//     setData(getHeatMapData());
//   };

//   return (
//     <div className="full-width-height container">
//       <h1 className="no-margin center">States and UTs</h1>
//       <Tooltip>{tooltipContent}</Tooltip>
//       <ComposableMap
//         projectionConfig={PROJECTION_CONFIG}
//         projection="geoMercator"
//         width={600}
//         height={220}
//         data-tip=""
//       >
//         <Geographies geography={INDIA_TOPO_JSON}>
//           {({ geographies }) =>
//             geographies.map(geo => {
//               const current = data.find(s => s.state_id === geo.id);
//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill={current ? colorScale(current.ModalPrice) : DEFAULT_COLOR}
//                   style={geographyStyle}
//                   onMouseEnter={onMouseEnter(geo, current || { ModalPrice: 'NA' })}
//                   onMouseLeave={onMouseLeave}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//       <LinearGradient data={gradientData} />
//       <div className="center">
//         <button className="mt16" onClick={onChangeButtonClick}>Change</button>
//       </div>
//     </div>
//   );
// }

// export default Maps;

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { Tooltip } from 'react-tooltip'; // Make sure this is correctly imported

import LinearGradient from './LinearGradient';

const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937]
};

const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618'
];

const DEFAULT_COLOR = '#EEE';

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

const getHeatMapData = () => [
  { "state_id": "29", "ModalPrice": 2918.625, "state_name": "Karnataka" },
  { "state_id": "19", "ModalPrice": 2600, "state_name": "West Bengal" },
  { "state_id": "24", "ModalPrice": 2455.72, "state_name": "Gujarat" },
  { "state_id": "27", "ModalPrice": 2441.76, "state_name": "Maharashtra" },
  { "state_id": "7", "ModalPrice": 2291, "state_name": "NCT of Delhi" },
  { "state_id": "9", "ModalPrice": 2197.65, "state_name": "Uttar Pradesh" },
  { "state_id": "8", "ModalPrice": 2177.34, "state_name": "Rajasthan" },
  { "state_id": "23", "ModalPrice": 2102.27, "state_name": "Madhya Pradesh" },
  { "state_id": "10", "ModalPrice": 2100, "state_name": "Bihar" },
  { "state_id": "22", "ModalPrice": 2096, "state_name": "Chhattisgarh" }
];

function Maps({setTooltipContent}) {
  // const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState(getHeatMapData());

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.ModalPrice > max ? item.ModalPrice : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.ModalPrice))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { ModalPrice: 'NA' }) => {
    return () => {
      console.log(geo.properties.name,current.ModalPrice)
      setTooltipContent(`${geo.properties.name}: ${current.ModalPrice}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    setData(getHeatMapData());
  };

  return (
    <div className="full-width-height container">
      <h1 className="no-margin center">States and UTs</h1>
      {/* <ReactTooltip>{tooltipContent}</ReactTooltip> Updated Tooltip usage */}
      {/* <Tooltip anchorSelect='.mymap' place = 'top'>{tooltipContent}</Tooltip> */}

      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={600}
        height={220}
        data-tip=""
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map(geo => {
              const current = data.find(s => s.state_id === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current.ModalPrice) : DEFAULT_COLOR}
                  style={geographyStyle}
                  // onMouseEnter={onMouseEnter(geo, current || { ModalPrice: 'NA' })}
                  // onMouseLeave={onMouseLeave}
                  onMouseEnter={() => {
                    setTooltipContent(`${geo.properties.name}:${current.ModalPrice}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {/* <Tooltip>{tooltipContent}</Tooltip> Updated Tooltip usage */}
      <LinearGradient data={gradientData} />
      <div className="center">
        <button className="mt16" onClick={onChangeButtonClick}>Change</button>
      </div>
    </div>
  );
}

export default Maps;
