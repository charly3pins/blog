+++
title = "Què he après definint el Procés de Selecció per a Enginyer/a de Software a l'startup on treballo"
date = "2021-05-04"
author = "charly3pins"
description = "Aprenentatge i consells que puc compartir amb tu després de tres mesos entrevistant diferents candidats/es."

slug = "Què he après definint el Procés de Selecció per a Enginyer de Software a l'startup on treballo"
tags = ["life", "startup"]

image = "/images/software_engineer_word_cloud.jpg"
+++
## Introducció

Treballo a [AREX Markets](https://arex.io) des de Novembre 2018 i des de llavors, l'empresa ha canviat molt. Quan vaig entrar érem un equip que no arribava a 10 persones (~5 tècniques) i ara som a prop de les 50. L'ambient de les startup sempre m'ha agradat més que el d'una gran companyia per tots els reptes que això comporta. Has de fer moltes coses i estar involucrat en molts temes, ja siguin del teu lloc de treball o altres no relacionats, i això m'agrada molt. Durant les últimes setmanes, o millor dit mesos, hem estat entrevistant a molta gent ja que estem creixent en termes de negoci i necessitem necessitem escalar l'equip tècnic, així que vam començar amb la contractació de més enginyers/es de software.

El primer pas va ser definir quin tipus de **Procés de Selecció** volíem seguir. Ho vam fer tot l'equip junts i això va ser el primer de valor que vam poder extreure. Si pretens definir un procés de selecció en la teva empresa sense l'aportació de l'equip que participarà en ell, això és dolent. Tots han de dir la seva i participar en aquesta part, ja que més endavant seran part d'ella i, si tot surt bé, el nou membre s'unirà a l'equip, pel que han de sentir-se còmodes amb la decisió.

Dit això, segur que t'estàs preguntant quin és aquest procés? Permet-me resumir-ho en les següents línies.

## Procés de Selecció

*-* En primer lloc, el responsable de contractació té una **trucada** amb el candidat per explicar-li els detalls de l'equip, el stack tecnològic, les tasques que assumirà i bàsicament conèixer-lo i aclarir els possibles dubtes que pugui tenir.

*-* Si la trucada va bé, el següent pas és fer la **Prova tècnica**. Per a això oferim 3 opcions:

- **Prova tècnic**. Repte clàssic que li envies al candidat un exercici per resoldre en X dies.

- **Portafoli tècnic**. Si el candidat té un/varis projecte(s) que cobreix(in) els requisits mínims esperats en la prova tècnica, pot compartir-los amb l'equip en lloc de realitzar aquest repte. (Per exemple: compartir el repositori en GitHub).

- **Sessió de programació en viu**. Invitació al candidat a fer una sessió de programació junts a la nostra oficina. (Per raons òbvies durant aquest any aquesta opció no ha estat possible).

*-* **Revisió tècnica**. L'equip revisa el codi del candidat i té una trucada amb ell on donen feedback del codi revisat i fan preguntes i aclareixen dubtes al candidat més enfocat en l'equip i la part tecnològica.

*-* **Entrevista de Producte**. Si la revisió tècnica es supera, l'últim pas és una trucada amb l'equip de Producte per veure si el candidat, a més de tenir les habilitats tècniques necessàries (validades en la fase anterior), té la mentalitat i actitud que l'equip necessita.

*-* **Comentaris finals**. Després de l'última trucada, el candidat rep feedback tant si és contractat o no. Segons el cas és una trucada o un correu electrònic.

Com es pot veure, el procés no és súper innovador ni disruptiu, però és el que tots vam acordar i amb el qual ens sentim còmodes treballant. Una cosa que vull destacar és la fase de la part tècnica. Tots hem estat en entrevistes abans i volíem fer el procés que ens hagués agradat trobar si haguéssim estat els entrevistats. Per aquesta raó, vam oferir l'opció de mostrar el codi ja fet en lloc de demanar una prova tècnica "sí o sí". Això era una part imprescindible perquè tots hem passat moltes hores fent una prova tècnica i després acabem sense cap comentari, només un correu electrònic dient "gràcies per participar, però lamentem que no siguis l'escollit". Aquest és el primer punt i el segon està relacionat amb l'última frase. Vam acordar fer una trucada telefònica a tots els candidats que presentèssin la prova tècnica, encara que no ens agradés o tinguéssim dubtes, la trucada era imprescindible. Vam fracassar en aquesta part perquè al final, amb molts candidats a la vegada, vam haver de cancel·lar, crec, 2-3 trucades, però per al 90% restant ho vam aconseguir. Això va ser realment útil per a nosaltres per aclarir els dubtes durant la revisió del codi i fer més preguntes i aprofundir en alguns temes amb els candidats. També per veure com reaccionen davant el feedback positiu/negatiu i el tipus de respostes o arguments que van intentar fer servir per justificar les coses incorrectes. Això va ser realment productiu en la meva opinió i la part que més vaig gaudir en tot el procés. A més, el feedback final era una altra cosa obligatòria per a nosaltres pel que elaborem una llista amb les coses que volíem comentar encara que fos un candidat rebutjat, però per tal de donar-li la major informació possible per saber per què no ho triem.

## Revisió del codi

Centrant-me en les revisions el codi, vaig elaborar una llista amb les coses més comuns que vam trobar durant aquesta fase i crec que és important compartir-la ja sigui de cara a si ets entrevistador però també si et van a entrevistar i estàs a la part de la prova tècnica, verifica aquests punts abans d'enviar-la:

*-* **README pobre**. Aquest va ser el problema més gran que vam trobar en tots els candidats. Excepte uns pocs, la majoria va proporcionar un README molt breu sense indicacions sobre com executar el projecte, o no prou detallat. Cap indicacció sobre les dependències necessàries (si es requereix descarregar o instal·lar alguna cosa per executar). Cap explicació de les comandes (si es proporciona Makefile). Cap explicació sobre què tracta el projecte (especialment important amb els quals no estaven resolent la nostra Prova Tècnica). Falta de TODO amb les coses pendents que no van ser possibles de cobrir però afegides allà com una invitació per a ser discutides en la trucada de revisió tècnica.

*-* **Tests que fallen**. Algunes de les proves, afortunadament només algunes, no passaven els seus propis tests. Bàsicament, això significa que el candidat no els va executar abans d'enviar la prova i això és un senyal d'alerta per a aquest apartat.

*-* **Molt pocs comentaris en tot el codi**. Seré honest amb tu, no m'agraden els comentaris en el codi. Per a mi, un codi que necessita comentaris és un codi complex. Per tant, el codi ha de ser prou simple com perquè sigui comprensible sense comentaris, en cas contrari, s'està complicant massa. Dit això, en Go la documentació s'autogenera per als tipus, funcions, mètodes, etc... exportats a partir dels comentaris. Així que aquests comentaris són els que accepto i personalment crec que són necessaris per a entendre el context, però no els comentaris com "aconseguir usuari" una línia sobre de "repo.getuser()".

*-* **Codi comentat**. Algunes proves van arribar amb molt codi comentat. No els comentaris que estava dient abans que són per documentar. Em refereixo al codi comentat amb `//` o blocs complets `/* */`. Tots sabem que per a les proves tècniques en específic, generalment, el temps que es té és limitat, ja que estàs treballant en un lloc i vols canviar. A més t'apuntes a diverses ofertes alhora per tenir més opcions. Per tant, pots acabar amb N proves per lliurar durant la mateixa setmana, a més de la teva feina diària i la teva "vida real". Però si revises ràpidament el teu codi, trobaràs fàcilment si vas comentar algun tros de codi només per provar o per a una primera idea i després no el necessites. En aquest cas esborra'l abans d'enviar-lo.

*-* **Valors harcoded**. En relació amb el punt anterior, hi va haver moltes proves amb valors harcoded que van fer que l'equip de revisió de la prova hagués de tocar el codi per poder executar-lo o fer que els tests passessin. En la mesura del possible, intenta utilitzar variables d'entorn o proporcionar un fitxer de configuració. I si res d'això és possible, al menys afegeix una secció al README amb les coses que potser s'hagin de modificar ja que només funcionaran al teu local.

## Resultats

Un cop aplicat tot això i haver iterat durant aquests mesos els números crec que son força bons. Hem fet tots un esforç molt gran dedicant molt temps al procés de selecció ja sigui buscant candidats, estant en trucades telefòniques, revisant codi o donant feedback sobre els candidats. Hem aconseguit crèixer l'equip en aproximadament 12 persones en 3 mesos! En el futur tinc pensat publicar un nou post sobre com hem organitzat els equips i com ha anat la integració de tots els company/es nous/es que han entrat a l'equip.

Comenta els teus aprenentatges i consells durant els teus processos de selecció o entrevistes aquí o contacta amb mi en les meves xarxes socials per a qualsevol comentari, pregunta o suggeriment perquè tots puguem aprendre els uns dels altres i millorar els processos de selecció del nostre sector.
