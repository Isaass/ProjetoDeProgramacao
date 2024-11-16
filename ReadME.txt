# Manual de Utilização do Sistema de Gerenciamento de Pedidos

## Parte 1: Como Instalar e Rodar a Aplicação

### 1.1 Requisitos

Antes de iniciar, certifique-se de que você tem os seguintes softwares instalados na sua máquina:

- **Node.js** (versão 14 ou superior): [https://nodejs.org/en/](https://nodejs.org/en/)
- **npm** (Node Package Manager), geralmente vem junto com o Node.js
- **Git**: para clonar o repositório: [https://github.com/Isaass/ProjetoDeProgramacao.git](https://github.com/Isaass/ProjetoDeProgramacao.git)
- **Editor de código**, como o **VSCode**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **Backend API** (supondo que a API do servidor esteja em outro repositório ou já disponível)
- **Maven**: necessário para rodar o backend em Spring Boot: [https://maven.apache.org/](https://maven.apache.org/)

### 1.2 Passo a Passo de Instalação

1. **Clonar o Repositório**

   Primeiro, clone o repositório para a sua máquina:

   ```sh
   git clone https://github.com/seu-usuario/sistema-gerenciamento-pedidos.git
   cd sistema-gerenciamento-pedidos
   ```

2. **Instalar as Dependências**

   Com o terminal aberto no diretório do projeto, instale as dependências usando npm:

   ```sh
   npm install
   ```

3. **Configuração do Ambiente**

   Crie um arquivo `.env` na raiz do projeto para configurar as variáveis de ambiente (ex.: URL da API do servidor). Um exemplo de como o arquivo pode se parecer:

   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

   Este arquivo aponta para o backend (que deve estar rodando localmente).

4. **Rodar o Projeto**

   Agora, você pode iniciar a aplicação:

   ```sh
   npm start
   ```

   A aplicação irá abrir no seu navegador no endereço `http://localhost:3000`.

5. **Rodar o Backend em Localhost**

   Caso você também esteja rodando o backend, é necessário garantir que o servidor esteja funcionando localmente antes de abrir a aplicação no navegador. O backend é um projeto em Spring Boot e requer o Maven para ser executado. Para rodar o backend, use o seguinte comando na raiz do projeto da API:

   ```sh
   mvn spring-boot:run
   ```

   O servidor backend estará disponível no endereço `http://localhost:8080`. Também é possível acessar a documentação dos endpoints da aplicação pelo Swagger no endereço: [http://localhost:8080/api/sistemapedidos/swagger-ui/index.html#/](http://localhost:8080/api/sistemapedidos/swagger-ui/index.html#/).

### 1.3 Possíveis Problemas e Soluções

- **Problema com dependências:** Se algum erro ocorrer ao instalar dependências, tente rodar o comando `npm audit fix` para corrigir problemas conhecidos.
- **Erro de CORS:** Caso não consiga conectar ao backend, cheque se o backend está configurado para permitir acesso de sua aplicação local.

---

## Parte 2: Manual de Utilização do Sistema

O sistema possui funcionalidades distintas baseadas no tipo de usuário: **Administrador** e **Funcionário**. Cada tipo de usuário possui permissões específicas conforme descrito no diagrama enviado.

### 2.1 Login

- Ao acessar a aplicação, você é redirecionado para a página de **Login**.
- Preencha as informações de **Usuário** e **Senha**.
- Apenas após o login, é possível acessar as demais funcionalidades do sistema.

### 2.2 Funcionalidades do Administrador

- **Gerenciar Usuários**:
  - Administradores podem acessar a página de **Gerenciamento de Usuários** para visualizar, adicionar, editar e excluir usuários.
- **Gerenciar Produtos**:
  - O administrador pode visualizar, adicionar novos produtos e editar informações de produtos existentes.
- **Gerenciar Pedidos**:
  - Administradores podem visualizar todos os pedidos, adicionar novos e editar ou excluir pedidos existentes.
- **Gerenciar Locais**:
  - A página de **Locais** permite ao administrador gerenciar (adicionar, editar, excluir) locais de entrega.
- **Baixar Planilhas**:
  - O administrador também pode gerar relatórios em Excel tanto dos produtos (quantidade) quanto dos pedidos realizados.

### 2.3 Funcionalidades do Funcionário

- **Realizar Pedidos**:
  - Funcionários têm acesso à página de **Pedidos** onde podem adicionar novos pedidos.
  - Para realizar um pedido, o funcionário precisa escolher uma **Rota**, um **Local** e a quantidade dos produtos desejados.
- **Editar Pedidos**:
  - Funcionários também podem editar pedidos que eles mesmos criaram. Não é possível editar pedidos já processados ou enviados.
- **Editar Perfil**:
  - Funcionários podem editar informações do próprio perfil, como nome de usuário e senha.

### 2.4 Estrutura do Sistema

- **Cabeçalho/Navegação**: A parte superior do sistema exibe o nome do usuário logado e um menu com opções para editar perfil ou desconectar.
- **Páginas**:
  - **Home**: Um painel principal de boas-vindas, com acesso às funcionalidades principais.
  - **Usuários** (somente administradores): Gerenciamento completo de todos os usuários do sistema.
  - **Produtos** (somente administradores): Gerenciamento dos produtos no estoque.
  - **Pedidos** (funcionários e administradores): Listagem de todos os pedidos com possibilidade de criar, editar ou deletar.
  - **Locais** (somente administradores): Permite adicionar, editar e excluir locais e rotas.

### 2.5 Gerenciamento de Pedidos

1. **Visualizar Pedidos**: Todos os usuários podem visualizar os pedidos, sendo que administradores visualizam todos e funcionários veem apenas os seus próprios.
2. **Adicionar Pedido**:
   - Clique em **Adicionar Pedido**.
   - Escolha a **Rota** e o **Local**.
   - Selecione os produtos e indique as quantidades desejadas.
3. **Editar Pedido**:
   - Para editar, clique no ícone de **Lápis** ao lado do pedido desejado.
   - Funcionários podem editar a rota, o local e a quantidade dos produtos, contanto que o pedido não tenha sido processado.

### 2.6 Exportar Dados para Excel

Administradores podem gerar relatórios em Excel de pedidos e produtos.

- Acesse a página de **Pedidos** ou **Produtos** e clique no botão de **Exportar Excel**.
- O sistema gera automaticamente um arquivo `.xlsx` com os dados selecionados.

### 2.7 Controle de Acesso e Permissões

- **Administrador**: Possui acesso total, pode visualizar e gerenciar qualquer aspecto do sistema, incluindo edição e exclusão de dados.
- **Funcionário**: Acesso restrito apenas para realizar e editar pedidos, visualizar avisos, e editar o próprio perfil.

### 2.8 Logout

- Clique em **Desconectar** no canto superior direito para sair do sistema com segurança.

## Conclusão

Este manual cobre a instalação e o uso da aplicação do Sistema de Gerenciamento de Pedidos. Ele é projetado para facilitar o processo de pedido e controle de estoque tanto para administradores quanto para funcionários. Caso precise de suporte técnico adicional, verifique se a documentação do código está atualizada e se o backend está corretamente configurado para evitar erros de conexão.

