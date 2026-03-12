let produtos = []

export async function GET() {
  return Response.json(produtos)
}

export async function POST(request) {

  const data = await request.json()

  const produto = {
    id: produtos.length + 1,
    nome: data.nome,
    quantidade: Number(data.quantidade),
    preco: Number(data.preco)
  }

  produtos.push(produto)

  return Response.json(produto)
}

export async function DELETE(request) {

  const data = await request.json()

  produtos = produtos.filter(p => p.id !== Number(data.id))

  return Response.json({ message: "Produto removido" })
}

export async function PUT(request) {

  const data = await request.json()

  console.log("Dados recebidos:", data)

  const id = Number(data.id)

  const produto = produtos.find(p => p.id === id)

  if (!produto) {
    return Response.json({ error: "Produto não encontrado" })
  }

  // botão + e -
  if (data.valor !== undefined) {
    produto.quantidade =
      Number(produto.quantidade) + Number(data.valor)
  }

  // edição manual
  if (data.quantidade !== undefined) {
    produto.quantidade = Number(data.quantidade)
  }

  return Response.json(produto)
}
