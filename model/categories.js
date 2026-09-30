import db from './db.js'
import 'dotenv/config.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

  const getCategoryDetails = async (categoryId) => {
    const query = `
      SELECT category_id, name
      FROM public.category
      WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows.length > 0 ? result.rows[0] : null;
  };

  export { getAllCategories, getCategoryDetails };
