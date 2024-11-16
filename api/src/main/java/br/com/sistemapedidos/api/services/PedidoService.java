package br.com.sistemapedidos.api.services;

import br.com.sistemapedidos.api.dtos.PedidoDTO;
import br.com.sistemapedidos.api.dtos.PedidoItemDTO;
import br.com.sistemapedidos.api.models.*;
import br.com.sistemapedidos.api.repositories.LocalRepository;
import br.com.sistemapedidos.api.repositories.PedidoRepository;
import br.com.sistemapedidos.api.repositories.ProdutoRepository;
import br.com.sistemapedidos.api.repositories.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private LocalRepository localRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ModelMapper modelMapper;

    public PedidoDTO criarPedido(PedidoDTO pedidoDTO) {
        // Buscar as entidades relacionadas pelos seus respectivos IDs

        // Buscar Local
        LocalModel local = localRepository.findById(pedidoDTO.getLocalId())
                .orElseThrow(() -> new RuntimeException("Local não encontrado com ID: " + pedidoDTO.getLocalId()));

        // Buscar Usuario
        UsuarioModel usuario = usuarioRepository.findById(pedidoDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + pedidoDTO.getUsuarioId()));

        // Criar PedidoModel e atribuir Local, Usuario e outros campos
        PedidoModel pedido = new PedidoModel();
        pedido.setLocal(local);
        pedido.setUsuario(usuario);
        pedido.setData(LocalDate.now()); // Atribuir a data atual ao pedido

        // Iterar sobre os itens do pedidoDTO e buscar cada ProdutoModel
        List<PedidoItemModel> pedidoItens = pedidoDTO.getItens().stream().map(itemDTO -> {
            ProdutoModel produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + itemDTO.getProdutoId()));

            // Verificar se há estoque suficiente
            if (produto.getEstoque() < itemDTO.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            // Atualizar o estoque do produto
            produto.setEstoque(produto.getEstoque() - itemDTO.getQuantidade());
            produtoRepository.save(produto);

            // Criar PedidoItemModel e atribuir Produto e Quantidade
            PedidoItemModel pedidoItem = new PedidoItemModel();
            pedidoItem.setProduto(produto);
            pedidoItem.setQuantidade(itemDTO.getQuantidade());
            pedidoItem.setPedido(pedido); // Associar o item ao pedido

            return pedidoItem;
        }).collect(Collectors.toList());

        // Atribuir os itens ao pedido
        pedido.setItens(pedidoItens);

        // Salvar o PedidoModel no banco de dados
        PedidoModel savedPedido = pedidoRepository.save(pedido);

        // Mapear o PedidoModel salvo de volta para PedidoDTO e retornar
        return modelMapper.map(savedPedido, PedidoDTO.class);
    }

    public List<PedidoDTO> listarPedidos() {
        return pedidoRepository.findAll().stream()
                .map(pedido -> modelMapper.map(pedido, PedidoDTO.class))
                .collect(Collectors.toList());
    }

    public PedidoDTO listarPedidoPorId(Long id) {
        PedidoModel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com ID: " + id));

        // Mapear o PedidoModel para PedidoDTO
        PedidoDTO pedidoDTO = modelMapper.map(pedido, PedidoDTO.class);

        // Mapear os itens do pedido e adicioná-los ao PedidoDTO
        List<PedidoItemDTO> itensDTO = pedido.getItens().stream().map(item -> {
            PedidoItemDTO itemDTO = new PedidoItemDTO();
            itemDTO.setProdutoId(item.getProduto().getId());
            itemDTO.setNomeProduto(item.getProduto().getNome()); // Setando o nome do produto
            itemDTO.setQuantidade(item.getQuantidade());
            return itemDTO;
        }).collect(Collectors.toList());

        pedidoDTO.setItens(itensDTO);

        return pedidoDTO;
    }

    public PedidoDTO atualizarPedido(Long id, PedidoDTO pedidoDTO) {
        // Buscar o Pedido existente
        PedidoModel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Buscar Local e Usuario para garantir consistência
        LocalModel local = localRepository.findById(pedidoDTO.getLocalId())
                .orElseThrow(() -> new RuntimeException("Local não encontrado com ID: " + pedidoDTO.getLocalId()));
        UsuarioModel usuario = usuarioRepository.findById(pedidoDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + pedidoDTO.getUsuarioId()));

        // Atualizar campos no PedidoModel existente
        pedido.setLocal(local);
        pedido.setUsuario(usuario);

        // Atualizar itens do pedido
        // Primeiro, devolver os itens ao estoque original antes de modificar o pedido
        for (PedidoItemModel item : pedido.getItens()) {
            ProdutoModel produto = item.getProduto();
            produto.setEstoque(produto.getEstoque() + item.getQuantidade());
            produtoRepository.save(produto);
        }

        // Limpar os itens do pedido antes de reatualizar
        pedido.getItens().clear();

        // Mapear os itens do DTO para o PedidoItemModel e associar ao pedido
        List<PedidoItemModel> pedidoItens = pedidoDTO.getItens().stream().map(itemDTO -> {
            ProdutoModel produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + itemDTO.getProdutoId()));

            // Verificar se há estoque suficiente
            if (produto.getEstoque() < itemDTO.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            // Atualizar o estoque do produto
            produto.setEstoque(produto.getEstoque() - itemDTO.getQuantidade());
            produtoRepository.save(produto);

            // Criar PedidoItemModel
            PedidoItemModel pedidoItem = new PedidoItemModel();
            pedidoItem.setProduto(produto);
            pedidoItem.setQuantidade(itemDTO.getQuantidade());
            pedidoItem.setPedido(pedido);

            return pedidoItem;
        }).collect(Collectors.toList());

        // Atribuir os itens atualizados ao pedido
        pedido.getItens().addAll(pedidoItens);

        // Salvar o pedido atualizado
        PedidoModel updatedPedido = pedidoRepository.save(pedido);

        // Mapear de volta para DTO e retornar
        return modelMapper.map(updatedPedido, PedidoDTO.class);
    }

    public void deletarPedido(Long id) {
        // Recuperar o pedido antes de deletar para devolver o estoque dos produtos
        PedidoModel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Devolver a quantidade de cada item ao estoque
        for (PedidoItemModel item : pedido.getItens()) {
            ProdutoModel produto = item.getProduto();
            produto.setEstoque(produto.getEstoque() + item.getQuantidade());
            produtoRepository.save(produto);
        }

        // Deletar o pedido
        pedidoRepository.deleteById(id);
    }
}
