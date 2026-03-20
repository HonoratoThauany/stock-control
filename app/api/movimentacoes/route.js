import { NextResponse } from "next/server";

let movimentacoes = []; 

export async function GET() {
  return NextResponse.json(movimentacoes);
}

export async function POST(req) {
  const data = await req.json();
  const nova = {
    id: Date.now(),
    produto: data.produto,
    tipo: data.tipo, 
    quantidade: data.quantidade,
    data: new Date().toLocaleString('pt-BR') 
  };
  movimentacoes.push(nova);
  return NextResponse.json(nova);
}