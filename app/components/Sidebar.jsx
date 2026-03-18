"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, FileText, Building2, LayoutGrid } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { name: "Produtos", icon: Package, path: "/produtos" },
    { name: "Vendas", icon: ShoppingCart, path: "/vendas" },
    { name: "Fornecedores", icon: Building2, path: "/fornecedores" },
    { name: "Relatórios", icon: FileText, path: "/relatorios" },
  ]

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
        <span className="font-bold text-xl tracking-tight text-white">StockPro</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => {
          const ativo = pathname === item.path
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                ativo 
                  ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} className={ativo ? "text-blue-500" : "group-hover:text-white"} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-gray-800">
        <p className="text-xs text-gray-500 font-mono text-center">v2.0.4 • Enterprise Edition</p>
      </div>
    </aside>
  )
}