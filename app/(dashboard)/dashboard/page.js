"use client"
import { useEffect, useState } from "react"
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid 
} from "recharts"
import { TrendingUp, Package, ShoppingBag, DollarSign, Loader2 } from "lucide-react"

export default function Dashboard() {
  const [dados, setDados] = useState({
    vendas: [],
    produtos: [],
    loading: true
  })

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resVendas, resProdutos] = await Promise.all([
          fetch("/api/vendas"),
          fetch("/api/produtos")
        ])
        
        const vendas = await resVendas.json()
        const produtos = await resProdutos.json()
        
        setDados({ vendas, produtos, loading: false })
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
        setDados(prev => ({ ...prev, loading: false }))
      }
    }
    carregarDados()
  }, [])

  

  
  const faturamento = dados.vendas.reduce((t, v) => t + v.total, 0)
  
  
  const totalEstoque = dados.produtos.reduce((t, p) => t + p.quantidade, 0)

  
  const totalVendidos = dados.vendas.reduce((acc, v) => {
    return acc + v.itens.reduce((sum, item) => sum + item.quantidadeVenda, 0);
  }, 0);

  const divisor = (totalVendidos + totalEstoque);
  const taxaSaidaReal = divisor > 0 ? (totalVendidos / divisor) * 100 : 0;

  
  const vendasPorDia = {}
  dados.vendas.forEach(v => {
    const dataFormatada = new Date(v.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    vendasPorDia[dataFormatada] = (vendasPorDia[dataFormatada] || 0) + v.total
  })
  const graficoLinha = Object.entries(vendasPorDia).map(([data, total]) => ({ data, total }))

  
  const graficoBarras = dados.produtos
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5) 
    .map(p => ({ nome: p.nome, qtd: p.quantidade }))

  if (dados.loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    )
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm hover:border-gray-700 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gray-800 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Visão Geral</h1>
        <p className="text-gray-400 mt-1">Bem-vindo ao centro de controle de estoque.</p>
      </header>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Faturamento" value={`R$ ${faturamento.toFixed(2)}`} icon={DollarSign} color="text-green-500" />
        <StatCard title="Total Vendas" value={dados.vendas.length} icon={ShoppingBag} color="text-blue-500" />
        <StatCard title="Itens em Estoque" value={totalEstoque.toLocaleString()} icon={Package} color="text-purple-500" />
        <StatCard title="Taxa de Saída" value={`${taxaSaidaReal.toFixed(1)}%`} icon={TrendingUp} color="text-orange-500" />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6 text-white">Fluxo de Caixa (Vendas)</h2>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graficoLinha.length > 0 ? graficoLinha : [{data: '-', total: 0}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="data" stroke="#9ca3af" tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6 text-white">Top 5 Produtos (Estoque)</h2>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graficoBarras.length > 0 ? graficoBarras : [{nome: '-', qtd: 0}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="nome" stroke="#9ca3af" tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Bar dataKey="qtd" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}