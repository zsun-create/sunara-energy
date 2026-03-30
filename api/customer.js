import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // GET — fetch customer + orders + contract URLs
  if (req.method === 'GET') {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

      const { data: customer, error: customerError } = await supabase
        .from('customers').select('*').eq('id', user.id).single();
      if (customerError) throw customerError;

      const { data: orders, error: ordersError } = await supabase
        .from('service_orders').select('*').eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      if (ordersError) throw ordersError;

      // Attach contract URL to each order if one exists
      const ordersWithContracts = orders.map(order => {
        const { data: urlData } = supabase.storage
          .from('contracts')
          .getPublicUrl(`contracts/${order.plan}.pdf`);
        return { ...order, contractUrl: urlData?.publicUrl || null };
      });

      return res.status(200).json({ customer, orders: ordersWithContracts });
    } catch (err) {
      console.error('Customer fetch error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — delete account
  if (req.method === 'DELETE') {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) return res.status(401).json({ error: 'Invalid session' });
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
