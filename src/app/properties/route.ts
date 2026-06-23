import { NextRequest } from "next/server";
import { serveHtml } from "@/lib/serveHtml";

export async function GET(request: NextRequest) {
  return serveHtml("property.html");
}
