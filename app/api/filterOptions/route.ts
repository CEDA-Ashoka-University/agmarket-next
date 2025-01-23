// app/api/filterOptions/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const stateId = req.nextUrl.searchParams.get('stateId');

//     if (!stateId) {
//       return NextResponse.json({ error: 'State ID is required' }, { status: 400 });
//     }

//     // Fetch state by ID
//     const state = await prisma.master_states.findUnique({
//       where: { state_id: Number(stateId) },
//     });

//     if (!state) {
//       return NextResponse.json({ error: 'State not found' }, { status: 404 });
//     }

//     // Fetch all commodities
//     const commodities = await prisma.master_commodities.findMany();

//     // Fetch districts corresponding to the selected state
//     const districts = await prisma.master_district.findMany({
//       where: {
//         trans_state_district: {
//           some: {
//             state_id: Number(stateId),
//           },
//         },
//       },
//       select: {
//         district_id: true,
//         district_name: true,
//       },
//     });

//     // Return the response
//     return NextResponse.json({
//       stateName: state.state_name,
//       commodities,
//       districts,
//     });
//   } catch (error) {
//     console.error('Error fetching filter options:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const stateId = req.nextUrl.searchParams.get('stateId');

    if (!stateId) {
      return NextResponse.json({ error: 'State ID is required' }, { status: 400 });
    }

    // Fetch districts corresponding to the selected state
    const districts = await prisma.master_district.findMany({
      where: {
        trans_state_district_UI: {
          some: {
            state_id: Number(stateId),
          },
        },
      },
      select: {
        district_id: true,
        district_name: true,
      },
    });

    // Return the response
    return NextResponse.json(districts);
  } catch (error) {
    console.error('Error fetching districts by stateId:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
