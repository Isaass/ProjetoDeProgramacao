import React, { useState } from 'react';
import ListaUsuarios from '../components/Usuario/ListaUsuaros';
import Cadastro from '../components/Usuario/CadastroUsuario';
import EditarUsuario from '../components/Usuario/EditarUsuario';
import '../usuariosPageStyles.css';

const UsuariosPage: React.FC = () => {
  const [isCadastroVisible, setIsCadastroVisible] = useState(false);
  const [isEditarVisible, setIsEditarVisible] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);

  const handleAddUserClick = () => {
    setIsCadastroVisible(true);
  };

  const handleEditUserClick = (id: number) => {
    setEditUserId(id);
    setIsEditarVisible(true);
  };

  const closeModal = () => {
    setIsCadastroVisible(false);
    setIsEditarVisible(false);
    setEditUserId(null);
  };

  return (
    <div className="usuarios-page">
      

      {/* Título e botão de adicionar */}
      <div className="page-title">
        <h1>Gerenciamento de Usuários</h1>
        <button className="add-user-button" onClick={handleAddUserClick}>
          Adicionar novo Usuário
        </button>
      </div>

      {/* Lista de Usuários */}
      <div className="usuarios-table-container">
        <ListaUsuarios onEditUser={handleEditUserClick} />
      </div>

      {/* Modal de Cadastro */}
      {isCadastroVisible && (
        <div className="modal">
          <div className="modal-content">
            <Cadastro onClose={closeModal} />
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditarVisible && editUserId !== null && (
        <div className="modal">
          <div className="modal-content">
            <EditarUsuario id={editUserId} onClose={closeModal} />
          </div>
        </div>
      )}

      
    </div>
  );
};

export default UsuariosPage;
