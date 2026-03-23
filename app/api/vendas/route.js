import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const vendas = await prisma.venda.findMany({
      where: { userId: Number(userId) }, 
      include: { itens: true }, 
      orderBy: { data: 'desc' }
    });
    return NextResponse.json(vendas);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { itens } = await req.json();
    const valorTotal = itens.reduce((t, i) => t + (i.preco * i.quantidadeVenda), 0);

    const resultado = await prisma.$transaction(async (tx) => {
      
      const vendaCriada = await tx.venda.create({
        data: {
          total: valorTotal,
          userId: Number(userId), 
          itens: {
            create: itens.map(item => ({
              produtoNome: item.nome,
              quantidadeVenda: Number(item.quantidadeVenda),
              precoUnitario: Number(item.preco)
            }))
          }
        },
        include: { itens: true }
      });

      for (const item of itens) {
        await tx.produto.update({
          where: { 
            id: Number(item.id),
            userId: Number(userId) 
          },
          data: {
            quantidade: {
              decrement: Number(item.quantidadeVenda)
            }
          }
        });

        await tx.movimentacao.create({
          data: {
            produto: item.nome,
            tipo: "saida",
            quantidade: Number(item.quantidadeVenda),
            userId: Number(userId) 
          }
        });
      }

      return vendaCriada;
    });

    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    console.error("Erro na transação de venda:", error);
    return NextResponse.json({ error: "Erro ao processar venda" }, { status: 500 });
  }
}