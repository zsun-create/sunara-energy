export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { firstName, lastName, company, phone, email, bill, comments } = req.body;
  try {
    await fetch(process.env.GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, company, phone, email, bill, comments })
    });
  } catch (err) {
    console.error('Sheet error:', err);
  }
  return res.status(200).json({ result: 'success' });
}
```

---

## STEP 4 — Google Sheet setup

1. Open your Google Sheet
2. Row 1 add these headers:
```
Timestamp | First Name | Last Name | Company | Phone | Email | Monthly Bill | Comments
