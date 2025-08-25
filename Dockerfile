FROM debian:stable-slim

# Install OpenSSH server + Node.js for WebSocket proxy
RUN apt-get update && apt-get install -y \
    openssh-server nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Prepare SSH
RUN mkdir /var/run/sshd

# Create SSH user (example: user=Admin / pass=Admin)
RUN useradd -m -s /bin/bash Admin && \
    echo "Admin:Admin" | chpasswd

# Copy WS proxy
WORKDIR /app
COPY ws-proxy.js /app
RUN npm install ws net

# Expose WS port for Cloud Run
EXPOSE 8080

# Run sshd in foreground (-D) and WS proxy together
CMD /usr/sbin/sshd -D & node /app/ws-proxy.js
