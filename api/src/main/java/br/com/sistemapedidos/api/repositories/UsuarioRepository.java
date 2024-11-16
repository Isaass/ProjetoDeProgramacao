package br.com.sistemapedidos.api.repositories;

import br.com.sistemapedidos.api.models.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
    Optional<UsuarioModel> findByNomeUsuario(String nomeUsuario);
}
