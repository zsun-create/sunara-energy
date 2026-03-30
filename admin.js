import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET — fetch all customers
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`*, service_orders (*)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ customers: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — upload contract PDF (base64)
  if (req.method === 'POST') {
    try {
      const { plan, fileName, fileBase64 } = req.body;
      if (!plan || !fileBase64 || !fileName) {
        return res.status(400).json({ error: 'Missing plan, fileName, or fileBase64' });
      }
      const buffer = Buffer.from(fileBase64, 'base64');
      const storagePath = `contracts/${plan}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(storagePath, buffer, { contentType: 'application/pdf', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('contracts').getPublicUrl(storagePath);
      return res.status(200).json({ success: true, url: urlData.publicUrl });
    } catch (err) {
      console.error('Contract upload error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — remove contract
  if (req.method === 'DELETE') {
    try {
      const { plan } = req.body;
      if (!plan) return res.status(400).json({ error: 'Missing plan' });
      const { error } = await supabase.storage.from('contracts').remove([`contracts/${plan}.pdf`]);
      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
