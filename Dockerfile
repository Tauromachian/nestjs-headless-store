FROM node:20-alpine AS base

FROM base as builder
WORKDIR /app

ENV APP_ENV production
RUN corepack enable

COPY package.json yarn.lock
RUN yarn

COPY . .
RUN yarn build

FROM base as runner
WORKDIR /app

COPY --from=builder chown=nestjs:nodejs /app/dist ./

EXPOSE 3000
ENV APP_PORT 3000

CMD ["node", "main.js"]
