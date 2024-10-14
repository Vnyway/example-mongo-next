import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("ExpTrack");

      if (!ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid UserId" });
      }

      const result = await db
        .collection("Users")
        .deleteOne({ _id: new ObjectId(userId as string) });

      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({
      message: "You don't have right. Oh, you don't have right to...",
    });
  }
};

export default handler;
