import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "ID não fornecido" }, { status: 401 });

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(userId) },
    });

    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { nome, bio, foto } = await request.json();

    const atualizado = await prisma.usuario.update({
      where: { id: Number(userId) },
      data: { nome, bio, foto },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    console.error("Erro Prisma:", error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}