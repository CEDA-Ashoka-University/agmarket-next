
// // app/pages/PriceChartPage.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(localizedFormat);

Chart.register(...registerables);

const PriceChartPage = () => {
  const [commodityId, setCommodityId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [stateId, setStateId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [granularity, setGranularity] = useState<string>('daily');
  const [chartData, setChartData] = useState<any>(null);
  const [states, setStates] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all states and commodities
    const fetchStatesAndCommodities = async () => {
      try {
        const response = await axios.get('/api/all');
        setStates(response.data.states);
        setCommodities(response.data.commodities);
      } catch (error) {
        console.error('Error fetching states and commodities:', error);
      }
    };

    fetchStatesAndCommodities();
  }, []);

  useEffect(() => {
    // Fetch districts when stateId changes
    const fetchDistricts = async () => {
      if (stateId) {
        try {
          const response = await axios.get(`/api/filterOptions?stateId=${stateId}`);
          setDistricts(response.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };

    fetchDistricts();
  }, [stateId]);

  const handleFetchData = async () => {
    try {
      const response = await axios.get('/api/price', {
        params: {
          commodity_id: commodityId,
          district_id: districtId,
          state_id: stateId,
          start: startDate,
          end: endDate,
        },
      });
      const data = response.data.data;

      const processedData = processDataByGranularity(data, granularity);

      setChartData({
        labels: processedData.labels,
        datasets: [
          {
            label: 'Modal Price',
            data: processedData.modalPrices,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processDataByGranularity = (data: any[], granularity: string) => {
    let labels: string[] = [];
    let modalPrices: number[] = [];
    const groupedData: { [key: string]: { sum: number; count: number } } = {};

    data.forEach((item) => {
      const dateKey = getDateKey(item.date, granularity);
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { sum: 0, count: 0 };
      }
      if (item.modal_price !== null) {
        groupedData[dateKey].sum += item.modal_price;
        groupedData[dateKey].count += 1;
      }
    });

    for (const key in groupedData) {
      labels.push(key);
      modalPrices.push(groupedData[key].sum / groupedData[key].count);
    }

    return { labels, modalPrices };
  };

  const getDateKey = (date: string, granularity: string) => {
    const parsedDate = dayjs(date);
    switch (granularity) {
      case 'monthly':
        return parsedDate.format('YYYY-MM');
      case 'daily':
      default:
        return parsedDate.format('YYYY-MM-DD');
    }
  };

  return (
    <div>
      <h1>Price Chart</h1>
      <div>
        <label>
          State:
          <select value={stateId} onChange={(e) => setStateId(e.target.value)}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Commodity:
          <select value={commodityId} onChange={(e) => setCommodityId(e.target.value)}>
            <option value="">Select Commodity</option>
            {commodities.map((commodity) => (
              <option key={commodity.commodity_id} value={commodity.commodity_id}>
                {commodity.commodity_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          District:
          <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Granularity:
          <select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>

      {chartData && (
        <div>
          <h2>Modal Price Over Time</h2>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default PriceChartPage;

// "use client"
// // app/pages/PriceChartPage.tsx

// import { useState } from 'react';
// import FilterOptions from '../components/FilterOptions/FilterOptions';
// import LineGraph from '../components/LineGraph/LineGraph';

// const PriceChartPage = () => {
//   const [filters, setFilters] = useState({
//     commodityId: '',
//     districtId: '',
//     stateId: '',
//     startDate: '',
//     endDate: '',
//     granularity: 'daily',
//   });

//   return (
//     <div>
//       <h1>Price Chart</h1>
//       <FilterOptions onFiltersChange={(newFilters) => setFilters(newFilters)} />
//       <LineGraph filters={filters} />
//     </div>
//   );
// };

// export default PriceChartPage;
