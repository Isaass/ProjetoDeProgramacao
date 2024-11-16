import React, { useState } from 'react';
import api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../loginStyles.css';

interface LoginResponse {
  id: number;
  nomeUsuario: string;
  role: string; // ou 'admin' | 'user' se quiser restringir ainda mais os valores
}

const Login: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post<LoginResponse>('/usuarios/entrar', { nomeUsuario, senha });
      const { id, nomeUsuario: nome, role } = response.data;

      // Criando o objeto `User` para ser passado para o contexto de autenticação
      const user = {
        id,
        nomeUsuario: nome,
        role,
      };

      // Passa o objeto `user` completo para a função `login()`
      login(user);
      alert('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h3>Fazer Login</h3>
        <input
          type="text"
          placeholder="Usuário"
          value={nomeUsuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="login-input"
        />
        <button
          onClick={handleLogin}
          className="login-button"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
};

export default Login;
