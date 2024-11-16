package br.com.sistemapedidos.api.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "pedido_item")
@Data
public class PedidoItemModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoModel pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private ProdutoModel produto;

    @Column(nullable = false)
    private Integer quantidade;
}
