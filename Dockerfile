# Use an official Node.js image based on Debian as a base
FROM node:current-slim

# Set environment variable for pnpm version
ARG pnpm_version=latest

# Update and install dependencies for sharp, VLC, and other utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    g++ \
    make \
    python3 \
    libc6-dev \
    libjpeg-dev \
    libpng-dev \
    libvips-dev \
    curl \
    git \
    openssh-client \
    vlc \
    ffmpeg \
    imagemagick \
    wget \
    unzip && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@$pnpm_version

# Install sharp using pnpm
RUN pnpm install --save node-addon-api node-gyp sharp next@canary

# Set the working directory
WORKDIR /app
