# Estágio de construção
FROM ubuntu:latest AS builder
RUN apt-get update && apt-get install -y git
#RUN git clone https://github.com/EricMGS/BeACat.git /tmp/repositorio
ADD . /tmp/repositorio

# Estágio final
FROM nginx:alpine
LABEL maintainer="ericmgsouza@gmail.com"
COPY --from=builder /tmp/repositorio /usr/share/nginx/html
WORKDIR /usr/share/nginx/html/BeACat
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]