import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { language } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (typeof language !== "string") {
    return res.status(400).json({ message: "Invalid language parameter" });
  }

  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const languageData = await prisma.languageData.findUnique({
      where: { id: "669c326b6d387c09e564ba9a" }, // Ensure this matches the ID used in your update logic
    });

    if (!languageData) {
      return res.status(404).json({ message: "Data not found" });
    }

    const languageValue =
      languageData[language.toLowerCase() as keyof typeof languageData];

    if (languageValue === undefined) {
      return res
        .status(400)
        .json({ message: `Language ${language} not found` });
    }

    res.status(200).json(languageValue);
  } catch (error) {
    console.error("Error fetching language data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
