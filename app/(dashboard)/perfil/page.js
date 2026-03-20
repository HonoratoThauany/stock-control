"use client"
import { useState, useEffect, useRef } from "react" 
import { User, Mail, Camera, Save, CheckCircle, Loader2 } from "lucide-react"

export default function Perfil() {
  const fileInputRef = useRef(null) 
  
  const [usuario, setUsuario] = useState({
    nome: "Admin Master",
    email: "admin@stockpro.com",
    bio: "Gerente de Inventário - Unidade Central",
    foto: null 
  })
  
  const [salvando, setSalvando] = useState(false)
  const [feedback, setFeedback] = useState(false)

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("perfil_usuario")
    if (dadosSalvos) setUsuario(JSON.parse(dadosSalvos))
  }, [])

  
  const handleFotoChange = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      const leitor = new FileReader()
      leitor.onloadend = () => {
        setUsuario({ ...usuario, foto: leitor.result }) 
      }
      leitor.readAsDataURL(arquivo)
    }
  }

  const handleSalvar = (e) => {
    e.preventDefault()
    setSalvando(true)
    
    setTimeout(() => {
      localStorage.setItem("perfil_usuario", JSON.stringify(usuario))
      
      
      window.dispatchEvent(new Event("storage"))
      
      setSalvando(false)
      setFeedback(true)
      setTimeout(() => setFeedback(false), 3000)
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
          <p className="text-gray-400">Gerencie suas informações e foto de perfil.</p>
        </div>
        {feedback && (
          <div className="flex items-center gap-2 text-green-500 font-bold text-sm bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20 animate-bounce">
            <CheckCircle size={16} /> Atualizado!
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex items-end gap-4">
            
            
            <div className="w-24 h-24 rounded-2xl bg-gray-800 border-4 border-gray-900 flex items-center justify-center overflow-hidden shadow-xl">
              {usuario.foto ? (
                <img src={usuario.foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-white italic">
                  {usuario.nome.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFotoChange} 
            />

            
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white border border-gray-700 transition active:scale-90"
            >
              <Camera size={18} />
            </button>
          </div>

          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome de Exibição</label>
              <input 
                type="text" 
                value={usuario.nome} 
                onChange={e => setUsuario({...usuario, nome: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail</label>
              <input 
                type="email" 
                value={usuario.email}
                onChange={e => setUsuario({...usuario, email: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition" 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bio / Cargo</label>
              <textarea 
                rows="3" 
                value={usuario.bio}
                onChange={e => setUsuario({...usuario, bio: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition" 
              />
            </div>
            <button 
              type="submit"
              disabled={salvando}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition disabled:opacity-50 min-w-[200px]"
            >
              {salvando ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Alterações</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}