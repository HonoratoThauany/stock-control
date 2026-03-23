"use client"
import { useEffect, useState } from "react"
import { Search, Plus, Trash2, X, Loader2 } from "lucide-react"

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [preco, setPreco] = useState("")

  const obterHeaders = () => {
    const usuarioSalvo = localStorage.getItem("usuario_logado")
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null
    return {
      "Content-Type": "application/json",
      "x-user-id": usuario?.id ? String(usuario.id) : ""
    }
  }

  const buscarProdutos = async () => {
    setCarregando(true)
    try {
      const res = await fetch("/api/produtos", {
        headers: obterHeaders()
      })
      const data = await res.json()
      if (!data.error) setProdutos(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarProdutos()
  }, [])

  async function handleAdicionar(e) {
    e.preventDefault();

    const novo = {
      nome,
      categoria: categoria || "Geral",
      quantidade: Number(quantidade),
      preco: Number(preco)
    };

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: obterHeaders(),
      body: JSON.stringify(novo)
    });

    if (res.ok) {
      await fetch("/api/movimentacoes", {
        method: "POST",
        headers: obterHeaders(),
        body: JSON.stringify({
          produto: nome,
          tipo: "entrada",
          quantidade: Number(quantidade)
        })
      }).catch(() => console.log("API de movimentações ainda não configurada."));

      await buscarProdutos(); 
      setModalAberto(false);
      
      setNome(""); setCategoria(""); setQuantidade(""); setPreco("");
    } else {
      const erro = await res.json()
      alert(erro.error || "Erro ao salvar produto")
    }
  }

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    const res = await fetch("/api/produtos", {
      method: "DELETE",
      headers: obterHeaders(),
      body: JSON.stringify({ id })
    })

    if (res.ok) {
      setProdutos(produtos.filter(p => p.id !== id)) 
    }
  }

  const filtered = produtos.filter(p => 
    p.nome?.toLowerCase().includes(busca.toLowerCase()) || 
    p.categoria?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventário Individual</h1>
          <p className="text-gray-400">Gerencie apenas os seus itens salvos no banco.</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
          <Search className="text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Buscar nos meus produtos..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600 text-sm"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Qtd.</th>
                <th className="px-6 py-4 text-right">Preço Un.</th>
                <th className="px-6 py-4 text-right">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {carregando ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} /> Sincronizando seu estoque...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">Você ainda não tem produtos cadastrados.</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-800/30 transition group">
                    <td className="px-6 py-4 font-medium text-white">{p.nome}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{p.categoria}</td>
                    <td className="px-6 py-4 text-center text-sm font-mono">{p.quantidade}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">R$ {Number(p.preco).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      {p.quantidade <= 5 ? (
                        <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20">Crítico</span>
                      ) : (
                        <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleExcluir(p.id)}
                        className="text-gray-500 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Novo Produto</h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdicionar} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto</label>
                <input required className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                       value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                <input className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                       value={categoria} onChange={e => setCategoria(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantidade</label>
                  <input required type="number" className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                         value={quantidade} onChange={e => setQuantidade(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço Un.</label>
                  <input required type="number" step="0.01" className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                         value={preco} onChange={e => setPreco(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 transition active:scale-95">
                Salvar no Meu Estoque
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}