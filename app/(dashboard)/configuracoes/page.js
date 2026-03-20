"use client"
import { useState } from "react"
import { Bell, Globe, Moon, Shield } from "lucide-react"

export default function Configuracoes() {
  const [config, setConfig] = useState({
    notificacoes: true,
    darkMode: true,
    idioma: "pt-BR"
  })

  const toggleNotif = () => setConfig({...config, notificacoes: !config.notificacoes})

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-gray-400">Preferências globais do seu painel administrativo.</p>
      </div>

      <div className="grid gap-4">
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition ${config.notificacoes ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-800 text-gray-500'}`}>
              <Bell size={24} />
            </div>
            <div>
              <p className="text-white font-bold">Alertas de Estoque Crítico</p>
              <p className="text-sm text-gray-500">Notificar via navegador quando produtos esgotarem.</p>
            </div>
          </div>
          <button 
            onClick={toggleNotif}
            className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${config.notificacoes ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${config.notificacoes ? 'left-8' : 'left-1'}`}></div>
          </button>
        </div>

        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center justify-between group hover:border-green-500/30 transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-white font-bold">Localização e Idioma</p>
              <p className="text-sm text-gray-500">Ajuste formatos de data e moeda.</p>
            </div>
          </div>
          <select 
            value={config.idioma}
            onChange={(e) => setConfig({...config, idioma: e.target.value})}
            className="bg-gray-950 border border-gray-800 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="pt-BR">Português (BRL)</option>
            <option value="en-US">English (USD)</option>
            <option value="es-ES">Español (EUR)</option>
          </select>
        </div>
      </div>
    </div>
  )
}