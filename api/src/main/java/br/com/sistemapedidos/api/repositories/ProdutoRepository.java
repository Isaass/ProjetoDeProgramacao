package br.com.sistemapedidos.api.repositories;

import br.com.sistemapedidos.api.models.ProdutoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<ProdutoModel, Long> {
    // Adicione métodos personalizados, se necessário
}
