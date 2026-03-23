import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const movimentacoes = await prisma.movimentacao.findMany({
      where: { userId: Number(userId) },
      orderBy: { data: 'desc' }
    });

    const formatadas = movimentacoes.map(m => ({
      ...m,
      data: new Date(m.data).toLocaleString('pt-BR')
    }));

    return NextResponse.json(formatadas);
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}