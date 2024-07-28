## DOCKER-UI

Currently, I use swarm for my projects. But, I struggle to manage my docker containers. I need a simple way to manage my docker containers in one place.
The purpose of this project is to help me manage my docker service in one place, one page.

![image](https://github.com/user-attachments/assets/9c1a916d-ab52-4c7e-af12-0703c063f2fd)

### Environments

The following environment variables are required:

- AUTH_USERNAME
- AUTH_PASSWORD
- APP_API_URL

### Mount

You should mount the docker into the container.

#### Docker Container

```bash
docker run -e APP_API_URL=http://localhost:81 \
-e AUTH_USERNAME=muhfaris \
-e AUTH_PASSWORD=muhfaris \
--name docker-ui  \
-p 81:80 \
-v /var/run/docker.sock:/var/run/docker.sock ghcr.io/muhfaris/docker-ui:<version>

```
