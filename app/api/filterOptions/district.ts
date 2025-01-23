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
