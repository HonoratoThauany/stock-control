import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

    const { senha: _, ...dadosUsuario } = usuario;
    
    return NextResponse.json({
      message: "Login realizado com sucesso!",
      usuario: dadosUsuario
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao realizar login." }, { status: 500 });
  }
}