"use client"
import { useEffect, useState } from "react"
import { ShoppingCart, Trash2, Plus, CheckCircle } from "lucide-react"

export default function Vendas() {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [selecionado, setSelecionado] = useState("")
  const [qtd, setQtd] = useState(1)

  useEffect(() => {
    fetch("/api/produtos").then(res => res.json()).then(setProdutos)
  }, [])

  function addCarrinho() {
    const p = produtos.find(item => item.id == selecionado)
    if (!p || p.quantidade < qtd) return alert("Estoque insuficiente!")
    
    setCarrinho([...carrinho, { ...p, quantidadeVenda: qtd, tempId: Date.now() }])
    setSelecionado(""); setQtd(1)
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) return;

    const resVenda = await fetch("/api/vendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itens: carrinho })
    });

    if (resVenda.ok) {
      for (const item of carrinho) {
      
        await fetch("/api/produtos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: item.id, 
            quantidadeVenda: item.quantidadeVenda,
            tipo: "saida" 
          })
        });

        await fetch("/api/movimentacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produto: item.nome,
            tipo: "saida",
            quantidade: item.quantidadeVenda
          })
        });
      }

      alert("Venda finalizada com sucesso!");
      setCarrinho([]);
    
      fetch("/api/produtos").then(res => res.json()).then(setProdutos);
    } else {
      alert("Erro ao finalizar venda no servidor.");
    }
  }

  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidadeVenda), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-white font-bold mb-4">Selecionar Itens</h2>
          <div className="flex gap-4">
            <select className="flex-1 bg-gray-800 border-gray-700 rounded-xl p-3 text-white" 
                    value={selecionado} onChange={e => setSelecionado(e.target.value)}>
              <option value="">Escolha um produto...</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} ({p.quantidade} un)</option>
              ))}
            </select>
            <input type="number" className="w-20 bg-gray-800 border-gray-700 rounded-xl p-3 text-white" 
                   value={qtd} onChange={e => setQtd(e.target.value)} />
            <button onClick={addCarrinho} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition">
              <Plus />
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {carrinho.map(item => (
            <div key={item.tempId} className="p-4 flex justify-between border-b border-gray-800 items-center">
              <div>
                <p className="text-white font-medium">{item.nome}</p>
                <p className="text-gray-500 text-sm">{item.quantidadeVenda}x R$ {item.preco.toFixed(2)}</p>
              </div>
              <button onClick={() => setCarrinho(carrinho.filter(i => i.tempId !== item.tempId))} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit space-y-4">
        <h2 className="text-gray-400 uppercase text-xs font-bold">Resumo</h2>
        <div className="text-3xl font-bold text-white">R$ {total.toFixed(2)}</div>
        <button onClick={finalizarVenda} className="w-full bg-green-600 py-4 rounded-xl font-bold text-white hover:bg-green-700 transition flex items-center justify-center gap-2">
          <CheckCircle size={20} /> Finalizar Venda
        </button>
      </div>
    </div>
  )
}