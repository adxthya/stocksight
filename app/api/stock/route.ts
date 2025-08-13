import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { error: "Stock symbol is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data["Global Quote"]) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json({
      symbol: data["Global Quote"]["01. symbol"],
      price: data["Global Quote"]["05. price"],
      change: data["Global Quote"]["09. change"],
      changePercent: data["Global Quote"]["10. change percent"],
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
