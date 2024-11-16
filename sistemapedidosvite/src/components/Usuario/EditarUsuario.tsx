import React, { useState, useEffect } from 'react';
import api from '../../service/api';

interface EditarUsuarioProps {
  userId: number;  // Alterando de 'id' para 'userId' para ser mais claro e consistente
}

const EditarUsuario: React.FC<EditarUsuarioProps> = ({ userId }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get<{ nomeCompleto: string; nomeUsuario: string; role: string }>(`/usuarios/${userId}`);
        const usuarioData = response.data;
        setNomeCompleto(usuarioData.nomeCompleto);
        setNomeUsuario(usuarioData.nomeUsuario);
        setRole(usuarioData.role);
      } catch (error) {
        alert('Erro ao buscar dados do usuário');
      }
    };

    if (userId) {
      fetchUsuario();
    }
  }, [userId]);

  const handleEditar = async () => {
    try {
      await api.put(`/usuarios/${userId}/perfil`, { nomeCompleto, nomeUsuario, senha, role });
      alert('Usuário editado com sucesso!');
      // Você pode redirecionar o usuário para outra página após a edição, por exemplo, para a página de perfil ou home
      window.history.back();  // Redireciona o usuário para a página anterior
    } catch (error) {
      alert('Erro ao editar usuário');
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Dados do Usuário</h2>
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
      <button onClick={handleEditar}>Atualizar Usuário</button>
      {/* Botão Voltar */}
      <button className="add-button" onClick={() => window.history.back()}>
        Cancelar
      </button>
    </div>
  );
};

export default EditarUsuario;
