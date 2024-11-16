import React, { useState } from 'react';
import api from '../../service/api';
import '../../localFormStyles.css';

const LocalForm: React.FC = () => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [rota, setRota] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (rota === null) {
      alert('Por favor, selecione uma rota.');
      return;
    }

    try {
      await api.post('/locais', { nome, endereco, rota });
      alert('Local criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar local');
    }
  };

  return (
    <div className="local-form-container">
      <div className="back-link">
        <a href="/locais" className="back-link">Voltar</a>
      </div>

      <h1>Cadastrar um Novo Local</h1>
      <div className="local-form">
        <input
          type="text"
          placeholder="Nome do Local"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Digite o Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="form-input"
        />
        <div className="rota-section">
          <label>Número da Rota:</label>
          {[1, 2, 3, 4, 5, 6, 7].map((r) => (
            <div key={r}>
              <input
                type="radio"
                name="rota"
                value={r}
                checked={rota === r}
                onChange={(e) => setRota(parseInt(e.target.value, 10))}
              />
              <label>{`${r}ª Rota`}</label>
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} className="submit-button">Cadastrar Local</button>
      </div>
    </div>
  );
};

export default LocalForm;
