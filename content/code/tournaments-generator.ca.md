+++
title = "Tournaments generator"
date = "2020-05-01"
author = "charly3pins"
description = "Prova del concepte de creació d'una aplicació per gestionar tornejos FIFA 20 entre diferents persones que utilitzen Flutter per crear una aplicació mòbil i Go per crear una API que actua com a servidor. També es va utilitzar Python per construir rascadors senzills."

section = "/code"
weight = "2"

tags = ["go", "flutter", "python"]
+++
## PER QUÈ

La motivació per iniciar aquest projecte no és una altra que la meva curiositat per les aplicacions mòbils. És obvi que la forma de consumir tecnologia ha canviat en els darrers anys i que cada vegada es fa més a través d’un dispositiu mòbil. Per aquest motiu, volia explorar com funcionen les aplicacions mòbils i com en puc crear una des de zero.
Vaig fer alguns tutorials d'Android, però com que canvien moltes coses en publicar noves versions i la meva idea era construir quelcom genèric per a tots els dispositius, vaig decidir provar-ho amb [Flutter](https://flutter.dev/).

Estava entre [React Native](https://reactnative.dev/) o Flutter, però després de llegir alguns pros i contres, he decidit aliar-me amb Flutter. Vaig començar a llegir la seva [documentació](https://flutter.dev/docs) i era molt similar a Android (utilitzen Dart a la part inferior) i vaig començar a recordar els meus vells temps als tutorials d'Android i m'agrada, així que Vaig continuar. Després d’uns dies llegint només documentació tècnica, vaig continuar amb l’aplicació "hello world" [tutorial](https://flutter.dev/docs/get-started/codelab) que ofereixen al lloc web. I, finalment, estava preparat per començar el meu propi projecte.

Durant el moment que va començar la pandèmia mundial, jo i els meus amics vam iniciar una lliga FIFA 20 a PS4 per distreure’ns a les tardes / nits. Inicialment només es jugava i res més, però després vam començar a tenir un tauler de Power BI per a estadístiques, un canal de YouTube per compartir els jocs en directe i després emmagatzemar-los allà i un Twitter per publicar les actualitzacions de la classificació cada setmana. La primera lliga es va crear manualment, una mica de dolor i súper estàtica, així que he decidit utilitzar aquest tema per crear una aplicació que ens ajudi a gestionar la segona lliga creant la lliga, gestionant els nostres equips i partits allà, notificant els resultats i mostrant estadístiques més detallades a l'interior.

## QUÈ

Primer de tot, volia posar tota la informació real de FIFA 20 al lloc web relacionada amb lligues, equips i jugadors. Per a això, he trobat alguns llocs web que tenen aquesta informació oberta i gratuïta, però que no tenen cap API per consumir-la. La idea de copiar manualment era molt temptadora, però vaig preferir escriure un rastrejador senzill a [Python](https://www.python.org/) mitjançant la biblioteca [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#css-selectors) amb els selectors css que proporciona. Fent alguns ajustaments aquí i allà, al final vaig acabar tenint 3 fitxers JSON, un per a cada tema que volia inicialment, així que tot perfecte.

A continuació, per introduir tota aquesta informació a la base de dades, la idea era crear una eina de línia d'ordres que llegeixi aquests fitxers i generi les sentències SQL corresponents i, a continuació, generar els fitxers de migració corresponents.
He triat [Go](https://golang.org/) com a llenguatge de programació per a l'API i he creat un `cmd` que em permet fer la idea desitjada. La base de dades seria [PostgreSQL](https://www.postgresql.org/), de manera que les "insercions" han de ser segons la seva sintaxi.

Amb totes les dades inicials a punt, he començat a dissenyar la resta de la base de dades i els possibles punts finals ho necessiten per gestionar tota aquesta informació. He triat [mux](https://github.com/gorilla/mux) per a l'HTTP, ja que és senzill però potent en comparació amb el lib estàndard (només per a l'anàlisi de paràmetres val la pena ...). Com que volia explorar més el costat de l’aplicació mòbil que el servidor, només vaig organitzar el codi amb [Arquitectura per capes](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html) com a ORM per simplificar la consulta i els mapejos entre la base de dades i els meus models.

![api structure](/images/code/tournaments-generator/api-structure.jpeg)

Dins de la carpeta `cmd` he creat diferents ordres:
- migració: gestiona les migracions a la base de dades
- analitzador: tradueix el json del rastrejador a sentències sql
- servidor: executa el servidor

Dins de la carpeta `pkg` és fàcil identificar el que fan les carpetes pel seu propi nom.

Per a l'aplicació mòbil, vaig començar a posar tots els fitxers dins d'una carpeta de "components", però quan va començar a créixer era un kaos complet per gestionar. Després d’afegir més complexitat a l’aplicació, acabo trobant una manera neta d’organitzar el codi, dividint-lo en dues carpetes separades; un per al nucli i un altre per a la interfície d’usuari. Després, dins de cadascun, també vaig classificar els diferents tipus de components en funció de les seves responsabilitats i, al final, el codi (almenys per a mi que no sóc expert en Flutter) va quedar molt net i (sens dubte) més mantenible . A sota de l'organització de la carpeta en una vista general:

![app structure](/images/code/tournaments-generator/app-structure.jpeg)

Al principi, quan vaig començar a codificar i a veure els resultats, tot era fantàstic i vaig pensar que era més fàcil del que s'esperava. La connexió de l’aplicació amb l’API només era qüestió de saber utilitzar la biblioteca `http` i els mètodes` get` o `post` es van connectar sense problemes.

```dart
    var client = new http.Client();

    String jsonBody = json.encode(user.toJson());
    var response = await client.post("$_baseUrl/token",
        headers: {"Content-Type": 'application/json'}, body: jsonBody);

    if (response.statusCode == 200) {
      return User.fromJson(json.decode(response.body));
    }
```

L’únic problema que m’he enfrontat és que estava executant les aplicacions des de l’Android Emulator; això vol dir que s'estava executant en una màquina virtual, de manera que la IP no era la meva local i no pot accedir al `localhost`. Després d'una mica d'investigació, he trobat el correcte i tot ha funcionat correctament.

Els problemes van començar quan volia transmetre informació entre components i actualitzar la vista en funció d’aquesta informació, o millor encara, no actualitzar si no canvia res quan torno a entrar a una vista (per exemple, passar d’una llista a una vista de detall, i tornar a la llista). Després d’un dia llegint als fòrums sobre el mateix problema que m’enfrontava, he trobat el paquet [Proveïdor](https://pub.dev/packages/provider) i tot semblava fàcil i el sant grial de tot, però no ho era.

El veritable dolor acaba de començar aquí! Vaig trigar uns dies a entendre realment el seu funcionament. El proveïdor inicial és fàcil d’entendre, l’utilitzeu i funciona, però només voleu canviar només una petita part de la vista, o bé reconstruir-ne la completa, o bé modificar alguns valors en una vista A i a continuació, aneu a veure B i vegeu els canvis que hi ha, i tots aquests exemples estan completament codificats i primer heu de saber que hi ha una manera de fer cada cas i, en segon lloc, heu de saber com fer-ho. Al final he utilitzat el proveïdor, el ProxyProvider, el StreamProvider i el ChangeNotifierProvider.

El projecte no està acabat, però ara com ara està en espera amb les funcions següents:

Inicialment, l'usuari pot canviar entre les vistes d'inscripció/inici de sessió.
![signup](/images/code/tournaments-generator/signup.png)
![login](/images/code/tournaments-generator/login.png)

Un cop l’usuari es troba dins de l’aplicació, hi ha diferents pestanyes on han de jugar els següents `Partits`, els `Torneigs` que juga i els "Grups" on és present i els membres que hi ha. A la part superior té una barra de navegació amb una imatge de perfil, una icona de campana per a les notificacions, una icona d’objectiu per buscar altres membres i afegir com a amics i el botó de tancament de sessió per desconnectar.
![home](/images/code/tournaments-generator/home.png)

Si fa clic a la foto de perfil, es dirigeix directament al perfil de l'usuari on mostra els amics i on pot editar la seva informació personal (nom, nom d'usuari, foto de perfil):
![profile](/images/code/tournaments-generator/profile.png)

En prémer la icona de la lent, canvia la visualització a la funcionalitat de supercercador que permet a l'usuari trobar altres persones que ja estan a la plataforma, afegir-les com a amics i després crear grups, generar torneigs i jugar partits junts. El cercador és una cerca "m'agrada", de manera que si alguna de les lletres que introdueix apareix en algun nom d'usuari, es mostrarà allà.
![searcher](/images/code/tournaments-generator/searcher.png)

Després, si l’usuari introdueix un perfil que no és un amic, apareixerà el botó per afegir-lo i, si es fa clic, ocultarà aquest botó i mostrarà la informació que ja hi ha una sol·licitud enviada, esperant l’altre usuari. per respondre-ho.
![add friend](/images/code/tournaments-generator/add-friend.png)
![add friend requested](/images/code/tournaments-generator/add-friend-requested.png)

Actuant com a altre usuari, en iniciar la sessió, la icona de campana mostrarà una nova notificació. Accedir a l'interior apareix com una notificació d'amistat i es pot respondre directament des de la llista o entrar al perfil de "sol·licitant" i acceptar-lo o rebutjar-lo. Si s’accepta la sol·licitud d’amistat, apareixerà com a nou amic al perfil de l’usuari.
![friend request notification](/images/code/tournaments-generator/friend-request-notification.png)
![friend request notification answer](/images/code/tournaments-generator/friend-request-notification-answer.png)
![profile multi friends](/images/code/tournaments-generator/profile-multifriends.png)

Després que un usuari tingui alguns amics, és el moment en què pot crear un grup. Per a això, l'aplicació té la tercera pestanya anomenada `Grups` i un botó (+).
![new group](/images/code/tournaments-generator/new-group.png)

Dins del generador de grups es mostrarà la llista dels amics a la part superior. A mesura que es seleccionen, es col·loquen a la llista següent, on es poden eliminar si es vol; quan tots els amics estiguin seleccionats, és hora de passar a la pantalla següent mitjançant el botó (-->).
![new group selected](/images/code/tournaments-generator/new-group-selected.png)

El següent pas és posar un bon nom per a aquest grup i, a continuació, prémer la marca per crear el grup.
![new group name](/images/code/tournaments-generator/new-group-name.png)

Quan l'usuari torna a la visualització inicial, apareix el grup nou creat i els membres d'aquest a la llista.
![new group created](/images/code/tournaments-generator/new-group-created.png)

A partir d’aquí el que falta és crear els `Torneigs` seleccionant el grup i els membres d’aquest grup que volen jugar, el nombre d’equips per a cada membre, els equips, les rondes, el tipus de torneig, etc. i després generar el calendari. Mostra el calendari a la pestanya "Coincidències" i dins de cada coincidència permetrà als usuaris afegir els resultats. També proporcioneu una classificació i les estadístiques de cada partit i una agrupada per a cada partit i una de genèrica.

## PENSAMENTS FINALS

Amb aquesta prova de concepte, vaig tenir l'oportunitat de treballar en una aplicació complexa en termes de disseny de components reutilitzables en una aplicació mòbil, trucar a una API externa per gestionar la informació que es mostra a l'aplicació i aprendre a utilitzar el paquet de proveïdor per moure informació. entre vistes múltiples i controlar l’estat de l’aplicació d’una manera més senzilla i eficaç.

Hi ha molt més a aprendre sobre el desenvolupament de mòbils, però considero aquest projecte com un pas inicial per començar. Algun dia faré les vistes que falten per tal de poder utilitzar-les al món real, però espero que no sigui perquè tenim una altra pandèmia 😏