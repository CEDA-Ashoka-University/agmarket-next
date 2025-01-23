import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
        category_id:true,
      },
    });

    // Fetch all categories
    const categories = await prisma.master_categories.findMany({
      select: {
        category_id: true,
        category_name: true,
      },
    });

    // Return the response
    return NextResponse.json({
      states,
      categories,
      commodities,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
