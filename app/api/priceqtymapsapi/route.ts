// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { commodity_id, state_id, start_date, end_date, calculation_type } = body;

//   if (!commodity_id || !start_date || !end_date) {
//     return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
//   }

//   try {
//     let query;

//     // Daily State-Level Data
//     if (calculation_type === "daily" && state_id!=="0") {
//       query = prisma.$queryRaw`
//       SELECT 
//         DATE_FORMAT(p.date, '%Y-%m-%d') AS date, 
//         p.district_id, 
//         tsd.state_id,
//         Round(AVG(p.modal_price),2) AS ModalPrice, 
//         md.district_name,
//         ms.state_name,
//         mc.commodity_disp_name as commodity_name
//       FROM 
//         agmarknet.price p
//       JOIN 
//         agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//       JOIN 
//         agmarknet.master_district md ON md.district_id = tsd.district_id
//         JOIN
//         agmarknet.master_states ms on ms.state_id = tsd.state_id
//         JOIN
//         agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
//       WHERE 
//         p.commodity_id = ${Number(commodity_id)} 
//         AND tsd.state_id = ${Number(state_id)}
//         AND p.date >= ${new Date(start_date)}
//         AND p.date <= ${new Date(end_date)}
//       GROUP BY 
//         p.date, p.district_id, tsd.state_id, md.district_name
//       ORDER BY 
//         ModalPrice DESC;
//       `;
//     }

//     // Daily India-Level Data
//     else if (calculation_type === "daily" && state_id==="0") {
//       query = prisma.$queryRaw`
//         SELECT 
//           DATE_FORMAT(p.date, '%Y-%m-%d') AS date, ms.state_id, 
//           Round(AVG(p.modal_price),2) AS ModalPrice, 
//           ms.state_name,
//           mc.commodity_disp_name as commodity_name
//         FROM 
//           agmarknet.price p
//         JOIN 
//           agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//         JOIN 
//           agmarknet.master_states ms ON ms.state_id = tsd.state_id
//                   JOIN
//         agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
//         WHERE 
//           p.commodity_id = ${Number(commodity_id)} 
//                       AND p.date >= ${new Date(start_date)}
//             AND p.date <= ${new Date(end_date)}
//         GROUP BY 
//           p.date, ms.state_id, ms.state_name
//         ORDER BY 
//           ModalPrice DESC
//         ;
//       `;
//     }

//     // Monthly State-Level Data
//     else if (calculation_type === "monthly" &&  state_id!=="0") {
//       query = prisma.$queryRaw`
//         SELECT 
//           DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
//           p.district_id, 
//           Round(AVG(p.modal_price),2) AS ModalPrice, 
//           md.district_name,
//           ms.state_name,
//           mc.commodity_disp_name as commodity_name
//         FROM 
//           agmarknet.price p
//         JOIN 
//           agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//         JOIN 
//           agmarknet.master_district md ON md.district_id = tsd.district_id
//         JOIN
//           agmarknet.master_states ms on ms.state_id = tsd.state_id
//                   JOIN
//         agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
//         WHERE 
//           p.commodity_id = ${Number(commodity_id)} 
//           AND tsd.state_id = ${Number(state_id)}
//           AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//         GROUP BY 
//           month, p.district_id
//         ORDER BY 
//           ModalPrice DESC
//         ;
//       `;
//     }

//     // Monthly National-Level Data
//     else if (calculation_type === "monthly" && state_id==="0") {
//       query = prisma.$queryRaw`
//         SELECT 
//           DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
//           ms.state_id, 
//           Round(AVG(p.modal_price),2) AS ModalPrice, 
//           ms.state_name,
//           mc.commodity_disp_name as commodity_name
//         FROM 
//           agmarknet.price p
//         JOIN 
//           agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//         JOIN 
//           agmarknet.master_states ms ON ms.state_id = tsd.state_id
//                   JOIN
//         agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
//         WHERE 
//           p.commodity_id = ${Number(commodity_id)} 
//           AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//         GROUP BY 
//           month, ms.state_id, ms.state_name
//         ORDER BY 
//           ModalPrice DESC
//         ;
//       `;
//     }

//     // Yearly State-Level Data
//     else if (calculation_type === "yearly" &&  state_id==="0") {
//       query = prisma.$queryRaw`
//         SELECT 
//           YEAR(p.date) AS year, 
//           p.district_id, 
//           md.district_name, 
//           Round(AVG(p.modal_price),2) AS ModalPrice,
//           mc.commodity_disp_name as commodity_name
//         FROM 
//           agmarknet.price p
//         JOIN 
//           agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//         JOIN 
//           agmarknet.master_district md ON md.district_id = tsd.district_id
//                   JOIN
//         agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
//         WHERE 
//           p.commodity_id = ${Number(commodity_id)} 
//           AND tsd.state_id = ${Number(state_id)}
//           AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//         GROUP BY 
//           year, p.district_id,md.district_name, 
//         ORDER BY 
//           ModalPrice DESC
//         ;
//       `;
//     }

//     // Yearly National-Level Data
//     else if (calculation_type === "yearly" && state_id==="0") {
//       query = prisma.$queryRaw`
//         SELECT 
//           YEAR(p.date) AS year, 
//           ms.state_id, 
//           ms.state_name, 
//           Round(AVG(p.modal_price),2) AS ModalPrice,
//           mc.commodity_disp_name as commodity_name
//         FROM 
//           agmarknet.price p
//         JOIN 
//           agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
//         JOIN 
//           agmarknet.master_states ms ON ms.state_id = tsd.state_id
//                   JOIN
//         agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
//         WHERE 
//           p.commodity_id = ${Number(commodity_id)} 
//           AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
//         GROUP BY 
//           year, ms.state_id, ms.state_name
//         ORDER BY 
//           ModalPrice DESC
//         ;
//       `;
//     }

//     const result = await query;
//     return NextResponse.json({ data: result }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


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
    let PriceQuery;
    let QuantityQuery;

    // Daily State-Level Data
    if (calculation_type === "daily" && state_id!=="0") {
      PriceQuery = prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(p.date, '%Y-%m-%d') AS date, 
        p.district_id, 
        
        Round(AVG(p.modal_price),2) AS ModalPrice, 
        md.district_name,
        ms.state_name,
        mc.commodity_disp_name as commodity_name
      FROM 
        agmarknet.price p
      JOIN 
        agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
      JOIN 
        agmarknet.master_district md ON md.district_id = tsd.district_id
        JOIN
        agmarknet.master_states ms on ms.state_id = tsd.state_id
        JOIN
        agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
      WHERE 
        p.commodity_id = ${Number(commodity_id)} 
        AND tsd.state_id = ${Number(state_id)}
        AND p.date >= ${new Date(start_date)}
        AND p.date <= ${new Date(end_date)}
      GROUP BY 
        p.date, p.district_id, md.district_name
      ORDER BY 
        ModalPrice DESC;
      `;
    }

    // Daily India-Level Data
    else if (calculation_type === "daily" && state_id==="0") {
      PriceQuery = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(p.date, '%Y-%m-%d') AS date, ms.state_id, 
          Round(AVG(p.modal_price),2) AS ModalPrice, 
          ms.state_name,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
                      AND p.date >= ${new Date(start_date)}
            AND p.date <= ${new Date(end_date)}
        GROUP BY 
          p.date, ms.state_id, ms.state_name
        ORDER BY 
          ModalPrice DESC
        ;
      `;
    }

    // Monthly State-Level Data
    else if (calculation_type === "monthly" &&  state_id!=="0") {
      PriceQuery = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
          p.district_id, 
          Round(AVG(p.modal_price),2) AS ModalPrice, 
          md.district_name,
          ms.state_name,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
        JOIN
          agmarknet.master_states ms on ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)}
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          month, p.district_id
        ORDER BY 
          ModalPrice DESC
        ;
      `;
    }

    // Monthly National-Level Data
    else if (calculation_type === "monthly" && state_id==="0") {
      PriceQuery = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
          ms.state_id, 
          Round(AVG(p.modal_price),2) AS ModalPrice, 
          ms.state_name,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          month, ms.state_id, ms.state_name
        ORDER BY 
          ModalPrice DESC
        ;
      `;
    }

    // Yearly State-Level Data
    else if (calculation_type === "yearly" &&  state_id==="0") {
      PriceQuery = prisma.$queryRaw`
        SELECT 
          YEAR(p.date) AS year, 
          p.district_id, 
          md.district_name, 
          Round(AVG(p.modal_price),2) AS ModalPrice,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)}
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          year, p.district_id,md.district_name, 
        ORDER BY 
          ModalPrice DESC
        ;
      `;
    }

    // Yearly National-Level Data
    else if (calculation_type === "yearly" && state_id==="0") {
      PriceQuery = prisma.$queryRaw`
        SELECT 
          YEAR(p.date) AS year, 
          ms.state_id, 
          ms.state_name, 
          Round(AVG(p.modal_price),2) AS ModalPrice,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.price p
        JOIN 
          agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = p.commodity_id
        WHERE 
          p.commodity_id = ${Number(commodity_id)} 
          AND p.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          year, ms.state_id, ms.state_name
        ORDER BY 
          ModalPrice DESC
        ;
      `;
    }

    ///// Quantity data
    // Daily State-Level Data
    if (calculation_type === "daily" && state_id!=="0") {
      QuantityQuery = prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(q.date, '%Y-%m-%d') AS date, 
        q.district_id, 
        
        Round(SUM(q.quantity),2) AS total_quantity, 
        md.district_name,
        ms.state_name,
        mc.commodity_disp_name as commodity_name
      FROM 
        agmarknet.quantity q
      JOIN 
        agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
      JOIN 
        agmarknet.master_district md ON md.district_id = tsd.district_id
        JOIN
        agmarknet.master_states ms on ms.state_id = tsd.state_id
        JOIN
        agmarknet.master_commodities mc on mc.commodity_id = q.commodity_id
      WHERE 
        q.commodity_id = ${Number(commodity_id)} 
        AND tsd.state_id = ${Number(state_id)}
        AND q.date >= ${new Date(start_date)}
        AND q.date <= ${new Date(end_date)}
      GROUP BY 
        q.date, q.district_id
      ORDER BY 
        total_quantity DESC;
      `;
    }

    // Daily India-Level Data
    else if (calculation_type === "daily" && state_id==="0") {
      QuantityQuery = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(q.date, '%Y-%m-%d') AS date, ms.state_id, 
          Round(SUM(q.quantity),2) AS total_quantity, 
          ms.state_name,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.quantity q
        JOIN 
          agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = q.commodity_id
        WHERE 
          q.commodity_id = ${Number(commodity_id)} 
                      AND q.date >= ${new Date(start_date)}
            AND q.date <= ${new Date(end_date)}
        GROUP BY 
          q.date, ms.state_id
        ORDER BY 
          total_quantity DESC
        ;
      `;
    }

    // Monthly State-Level Data
    else if (calculation_type === "monthly" &&  state_id!=="0") {
      QuantityQuery = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(q.date, '%Y-%m-01') AS month, 
          q.district_id, 
          Round(SUM(q.quantity),2) AS total_quantity,
          md.district_name,
          ms.state_name,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.quantity q
        JOIN 
          agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
        JOIN
          agmarknet.master_states ms on ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = q.commodity_id
        WHERE 
          q.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)}
          AND q.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          month, q.district_id
        ORDER BY 
          total_quantity DESC
        ;
      `;
    }

    // Monthly National-Level Data
    else if (calculation_type === "monthly" && state_id==="0") {
      QuantityQuery = prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(q.date, '%Y-%m-01') AS month, 
          ms.state_id, 
          Round(SUM(q.quantity),2) AS total_quantity,
          ms.state_name,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.quantity q
        JOIN 
          agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = q.commodity_id
        WHERE 
          q.commodity_id = ${Number(commodity_id)} 
          AND q.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          month, ms.state_id
        ORDER BY 
          total_quantity DESC
        ;
      `;
    }

    // Yearly State-Level Data
    else if (calculation_type === "yearly" &&  state_id==="0") {
      QuantityQuery = prisma.$queryRaw`
        SELECT 
          YEAR(q.date) AS year, 
          q.district_id, 
          md.district_name, 
          Round(SUM(q.quantity),2) AS total_quantity,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.quantity q
        JOIN 
          agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
        JOIN 
          agmarknet.master_district md ON md.district_id = tsd.district_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = q.commodity_id
        WHERE 
          q.commodity_id = ${Number(commodity_id)} 
          AND tsd.state_id = ${Number(state_id)}
          AND q.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          year, q.district_id,md.district_name, 
        ORDER BY 
          total_quantity DESC
        ;
      `;
    }

    // Yearly National-Level Data
    else if (calculation_type === "yearly" && state_id==="0") {
      QuantityQuery = prisma.$queryRaw`
        SELECT 
          YEAR(q.date) AS year, 
          ms.state_id, 
          ms.state_name, 
          Round(SUM(q.quantity),2) AS total_quantity,
          mc.commodity_disp_name as commodity_name
        FROM 
          agmarknet.quantity q
        JOIN 
          agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
        JOIN 
          agmarknet.master_states ms ON ms.state_id = tsd.state_id
                  JOIN
        agmarknet.master_commodities mc on mc.commodity_id = q.commodity_id
        WHERE 
          q.commodity_id = ${Number(commodity_id)} 
          AND q.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
        GROUP BY 
          year, ms.state_id, ms.state_name
        ORDER BY 
          total_quantity DESC
        ;
      `;
    }


    const priceData = PriceQuery ? await PriceQuery : [];
    const quantityData = QuantityQuery ? await QuantityQuery : [];

    return NextResponse.json({ priceData, quantityData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}