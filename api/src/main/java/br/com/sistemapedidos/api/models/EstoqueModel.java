package br.com.sistemapedidos.api.models;

import jakarta.persistence.*;


@Entity
@Table(name = "estoque")
public class EstoqueModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "produto_id", nullable = false)
    private Long produtoId;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    // Construtores
    public EstoqueModel() {}

    public EstoqueModel(Long produtoId, Integer quantidade) {
        this.produtoId = produtoId;
        this.quantidade = quantidade;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
