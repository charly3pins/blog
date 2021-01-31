+++
title = "Reproductor multimèdia a un Raspberry Pi amb Plex, Transmission, Sonarr, Bazarr i Jackett"
date = "2020-11-05"
author = "charly3pins"
description = "Construïu el vostre propi reproductor multimèdia mitjançant un client BitTorrent (transmissió), un PVR per a usuaris d’Usenet i BitTorrent (Sonarr), un suport d’API per als vostres seguidors de torrents (Jackett), un gestor de subtítols a Sonarr & Radarr (Bazarr) i un client–servudir reproductor multimèdia (Plex)."

slug = "Reproductor multimèdia a un Raspberry Pi amb Plex, Transmission, Sonarr, Bazarr i Jackett"
section = "/blog"
tags = ["raspberry-pi", "linux", "life"]

image = "/images/raspberry-media-player/cover.png"
+++

Així que teniu una Raspberry Pi abandonada i sempre heu volgut utilitzar-lo per a alguna cosa útil. També us agrada veure sèries, però hi ha massa proveïdors i no sabeu quin se’n subscriu. No us preocupeu amb aquest tutorial, tindreu solucionats tots dos problemes alhora; Utilitzarà el Raspberry Pi per veure la vostra sèrie preferida sense límits.

## Instal·leu el sistema operatiu Raspberry

Primer de tot, hem d’instal·lar un sistema operatiu al nostre Raspberry. Per això, tenim diferents opcions explicades a la [documentació oficial](https://www.raspberrypi.org/downloads/raspberry-pi-os/). Personalment, vaig decidir el sistema operatiu "Raspberry Pi (32 bits) Lite", ja que no vull cap escriptori ni cap programari recomanat, de manera que com més lleuger millor.

Des de la [font](https://www.raspberrypi.org/documentation/installation/installing-images/) seguim les instruccions de la imatge de Linux.

Com ja sabeu, necessitem una microSD per executar el sistema operatiu en un Raspberry Pi, de manera que ens hem de connectar al nostre ordinador portàtil i saber-ne el nom. Per a això podem obrir un terminal i escriure:
```vim
lsblk -p
```
En el meu cas és `/dev/sda`.

Un cop sabem el nom de la SD, hem d’escriure la imatge a la targeta amb l’ordre següent, assegurant-nos que substituïu l’argument d’entrada `if =` pel camí del fitxer .img i el fitxer `/dev/sda` argument al fitxer de sortida `of=`amb el nom del dispositiu correcte.

⚠️ Això és molt important, ja que perdeu totes les dades del disc dur si proporcioneu un nom de dispositiu incorrecte. Assegureu-vos que el nom del dispositiu sigui el nom de tota la targeta SD tal com s’ha descrit anteriorment, no només una partició. Per exemple: sdd, no sdds1 o sddp1; mmcblk0, no mmcblk0p1.

```vim
sudo dd bs=4M if=2020-08-20-raspios-buster-armhf-lite.img of=/dev/sda conv=fsyn
```

Podem afegir els indicadors `status=progress conv=fsync` per veure el progrés:
```vim
dd bs=4M if=2020-08-20-raspios-buster-armhf.img of=/dev/sda status=progress conv=fsync
```

Si està comprimit, podem concatenar les ordres descomprimir i dd amb:
```vim
sudo unzip -p 2020-08-20-raspios-buster-armhf.zip | sudo dd of=/dev/sda bs=4M conv=fsync
```

Després d’això, ja tenim el nostre sistema operatiu instal·lat a la microSD, de manera que tenim el nostre Raspberry Pi a punt. 🙌

### Iniciar Sessió

Ara és el moment per tornar a inserir la microSD al Raspberry, connectar-la a la pantalla i connectar-la.

Al nostre televisor apareix una cosa així:

![installation](/images/raspberry-media-player/installation.jpg)

Com podeu observar a la part inferior, ja he iniciat la sessió. L'usuari és `pi` i la contrasenya per defecte `raspberry`. Es recomana canviar la contrasenya la primera vegada que inicieu la sessió.

## Activa ssh

El següent pas és habilitar la connexió ssh, ja que volem gestionar el Raspberry des del nostre ordinador portàtil, no des del televisor, així que primer llegiu la [documentació](https://www.raspberrypi.org/documentation/remote-access/ssh/ ).

El segon és utilitzar el sistema systeml per iniciar i habilitar el servei:
```vim
sudo systemctl start ssh
```
```vim
sudo systemctl enable ssh
```

Podem comprovar si funciona amb:
```vim
sudo systemctl status ssh
```

I apareixerà com:
```vim
● ssh.service - OpenBSD Secure Shell server
   Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
   Active: active (running) since XXX
     Docs: man:sshd(8)
           man:sshd_config(5)
 Main PID: 440 (sshd)
    Tasks: 1 (limit: 2063)
   CGroup: /system.slice/ssh.service
           └─440 /usr/sbin/sshd -D

```

Després d'això, hem de descobrir la `IP` del nostre Raspberry. Per a això podem utilitzar:
```vim
ifconfig
```

I apareixerà una cosa així:
![ifconfig](/images/raspberry-media-player/ifconfig.jpg)

En el meu cas, podeu veure que és `192.168.1.131`, així que ho utilitzaré com a referència; el vostre probablement serà diferent perquè depèn de la vostra xarxa.

Ara podem anar al nostre ordinador portàtil i connectar-nos mitjançant ssh:
```vim
ssh pi@192.168.1.131
```

Us demanarà la contrasenya, però ja sabem quina és perquè hem iniciat la sessió directament al gerd (recordeu que la canvieu 😜).

## Configureu una unitat USB com a emmagatzematge de suports

Primer volem actualitzar i tenir les darreres dependències, així que escriviu:
```vim
sudo apt-get update
sudo apt-get upgrade
```

Vaig decidir utilitzar una unitat USB formatada com a ExFAT, ja que només treballo amb Linux. Connecteu la unitat USB al Raspberry Pi i reinicieu-la.

Des del terminal executeu:

```vim
sudo fdisk -l
```

En què es mostraran totes les particions reconegudes pel sistema. Identifiqueu l’associat amb la unitat externa. En el meu cas és:
```vim
Disk /dev/sda: 1.8 TiB, 2000398934016 bytes, 3907029168 sectors
Disk model: External USB 3.0
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x0072438b

Device     Boot Start        End    Sectors  Size Id Type
/dev/sda1        2048 3907028991 3907026944  1.8T  7 HPFS/NTFS/exFAT
```

Ara instal·leu els controladors exFAT, en cas contrari no es reconeixerà el sistema de fitxers:
```vim
sudo apt-get install exfat-fuse
```

I creeu el directori on es muntarà el disc:
```vim
sudo mkdir /media/storage
```

Ara podem muntar el disc amb:
```vim
sudo mount /dev/sda1 /media/storage
```
⚠️ Recordeu que heu de substituir `sda1` pel nom del dispositiu real que heu trobat amb sudo fdisk -l.

Per desmuntar-lo podem utilitzar:
```vim
sudo umount /media/storage
```

Idealment, volem que la unitat estigui sempre connectada, de manera que configurem la muntura a l’arrencada i la desem per escriure aquestes ordres cada vegada que reiniciem el gerd.

Primer trobem l’identificador:
```vim
sudo blkid
```

En el meu cas el resultat és:

```vim
/dev/mmcblk0p1: LABEL_FATBOOT="boot" LABEL="boot" UUID="4AD7-B4D5" TYPE="vfat" PARTUUID="d5603eaf-01"
/dev/mmcblk0p2: LABEL="rootfs" UUID="2887d26c-6ae7-449d-9701-c5a4018755b0" TYPE="ext4" PARTUUID="d5603eaf-02"
/dev/mmcblk0: PTUUID="d5603eaf" PTTYPE="dos"
/dev/sda1: UUID="1200CB0C6CE045EE" TYPE="ntfs" PTTYPE="atari" PARTUUID="0072438b-01"
```

El que ens interessa és el UUID de la nostra unitat externa. En el meu cas, això és `1200CB0C6CE045EE`.

Ara podem editar el fitxer:
```vim
sudo nano /etc/fstab
```

I afegiu aquesta línia a la part inferior:
```
UUID=1200CB0C6CE045EE /media/storage exfat defaults,auto,umask=000,users,rw 0 0
```
⚠️ No oblideu substituir l’UUID pel vostre.

## Transmissió BitTorrent

El següent pas és tenir un client BitTorrent per descarregar els torrents (només els legals, per descomptat) i, per a això, hauríem d'instal·lar `Transmission`.

Executeu l'ordre següent:
```vim
sudo apt-get install -y transmission-daemon transmission-cli transmission-common
```

Novetat, hem d’aturar el dimoni per aplicar canvis a la configuració que ens permetran gestionar-la remotament:
```vim
sudo service transmission-daemon stop
sudo vi /etc/transmission-daemon/settings.json
``

Cerqueu rpc-whitelist i rpc-whitelist-enabled i assegureu-vos que tinguin aquest aspecte:
```vim
"rpc-whitelist": "127.0.0.1,192.168.*.*",
"rpc-whitelist-enable": "true",
```

Tingueu en compte que això suposa que la vostra xarxa interna funciona el `192.168.0.1/24`. En cas contrari, canvieu el valor en conseqüència.

També podem modificar dir-descarregar i dir-incomplet per apuntar cap a la unitat USB externa, per exemple:
```vim
"download-dir": "/media/storage/downloads",
"incomplete-dir": "/media/storage/.tmp",
"incomplete-dir-enabled": true,
```

Assegureu-vos que els directoris existeixen a la vostra unitat USB externa (hem creat a la secció anterior).

Configureu l'usuari i la contrasenya:
```vim  
"rpc-password": "superSecret",
"rpc-port": 9091,
"rpc-url": "/transmission/",
"rpc-username": "gopher",
```

El següent pas és canviar el port de parells perquè de vegades el vostre proveïdor bloquejarà el port per defecte. Podeu seleccionar el que vulgueu entre el rang 49152-65535. En el meu cas, vaig decidir utilitzar el 51228. Trobeu la següent línia:
```vim
"peer-port": 51413,
```

I canvieu-lo pel port decidit:
```vim
"peer-port": 51228,
```

També podeu gestionar la velocitat de descàrrega/càrrega des de la configuració editant les línies següents:
```vim
"speed-limit-down": 3000,
"speed-limit-down-enabled": true,
"speed-limit-up": 900,
"speed-limit-up-enabled": true,
```

Ara podem tornar a iniciar el servei:
```vim
sudo service transmission-daemon start
```

La interfície web ja està disponible a l’adreça http://192.168.1.131:9091 (substituïu l’adreça IP per l’utilitzada per Raspberry Pi a la vostra xarxa).

Podeu iniciar sessió amb el nom d'usuari i la contrasenya com a `transmission`.

## Instal·leu Sonarr

[Sonarr](https://github.com/Sonarr/Sonarr) és un PVR per a usuaris d’Usenet i BitTorrent. Pot controlar diversos canals RSS de capítols nous dels vostres programes preferits i els agafarà, ordenarà i canviarà el nom. També es pot configurar per actualitzar automàticament la qualitat dels fitxers ja descarregats quan es disposa d’un format de millor qualitat.

Hem d’instal·lar dependències com ara `libmono-cil-dev` i `mono 3.10`. He utilitzat aquest [enllaç](https://www.htpcguides.com/install-sonarr-raspberry-pi-mono-310/) com a referència. Per a això, hem d'escriure:
```vim
sudo apt-get install libmono-cil-dev
wget http://sourceforge.net/projects/bananapi/files/mono_3.10-armhf.deb
sudo dpkg -i mono_3.10-armhf.deb
```

Després d'això, podem instal·lar Sonarr:
```vim
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 0xA236C58F409091A18ACA53CBEBFF6B99D9B78493
echo "deb http://apt.sonarr.tv/ master main" | sudo tee /etc/apt/sources.list.d/sonarr.list
sudo apt-get update
sudo apt-get install nzbdrone
sudo chown -R pi:pi /opt/NzbDrone
```

### Script d’inici automàtic

Hem de crear el fitxer `/ etc/systemd/system/nzbdrone.service`:
```vim
sudo nano /etc/systemd/system/nzbdrone.service
```

I posar a dins:
```vim
[Unit]
Description=Sonarr Daemon
After=network.target

[Service]
User=pi
Group=pi

Type=simple
ExecStart=/usr/bin/mono /opt/NzbDrone/NzbDrone.exe -nobrowser
TimeoutStopSec=20
KillMode=process
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Podem iniciar, comprovar l’estat i habilitar si el servei funciona amb les comandes següents, respectivament:
```vim
sudo systemctl start nzbdrone
sudo systemctl status nzbdrone
sudo systemctl enable nzbdrone
```

La interfície web ja està disponible a l'adreça http://192.168.1.131:8989 (substituïu l'adreça IP per la que utilitza Raspberry Pi a la vostra xarxa).

##  Instal·leu Jackett

[Jackett](https://github.com/Jackett/Jackett) funciona com a servidor intermediari: tradueix les consultes d'aplicacions (Sonarr, Radarr, SickRage, CouchPotato, Mylar, Lidarr, DuckieTV, qBittorrent, Nefarious, etc.) al rastrejador -consultes http específiques del lloc, analitza la resposta html i torna els resultats al programari sol·licitant. Això permet obtenir càrregues recents (com RSS) i realitzar cerques. Jackett és un dipòsit únic de lògica de traducció i rascat d’indexadors mantinguda, que elimina la càrrega d’altres aplicacions.

Comencem a descarregar la versió més recent de Jackett:
```vim
wget -q https://github.com/Jackett/Jackett/releases/latest -O - | grep -E \/tag\/ | awk -F "[><]" '{print $3}'
```

O si ja coneixeu la versió:
```vim
wget -q https://github.com/Jackett/Jackett/releases/download/v0.16.1937/Jackett.Binaries.LinuxARM32.tar.gz
```

A continuació, hem de descomprimir el fitxer i moure'l al directori correcte:
```vim
tar zxvf Jackett.Binaries.LinuxARM32.tar.gz 
sudo mv Jackett /opt/
```

Canvieu la propietat de Jackett a l'usuari principal del Raspberry Pi, que en el nostre cas és `pi`:
```vim
sudo chown -R pi:pi /opt/Jackett
```

### Script d’inici automàtic

Hem de crear el fitxer `/etc/systemd/system/jackett.service`:
```vim
sudo nano /etc/systemd/system/jackett.service
```

I posar a dins:
```vim
[Unit]
Description=Jackett Daemon
After=network.target

[Service]
SyslogIdentifier=jackett
Restart=always
RestartSec=5
Type=simple
User=pi
Group=pi
WorkingDirectory=/opt/Jackett
ExecStart=/opt/Jackett/jackett --NoRestart
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

Podem iniciar, comprovar l’estat i habilitar si el servei funciona amb les comandes següents, respectivament:
```vim
sudo systemctl start jackett
sudo systemctl status jackett
sudo systemctl enable jackett
```

La interfície web ja està disponible a l'adreça http://192.168.1.131:9117 (substituïu l'adreça IP per la que utilitza Raspberry Pi a la vostra xarxa).

## Instal·leu Bazarr

[Bazarr](https://github.com/morpheus65535/bazarr) és una aplicació complementària per a Sonarr i Radarr. Gestiona i descarrega subtítols segons els vostres requisits. Definiu les vostres preferències mitjançant programes de televisió o pel·lícules i Bazarr s’encarregarà de tot per vosaltres.

Com a dependència d’això, hauríem d’instal·lar `python3`. Primer de tot, fem això:
```vim
sudo apt-get install python3 idle3
``` 

A continuació, hem de tenir git per descarregar el repo i el pip per gestionar la instal·lació del paquet:
```vim
sudo apt-get install git python3-pip python3-distutils
```

Ara és hora d’instal·lar les dependències de Bazaar:
```vim
sudo apt-get install libxml2-dev libxslt1-dev python3-libxml2 python3-lxml unrar-free ffmpeg libatlas-base-dev
```

Amb això, estem preparats per instal·lar Bazarr al nostre gerd. Hem de clonar el repo directament des de GitHub mitjançant git i ho fem directament a la carpeta de destinació `opt/bazarr` escrivint l'ordre següent:
```vim
sudo git clone https://github.com/morpheus65535/bazarr.git /opt/bazarr
```

A continuació, hem d’anar a aquesta carpeta i instal·lar els requisits definits al seu interior amb:
```vim
cd /opt/bazarr
python3 -m pip install -r requirements.txt
```
ℹ️ NOTA: No us preocupeu perquè no s'instal·li `lxml` en aquest pas, heu instal·lat el mòdul a través d'apt-get de totes maneres.

Canvieu la propietat per l'usuari `pi`:
```vim
sudo chown -R pi:pi /opt/bazarr
```

I podem començar i provar Bazaar:
```vim
python3 bazarr.py 
```

Després dels missatges d'inici i configuració de Bazarr, comproveu si funciona a http://192.168.1.131:6767/.

### Connecta amb Sonarr

El següent pas és connectar-lo amb Sonarr. La [documentació oficial](https://github.com/morpheus65535/bazarr/wiki/Setup-Guide) és molt senzilla i fàcil de seguir, així que no la posaré aquí. Només una cosa que no és prou clara com a mínim per a mi i que es tracta de la clau API Sonarr i de la seva ubicació, així que, com a consell, posaré aquí que:

- La clau de l'API Sonarr es troba a `Settings/General/Security`

### Script d’inici automàtic

Hem de crear el fitxer `/etc/systemd/system/bazarr.service`:
```vim
sudo nano /etc/systemd/system/bazarr.service
```

I posar a dins:
```vim
[Unit]
Description=Bazarr Daemon
After=syslog.target network.target

# After=syslog.target network.target sonarr.service radarr.service

[Service]
WorkingDirectory=/opt/bazarr/
User=pi
Group=pi
UMask=0002
Restart=on-failure
RestartSec=5
Type=simple
ExecStart=/usr/bin/python3 /opt/bazarr/bazarr.py
KillSignal=SIGINT
TimeoutStopSec=20
SyslogIdentifier=bazarr
ExecStartPre=/bin/sleep 30

[Install]
WantedBy=multi-user.target
```

Podem iniciar, comprovar l’estat i habilitar si el servei funciona amb les comandes següents, respectivament:
```vim
sudo systemctl start bazarr
sudo systemctl status bazarr
sudo systemctl enable bazarr
```

La interfície web ja està disponible a l'adreça http://192.168.1.131:6767 (substituïu l'adreça IP per la que utilitza Raspberry Pi a la vostra xarxa).

## Instal·leu Plex

[Plex] (https://www.plex.tv/) reuneix tots els mitjans que us importen. La vostra col·lecció personal quedarà bonica al costat del contingut de transmissió estel·lar. Gaudeix de TV i DVR en directe, un catàleg creixent de grans programes web, notícies i podcasts. Finalment és possible gaudir de tots els suports que més t’agraden en una sola aplicació, en qualsevol dispositiu, independentment d’on siguis.

Primer de tot, hem d’afegir un nou repositori i és clau. Això afegirà al sistema operatiu de Raspberry els repositoris on hem de descarregar la instal·lació i les futures actualitzacions. És com una llista d’enllaços on el sistema llegeix automàticament els programes que necessita per a la instal·lació i les actualitzacions.
```vim
echo deb https://downloads.plex.tv/repo/deb public main | sudo tee /etc/apt/sources.list.d/plexmediaserver.list
```

El següent pas és afegir les signatures dels repos. El sistema ha de garantir que els repos que hem afegit manualment siguin correctes i que no tinguin programari maliciós. Per a això, hem d'afegir la clau i el sistema d'ajuda per verificar aquests repos.
```vim
curl https://downloads.plex.tv/plex-keys/PlexSign.key | sudo apt-key add
```

Ara podem actualitzar la nostra llista de paquets i instal·lar Plex Media Server:
```vim
sudo apt-get update
sudo apt-get install plexmediaserver
```

Podeu completar la configuració obrint el següent enllaç amb el vostre navegador:

La interfície web ja està disponible a l'adreça http://192.168.0.10:32400/web (substituïu l'adreça IP per la que utilitza Raspberry Pi a la vostra xarxa).

Quan se us demani que afegiu biblioteques, haureu d'afegir la carpeta de descàrrega de Transmission, al nostre exemple `/media/storage/downloads`.

I simplement a gaudir del reproductor multimèdia amb la teva sèrie preferida 📺.

Si també esteu interessats en pel·lícules, podeu instal·lar [Radarr](https://github.com/Radarr/Radarr), que és un fork independent de Sonarr reelaborada per descarregar automàticament pel·lícules a través d’Usenet i BitTorrent. El projecte es va inspirar en altres descarregadors de pel·lícules Usenet/BitTorrent com CouchPotato.

En una publicació futura probablement intenti Dockerize tota aquesta configuració i inclouré Radarr, o no... ja ho veurem 🧑‍🚀

Espero que us hagi agradat i si teniu dubtes, contacteu amb mi a qualsevol xarxa social.