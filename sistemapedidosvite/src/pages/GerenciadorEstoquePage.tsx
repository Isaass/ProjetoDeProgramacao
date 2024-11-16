import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
}

const GerenciadorEstoquePage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        const response = await api.get<Produto[]>('/api/estoque');
        setProdutos(response.data);
      } catch (error) {
        alert('Erro ao buscar produtos do estoque');
      }
    };
    fetchEstoque();
  }, []);

  const handleEditarEstoque = (id: number) => {
    navigate(`/estoque/editar/${id}`);
  };

  return (
    <div className="estoque-page">
        <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <header className="page-header">
        <h1>Gerenciamento de Estoque</h1>
        
      </header>

      <table className="estoque-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Tipo</th>
            <th>Atualizar Estoque</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.quantidade}</td>
              <td>-</td> {/* Tipo ainda não está definido */}
              <td>
                <button className="editar-button" onClick={() => handleEditarEstoque(produto.id)}>
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciadorEstoquePage;
