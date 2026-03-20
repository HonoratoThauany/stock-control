"use client"
import { useEffect, useState } from "react"
import { Building2, Phone, User, Trash2, Plus, Loader2 } from "lucide-react"

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados do formulário
  const [nome, setNome] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [telefone, setTelefone] = useState("")

  // 1. Carregar fornecedores ao iniciar
  async function carregarFornecedores() {
    try {
      const res = await fetch("/api/fornecedores")
      const data = await res.json()
      setFornecedores(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Erro ao buscar:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarFornecedores()
  }, [])

  // 2. Função para Adicionar
  async function handleAdd(e) {
    e.preventDefault()
    if (!nome || !empresa) return alert("Preencha Nome e Empresa!")

    const novo = { nome, empresa, telefone }

    const res = await fetch("/api/fornecedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo)
    })

    if (res.ok) {
      const salvo = await res.json()
      setFornecedores([...fornecedores, salvo]) // Atualiza a lista na hora
      setNome(""); setEmpresa(""); setTelefone("") // Limpa campos
    }
  }

  // 3. Função para Excluir
  async function handleExcluir(id) {
    if (!confirm("Excluir este fornecedor?")) return

    const res = await fetch("/api/fornecedores", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })

    if (res.ok) {
      setFornecedores(fornecedores.filter(f => f.id !== id))
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Fornecedores</h1>
        <p className="text-gray-400 mt-1">Gerencie seus parceiros comerciais e contatos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Formulário de Cadastro */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit sticky top-24 shadow-xl">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Plus size={16} /> Novo Cadastro
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Contato Responsável</label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nome da Empresa</label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="Ex: Tech Distribuidora"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Telefone</label>
              <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-2 transition shadow-lg shadow-blue-900/20">
              Salvar Fornecedor
            </button>
          </form>
        </div>

        {/* Lista de Fornecedores */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : fornecedores.length === 0 ? (
            <div className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-2xl p-20 text-center">
              <p className="text-gray-500">Nenhum fornecedor cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fornecedores.map(f => (
                <div key={f.id} className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-600/30 transition-all group relative shadow-sm">
                  <button 
                    onClick={() => handleExcluir(f.id)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
                      <Building2 size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-white text-lg leading-tight">{f.empresa}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <User size={14} className="text-gray-600" /> {f.nome}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                          <Phone size={14} className="text-gray-600" /> {f.telefone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}