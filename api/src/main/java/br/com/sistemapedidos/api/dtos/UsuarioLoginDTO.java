package br.com.sistemapedidos.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class UsuarioLoginDTO {
    private String nomeUsuario;
    private String senha;
}
