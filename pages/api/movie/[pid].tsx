import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const { pid } = req.query;
    if (!pid || !ObjectId.isValid(pid as string)) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }
    const movie = pid
      ? await db
          .collection("movies")
          .find({ _id: new ObjectId(pid as string) })
          .toArray()
      : null;
    if (!movie || movie.length === 0) {
      return res.status(404).json("Movie not found");
    }
    res.json(movie);
  } catch (error) {
    console.log(error);
  }
};
