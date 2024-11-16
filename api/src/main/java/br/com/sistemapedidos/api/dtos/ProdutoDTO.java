package br.com.sistemapedidos.api.dtos;

import br.com.sistemapedidos.api.models.ProdutoModel;
import lombok.Data;

@Data
public class ProdutoDTO {
    private Long id;
    private String nome;
    private Integer estoque;
    private ProdutoModel.TipoProduto tipo;
}
