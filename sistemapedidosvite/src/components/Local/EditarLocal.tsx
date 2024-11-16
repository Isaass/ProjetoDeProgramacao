import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';
import '../../editarLocalStyles.css';

interface Local {
  id: number;
  nome: string;
  endereco: string;
  rota: number; // Atualizando tipo de rota para number
}

const EditarLocal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [rota, setRota] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const response = await api.get<Local>(`/locais/${id}`);
        const localData = response.data;
        setNome(localData.nome);
        setEndereco(localData.endereco);
        setRota(localData.rota);
      } catch (error) {
        alert('Erro ao buscar local');
      }
    };

    if (id) {
      fetchLocal();
    }
  }, [id]);

  const handleSaveChanges = async () => {
    if (rota === null) {
      alert('Por favor, selecione uma rota.');
      return;
    }

    try {
      await api.put(`/locais/${id}`, {
        nome,
        endereco,
        rota,
      });
      alert('Alterações salvas com sucesso!');
      navigate('/locais'); // Redireciona para a página de gerenciamento de locais
    } catch (error) {
      alert('Erro ao salvar alterações');
    }
  };

  return (
    <div className="editar-local-page">
      <div>
      <a href="/locais" className="back-link">Voltar</a>
      </div>
      <header className="page-header">
        <h1 className="editar-local-title">Editar Local</h1>
      </header>

      <div className="form-container">
        <label>Nome do Local</label>
        <input
          type="text"
          placeholder="Nome do Local"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label>Endereço</label>
        <textarea
          placeholder="Digite o Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />

        <label>Rota</label>
        <div className="rota-options">
          {[1, 2, 3, 4, 5, 6, 7].map((r) => (
            <div key={r}>
              <input
                type="radio"
                id={`rota${r}`}
                name="rota"
                value={r}
                checked={rota === r}
                onChange={(e) => setRota(parseInt(e.target.value, 10))}
              />
              <label htmlFor={`rota${r}`}>{`${r}ª Rota`}</label>
            </div>
          ))}
        </div>

        <button className="save-changes-button" onClick={handleSaveChanges}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default EditarLocal;
