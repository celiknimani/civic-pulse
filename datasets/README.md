# Deputetet Dataset Inputs

Ky projekt mund te gjeneroje dataset-in real te deputeteve nga transkriptet parlamentare.

## 1) Deputetet

Krijo `datasets/deputies.csv` me kolonat:

```csv
name,party,profile_url
Emri Mbiemri,LVV,https://www.kuvendikosoves.org/shq/deputetet/
```

`name` dhe `party` jane te detyrueshme.

## 2) Transkriptet

Vendos transkriptet te `datasets/transcripts/` ne nje nga formatet:

1. `*.json` me array:
```json
[
  {
    "speaker": "Emri Mbiemri",
    "text": "Deklarata ne seance...",
    "sessionId": "2026-04-11-seanca-12",
    "date": "2026-04-11"
  }
]
```

2. `*.txt` ku cdo rresht eshte:
```txt
Emri Mbiemri: Deklarata ne seance...
```

### Workflow per burimet ne `/methodology`

Sa here shtohet ose ndryshohet nje transkript parlamentar, duhet te rifreskohet lista e burimeve qe shfaqet te `/methodology`.
Kjo behet automatikisht nga skripti:

```bash
npm run build:transcript-sources
```

Ky skript lexon te gjitha `datasets/transcripts/*.json` dhe gjeneron:

`public/data/transcript-sources.json`

## 3) Gjenerimi

Ekzekuto:

```bash
npm run build:deputies
```

Output krijohet te:
- `public/data/deputies-analytics.json`
- `public/data/transcript-sources.json`

`npm run build:deputies` rifreskon te dyja automatikisht.

Shenim: temat e deputeteve tani klasifikohen sipas te njejtave kategori si filtrat kryesore te platformes
(`Drejtësia`, `Ekonomia`, `Siguria`, `Mirëqenia`, `Shëndetësia`, `Arsimi`, `Infrastruktura`, `Inovacioni`,
`Turizmi`, `Diaspora`, `Energjia`, `Sporti`, `Arti`, `Politika e Jashtme`).
