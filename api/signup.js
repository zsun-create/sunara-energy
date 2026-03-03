// api/signup.js
// Vercel Serverless Function — handles signup form submissions
// Signups appear in: Vercel Dashboard > Your Project > Functions > Logs

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { firstName, lastName, email, phone, address, city, zip, plan } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !city || !zip || !plan) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!/^\d{5}$/.test(zip)) {
      return res.status(400).json({ message: 'Invalid ZIP code' });
    }

    // ✅ This logs to Vercel Dashboard > Functions > Logs
    console.log('NEW SUNARA SIGNUP:', {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      address: `${address}, ${city}, TX ${zip}`,
      plan,
      timestamp: new Date().toISOString()
    });

    // =============================================
    // ADD MONGODB LATER — uncomment when ready:
    //
    // const { MongoClient } = await import('mongodb');
    // const client = new MongoClient(process.env.MONGODB_URI);
    // await client.connect();
    // const db = client.db('sunara');
    // await db.collection('signups').insertOne({
    //   firstName, lastName, email, phone, address, city, zip, plan,
    //   createdAt: new Date()
    // });
    // await client.close();
    // =============================================

    return res.status(200).json({
      message: 'Application received! We will contact you within 1 hour.',
      success: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error. Please call (800) 555-1234.' });
  }
}
