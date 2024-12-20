// utils/dateUtils.ts
export const getDefaultDateRange = () => {
    const today = new Date();
    const past90Days = new Date();
    past90Days.setDate(today.getDate() - 90);
  
    return {
      startDate: past90Days.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  };
  