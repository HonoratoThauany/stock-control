export default function Header() {
  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-gray-500">Workspace</span>
        <span className="text-gray-700">/</span>
        <span className="text-gray-200">Controle de Estoque</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-white">Admin Master</p>
          <p className="text-[10px] text-green-500 font-mono">ONLINE</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border-2 border-gray-800 flex items-center justify-center font-black text-white text-xs">
          AD
        </div>
      </div>
    </header>
  )
}