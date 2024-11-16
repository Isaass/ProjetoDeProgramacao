import React, { useState } from 'react';
import ListaPedidos from '../components/Pedido/ListaPedidos';
import PedidoForm from '../components/Pedido/PedidoForm';
import EditarPedido from '../components/Pedido/EditarPedido';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const PedidosPage: React.FC = () => {
  const [isAddingPedido, setIsAddingPedido] = useState(false);
  const navigate = useNavigate();

  const handleAddPedidoClick = () => {
    setIsAddingPedido(true);
    navigate('/pedidos/novo'); // Redireciona para a página de novo pedido
  };

  const handleEditPedidoClick = (id: number) => {
    navigate(`/pedidos/editar/${id}`); // Redireciona para a página de edição do pedido com o id fornecido
  };

  return (
    <div className="page-container">
      <div className="page-title">
        <h2>Gerenciamento de Pedidos</h2>
        <button className="add-button" onClick={handleAddPedidoClick}>
          Adicionar novo Pedido
        </button>
      </div>
      <Routes>
        <Route path="/" element={<ListaPedidos onEditPedido={handleEditPedidoClick} />} />
        <Route path="/novo" element={<PedidoForm />} />
        <Route path="/editar/:pedidoId" element={<EditarPedidoComponent />} />
      </Routes>
    </div>
  );
};

// Corrigindo o EditarPedidoComponent para garantir que o pedidoId seja capturado corretamente
const EditarPedidoComponent: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();

  if (!pedidoId) {
    return <div>Erro ao carregar pedido para edição. ID não encontrado.</div>;
  }

  return <EditarPedido pedidoId={parseInt(pedidoId, 10)} />;
};

export default PedidosPage;
