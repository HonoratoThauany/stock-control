"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  
  
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    
    setTimeout(() => {
      if (email === "admin@stockpro.com" && senha === "123456") {
        router.push("/dashboard")
      } else {
        alert("Credenciais inválidas! Use admin@stockpro.com e 123456")
        setLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[400px] z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-xl shadow-blue-900/20">
            <span className="text-2xl font-black text-white italic">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StockPro</h1>
          <p className="text-gray-500 mt-2">Entre com suas credenciais para acessar.</p>
        </div>

        
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="exemplo@empresa.com"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Sua Senha</label>
                <button type="button" className="text-[10px] text-blue-500 hover:underline font-bold uppercase tracking-tighter">Esqueceu?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition" size={18} />
                <input 
                  required
                  type={mostrarSenha ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-10 pr-12 text-white outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl mt-4 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Acessar Sistema
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <div className="mt-6 text-center border-t border-gray-800 pt-6">
            <p className="text-sm text-gray-500">
              Não tem uma conta?{" "}
              <Link href="/login/registro" className="text-blue-500 hover:text-blue-400 font-bold transition">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>

        
        <p className="text-center text-gray-600 text-xs mt-8">
          StockPro Inventory Management &copy; 2026 <br/>
          Privacidade e Segurança Garantidos.
        </p>
      </div>
    </div>
  )
}