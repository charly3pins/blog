+++
title = "Instal·lació de Drone 0.8 a Ubuntu 16.04"
date = "2018-10-10"
author = "charly3pins"
description = "Publicació senzilla que explica com instal·lar Drone al servidor Ubuntu 16.04."

slug = "Instal·lació de Drone 0.8 a Ubuntu 16.04"
section = "/blog"
tags = ["drone", "ci", "devops"]

image = "/images/droneio-0.8.png"
+++
He de reconèixer que mai no m’han agradat la part dels sistemes del procés de desenvolupament. Sempre, però, que era una feina en un lloc fosc i esgarrifós, ple de monstres que feien coses rares. Aquesta visió va canviar completament quan vaig començar a utilitzar [Docker](https://www.docker.com/). En aquest punt em vaig adonar que tota la màgia feta a la part de sysadmin era millor que jo i, aleshores, vaig començar a interessar-me més per aquest costat.

A més, a la meva feina hem començat a utilitzar [Jenkins](https://jenkins.io/) per a [CI/CD](https://www.atlassian.com/continuous-delivery/ci-vs-ci-vs-cd), canviant la nostra tasca manual d’embalatge-proves-desplegament per a un procés automàtic. Va ser super xulo !!! Em sento molt content perquè estalvia molt de temps i us permet concentrar-vos en les tasques de desenvolupament sense perdre temps en la fase de desplegament. Solia dedicar molt de temps a generar les meves guerres, desplegar-les a la caixa de sorra, provar les noves funcions afegides, tornar-les a desplegar si alguna cosa necessita solucionar-les de nou i finalment alliberar una nova versió de codi i implementar-les a la producció. Tots aquests passos es van simplificar amb només accedir a una branca i després fusionar-se amb el mestre (després de provar, per descomptat). En aquest pont vaig aprofundir en com s'estan construint i desplegant les coses, on (en el nostre cas a AWS) i com fer-ho.

En aquest moment és quan vaig descobrir [Drone](https://drone.io/). Jenkins és molt divertit i funciona, però depenent del projecte, sobretot si no és Java, és molt dolent fer la feina (perquè heu d’instal·lar molts connectors o dependències per fer la tasca). A més, la configuració dels projectes i la instal·lació de Jenkins al vostre servidor és una mica tediós i complicat. Per tant, Drone s’executa en un contenidor Docker. Només cal estirar el contenidor i fer-lo funcionar. IMPRESSIONANT! Funciona amb un [.yaml](http://yaml.org/) que defineix el servidor i l'agent i això és tot. Vegem els passos per instal·lar-lo en un servidor Ubuntu 16.04.

> <b> IMPORTANT </b>: heu de tenir certificat SSL al vostre servidor perquè Drone funciona amb https. Llegiu [aquest article](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) per veure com afegir SSL en un Nginx amb Let's Encrypt.


## Instal·lació

Primer de tot, cal tirar de la imatge del dron.
```vim
docker pull drone/drone:0.8
```

A continuació, creeu el docker-compose per executar-lo:
```vim
sudo nano /etc/drone/docker-compose.yml
```

I copieu el següent:
```
version: '2'

services:
  drone-server:
    image: drone/drone:0.8
    ports:
      - 8000:8000
      - 9000:9000
    volumes:
      - /var/lib/drone:/var/lib/drone/
    restart: always
    env_file:
      - /etc/drone/server.env

  drone-agent:
    image: drone/agent:0.8
    command: agent
    restart: always
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    env_file:
      - /etc/drone/agent.env
```
<small> En el meu cas, he utilitzat aquests ports perquè tinc altres coses al meu Nginx, però podeu triar-ne de vostres. També he emmagatzemat el servidor i l'agent `env` vars en fitxers específics. </small>

Ara és hora de crear aquests fitxers. Primer creem el servidor:
```vim
sudo nano /etc/drone/server.env
```

I copieu el següent:
```
# Service settings 
DRONE_SECRET=secret_generated_on_command_line
DRONE_HOST=https://yourDroneURL.com

# Registration settings
DRONE_OPEN=false
DRONE_ADMIN=your_github_username

# GitHub Settings
DRONE_GITHUB=true
DRONE_GITHUB_CLIENT=Client_ID_from_GitHub
DRONE_GITHUB_SECRET=Client_Secret_from_GitHub
```

Per a l’identificador de client i clientSecret de GitHub, heu de registrar Drone al vostre compte de GitHub per obtenir-los. Seguiu [aquestes instruccions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/).

I ara l’agent:
```vim
sudo nano /etc/drone/agent.env
```

I copieu el següent:
```
DRONE_SECRET=secret_generated_on_command_line
DRONE_SERVER=drone-server:9000
```

Per generar el `DRONE_SECRET` podeu escriure l'ordre següent
```vim
LC_ALL=C </dev/urandom tr -dc A-Za-z0-9 | head -c 65 && echo
```

Un cop instal·lat i configurat el Drone, hem de crear un fitxer d’unitat systemd per gestionar el servei.
```vim
sudo nano /etc/systemd/system/drone.service
```

I copieu el següent:
```
[Unit]
Description=Drone server
After=docker.service nginx.service

[Service]
Restart=always
ExecStart=/usr/local/bin/docker-compose -f /etc/drone/docker-compose.yml up
ExecStop=/usr/local/bin/docker-compose -f /etc/drone/docker-compose.yml stop

[Install]
WantedBy=multi-user.target
```

## Configureu Nginx

I, finalment, hem de configurar el Nginx per sol·licitar proxy al nostre servidor Drone. Primer de tot, cerqueu els blocs de servidor habilitats amb l'ordre següent:
```vim
grep -R server_name /etc/nginx/sites-enabled
```

Veureu alguna cosa així:
```vim
Output
/etc/nginx/sites-enabled/default:   server_name yourDroneURL.com;
/etc/nginx/sites-enabled/default:   return 301 https://$server_name$request_uri;
/etc/nginx/sites-enabled/default:   server_name yourDroneURL.com;
/etc/nginx/sites-enabled/default:#  server_name yourDroneURL.com;
```

Després de conèixer el bloc que gestiona el nostre servidor, podem editar-lo escrivint:
```vim
sudo nano /etc/nginx/sites-enabled/default 
```
I afegint aquest text abans del bloc `servidor {`:
```vim
upstream drone {upstream drone {
         server 127.0.0.1:8000;server 127.0.0.1:8000;
 }}

  map $http_upgrade $connection_upgrade {map $http_upgrade $connection_up 
    default upgrade;
    ''      close;
}
```

A continuació, cerqueu el bloc de servidor amb la directiva listen 443 a dins. Substituïu el contingut del bloc d'ubicació pel següent:
```vim
server {
    listen 443 ssl;
    location / {
        # try_files $uri $uri/ =404;
        proxy_pass http://drone;

        include proxy_params;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_buffering off;
        chunked_transfer_encoding off;
        proxy_read_timeout 86400;
    }
}
```

Ara és hora de provar si el nostre Nginx funciona o no:
```vim
sudo nginx -t
```

Hauríeu de veure:
```vim
Output
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Només haureu de reiniciar el servidor i substituireu les peticions:
```vim
sudo systemctl restart nginx
```

Finalment, cal iniciar el servidor Drone:
```vim
sudo systemctl start drone
```

Per comprovar l'estat del contenidor, podeu utilitzar l'ordre següent:
```vim
sudo systemctl status drone
```

Podeu consultar els logs de Nginx:
```vim
sudo less /var/log/nginx/error.log
```

I també podeu consultar els logs de Drone:
```vim
sudo journalctl -u drone
```

Si tot està bé, és hora d’activar Drone:
```vim
sudo systemctl enable drone
```

Si voleu apagar Drone, podeu escriure les ordres següents:
```vim
cd /etc/drone
sudo /usr/local/bin/docker-compose down
```

Visiteu el servidor Drone al vostre https: // yourDroneURL.com i inicieu la sessió amb el compte GitHub que heu utilitzat per obtenir l’identificador de client i el secret del client.

## Referències

* Drone [documentació oficial](http://docs.drone.io/installation/)
* [Article](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-drone-on-ubuntu-16-04) de Digital Ocean