package br.com.sistemapedidos.api.dtos;

public class EstoqueDTO {

    private Long id;
    private Long produtoId;
    private Integer quantidade;

    // Construtores
    public EstoqueDTO() {}

    public EstoqueDTO(Long produtoId, Integer quantidade) {
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
