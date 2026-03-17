let vendas = []

export async function GET() {
  return Response.json(vendas)
}

export async function POST(request) {

  const data = await request.json()

  const venda = {
    id: Date.now(),
    produto: data.produto,
    quantidade: Number(data.quantidade),
    preco: Number(data.preco),
    total: data.quantidade * data.preco,
    data: new Date().toISOString()
  }

  vendas.push(venda)

  return Response.json(venda)
}
