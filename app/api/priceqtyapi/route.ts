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
            DATE_FORMAT(p.date, '%Y-01-01') AS year, 
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price,
            AVG(p.modal_price) OVER (
                PARTITION BY p.district_id 
                ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
                ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
            ) AS moving_average
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            p.date, 
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price,
            AVG(p.modal_price) OVER (
                PARTITION BY p.district_id 
                ORDER BY p.date 
                ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
            ) AS moving_average
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            DATE_FORMAT(p.date, '%Y-01-01') AS year, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price,
            AVG(p.modal_price) OVER (
                PARTITION BY p.district_id 
                ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
                ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
            ) AS moving_average
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            p.date, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price,
            AVG(p.modal_price) OVER (
                PARTITION BY p.district_id 
                ORDER BY p.date 
                ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
            ) AS moving_average
          FROM 
            agmarknet.price p  
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
    } else if (district_id) {
      // District-level price data query
      if (calculation_type === "yearly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-01-01') AS year,
            tsd.district_id,
            md.district_name,
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
          JOIN 
            agmarknet.master_district md ON p.district_id = md.district_id
          JOIN
            agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}
            AND p.district_id = ${Number(district_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            year, tsd.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }
      else if (calculation_type === "monthly") {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(p.date, '%Y-%m-01') AS month,
            tsd.district_id,
            md.district_name,
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price,
            AVG(p.modal_price) OVER (
                ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
                ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
            ) AS moving_average
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
          JOIN 
            agmarknet.master_district md ON p.district_id = md.district_id
          JOIN
            agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}
            AND p.district_id = ${Number(district_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            month, tsd.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        priceDataQuery = prisma.$queryRaw`
          SELECT 
            p.date,
            tsd.district_id,
            md.district_name,
            mc.commodity_name,
            AVG(p.modal_price) AS avg_modal_price,
            AVG(p.min_price) AS avg_min_price,
            AVG(p.max_price) AS avg_max_price,
            AVG(p.modal_price) OVER (
                ORDER BY p.date 
                ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
            ) AS moving_average
          FROM 
            agmarknet.price p
          JOIN 
            agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
          JOIN 
            agmarknet.master_district md ON p.district_id = md.district_id
          JOIN
            agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
          WHERE 
            p.commodity_id = ${Number(commodity_id)}
            AND p.district_id = ${Number(district_id)}
            AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
          GROUP BY 
            p.date, tsd.district_id, md.district_name
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
            DATE_FORMAT(q.date, '%Y-01-01') AS year, 
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            q.date, 
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            DATE_FORMAT(q.date, '%Y-01-01') AS year, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            q.date, 
            tsd.state_id,
            ms.state_name,
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id 
          JOIN 
            agmarknet.master_states ms ON ms.state_id = tsd.state_id
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
            DATE_FORMAT(q.date, '%Y-01-01') AS year,
            tsd.district_id,
            md.district_name,
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
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
            year, tsd.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            year DESC;
        `;
      }
      

      else if (calculation_type === "monthly") {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(q.date, '%Y-%m-01') AS month,
            tsd.district_id,
            md.district_name,
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
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
            month, tsd.district_id, md.district_name, mc.commodity_name
          ORDER BY 
            month DESC;
        `;
      } else {
        quantityDataQuery = prisma.$queryRaw`
          SELECT 
            q.date,
            tsd.district_id,
            md.district_name,
            mc.commodity_name,
            SUM(q.quantity) AS total_quantity
          FROM 
            agmarknet.quantity q
          JOIN 
            agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
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
            q.date, tsd.district_id, md.district_name, mc.commodity_name
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
