# Stage 1: Build Nuxt 3 application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies with yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code and build
COPY . .

# Build arguments for compile-time environment variables
ARG NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_API_BASE_URL=${NUXT_PUBLIC_API_BASE_URL}

RUN yarn build

# Stage 2: Minimal runtime image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Copy only the compiled output from builder
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
