import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import UsuariosPage from './pages/UsuariosPage';
import ProdutosPage from './pages/ProdutosPage';
import PedidosPage from './pages/PedidosPage';
import PedidoForm from './components/Pedido/PedidoForm';
import EditarPedido from './components/Pedido/EditarPedido';
import LocaisPage from './pages/LocaisPage';
import LocalForm from './components/Local/LocalForm';
import Login from './components/Usuario/Login';
import ProdutoForm from './components/Produto/ProdutoForm';
import EditarProduto from './components/Produto/EditarProduto';
import EditarUsuario from './components/Usuario/EditarUsuario';
import { useAuth } from './context/AuthContext';
import EditarLocal from './components/Local/EditarLocal';

const App: React.FC = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleUserClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="page-container">
        {/* Cabeçalho com Navegação */}
        {isAuthenticated && (
          <header className="header-nav">
            <div className="nav-brand">
              <h1>Sistema de Gerenciamento de Pedidos</h1>
            </div>
            <div className="user-info">
              <div className="user-name" onClick={handleUserClick}>
                <img src="/img/perfil-de-usuario (1).png" alt="Ícone do Usuário" className="user-icon" />
                {user?.nomeUsuario || 'Usuário'}
                <span className="dropdown-arrow">▼</span>
              </div>
              {showDropdown && (
                <div className="user-dropdown">
                  <Link to={`/usuarios/editar-perfil`} className="dropdown-item button-item">Editar Perfil</Link>
                  <button onClick={handleLogout} className="dropdown-item button-item">Desconectar</button>
                </div>
              )}
            </div>
          </header>
        )}

        {/* Conteúdo Principal */}
        <div className="content-container">
          <Routes>
            {/* Página de Login */}
            <Route path="/login" element={<Login />} />

            {/* Redireciona para o Login se não estiver autenticado */}
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
            />

            {/* Usuários - Somente Administradores */}
            <Route
              path="/usuarios"
              element={isAuthenticated && role === 'Administrador' ? <UsuariosPage /> : <Navigate to="/login" replace />}
            />

            {/* Editar Perfil do Usuário - Funcionários e Administradores */}
            <Route
              path="/usuarios/editar-perfil"
              element={isAuthenticated ? <EditarUsuario userId={user?.id || 0} /> : <Navigate to="/login" replace />}
            />

            {/* Produtos - Somente Administradores */}
            <Route
              path="/produtos"
              element={isAuthenticated && role === 'Administrador' ? <ProdutosPage /> : <Navigate to="/login" replace />}
            />

            {/* Pedidos - Funcionários e Administradores */}
            <Route
              path="/pedidos"
              element={isAuthenticated ? <PedidosPage /> : <Navigate to="/login" replace />}
            />

            {/* Adicionar novo pedido - Funcionários e Administradores */}
            <Route
              path="/pedidos/novo"
              element={isAuthenticated ? <PedidoForm /> : <Navigate to="/login" replace />}
            />

            {/* Editar pedido existente - Funcionários e Administradores */}
            <Route
              path="/pedidos/editar/:id"
              element={isAuthenticated ? <EditarPedido /> : <Navigate to="/login" replace />}
            />

            {/* Locais - Somente Administradores */}
            <Route
              path="/locais"
              element={isAuthenticated && role === 'Administrador' ? <LocaisPage /> : <Navigate to="/login" replace />}
            />

            {/* Adicionar novo local - Somente Administradores */}
            <Route
              path="/locais/novo"
              element={isAuthenticated && role === 'Administrador' ? <LocalForm /> : <Navigate to="/login" replace />}
            />

            {/* Editar local - Somente Administradores */}
            <Route
              path="/locais/editar/:id"
              element={isAuthenticated && role === 'Administrador' ? <EditarLocal /> : <Navigate to="/login" replace />}
            />

            {/* Adicionar novo produto - Somente Administradores */}
            <Route
              path="/produtos/novo"
              element={isAuthenticated && role === 'Administrador' ? <ProdutoForm /> : <Navigate to="/login" replace />}
            />

            {/* Editar produto - Somente Administradores */}
            <Route
              path="/produtos/editar/:id"
              element={isAuthenticated && role === 'Administrador' ? <EditarProduto /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
