import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

    // Get customer info
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', user.id)
      .single();

    if (customerError) throw customerError;

    // Get service orders
    const { data: orders, error: ordersError } = await supabase
      .from('service_orders')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    return res.status(200).json({ customer, orders });

  } catch (err) {
    console.error('Customer fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
