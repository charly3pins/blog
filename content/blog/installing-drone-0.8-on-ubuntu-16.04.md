+++
title = "Installing Drone 0.8 on Ubuntu 16.04"
date = "2018-10-10"
author = "charly3pins"
description = "Simple post explaining how to install Drone on Ubuntu 16.04 server."

tags = ["drone", "CI", "devops"]

image = "/images/droneio-0.8.png"
+++
I have to admit that I never liked the systems part of the development process. I always though that it was a job in a dark and creppy place, full of freaks doing a rare things. This vision completely changed when I started using [Docker](https://www.docker.com/). On this point I realized that all the magic done in the sysadmin part was better than I though and then, I started intereseting more an more on this side. 

Also, at my job we've started using [Jenkins](https://jenkins.io/) for [CI/CD](https://www.atlassian.com/continuous-delivery/ci-vs-ci-vs-cd), chaning our manual packing-testing-deploying manual task for an automatic process. It was super cool!!! I've feel very happy because it saves a lot of time and allows you to concentrate in your development tasks not wasting time in the deployment phase. I've use to spend a lot of time generating my wars, deploying them to sandbox, testing the new features added, deploying again if something need to fix it again and finally releasing a new version of code and deploying to production. All these steps were simiplified with just comitting to a branch and then mergin to master (after testing of course). At this pont I profundized in how the things are being build and deployed, where (in our case in AWS) and how to do that things. 

At this point is when I discovered [Drone](https://drone.io/). Jenkins is really cool and it works, but depending on the project, specially if it's not a Java one, is really bad doing the job (because you need to install a lot of plugins or depenencies to do the task). Also, the configuration of the projects and the installation of Jenkins itself in your server is a bit tedious and complicate. So, Drone is running in a Docker container. You only need to pull the container and run it. AWESOME! It works with a [.yaml](http://yaml.org/) defining the server and the agent and thats all. So let's see the steps to install it in an Ubuntu 16.04 server.

> <b>IMPORTANT</b>: You need to have SSL certificate in your server because Drone runs under https. Read [this article](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) to see how to add SSL in a Nginx with Let's Encrypt.


# Installation

## Drone

First of all you need to pull the drone image.
```
docker pull drone/drone:0.8
```

Then create the docker-compose for run it:
```
$ sudo nano /etc/drone/docker-compose.yml
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
<small>In my case I've used these ports because I have other things in my Nginx, but you can choose your own ones. I've also stored the server and agent `env` vars in a specific files.</small>

Now it's time to create those files. First we create the server one:
```
sudo nano /etc/drone/server.env
```
server.env
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

For the GitHub clientID and clientSecret, you must register Drone in your GitHub account to obtain them. Follow [these instructions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/).

And now the agent one:
```
sudo nano /etc/drone/agent.env
```
agent.env
```
DRONE_SECRET=secret_generated_on_command_line
DRONE_SERVER=drone-server:9000
```

To generate the `DRONE_SECRET` you can ype the following command 
```
LC_ALL=C </dev/urandom tr -dc A-Za-z0-9 | head -c 65 && echo
```

Once our Drone is installed and configured, we need to create a systemd unit file to manage the service.
```
sudo nano /etc/systemd/system/drone.service
```
drone.service
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

## Configure Nginx

And finally we need to configure our Nginx to proxy requests to our Drone server. First of all find the enabled server blocks with the following command:
```
grep -R server_name /etc/nginx/sites-enabled
```
You'll see something like this:
```
Output
/etc/nginx/sites-enabled/default:   server_name yourDroneURL.com;
/etc/nginx/sites-enabled/default:   return 301 https://$server_name$request_uri;
/etc/nginx/sites-enabled/default:   server_name yourDroneURL.com;
/etc/nginx/sites-enabled/default:#  server_name yourDroneURL.com;
```

After knowing the block that is handling our server, we can edit it typping:
```
sudo nano /etc/nginx/sites-enabled/default 
```
And adding this text before the `server {` block:
```
upstream drone {upstream drone {
         server 127.0.0.1:8000;server 127.0.0.1:8000;
 }}

  map $http_upgrade $connection_upgrade {map $http_upgrade $connection_up 
    default upgrade;
    ''      close;
}
```

Next, find the server block with the listen 443 directive inside. Replace the contents of the location block with the following:
```
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

Now it's time to test if our Nginx it's working or not:
```
sudo nginx -t
```
You should see:
```
Output
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

You just need to restart the server and will proxy the requests:
```
sudo systemctl restart nginx
```

Finally, you need to start the Drone server:
```
sudo systemctl start drone
```

To check the status of the container you can use the following command:
```
sudo systemctl status drone
```

You can check the Nginx logs:
```
sudo less /var/log/nginx/error.log
```

And also you can chcek the Drone logs:
```
sudo journalctl -u drone
```

If all it's okay, its time to enable Drone:
```
sudo systemctl enable drone
```

If you want to switch off Drone you can type the following commands:
```
cd /etc/drone
sudo /usr/local/bin/docker-compose down
```

# Enjoy

Visit your Drone server at your `https://yourDroneURL.com` and log in with the GitHub account you used for obtain the clientID and client secret.

# References
* Drone official [documentation](http://docs.drone.io/installation/)
* Digital Ocean [article](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-drone-on-ubuntu-16-04)