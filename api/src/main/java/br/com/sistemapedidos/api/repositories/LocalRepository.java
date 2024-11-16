package br.com.sistemapedidos.api.repositories;

import br.com.sistemapedidos.api.models.LocalModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalRepository extends JpaRepository<LocalModel, Long> {
    // Adicione métodos personalizados, se necessário
}
