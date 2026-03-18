import { NextResponse } from "next/server";

let vendas = [];

export async function GET() {
  return NextResponse.json(vendas);
}

export async function POST(req) {
  const { itens } = await req.json();
  
  const novaVenda = {
    id: Date.now(),
    itens,
    total: itens.reduce((t, i) => t + (i.preco * i.quantidadeVenda), 0),
    data: new Date().toISOString()
  };

  vendas.push(novaVenda);
  return NextResponse.json(novaVenda, { status: 201 });
}