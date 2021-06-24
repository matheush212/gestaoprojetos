# -------------------------------------- Inicializar projeto --------------------------------------#

1 - Para Iniciar o projeto, abra o prompt de comando do nodejs, navegue até a pasta 'gestao-projetos' que está no mesmo diretório que este arquivo README;

2 - Ao acessar o diretório acima, de um 'npm install' para instalar as dependencias do node js referente ao server-side;

3 - Após terminar o passo acima, execute o comando 'cd client' para acessar a pasta client e novamente execute o 'npm install', pois agora irá baixar as depenedencias do node referente a parte client (pode demorar um pouco).

4 - Por fim, volte uma pasta, executando 'cd..' e então rode o comando 'npm run sgp';

5 - Se tudo funcionar corretamente a aplicação irá subir e uma página da WEB irá aparecer. Aguarde alguns segundos e a aplicação irá carregar.

OBS: O sistema detém um login e senha, sendo assim, informe o login 'euax' e senha 'euax' para acessar.

CASO NÃO CONSEGUIR RODAR A APLICAÇÃO, FAVOR VISUALIZAR O VÍDEO TUTORIAL DISPONÍVEL NA PASTA! (Tutorial Instalação)
# ------------------------------------------------------------------------------------------------- #



# ------------------------------- Ferramentas e tecnolgia utilizadas ------------------------------ #

Esta aplicação foi criada com as linguagens ReactJS, NodeJS, CSS, Materialize-CSS, Material-UI, JQuery, Javascript e HTML, sendo que para a parte server-side foi uilizado o NodeJS.

Na parte do banco de dados foi utilizado e SQLite, por ser mais leve e portável, sendo perfeito para esta aplicação.

O server se comunica pela porta 5000, e o client na porta 90, a maioria das requisições são feitas por uma API criada que passa as informações via parametros (req.params), por GET, POST, PUT e DELETE, porém existem algumas situações que foram utilizadas requisições por fetch em que são recebias via 'req.body'.

O Material-UI é um framework de estilização para ReactJS, trazendo componentes bonitos, com design clean, de fácil uso e responsivos, por este motivo foi escolhido (https://material-ui.com/pt/).

Trabalho com ReactJS e NodeJS a mais de 2 anos, desenvolvendo aplicações desde a parte front-end quanto a back-end (FullStack).

OBS: O arquivo.db (sqpDB.db), referente ao banco de dados, está na pasta 'db/database' dentro de 'gestao-projetos' e pode ser acessado via o SQLiteStudio (https://sqlitestudio.pl/).

# ------------------------------------------------------------------------------------------------- #


# ---------------------------------- Funcionalidade implementadas --------------------------------- #

OBS: Para verificar melhor e com mais detalhes o que cada tela tem de funcionalidades, favor consultar o arquivo 'Manual_SGP.docx' disponível na pasta. Nele contém uma imagem de cada tela e a descrição das funcionalidades.

Foram implementadas as seguintes funcionalidades e telas:

- Tela de login com autenticação por login e senha. Após realizado o login corretamente, uma sessão é iniciada para o usuário e um token é gerado, e a partir de então, todas as outras telas só são acessíveis com aquele token que permenecerá ativo durante a sessão. O token tem uma duração de 10 horas, após este periodo o sistema não será mais acessível e o usuário terá de realizar o login novamente, caso seja tentado acessar alguma tela sem o token, o sistema irá bloquear e uma mensagem com um botão para voltar a tela de login serão apresentados. 

- Listagem de projetos em formato tebela com a porcentagem de andamento de cada projeto e opções de filtros;

- Cadastro de projeto;

- Edição de projeto com exclusão e inativação;

- Listagem de atividades em formato tabela com a porcentagem de andamento de cada projeto e opções de filtros;

- Cadastro de atividade;

- Edição de atividade com exclusão e inativação;

- Tela contendo informações de projetos e atividades concluídas, atrasadas, em andamento e porcentagens;

- Tela de visualização e alteração de dados de perfil;

- Tela de alteração de senha;

- Função para verificar se o projeto irá atrasar, com base na data final do projeto e na maior data final da atividade relacionada ao mesmo;

- Funções de porcentagens que se alteram sozinhas, indicando quanto falta para o projeto ser concluído, funcionando em tempo real, conforme os dias vão passando e a data final para a entrega vai se aproximando; 

- Função para verificar se a atividade em especifico irá atrasar, com base na data atual e na data final da atividade;

- Foram criadas 3 tabelas, sendo elas, a tabela de Usuários, de Projetos e de Atividades. As tabelas de Projetos e Atividades contém todos os campos necessários e descritos no problema do projeto e alguns a mais criados para outras funcionalidades.

Avaliando de modo geral, todas as funcionalidades e regras descritas no problema do projeto foram implementadas e estão funcionando corretamente. Sendo que as funções de edição, exclusão, inativação, informações gerais, alteração de senha e alteração de perfil foram implementadas a parte.
# ------------------------------------------------------------------------------------------------- #


# ------------------------------------------------------------------------------------------------- #

Obrigado!

Atenciosamente,
Matheus Henrique Horongoso.

# ------------------------------------------------------------------------------------------------- #