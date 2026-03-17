"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {

  const [produtos, setProdutos] = useState([])

  async function carregarProdutos() {
    const res = await fetch("/api/produtos")
    const data = await res.json()
    setProdutos(data)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  const totalEstoque = produtos.reduce(
    (total, p) => total + Number(p.quantidade),
    0
  )

  const estoqueBaixo = produtos.filter(
    p => p.quantidade <= 5
  ).length

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-gray-800 p-6 rounded">
          <p className="text-gray-400">Produtos</p>
          <p className="text-2xl font-bold">
            {produtos.length}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <p className="text-gray-400">Itens em estoque</p>
          <p className="text-2xl font-bold">
            {totalEstoque}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded">
          <p className="text-gray-400">Estoque baixo</p>
          <p className="text-2xl font-bold text-red-400">
            {estoqueBaixo}
          </p>
        </div>

      </div>

    </div>

  )
}
