# Como o Bolão Dez funciona — e como conferir tudo

Este documento explica as regras do bolão em linguagem simples, para que **qualquer participante consiga auditar o resultado** sem precisar confiar em ninguém. Tudo o que está aqui é exatamente o que o sistema faz.

## 1. A cartela

Cada cartela tem **10 dezenas diferentes, de 1 a 60**, escolhidas na hora da aposta (ou pela surpresinha). Depois de paga, a cartela não muda nunca mais — o que você vê na lista pública é o que vale até o fim.

Duas pessoas podem ter cartelas idênticas: se as duas fecharem os 10 pontos no mesmo concurso, dividem o prêmio.

## 2. A aposta só vale depois de paga

A aposta nasce "aguardando pagamento" e **não conta para nada** até o PIX ser confirmado. Só cartelas pagas:

- entram no pote;
- aparecem na lista pública e no ranking;
- pontuam nos sorteios.

Regras de prazo:

- Apostas são aceitas **até o horário de encerramento** publicado na página da rodada (por padrão, 18h do dia do primeiro sorteio).
- O QR PIX vence em no máximo 30 minutos (ou antes, se o prazo de apostas terminar antes). QR vencido = aposta expirada; é só fazer outra.
- Se um pagamento for aprovado **depois** do encerramento — por exemplo, um PIX que demorou a compensar — a cartela **não entra na rodada** e o valor é devolvido pela administração. Isso aparece marcado no sistema e no relatório final.

## 3. Como os pontos são contados

Quando sai um concurso da Mega-Sena, o administrador lança as 6 dezenas no sistema. Aí acontece o seguinte, para **cada cartela paga**:

> Para cada uma das 6 dezenas sorteadas: se a cartela tem essa dezena e ela ainda está "apagada", ela **acende** — e fica registrado **em qual concurso** acendeu.

Três consequências importantes:

1. **Bola acesa nunca apaga.** A pontuação só cresce.
2. **Dezena repetida não pontua duas vezes.** Se o 27 já acendeu na sua cartela no concurso passado e sai de novo, nada muda — ponto é por dezena **distinta**.
3. O máximo é **10 pontos** — a cartela completa.

Lançar o mesmo concurso duas vezes não muda nada (o sistema reconhece e ignora). Se o administrador digitar uma dezena errada e corrigir depois, **a rodada inteira é recalculada do zero**, na ordem dos concursos, e a correção fica exibida publicamente com data e motivo.

## 4. O ranking e os desempates

O ranking ordena as cartelas por:

1. **Mais pontos.**
2. Empatou? Ganha quem **completou seus pontos primeiro** — tecnicamente, quem acendeu a última bola no concurso mais antigo.
3. Ainda empatado? Quem **pagou a aposta primeiro**.
4. Por fim, **ordem alfabética do nome** — para a ordem ser sempre a mesma, sem sorteio nem critério oculto.

## 5. O dinheiro, centavo por centavo

- **Pote** = soma de todas as cartelas pagas (+ valor herdado da rodada anterior, se houver — ele aparece discriminado).
- **Prêmio principal**: 70% do pote, para quem fechar 10 pontos. Mais de um ganhador no mesmo concurso? Divide em partes iguais.
- **2º lugar**: 15% do pote, apurado só no encerramento (a melhor cartela que não ganhou o principal).
- **Administração**: 15% do pote.

Toda conta é feita em **centavos inteiros** — não existe arredondamento escondido. Quando uma divisão não fecha exata (ex.: R$ 42,00 dividido por 3 ganhadores... fecha; mas R$ 42,11 por 3 não), **a sobra de centavos vai para a administração**. É uma regra única, sempre a mesma, e o relatório final mostra exatamente quantos centavos foram de sobra.

A conta que tem que fechar **sempre**, e que o relatório confere na sua frente:

> prêmios pagos + administração (+ valor acumulado para a próxima rodada) = pote

- Percentuais são configuráveis por rodada, mas têm que somar 100% — o sistema recusa qualquer outra coisa.

## 6. Quando a rodada termina

- **Alguém fez 10 pontos** → a rodada encerra naquele mesmo concurso. Sorteios seguintes não valem.
- Por padrão, **não há limite de concursos**: os sorteios seguem valendo até alguém fechar os 10 pontos.
- O administrador **pode** configurar um limite de concursos na criação da rodada (isso aparece no regulamento). Nesse caso, se ninguém fizer 10 até o limite, vale a política publicada:
  - **paga a maior pontuação**, com os mesmos desempates; ou
  - **acumula**: o prêmio principal vira ponto de partida do pote da próxima rodada, e a atual paga só o 2º lugar e a administração.

O prêmio é pago pela administração **fora do sistema** (PIX direto ao ganhador); o sistema registra quando e como foi pago.

## 7. Como auditar

1. **Lista pública de cartelas**: a home mostra todas as cartelas pagas, com nome, telefone mascarado e as 10 dezenas, em lista imprimível. Imprima no dia do encerramento das apostas — é a sua prova de que nenhuma cartela mudou ou apareceu depois.
2. **Dezenas oficiais**: confira os concursos lançados com o resultado oficial da Caixa. O número do concurso e a data estão na home.
3. **Relatório de fechamento**: ao encerrar, o sistema gera um relatório com o financeiro completo (incluindo a conferência acima), todos os ganhadores, a classificação final, o histórico de sorteios e **toda intervenção manual** (baixa sem PIX, correção de concurso, cancelamento, estorno — sempre com motivo e responsável).
4. **Hash de integridade**: o rodapé do relatório traz um código SHA-256 calculado sobre o conteúdo do fechamento. Reimprimir o mesmo relatório gera **o mesmo código** — se dois participantes compararem os hashes das suas cópias e forem iguais, os documentos são idênticos.

## 8. Privacidade e responsabilidade

- O telefone **nunca** aparece completo em nenhuma página pública — sempre mascarado, como `(82) 99xxx-xx89`.
- Só coletamos nome e celular (e-mail é opcional). Dados são apagados 24 meses após o encerramento, ou antes, a pedido.
- Aposta é só para maiores de 18 anos, e é entretenimento: aposte o que não fará falta.
