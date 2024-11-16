import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListaProdutos from '../components/Produto/ListaProdutos';
import '../produtosPageStyles.css'; // Estilização para deixar a página conforme a imagem

const ProdutosPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddProductClick = () => {
    navigate('/produtos/novo'); // Redireciona para a rota de adicionar produto
  };

  return (
    <div className="produtos-page">
      <div className="header">
        <h2>Gerenciamento de Produtos</h2>
        <button className="add-button" onClick={handleAddProductClick}>
          Adicionar novo Produto
        </button>
      </div>
      <ListaProdutos />
    </div>
  );
};

export default ProdutosPage;
