FROM node:24.20.0-bookworm-slim
ENV NODE_ENV=production PLAYWRIGHT_BROWSERS_PATH=/opt/playwright PORT=8080
WORKDIR /app/services/displayr-gateway
COPY services/displayr-gateway/package.json services/displayr-gateway/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
    && npx playwright install --with-deps chromium \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/*
COPY services/displayr-gateway/*.mjs ./
COPY experiments/displayr-gateway/gateway.mjs /app/experiments/displayr-gateway/gateway.mjs
USER node
EXPOSE 8080
CMD ["node", "start.mjs"]
