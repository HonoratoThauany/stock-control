"use client"
import { useEffect, useState } from "react"
import { 
  FileText, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Download,
  Calendar
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function Relatorios() {
  const [dados, setDados] = useState([])
  const [filtro, setFiltro] = useState("todos") 

  async function carregar() {
    const res = await fetch("/api/movimentacoes")
    const data = await res.json()
    setDados(data)
  }

  useEffect(() => {
    carregar()
  }, [])

  const filtrados = dados
    .filter(m => filtro === "todos" ? true : m.tipo === filtro)
    .sort((a, b) => b.id - a.id)

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
    <div className="space-y-8">
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
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-xl border border-gray-700 transition text-sm font-medium"
          >
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </header>

      <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 w-fit">
        <button 
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filtro === 'todos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white'}`}
        >
          Tudo
        </button>
        <button 
          onClick={() => setFiltro("entrada")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filtro === 'entrada' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'text-gray-400 hover:text-white'}`}
        >
          Entradas
        </button>
        <button 
          onClick={() => setFiltro("saida")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filtro === 'saida' ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'text-gray-400 hover:text-white'}`}
        >
          Saídas
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Data e Hora</th>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4 text-center">Tipo</th>
              <th className="px-6 py-4 text-right">Quantidade</th>
              <th className="px-6 py-4 text-right">Status da Operação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-600 italic">
                  Nenhuma movimentação registrada no período.
                </td>
              </tr>
            ) : (
              filtrados.map(m => (
                <tr key={m.id} className="hover:bg-gray-800/30 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar size={14} className="text-gray-600" />
                      {m.data}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{m.produto}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {m.tipo === "entrada" ? (
                        <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20 text-xs font-bold uppercase">
                          <ArrowUpCircle size={14} /> Entrada
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg border border-red-400/20 text-xs font-bold uppercase">
                          <ArrowDownCircle size={14} /> Saída
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono font-bold ${m.tipo === 'entrada' ? 'text-green-500' : 'text-red-400'}`}>
                      {m.tipo === 'entrada' ? '+' : '-'}{m.quantidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded font-mono uppercase tracking-tighter">
                      Confirmado
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-500 text-xs uppercase font-bold">Total de Operações</p>
          <p className="text-xl font-bold text-white">{filtrados.length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-500 text-xs uppercase font-bold text-green-500">Volume de Entrada</p>
          <p className="text-xl font-bold text-white">
            {filtrados.filter(x => x.tipo === 'entrada').reduce((acc, curr) => acc + curr.quantidade, 0)} unidades
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-500 text-xs uppercase font-bold text-red-400">Volume de Saída</p>
          <p className="text-xl font-bold text-white">
            {filtrados.filter(x => x.tipo === 'saida').reduce((acc, curr) => acc + curr.quantidade, 0)} unidades
          </p>
        </div>
      </footer>
    </div>
  )
}