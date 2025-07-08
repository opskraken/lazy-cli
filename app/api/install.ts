import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "public", "install.sh");
  const fileContents = fs.readFileSync(filePath, "utf8");
  res.setHeader("Content-Type", "text/x-shellscript");
  res.status(200).send(fileContents);
}
