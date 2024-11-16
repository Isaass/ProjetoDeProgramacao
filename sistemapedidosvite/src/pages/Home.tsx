import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../service/api';
import '../homePage.css'; // Importa o estilo específico da página Home

interface Produto {
  nome: string;
  estoque: number;
}

const Home: React.FC = () => {
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState<Produto[]>([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get<Produto[]>('/produtos');
        const produtos = response.data.filter((produto) => produto.estoque < 50);
        setProdutosBaixoEstoque(produtos);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="page-container">
      {/* Mensagem de alerta para produtos com estoque baixo */}
      {produtosBaixoEstoque.length > 0 && (
        <div className="alert-message">
          <strong>Atenção:</strong> O estoque dos seguintes produtos está abaixo de 50 unidades:
        </div>
      )}
      {produtosBaixoEstoque.map((produto, index) => (
        <div key={index} className="low-stock-item">
          {produto.nome} - Estoque: {produto.estoque}
        </div>
      ))}

      {/* Botões de gerenciamento */}
      <div className="buttons-container">
        <Link to="/usuarios">
          <button className="manage-button">Gerenciar Usuários</button>
        </Link>
        <Link to="/pedidos">
          <button className="manage-button">Gerenciar Pedidos</button>
        </Link>
        <Link to="/produtos">
          <button className="manage-button">Gerenciar Produtos</button>
        </Link>
        <Link to="/locais">
          <button className="manage-button">Gerenciar Locais</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
