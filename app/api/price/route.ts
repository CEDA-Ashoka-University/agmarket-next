
// Get request//
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);

//   const commodity_id = searchParams.get('commodity_id');
//   const district_id = searchParams.get('district_id');
//   const state_id = searchParams.get('state_id');
//   const start_date = searchParams.get('start_date');
//   const end_date = searchParams.get('end_date');
//   const calculation_type = searchParams.get('calculation_type'); // either 'daily' or 'monthly'

//   // Validate that required query parameters are provided
//   if (!commodity_id || (!district_id && !state_id) || !start_date || !end_date) {
//     return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
//   }

//   try {
//     let data;

//     if (state_id && district_id === '0') {
//       // State-level query with daily or monthly averages for modal, min, and max prices
//       if (calculation_type === 'monthly') {
//         console.log('inside state api - monthly');
//         data = await prisma.$queryRaw`
//           SELECT 
//             DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
//             tsd.state_id,
//             ms.state_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             AVG(p.modal_price) OVER (
//                 PARTITION BY p.district_id 
//                 ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
//                 ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
//             ) AS moving_average
//           FROM 
//             agmarknet.price p  
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
//           JOIN 
//             agmarknet.master_states ms ON ms.state_id = tsd.state_id
//           JOIN
//             agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}  
//             AND tsd.state_id = ${Number(state_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             month, tsd.state_id, ms.state_name, mc.commodity_name
//           ORDER BY 
//             month DESC;
//         `;
//       } else {
//         console.log('inside state api - daily');
//         data = await prisma.$queryRaw`
//           SELECT 
//             p.date, 
//             tsd.state_id,
//             ms.state_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             AVG(p.modal_price) OVER (
//                 PARTITION BY p.district_id 
//                 ORDER BY p.date 
//                 ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
//             ) AS moving_average
//           FROM 
//             agmarknet.price p  
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
//           JOIN 
//             agmarknet.master_states ms ON ms.state_id = tsd.state_id
//           JOIN
//             agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}  
//             AND tsd.state_id = ${Number(state_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             p.date, tsd.state_id, ms.state_name
//           ORDER BY 
//             p.date DESC;
//         `;
//       }

//     } else if (district_id) {
//       // District-level query with daily or monthly totals for quantity
//       if (calculation_type === 'monthly') {
//         console.log("inside district prices - monthly");
//         data = await prisma.$queryRaw`
//           SELECT 
//             DATE_FORMAT(p.date, '%Y-%m-01') AS month,
//             tsd.district_id,
//             md.district_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price
//           FROM 
//             agmarknet.price p
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//           JOIN 
//             agmarknet.master_district md ON p.district_id = md.district_id
//           JOIN
//             agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}
//             AND p.district_id = ${Number(district_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             month, tsd.district_id, md.district_name, mc.commodity_name
//           ORDER BY 
//             month DESC;
//         `;
//       } else {
//         console.log("inside district prices - daily");
//         data = await prisma.$queryRaw`
//           SELECT 
//             p.date,
//             tsd.district_id,
//             md.district_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             (AVG(p.modal_price) - LAG(AVG(p.modal_price)) OVER (ORDER BY p.date)) AS change_in_modal_price,
//             (AVG(p.min_price) - LAG(AVG(p.min_price)) OVER (ORDER BY p.date)) AS change_in_min_price,
//             (AVG(p.max_price) - LAG(AVG(p.max_price)) OVER (ORDER BY p.date)) AS change_in_max_price
//           FROM 
//             agmarknet.price p
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//           JOIN 
//             agmarknet.master_district md ON p.district_id = md.district_id
//           JOIN
//             agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}
//             AND p.district_id = ${Number(district_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             p.date, tsd.district_id, md.district_name
//           ORDER BY 
//             p.date DESC;
//         `;
//       }
//     }

//     // Return the result as JSON
//     return NextResponse.json(data, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching prices:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


// Post resquest

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const body = await req.json();

//   const { commodity_id, district_id, state_id, start_date, end_date, calculation_type } = body;

//   // Validate that required body parameters are provided
//   if (!commodity_id || (!district_id && !state_id) || !start_date || !end_date) {
//     return NextResponse.json({ error: 'Missing required body parameters' }, { status: 400 });
//   }

//   try {
//     let data;

//     if (state_id && district_id === '0') {
//       // State-level query with daily or monthly averages
//       if (calculation_type === 'monthly') {
//         console.log('inside state api - monthly');
//         data = await prisma.$queryRaw`
//           SELECT 
//             DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
//             tsd.state_id,
//             ms.state_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             AVG(p.modal_price) OVER (
//                 PARTITION BY p.district_id 
//                 ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
//                 ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
//             ) AS moving_average
//           FROM 
//             agmarknet.price p  
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
//           JOIN 
//             agmarknet.master_states ms ON ms.state_id = tsd.state_id
//           JOIN
//             agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}  
//             AND tsd.state_id = ${Number(state_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             month, tsd.state_id, ms.state_name, mc.commodity_name
//           ORDER BY 
//             month DESC;
//         `;
//       } else {
//         console.log('inside state api - daily');
//         data = await prisma.$queryRaw`
//           SELECT 
//             p.date, 
//             tsd.state_id,
//             ms.state_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             AVG(p.modal_price) OVER (
//                 PARTITION BY p.district_id 
//                 ORDER BY p.date 
//                 ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
//             ) AS moving_average
//           FROM 
//             agmarknet.price p  
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
//           JOIN 
//             agmarknet.master_states ms ON ms.state_id = tsd.state_id
//           JOIN
//             agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}  
//             AND tsd.state_id = ${Number(state_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             p.date, tsd.state_id, ms.state_name
//           ORDER BY 
//             p.date DESC;
//         `;
//       }
//     } else if (district_id) {
//       // District-level query with daily or monthly totals for quantity
//       if (calculation_type === 'monthly') {
//         console.log("inside district prices - monthly");
//         data = await prisma.$queryRaw`
//           SELECT 
//             DATE_FORMAT(p.date, '%Y-%m-01') AS month,
//             tsd.district_id,
//             md.district_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             AVG(p.modal_price) OVER (
//                 ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
//                 ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
//             ) AS moving_average
//           FROM 
//             agmarknet.price p
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//           JOIN 
//             agmarknet.master_district md ON p.district_id = md.district_id
//           JOIN
//             agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}
//             AND p.district_id = ${Number(district_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             month, tsd.district_id, md.district_name, mc.commodity_name
//           ORDER BY 
//             month DESC;
//         `;
//       } else {
//         console.log("inside district prices - daily");
//         data = await prisma.$queryRaw`
//           SELECT 
//             p.date,
//             tsd.district_id,
//             md.district_name,
//             mc.commodity_name,
//             AVG(p.modal_price) AS avg_modal_price,
//             AVG(p.min_price) AS avg_min_price,
//             AVG(p.max_price) AS avg_max_price,
//             AVG(p.modal_price) OVER (
//                 ORDER BY p.date 
//                 ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
//             ) AS moving_average
//           FROM 
//             agmarknet.price p
//           JOIN 
//             agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//           JOIN 
//             agmarknet.master_district md ON p.district_id = md.district_id
//           JOIN
//             agmarknet.master_commodities mc ON p.commodity_id = mc.commodity_id
//           WHERE 
//             p.commodity_id = ${Number(commodity_id)}
//             AND p.district_id = ${Number(district_id)}
//             AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//           GROUP BY 
//             p.date, tsd.district_id, md.district_name
//           ORDER BY 
//             p.date DESC;
//         `;
//       }
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { getPricesByState } from '../queries/getPricesByState';
import { getPricesByDistrict } from '../queries/getPricesByDistrict';

// Define the type for the data items
type PriceData = {
    date: string;
    commodity_name: string;
    state_name?: string;
    district_name?: string;
    avg_modal_price: number;
    avg_min_price: number;
    avg_max_price: number;
    moving_average: number | null;
};

// Define the type for the API response
type ApiResponse = {
    status: 'success' | 'error';
    message: string;
    data: PriceData[] | null;
};

export async function POST(req: NextRequest) {
    const {
        commodity_id,
        district_id,
        state_id,
        start_date,
        end_date,
        calculation_type = 'daily'
    } = await req.json();
    console.log("start_date",start_date)
    // Check for missing required parameters
    if (!commodity_id || (!district_id && !state_id) || !start_date || !end_date) {
        const response: ApiResponse = {
            status: 'error',
            message: 'Missing required parameters',
            data: null
        };
        return NextResponse.json(response, { status: 400 });
    }

    try {
        let data: PriceData[] | null = null;

        if (state_id && district_id === '0') {
            // Fetch data for state level
            data = await getPricesByState(
                Number(commodity_id),
                Number(state_id),
                start_date,
                end_date,
                calculation_type
            ) as PriceData[];
        } else if (district_id) {
            // Fetch data for district level
            data = await getPricesByDistrict(
                Number(commodity_id),
                Number(district_id),
                start_date,
                end_date,
                calculation_type
            ) as PriceData[];
        }


        // Check if data is an array and has length
        if (!data || !Array.isArray(data) || data.length === 0) {
            const response: ApiResponse = {
                status: 'success',
                message: 'Data not available',
                data: null
            };
            return NextResponse.json(response, { status: 204 });
        }

        // Return successful response with data
        const response: ApiResponse = {
            status: 'success',
            message: 'Data fetched successfully',
            data: data
        };
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Error fetching data:', error);

        const response: ApiResponse = {
            status: 'error',
            message: 'Internal server error',
            data: null
        };
        return NextResponse.json(response, { status: 500 });
    }
}
