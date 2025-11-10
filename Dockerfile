FROM node:18-alpine AS builder

WORKDIR /app

RUN npm i -g corepack@latest

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i

COPY . .
RUN pnpm build \
    && pnpm prune --prod

FROM node:18-alpine AS app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
RUN corepack enable pnpm

WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/package.json /app/pnpm-lock.yaml ./
# for typeorm migration
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.json /app/tsconfig.build.json /app/ormconfig.ts ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/ ./node_modules/
COPY --from=builder --chown=nestjs:nodejs /app/dist/ ./dist/

ENV PATH="/app/node_modules/.bin:$PATH"

USER nestjs

ENTRYPOINT ["node", "dist/main"]