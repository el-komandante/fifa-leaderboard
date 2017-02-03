FROM node:7.5.0-alpine
RUN apk add git --no-cache
RUN git clone https://github.com/el-komandante/fifa-leaderboard.git
RUN cd fifa-leaderboard && npm install
RUN cd fifa-leaderboard && npm run build && cp -a ./build/.
