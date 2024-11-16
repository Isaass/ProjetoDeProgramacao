import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import '../../pedidosPageStyles.css';
import '../../pedidoFormStyles.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Novo import para obter o usuário logado

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

const PedidoForm: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [rotasDisponiveis, setRotasDisponiveis] = useState<number[]>([]);
  const [quantidades, setQuantidades] = useState<{ [produtoId: number]: number }>({});
  const [rota, setRota] = useState<number | null>(null);
  const [localId, setLocalId] = useState<number | null>(null);
  const { user } = useAuth(); // Obter informações do usuário logado
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar produtos disponíveis
    const fetchProdutos = async () => {
      try {
        const response = await api.get<Produto[]>('/produtos');
        setProdutos(response.data);
      } catch (error) {
        alert('Erro ao buscar produtos');
      }
    };

    // Buscar todos os locais e definir rotas disponíveis
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

    fetchProdutos();
    fetchLocais();
  }, []);

  const handleQuantidadeChange = (produtoId: number, quantidade: string) => {
    setQuantidades((prevQuantidades) => ({
      ...prevQuantidades,
      [produtoId]: parseInt(quantidade, 10) || 0,
    }));
  };

  const handleEnviarPedido = async () => {
    try {
      if (!user) {
        alert('Usuário não autenticado');
        return;
      }

      // Validações de campos obrigatórios
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

      await api.post('/pedidos', {
        localId,
        usuarioId: user.id, // Associar automaticamente o ID do usuário logado
        rota,
        itens: pedidoItens,
      });

      alert('Pedido enviado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar pedido');
    }
  };

  const locaisFiltrados = locais.filter((local) => local.rota === rota);

  return (
    <div className="page-container">
      <div className="back-link">
        <a href="/pedidos">Voltar</a>
      </div>

      <div className="form-container">
        <h2 className="form-title">Adicionar Pedido</h2>

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
          <button onClick={handleEnviarPedido}>Enviar Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default PedidoForm;
