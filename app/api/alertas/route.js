import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const produtosBaixos = await prisma.produto.findMany({
      where: {
        userId: Number(userId),
        quantidade: { lte: 5 } 
      }
    });

    const notificacoes = produtosBaixos.map(p => ({
      id: `estoque-${p.id}`,
      tipo: 'aviso',
      titulo: 'Estoque Baixo',
      msg: `O produto "${p.nome}" tem apenas ${p.quantidade} unidades restantes.`,
      lida: false
    }));

    return NextResponse.json(notificacoes);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar alertas" }, { status: 500 });
  }
}