import { NextResponse } from "next/server";

let movimentacoes = [];

if (!global.logMovimentacao) {
  global.logMovimentacao = (dados) => {
    movimentacoes.push({
      id: Date.now() + Math.random(),
      ...dados,
      data: new Date().toLocaleString('pt-BR')
    });
  };
}

export async function GET() {
  return NextResponse.json(movimentacoes);
}

export async function POST(req) {
  const data = await req.json();
  global.logMovimentacao(data);
  return NextResponse.json({ ok: true });
}