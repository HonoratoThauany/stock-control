"use client"

import { useState, useEffect } from "react"

export default function Home() {

  const [produtos, setProdutos] = useState([])
  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [busca, setBusca] = useState("")
  const [vendaQuantidade, setVendaQuantidade] = useState({})
  const [preco, setPreco] = useState("")
  const [historico, setHistorico] = useState([])



  async function carregarProdutos() {
    const res = await fetch("/api/produtos")
    const data = await res.json()
    setProdutos(data)
  }

  async function adicionarProduto() {

    await fetch("/api/produtos", {
      method: "POST",
      body: JSON.stringify({
        nome,
        quantidade,
        preco
      })
    })

    setNome("")
    setQuantidade("")

    carregarProdutos()
  }
  async function removerProduto(id) {

    await fetch("/api/produtos", {
      method: "DELETE",
      body: JSON.stringify({ id })
    })

    carregarProdutos()
  }
  async function alterarQuantidade(id, valor) {

    await fetch("/api/produtos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        valor
      })
    })

    carregarProdutos()
  }

  async function atualizarQuantidade(id, novaQuantidade) {

  await fetch("/api/produtos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id,
      quantidade: novaQuantidade
    })
    })

    carregarProdutos()
  }

  function venderProduto(produto) {

    const quantidadeVenda = vendaQuantidade[produto.id] || 0

    if (quantidadeVenda <= 0) {
      alert("Informe uma quantidade para venda")
      return
    }

    if (quantidadeVenda > produto.quantidade) {
      alert("Estoque insuficiente")
      return
    }

    setHistorico([
      ...historico,
      {
      produto: produto.nome,
      quantidade: quantidadeVenda,
      total: quantidadeVenda * produto.preco,
      data: new Date().toLocaleDateString()
      }
    ])

  
    alterarQuantidade(produto.id, -quantidadeVenda)

  
    emitirNotaVenda(produto, quantidadeVenda)
  }


  function emitirNotaVenda(produto, quantidade,) {

    const total = quantidade * Number(produto.preco)

    const janela = window.open("", "", "width=600,height=700")

    janela.document.write(`
    <html>
    <head>
    <title>Nota de Venda</title>

    <style>

    body{
    font-family: Arial;
    padding:30px;
    }

    .nota{
    border:1px solid black;
    padding:20px;
    }

    .topo{
    text-align:center;
    margin-bottom:20px;
    }

    table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
    }
    

    th, td{
    border:1px solid black;
    padding:8px;
    text-align:center;
    }

    </style>

    </head>

    <body>

    <div class="nota">

    <div class="topo">
    <h2>Sistema de Estoque</h2>
    <p>Nota de Venda</p>
    <p>${new Date().toLocaleDateString()}</p>
    </div>

    <table>

    <thead>
    <tr>
    <th>Produto</th>
    <th>Quantidade</th>
    <th>Preço</th>
    <th>Total</th>
    </tr>
    </thead>

    <tbody>
    <tr>
    <td>${produto.nome}</td>
    <td>${quantidade}</td>
    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
    <td>R$ ${total.toFixed(2)}</td>
    </tr>
    </tbody>

    </table>

    <div style="margin-top:20px; text-align:right; font-size:15px;">
    Total da venda: R$ ${total.toFixed(2)}
    </div>

    <br>

    <button onclick="window.print()" 
    style="padding:5px 15px; cursor:pointer;">
    Imprimir
    </button>

    </div>

    </body>
    </html>
    `)

    janela.document.close()
  }



  useEffect(() => {
    carregarProdutos()
  }, [])

  const produtosFiltrados = produtos.filter(p =>
  p.nome.toLowerCase().includes(busca.toLowerCase())
  )


  return (
  <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
  flex justify-center items-start p-10">

    <div className="w-full max-w-2xl">

      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Controle de Estoque
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700
        p-4 rounded text-center">
          <p className="text-gray-400">Produtos</p>
          <p className="text-2xl font-bold">{produtos.length}</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700
        p-4 rounded text-center">
          <p className="text-gray-400">Itens em estoque</p>
          <p className="text-2xl font-bold">
            {produtos.reduce((total,p)=> total + Number(p.quantidade),0)}
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700
        p-4 rounded text-center">
          <p className="text-gray-400">Estoque baixo</p>
          <p className="text-2xl font-bold text-red-400">
            {produtos.filter(p => p.quantidade <= 5).length}
          </p>
        </div>

      </div>

      
      <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700
 p-6 rounded-lg mb-6">

        <h2 className="text-white text-xl mb-4">
          Adicionar Produto
        </h2>

        <div className="flex gap-2">

          <input
            className="flex-1 p-2 rounded"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="w-26 p-2 rounded"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <input
            className="w-24 p-2 rounded"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />


          <button
            className="bg-blue-500 hover:bg-blue-600 transition px-4 rounded text-white"

            onClick={adicionarProduto}
          >
            Adicionar
          </button>

        </div>

      </div>

      <div className="mb-4">

        <input
          className="w-full p-1 rounded"
          placeholder="🔎Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

      </div>

      
      <div>

        <h2 className="text-white text-xl mb-4">
          Produtos
        </h2>

        <table className="w-full text-left text-white">

  <thead className="border-b border-gray-600">
    <tr>
      <th className="p-2">Produto</th>
      <th className="p-2">Preço</th>
      <th className="p-2">Quantidade</th>
      <th className="p-2">Ações</th>
    </tr>
  </thead>

  <tbody>

    {produtosFiltrados.map(p => (

      <tr key={p.id} className="border-b border-gray-700">

        <td className="p-2 font-bold">
          {p.nome}
        </td>
        
        <td className="p-2">
          {Number(p.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        </td>

        <td className="p-2">

          <div className="flex items-center gap-2">

            <input
              type="number"
              min="0"
              className="w-20 p-1 rounded text-white"
              value={p.quantidade}
              onChange={(e) =>
                atualizarQuantidade(p.id, Number(e.target.value))
              }
            />

            {p.quantidade <= 5 && (
              <span className="text-red-400 font-bold">
                ⚠
              </span> 
            )}

          </div>

        </td>

        <td className="p-2">

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Venda"
              className="w-20 p-1 rounded text-white"
              onChange={(e) =>
                setVendaQuantidade({
                  ...vendaQuantidade,
                  [p.id]: Number(e.target.value)
                })
              }
            /> 

            <button
              className="bg-blue-500 hover:bg-blue-600 transition px-4 rounded text-white"

              onClick={() => venderProduto(p)}
            >
              Vender
            </button>

            <button
              className="bg-green-500 hover:bg-green-600 transition px-2 py-1 rounded text-white"

              onClick={() => alterarQuantidade(p.id, 1)}
            >
              +
            </button>

            <button
              className="bg-yellow-500 hover:bg-yellow-600 transition px-2 py-1 rounded text-white"

              onClick={() => alterarQuantidade(p.id, -1)}
            >
              -
            </button>



            <button
              className="bg-red-500 hover:bg-red-600 transition px-3 rounded text-white"

              onClick={() => removerProduto(p.id)}
            >
              Remover
            </button>

          </div>

        </td>

      </tr>

    ))}

  </tbody>

</table>

  </div>
    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700
    p-6 rounded-lg mt-6">

        <h2 className="text-white text-xl mb-4">
          Histórico de Vendas
        </h2>

        {historico.length === 0 ? (
          <p className="text-gray-400">
            Nenhuma venda realizada
          </p>
        ) : (
          <table className="w-full text-white">

          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Produto</th>
              <th className="p-2">Quantidade</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>

          <tbody>

            {historico.map((venda, index) => (

              <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-800 transition">


                <td className="p-2">{venda.data}</td>

                <td className="p-2">{venda.produto}</td>

                <td className="p-2">{venda.quantidade}</td>

                <td className="p-2">
                  {Number(venda.total).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>

  </div>

  </main>
)

}
