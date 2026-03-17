export async function GET() {

  return Response.json({
    vendasHoje: 0,
    produtosEstoqueBaixo: 0,
    valorTotalEstoque: 0
  })
}
