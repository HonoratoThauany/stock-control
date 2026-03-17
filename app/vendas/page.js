"use client"

import { useEffect, useState } from "react"

export default function Vendas() {

  const [produtos, setProdutos] = useState([])
  const [quantidadeVenda, setQuantidadeVenda] = useState({})

  async function carregarProdutos() {
    const res = await fetch("/api/produtos")
    const data = await res.json()
    setProdutos(data)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function venderProduto(produto) {

    const quantidade = quantidadeVenda[produto.id] || 0

    if (quantidade <= 0) {
      alert("Informe a quantidade")
      return
    }

    if (quantidade > produto.quantidade) {
      alert("Estoque insuficiente")
      return
    }

    // registrar venda
    await fetch("/api/vendas", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        produto: produto.nome,
        quantidade: quantidade,
        preco: produto.preco
      })
    })

    // atualizar estoque
    await fetch("/api/produtos", {
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id: produto.id,
        valor: -quantidade
      })
    })

    // registrar movimentação
    await fetch("/api/movimentacoes", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        produto: produto.nome,
        tipo: "venda",
        quantidade: quantidade
      })
    })

    emitirNota(produto, quantidade)

    carregarProdutos()
  }

  function emitirNota(produto, quantidade){

    const total = quantidade * Number(produto.preco)

    const janela = window.open("", "", "width=600,height=700")

    janela.document.write(`
      <h2>Nota de Venda</h2>
      <p>Produto: ${produto.nome}</p>
      <p>Quantidade: ${quantidade}</p>
      <p>Preço: R$ ${produto.preco}</p>
      <p>Total: R$ ${total}</p>
      <br>
      <button onclick="window.print()">Imprimir</button>
    `)

    janela.document.close()
  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Realizar Venda
      </h1>

      {produtos.map(p => (

        <div
          key={p.id}
          className="bg-gray-800 p-4 rounded mb-3 flex gap-3 items-center"
        >

          <div className="flex-1">
            {p.nome} | Estoque: {p.quantidade}
          </div>

          <input
            type="number"
            className="w-20 p-1 rounded text-black"
            placeholder="Qtd"
            onChange={(e)=>
              setQuantidadeVenda({
                ...quantidadeVenda,
                [p.id]: Number(e.target.value)
              })
            }
          />

          <button
            className="bg-green-500 px-3 py-1 rounded"
            onClick={()=>venderProduto(p)}
          >
            Vender
          </button>

        </div>

      ))}

    </div>

  )
}
