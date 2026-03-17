import Link from "next/link"

export default function Sidebar() {

  return (

    <aside className="w-64 bg-gray-800 min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        StockControl
      </h2>

      <nav className="flex flex-col gap-4">

        <Link href="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link href="/produtos" className="hover:text-blue-400">
          Produtos
        </Link>

        <Link href="/vendas" className="hover:text-blue-400">
          Vendas
        </Link>

        <Link href="/relatorios" className="hover:text-blue-400">
          Relatórios
        </Link>

      </nav>

    </aside>

  )
}
