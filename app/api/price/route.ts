
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const commodity_id = req.nextUrl.searchParams.get('commodity_id');
//     const district_id = req.nextUrl.searchParams.get('district_id');
//     const state_id = req.nextUrl.searchParams.get('state_id');
//     const start_date = req.nextUrl.searchParams.get('start');
//     const end_date = req.nextUrl.searchParams.get('end');
    
//     console.log("commodity_id type:", typeof commodity_id);
//     console.log("district_id type:", typeof district_id);
//     console.log("state_id type:", typeof state_id);
//     console.log("start_date type:", typeof start_date);
//     console.log("end_date type:", typeof end_date);

//     if (!commodity_id || !district_id || !state_id || !start_date || !end_date) {
//       return NextResponse.json({ error: "commodity_id, district_id, state_id, start date and end date are required" }, { status: 400 });
//     }
    
//     console.log("Inside GET:", { commodity_id, district_id, state_id, start_date, end_date });

//     const data = await prisma.price.findMany({
//       where: {
//         AND: [
//           { commodity_id: Number(commodity_id) },
//           { district_id: Number(district_id) },
//           { master_district: { trans_state_district: { some: { state_id: Number(state_id) } } } },
//           { date: { gte: new Date(start_date), lte: new Date(end_date) } }
//         ]
//       }
//     });

//     console.log(data);

//     const serializedData = JSON.parse(JSON.stringify(data, (key, value) => 
//       typeof value === 'bigint' ? value.toString() : value
//     ));

//     return NextResponse.json({
//       msg: "good",
//       data: serializedData
//     });
//   } catch (error) {
//     console.error("Error handling GET request:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const commodity_id = req.nextUrl.searchParams.get('commodity_id');
    const district_id = req.nextUrl.searchParams.get('district_id');
    const state_id = req.nextUrl.searchParams.get('state_id');
    const start_date = req.nextUrl.searchParams.get('start');
    const end_date = req.nextUrl.searchParams.get('end');
    
    console.log("commodity_id type:", typeof commodity_id);
    console.log("district_id type:", typeof district_id);
    console.log("state_id type:", typeof state_id);
    console.log("start_date type:", typeof start_date);
    console.log("end_date type:", typeof end_date);

    if (!commodity_id && !district_id && !state_id && !start_date && !end_date) {
      return NextResponse.json({ error: "At least one filter parameter (commodity_id, district_id, state_id, start date, or end date) is required" }, { status: 400 });
    }
    
    console.log("Inside GET:", { commodity_id, district_id, state_id, start_date, end_date });

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

    const data = await prisma.price.findMany({
      where: {
        AND: [filters]
      }
    });

    console.log(data);

    const serializedData = JSON.parse(JSON.stringify(data, (key, value) => 
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
