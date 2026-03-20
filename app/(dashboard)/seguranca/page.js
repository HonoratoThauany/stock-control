"use client"
import { useState } from "react"
import { Key, ShieldAlert, CheckCircle2 } from "lucide-react"

export default function Seguranca() {
  const [senha, setSenha] = useState({ atual: "", nova: "", confirma: "" })
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  const handleUpdateSenha = (e) => {
    e.preventDefault()
    setErro("")
    setSucesso(false)

    if (senha.nova !== senha.confirma) {
      return setErro("As novas senhas não coincidem!")
    }
    if (senha.nova.length < 6) {
      return setErro("A senha deve ter no mínimo 6 caracteres.")
    }

    setSucesso(true)
    setSenha({ atual: "", nova: "", confirma: "" })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Segurança</h1>
        <p className="text-gray-400">Gerencie sua senha e proteja seu acesso.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
        <form onSubmit={handleUpdateSenha} className="p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key size={20} className="text-blue-500" /> Alterar Senha de Acesso
          </h2>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
              <ShieldAlert size={18} /> {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 size={18} /> Senha atualizada com sucesso!
            </div>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha Atual</label>
              <input 
                type="password" 
                required
                value={senha.atual}
                onChange={e => setSenha({...senha, atual: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nova Senha</label>
                <input 
                  type="password" 
                  required
                  value={senha.nova}
                  onChange={e => setSenha({...senha, nova: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  required
                  value={senha.confirma}
                  onChange={e => setSenha({...senha, confirma: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition" 
                />
              </div>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-blue-900/20">
            Atualizar Credenciais
          </button>
        </form>
      </div>
    </div>
  )
}