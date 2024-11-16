package br.com.sistemapedidos.api.dtos;

import lombok.Data;

@Data
public class PedidoItemDTO {
    private Long produtoId; // ID do produto
    private String nomeProduto;
    private Integer quantidade; // Quantidade do produto no pedido
}
