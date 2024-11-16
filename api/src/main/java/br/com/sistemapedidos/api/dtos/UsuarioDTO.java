package br.com.sistemapedidos.api.dtos;

import lombok.*;

@Data
public class UsuarioDTO {
    private Long id;
    private String nomeUsuario;
    private String nomeCompleto;
    private String role;
}
