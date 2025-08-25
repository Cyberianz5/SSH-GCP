FROM debian:stable-slim

# Install OpenSSH server + Node.js for WebSocket proxy
RUN apt-get update && apt-get install -y \
    openssh-server nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Create runtime dir for sshd
RUN mkdir -p /var/run/sshd

# Create SSH user (example: user=Admin / pass=Admin)
RUN useradd -m -s /bin/bash Admin && \
    echo "Admin:Admin" | chpasswd

# Copy WS proxy
WORKDIR /app
COPY ws-proxy.js /app
RUN npm install ws net

# Expose SSH (22 internal) + WebSocket (8080 for Cloud Run)
EXPOSE 22 8080

# Start SSH + WS proxy
CMD service ssh start && node ws-proxy.js
