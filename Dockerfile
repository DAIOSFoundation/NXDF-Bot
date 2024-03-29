FROM node:16.13.0
MAINTAINER jeun<jeun@daiblab.com>

# 도커안의 앱 디렉터리 생성
WORKDIR /project/discordBot

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
# COPY package*.json ./
COPY . /project/discordBot

# Install Packages
RUN apt-get update -y && apt-get install git nano vim tzdata -y

RUN npm install -g pm2 node-gyp
RUN npm install
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
ENV NODE_ENV development

# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --only=production

# EXPOSE 8000-9000
EXPOSE 80
CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "development"]
