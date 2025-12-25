
import { PartyID, PartyInfo } from './types';

export const PARTIES: Record<PartyID, PartyInfo> = {
  [PartyID.LVV]: {
    id: PartyID.LVV,
    name: 'Lëvizja Vetëvendosje',
    leader: 'Albin Kurti',
    color: '#E30613',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Logo_of_Vet%C3%ABvendosje.svg/512px-Logo_of_Vet%C3%ABvendosje.svg.png',
    description: 'Fokusohet në sovranitetin shtetëror, transferet sociale (dyfishimi i shtesave për fëmijë) dhe rritjen industriale përmes Bankës Zhvillimore.'
  },
  [PartyID.PDK]: {
    id: PartyID.PDK,
    name: 'Partia Demokratike e Kosovës',
    leader: 'Memli Krasniqi',
    color: '#00ADEF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Partia_Demokratike_e_Kosov%C3%ABs_Logo.svg/512px-Partia_Demokratike_e_Kosov%C3%ABs_Logo.svg.png',
    description: 'Platformë e qendrës së djathtë që thekson liberalizimin ekonomik dhe forcimin e shtetit të së drejtës.'
  },
  [PartyID.LDK]: {
    id: PartyID.LDK,
    name: 'Lidhja Demokratike e Kosovës',
    leader: 'Lumir Abdixhiku',
    color: '#003399',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Lidhja_Demokratike_e_Kosov%C3%ABs.svg/512px-Lidhja_Demokratike_e_Kosov%C3%ABs.svg.png',
    description: 'Programi "Rruga e Re" me fokus në buxhetin 5 miliardë euro, gazifikimin dhe koeficientin e pagave 150.'
  },
  [PartyID.AAK]: {
    id: PartyID.AAK,
    name: 'Aleanca për Ardhmërinë e Kosovës',
    leader: 'Ramush Haradinaj',
    color: '#FFCC00',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Alliance_for_the_Future_of_Kosovo_logo.svg/512px-Alliance_for_the_Future_of_Kosovo_logo.svg.png',
    description: 'Udhëheq koalicionin me objektiv rritjen 7% të BPV-së dhe qasje të sigurisë për anëtarësim direkt në NATO.'
  },
  [PartyID.LISTA_GUXO]: {
    id: PartyID.LISTA_GUXO,
    name: 'Guxo',
    leader: 'Donika Gërvalla-Schwarz',
    color: '#800080',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Logo_Guxo.png/256px-Logo_Guxo.png',
    description: 'Fokus në reformën e qeverisjes dhe diplomacinë ndërkombëtare (partner i koalicionit me LVV).'
  },
  [PartyID.NISMA]: {
    id: PartyID.NISMA,
    name: 'Nisma Socialdemokrate',
    leader: 'Fatmir Limaj',
    color: '#FF8C00',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Nisma_Socialdemokrate_logo.png/256px-Nisma_Socialdemokrate_logo.png',
    description: 'Partner social-demokrat në koalicionin me AAK me fokus në mbrojtjen e punëtorëve dhe pagën mesatare 1000 EUR.'
  }
};

export const INITIAL_PROMPT = "Programet zyrtare për zgjedhjet e 28 dhjetorit 2024 janë analizuar. Mund të ofroj krahasime specifike për rritjen ekonomike, pagën minimale, shtesat për fëmijë ose projektet energjetike. Çfarë dëshironi të krahasoni?";
