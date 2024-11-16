import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';
import '../../produtosPageStyles.css';

interface Produto {
  id: number;
  nome: string;
  estoque: number;
  tipo: string; // Adicionado o tipo do produto
}

const ListaProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get<Produto[]>('/produtos');
        setProdutos(response.data);
      } catch (error) {
        alert('Erro ao buscar produtos');
      }
    };
    fetchProdutos();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/produtos/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));
      alert('Produto deletado com sucesso!');
    } catch (error) {
      alert('Erro ao deletar produto');
    }
  };

  return (
    <div className="table-container">
      <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <h3>Gerenciamento de Produtos</h3>
      <table className="produto-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produtos</th>
            <th>Quantidade</th>
            <th>Tipo</th>
            <th>Editar</th>
            <th>Deletar</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.estoque}</td>
              <td>{produto.tipo.charAt(0).toUpperCase() + produto.tipo.slice(1)}</td> {/* Atualiza a coluna de tipo */}
              <td>
                <button
                  className="action-button edit"
                  onClick={() => handleEdit(produto.id)}
                >
                  ✏️
                </button>
              </td>
              <td>
                <button
                  className="action-button delete"
                  onClick={() => handleDelete(produto.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProdutos;
