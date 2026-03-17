"use client"

import { useEffect, useState } from "react"

export default function Produtos(){

  const [produtos,setProdutos] = useState([])
  const [nome,setNome] = useState("")
  const [quantidade,setQuantidade] = useState("")
  const [preco,setPreco] = useState("")
  const [categoria,setCategoria] = useState("")
  const [busca,setBusca] = useState("")


  async function carregar(){

    const res = await fetch("/api/produtos")
    const data = await res.json()

    setProdutos(data)
  }

  useEffect(()=>{
    carregar()
  },[])

  async function adicionar(){

    if(!nome) return alert("Informe o produto")

    await fetch("/api/produtos",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        nome,
        categoria,
        quantidade:Number(quantidade),
        preco:Number(preco)
      })
    })

    setNome("")
    setQuantidade("")
    setPreco("")
    setCategoria("")

    carregar()
  }

  async function excluir(id){

    await fetch("/api/produtos",{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({id})
    })

    carregar()
  }

  function corEstoque(qtd){

    if(qtd === 0) return "text-red-500"

    if(qtd <= 5) return "text-yellow-400"

    return "text-green-400"
  }

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    )

    const valorTotalEstoque = produtos.reduce((total,p)=>{
    return total + (p.quantidade * p.preco)
    },0)


  return(

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Produtos
      </h1>

       <div className="bg-green-600 p-3 rounded mb-4">
         Valor total em estoque: <b>R$ {valorTotalEstoque.toFixed(2)}</b>
        </div>

        <input
            className="p-2 mb-4 w-full text-black rounded"
            placeholder="🔎 Buscar produto..."
            value={busca}
            onChange={e=>setBusca(e.target.value)}
        />



      <div className="bg-gray-800 p-4 rounded mb-6 flex gap-3">

        <input
          className="p-2 rounded text-black"
          placeholder="Produto"
          value={nome}
          onChange={e=>setNome(e.target.value)}
        />

        <input
            className="p-2 rounded text-black"
            placeholder="Categoria"
            value={categoria}
            onChange={e=>setCategoria(e.target.value)}
        />


        <input
          className="p-2 rounded text-black w-28"
          placeholder="Qtd"
          type="number"
          value={quantidade}
          onChange={e=>setQuantidade(e.target.value)}
        />

        <input
          className="p-2 rounded text-black w-32"
          placeholder="Preço"
          type="number"
          step="0.01"
          value={preco}
          onChange={e=>setPreco(e.target.value)}
        />

        <button
          className="bg-blue-500 px-4 py-2 rounded"
          onClick={adicionar}
        >
          Adicionar
        </button>

      </div>

      

      <table className="w-full bg-gray-900 rounded">

        <thead className="bg-gray-700">

          <tr>

            <th className="p-3 text-left">Produto</th>
            <th className="p-3 text-left">Categoria</th>
            <th className="p-3 text-left">Quantidade</th>
            <th className="p-3 text-left">Preço</th>
            <th className="p-3 text-left">Valor total</th>
            <th className="p-3 text-left">Ações</th>

          </tr>

        </thead>

        <tbody>

          {produtosFiltrados.map(p=>(

            <tr
                key={p.id}
                className="border-b border-gray-700"
            >

                <td className="p-3">{p.nome}</td>

                <td className="p-3">{p.categoria}</td>

                <td className={`p-3 ${corEstoque(p.quantidade)}`}>
                    {p.quantidade}
                </td>

                <td className="p-3">
                    R$ {Number(p.preco).toFixed(2)}
                </td>

                <td className="p-3">
                    R$ {(p.quantidade * p.preco).toFixed(2)}
                </td>

                <td className="p-3 flex gap-2">

                    <button
                        className="bg-red-500 px-3 py-1 rounded"
                        onClick={()=>excluir(p.id)}
                        >
                        Excluir
                    </button>

                </td>

            </tr>


          ))}

        </tbody>

      </table>

    </div>
  )
}
