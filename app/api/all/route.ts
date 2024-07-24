import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch all states
    const states = await prisma.master_states.findMany({
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
