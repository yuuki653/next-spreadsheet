import { Cellcontent } from "@/types/spreadsheet";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

type Data = {
  // cells?: string;
  cells?: Array<Array<Cellcontent>>;
};

const PATH = "db.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // console.log("start");
  const { method } = req;

  switch (method) {
    case "GET": //永続化されている cellContents のデータを探し、あれば返すエンドポイント
      if (fs.existsSync(PATH)) {
        const content = fs.readFileSync(PATH, "utf-8");
        console.log(content);
        const data = JSON.parse(content);
        console.log(data);
        res.status(200).json(data);
      } else {
        res.status(200).json({});
      }
      break;
    case "POST": //cellContents のデータを受け取り、それを（何らかの方法で）永続化するエンドポイント
      const { cells } = req.body;
      const data = JSON.stringify({ cells });
      fs.writeFileSync(PATH, data, "utf-8");
      res.status(200).json({});
      break;
    default:
      break;
  }
}
