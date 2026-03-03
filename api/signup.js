
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, address, zip } = req.body;

    if (!name || !email || !address || !zip) {
      return res.status(400).json({ message: "Missing fields" });
    }

    console.log("New Signup:", { name, email, address, zip });

    return res.status(200).json({ message: "Signup successful!" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
