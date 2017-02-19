FROM node:7.5.0-alpine
RUN apk add git --no-cache
RUN git clone https://github.com/el-komandante/fifa-leaderboard.git
RUN cd fifa-leaderboard && npm install --silent
RUN cd fifa-leaderboard && npm run --silent build && cp -a ./build/.
RUN echo "done yo"
