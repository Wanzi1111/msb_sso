FROM nginx:1.19.6-alpine
RUN \
  echo '{"status":"UP"}' > /opt/liveness.txt && \
  echo '{"status":"UP"}' > /opt/readiness.txt

ENV TZ "Asia/Shanghai"

COPY ./src/main/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./dist/index.html /opt

ENTRYPOINT ["nginx", "-g", "daemon off;"]

