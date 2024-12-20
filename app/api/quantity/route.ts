

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//     const {
//         commodity_id,
//         district_id,
//         state_id,
//         start_date,
//         end_date,
//         calculation_type = 'daily' // Default to daily if not provided
//     } = await req.json();

//     // Validate required fields
//     if (!commodity_id || (!district_id && !state_id) || !start_date || !end_date) {
//         return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
//     }

//     try {
//         let data;

//         if (state_id && district_id === '0') {
//             // State-level query
//             if (calculation_type === 'monthly') {
//                 data = await prisma.$queryRaw`
//                     SELECT 
//                         DATE_FORMAT(total_data.date, '%Y-%m-01') AS month,
//                         total_data.state_name,
//                         total_data.commodity_id,
//                         total_data.commodity_name,
//                         SUM(total_data.total_quantity) AS monthly_total_quantity,
//                         SUM(total_data.total_quantity) OVER (
//                             PARTITION BY total_data.state_id, total_data.commodity_id
//                             ORDER BY DATE_FORMAT(total_data.date, '%Y-%m-01')
//                             ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
//                         ) AS moving_total_quantity
//                     FROM (
//                         SELECT 
//                             q.date,
//                             q.commodity_id,
//                             mc.commodity_name,
//                             ms.state_name,
//                             ms.state_id,
//                             SUM(q.quantity) AS total_quantity
//                         FROM 
//                             agmarknet.quantity q
//                         JOIN 
//                             agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
//                         JOIN 
//                             agmarknet.master_district md ON q.district_id = md.district_id
//                         JOIN
//                             agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
//                         JOIN 
//                             agmarknet.master_states ms ON ms.state_id = tsd.state_id
//                         GROUP BY 
//                             q.date, ms.state_id, q.commodity_id
//                     ) AS total_data
//                     WHERE 
//                         total_data.state_id = ${Number(state_id)}
//                         AND total_data.commodity_id = ${Number(commodity_id)}
//                         AND total_data.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//                     GROUP BY 
//                         month, total_data.state_name, total_data.state_id, total_data.commodity_id, total_data.commodity_name
//                     ORDER BY 
//                         month DESC;
//                 `;
//             } else {
//                 data = await prisma.$queryRaw`
//                     SELECT 
//                         total_data.date,
//                         total_data.state_name,
//                         total_data.commodity_id,
//                         total_data.commodity_name,
//                         total_data.total_quantity,
//                         SUM(total_data.total_quantity) OVER (
//                             PARTITION BY total_data.state_id, total_data.commodity_id
//                             ORDER BY total_data.date
//                             ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
//                         ) AS moving_total_quantity
//                     FROM (
//                         SELECT 
//                             q.date,
//                             q.commodity_id,
//                             mc.commodity_name,
//                             ms.state_name,
//                             ms.state_id,
//                             SUM(q.quantity) AS total_quantity
//                         FROM 
//                             agmarknet.quantity q
//                         JOIN 
//                             agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
//                         JOIN 
//                             agmarknet.master_district md ON q.district_id = md.district_id
//                         JOIN
//                             agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
//                         JOIN 
//                             agmarknet.master_states ms ON ms.state_id = tsd.state_id
//                         GROUP BY 
//                             q.date, ms.state_id, q.commodity_id
//                     ) AS total_data
//                     WHERE 
//                         total_data.state_id = ${Number(state_id)}
//                         AND total_data.commodity_id = ${Number(commodity_id)}
//                         AND total_data.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//                     ORDER BY 
//                         total_data.date DESC;
//                 `;
//             }
//         } else if (district_id) {
//             // District-level query
//             if (calculation_type === 'monthly') {
//                 data = await prisma.$queryRaw`
//                     SELECT 
//                         DATE_FORMAT(total_data.date, '%Y-%m-01') AS month,
//                         total_data.district_id,
//                         total_data.district_name,
//                         total_data.commodity_id,
//                         total_data.commodity_name,
//                         SUM(total_data.total_quantity) AS monthly_total_quantity,
//                         SUM(total_data.total_quantity) OVER (
//                             PARTITION BY total_data.district_id, total_data.commodity_id
//                             ORDER BY DATE_FORMAT(total_data.date, '%Y-%m-01')
//                             ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
//                         ) AS moving_total_quantity
//                     FROM (
//                         SELECT 
//                             q.date,
//                             q.district_id,
//                             q.commodity_id,
//                             md.district_name,
//                             mc.commodity_name,
//                             SUM(q.quantity) AS total_quantity
//                         FROM 
//                             agmarknet.quantity q
//                         JOIN 
//                             agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
//                         JOIN 
//                             agmarknet.master_district md ON q.district_id = md.district_id
//                         JOIN
//                             agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
//                         GROUP BY 
//                             q.date, q.district_id, q.commodity_id
//                     ) AS total_data
//                     WHERE 
//                         total_data.district_id = ${Number(district_id)}
//                         AND total_data.commodity_id = ${Number(commodity_id)}
//                         AND total_data.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//                     GROUP BY 
//                         month, total_data.district_id, total_data.commodity_id, total_data.district_name, total_data.commodity_name
//                     ORDER BY 
//                         month DESC;
//                 `;
//             } else {
//                 data = await prisma.$queryRaw`
//                     SELECT 
//                         total_data.date,
//                         total_data.district_id,
//                         total_data.district_name,
//                         total_data.commodity_id,
//                         total_data.total_quantity,
//                         total_data.commodity_name,
//                         SUM(total_data.total_quantity) OVER (
//                             PARTITION BY total_data.district_id, total_data.commodity_id
//                             ORDER BY total_data.date
//                             ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
//                         ) AS moving_total_quantity
//                     FROM (
//                         SELECT 
//                             q.date,
//                             q.district_id,
//                             q.commodity_id,
//                             md.district_name,
//                             mc.commodity_name,
//                             SUM(q.quantity) AS total_quantity
//                         FROM 
//                             agmarknet.quantity q
//                         JOIN 
//                             agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
//                         JOIN 
//                             agmarknet.master_district md ON q.district_id = md.district_id
//                         JOIN
//                             agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
//                         GROUP BY 
//                             q.date, q.district_id, q.commodity_id
//                     ) AS total_data
//                     WHERE 
//                         total_data.district_id = ${Number(district_id)}
//                         AND total_data.commodity_id = ${Number(commodity_id)}
//                         AND total_data.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//                     ORDER BY 
//                         total_data.date DESC;
//                 `;
//             }
//         }

//         return NextResponse.json(data, { status: 200 });

//     } catch (error) {
//         console.error("Error fetching prices:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import { getQuantityByState } from '../queries/getQuantityByState';
// import { getQuantityByDistrict } from '../queries/getQuantityByDistrict';

// export async function POST(req: NextRequest) {
//     const {
//         commodity_id,
//         district_id,
//         state_id,
//         start_date,
//         end_date,
//         calculation_type = 'daily'
//     } = await req.json();

//     // Check for missing required parameters
//     if (!commodity_id || (!district_id && !state_id) || !start_date || !end_date) {
//         return NextResponse.json({
//             status: 'error',
//             message: 'Missing required parameters',
//             data: null
//         }, { status: 400 });
//     }

//     try {
//         let data;

//         if (state_id && district_id === '0') {
//             // Fetch data for state level
//             data = await getQuantityByState(
//                 Number(commodity_id),
//                 Number(state_id),
//                 start_date,
//                 end_date,
//                 calculation_type
//             );
//         } else if (district_id) {
//             // Fetch data for district level
//             data = await getQuantityByDistrict(
//                 Number(commodity_id),
//                 Number(district_id),
//                 start_date,
//                 end_date,
//                 calculation_type
//             );
//         }

//         // Handle case where data is not found
//         if (!data || data.length === 0) {
//             return NextResponse.json({
//                 status: 'success',
//                 message: 'Data not available',
//                 data: null
//             }, { status: 204 }); // 204 No Content
//         }

//         // Return successful response with data
//         return NextResponse.json({
//             status: 'success',
//             message: 'Data fetched successfully',
//             data: data
//         }, { status: 200 });

//     } catch (error) {
//         console.error('Error fetching data:', error);

//         // Return error response
//         return NextResponse.json({
//             status: 'error',
//             message: 'Internal server error',
//             data: null
//         }, { status: 500 });
//     }
// }

import { NextRequest, NextResponse } from 'next/server';
import { getQuantityByState } from '../queries/getQuantityByState';
import { getQuantityByDistrict } from '../queries/getQuantityByDistrict';

// Define the type for the data items
type QuantityData = {
    date: string;
    commodity_id: number;
    commodity_name: string;
    total_quantity: number;
};

// Define the type for the API response
type ApiResponse = {
    status: 'success' | 'error';
    message: string;
    data: QuantityData[] | null;
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
        let data: QuantityData[] | null = null;

        if (state_id && district_id === '0') {
            // Fetch data for state level
            data = await getQuantityByState(
                Number(commodity_id),
                Number(state_id),
                start_date,
                end_date,
                calculation_type
            ) as QuantityData[];
        } else if (district_id) {
            // Fetch data for district level
            data = await getQuantityByDistrict(
                Number(commodity_id),
                Number(district_id),
                start_date,
                end_date,
                calculation_type
            ) as QuantityData[];
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
