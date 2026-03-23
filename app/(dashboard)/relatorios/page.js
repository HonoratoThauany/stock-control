"use client"
import { useEffect, useState } from "react"
import { 
  FileText, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Download,
  Calendar,
  Loader2
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function Relatorios() {
  const [dados, setDados] = useState([]) // Inicializa sempre como array vazio
  const [filtro, setFiltro] = useState("todos") 
  const [carregando, setCarregando] = useState(true)

  // Função para carregar movimentações reais do Banco de Dados
  async function carregar() {
    setCarregando(true)
    try {
      const userJson = localStorage.getItem("usuario_logado")
      const user = userJson ? JSON.parse(userJson) : null

      const res = await fetch("/api/movimentacoes", {
        headers: {
          "x-user-id": user?.id ? String(user.id) : ""
        }
      })
      
      const data = await res.json()
      
      // TRAVA DE SEGURANÇA: Garante que 'dados' seja sempre uma lista
      if (Array.isArray(data)) {
        setDados(data)
      } else {
        setDados([])
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error)
      setDados([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  // Lógica de Filtro e Ordenação (Protegida)
  const filtrados = Array.isArray(dados) 
    ? dados
        .filter(m => filtro === "todos" ? true : m.tipo === filtro)
        .sort((a, b) => new Date(b.createdAt || b.data) - new Date(a.createdAt || a.data))
    : []

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Relatório de Movimentação de Estoque", 14, 20)
    
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28)
    doc.text(`Filtro aplicado: ${filtro.toUpperCase()}`, 14, 33)

    const colunas = ["Data e Hora", "Produto", "Tipo", "Quantidade"]
    const linhas = filtrados.map(m => [
      m.data,
      m.produto,
      m.tipo.toUpperCase(),
      `${m.tipo === 'entrada' ? '+' : '-'}${m.quantidade}`
    ])
    
    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }, 
      styles: { fontSize: 9 }
    })

    doc.save(`relatorio-estoque-${filtro}.pdf`)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-500" /> Relatórios
          </h1>
          <p className="text-gray-400 mt-1">Histórico completo de entradas e saídas do inventário.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={exportarPDF}
            disabled={filtrados.length === 0}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-xl border border-gray-700 transition text-sm font-medium disabled:opacity-50"
          >
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 w-fit">
        {["todos", "entrada", "saida"].map((f) => (
          <button 
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
              filtro === f 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {f === "todos" ? "Tudo" : f + "s"}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Data e Hora</th>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4 text-center">Tipo</th>
              <th className="px-6 py-4 text-right">Quantidade</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {carregando ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  <Loader2 className="animate-spin mx-auto mb-2" /> Carregando histórico...
                </td>
              </tr>
            ) : filtrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-600 italic">
                  Nenhuma movimentação encontrada para o filtro selecionado.
                </td>
              </tr>
            ) : (
              filtrados.map(m => (
                <tr key={m.id} className="hover:bg-gray-800/30 transition group">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-600" />
                      {m.data}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{m.produto}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase ${
                        m.tipo === "entrada" 
                          ? "text-green-500 bg-green-500/10 border-green-500/20" 
                          : "text-red-400 bg-red-400/10 border-red-400/20"
                      }`}>
                        {m.tipo === "entrada" ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        {m.tipo}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${m.tipo === 'entrada' ? 'text-green-500' : 'text-red-400'}`}>
                    {m.tipo === 'entrada' ? '+' : '-'}{m.quantidade}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded font-mono uppercase">Confirmado</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resumo Final */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total de Operações</p>
          <p className="text-2xl font-bold text-white">{filtrados.length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-500 text-xs uppercase font-bold text-green-500 mb-1">Volume de Entradas</p>
          <p className="text-2xl font-bold text-white">
            {filtrados.filter(x => x.tipo === 'entrada').reduce((acc, curr) => acc + curr.quantidade, 0)} un
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-500 text-xs uppercase font-bold text-red-400 mb-1">Volume de Saídas</p>
          <p className="text-2xl font-bold text-white">
            {filtrados.filter(x => x.tipo === 'saida').reduce((acc, curr) => acc + curr.quantidade, 0)} un
          </p>
        </div>
      </footer>
    </div>
  )
}