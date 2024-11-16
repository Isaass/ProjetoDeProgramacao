import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListaLocais from '../components/Local/ListaLocais';
import '../locaisPageStyles.css';

const LocaisPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddLocal = () => {
    navigate('/locais/novo'); // Redireciona para a rota de adicionar novo local
  };

  return (
    <div className="locais-page">
      <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <header className="page-header">
        <h1 className="locais-title">Gerenciamento de Locais</h1>
        <button className="add-local-button" onClick={handleAddLocal}>
          Adicionar novo Local
        </button>
      </header>

      <ListaLocais />
    </div>
  );
};

export default LocaisPage;
