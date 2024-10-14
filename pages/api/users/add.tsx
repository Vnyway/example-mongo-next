import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const client = await clientPromise;
      const users = client.db("ExpTrack").collection("Users");

      const result = await users.insertOne({
        username,
        email,
        password,
        accounts: [],
        transactions: [],
      });

      res.status(201).json("User has beeen added successfully");
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
