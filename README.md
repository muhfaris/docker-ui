## DOCKER-UI

Currently, I use swarm for my projects. But, I struggle to manage my docker containers. I need a simple way to manage my docker containers in one place.
The purpose of this project is to help me manage my docker service in one place, one page.

![image](https://github.com/user-attachments/assets/42266179-f64e-44c8-b64c-fac43fcbb105)

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
