let movimentacoes = []

export async function GET() {
  return Response.json(movimentacoes)
}

export async function POST(request){

  const data = await request.json()

  const movimentacao = {
    id: Date.now(),
    produto: data.produto,
    tipo: data.tipo,
    quantidade: data.quantidade,
    data: new Date().toLocaleDateString()
  }

  movimentacoes.push(movimentacao)

  return Response.json(movimentacao)
}
