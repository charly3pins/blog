+++
title = "Reproductor multimedia en una Raspberry Pi con Plex, Transmission, Sonarr, Bazarr y Jackett"
date = "2020-11-05"
author = "charly3pins"
description = "Construya su propio reproductor multimedia usando un cliente BitTorrent (Transmisión), un PVR para usuarios de Usenet y BitTorrent (Sonarr), un Soporte API para sus rastreadores de torrents (Jackett), un administrador de subtítulos en Sonarr & Radarr (Bazarr) y un reproductor multimedia cliente-servidor (Plex)."

tags = ["raspberrypi", "linux", "life"]

image = "/images/raspberry-media-player/cover.png"
+++
Así que tienes una Raspberry Pi abandonada y siempre quisiste usarla para algo útil. También te gusta ver series pero hay demasiados proveedores y no sabes cuál se suscribe. No se preocupe con este tutorial, tendrá ambos problemas resueltos a la vez; ¡Usarás la Raspberry Pi para ver tu serie favorita sin límites!

## Instalar el sistema operativo Raspberry

Primero que nada necesitamos instalar un Sistema Operativo en nuestra Raspberry. Entonces para eso tenemos diferentes opciones explicadas en la [documentación oficial](https://www.raspberrypi.org/downloads/raspberry-pi-os/). Personalmente me decidí por el `Raspberry Pi OS (32-bit) Lite` ya que no quiero ningún escritorio ni ningún software recomendado, así que cuanto más ligero, mejor.

Desde la [fuente](https://www.raspberrypi.org/documentation/installation/installing-images/) seguimos las instrucciones para la imagen de Linux.

Como saben, necesitamos una microSD para ejecutar el sistema operativo en una Raspberry Pi, por lo que tenemos que conectarnos a nuestra computadora portátil y saber el nombre. Para eso podemos abrir una terminal y escribir:
```vim
lsblk -p
```
En mi caso es `/dev/sda`.

Una vez que sepamos el nombre de la SD, necesitamos escribir la imagen en la tarjeta con el siguiente comando asegurándonos de reemplazar el archivo de entrada `if=` argumento con la ruta a su archivo .img, y el `/dev/sda`en el archivo de salida `of=` argumento con el nombre correcto del dispositivo.

⚠️ Esto es muy importante, ya que perderá todos los datos del disco duro si proporciona el nombre de dispositivo incorrecto. Asegúrese de que el nombre del dispositivo sea el nombre de toda la tarjeta SD como se describe anteriormente, no solo una partición. Por ejemplo: sdd, no sdds1 o sddp1; mmcblk0, no mmcblk0p1.

```vim
sudo dd bs=4M if=2020-08-20-raspios-buster-armhf-lite.img of=/dev/sda conv=fsyn
```

Podemos agregar las banderas `status=progress conv=fsync` para ver el progreso:
```vim
dd bs=4M if=2020-08-20-raspios-buster-armhf.img of=/dev/sda status=progress conv=fsync
```

Si está comprimido, podemos combinar los comandos descomprimir y dd con:
```vim
sudo unzip -p 2020-08-20-raspios-buster-armhf.zip | sudo dd of=/dev/sda bs=4M conv=fsync
```

Después de eso, tenemos nuestro sistema operativo instalado en la microSD, ¡así que tenemos nuestra Raspberry Pi lista! 🙌

### Iniciar sesión

Ahora es el momento de volver a insertar la microSD en la Raspberry, conectarla a la pantalla y enchufarla.

En nuestra televisión aparece algo así:

![installation](/images/raspberry-media-player/installation.jpg)

Como puede observar en la parte inferior, ya inicié sesión. El usuario es `pi` y la contraseña predeterminada es `raspberry`. Es muy recomendable cambiar la contraseña la primera vez que inicie sesión.

## Habilitar ssh

El siguiente paso es habilitar la conexión ssh ya que queremos administrar la Raspberry desde nuestra computadora portátil, no desde la TV, así que primero es leer la [documentación](https://www.raspberrypi.org/documentation/remote-access/ssh/ ).

En segundo lugar, use el `systemctl` para iniciar y habilitar el servicio:
```vim
sudo systemctl start ssh
```
```vim
sudo systemctl enable ssh
```

Podemos comprobar si funciona con:
```vim
sudo systemctl status ssh
```

Y aparecerá algo como:
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

Después de eso, necesitamos descubrir la `IP` de nuestra Raspberry. Para eso podemos usar:
```vim
ifconfig
```

Y aparecerá algo así:
![ifconfig](/images/raspberry-media-player/ifconfig.jpg)

En mi caso, puede ver que es `192.168.1.131`, así que lo usaré como referencia; el tuyo probablemente será diferente porque depende de tu red.

Ahora podemos ir a nuestra computadora portátil y conectarnos a través de ssh:
```vim
ssh pi@192.168.1.131
```

Nos pedirá la contraseña pero ya sabemos cuál es porque iniciamos sesión en la Raspberry directamente (recuerda que la cambiaste 😜).

## Configura una unidad USB como almacenamiento multimedia

Primero queremos actualizar y tener las últimas dependencias, así que escriba:

```vim
sudo apt-get update
sudo apt-get upgrade
```

Decidí usar una unidad USB formateada como ExFAT ya que solo trabajo con Linux. Conecte la unidad USB a la Raspberry Pi y reiníciela.

Desde la terminal ejecute:

```vim
sudo fdisk -l
```

El cual enumerará todas las particiones reconocidas por el sistema. Identifique el asociado con la unidad externa. En mi caso fue:
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

Ahora instale los controladores exFAT; de lo contrario, no se reconocerá el sistema de archivos:
```vim
sudo apt-get install exfat-fuse
```

Y crea el directorio donde se montará el disco:
```vim
sudo mkdir /media/storage
```

Ahora podemos montar el disco con:
```vim
sudo mount /dev/sda1 /media/storage
```
⚠️ Recuerde reemplazar `sda1` con el nombre real del dispositivo que encontró con sudo fdisk -l.

Para desmontarlo podemos utilizar:
```vim
sudo umount /media/storage
```

Idealmente, queremos que la unidad esté siempre conectada, por lo que configuramos el montaje en el arranque y guardamos para escribir esos comandos cada vez que reiniciamos la Raspberry.

Primero encontramos el identificador:
```vim
sudo blkid
```

En mi caso el resultado fue:

```vim
/dev/mmcblk0p1: LABEL_FATBOOT="boot" LABEL="boot" UUID="4AD7-B4D5" TYPE="vfat" PARTUUID="d5603eaf-01"
/dev/mmcblk0p2: LABEL="rootfs" UUID="2887d26c-6ae7-449d-9701-c5a4018755b0" TYPE="ext4" PARTUUID="d5603eaf-02"
/dev/mmcblk0: PTUUID="d5603eaf" PTTYPE="dos"
/dev/sda1: UUID="1200CB0C6CE045EE" TYPE="ntfs" PTTYPE="atari" PARTUUID="0072438b-01"
```

Lo que nos interesa es el UUID de nuestro disco externo. En mi caso, eso es `1200CB0C6CE045EE`.

Ahora podemos editar el archivo:
```vim
sudo nano /etc/fstab
```

Y agregue esta línea en la parte inferior:
```
UUID=1200CB0C6CE045EE /media/storage exfat defaults,auto,umask=000,users,rw 0 0
```
⚠️ No olvide reemplazar el UUID por el suyo.

## Transmisión BitTorrent

El siguiente paso es tener un cliente BitTorrent para descargar los torrents (solo los legales por supuesto) y para eso necesitaríamos instalar `Transmission`.

Ejecute el siguiente comando:
```vim
sudo apt-get install -y transmission-daemon transmission-cli transmission-common
```

Nuevo necesitamos detener al demonio para aplicar cambios a la configuración que nos permitirán administrarlo de forma remota:
```vim
sudo service transmission-daemon stop
sudo vi /etc/transmission-daemon/settings.json
``

Busque rpc-whitelist y rpc-whitelist-enabled y asegúrese de que tengan este aspecto:
```vim
"rpc-whitelist": "127.0.0.1,192.168.*.*",
"rpc-whitelist-enable": "true",
```

Tenga en cuenta que esto supone que su red interna funciona en `192.168.0.1/24`. De lo contrario, cambie el valor en consecuencia.

Además, podemos modificar download-dir e incomplete-dir para que apunten a la unidad USB externa, por ejemplo:
```vim
"download-dir": "/media/storage/downloads",
"incomplete-dir": "/media/storage/.tmp",
"incomplete-dir-enabled": true,
```

Asegúrese de que los directorios existan en su unidad USB externa (los hemos creado en la sección anterior).

Configure el usuario y la contraseña:
```vim  
"rpc-password": "superSecret",
"rpc-port": 9091,
"rpc-url": "/transmission/",
"rpc-username": "gopher",
```

El siguiente paso es cambiar el puerto de pares porque a veces su proveedor bloqueará el predeterminado. Puede seleccionar el que desee entre el rango 49152-65535. En mi caso, decidí usar el 51228. Así que busca la siguiente línea:
```vim
"peer-port": 51413,
```

Y cámbielo por el puerto decidido:
```vim
"peer-port": 51228,
```

También puedes gestionar la velocidad de descarga/subida desde la configuración editando las siguientes líneas:
```vim
"speed-limit-down": 3000,
"speed-limit-down-enabled": true,
"speed-limit-up": 900,
"speed-limit-up-enabled": true,
```

Ahora podemos volver a iniciar el servicio:
```vim
sudo service transmission-daemon start
```

La interfaz web ya está disponible en la dirección http://192.168.1.131:9091 (reemplace la dirección IP con la utilizada por la Raspberry Pi en su red).

Puede iniciar sesión con el nombre de usuario y la contraseña como "transmisión".

## Instalar Sonarr

[Sonarr](https://github.com/Sonarr/Sonarr) es un PVR para usuarios de Usenet y BitTorrent. Puede monitorear múltiples fuentes RSS para nuevos episodios de sus programas favoritos y los tomará, clasificará y les cambiará el nombre. También se puede configurar para actualizar automáticamente la calidad de los archivos ya descargados cuando esté disponible un formato de mejor calidad.

Necesitamos instalar dependencias como `libmono-cil-dev` y `mono 3.10`. Utilicé este [enlace](https://www.htpcguides.com/install-sonarr-raspberry-pi-mono-310/) como referencia. Para eso necesitamos escribir:
```vim
sudo apt-get install libmono-cil-dev
wget http://sourceforge.net/projects/bananapi/files/mono_3.10-armhf.deb
sudo dpkg -i mono_3.10-armhf.deb
```

Después de eso, podemos instalar Sonarr:
```vim
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 0xA236C58F409091A18ACA53CBEBFF6B99D9B78493
echo "deb http://apt.sonarr.tv/ master main" | sudo tee /etc/apt/sources.list.d/sonarr.list
sudo apt-get update
sudo apt-get install nzbdrone
sudo chown -R pi:pi /opt/NzbDrone
```

### Script de inicio automático

Necesitamos crear el archivo `/etc/systemd/system/nzbdrone.service`:
```vim
sudo nano /etc/systemd/system/nzbdrone.service
```

Y poner dentro:
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

Podemos iniciar, verificar el estado y habilitar si el servicio está funcionando con los siguientes comandos respectivamente:
```vim
sudo systemctl start nzbdrone
sudo systemctl status nzbdrone
sudo systemctl enable nzbdrone
```

La interfaz web ya está disponible en la dirección http://192.168.1.131:8989 (reemplace la dirección IP con la utilizada por la Raspberry Pi en su red).

## Instalar Jackett

[Jackett](https://github.com/Jackett/Jackett) funciona como un servidor proxy: traduce las consultas de las aplicaciones (Sonarr, Radarr, SickRage, CouchPotato, Mylar, Lidarr, DuckieTV, qBittorrent, Nefarious, etc.) en un rastreador -consultas http específicas del sitio, analiza la respuesta html y luego envía los resultados al software solicitante. Esto permite obtener cargas recientes (como RSS) y realizar búsquedas. Jackett es un repositorio único de lógica de traducción y extracción de indexadores mantenida, lo que elimina la carga de otras aplicaciones.

Comenzamos a descargar la última versión de Jackett:
```vim
wget -q https://github.com/Jackett/Jackett/releases/latest -O - | grep -E \/tag\/ | awk -F "[><]" '{print $3}'
```

O si ya conoces la versión:
```vim
wget -q https://github.com/Jackett/Jackett/releases/download/v0.16.1937/Jackett.Binaries.LinuxARM32.tar.gz
```

Luego necesitamos descomprimir el archivo y moverlo a la ruta correcta:
```vim
tar zxvf Jackett.Binaries.LinuxARM32.tar.gz 
sudo mv Jackett /opt/
```

Cambie la propiedad de Jackett al usuario principal de la Raspberry Pi que en nuestro caso es `pi`:
```vim
sudo chown -R pi:pi /opt/Jackett
```

### Script de inicio automático

Necesitamos crear el archivo `/etc/systemd/system/jackett.service`:
```vim
sudo nano /etc/systemd/system/jackett.service
```

Y poner dentro:
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

Podemos iniciar, verificar el estado y habilitar si el servicio está funcionando con los siguientes comandos respectivamente:
```vim
sudo systemctl start jackett
sudo systemctl status jackett
sudo systemctl enable jackett
```

La interfaz web ya está disponible en la dirección http://192.168.1.131:9117 (reemplace la dirección IP con la utilizada por la Raspberry Pi en su red).

## Instalar Bazarr

[Bazarr](https://github.com/morpheus65535/bazarr) es una aplicación que acompaña a Sonarr y Radarr. Administra y descarga subtítulos según sus requisitos. Tú defines tus preferencias por programas de televisión o películas y Bazarr se encarga de todo por ti.

Como dependencia para ello, necesitaríamos instalar `python3`. Primero que nada, hagamos eso:
```vim
sudo apt-get install python3 idle3
``` 

A continuación, necesitamos tener git para descargar el repositorio y pip para administrar la instalación del paquete:
```vim
sudo apt-get install git python3-pip python3-distutils
```

Ahora es el momento de instalar las dependencias para Bazaar:
```vim
sudo apt-get install libxml2-dev libxslt1-dev python3-libxml2 python3-lxml unrar-free ffmpeg libatlas-base-dev
```

Con eso ya estamos listos para instalar Bazarr en nuestra Raspberry. Necesitamos clonar el repositorio directamente desde GitHub usando git y lo hacemos directamente a la carpeta de destino `opt/bazarr` escribiendo el siguiente comando:
```vim
sudo git clone https://github.com/morpheus65535/bazarr.git /opt/bazarr
```

Luego debemos ir a esa carpeta e instalar los requisitos definidos dentro de ella con:
```vim
cd /opt/bazarr
python3 -m pip install -r requirements.txt
```
ℹ️ NOTA: No se preocupe de que `lxml` no se instale en este paso, de todos modos ha instalado el módulo a través de apt-get.

Cambie la propiedad al usuario `pi`:
```vim
sudo chown -R pi:pi /opt/bazarr
```

Y podemos iniciar y probar Bazaar:
```vim
python3 bazarr.py 
```

Después de los mensajes de iniciar Bazarr y configurarlo, verifique si funciona en http://192.168.1.131:6767/.

### Conecta con Sonarr

El siguiente paso es conectarlo con Sonarr. La [documentación oficial](https://github.com/morpheus65535/bazarr/wiki/Setup-Guide) es muy sencilla y fácil de seguir, así que no la pondré aquí. Solo una cosa que no está lo suficientemente clara al menos para mí y se trata de la clave API de Sonarr y su ubicación, así que como consejo pondré aquí que:

- La clave API de Sonarr se encuentra en `Settings/General/Security`

### Script de inicio automático

Necesitamos crear el archivo `/etc/systemd/system/bazarr.service`:
```vim
sudo nano /etc/systemd/system/bazarr.service
```

Y poner dentro:
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

Podemos iniciar, verificar el estado y habilitar si el servicio está funcionando con los siguientes comandos respectivamente:
```vim
sudo systemctl start bazarr
sudo systemctl status bazarr
sudo systemctl enable bazarr
```

La interfaz web ya está disponible en la dirección http://192.168.1.131:6767 (reemplace la dirección IP con la utilizada por la Raspberry Pi en su red).

## Instalar Plex

[Plex](https://www.plex.tv/) reúne todos los medios que le interesan. Su colección personal se verá hermosa junto con contenido de transmisión estelar. Disfrute de TV y DVR en vivo, un catálogo cada vez mayor de excelentes programas web, noticias y podcasts. Finalmente, es posible disfrutar de todos los medios que ama en una sola aplicación, en cualquier dispositivo, sin importar dónde se encuentre.

Primero que nada, necesitamos agregar un nuevo repositorio y su clave. Esto agregará al SO de Raspberry los repositorios donde necesitamos descargar la instalación y las futuras actualizaciones. Es como una lista de enlaces donde el sistema lee automáticamente los programas que necesita para la instalación y las actualizaciones.
```vim
echo deb https://downloads.plex.tv/repo/deb public main | sudo tee /etc/apt/sources.list.d/plexmediaserver.list
```

El siguiente paso es agregar las firmas de los repositorios. El sistema debe asegurarse de que los repositorios que agregamos manualmente sean correctos y no tengan malware. Para eso necesitamos agregar la clave y ayuda al sistema a verificar esos repositorios.
```vim
curl https://downloads.plex.tv/plex-keys/PlexSign.key | sudo apt-key add
```

Ahora podemos actualizar nuestra lista de paquetes e instalar Plex Media Server:
```vim
sudo apt-get update
sudo apt-get install plexmediaserver
```

Puede completar la configuración abriendo el siguiente enlace con su navegador:

La interfaz web ya está disponible en la dirección http://192.168.0.10:32400/web (reemplace la dirección IP por la utilizada por la Raspberry Pi en su red).

Cuando se le solicite que agregue bibliotecas, debe agregar la carpeta de descarga de Transmission, en nuestro ejemplo `/media/storage/ downloads`.

Y simplemente disfruta de tu reproductor multimedia con tu serie favorita 📺.

Si también está interesado en películas, puede instalar [Radarr](https://github.com/Radarr/Radarr), que es una bifurcación independiente de Sonarr reelaborada para descargar películas automáticamente a través de Usenet y BitTorrent. El proyecto se inspiró en otros descargadores de películas de Usenet / BitTorrent como CouchPotato.

En una publicación futura probablemente intente Dockerize toda esa configuración e incluiré Radarr, o no... ya veremos 🧑‍🚀

Espero que lo hayas disfrutado y si tienes alguna duda ¡comunícate conmigo en cualquier red social!