import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import '../../ListaUsariosStyles.css'; // Importando um arquivo CSS específico para estilização

export interface Usuario {
  id: number;
  nomeCompleto: string;
  nomeUsuario: string;
  role: string;
}

interface ListaUsuariosProps {
  onEditUser: (id: number) => void;
}

const ListaUsuarios: React.FC<ListaUsuariosProps> = ({ onEditUser }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get<Usuario[]>('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        alert('Erro ao buscar usuários');
      }
    };
    fetchUsuarios();
  }, []);

  // Função para deletar um usuário
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id));
      alert('Usuário deletado com sucesso!');
    } catch (error) {
      alert('Erro ao deletar usuário');
    }
  };

  return (
    <div className="usuarios-table-container">
      <div className="back-link">
        <a href="/">Voltar</a>
      </div>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Usuário</th>
            <th>Permissão</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nomeCompleto}</td>
              <td>{usuario.nomeUsuario}</td>
              <td>{usuario.role}</td>
              <td>
                <button
                  className="action-button edit-button"
                  onClick={() => onEditUser(usuario.id)}
                >
                  ✏️
                </button>
              </td>
              <td>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(usuario.id)}
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

export default ListaUsuarios;
