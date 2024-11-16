import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';

interface Produto {
  nome: string;
  quantidade: number;
}

const EditarEstoque: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto>({ nome: '', quantidade: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        // Explicitamente tipando a resposta da API
        const response = await api.get<Produto>(`/api/estoque/${id}`);
        setProduto(response.data);
      } catch (error) {
        alert('Erro ao buscar o produto');
      }
    };
    fetchProduto();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await api.put(`/api/estoque/${id}`, { quantidade: produto.quantidade });
      alert('Estoque atualizado com sucesso!');
      navigate('/estoque');
    } catch (error) {
      alert('Erro ao atualizar o estoque');
    }
  };

  return (
    <div className="editar-estoque">
      <header className="page-header">
        <img src="/logo.png" alt="Logo Via Norte" />
        <h1>Editar Dados do Produto</h1>
      </header>

      <div className="form-container">
        <label>Nome do Produto</label>
        <input
          type="text"
          value={produto.nome}
          disabled
        />

        <label>Quantidade:</label>
        <input
          type="number"
          value={produto.quantidade}
          onChange={(e) => setProduto({ ...produto, quantidade: parseInt(e.target.value, 10) })}
        />

        <button className="atualizar-button" onClick={handleSubmit}>
          Atualizar Produto
        </button>
      </div>
    </div>
  );
};

export default EditarEstoque;
