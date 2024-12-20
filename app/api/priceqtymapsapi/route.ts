import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { commodity_id, state_id, start_date, end_date, calculation_type } = body;

  if (!commodity_id || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    let query;

    // Daily State-Level Data
    if (calculation_type === "daily" && state_id) {
      query = prisma.$queryRaw`
        SELECT 
          p.district_id, 
          AVG(p.modal_price) AS ModalPrice, 
          md.district_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)} 
          AND p.date = ${new Date(start_date)}
        GROUP BY 
          p.district_id, md.district_name
        ORDER BY 
          ModalPrice DESC
        LIMIT 10;
      `;
    }

    // Daily India-Level Data
    else if (calculation_type === "daily" && !state_id) {
      query = prisma.$queryRaw`
        SELECT 
          ms.state_id, 
          AVG(p.modal_price) AS ModalPrice, 
          ms.state_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND p.date = ${new Date(start_date)}
        GROUP BY 
          ms.state_id, ms.state_name
        ORDER BY 
          ModalPrice DESC
        LIMIT 10;
      `;
    }

    // Monthly State-Level Data
    else if (calculation_type === "monthly" && state_id) {
      query = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
          p.district_id, 
          AVG(p.modal_price) AS ModalPrice, 
          md.district_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)}
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          month, p.district_id, md.district_name
        ORDER BY 
          ModalPrice DESC
        LIMIT 10;
      `;
    }

    // Monthly National-Level Data
    else if (calculation_type === "monthly" && !state_id) {
      query = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
          ms.state_id, 
          AVG(p.modal_price) AS ModalPrice, 
          ms.state_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          month, ms.state_id, ms.state_name
        ORDER BY 
          ModalPrice DESC
        LIMIT 10;
      `;
    }

    // Yearly State-Level Data
    else if (calculation_type === "yearly" && state_id) {
      query = prisma.$queryRaw`
        SELECT 
          YEAR(p.date) AS year, 
          p.district_id, 
          md.district_name, 
          AVG(p.modal_price) AS ModalPrice
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)}
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          year, p.district_id, md.district_name
        ORDER BY 
          ModalPrice DESC
        LIMIT 10;
      `;
    }

    // Yearly National-Level Data
    else if (calculation_type === "yearly" && !state_id) {
      query = prisma.$queryRaw`
        SELECT 
          YEAR(p.date) AS year, 
          ms.state_id, 
          ms.state_name, 
          AVG(p.modal_price) AS ModalPrice
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          year, ms.state_id, ms.state_name
        ORDER BY 
          ModalPrice DESC
        LIMIT 10;
      `;
    }

    const result = await query;
    return NextResponse.json({ data: result }, { status: 200 });

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
