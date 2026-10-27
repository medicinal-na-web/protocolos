# Protocolos — Medicinal Farmácia e Manipulação

Padrão visual dos **Guias de Formulações**. O conteúdo de cada protocolo fica num
arquivo `protocolo.yaml` e o template gera o PDF A4 com a identidade da marca.

```
marca/                  logo, selos e fonte Montserrat (fixos da marca)
template/               layout (guia.css) e conectores das linhas (conectores.js)
protocolos/<slug>/      protocolo.yaml + artes/ (imagens daquele protocolo)
saida/<slug>.pdf        PDF gerado
scripts/build.mjs       gerador
```

## Gerar os PDFs

```bash
npm install
npm run build              # todos
npm run build -- disbiose  # só um
```

Gera `saida/<slug>.pdf` e prévias em `saida/<slug>/pagina-N.png`. O build avisa se
alguma página passou da área útil.

## Criar um protocolo novo

1. Copie `protocolos/disbiose/` para `protocolos/<novo>/`.
2. Edite o `protocolo.yaml`:
   - `cor.escura` / `cor.clara`: cor do protocolo (degradê da capa, selos IN/OUT, selo do canto, logo da capa).
   - `qr`: link do "Copie a fórmula aqui" (padrão `https://medicinal.vip/protoc_<Tema>?r=qr`).
   - `paginas`: cada página é uma lista de blocos, na ordem em que aparecem.
3. Coloque as artes em `protocolos/<novo>/artes/` e rode o build.

### Blocos

| Bloco | Uso |
|---|---|
| `formula` | Card da fórmula: `nome`, `subtitulo`, `via` (IN oral / OUT tópico), `periodo` (`dia`, `noite` ou ambos), `ativos` (marque `destaque: true` para ligar ao texto explicativo), `modo_de_uso`, `arte` opcional ao lado, `qr: false` para esconder o QR |
| `destaques` | Textos dos ativos-chave, ligados por linhas aos ativos com `destaque: true` da mesma página. Para uma foto de produto ao lado do texto, use `{ arte: { src, largura }, itens: [...] }` |
| `faixa` | Imagem de margem a margem que some no branco com degradê em cima e embaixo; aceita `etiqueta` por cima |
| `texto` | Bloco educativo com `etiqueta`, `imagem` e `paragrafos` |
| `tabela` | `titulo`, `colunas`, `linhas` (lista de listas) e `nota`; células aceitam `**negrito**` |
| `espaco` | Espaço vertical em mm |

Nos textos, `**assim**` vira **negrito**. Se a linha começar com `**`, coloque o texto entre aspas simples.

## Artes (Runway)

Para manter a mesma linguagem visual entre os protocolos:

- **Capa**: imagem científica (microscopia/histologia) nos tons do protocolo, 3:4.
- **Produto**: fotografia de estúdio em fundo branco, luz difusa, sem texto.
- **Faixas**: macro de textura (espuma, pó, gel) em fundo branco, 16:9.
- **Ilustrações**: 3D médico em cena que preenche todo o quadro (formato largo, 21:9 ou 16:9), usadas em `faixa`.

**Regra:** nada de imagem recortada com contorno aparente. Ilustrações ocupam a página
de margem a margem e somem no branco com degradê; fotos ao lado dos cards se fundem
com a página.
