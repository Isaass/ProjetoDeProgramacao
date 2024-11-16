package br.com.sistemapedidos.api.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PedidoDTO {
    private Long id;
    private Long localId;
    private Long usuarioId;
    private List<PedidoItemDTO> itens; // Lista de itens do pedido
    private LocalDate data; // Novo campo para armazenar a data do pedido
}
