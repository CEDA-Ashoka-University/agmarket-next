import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getQuantityByState(
    commodity_id: number,
    state_id: number,
    start_date: string,
    end_date: string,
    calculation_type: string
) {
    if (calculation_type === 'monthly') {
        return await prisma.$queryRaw`
            SELECT 
                DATE_FORMAT(total_data.date, '%Y-%m-01') AS month,
                total_data.state_name,
                total_data.commodity_id,
                total_data.commodity_name,
                SUM(total_data.total_quantity) AS monthly_total_quantity,
                SUM(total_data.total_quantity) OVER (
                    PARTITION BY total_data.state_id, total_data.commodity_id
                    ORDER BY DATE_FORMAT(total_data.date, '%Y-%m-01')
                    ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
                ) AS moving_total_quantity
            FROM (
                SELECT 
                    q.date,
                    q.commodity_id,
                    mc.commodity_name,
                    ms.state_name,
                    ms.state_id,
                    SUM(q.quantity) AS total_quantity
                FROM 
                    agmarknet.quantity q
                JOIN 
                    agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
                JOIN 
                    agmarknet.master_district md ON q.district_id = md.district_id
                JOIN
                    agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
                JOIN 
                    agmarknet.master_states ms ON ms.state_id = tsd.state_id
                GROUP BY 
                    q.date, ms.state_id, q.commodity_id
            ) AS total_data
            WHERE 
                total_data.state_id = ${state_id}
                AND total_data.commodity_id = ${commodity_id}
                AND total_data.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
            GROUP BY 
                month, total_data.state_name, total_data.state_id, total_data.commodity_id, total_data.commodity_name
            ORDER BY 
                month DESC;
        `;
    } else {
        return await prisma.$queryRaw`
            SELECT 
                total_data.date,
                total_data.state_name,
                total_data.commodity_id,
                total_data.commodity_name,
                total_data.total_quantity,
                SUM(total_data.total_quantity) OVER (
                    PARTITION BY total_data.state_id, total_data.commodity_id
                    ORDER BY total_data.date
                    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
                ) AS moving_total_quantity
            FROM (
                SELECT 
                    q.date,
                    q.commodity_id,
                    mc.commodity_name,
                    ms.state_name,
                    ms.state_id,
                    SUM(q.quantity) AS total_quantity
                FROM 
                    agmarknet.quantity q
                JOIN 
                    agmarknet.trans_state_district tsd ON q.district_id = tsd.district_id
                JOIN 
                    agmarknet.master_district md ON q.district_id = md.district_id
                JOIN
                    agmarknet.master_commodities mc ON q.commodity_id = mc.commodity_id
                JOIN 
                    agmarknet.master_states ms ON ms.state_id = tsd.state_id
                GROUP BY 
                    q.date, ms.state_id, q.commodity_id
            ) AS total_data
            WHERE 
                total_data.state_id = ${state_id}
                AND total_data.commodity_id = ${commodity_id}
                AND total_data.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
            ORDER BY 
                total_data.date DESC;
        `;
    }
}
