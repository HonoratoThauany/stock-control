import { NextResponse } from "next/server";

let fornecedores = [];

export async function GET() {
  return NextResponse.json(fornecedores);
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.empresa || !data.nome) {
      return NextResponse.json({ erro: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const novoFornecedor = {
      id: Date.now(),
      nome: data.nome,
      empresa: data.empresa,
      telefone: data.telefone || "Não informado"
    };

    fornecedores.push(novoFornecedor);
    return NextResponse.json(novoFornecedor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao processar requisição" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    fornecedores = fornecedores.filter(f => f.id !== id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao excluir" }, { status: 500 });
  }
}