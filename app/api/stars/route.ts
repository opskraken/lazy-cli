import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.github.com/repos/iammhador/lazycli");
  const data = await res.json();
  return NextResponse.json({ stars: data.stargazers_count });
}
