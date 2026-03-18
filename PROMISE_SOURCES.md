# Promise Update Sources

This is the canonical source registry used to generate `public/data/promise-sources.json`.
When you ask for promise updates, we use this list to narrow searches.

## Column Rules

- `source_id`: Stable unique ID (kebab-case).
- `type`: `government_website`, `minister_social`, `trusted_news`.
- `trust_tier`: `1` (official government), `2` (official minister social), `3` (trusted media corroboration).
- `promise_ids`: Comma-separated promise IDs or `*` for all promises.
- `tags`: Comma-separated keywords.
- `enabled`: `true` or `false`.
- `fetch_mode`: `html`, `rss`, `search`, `manual`.
- `url`: Absolute URL.

## Source Registry

| source_id | type | trust_tier | promise_ids | tags | enabled | fetch_mode | url |
|---|---|---:|---|---|---|---|---|
| gov-pm | government_website | 1 | * | kryeministri,qeveria,official | true | html | https://kryeministri.rks-gov.net/ |
| gov-mfa | government_website | 1 | 112,113,114,115,116,117,118 | ministry,foreign-affairs,official | true | html | https://mfa-ks.net/ |
| gov-justice | government_website | 1 | 1,98,99,100,101 | ministry,justice,official | true | html | https://md.rks-gov.net/ |
| gov-finance | government_website | 1 | 14,15,16,39 | ministry,finance,official | true | html | https://mfpt.rks-gov.net/ |
| gov-work-family | government_website | 1 | 3,32,33,34,35,40 | ministry,work-family,official | true | html | https://kryeministri.rks-gov.net/staff/andin-hoti/ |
| gov-defense | government_website | 1 | 2,8,9,10,104,107,108,110,111 | ministry,defense,official | true | html | https://mod.rks-gov.net/ |
| gov-interior | government_website | 1 | 102,103,105 | ministry,interior,official | true | html | https://mpb.rks-gov.net/ |
| gov-digital-public-admin | government_website | 1 | 19,20,21,22,23,30 | ministry,digitalization,public-admin,official | true | html | https://kryeministri.rks-gov.net/staff/lulezon-jagxhiu/ |
| gov-health | government_website | 1 | 6,54,55,56,57,58,59,60 | ministry,health,official | true | html | https://msh.rks-gov.net/ |
| gov-education | government_website | 1 | 5,41,42,43,44,45,46,47,48,49,50,51,52,53 | ministry,education,official | true | html | https://masht.rks-gov.net/ |
| gov-culture-tourism | government_website | 1 | 25,26,91,92,93,94,95,96,97 | ministry,culture,tourism,official | true | html | https://kryeministri.rks-gov.net/staff/saranda-bogujevci/ |
| gov-sport-youth | government_website | 1 | 86,87,88,89,90 | ministry,sport,youth,official | true | html | https://mkrs-ks.org/ |
| gov-local-government | government_website | 1 | 24,67,68,82 | ministry,local-government,official | true | html | https://mapl.rks-gov.net/ |
| gov-environment-spatial | government_website | 1 | 11,69,70,71,72,73,74,75 | ministry,environment,spatial,official | true | html | https://mmphi.rks-gov.net/ |
| gov-agriculture | government_website | 1 | 61,62,63,64,65,66 | ministry,agriculture,official | true | html | https://mbpzhr.rks-gov.net/ |
| gov-infrastructure | government_website | 1 | 76,77,78,79,80,81,83,84 | ministry,infrastructure,official | true | html | https://www.mit-ks.net/ |
| gov-trade | government_website | 1 | 17,18,28 | ministry,trade,official | true | html | https://mint.rks-gov.net/ |
| gov-economy | government_website | 1 | 4,7,12,13,36,37,38,85,119 | ministry,economy,energy,official | true | html | https://me.rks-gov.net/ |
| gov-communities-return | government_website | 1 | 31 | ministry,communities,return,official | true | html | https://mkk.rks-gov.net/ |
| gov-regional-development | government_website | 1 | 27,29 | ministry,regional-development,official | true | html | https://mzhr.rks-gov.net/ |
| social-albin-kurti-facebook | minister_social | 2 | * | social,facebook,prime-minister,albin-kurti | true | html | https://www.facebook.com/albini2017 |
| social-albin-kurti-x | minister_social | 2 | * | social,x,prime-minister,albin-kurti | true | html | https://x.com/albinkurti |
| social-glauk-konjufca-facebook | minister_social | 2 | 112,113,114,115,116,117,118 | social,facebook,minister,glauk-konjufca | true | html | https://www.facebook.com/GlaukKonjufca1981 |
| social-mfa-kosovo-facebook | minister_social | 2 | 112,113,114,115,116,117,118 | social,facebook,ministry,foreign-affairs | true | html | https://www.facebook.com/MFAKosovo |
| social-hekuran-murati-facebook | minister_social | 2 | 14,15,16,39 | social,facebook,minister,hekuran-murati | true | html | https://www.facebook.com/HekuranMurati |
| social-minfin-kosovo-facebook | minister_social | 2 | 14,15,16,39 | social,facebook,ministry,finance | true | html | https://www.facebook.com/MinistriaeFinancave |
| social-ejup-maqedonci-facebook | minister_social | 2 | 2,8,9,10,104,107,108,110,111 | social,facebook,minister,ejup-maqedonci | true | html | https://www.facebook.com/ejup.maqedonci1 |
| social-defense-ministry-facebook | minister_social | 2 | 2,8,9,10,104,107,108,110,111 | social,facebook,ministry,defense | true | html | https://www.facebook.com/OfficialMFSRKS |
| social-fitore-pacolli-facebook | minister_social | 2 | 11,69,70,71,72,73,74,75 | social,facebook,minister,fitore-pacolli | true | html | https://www.facebook.com/fitore.pacolli |
| social-mmph-facebook | minister_social | 2 | 11,69,70,71,72,73,74,75,76,77,78,79,80,81,83,84 | social,facebook,ministry,infrastructure,environment | true | html | https://www.facebook.com/mmph.rks |
| social-artane-rizvanolli-facebook | minister_social | 2 | 4,7,12,13,36,37,38,85,119 | social,facebook,minister,artane-rizvanolli | true | html | https://www.facebook.com/DrArtaneRizvanolli |
| social-economy-ministry-facebook | minister_social | 2 | 4,7,12,13,36,37,38,85,119 | social,facebook,ministry,economy | true | html | https://www.facebook.com/MinistriaeEkonomise/ |
| social-mimoza-kusari-lila-facebook | minister_social | 2 | 17,18,28 | social,facebook,minister,mimoza-kusari-lila | true | html | https://www.facebook.com/mimozakusari |
| social-mint-facebook | minister_social | 2 | 17,18,28 | social,facebook,ministry,trade | true | html | https://www.facebook.com/MINT.RKS/ |
| social-andin-hoti-facebook | minister_social | 2 | 3,32,33,34,35,40 | social,facebook,minister,andin-hoti | true | html | https://www.facebook.com/andin.hoti |
| social-elbert-krasniqi-facebook | minister_social | 2 | 24,67,68,82 | social,facebook,minister,elbert-krasniqi | true | html | https://www.facebook.com/elbert.krasniqi.5 |
| social-mapl-facebook | minister_social | 2 | 24,67,68,82 | social,facebook,ministry,local-government | true | html | https://www.facebook.com/maplks |
| social-lulezon-jagxhiu-linkedin | minister_social | 2 | 19,20,21,22,23,30 | social,linkedin,minister,lulezon-jagxhiu | true | html | https://www.linkedin.com/in/lulezon-jagxhiu-08669a4/ |
| social-lulezon-jagxhiu-facebook | minister_social | 2 | 19,20,21,22,23,30 | social,facebook,minister,lulezon-jagxhiu | true | html | https://www.facebook.com/lulezon |
| social-blerim-gashani-facebook | minister_social | 2 | 86,87,88,89,90 | social,facebook,minister,blerim-gashani | true | html | https://www.facebook.com/blerim.gashani |
| social-mkrs-facebook | minister_social | 2 | 86,87,88,89,90 | social,facebook,ministry,sport-youth | true | html | https://www.facebook.com/MKRS.MKOS.MCYS/ |
| social-hajrullah-ceku-facebook | minister_social | 2 | 5,41,42,43,44,45,46,47,48,49,50,51,52,53 | social,facebook,minister,hajrullah-ceku | true | html | https://www.facebook.com/ceku.hajrulla |
| social-mashti-facebook | minister_social | 2 | 5,41,42,43,44,45,46,47,48,49,50,51,52,53 | social,facebook,ministry,education | true | html | https://www.facebook.com/MASHTI.rks/ |
| social-arben-vitia-facebook | minister_social | 2 | 6,54,55,56,57,58,59,60 | social,facebook,minister,arben-vitia | true | html | https://www.facebook.com/arben.vitia.3 |
| social-health-ministry-facebook | minister_social | 2 | 6,54,55,56,57,58,59,60 | social,facebook,ministry,health | true | html | https://www.facebook.com/Ministria.Shendetesise.RKS |
| social-dimal-basha-facebook | minister_social | 2 | 76,77,78,79,80,81,83,84 | social,facebook,minister,dimal-basha | true | html | https://www.facebook.com/dimalbasha1 |
| social-armend-muja-facebook | minister_social | 2 | 61,62,63,64,65,66 | social,facebook,minister,armend-muja | true | html | https://www.facebook.com/armendmuja13 |
| social-mbpzhr-facebook | minister_social | 2 | 61,62,63,64,65,66 | social,facebook,ministry,agriculture | true | html | https://www.facebook.com/mbpzhr |
| social-donika-gervalla-facebook | minister_social | 2 | 1,98,99,100,101 | social,facebook,minister,donika-gervalla | true | html | https://www.facebook.com/donikagervallakosova |
| social-justice-ministry-facebook | minister_social | 2 | 1,98,99,100,101 | social,facebook,ministry,justice | true | html | https://www.facebook.com/MinistriaeDrejtesise/ |
| social-nenad-rashiq-facebook | minister_social | 2 | 31 | social,facebook,minister,nenad-rashiq | true | html | https://www.facebook.com/profile.php?id=100089805291177 |
| social-rasim-demiri-facebook | minister_social | 2 | 27,29 | social,facebook,minister,rasim-demiri | true | html | https://www.facebook.com/rasim.demiri.3 |
| social-mzhr-facebook | minister_social | 2 | 27,29 | social,facebook,ministry,regional-development | true | html | https://www.facebook.com/mzhr.rks |
| social-saranda-bogujevci-facebook | minister_social | 2 | 25,26,91,92,93,94,95,96,97 | social,facebook,minister,saranda-bogujevci | true | html | https://www.facebook.com/saranda.bogujevci |
| social-xhelal-svecla-facebook | minister_social | 2 | 102,103,105 | social,facebook,minister,xhelal-svecla | true | html | https://www.facebook.com/profile.php?id=100063788556625 |
| social-mpb-facebook | minister_social | 2 | 102,103,105 | social,facebook,ministry,interior | true | html | https://www.facebook.com/RKS.MPB/ |
| media-koha | trusted_news | 3 | * | media,news,corroboration | true | html | https://www.koha.net/ |
| media-kallxo | trusted_news | 3 | * | media,news,corroboration | true | html | https://kallxo.com/ |
| media-telegrafi | trusted_news | 3 | * | media,news,corroboration | true | html | https://telegrafi.com/ |
| media-indeksonline | trusted_news | 3 | * | media,news,corroboration | true | html | https://indeksonline.com/ |
| media-rtk | trusted_news | 3 | * | media,news,corroboration | true | html | https://www.rtklive.com/ |

## Workflow

1. Generate JSON: `npm run build:promise-sources`.
2. Review `public/data/promise-sources.json`.
3. Use filtered sources for update checks.
4. Apply promise data updates only after review/approval.
