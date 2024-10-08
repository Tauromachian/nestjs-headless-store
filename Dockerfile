FROM node:20-alpine AS base

FROM base as builder
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM base as runner
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV APP_PORT 3000

CMD ["node", "dist/main.js"]
