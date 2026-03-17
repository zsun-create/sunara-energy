import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, email, password, phone, dateOfBirth, address, city, zip, serviceType, startDate, plan } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Save customer info
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || '',
        date_of_birth: dateOfBirth || ''
      });

    if (customerError) throw customerError;

    // 3. Save service order
    const { error: orderError } = await supabase
      .from('service_orders')
      .insert({
        customer_id: userId,
        plan,
        address,
        city,
        zip,
        service_type: serviceType || 'new',
        start_date: startDate || '',
        status: 'pending'
      });

    if (orderError) throw orderError;

    return res.status(200).json({ success: true, userId });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
}
