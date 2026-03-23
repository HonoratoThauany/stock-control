"use client"
import { useEffect, useState } from "react"
import Card from "../../components/ui/Card"

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([])

  async function carregar() {
    try {
      const userJson = localStorage.getItem("usuario_logado");
      const user = userJson ? JSON.parse(userJson) : null;

      const res = await fetch("/api/movimentacoes", {
        headers: {
          "x-user-id": user?.id ? String(user.id) : ""
        }
      });
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setMovimentacoes(data);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function cor(tipo) {
    return tipo === "entrada" ? "text-green-400" : "text-red-400";
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        Movimentações Recentes
      </h1>

      <Card>
        <div className="space-y-4">
          {movimentacoes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma movimentação encontrada.</p>
          ) : (
            movimentacoes.map(m => (
              <div
                key={m.id}
                className="flex justify-between items-center border-b border-gray-800 pb-3 hover:bg-white/5 transition px-2"
              >
                <div className="flex flex-col">
                  <span className="text-white font-medium">{m.produto}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(m.data).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`font-bold ${cor(m.tipo)}`}>
                    {m.tipo === "entrada" ? "+" : "-"}{m.quantidade}
                  </span>
                  <p className="text-[10px] text-gray-600 uppercase font-bold">{m.tipo}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}