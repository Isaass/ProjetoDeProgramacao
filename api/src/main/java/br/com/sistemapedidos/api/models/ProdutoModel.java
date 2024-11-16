package br.com.sistemapedidos.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "produto")
@Data
public class ProdutoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer estoque;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoProduto tipo; // Novo campo tipo

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItemModel> pedidoItens; // Relacionamento com os itens de pedido que usam esse produto

    public enum TipoProduto {
        Litros,
        Pacote,
        Unidade
    }
}
