package br.com.sistemapedidos.api.repositories;

import br.com.sistemapedidos.api.models.PedidoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoModel, Long> {
    // Adicione métodos personalizados, se necessário
}
