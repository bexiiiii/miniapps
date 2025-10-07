import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import kk from "~/dictionaries/kk.json";
import ru from "~/dictionaries/ru.json";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "kk";

  const dictionaries: Record<string, any> = {
    kk,
    ru,
  };

  const dict = dictionaries[locale] || dictionaries.kk;

  return NextResponse.json(dict);
}
