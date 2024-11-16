import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';
import '../../locaisPageStyles.css';

interface Local {
  id: number;
  nome: string;
  rota: number;
}

const ListaLocais: React.FC = () => {
  const [locais, setLocais] = useState<Local[]>([]);
  const [rotaFilter, setRotaFilter] = useState<string>('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const response = await api.get<Local[]>('/locais');
        setLocais(response.data);
      } catch (error) {
        alert('Erro ao buscar locais');
      }
    };
    fetchLocais();
  }, []);

  const handleEdit = (id: number) => {
    // Redireciona para a página de edição do local
    navigate(`/locais/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este local?')) {
      try {
        await api.delete(`/locais/${id}`);
        setLocais((prevLocais) => prevLocais.filter((local) => local.id !== id));
        alert('Local deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar o local');
      }
    }
  };

  const handleRotaFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRotaFilter(e.target.value);
  };

  // Filtra os locais com base no filtro de rota selecionado
  const filteredLocais = locais.filter((local) => {
    return rotaFilter === 'Todos' || local.rota === parseInt(rotaFilter);
  });

  return (
    <div className="locais-container">
      <div className="filtro-container">
        <label>Filtrar por rota:</label>
        <select value={rotaFilter} onChange={handleRotaFilterChange}>
          <option value="Todos">Todos</option>
          {[1, 2, 3, 4, 5, 6, 7].map((rota) => (
            <option key={rota} value={rota}>{`Rota ${rota}`}</option>
          ))}
        </select>
      </div>
      <table className="locais-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Local</th>
            <th>Rota</th>
            <th>Editar</th>
            <th>Deletar</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocais.map((local) => (
            <tr key={local.id}>
              <td>{local.id}</td>
              <td>{local.nome}</td>
              <td>{local.rota}</td>
              <td>
                <button
                  className="editar-button"
                  onClick={() => handleEdit(local.id)}
                >
                  ✏️
                </button>
              </td>
              <td>
                <button
                  className="deletar-button"
                  onClick={() => handleDelete(local.id)}
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

export default ListaLocais;
