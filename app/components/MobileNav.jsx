"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Package, ShoppingCart, Building2, FileText } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { name: "Produtos", icon: Package, path: "/produtos" },
    { name: "Vendas", icon: ShoppingCart, path: "/vendas" },
    { name: "Fornecedores", icon: Building2, path: "/fornecedores" },
    { name: "Relatórios", icon: FileText, path: "/relatorios" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-2 py-3 flex justify-around items-center z-50 shadow-2xl">
      {menuItems.map((item) => {
        const ativo = pathname === item.path
        return (
          <Link 
            key={item.path} 
            href={item.path} 
            className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
          >
            <item.icon 
              size={20} 
              className={ativo ? "text-blue-500 scale-110 transition-transform" : "text-gray-400"} 
            />
            <span 
              className={`text-[9px] font-medium truncate w-full text-center ${
                ativo ? "text-blue-500" : "text-gray-400"
              }`}
            >
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}