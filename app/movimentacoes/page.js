"use client"

import { useEffect, useState } from "react"
import Card from "../components/ui/Card"

export default function Movimentacoes() {

  const [movimentacoes, setMovimentacoes] = useState([])

  async function carregar() {
    const res = await fetch("/api/movimentacoes")
    const data = await res.json()
    setMovimentacoes(data)
  }

  useEffect(() => {
    carregar()
  }, [])

  function cor(tipo) {
    return tipo === "entrada"
      ? "text-green-400"
      : "text-red-400"
  }

  return (

    <div className="space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">
        Movimentações
      </h1>

      <Card>

        <div className="space-y-3">

          {movimentacoes.map(m => (

            <div
              key={m.id}
              className="flex justify-between border-b border-gray-800 pb-2"
            >
              <span>{m.produto?.nome}</span>

              <span className={cor(m.tipo)}>
                {m.tipo} ({m.quantidade})
              </span>

              <span className="text-gray-400 text-sm">
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>

          ))}

        </div>

      </Card>

    </div>
  )
}
