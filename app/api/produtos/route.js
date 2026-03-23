import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getUserId(request) {
  const userId = request.headers.get("x-user-id");
  return userId ? Number(userId) : null;
}

export async function GET(request) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const produtos = await prisma.produto.findMany({
      where: { userId: userId },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserId(request);
    const data = await request.json();
    
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const novoProduto = await prisma.produto.create({
      data: {
        nome: data.nome,
        categoria: data.categoria || "Geral",
        quantidade: Number(data.quantidade) || 0,
        preco: Number(data.preco) || 0,
        userId: userId
      }
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserId(request);
    const { id, quantidadeVenda } = await request.json();

    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const produtoAtual = await prisma.produto.findFirst({
      where: { id: Number(id), userId: userId }
    });

    if (!produtoAtual) {
      return NextResponse.json({ error: "Produto não encontrado ou acesso negado" }, { status: 404 });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        quantidade: produtoAtual.quantidade - Number(quantidadeVenda)
      }
    });

    return NextResponse.json(produtoAtualizado);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar estoque" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserId(request);
    const { id } = await request.json();

    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    await prisma.produto.deleteMany({
      where: { id: Number(id), userId: userId }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  }
}