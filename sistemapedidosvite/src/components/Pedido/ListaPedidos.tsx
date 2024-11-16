import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import '../../ListaPedidosStyles.css'; 
import { Usuario } from '../Usuario/ListaUsuaros';
import * as XLSX from 'xlsx';  // Biblioteca para manipular arquivos Excel
import { useNavigate } from 'react-router-dom';

interface Pedido {
  id: number;
  localId: string;
  data: string;
  rota: number;
  usuarioId: string;
  nomeUsuario?: string;
  nomeLocal?: string;
  endereco?: string; // Novo campo para armazenar o endereço do pedido
  itens?: { produtoId: number; nomeProduto: string; quantidade: number }[]; // Novo campo para armazenar os itens do pedido
}

interface Local {
  id: string;
  nome: string;
  rota: number;
}

const ListaPedidos: React.FC<{ onEditPedido: (id: number) => void }> = ({ onEditPedido }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [rotas, setRotas] = useState<string[]>(['Todas as Rotas']);
  const [usuarios, setUsuarios] = useState<string[]>(['Todos os Usuários']);
  const [rotaFilter, setRotaFilter] = useState('Todas as Rotas');
  const [usuarioFilter, setUsuarioFilter] = useState('Todos os Usuários');
  const [selectedPedidos, setSelectedPedidos] = useState<number[]>([]);
  const [detalhesPedido, setDetalhesPedido] = useState<Pedido | null>(null); // Estado para o pedido selecionado
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para abrir/fechar modal
  const navigate = useNavigate();

  // Função para buscar pedidos da API
  const fetchPedidos = async () => {
    try {
      const response = await api.get<Pedido[]>('/pedidos');
      const pedidosData = response.data;

      const pedidosComUsuarios = await Promise.all(
        pedidosData.map(async (pedido) => {
          let nomeUsuario = 'Desconhecido';
          let nomeLocal = 'Desconhecido';
          let rota = 'Desconhecida';

          try {
            const userResponse = await api.get<Usuario>(`/usuarios/${pedido.usuarioId}`);
            nomeUsuario = userResponse.data.nomeCompleto;
          } catch (error) {
            console.error(`Erro ao buscar usuário para o pedido ${pedido.id}`, error);
          }

          try {
            const localResponse = await api.get<Local>(`/locais/${pedido.localId}`);
            nomeLocal = localResponse.data.nome;
            rota = `Rota ${localResponse.data.rota}`;
          } catch (error) {
            console.error(`Erro ao buscar local para o pedido ${pedido.id}`, error);
          }

          let itens: { nomeProduto: string; produtoId: number; quantidade: number; }[] = [];
          try {
            const itensResponse = await api.get<{ produtoId: number; quantidade: number }[]>(`/pedidos/${pedido.id}/itens`);
            itens = await Promise.all(itensResponse.data.map(async (item) => {
              // Buscando o nome do produto para cada item
              try {
                const produtoResponse = await api.get<{ nome: string }>(`/produtos/${item.produtoId}`);
                return { ...item, nomeProduto: produtoResponse.data.nome };
              } catch (error) {
                console.error(`Erro ao buscar nome do produto para o item ${item.produtoId}`, error);
                return { ...item, nomeProduto: 'Produto Desconhecido' };
              }
            }));
          } catch (error) {
            console.error(`Erro ao buscar itens para o pedido ${pedido.id}`, error);
          }

          return { ...pedido, nomeUsuario, nomeLocal, rota, itens };
        })
      );

      setPedidos(pedidosComUsuarios);

      const uniqueRotas = Array.from(new Set(pedidosComUsuarios.map((pedido) => String(pedido.rota))));
      setRotas(['Todas as Rotas', ...uniqueRotas]);

      const uniqueUsuarios = Array.from(new Set(pedidosComUsuarios.map((pedido) => pedido.nomeUsuario)));
      setUsuarios(['Todos os Usuários', ...uniqueUsuarios]);
    } catch (error) {
      alert('Erro ao buscar pedidos');
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleEditPedido = (id: number) => {
    navigate(`/pedidos/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/pedidos/${id}`);
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== id));
      alert('Pedido deletado com sucesso!');
    } catch (error) {
      alert('Erro ao deletar pedido');
    }
  };

  const handleSelectPedido = (id: number) => {
    setSelectedPedidos((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((pedidoId) => pedidoId !== id) : [...prevSelected, id]
    );
  };

  const handleSelectAllPedidos = (isSelected: boolean) => {
    if (isSelected) {
      // Selecionar todos os pedidos
      const allPedidoIds = pedidos.map((pedido) => pedido.id);
      setSelectedPedidos(allPedidoIds);
    } else {
      // Desselecionar todos os pedidos
      setSelectedPedidos([]);
    }
  };

  const handleViewPedido = (pedido: Pedido) => {
    setDetalhesPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDetalhesPedido(null);
  };

  // Função para exportar um pedido individual para Excel
  const handleExportToExcel = async (pedido: Pedido) => {
    try {
      const response = await api.get<Pedido>(`/pedidos/${pedido.id}`);
      const pedidoCompleto = response.data;

      if (!pedidoCompleto.itens || pedidoCompleto.itens.length === 0) {
        alert('Nenhum item encontrado para exportar.');
        return;
      }

      const data = pedidoCompleto.itens.map(item => ({
        'Nome do Produto': item.nomeProduto,
        'Quantidade': item.quantidade,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedido');

      const fileName = `pedido_${pedido.data}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido', error);
      alert('Erro ao buscar detalhes do pedido para exportação.');
    }
  };

  // Função para exportar pedidos selecionados para Excel
  const handleExportSelectedToExcel = async () => {
    if (selectedPedidos.length === 0) {
      alert('Nenhum pedido selecionado para exportar.');
      return;
    }

    try {
      const pedidosSelecionados = await Promise.all(
        selectedPedidos.map(async (pedidoId) => {
          const response = await api.get<Pedido>(`/pedidos/${pedidoId}`);
          const pedidoCompleto = response.data;

          // Buscar nome dos produtos para cada item do pedido
          const itens = await Promise.all(
            pedidoCompleto.itens?.map(async (item) => {
              try {
                const produtoResponse = await api.get<{ nome: string }>(`/produtos/${item.produtoId}`);
                return { ...item, nomeProduto: produtoResponse.data.nome };
              } catch (error) {
                console.error(`Erro ao buscar nome do produto para o item ${item.produtoId}`, error);
                return { ...item, nomeProduto: 'Produto Desconhecido' };
              }
            }) ?? []
          );

          return { ...pedidoCompleto, itens };
        })
      );

      const data = pedidosSelecionados.flatMap(pedido => {
        if (pedido.itens && pedido.itens.length > 0) {
          return pedido.itens.map(item => ({
            'ID do Pedido': pedido.id,
            'Nome do Produto': item.nomeProduto,
            'Quantidade': item.quantidade,
          }));
        }
        return [];
      });

      if (data.length === 0) {
        alert('Nenhum item encontrado para exportar.');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Selecionados');

      const fileName = `pedidos_selecionados.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Erro ao buscar detalhes dos pedidos selecionados', error);
      alert('Erro ao buscar detalhes dos pedidos para exportação.');
    }
  };

  const filteredPedidos = pedidos.filter(
    (pedido) =>
      (rotaFilter === 'Todas as Rotas' || String(pedido.rota) === rotaFilter) &&
      (usuarioFilter === 'Todos os Usuários' || pedido.nomeUsuario === usuarioFilter)
  );

  return (
    <div className="pedidos-container">
      <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <div className="filters">
        <div className="filter">
          <label>Filtrar por Rota</label>
          <select value={rotaFilter} onChange={(e) => setRotaFilter(e.target.value)}>
            {rotas.map((rota, index) => (
              <option key={index} value={rota}>
                {rota}
              </option>
            ))}
          </select>
        </div>
        <div className="filter">
          <label>Filtrar por Usuário</label>
          <select value={usuarioFilter} onChange={(e) => setUsuarioFilter(e.target.value)}>
            {usuarios.map((usuario, index) => (
              <option key={index} value={usuario}>
                {usuario}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions">
        <button className="planilha-button" onClick={handleExportSelectedToExcel}>
          Exportar Excel 📊
        </button>
      </div>

      <table className="pedido-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => handleSelectAllPedidos(e.target.checked)}
                checked={selectedPedidos.length === pedidos.length && pedidos.length > 0}
              />
            </th>
            <th>ID</th>
            <th>Local</th>
            <th>Data</th>
            <th>Rota</th>
            <th>Usuário</th>
            <th>Ver</th>
            <th>Editar</th>
            <th>Deletar</th>
            <th>Excel</th>
          </tr>
        </thead>
        <tbody>
          {filteredPedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedPedidos.includes(pedido.id)}
                  onChange={() => handleSelectPedido(pedido.id)}
                />
              </td>
              <td>{pedido.id}</td>
              <td>{pedido.nomeLocal}</td>
              <td>{pedido.data}</td>
              <td>{pedido.rota}</td>
              <td>{pedido.nomeUsuario}</td>
              <td>
                <button className="action-button view-button" onClick={() => handleViewPedido(pedido)}>
                  👁️
                </button>
              </td>
              <td>
                <button className="action-button edit-button" onClick={() => onEditPedido(pedido.id)}>
                  ✏️
                </button>
              </td>
              <td>
                <button className="action-button delete-button" onClick={() => handleDelete(pedido.id)}>
                  🗑️
                </button>
              </td>
              <td>
                <button className="action-button excel-button" onClick={() => handleExportToExcel(pedido)}>
                  📊
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && detalhesPedido && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h3>Detalhes do Pedido</h3>
            <p><strong>Número do Pedido:</strong> {detalhesPedido.id}</p>
            <p><strong>Local:</strong> {detalhesPedido.nomeLocal}</p>
            <p><strong>Endereço:</strong> {detalhesPedido.endereco}</p>
            <p><strong>Data do Pedido:</strong> {detalhesPedido.data}</p>
            <p><strong>Rota:</strong> {detalhesPedido.rota}</p>
            <p><strong>Cabo de Turma:</strong> {detalhesPedido.nomeUsuario}</p>
            <h4>Itens do Pedido:</h4>
            <table>
              <thead>
                <tr>
                  <th>Nome do Produto</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {detalhesPedido.itens?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nomeProduto}</td>
                    <td>{item.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaPedidos;
