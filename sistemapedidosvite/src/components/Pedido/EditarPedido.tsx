import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import '../../pedidoFormStyles.css';

interface Produto {
  id: number;
  nome: string;
  estoque: number;
  tipo: string;
}

interface Local {
  id: number;
  nome: string;
  rota: number;
}

interface Pedido {
  id: number;
  localId: number;
  rota: number;
  status: string;
  data: string;
  itens: { produtoId: number; quantidade: number }[];
}

const EditarPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [rotasDisponiveis, setRotasDisponiveis] = useState<number[]>([]);
  const [quantidades, setQuantidades] = useState<{ [produtoId: number]: number }>({});
  const [rota, setRota] = useState<number | null>(null);
  const [localId, setLocalId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedido = async () => {
      if (!id) {
        alert('ID do pedido inválido.');
        return;
      }

      try {
        const response = await api.get<Pedido>(`/pedidos/${id}`);
        setPedido(response.data);

        // Inicializa rota, local e quantidades
        setRota(response.data.rota);
        setLocalId(response.data.localId);
        setQuantidades(
          response.data.itens.reduce(
            (acc, item) => ({ ...acc, [item.produtoId]: item.quantidade }),
            {}
          )
        );
      } catch (error) {
        console.error('Erro ao buscar pedido', error);
        alert('Erro ao buscar pedido');
      }
    };

    const fetchProdutos = async () => {
      try {
        const response = await api.get<Produto[]>('/produtos');
        setProdutos(response.data);
      } catch (error) {
        alert('Erro ao buscar produtos');
      }
    };

    const fetchLocais = async () => {
      try {
        const response = await api.get<Local[]>('/locais');
        setLocais(response.data);

        // Extraímos as rotas únicas dos locais disponíveis
        const rotas = Array.from(new Set(response.data.map((local) => local.rota)));
        setRotasDisponiveis(rotas);
      } catch (error) {
        alert('Erro ao buscar locais');
      }
    };

    fetchPedido();
    fetchProdutos();
    fetchLocais();
  }, [id]);

  const handleQuantidadeChange = (produtoId: number, quantidade: string) => {
    setQuantidades((prevQuantidades) => ({
      ...prevQuantidades,
      [produtoId]: parseInt(quantidade, 10) || 0,
    }));
  };

  const handleUpdatePedido = async () => {
    if (!pedido) {
      alert('Nenhum pedido disponível para atualização.');
      return;
    }

    if (!localId || rota === null) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const produtosSelecionados = produtos.filter((produto) => quantidades[produto.id] > 0);
    if (produtosSelecionados.length === 0) {
      alert('Por favor, insira a quantidade para pelo menos um produto.');
      return;
    }

    // Validação para verificar se as quantidades são menores ou iguais ao estoque disponível
    for (const produto of produtosSelecionados) {
      if (quantidades[produto.id] > produto.estoque) {
        alert(`A quantidade solicitada para o produto ${produto.nome} excede o estoque disponível (${produto.estoque}).`);
        return;
      }
    }

    // Criar lista de itens do pedido com o ID do produto e quantidade
    const pedidoItens = produtosSelecionados.map((produto) => ({
      produtoId: produto.id,
      quantidade: quantidades[produto.id],
    }));

    try {
      await api.put(`/pedidos/${id}`, {
        ...pedido,
        localId,
        rota,
        itens: pedidoItens,
      });

      alert('Pedido alterado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao alterar pedido', error);
      alert('Erro ao alterar pedido');
    }
  };

  const locaisFiltrados = locais.filter((local) => local.rota === rota);

  return pedido ? (
    <div className="editar-pedido-container">
      <div className="back-link">
        <a href="/pedidos">Voltar</a>
      </div>

      <div className="form-container">
        <h2>Editando Pedido ID: {pedido.id}</h2>

        <div className="select-container">
          <div className="select-group">
            <label>Selecione a Rota:</label>
            <select value={rota ?? ''} onChange={(e) => setRota(parseInt(e.target.value, 10))}>
              <option value="">Selecione uma rota...</option>
              {rotasDisponiveis.map((rota) => (
                <option key={rota} value={rota}>
                  {`Rota ${rota}`}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label>Selecione o Local:</label>
            <select value={localId ?? ''} onChange={(e) => setLocalId(parseInt(e.target.value, 10))} disabled={!rota}>
              <option value="">Selecione o local...</option>
              {locaisFiltrados.map((local) => (
                <option key={local.id} value={local.id}>
                  {local.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="produto-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Estoque Disponível</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.tipo}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={quantidades[produto.id] || ''}
                      onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                    />
                  </td>
                  <td>{produto.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="button-container">
          <button onClick={handleUpdatePedido}>Atualizar Pedido</button>
        </div>
      </div>
    </div>
  ) : (
    <p>Carregando pedido...</p>
  );
};

export default EditarPedido;
