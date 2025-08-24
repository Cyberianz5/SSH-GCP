FROM debian:stable-slim

# Install OpenSSH server + Node.js for WebSocket proxy
RUN apt-get update && apt-get install -y \
    openssh-server nodejs npm && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /var/run/sshd

# Create SSH user (example: user=Admin / pass=Admin)
RUN useradd -m -s /bin/bash Admin && \
    echo "Admin:Admin" | chpasswd

# Copy WS proxy
WORKDIR /app
COPY ws-proxy.js /app
RUN npm install ws net

# Expose SSH internally + Cloud Run external
EXPOSE 8080 22

# Start sshd in background, then run WebSocket proxy in foreground
CMD /usr/sbin/sshd -D & node /app/ws-proxy.js
