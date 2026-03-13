node server.js

##  TESTE ROTAS


* Busca exata por Ref: http://localhost:3000/produtos?ref=MDF-BR-15MM
O que mudou: O Model agora sabe que ref na URL deve olhar para a coluna codigo_ref no banco.

* Ver Inativos: http://localhost:3000/produtos?status=inativo
Dica: Primeiro desative um produto usando o seu PATCH /desativar, senão a lista virá vazia mesmo.

* Ver Alertas: http://localhost:3000/produtos?alerta=true
Resultado esperado: O seu MDF Branco TX 15mm deve aparecer sozinho, pois quantidade_atual (4) é menor que limite_alerta (5).

* Ver Categoria: http://localhost:3000/produtos?categoria=Chapas

## Por que usar o Swagger?
O Swagger (OpenAPI) não é apenas um "manual". Ele cria uma interface visual onde:

Você vê todas as suas rotas organizadas.

Pode testar cada uma delas sem precisar do Insomnia.

Qualquer outro desenvolvedor (ou recrutador) entende o seu sistema em 30 segundos.
