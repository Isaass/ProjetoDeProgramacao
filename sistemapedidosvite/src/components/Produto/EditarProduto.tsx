import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import '../../produtosPageStyles.css';

interface Produto {
  id: number;
  nome: string;
  estoque: number;
  tipo: string; // Adicionado o tipo do produto
}

const EditarProduto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [estoque, setEstoque] = useState(0);
  const [tipo, setTipo] = useState('unidade'); // Novo estado para tipo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get<Produto>(`/produtos/${id}`);
        const produto = response.data;
        setNome(produto.nome);
        setEstoque(produto.estoque);
        setTipo(produto.tipo);
      } catch (error) {
        alert('Erro ao buscar o produto');
      }
    };
    fetchProduto();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await api.put(`/produtos/${id}`, { nome, estoque, tipo });
      alert('Produto atualizado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      alert('Erro ao atualizar o produto');
    }
  };

  return (
    <div className="produto-form-container">
      <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <header className="page-header">
        <h1>Editar Dados do Produto</h1>
      </header>

      <div className="form-container">
        <label>Nome do Produto</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label>Estoque:</label>
        <input
          type="number"
          value={estoque}
          onChange={(e) => setEstoque(parseInt(e.target.value, 10))}
        />

        <div className="tipo-section">
          <label>Tipo do Produto:</label>
          {['Litros', 'Pacote', 'Unidade'].map((t) => (
            <div key={t}>
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={tipo === t}
                onChange={(e) => setTipo(e.target.value)}
              />
              <label>{t.charAt(0).toUpperCase() + t.slice(1)}</label>
            </div>
          ))}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Atualizar Produto
        </button>
      </div>
    </div>
  );
};

export default EditarProduto;
