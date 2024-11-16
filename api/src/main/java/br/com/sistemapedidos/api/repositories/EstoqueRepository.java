package br.com.sistemapedidos.api.repositories;

import br.com.sistemapedidos.api.models.EstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstoqueRepository extends JpaRepository<EstoqueModel, Long> {
    EstoqueModel findByProdutoId(Long produtoId);
}
