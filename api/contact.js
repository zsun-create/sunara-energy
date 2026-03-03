// api/contact.js
// Vercel Serverless Function — handles contact form submissions
// Messages appear in: Vercel Dashboard > Your Project > Functions > Logs

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // ✅ This logs to Vercel Dashboard > Functions > Logs
    console.log('CONTACT MESSAGE:', {
      from: `${firstName} ${lastName} <${email}>`,
      subject: subject || 'General Inquiry',
      message,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      message: 'Message received! We will respond within 1 business day.',
      success: true
    });

  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
}
