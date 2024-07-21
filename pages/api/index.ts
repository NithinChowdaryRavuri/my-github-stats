import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchRepoDataWithDelay = async (
  repo: { full_name: any },
  delayMs: number
) => {
  const fullName = repo.full_name;
  await delay(delayMs);
  const locResponse = await fetch(
    `https://api.codetabs.com/v1/loc?github=${fullName}`
  );

  if (!locResponse.ok) {
    console.error(
      `Error fetching LOC data for repo ${fullName}:`,
      locResponse.statusText
    );
    return {
      repo: fullName,
      locData: null,
      error: locResponse.statusText,
    };
  }

  try {
    const locData = await locResponse.json();
    return {
      repo: fullName,
      locData,
    };
  } catch (error) {
    console.error(`Error parsing JSON for repo ${fullName}:`, error);
    return {
      repo: fullName,
      locData: null,
      error: "Failed to parse LOC data",
    };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Fetch data from GitHub API for username NithinChowdaryRavuri
  const response = await fetch(
    "https://api.github.com/users/NithinChowdaryRavuri/repos"
  );
  const repos = await response.json();

  if (!Array.isArray(repos)) {
    throw new Error("Unexpected response format");
  }

  // Collect data from the second API for each repository with delay
  const allRepoData = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    try {
      const data = await fetchRepoDataWithDelay(repo, 6000);
      allRepoData.push(data);
    } catch (error) {
      console.error(`Error fetching data for repo ${repo.full_name}:`, error);
    }
  }

  // Initialize language counts
  const languageCounts = {
    java: 0,
    python: 0,
    javascript: 0,
    typescript: 0,
    html: 0,
    css: 0,
    sql: 0,
    total: 0,
  };

  // Aggregate language counts from all repositories
  allRepoData.forEach((repoData) => {
    if (repoData.locData) {
      repoData.locData.forEach(
        (loc: { language: string; linesOfCode: number }) => {
          switch (loc.language.toLowerCase()) {
            case "java":
              languageCounts.java += loc.linesOfCode;
              break;
            case "python":
              languageCounts.python += loc.linesOfCode;
              break;
            case "javascript":
              languageCounts.javascript += loc.linesOfCode;
              break;
            case "jsx":
              languageCounts.javascript += loc.linesOfCode;
              break;
            case "typescript":
              languageCounts.typescript += loc.linesOfCode;
              break;
            case "html":
              languageCounts.html += loc.linesOfCode;
              break;
            case "css":
              languageCounts.css += loc.linesOfCode;
              break;
            case "sql":
              languageCounts.sql += loc.linesOfCode;
              break;
            default:
              break;
          }
        }
      );
    }
  });

  // Calculate the total count
  languageCounts.total =
    languageCounts.java +
    languageCounts.python +
    languageCounts.javascript +
    languageCounts.typescript +
    languageCounts.html +
    languageCounts.css +
    languageCounts.sql;

  // Update the single document in the LanguageData collection
  await prisma.languageData.upsert({
    where: { id: "669c326b6d387c09e564ba9a" }, // This id should be consistent
    update: languageCounts,
    create: {
      id: "669c326b6d387c09e564ba9a", // Same id as in the where clause
      ...languageCounts,
    },
  });

  // Respond with the collected data
  res.status(200);
}
