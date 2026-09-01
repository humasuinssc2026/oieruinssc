const { getDBConnection } = require('./config/db');

async function seedReviews() {
  let db;
  try {
    db = await getDBConnection();
    const [materials] = await db.query('SELECT id FROM materials LIMIT 1');
    if (materials.length > 0) {
      const materialId = materials[0].id;
      await db.query(`
        INSERT INTO reviews (material_id, user_name, rating, comment) VALUES
        (?, 'Siti Aminah', 5, 'Materi sangat jelas dan sangat membantu!'),
        (?, 'Budi Santoso', 4, 'Bagus, tetapi mungkin suaranya kurang keras.')
      `, [materialId, materialId]);
      console.log('Seeded reviews for material_id:', materialId);
    } else {
      console.log('No materials found. Skipping seed.');
    }
  } catch (error) {
    console.error('Failed to seed:', error);
  } finally {
    if (db) process.exit(0);
  }
}

seedReviews();
