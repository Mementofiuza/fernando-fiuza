// Conteúdo curado a partir de www.fernandofiuza.com.br

const BASE = "https://www.fernandofiuza.com.br/images/Fiuza";

export type Doc = { title: string; url: string; category: string; year?: string };

export const articles: Doc[] = [
  { title: "A experiência brasileira no controle da multidroga-resistência", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_aexperienciabrasileiranocontroledamultidrogaresistencia.pdf` },
  { title: "Análise dos casos de asmas com tratamento intercrise – Instituto Clemente Ferreira", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_analisedoscasosdeasmascomtratamento.pdf` },
  { title: "Characterization of the genetic diversity of M. tuberculosis in São Paulo city, Brazil", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_characterizationofthegeneticdiversityofmtuberculosisinsoopaulocitybrazil.pdf` },
  { title: "Aspectos epidemiológicos da tuberculose multirresistente em SP", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_aspectosepidemiologicosdatuberculosemultirresistenteemservicodereferencianacidadedesaopaulo.pdf` },
  { title: "A Tuberculose multirresistente no Brasil", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_atuberculosemultiresistentenobrasilfiuzaseiscentoidenetonoronhacruz.pdf` },
  { title: "Avaliação de uma sonda genética (Accuprobe) para identificação de M. tuberculosis", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_Avaliacao%20de%20uma%20sonda%20genetica.pdf` },
  { title: "II Consenso Brasileiro de Tuberculose – Diretrizes 2004", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_iiconsensobrasileirodetuberculosediretrizesbrasileirasparatuberculose.pdf` },
  { title: "Drogas antituberculose: interações e efeitos – Parte 1", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_Drogas%20antituberculose%20Interacoes%20medicamentosas_Farmacos%20Primeira%20Linha.pdf` },
  { title: "Efetividade do Esquema 3 (3SZEEt/9EEt) no retratamento da Tuberculose", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_efetividadedoesquema3noretratamentodatbnarotinadasunidadesdesaude.pdf` },
  { title: "Inclusão de uma Fluoroquinolona no esquema de reserva", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_inclusaodeumafluoroquinolonanoesquemadereserva.pdf` },
  { title: "Individuals with Pulmonary Tuberculosis have lower CD1d Restricted NKT Cells", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_individualswithpulmonarytuberculosishavelowerlevelsofcirculating.pdf` },
  { title: "Metronidazol no tratamento e profilaxia da Tuberculose", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_metronidazolnotratamentoeprofilaxiadatbpossibilidadesdeuso.pdf` },
  { title: "Rendimento da cultura de escarro – sistema automatizado vs. Löwenstein-Jensen", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_Rendimento%20escarro.pdf` },
  { title: "Diagnóstico da tuberculose pleural pela ADA (Tese de Doutorado)", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_resumotesedoutoradofolhamedica2000.pdf`, year: "2000" },
  { title: "Teste tuberculínico", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_testetuberculinico.pdf` },
  { title: "Tuberculosis with extensive resistance to drugs in São Paulo, Brazil", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_tuberculosiswithextensiveresistancetodrugsinatuberculosis.pdf` },
  { title: "Tuberculosis in adults", category: "Artigos", url: `${BASE}/Artigos%20e%20Capitulos%20de%20livros/OK_tuberculosisinadults.pdf` },
];

export const lectures: Doc[] = [
  { title: "Etiologia da Multirresistência na Tuberculose", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_etiologiadamultiressistencianatuberculose.pdf` },
  { title: "História das Normas Técnicas para o Controle da Tuberculose – Parte 1", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_ahistoriadasnormastecnicasparaocontroledatbnobrasilparteum.pdf` },
  { title: "História das Normas Técnicas para o Controle da Tuberculose – Parte 2", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_ahistoriadasnormastecnicasparaocontroledatbnobrasilpartedois.pdf` },
  { title: "A origem da multirresistência na Tuberculose", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_aorigemdamultiresistencianatuberculoseouoqueeuteriaparaprovocalos.pdf` },
  { title: "Apresentação do ICF em Reunião da CCD-SSP-SP", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_apresentacaodoicfemreuniaodaccdsssp.pdf` },
  { title: "Apresentação do Livro Controle da Tuberculose", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_apresentacaolivrocontroledatuberculoseumapropostadeintegracaoensinoservico.pdf` },
  { title: "As bases e fundamentos do tratamento da Tuberculose", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_asbasesefundamentosdotratamentodatuberculose.pdf` },
  { title: "Desafios e riscos do Programa de Controle da Tuberculose", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_desafioseriscosdoprogramadecontroledatuberculose.pdf` },
  { title: "Tuberculose extrapulmonar", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_tuberculoseextrapulmonar.pdf` },
  { title: "Um caso para discutir e aprender", category: "Aulas", url: `${BASE}/Aulas%20e%20Palestras/X_umcasoparadiscutireaprender.pdf` },
];

export const cronicas: Doc[] = [
  { title: "A história não terminada de um questionamento (RMP em jejum)", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_ahistorianaoterminadadeumquestionamento.pdf` },
  { title: "Amores e amantes – Crônica inédita", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_amoreseamantes.pdf` },
  { title: "Aos sessenta, rever e continuar", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_aossessentareverecontinuar.pdf` },
  { title: "Artrite reumatoide, terapia imunossupressora e Tuberculose", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_artritereumatoideterapiaimunossupressoratuberculose.pdf` },
  { title: "A Tuberculose, o suicídio e a Doutora Petitflor", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_atuberculoseosuicidioeadoutorapetitflor.pdf` },
  { title: "Carta a um paciente portador de Tuberculose Multirresistente", category: "Cartas", url: `${BASE}/Cronicas%20e%20Cartas/OK_cartaaumpacienteportadordetuberculosemultirresistente.pdf` },
  { title: "Carta enviada à revista Veja", category: "Cartas", url: `${BASE}/Cronicas%20e%20Cartas/OK_cartaenviadaaveja17nov1992.pdf`, year: "1992" },
  { title: "Currículo político-profissional", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_curriculopoliticoprofissional.pdf` },
  { title: "Delmiro, o coçado que curou a tuberculose", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_delmiroococadoquecurouatuberculose.pdf` },
  { title: "Depoimento ao Museu da Pessoa", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_depoimentoaomuseudapessoa.pdf` },
  { title: "Sobre Margarida – Crônica inacabada", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_escritoinacabadosobremargarida.pdf` },
  { title: "Impressões de uma expedição médico-científica no rio Tapajós", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_impressoesempiricasdeumaexpedicaomedicacientificanoriotapajos.pdf` },
  { title: "In Memoriam a Mozart Tavares de Lima Filho", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_inmemoriammozarttavaresdelimafilho.pdf` },
  { title: "Mudanças no perfil da tuberculose no país", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_mudancasnoperfildatuberculosenopaisumanovarealidade.pdf` },
  { title: "O dia em que conheci um homem digno", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_odiaemqueconheciumhomemdigno.pdf` },
  { title: "Uma expedição pelo Trombetas – Crônica inédita", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_umaexpedicaopelotrombetaspelaslembrancasdevida.pdf` },
  { title: "Zémaria, a tosse e a fé no tratamento da tuberculose", category: "Crônicas", url: `${BASE}/Cronicas%20e%20Cartas/OK_zemariaatosseeafenotratamentodatuberculose.pdf` },
];

export const homenagens: Doc[] = [
  { title: "Apresentação da SPPT por Jorge Afiune", url: `${BASE}/Mensagens%20e%20Homenagens/Aoresentacao%20Afiune_Fernando%20Homenagem%20SPPT.pdf`, category: "Homenagem" },
  { title: "Depoimentos de sócios da SBPT", url: `${BASE}/Mensagens%20e%20Homenagens/OK_depoimentosdesociossbpt.pdf`, category: "Depoimentos" },
  { title: "Homenagem póstuma – IV Congresso HUJBB", url: `${BASE}/Mensagens%20e%20Homenagens/OK_homenagemduranteoivcongressodohospitaluniversitariojoaodebarrosbarreto.pdf`, category: "Homenagem" },
  { title: "Marcador de livro em homenagem familiar", url: `${BASE}/Mensagens%20e%20Homenagens/OK_marcadorfernandofiuza.pdf`, category: "Família" },
  { title: "Livreto da Missa de Sétimo Dia – Igreja da Sé (16/Jul/2011)", url: `${BASE}/Mensagens%20e%20Homenagens/OK_missafernandobelem.pdf`, category: "Memorial", year: "2011" },
  { title: "Texto de Carlos Basilia – Fórum ONGs Tuberculose RJ", url: `${BASE}/Mensagens%20e%20Homenagens/OK_notadefalecimentoforumongstuberculoserj.pdf`, category: "Memorial" },
  { title: "Nota de pesar do CREMESP", url: `${BASE}/Mensagens%20e%20Homenagens/OK_notadepesarcremesp.pdf`, category: "Memorial" },
  { title: "Nota de falecimento – CCD/SES-SP", url: `${BASE}/Mensagens%20e%20Homenagens/OK_notafalecimentobepa.pdf`, category: "Memorial" },
  { title: "Notícias veiculadas em sites e jornais", url: `${BASE}/Mensagens%20e%20Homenagens/OK_noticiasveiculadasemsitesejornais.pdf`, category: "Imprensa" },
  { title: "Boletim Especial da SBPT – vida pessoal e profissional", url: `${BASE}/Mensagens%20e%20Homenagens/OK_sbptboletimespecial.pdf`, category: "Homenagem" },
];

export const galleryImages = [
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Casamento%201968.jpg`, caption: "Casamento, 1968" },
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Churrasco%20no%20Clube%20dos%20medicos%201980.jpg`, caption: "Clube dos Médicos, SP, 1980" },
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Fernando%20e%20Margarida%201962.jpg`, caption: "Dançando com Margarida, 1962" },
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Formatura%20com%20pai%201968.jpg`, caption: "Dia da Formatura, 1968" },
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Foto%20Calendario%20Museu%20da%20pessoa%201.jpg`, caption: "Calendário Museu da Pessoa" },
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Foto%20Calendario%20Museu%20da%20pessoa%202.jpg`, caption: "Calendário Museu da Pessoa II" },
  { src: `${BASE}/Galeria%20de%20Imagens/De%20volta%20ao%20passado/Quadro%20Formatura%20Medicina%201968.jpg`, caption: "Formandos em Medicina, UFPA, 1968" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%201_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%202_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%203_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%204_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%205_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%206_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
  { src: `${BASE}/Galeria%20de%20Imagens/Angola/OK_Angola%207_jan.2009.jpg`, caption: "Angola, janeiro de 2009" },
];

export const honorImages = [
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_50%20Pizza%20Clinica%20SPPT.jpg`, caption: "Homenagem da SPPT na Pizza Clínica" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_exatletasdotimedebasquetedoclubepaysanduquefizeramhistorianosanos60e70.jpg`, caption: "Atletas de basquete – Paysandu Sport Club" },
  { src: new URL("../assets/homenagem-vitor-guedes.jpg", import.meta.url).href, caption: "Homenagem prestada por Vitor Guedes" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_fotocalendariomuseudapessoa2.jpg`, caption: "Homenagem do Museu da Pessoa" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_lancamentolivropaixaocorinthiana.jpg`, caption: "Lançamento do livro Paixão Corinthiana" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_placahomenagemcongressoSBPT.jpg`, caption: "Placa de homenagem – XXXV Congresso SBPT, 2010" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_placahomenagemcursodegestaoemprogramasdetuberculosecrhfenspfiocruz_22outubro.jpg`, caption: "Placa – Curso de Gestão em Programas de TB" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_placahomenagemdelurceeelisabete.jpg`, caption: "Placa – orientandas de Doutorado" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_placahomenagemdivisaotbsp_22outubro.jpg`, caption: "Placa – Divisão de Tuberculose SES-SP" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_premioicf1987.jpg`, caption: "Prêmio Clemente Ferreira, 1987" },
  { src: `${BASE}/Mensagens%20e%20Homenagens/OK_tituloamb1978.jpg`, caption: "Título de Especialista AMB, 1978" },
];

export const timeline = [
  { year: "1944", title: "Nascimento", text: "Nasce em Belém do Pará, em uma família de raízes amazônicas." },
  { year: "1968", title: "Formatura em Medicina – UFPA", text: "Conclui a graduação em Medicina pela Universidade Federal do Pará." },
  { year: "1978", title: "Título de Especialista – AMB", text: "Recebe o Certificado de Especialista em Tisiologia pela Associação Médica Brasileira." },
  { year: "1987", title: "Prêmio Clemente Ferreira", text: "Conquista o Prêmio Clemente Ferreira, um dos mais importantes em pneumologia." },
  { year: "1992", title: "Atuação como referência", text: "Dirige o Instituto Clemente Ferreira e consolida-se como referência em tuberculose multirresistente." },
  { year: "2000", title: "Doutorado", text: "Defende tese sobre diagnóstico da tuberculose pleural pela ADA." },
  { year: "2004", title: "II Consenso Brasileiro de TB", text: "Co-autor das Diretrizes Brasileiras para Tuberculose 2004." },
  { year: "2010", title: "Homenagem SBPT", text: "Recebe placa de homenagem no XXXV Congresso da SBPT em Curitiba." },
  { year: "2011", title: "Legado", text: "Falece em julho de 2011, deixando um legado científico e humano inestimável." },
];

export const tributes = [
  { name: "Sociedade Brasileira de Pneumologia e Tisiologia", text: "Um dos mais brilhantes pneumologistas do Brasil, mestre generoso e referência inquestionável no enfrentamento da tuberculose." },
  { name: "Conselho Regional de Medicina – CREMESP", text: "Sua dedicação à medicina pública e à pesquisa científica deixa um legado que inspira gerações." },
  { name: "Fórum ONGs Tuberculose – RJ", text: "Lutador incansável pela saúde pública. Sua voz ecoará em cada paciente tratado com dignidade." },
  { name: "Divisão de Tuberculose – SES-SP", text: "Construiu, com a equipe, as bases técnicas que ainda hoje orientam o controle da TB no estado de São Paulo." },
  { name: "Hospital Universitário João de Barros Barreto", text: "Filho ilustre do Pará, sua trajetória honra a medicina brasileira e a memória de sua terra natal." },
  { name: "Vitor Guedes – Jornal Agora", text: "Médico, pesquisador, esportista, amigo. Fernando viveu intensamente todas as dimensões da existência." },
];
