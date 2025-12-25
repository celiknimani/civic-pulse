
import { PartyID, PartyInfo } from './types';

export const PARTIES: Record<PartyID, PartyInfo> = {
  [PartyID.LVV]: {
    id: PartyID.LVV,
    name: 'Lëvizja Vetëvendosje',
    leader: 'Albin Kurti',
    color: '#E30613',
    logo: '/logos/lvv.png',
    description: 'Programi "Siguri dhe Begati" (2025-2029). Synon investimin prej 1 miliard euro në ushtri, pagën minimale mbi 500€, dhe hapjen e 500,000 vendeve të reja të punës.'
  },
  [PartyID.PDK]: {
    id: PartyID.PDK,
    name: 'Partia Demokratike e Kosovës',
    leader: 'Bedri Hamza',
    color: '#00ADEF',
    logo: '/logos/pdk.jpg',
    description: 'Programi "Ardhmëria". Premton rritje 50% të pagave në sektorin publik, lirim nga tatimi për pagat deri në 400€, dhe ndërtimin e termocentralit "Kosova e Re".'
  },
  [PartyID.LDK]: {
    id: PartyID.LDK,
    name: 'Lidhja Demokratike e Kosovës',
    leader: 'Lumir Abdixhiku',
    color: '#003399',
    logo: '/logos/ldk.jpg',
    description: 'Vizioni "Rruga e Re". Fokusohet në investimet kapitale prej 5 miliardë eurove, ngritjen e koeficientit të pagave në 150, dhe gazifikimin e plotë të Kosovës.'
  },
  [PartyID.AAK]: {
    id: PartyID.AAK,
    name: 'Aleanca për Ardhmërinë e Kosovës',
    leader: 'Ramush Haradinaj',
    color: '#FFCC00',
    logo: '/logos/aak.jpg',
    description: 'Koalicioni AAK-Nisma-Konservatorët. Prioritet kryesor anëtarësimin direkt në NATO, rritjen ekonomike 7% dhe pagën mesatare 1000€.'
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
