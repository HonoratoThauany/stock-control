let produtos = []

export async function GET() {
  return Response.json(produtos)
}

export async function POST(request){

  const data = await request.json()

  const novoProduto = {
    id: Date.now(),
    nome: data.nome,
    categoria: data.categoria || "Sem categoria",
    quantidade: Number(data.quantidade),
    preco: Number(data.preco)
  }

  produtos.push(novoProduto)

  return Response.json(novoProduto)
}

export async function DELETE(request){

  const data = await request.json()

  produtos = produtos.filter(p => p.id !== data.id)

  return Response.json({ ok:true })
}
