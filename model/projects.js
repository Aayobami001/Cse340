import db from './db.js'
import 'dotenv/config.js'

const getAllProjects = async() => {
    const query = `
        SELECT service_project_id, title, description, location, date_begin
      FROM public.service_project;
    `;

    const result = await db.query(query);

    return result.rows;
}

export { getAllProjects}  
