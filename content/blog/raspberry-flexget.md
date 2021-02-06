+++
draft = true

title = "flexget"
date = "2022-10-08"
author = "charly3pins"
description = "flexget."

tags = ["raspberry-pi", "linux", "life"]
category = "technology"

image = "/images/raspberry-media-player/cover.png"
+++

### OPTIONAL : FLEX GET

CHECK https://flexget.com/Plugins

$ sudo apt-get install python-pip

La instalación en linux se hace por medio de PIP (el repositorio de paquetes de Python), y para hacerlo debes seguir estos pasos:

sudo apt-get install python-pip
sudo pip install flexget
sudo mkdir /home/pi/.flexget
sudo chown -R pi /home/pi/.flexget
sudo chgrp -R pi /home/pi/.flexget
Con esto hemos instalado Flexget y creado el directorio donde almacenaremos su configuración. Para crear el archivo de configuración ejecutamos:

nano /home/pi/.flexget/config.yml

Y dentro del archivo pegamos la siguiente configuración:

```yml
web_server: yes

schedules:
  - tasks: '*'
    interval:
      minutes: 30

templates:
  tv:
    regexp:
      reject:
        - x265: {from: title}
    series:
      settings:
        tv:
          exact: yes
          propers: 12 hours
          quality: 720p+
      tv:
      - Adventure Time
      - Dark Net
      - Devs
      - Disenchantment
      - Fear The Walking Dead
      - Final Space
      - Master of None
      - Mr. Pickles
      - Rick and Morty
      - Silicon Valley
      - Stargate SG-1
      - "The Walking Dead: World Beyond"
      - Watchmen
      - Westworld

    transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission

tasks:
  showrss:
    rss: http://showrss.info/user/248291.rss
    template: tv
    priority: 2
#   subtitles:
#     priority: 4
#     disable: builtins
#     find:
#       path:
#         - /media/storage/downloads
#       regexp:  '.*\.(mp4|mkv|avi)$'
#       recursive: yes
#     accept_all: yes
#     regexp:  
#       reject:
#        - '.*[sS]ample.*'
#     periscope:
#       languages:
#         - es
#       overwrite: yes
  sort_tv:
    priority: 2
    no_entries_ok: yes
    parsing:
      series: guessit
    filesystem:
      path: /media/storage/downloads
      regexp: '.*\.(avi|mkv|mp4)$'
      recursive: yes
    accept_all: yes
    trakt_lookup: yes
    require_field: series_name
    all_series:
      parse_only: yes
    exec:
      auto_escape: yes
      on_output:
        for_entries: |
          if mediainfo "{{ location }}" | grep EAC3; then
            mkdir -p "/media/storage/Series/{{ tvdb_series_name }}/Season {{ series_season }}" && ffmpeg -hwaccel auto -y -i "{{ location }}" -map 0 -c:s copy -c:v copy -c:a ac3 -b:a 640k "/storage/series/{{ tvdb_series_name }}/Season {{ series_season }}/{{ tvdb_series_name }} - {{ series_id }}{{ location | pathext }}"
          else
            mkdir -p "/media/storage/Series/{{ tvdb_series_name }}/Season {{ series_season }}" && cp "{{ location }}" "/media/storage/Series/{{ tvdb_series_name }}/Season {{ series_season }}/{{ tvdb_series_name }} - {{ series_id }}{{ location | pathext }}"
          fi
  remove_stale_torrents:
    from_transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission
    disable: [seen, seen_info_hash]
    if:
      - transmission_progress == 100: accept
      - not transmission_seed_ratio_ok: reject
      - not transmission_idle_limit_ok: reject
    transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission
      action: purge
```


Aquí podemos ver que se especifican varias cosas:

Los datos de nuestro email para el caso en que qusiéramos recibir un correo cada vez que tengamos un nuevo capítulo descargado en nuestro disco externo, listo para ser visto.
La URL de ShowRSS de la que se obtendrán los torrents y se descargarán todos los capítulos que aparezcan.
Usuario y contraseña de Transmission (veremos esto en un momento).
La ubicación de las descargas.
El lenguaje y ubicación que se dará a los subtítulos encontrados para cada capítulo, que será junto al archivo de video.
El orden que debe seguir la estructura de directorios donde almacenaremos los capítulos descargados. En este caso, quedan almacenados en « Disco/Series/NombreDeLaSerie/NombreDeLaSerie - S01E01 - NombreDelCapitulo.avi »
Eliminar los torrents de Transmission una vez finalizadas las descargas.
De esta forma, hasta que un capítulo no tenga subtítulos no será movido a la carpeta de la serie y seguirá intentando cada hora encontrar un subtítulo para ella.

SACAR LISTA DE TRAKT
```yml
web_server: yes

schedules:
  - tasks: '*'
    interval:
      minutes: 30

templates:
  series:
    regexp:
      reject:
        - x265: {from: title}
    configure_series:
      from:
        trakt_list:
          account: charly3pins
          strip_dates: yes
          list: Series
          type: shows
      settings:
          exact: yes
          propers: 12 hours
          quality: 720p+ hdtv+
    seen: local
    no_entries_ok: yes
    accept_all: no
    trakt_lookup: yes

    transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission
  anime:
    regexp:
      reject:
        - x265: {from: title}
    configure_series:
      from:
        trakt_list:
          account: charly3pins
          strip_dates: yes
          list: Anime
          type: shows
      settings:
          exact: yes
          propers: 12 hours
          quality: 720p+
    seen: local
    no_entries_ok: yes
    accept_all: no
    trakt_lookup: yes

    transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission

tasks:
  # En las tareas sync-* se generan las listas para que flexget trabaje 
  # y marca cual fue el último capitulo marcado como visto. Obteniendo el contenido desde trakt
  sync-series:
    priority: 1
    seen: local
    no_entries_ok: yes
    trakt_lookup: yes
    trakt_list:
          account: charly3pins
          strip_dates: yes
          list: Series
          type: shows
    accept_all: yes
    set_series_begin: yes
    list_remove:
      - trakt_list:
          account: charly3pins
          list: Series
          type: shows
    list_add:
      - trakt_list:
          account: charly3pins
          list: Series
          type: shows
    next_trakt_episodes:
        account: charly3pins
        context: watched
        list: Series 
  sync-anime:
    priority: 1
    seen: local
    no_entries_ok: yes
    trakt_lookup: yes
    trakt_list:
          account: charly3pins
          strip_dates: yes
          list: Anime
          type: shows
    accept_all: yes
    set_series_begin: yes
    list_remove:
      - trakt_list:
          account: charly3pins
          list: Anime
          type: shows
    list_add:
      - trakt_list:
          account: charly3pins
          list: Anime
          type: shows
    next_trakt_episodes:
        account: charly3pins
        context: watched
        list: Anime

# En las tareas discover-* buscamos el contenido de las listas previamente generadas.
# Usando los templates previamente creados, pasamos la configuración de lo que queremos ver.
  discover-series:
    priority: 2
    template: series
    discover:
      what:
        - next_trakt_episodes:
            account: charly3pins
            context: watched
            list: Series
      from:
        - argenteam:
            force_subtitles: yes
        - search_rss:
            url: http://showrss.info/user/248291.rss
            all_entries: no
            ascii: yes
            escape: yes
            link:
              - link
              - magneturi
        - search_rss:
            url: https://eztv.ag/ezrss.xml
            all_entries: no
            ascii: yes
            escape: yes
            link:
              - link
              - magneturi
    list_match:
              from:
                - trakt_list:
                   account: charly3pins
                   list: Series
                   type: shows
    torrent_alive: 10 # Will reject results with less than 10 seeds
  discover-anime:
    priority: 2
    template: anime
    discover:
      what:
        - next_trakt_episodes:
            account: charly3pins
            context: watched
            list: Anime
      from:
        - argenteam:
            force_subtitles: yes
        - search_rss:
            url: https://www.animenewsnetwork.com/all/rss.xml?ann-edition=es
            all_entries: no
            ascii: yes
            escape: yes
            link:
              - link
              - magneturi
        - search_rss:
            url: https://honeysanime.com/feed/
            all_entries: no
            ascii: yes
            escape: yes
            link:
              - link
              - magneturi
        - search_rss:
            url: http://blog.alltheanime.com/feed/
            all_entries: no
            ascii: yes
            escape: yes
            link:
              - link
              - magneturi
        - search_rss:
            url: https://feed.animetosho.org/rss2
            all_entries: no
            ascii: yes
            escape: yes
            link:
              - link
              - magneturi
    list_match:
              from:
                - trakt_list:
                   account: charly3pins
                   list: Anime
                   type: shows
    torrent_alive: 10 # Will reject results with less than 10 seeds
  sort_tv:
    priority: 3
    no_entries_ok: yes
    parsing:
      series: guessit
    filesystem:
      path: /media/storage/downloads
      regexp: '.*\.(avi|mkv|mp4)$'
      recursive: yes
    accept_all: yes
    thetvdb_lookup: yes
    require_field: series_name
    all_series:
      parse_only: yes
    exec:
      auto_escape: yes
      on_output:
        for_entries: |
          if mediainfo "{{ location }}" | grep EAC3; then
            mkdir -p "/media/storage/Series/{{ tvdb_series_name }}/Season {{ series_season }}" && ffmpeg -hwaccel auto -y -i "{{ location }}" -map 0 -c:s copy -c:v copy -c:a ac3 -b:a 640k "/storage/series/{{ tvdb_series_name }}/Season {{ series_season }}/{{ tvdb_series_name }} - {{ series_id }}{{ location | pathext }}"
          else
            mkdir -p "/media/storage/Series/{{ tvdb_series_name }}/Season {{ series_season }}" && cp "{{ location }}" "/media/storage/Series/{{ tvdb_series_name }}/Season {{ series_season }}/{{ tvdb_series_name }} - {{ series_id }}{{ location | pathext }}"
          fi
  remove_stale_torrents:
    priority: 4
    from_transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission
    disable: [seen, seen_info_hash]
    if:
      - transmission_progress == 100: accept
      - not transmission_seed_ratio_ok: reject
      - not transmission_idle_limit_ok: reject
    transmission:
      host: localhost
      port: 9091
      username: transmission
      password: transmission
      action: purge
```
$ flexget trakt auth <account> (usada en el config)

ir a https://trakt.tv/activate y poner el código q nos da el command line y aceptar permisos


quality => https://flexget.com/Plugins/quality
template => https://flexget.com/Plugins/template
sorting => https://flexget.com/Cookbook/Series/Sort
scheduler => https://flexget.com/Plugins/Daemon/scheduler
linux schedulig => https://flexget.com/InstallWizard/Linux/Scheduling
webserver => https://flexget.com/API


<!-- Daemon Mode
With FlexGet running in daemon mode you can use the scheduler plugin to define when your tasks should be run inside the configuration file.

To start the daemon at system boot you could use following cronjob:

@reboot /usr/local/bin/flexget daemon start -d -->

IF ERROR TRANSMISION RPC Transmissionrpc module version 0.11 or higher required. install it 
pip install transmissionrpc

Todos estos parámetros pueden ser cambiados, y los correspondientes a nombres de usuarios, contraseñas y URL deben ser reemplazados por los tuyos.

Flexget tiene muchos parámetros útiles para configurar. Se pueden ver en profundidad en su wiki.



#### Descarga de subtítulos
En la configuración que hicimos para Flexget, uno de los parámetros especifica la búsqueda y descarga de subtítulos, pero para que eso funcione, primero debemos instalar Periscope, un módulo programado en python que busca subtítulos en base a los nombres de los archivos de video descargados.

Busca en varias fuentes y normalmente hace un buen trabajo encontrando los subtítulos correctos.

Para instalarlo, ejecutamos:
pip install --upgrade setuptools
sudo pip install periscope
mkdir /home/pi/.config

El último comando es por un bug de Periscope, que si no tiene la carpeta .config falla.

### Automatización
Ya tenemos «casi» todo configurado. Lo que debemos hacer ahora es probar si todo funciona correctamente:

$ flexget execute

Esto debería consultar nuestro feed de ShowRSS, descargar los torrents de cada capítulo disponible, agregarlos a Transmission y comenzar la descarga dentro del disco externo. Una vez finalizada la descarga, eliminar los torrents de Transmission, buscar los subtítulos para todos los capítulos y moverlos junto a los archivos de video. Finalmente, debe ordenar todos los archivos en directorios separados por nombre de serie y renombrarlos especificando temporada y número de capítulo. MAGIA.