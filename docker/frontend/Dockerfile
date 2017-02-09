FROM node:7.5.0-alpine
RUN apk add git --no-cache
RUN mkdir /app
RUN git clone https://github.com/el-komandante/fifa-leaderboard.git
RUN cd fifa-leaderboard && npm install --silent && npm install -g http-server
EXPOSE 8080
RUN cd fifa-leaderboard && npm run --silent build && cp -a ./build/. /app
