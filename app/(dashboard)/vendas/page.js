"use client"
import { useEffect, useState } from "react"
import { ShoppingCart, Trash2, Plus, CheckCircle, Loader2, Package } from "lucide-react"

export default function Vendas() {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [selecionado, setSelecionado] = useState("")
  const [qtd, setQtd] = useState(1)
  const [carregando, setCarregando] = useState(false)

  const obterHeaders = () => {
    const userJson = localStorage.getItem("usuario_logado")
    const user = userJson ? JSON.parse(userJson) : null
    return {
      "Content-Type": "application/json",
      "x-user-id": user?.id ? String(user.id) : ""
    }
  }

  const carregarProdutos = async () => {
    try {
      const res = await fetch("/api/produtos", {
        headers: { "x-user-id": obterHeaders()["x-user-id"] }
      })
      const dados = await res.json()
      setProdutos(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setProdutos([])
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  function addCarrinho() {
    if (!selecionado) return

    const p = produtos.find(item => String(item.id) === String(selecionado))
    if (!p) return
    
    const quantidadeNoCarrinho = carrinho
      .filter(item => item.id === p.id)
      .reduce((acc, item) => acc + item.quantidadeVenda, 0)

    if (p.quantidade < (quantidadeNoCarrinho + Number(qtd))) {
      return alert("Estoque insuficiente para este produto!")
    }
    
    setCarrinho([...carrinho, { ...p, quantidadeVenda: Number(qtd), tempId: Date.now() }])
    setSelecionado("")
    setQtd(1)
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) return
    setCarregando(true)

    try {
      const res = await fetch("/api/vendas", {
        method: "POST",
        headers: obterHeaders(),
        body: JSON.stringify({ itens: carrinho })
      })

      if (res.ok) {
        alert("Venda finalizada com sucesso!")
        setCarrinho([])
        await carregarProdutos() 
        window.dispatchEvent(new Event("storage"))
      } else {
        const erro = await res.json()
        alert(erro.error || "Erro ao finalizar venda.")
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.")
    } finally {
      setCarregando(false)
    }
  }

  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidadeVenda), 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Nova Venda</h1>
        <p className="text-gray-400">Registre saídas de estoque e faturamento.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-xl">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-500" /> Selecionar Produtos
            </h2>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <select 
                className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition" 
                value={selecionado} 
                onChange={e => setSelecionado(e.target.value)}
              >
                <option value="">Escolha um produto...</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} ({p.quantidade} un) - R$ {p.preco.toFixed(2)}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1"
                  className="w-24 bg-gray-950 border border-gray-800 rounded-xl p-3 text-white text-center outline-none focus:ring-2 focus:ring-blue-600" 
                  value={qtd} 
                  onChange={e => setQtd(e.target.value)} 
                />
                <button 
                  onClick={addCarrinho} 
                  disabled={!selecionado}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-30 active:scale-95"
                >
                  <Plus />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="p-4 bg-gray-800/30 border-b border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Itens no Carrinho</h3>
            </div>
            
            <div className="divide-y divide-gray-800">
              {carrinho.length === 0 ? (
                <div className="p-12 text-center text-gray-600">
                  <ShoppingCart size={40} className="mx-auto mb-3 opacity-20" />
                  <p>O carrinho está vazio.</p>
                </div>
              ) : (
                carrinho.map(item => (
                  <div key={item.tempId} className="p-5 flex justify-between items-center hover:bg-white/5 transition">
                    <div>
                      <p className="text-white font-bold">{item.nome}</p>
                      <p className="text-blue-400 text-sm font-medium">
                        {item.quantidadeVenda}x <span className="text-gray-500">R$ {item.preco.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-white font-bold">R$ {(item.preco * item.quantidadeVenda).toFixed(2)}</p>
                      <button 
                        onClick={() => setCarrinho(carrinho.filter(i => i.tempId !== item.tempId))} 
                        className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl h-fit sticky top-24">
            <h2 className="text-gray-500 uppercase text-xs font-black tracking-widest mb-6">Resumo da Venda</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Itens</span>
                <span>{carrinho.length}</span>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                <span className="text-white font-bold">Total</span>
                <span className="text-4xl font-black text-white">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={finalizarVenda} 
              disabled={carregando || carrinho.length === 0}
              className="w-full bg-green-600 py-5 rounded-2xl font-black text-white hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:shadow-none active:scale-95"
            >
              {carregando ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <CheckCircle size={24} />
                  FINALIZAR VENDA
                </>
              )}
            </button>

            <p className="text-[10px] text-gray-600 text-center mt-6 uppercase font-bold">
              O estoque será atualizado automaticamente após a confirmação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}