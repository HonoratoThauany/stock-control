"use client"
import { useState, useEffect } from "react" 
import { useRouter } from "next/navigation" 
import { 
  ChevronDown, User, Settings, LogOut, Bell,
  Package, AlertTriangle, CheckCircle, X
} from "lucide-react"

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [notificacoesAberto, setNotificacoesAberto] = useState(false)
  const [notificacoes, setNotificacoes] = useState([])
  const router = useRouter() 
  
  const [usuario, setUsuario] = useState({ 
    nome: "Usuário", 
    email: "",
    foto: null 
  });

  // 1. Carrega dados do LocalStorage (Instantâneo)
  const carregarDadosLocais = () => {
    try {
      const dadosSalvos = localStorage.getItem("usuario_logado");
      if (dadosSalvos) {
        const dadosParsed = JSON.parse(dadosSalvos);
        setUsuario({
          nome: dadosParsed.nome || "Usuário",
          email: dadosParsed.email || "",
          foto: dadosParsed.foto || null,
          id: dadosParsed.id
        });
      }

      const notifsSalvas = localStorage.getItem("notificacoes_reais");
      if (notifsSalvas) setNotificacoes(JSON.parse(notifsSalvas));
    } catch (error) {
      console.error("Erro ao carregar dados locais:", error);
    }
  };

  // 2. Busca Perfil atualizado no Banco
  const buscarDadosDoBanco = async () => {
    const dadosSalvos = localStorage.getItem("usuario_logado");
    if (!dadosSalvos) return;
    const user = JSON.parse(dadosSalvos);

    try {
      const response = await fetch('/api/perfil', {
        headers: { "x-user-id": String(user.id) }
      });
      const dados = await response.json();
      
      if (response.ok && !dados.error) {
        setUsuario(dados);
        localStorage.setItem("usuario_logado", JSON.stringify({ ...user, ...dados }));
      }
    } catch (error) {
      console.error("Erro ao sincronizar Perfil:", error);
    }
  };

  // 3. BUSCA ALERTAS REAIS (Estoque Baixo)
  const buscarAlertasReais = async () => {
    const dadosSalvos = localStorage.getItem("usuario_logado");
    if (!dadosSalvos) return;
    const user = JSON.parse(dadosSalvos);

    try {
      const response = await fetch('/api/alertas', {
        headers: { "x-user-id": String(user.id) }
      });
      const novosAlertas = await response.json();

      if (response.ok && Array.isArray(novosAlertas)) {
        setNotificacoes(novosAlertas);
        localStorage.setItem("notificacoes_reais", JSON.stringify(novosAlertas));
      }
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
    }
  };

  useEffect(() => {
    carregarDadosLocais();
    buscarDadosDoBanco();
    buscarAlertasReais();

    // Sincroniza quando houver mudanças no perfil ou storage
    window.addEventListener("storage", carregarDadosLocais);
    return () => window.removeEventListener("storage", carregarDadosLocais);
  }, []);

  const naoLidas = notificacoes.filter(n => !n.lida).length

  const handleSair = () => {
    localStorage.removeItem("usuario_logado");
    setMenuAberto(false);
    router.push("/login");
  };

  const navegarPara = (rota) => {
    setMenuAberto(false);
    setNotificacoesAberto(false);
    router.push(rota);
  }

  const marcarComoLida = (id) => {
    const atualizadas = notificacoes.map(n => n.id === id ? { ...n, lida: true } : n);
    setNotificacoes(atualizadas);
    localStorage.setItem("notificacoes_reais", JSON.stringify(atualizadas));
  };

  const marcarTodasComoLidas = () => {
    const atualizadas = notificacoes.map(n => ({ ...n, lida: true }));
    setNotificacoes(atualizadas);
    localStorage.setItem("notificacoes_reais", JSON.stringify(atualizadas));
  };

  return (
    <>
      {(menuAberto || notificacoesAberto) && (
        <div className="fixed inset-0 z-30 bg-transparent" onClick={() => { setMenuAberto(false); setNotificacoesAberto(false); }} />
      )}

      <header className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
        
        <div className="flex items-center gap-2 text-sm font-medium">
          <span onClick={() => router.push("/dashboard")} className="text-gray-500 hover:text-gray-300 cursor-pointer transition">Workspace</span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-200">Controle de Estoque</span>
        </div>

        <div className="flex items-center gap-5">
          
          {/* SINO DE NOTIFICAÇÕES */}
          <div className="relative">
            <button 
              onClick={() => { setNotificacoesAberto(!notificacoesAberto); setMenuAberto(false); }}
              className={`transition relative p-2 rounded-full hover:bg-gray-800 z-50 ${notificacoesAberto ? 'text-white bg-gray-800' : 'text-gray-500'}`}
            >
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-[10px] font-bold text-white rounded-full border-2 border-gray-950 flex items-center justify-center animate-pulse">
                  {naoLidas}
                </span>
              )}
            </button>

            {notificacoesAberto && (
              <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-800 bg-gray-800/20 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Alertas de Estoque</h3>
                  {naoLidas > 0 && (
                    <button onClick={marcarTodasComoLidas} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">Ler todas</button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length > 0 ? (
                    notificacoes.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => marcarComoLida(n.id)}
                        className={`p-4 border-b border-gray-800/50 flex gap-3 cursor-pointer transition hover:bg-gray-800/40 ${!n.lida ? 'bg-blue-500/5' : ''}`}
                      >
                        <div className="mt-1">
                          {n.tipo === 'aviso' ? <AlertTriangle size={16} className="text-yellow-500" /> : <CheckCircle size={16} className="text-green-500" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-xs font-bold ${n.lida ? 'text-gray-400' : 'text-white'}`}>{n.titulo}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{n.msg}</p>
                        </div>
                        {!n.lida && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-600">
                      <p className="text-sm italic font-sans">Tudo em dia com o estoque!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-800"></div>

          {/* MENU DO USUÁRIO */}
          <div className="relative">
            <button 
              onClick={() => { setMenuAberto(!menuAberto); setNotificacoesAberto(false); }}
              className="flex items-center gap-3 group p-1 rounded-xl hover:bg-gray-900 transition active:scale-95 z-50 relative"
            >
              <div className="text-right hidden sm:block leading-tight font-sans">
                <p className="text-xs font-bold text-white">{usuario.nome}</p>
                <p className="text-[10px] text-green-500 font-mono flex items-center justify-end gap-1 uppercase tracking-tighter font-bold">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>

              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center border border-white/10 shadow-lg overflow-hidden">
                  {usuario.foto ? (
                    <img src={usuario.foto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-white">{usuario.nome?.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
              </div>
            </button>

            {menuAberto && (
              <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-800 bg-gray-800/20 text-left">
                  <p className="text-xs text-gray-400">Logado como</p>
                  <p className="text-sm font-bold text-white truncate">{usuario.email || "---"}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => navegarPara("/perfil")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition text-left">
                    <User size={16} /> Meu Perfil
                  </button>
                  <button onClick={() => navegarPara("/configuracoes")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition text-left">
                    <Settings size={16} /> Configurações
                  </button>
                </div>
                <div className="p-2 border-t border-gray-800 bg-gray-950/50">
                  <button onClick={handleSair} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition text-left font-bold">
                    <LogOut size={16} /> Sair do Sistema
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}