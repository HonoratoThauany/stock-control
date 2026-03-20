export const atualizarNotificacoesEstoque = () => {
  
  const produtos = JSON.parse(localStorage.getItem("estoque_produtos") || "[]");
  
  
  const novosAlertas = produtos
    .filter(p => Number(p.quantidade) <= 5)
    .map(p => ({
      id: `estoque-${p.id}`,
      titulo: "Estoque Crítico",
      msg: `${p.nome} tem apenas ${p.quantidade} unidades!`,
      tipo: "erro",
      lida: false,
      data: new Date().toISOString()
    }));

  
  localStorage.setItem("notificacoes_reais", JSON.stringify(novosAlertas));
  
  
  window.dispatchEvent(new Event("storage"));
};