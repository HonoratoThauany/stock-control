import { NextResponse } from "next/server";


let produtos = [];

export async function GET() {
  return NextResponse.json(produtos);
}

export async function POST(request) {
  const data = await request.json();
  const novoProduto = {
    id: Date.now(),
    nome: data.nome,
    categoria: data.categoria || "Geral",
    quantidade: Number(data.quantidade) || 0,
    preco: Number(data.preco) || 0
  };
  produtos.push(novoProduto);
  return NextResponse.json(novoProduto, { status: 201 });
}

export async function PUT(request) {
  const { id, quantidadeVenda } = await request.json();
  const index = produtos.findIndex(p => p.id == id);
  if (index !== -1) {
    produtos[index].quantidade -= quantidadeVenda;
    return NextResponse.json(produtos[index]);
  }
  return NextResponse.json({ erro: "Produto não encontrado" }, { status: 404 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  produtos = produtos.filter(p => p.id !== id);
  return NextResponse.json({ ok: true });
}