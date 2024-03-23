+++
title = "Instalación de Drone CI 0.8 en Ubuntu 16.04"
date = "2018-10-10"
author = "charly3pins"
description = "Explicación simple de cómo instalar Drone CI en un servidor Ubuntu 16.04."

tags = ["ci/cd"]

image = "/images/droneio-0.8.png"
+++
Debo admitir que nunca me gustó la parte de sistemas del proceso de desarrollo. Siempre pensé que era un trabajo en un lugar oscuro y sucio, lleno de monstruos haciendo cosas raras. Esta visión cambió por completo cuando comencé a usar [Docker](https://www.docker.com/). En este punto me di cuenta de que toda la magia hecha en la parte del administrador de sistemas era mejor de lo que pensaba y luego, comencé a interesarme más y más de este lado.

Además, en mi trabajo comenzamos a usar [Jenkins](https://jenkins.io/) para [CI/CD](https://www.atlassian.com/continuous-delivery/ci-vs-ci-vs-cd), cambiando nuestra tarea manual de empaquetado-prueba-implementación manual para un proceso automático. ¡¡¡Fue genial!!! Me siento muy feliz porque ahorra mucho tiempo y te permite concentrarte en tus tareas de desarrollo sin perder tiempo en la fase de implementación. Solía ​​pasar mucho tiempo generando mis guerras, implementándolas en sandbox, probando las nuevas características agregadas, implementándolas nuevamente si algo necesita arreglarlo nuevamente y finalmente lanzando una nueva versión del código y desplegándolas en producción. Todos estos pasos se simplificaron con solo ingresar a una rama y luego fusionarse con el maestro (después de la prueba, por supuesto). En este pont, profundicé en cómo se están construyendo e implementando las cosas, dónde (en nuestro caso en AWS) y cómo hacer esas cosas.

En este punto es cuando descubrí [Drone](https://drone.io/). Jenkins es realmente genial y funciona, pero dependiendo del proyecto, especialmente si no es de Java, es realmente malo hacer el trabajo (porque necesitas instalar muchos complementos o dependencias para realizar la tarea). Además, la configuración de los proyectos y la instalación del propio Jenkins en tu servidor es un poco tediosa y complicada. Entonces, Drone se ejecuta en un contenedor Docker. Solo necesitas tirar del contenedor y ejecutarlo. ¡INCREÍBLE! Funciona con un [.yaml](http://yaml.org/) que define el servidor y el agente y eso es todo. Entonces, veamos los pasos para instalarlo en un servidor Ubuntu 16.04.

> <b> IMPORTANTE </b>: Debe tener un certificado SSL en su servidor porque Drone se ejecuta bajo https. Lea [este artículo](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) para ver cómo agregar SSL en un Nginx con Let's Encrypt.


## Instalación

En primer lugar, debe extraer la imagen de Drone.
```vim
docker pull drone/drone:0.8
```

Luego crea el docker-compose para ejecutarlo:
```vim
sudo nano /etc/drone/docker-compose.yml
```

Y copia lo siguiente:
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
<small> En mi caso he usado estos puertos porque tengo otras cosas en mi Nginx, pero tú puedes elegir las tuyas. También he almacenado las variables del servidor y del agente `env` en archivos específicos. </small>

Ahora es el momento de crear esos archivos. Primero creamos el servidor:
```vim
sudo nano /etc/drone/server.env
```

Y copia lo siguiente:
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

Para el clientID y clientSecret de GitHub, debe registrar Drone en su cuenta de GitHub para obtenerlos. Siga [estas instrucciones](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/).

Y ahora el agente:
```vim
sudo nano /etc/drone/agent.env
```

Y copia lo siguiente:
```
DRONE_SECRET=secret_generated_on_command_line
DRONE_SERVER=drone-server:9000
```

Para generar el `DRONE_SECRET` puede escribir el siguiente comando
```vim
LC_ALL=C </dev/urandom tr -dc A-Za-z0-9 | head -c 65 && echo
```

Una vez que nuestro Drone está instalado y configurado, necesitamos crear un archivo de unidad systemd para administrar el servicio.
```vim
sudo nano /etc/systemd/system/drone.service
```

Y copia lo siguiente:
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

## Configurar Nginx

Y finalmente tenemos que configurar nuestro Nginx para las solicitudes de proxy a nuestro servidor Drone. En primer lugar, busque los bloques de servidor habilitados con el siguiente comando:
```vim
grep -R server_name /etc/nginx/sites-enabled
```

Verás algo como esto:
```vim
Output
/etc/nginx/sites-enabled/default:   server_name yourDroneURL.com;
/etc/nginx/sites-enabled/default:   return 301 https://$server_name$request_uri;
/etc/nginx/sites-enabled/default:   server_name yourDroneURL.com;
/etc/nginx/sites-enabled/default:#  server_name yourDroneURL.com;
```

Luego de conocer el bloque que está manejando nuestro servidor, podemos editarlo escribiendo:
```vim
sudo nano /etc/nginx/sites-enabled/default 
```
Y agregando este texto antes del bloque `server {`:
```vim
upstream drone {upstream drone {
         server 127.0.0.1:8000;server 127.0.0.1:8000;
 }}

  map $http_upgrade $connection_upgrade {map $http_upgrade $connection_up 
    default upgrade;
    ''      close;
}
```

A continuación, busque el bloque del servidor con la directiva listen 443 dentro. Reemplace el contenido del bloque de ubicación con lo siguiente:
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

Ahora es el momento de probar si nuestro Nginx está funcionando o no:
```vim
sudo nginx -t
```

Verás algo como esto:
```vim
Output
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Solo necesita reiniciar el servidor y enviará las solicitudes por proxy:
```vim
sudo systemctl restart nginx
```

Finalmente, debe iniciar el servidor Drone:
```vim
sudo systemctl start drone
```

Para comprobar el estado del contenedor puede utilizar el siguiente comando:
```vim
sudo systemctl status drone
```

Puebe comprobar los logs de Nginx:
```vim
sudo less /var/log/nginx/error.log
```

También puede comprobar los logs de Drone:
```vim
sudo journalctl -u drone
```

Si todo está bien, es hora de habilitar Drone:
```vim
sudo systemctl enable drone
```

Si desea apagar Drone, puede escribir los siguientes comandos:
```vim
cd /etc/drone
sudo /usr/local/bin/docker-compose down
```

Visite su servidor de Drone en su `https://yourDroneURL.com` e inicie sesión con la cuenta de GitHub que utilizó para obtener el ID de cliente y el secreto del cliente.

## Referencias
* Drone [documentación oficial](http://docs.drone.io/installation/)
* [Artículo](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-drone-on-ubuntu-16-04) de Digital Ocean