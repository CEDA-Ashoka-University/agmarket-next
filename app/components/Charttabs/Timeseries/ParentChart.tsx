import React, { useState, useEffect } from "react";
import PriceLineChart from "./PriceLineChart";
import QuantityLineChart from "./QuantityLineChart";
import { ChartButton } from "../ChartButton";
import domtoimage from "dom-to-image";
import ShareSocialModal from '../../ShareSocialModal/ShareSocialModal'
// import Filter from "../../filter/filter";  // Assuming this is the filter component you provided
import Filter from "../../filter/filter_compare";
import { getDefaultDateRange } from "../../../utils/DateUtils";
import { useFetchFilterOptions } from "../../../hooks/UseFilterOptions";
import ShareIcon from "../../../assets/icons/ShareIcon"
import DownloadIcon from "../../../assets/icons/DownloadIcon"
import Buttons from "../../../ui/Button/Button"
import DownloadDataModal from '../../DowloadDataModal/DownloadDataModal'

interface PriceDataItem {
  date: string;
  avg_modal_price: number;
  avg_min_price: number;
  avg_max_price: number;
  moving_average?: number;
  commodity_name: string;
  month?: string;
  year?: string;
  state_name?: string;
  district_name?:string;
  calculationType?:string;
}

interface QtyDataItem {
  date: string;
  total_quantity: number;
  commodity_name: string;
  month?: string;
  year?: string;
  state_name?: string;
  district_name?:string;
  calculationType?:string;
}

interface ParentProps {
  PriceData: PriceDataItem[];
  QtyData: QtyDataItem[];
  startsDate: string;
  endsDate:string;
}

const ChartParent: React.FC<ParentProps> = ({ PriceData, QtyData, startsDate,endsDate }) => {
  const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");
  const [filteredPriceData, setFilteredPriceData] = useState<PriceDataItem[]>(PriceData);
  const [filteredQtyData, setFilteredQtyData] = useState<QtyDataItem[]>(QtyData);
  const [stateFilter, setStateFilter] = useState<string>("");
  const [commodityFilter, setCommodityFilter] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(getDefaultDateRange().startDate);
  const [endDate, setEndDate] = useState<string>(getDefaultDateRange().endDate);
  const [calculationType, setCalculationTypeFilter] = useState<string>("");
  const [openModalName, setOpenModalName] = useState("");
  

  const { availableStates, availableCommodities } = useFetchFilterOptions();


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterValues, setFilterValues] = useState({
    startDate: "2024-01-01",
    endDate: new Date().toISOString().split("T")[0],
    commodityName: "",
    stateName: "",
    districtName: ""
  });

  useEffect(() => {
    if (startsDate) setStartDate(startsDate);
    if (endsDate) setEndDate(endsDate);
    setFilterValues((prev) => ({
      ...prev,
      startDate: startsDate || prev.startDate,
      endDate: endsDate || prev.endDate,
    }));
  }, [startsDate, endsDate]);



  const handleTabChange = (tab: "Price" | "Quantity") => {
    setSelectedTab(tab);
  };


  const removeCommodity = (commodityName: string, state: string, district: string, calculationType:string) => {
    const filterCondition = (item: any) =>
      
      !(item.commodity_name === commodityName && item.state_name === state && item.district_name === district && item.calculationType === calculationType );
  
    setFilteredPriceData((prevData) => prevData.filter(filterCondition));
    setFilteredQtyData((prevData) => prevData.filter(filterCondition));
  };
  
  
  const handleDataFetch = async (filters: any) => {
    const { startDate, endDate, commodityName, stateName, districtName } = filters;
    try {
      const response = await fetch(`/api/priceqtyapi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state_id: stateFilter,  // state_id
          commodity_id: commodityFilter,  // commodity_id
          district_id: districtFilter,  // district_id
          calculation_type: calculationType,
          start_date: startDate,
          end_date: endDate,
        }),
      });
  
      const newData = await response.json();

      setFilteredPriceData((prev) => [...prev, ...newData.priceData]);
      setFilteredQtyData((prev) => [...prev, ...newData.quantityData]);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log("filteredPriceData",filteredPriceData)

  // Modal open/close handler
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmitFilters = (filters: any) => {
    // console.log("get filters",filters)
    setFilterValues(filters);  // Update state with filter values
    handleDataFetch(filters);  // Fetch data with the new filters
    toggleModal(); // Close modal after submit
  };

  const handleDownloadChart = () => {
    const container = document.getElementById("chart-container");
    if (!container) return;

    const priceTab = document.getElementById("Price_button");
    const quantityTab = document.getElementById("Quantity_button");
    const priceTabDisplay = priceTab ? priceTab.style.display : "";
    const quantityTabDisplay = quantityTab ? quantityTab.style.display : "";

    if (selectedTab === "Price" && quantityTab) {
      quantityTab.style.display = "none";
    } else if (selectedTab === "Quantity" && priceTab) {
      priceTab.style.display = "none";
    }

    domtoimage
      .toJpeg(container, {
        quality: 1.0,
        style: { backgroundColor: "#ffffff" },
      })
      .then((dataUrl) => {
        if (priceTab) priceTab.style.display = priceTabDisplay;
        if (quantityTab) quantityTab.style.display = quantityTabDisplay;

        const link = document.createElement("a");
        link.download = `map_with_${selectedTab.toLowerCase()}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        if (priceTab) priceTab.style.display = priceTabDisplay;
        if (quantityTab) quantityTab.style.display = quantityTabDisplay;

        console.error("Error capturing the map:", error);
      });
  };

  return (
    <>
      <div id="chart-container" className="relative bg-white">
        <div className="flex gap-2 bg-white pl-4 mt-2">
          <button
          id="Price_button"
            onClick={() => handleTabChange("Price")}
            className={`px-2.5 py-1 text-sm border rounded ${
              selectedTab === "Price" ? "bg-[#1A375F] text-white" : "bg-white text-[#1A375F]"
            } border-[#1A375F]`}
          >
            Price
          </button>
          <button
          id="Quantity_button"
            onClick={() => handleTabChange("Quantity")}
            className={`px-2.5 py-1 text-sm border rounded ${
              selectedTab === "Quantity" ? "bg-[#1A375F] text-white" : "bg-white text-[#1A375F]"
            } border-[#1A375F]`}
          >
            Quantity
          </button>


          {/* Compare Data button placed here */}
          <button
          onClick={toggleModal}
          className="px-4 py-1 text-sm border rounded ml-auto bg-[#1A375F] text-white"
        >
          Compare Data
        </button>
        </div>
        <div className="mt-6">
          {selectedTab === "Price" ? (
            <PriceLineChart PriceData={filteredPriceData} onRemoveCommodity={removeCommodity} />
          ) : (
            <QuantityLineChart QtyData={filteredQtyData} onRemoveCommodity={removeCommodity}/>
          )}
        </div>
      </div>

      {/* Compare Data Button
      <div className="flex justify-end mt-4">
        <button onClick={toggleModal} className="px-4 py-2 bg-blue-500 text-white rounded">
          Compare Data
        </button>
      </div> */}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl mb-4">Select Filters for Data Comparison</h2>

          <Filter
                  stateFilter={stateFilter}
                  setStateFilter={setStateFilter}
                  commodityFilter={commodityFilter}
                  setCommodityFilter={setCommodityFilter}
                  districtFilter={districtFilter}
                  setDistrictFilter={setDistrictFilter}
                  startDate={startsDate}
                  setStartDate={setStartDate}
                  endDate={endsDate}
                  setEndDate={setEndDate}
                  calculationtype={calculationType}
                  setCalculationTypeFilter={setCalculationTypeFilter}
                  availableStates={availableStates}
                  availableCommodities={availableCommodities}
                />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleSubmitFilters(filterValues)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>
              <button
                onClick={toggleModal}
                className="px-4 py-2 ml-2 bg-gray-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-100 rounded-b-2xl pt-4 px-6 pb-4 border-t border-b border-r  border-[rgba(26,55,95,0.3)] w-full">
        <div className="flex gap-6">
          {/* <ChartButton
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/11765651394374b6b9612a55c2b357118ffccaf24c9930bc589282fa25505338?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            text="Download charts"
            onClick={handleDownloadChart}
          />  */}
          {/* <ChartButton
            icon= "https://cdn.builder.io/api/v1/image/assets/TEMP/fdc24a00e9f1688797bcaa3a71dabf14ed5176c1612528d9a886f3eb432a31a6?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            text="Share chart"
            onClick={() => setOpenModalName("SHARE_CHART")}
          /> */}

<Buttons
  className="flex items-center gap-2 bg-white border border-[#1A375F] rounded-lg px-3 py-2 cursor-pointer"
  handleClick={() => setOpenModalName("DOWNLOAD_CHART")}
>
  <DownloadIcon className="w-3.5 h-4.5" />
  <p className="font-inter font-normal text-sm leading-4 text-primary w-max">
  Download charts
  </p>
</Buttons>

          <Buttons
  className="flex items-center gap-2 bg-white border border-[#1A375F] rounded-lg px-3 py-2 cursor-pointer"
  handleClick={() => setOpenModalName("SHARE_CHART")}
>
  <ShareIcon className="w-3.5 h-3.5" />
  <p className="font-inter font-normal text-sm leading-4 text-primary w-max">
    Share Chart
  </p>
</Buttons>

{/* <ChartButton
  icon={<ShareIcon />}
  text="Share chart"
  onClick={() => setOpenModalName("SHARE_CHART")}
/> */}

{openModalName === "DOWNLOAD_CHART" && (
        <DownloadDataModal
          handleCloseModal={() => setOpenModalName("")}
          handleDownloadClick={handleDownloadChart}
        />
      )}
                {openModalName === "SHARE_CHART" && (
        <ShareSocialModal
          handleCloseModal={() => setOpenModalName("")}
          handleDownloadClick={handleDownloadChart}
        />
        
      )}
        </div>
      </div>
    </>
  );
};

export default ChartParent;
