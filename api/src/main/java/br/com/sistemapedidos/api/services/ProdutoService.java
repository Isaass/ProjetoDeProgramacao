package br.com.sistemapedidos.api.services;

import br.com.sistemapedidos.api.dtos.ProdutoDTO;
import br.com.sistemapedidos.api.models.PedidoItemModel;
import br.com.sistemapedidos.api.models.ProdutoModel;
import br.com.sistemapedidos.api.repositories.ProdutoRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ProdutoDTO criarProduto(ProdutoDTO produtoDTO) {
        ProdutoModel produto = modelMapper.map(produtoDTO, ProdutoModel.class);
        ProdutoModel savedProduto = produtoRepository.save(produto);
        return modelMapper.map(savedProduto, ProdutoDTO.class);
    }

    public List<ProdutoDTO> listarProdutos() {
        return produtoRepository.findAll().stream()
                .map(produto -> modelMapper.map(produto, ProdutoDTO.class))
                .collect(Collectors.toList());
    }

    public ProdutoDTO obterProdutoPorId(Long id) {
        ProdutoModel produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return modelMapper.map(produto, ProdutoDTO.class);
    }

    public ProdutoDTO atualizarProduto(Long id, ProdutoDTO produtoDTO) {
        ProdutoModel produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Atualiza apenas os campos fornecidos no DTO
        if (produtoDTO.getNome() != null && !produtoDTO.getNome().isEmpty()) {
            produto.setNome(produtoDTO.getNome());
        }
        if (produtoDTO.getEstoque() != null) {
            produto.setEstoque(produtoDTO.getEstoque());
        }
        if (produtoDTO.getTipo() != null) {
            produto.setTipo(produtoDTO.getTipo());
        }

        ProdutoModel updatedProduto = produtoRepository.save(produto);
        return modelMapper.map(updatedProduto, ProdutoDTO.class);
    }

    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }

    public void atualizarEstoqueAoCriarPedido(List<PedidoItemModel> pedidoItens) {
        for (PedidoItemModel pedidoItem : pedidoItens) {
            ProdutoModel produto = produtoRepository.findById(pedidoItem.getProduto().getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            // Atualiza o estoque subtraindo a quantidade do pedido
            if (produto.getEstoque() >= pedidoItem.getQuantidade()) {
                produto.setEstoque(produto.getEstoque() - pedidoItem.getQuantidade());
                produtoRepository.save(produto);
            } else {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }
        }
    }
}
