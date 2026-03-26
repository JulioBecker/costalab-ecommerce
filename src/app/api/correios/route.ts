import { NextResponse } from "next/server";
import { calcularPrecoPrazo } from "correios-brasil";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cepDestino } = body;
    const cepOrigem = "89218112"; // User provided CEP

    if (!cepDestino) {
      return NextResponse.json({ error: "CEP destino é obrigatório" }, { status: 400 });
    }

    const argsPAC = {
      sCepOrigem: cepOrigem,
      sCepDestino: cepDestino.replace(/\D/g, ""),
      nVlPeso: "1",      // mock weight
      nCdFormato: "1",   // 1 format box/package
      nVlComprimento: "20",
      nVlAltura: "20",
      nVlLargura: "20",
      nCdServico: ["04510", "04014"], // PAC and SEDEX
      nVlDiametro: "0",
    };

    const response = await calcularPrecoPrazo(argsPAC as any);
    
    // response is an array of services [PAC, SEDEX]
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Erro calcular frete:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
