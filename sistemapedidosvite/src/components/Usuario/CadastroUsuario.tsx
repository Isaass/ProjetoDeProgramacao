import React, { useState } from 'react';
import api from '../../service/api';
import '../../Cadastro.css';

interface CadastroProps {
  onClose: () => void;
}

const CadastroUsuario: React.FC<CadastroProps> = ({ onClose }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('');

  const handleCadastro = async () => {
    try {
      await api.post('/usuarios/cadastro', { nomeCompleto, nomeUsuario, senha, role });
      alert('Usuário cadastrado com sucesso!');
      onClose(); // Fechar o modal após o cadastro
    } catch (error) {
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="form-container">
      <h2>Criar uma nova Conta</h2>
      <input
        type="text"
        placeholder="Nome Completo"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nome de Usuário"
        value={nomeUsuario}
        onChange={(e) => setNomeUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <div className="radio-group">
        <label>Tipo do Usuário:</label>
        <div>
          <label>
            <input
              type="radio"
              value="Administrador"
              checked={role === 'Administrador'}
              onChange={(e) => setRole(e.target.value)}
            />
            Administrador
          </label>
          <label>
            <input
              type="radio"
              value="Cabo de Turma"
              checked={role === 'Cabo de Turma'}
              onChange={(e) => setRole(e.target.value)}
            />
            Cabo de Turma
          </label>
        </div>
      </div>
      <button onClick={handleCadastro}>Criar Usuário</button>
      {/* Botão Voltar */}
      <button className="add-button" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default CadastroUsuario;
