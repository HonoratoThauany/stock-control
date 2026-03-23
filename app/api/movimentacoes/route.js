import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const lista = await prisma.movimentacao.findMany({
      where: { userId: Number(userId) },
      orderBy: { data: 'desc' }
    });

    return NextResponse.json(lista);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar movimentações" }, { status: 500 });
  }
}