


import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { commodity_id, district_id, state_id, start_date, end_date, calculation_type } = body;

  // Validate that required body parameters are provided
  if (!commodity_id || (!district_id && !state_id) || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required body parameters" }, { status: 400 });
  }

  try {
    // Initialize with empty promise
    let priceDataQuery = Promise.resolve([]);
    let quantityDataQuery = Promise.resolve([]);

    // for national level when state_id = 0 "All India"
    if (state_id==="0"){
      if (calculation_type === "yearly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date,'%Y') AS year, 
            mc.commodity_name,
            Round(Round(AVG(p.modal_price),2),2) AS avg_modal_price,
            Round(Round(AVG(p.min_price),2),2) AS avg_min_price,
            Round(Round(AVG(p.max_price),2),2) AS avg_max_price,
            'India' AS state_name,
            'All' As district_name,
            'Yearly' as calculationType
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district_UI tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
                  JOIN 
        agmarknet.master_district md ON md.district_id = p.district_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}  
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            year, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }

      else if (calculation_type === "monthly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
            mc.commodity_name,
            Round(Round(AVG(p.modal_price),2),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'India' AS state_name,
            'All' As district_name,
            'Monthly' as calculationType
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district_UI tsd ON p.district_id = tsd.district_id 
          
                JOIN 
        agmarknet.master_district md ON md.district_id = p.district_id
            JOIN 
          
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}  
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            month, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-%d') AS date, 
            mc.commodity_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'India' AS state_name,
            'All' As district_name,
            'Daily' as calculationType
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district_UI tsd ON tsd.district_id = p.district_id 
           JOIN 
        agmarknet.master_district md ON md.district_id = p.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}  
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            p.date
          ORDER BY 
            p.date DESC;
        `;
      }


    }
    // Price data query
      else if (state_id && district_id === "0") {
      // State-level price data query
      if (calculation_type === "yearly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date,'%Y') AS year, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'All' As district_name,
            'Yearly' as calculationType
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district_UI tsd ON tsd.district_id = p.district_id 
           JOIN 
        agmarknet.master_district md ON md.district_id = p.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}  
            AND tsd.state_id = ${Number(state_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            year, tsd.state_id, ms.state_name, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }

      else if (calculation_type === "monthly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'All' As district_name,
            'Monthly' as calculationType
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district_UI tsd ON tsd.district_id = p.district_id 
          JOIN 
        agmarknet.master_district md ON md.district_id = p.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}  
            AND tsd.state_id = ${Number(state_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            month, tsd.state_id, ms.state_name, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-%d') AS date, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'All' As district_name,
            'Daily' as calculationType
          FROM 
            agmarknet.price p  
          JOIN 
        agmarknet.master_district md ON md.district_id = p.district_id
            JOIN 
            agmarknet.trans_state_district_UI tsd ON tsd.district_id = p.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}  
            AND tsd.state_id = ${Number(state_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            p.date, tsd.state_id, ms.state_name
          ORDER BY 
            p.date DESC;
        `;
      }
    } else if (state_id && district_id !== "0") {
      // District-level price data query
      if (calculation_type === "yearly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date,'%Y') AS year,
            md.district_id,
            md.district_name,
            mc.commodity_name,
            ms.state_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'Yearly' as calculationType
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district_UI tsd ON tsd.district_id = p.district_id
          JOIN 
            agmarknet.master_district md ON md.district_id = p.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}
            AND md.district_id = ${Number(district_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            year, md.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }
      else if (calculation_type === "monthly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-01') AS month,
            p.district_id,
            md.district_name,
            mc.commodity_name,
            ms.state_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'Monthly' as calculationType
  
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district_UI tsd ON p.district_id = tsd.district_id
          JOIN 
            agmarknet.master_district md ON p.district_id = md.district_id
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
            JOIN
            agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}
            AND p.district_id = ${Number(district_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            month, p.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-%d') AS date,
            p.district_id,
            md.district_name,
            mc.commodity_name,
            ms.state_name,
            Round(AVG(p.modal_price),2) AS avg_modal_price,
            Round(AVG(p.min_price),2) AS avg_min_price,
            Round(AVG(p.max_price),2) AS avg_max_price,
            'Daily' as calculationType
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district_UI tsd ON tsd.district_id = p.district_id
          JOIN 
            agmarknet.master_district md ON md.district_id = p.district_id
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
            JOIN
            agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}
            AND p.district_id = ${Number(district_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            p.date, p.district_id, md.district_name
          ORDER BY 
            p.date DESC;
        `;
      }
    }

    // Quantity data query with conditions for state, district, and calculation type

    if (state_id==="0"){

      if (calculation_type === "yearly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y') AS year, 
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            'India' AS state_name,
            'All' As district_name,
            'Yearly' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = q.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}  
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            year, mc.commodity_name
          ORDER BY 
            year DESC`;
      }
      else if (calculation_type === "monthly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-01') AS month, 
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            'India' AS state_name,
            'All' As district_name,
            'Monthly' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = q.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}  
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            month, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-%d') AS date, 
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            'India' AS state_name,
            'All' As district_name,
            'Daily' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN 
            agmarknet.master_commodities mc ON mc.commodity_id = q.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}  
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            q.date, mc.commodity_name
          ORDER BY 
            q.date DESC;
        `;
      }
    }


    else if (state_id && district_id === "0") {
      if (calculation_type === "yearly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y') AS year, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            'All' As district_name,
            'Yearly' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = q.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}  
            AND tsd.state_id = ${Number(state_id)}
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            year, tsd.state_id, ms.state_name, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }

      else if (calculation_type === "monthly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-01') AS month, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            'All' As district_name,
            'Monthly' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON mc.commodity_id = q.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}  
            AND tsd.state_id = ${Number(state_id)}
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            month, tsd.state_id, ms.state_name, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-%d') AS date, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            'All' As district_name,
            'Daily' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN 
            agmarknet.master_commodities mc ON mc.commodity_id = q.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}  
            AND tsd.state_id = ${Number(state_id)}
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            q.date, tsd.state_id, ms.state_name, mc.commodity_name
          ORDER BY 
            q.date DESC;
        `;
      }
    } else if (district_id) {

      if (calculation_type === "yearly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y') AS year,
            q.district_id,
            md.district_name,
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            ms.state_name,
            'Yearly' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN 
            agmarknet.master_district md ON q.district_id = md.district_id
          JOIN
            agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}
            AND q.district_id = ${Number(district_id)}
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            year, q.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }
      

      else if (calculation_type === "monthly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-01') AS month,
            q.district_id,
            md.district_name,
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            ms.state_name,
            'Monthly' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id
          JOIN 
            agmarknet.master_district md ON q.district_id = md.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}
            AND q.district_id = ${Number(district_id)}
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            month, q.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-%d') AS date,
            q.district_id,
            md.district_name,
            mc.commodity_name,
            Round(SUM(q.quantity),2) AS total_quantity,
            ms.state_name,
            'Daily' as calculationType
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district_UI tsd ON q.district_id = tsd.district_id
          JOIN 
            agmarknet.master_district md ON q.district_id = md.district_id
            JOIN 
            agmarknet.master_states_UI ms ON ms.state_id = tsd.state_id
          JOIN
            agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
          WHERE 
            q.commodity_id = ${Number(commodity_id)}
            AND q.district_id = ${Number(district_id)}
            AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
          GROUP BY 
            q.date, q.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            q.date DESC;
        `;
      }
    }

    const priceData = await priceDataQuery;
    const quantityData = await quantityDataQuery;

    return NextResponse.json({ priceData, quantityData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
