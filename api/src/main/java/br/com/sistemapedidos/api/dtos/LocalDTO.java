package br.com.sistemapedidos.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class LocalDTO {
    private Long id;
    private String nome;
    private String endereco;
    private Integer rota;
}
