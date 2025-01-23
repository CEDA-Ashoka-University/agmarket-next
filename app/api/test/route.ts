// // app/api/test/route.ts
// import { PrismaClient } from '@prisma/client';
// import { NextRequest, NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const district = searchParams.get('district');

//     if (!district) {
//       return NextResponse.json({ error: "District query parameter is required" }, { status: 400 });
//     }

//     const result = await prisma.master_district.findMany({
//       where: {
//         district_id: Number(district)
//       }
//     });

//     return NextResponse.json(result);

//   } catch (error) {
//     console.error("Error fetching district data:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch all states
    const states = await prisma.master_states_UI.findMany({
      select: {
        state_id: true,
        state_name: true,
      },
    });

    // Fetch all commodities
    const commodities = await prisma.master_commodities.findMany({
      select: {
        commodity_id: true,
        commodity_name: true,
      },
    });

    // Return the response
    return NextResponse.json({
      states,
      commodities,
    });
  } catch (error) {
    console.error('Error fetching all states and commodities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
