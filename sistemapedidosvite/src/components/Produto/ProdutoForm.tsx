import React, { useState } from 'react';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';
import '../../produtosPageStyles.css';

const ProdutoForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [estoque, setEstoque] = useState(0);
  const [tipo, setTipo] = useState('unidade'); // Novo estado para tipo
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post('/produtos', { nome, estoque, tipo });
      alert('Produto criado com sucesso!');
      navigate('/produtos'); // Redireciona para a página de produtos
    } catch (error) {
      alert('Erro ao criar produto');
    }
  };

  return (
    <div className="produto-form-container">
      <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <header className="page-header">
        <h1>Cadastrar um Novo Produto</h1>
      </header>

      <div className="form-container">
        <label>Nome do Produto</label>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label>Estoque:</label>
        <input
          type="number"
          placeholder="Quantidade"
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
          Cadastrar Produto
        </button>
      </div>
    </div>
  );
};

export default ProdutoForm;
