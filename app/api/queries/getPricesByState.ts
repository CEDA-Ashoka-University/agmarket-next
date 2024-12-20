import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// type StatePricesParams = {
//   commodity_id: number;
//   state_id: number;
//   start_date: string;
//   end_date: string;
//   calculation_type: 'daily' | 'monthly';
// };

export async function getPricesByState(
  commodity_id: number,
  state_id: number,
  start_date: string,
  end_date: string,
  calculation_type: string
) {
  if (calculation_type === 'monthly') {
    return prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(p.date, '%Y-%m-01') AS month, 
        tsd.state_id,
        ms.state_name,
        mc.commodity_name,
        AVG(p.modal_price) AS avg_modal_price,
        AVG(p.min_price) AS avg_min_price,
        AVG(p.max_price) AS avg_max_price,
        AVG(p.modal_price) OVER (
            PARTITION BY p.district_id 
            ORDER BY DATE_FORMAT(p.date, '%Y-%m-01')
            ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
        ) AS moving_average
      FROM agmarknet.price p
      JOIN agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
      JOIN agmarknet.master_states ms ON ms.state_id = tsd.state_id
      JOIN agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
      WHERE p.commodity_id = ${commodity_id}  
        AND tsd.state_id = ${state_id}
        AND p.date BETWEEN ${start_date} AND ${end_date}
      GROUP BY month, tsd.state_id, ms.state_name, mc.commodity_name
      ORDER BY month DESC;
    `;
  } else {
    return prisma.$queryRaw`
      SELECT 
        p.date, 
        tsd.state_id,
        ms.state_name,
        mc.commodity_name,
        AVG(p.modal_price) AS avg_modal_price,
        AVG(p.min_price) AS avg_min_price,
        AVG(p.max_price) AS avg_max_price,
        AVG(p.modal_price) OVER (
            PARTITION BY p.district_id 
            ORDER BY p.date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS moving_average
      FROM agmarknet.price p
      JOIN agmarknet.trans_state_district tsd ON p.district_id = tsd.district_id 
      JOIN agmarknet.master_states ms ON ms.state_id = tsd.state_id
      JOIN agmarknet.master_commodities mc ON mc.commodity_id = p.commodity_id
      WHERE p.commodity_id = ${commodity_id}  
        AND tsd.state_id = ${state_id}
        AND p.date BETWEEN ${start_date} AND ${end_date}
      GROUP BY p.date, tsd.state_id, ms.state_name
      ORDER BY p.date DESC;
    `;
  }
}
