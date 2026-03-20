"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, User, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function Registro() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function handleRegistro(e) {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      alert("Conta criada com sucesso! Agora faça login.")
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="w-full max-w-[400px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Criar Conta</h1>
        <p className="text-gray-500 mt-2">Comece a gerenciar seu estoque hoje.</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <form onSubmit={handleRegistro} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition" size={18} />
              <input required type="text" className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition" 
                value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition" size={18} />
              <input required type="email" className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition" 
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition" size={18} />
              <input required type="password" className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition" 
                value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Cadastrar Agora"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Já tem uma conta? Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  )
}