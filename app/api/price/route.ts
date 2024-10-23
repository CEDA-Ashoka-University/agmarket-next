
// // //// Using mysql

// import { NextRequest, NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';

// // Create a connection pool to connect to the MySQL database
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'admin',
//   password: 'agmarknetsuperuser123',
//   database: 'agmarknet',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);

//   const commodity_id = searchParams.get('commodity_id');
//   const district_id = searchParams.get('district_id');
//   const start_date = searchParams.get('start_date');
//   const end_date = searchParams.get('end_date');

//   // Validate that all required query parameters are provided
//   if (!commodity_id || !district_id || !start_date || !end_date) {
//     return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
//   }

//   try {
//     // SQL query to fetch price data with a 30-day moving average
//     const query = `
//       SELECT 
//         p.*, 
//         (
//           SELECT AVG(modal_price) 
//           FROM price
//           WHERE commodity_id = p.commodity_id 
//             AND district_id = p.district_id 
//             AND date >= DATE_SUB(p.date, INTERVAL 30 DAY) 
//             AND date <= p.date
//         ) AS moving_average
//       FROM price p
//       WHERE p.commodity_id = ?
//       AND p.district_id = ?
//       AND p.date >= ?
//       AND p.date <= ?;
//     `;

//     // Execute the query with the provided parameters
//     const [rows] = await pool.execute(query, [commodity_id, district_id, start_date, end_date]);

//     // Return the result as JSON
//     return NextResponse.json(rows, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching prices:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }



// in  Prism with 30- days moving averga

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

interface Price {
  id: bigint;
  district_id: number;
  market_id: number;
  market_name: string | null;
  commodity_id: number;
  variety: string | null;
  grade: string | null;
  min_price: number;
  max_price: number;
  modal_price: number | null;
  date: Date | null; // This should be defined as nullable
  moving_average?: number | null; // Optional field for moving average
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const commodity_id = req.nextUrl.searchParams.get('commodity_id');
    const district_id = req.nextUrl.searchParams.get('district_id');
    const state_id = req.nextUrl.searchParams.get('state_id');
    const start_date = req.nextUrl.searchParams.get('start_date');
    const end_date = req.nextUrl.searchParams.get('end_date');

    if (!commodity_id && !district_id && !state_id && !start_date && !end_date) {
      return NextResponse.json({ error: "At least one filter parameter (commodity_id, district_id, state_id, start date, or end date) is required" }, { status: 400 });
    }

    const filters: any = {};

    if (commodity_id) {
      filters.commodity_id = Number(commodity_id);
    }

    if (district_id) {
      filters.district_id = Number(district_id);
    }

    if (state_id) {
      filters.master_district = { trans_state_district: { some: { state_id: Number(state_id) } } };
    }

    if (start_date && end_date) {
      filters.date = { gte: new Date(start_date), lte: new Date(end_date) };
    } else if (start_date) {
      filters.date = { gte: new Date(start_date) };
    } else if (end_date) {
      filters.date = { lte: new Date(end_date) };
    }

    // Fetch the data
    const data = await prisma.price.findMany({
      where: {
        AND: [filters]
      },
      orderBy: {
        date: 'asc' // Ensure the data is ordered by date for moving average calculation
      }
    });

    const movingAverages = data.map((price) => {
      // Check if price.date is valid (not null)
      if (price.date) {
        // Calculate the moving average for the last 30 days
        const pricesInLast30Days = data.filter((p) => {
          if (!p.date) return false; // Skip if p.date is null
          const diff = (new Date(price.date as Date).getTime() - new Date(p.date as Date).getTime()) / (1000 * 3600 * 24);

          return diff >= 0 && diff < 30; // 0 to 30 days
        });
    
        const sum = pricesInLast30Days.reduce((acc, p) => acc + (p.modal_price || 0), 0);
        const average = pricesInLast30Days.length > 0 ? sum / pricesInLast30Days.length : 0;
    
        return {
          ...price,
          moving_average: average, // Add moving average to each price entry
        };
      }
    
      // If price.date is null, handle it as needed
      return {
        ...price,
        moving_average: null, // or handle as needed
      };
    });
    



    const serializedData = JSON.parse(JSON.stringify(movingAverages, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({
      msg: "good",
      data: serializedData
    });
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
