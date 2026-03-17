"use client"

import { useEffect, useState } from "react"

export default function Relatorios(){

  const [movimentacoes, setMovimentacoes] = useState([])

  async function carregar(){

    const res = await fetch("/api/movimentacoes")

    const data = await res.json()

    setMovimentacoes(data)
  }

  useEffect(()=>{
    carregar()
  },[])

  return(

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Movimentações de Estoque
      </h1>

      <table className="w-full">

        <thead>
          <tr>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>

          {movimentacoes.map(m =>(

            <tr key={m.id}>

              <td>{m.produto}</td>

              <td>{m.tipo}</td>

              <td>{m.quantidade}</td>

              <td>{m.data}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}
