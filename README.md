# Evolução!

Jogo pedagógico sobre seleção natural, camuflagem e reprodução. O jogador atua como predador e tenta extinguir uma população de organismos geométricos antes de 60 segundos.

[Jogar a versão publicada](https://andre-prof.github.io/evolucao/)

## Como jogar

1. Escolha a cor e a claridade do ambiente, a população inicial e o intervalo de reprodução.
2. Clique ou toque nos organismos para capturá-los.
3. Os sobreviventes geram descendentes que herdam seu tom, com variação aleatória opcional. A capacidade máxima é de 120 organismos.
4. Ao final, Darwin ajuda a interpretar as mudanças da população.

O gráfico de linhas mostra as proporções dos tons ao longo do tempo. Depois da explicação, o gráfico de barras mostra quantos indivíduos de cada tom restaram. As falas de Darwin são textos didáticos criados para o jogo, não citações históricas.

## Recursos

- Abertura e explicações contextualizadas com Darwin estilizado.
- Fundo da interface claro (azul bem claro) ou escuro, com preferência salva no navegador.
- Três paletas de ambiente: azul, laranja e violeta; cada uma com claridade clara, intermediária ou escura.
- Legendas numeradas e traçados distintos no gráfico de linhas.
- Novos tons são gerados dentro da paleta escolhida a cada nova partida, e a associação entre números e cores também é sorteada; acompanhe a cor, não memorize o número do tom.
- Contagem e cor de cada tom no gráfico de barras, inclusive quando a população é extinta.
- Anúncio imediato ao capturar o último indivíduo de uma cor, histórico das ocorrências e destaque das variantes que terminam sem sobreviventes. Se uma cor reaparecer por mutação, o jogo informa esse retorno.
- Aviso de limite populacional e explicação de Darwin sobre recursos e suspensão dos nascimentos.
- Pausa e retomada; pausa automática ao ocultar a página.

## Executar localmente

Site estático em HTML, CSS e JavaScript, sem instalação de dependências ou etapa de compilação.

Na pasta do projeto, execute:

```sh
python -m http.server 8000
```

Abra `http://localhost:8000`. As fontes do Google Fonts são opcionais; a interface usa fontes de sistema quando elas não estão disponíveis.

## Verificação da lógica

Com Node.js instalado:

```sh
node check.cjs
```

As verificações abrangem reprodução, limite populacional, extinção, pausa, paletas e interpretação dos resultados.

## Modelo pedagógico

Cada organismo tem um tom herdável que permanece constante durante sua vida. A reprodução é assexuada e simplificada: cada sobrevivente pode gerar um descendente por intervalo. Quando ativada, a variação sorteia um tom vizinho em 10% dos nascimentos; nos extremos da escala, o tom pode permanecer igual.

A camuflagem pode dificultar a captura. A quantidade final de indivíduos inclui descendentes e não equivale, sozinha, à probabilidade de sobrevivência. As escolhas do jogador, a posição dos organismos e o acaso também influenciam os resultados. Repetir partidas e controlar as condições permite comparar hipóteses.

Os cinco tons representam variantes da mesma espécie. Quando um tom termina com zero indivíduos, o jogo anuncia a extinção dessa variante na população ao final da rodada. As mutações continuam seguindo tons vizinhos em claridade, mesmo com a numeração embaralhada.

O limite de 120 organismos representa alimento e espaço limitados. Ao atingi-lo, o jogo suspende novos nascimentos. As capturas liberam espaço para nascimentos nas próximas oportunidades de reprodução; clicar não aciona diretamente a reprodução. O bloqueio é uma simplificação pedagógica, e Darwin indica se esse limite foi atingido na rodada.

## Arquivos

- `index.html`: interface, abertura e resultados.
- `game.js`: simulação, captura, reprodução, gráficos e explicações.
- `theme.js`: escolha e persistência do tema.
- `style.css`: aparência responsiva.
- `darwin.png`: ilustração de Darwin criada com geração de imagens por IA para este projeto.
- `check.cjs`: verificações da lógica.

## Referência

A proposta foi inspirada na dinâmica de predação e camuflagem do [Peppered Moths, do Ask A Biologist / Arizona State University](https://askabiologist.asu.edu/games-sims/peppered-moths-game/). Esta implementação foi criada para o projeto Evolução!; as imagens, os scripts de monitoramento e a biblioteca de áudio do site de referência não estão incluídos.
