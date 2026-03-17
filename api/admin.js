import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        service_orders (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ customers: data });

  } catch (err) {
    console.error('Admin fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
