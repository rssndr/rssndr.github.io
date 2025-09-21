# TCP Server

A TCP Server written in C, with detailed notes.

## Source Code

Github: [TCP Server](https://github.com/rssndr/tcp-server/)

## What is a TCP Server?

A TCP server enables communication with clients over the internet using the TCP protocol, providing reliable data exchange. It listens for incoming connections, processes client requests, and sends responses.

### Main Steps

1. Create Socket
2. Configure Server Address
3. Bind Socket
4. Listen for Connections
5. Accept Client Connections
6. Read Client Data
7. Send Response
8. Close Client Socket
9. Repeat or Cleanup

### Writing C code

#### Constants and Variables

```c
#define PORT 8181
#define BUF_SIZE 512

int main() {
    int s, c;
    socklen_t addrlen;
    struct sockaddr_in srv, cli;
    char buf[BUF_SIZE];
    const char *data = "httpd v1.0\n";
```

##### Constants:

- **#define PORT 8181**: The port where the server will listen for connections.
- **#define BUF_SIZE 512**: The buffer to read client data.

##### Variables:

- **int s**: File descriptor for the server socket, used to listen for incoming connections
- **int c**: File descriptor for the client socket, created when a client connection is accepted
- **socklen_t addrlen**: stores the size of the client's address structure, used in accept().
- **struct sockaddr_in srv, cli**: Structures to hold address information.
    - **srv**: Configures the server’s address (IP and port).
    - **cli**: Stores the client’s address (populated by accept()).
    - **sockaddr_in** is for IPv4 and includes fields like sin_family, sin_addr, and sin_port.
- **char buf[BUF_SIZE]**: A buffer to store data read from the client, sized according to BUF_SIZE (512 bytes).
- **const char \*data = "httpd v1.0\n"**: A constant string literal for the response sent to clients.

#### 1. Create Socket

Initializes a communication endpoint for TCP over IPv4, enabling network operations.

```c
s = socket(AF_INET, SOCK_STREAM, 0);
if (s < 0) {
    perror("socket");
    return 1;
}
```

#### 2. Configure Server Address

Specifies the server's IP and port, defining where it listens for connections.

```c
memset(&srv, 0, sizeof(srv));
srv.sin_family = AF_INET;
srv.sin_addr.s_addr = INADDR_ANY;
srv.sin_port = htons(PORT);
```

#### 3. Bind Socket

Links the socket to the network address, enabling it to receive connections on the specified port.

```c
if (bind(s, (struct sockaddr *)&srv, sizeof(srv)) < 0) {
    perror("bind");
    close(s);
    return 1;
}
```

#### 4. Listen for Connections

Marks the socket as passive, ready to queue incoming connection requests from clients.

```c
if (listen(s, 5) < 0) {
    perror("listen");
    close(s);
    return 1;
}
printf("Listening on 0.0.0.0:%d\n", PORT);
```

#### 5. Accept Client Connections

Establishes a dedicated socket for each client, alllowing data exchange while keeping the server socket listening.

```c
while (1) {
    addrlen = sizeof(cli);
    c = accept(s, (struct sockaddr *)&cli, &addrlen);
    if (c < 0) {
        perror("accept");
        continue;
    }
    printf("Client connected from %s:%d\n", inet_ntoa(cli.sin_addr), ntohs(cli.sin_port));
```

#### 6. Read Client Data

Captures client requests or messages for processing, enabling the server to respond appropriately.

```c
size_t n = read(c, buf, BUF_SIZE - 1);
if (n < 0) {
    perror("read");
    close(c);
    continue;
}
buf[n] = '\0';
printf("Received: %s\n", buf);
```

#### 7. Send Response

Provides the client with the server's response, fulfilling the communication purpose (e.g., serving data).

```c
if (write(c, data, strlen(data)) != strlen(data)) {
    perror("write");
}
```

#### 8. Close Client Connection

Frees resources for the client connection.

```c
close(c);
```

#### 9. Cleanup (or Repeat)

Closes server socket (or accepts more clients).

```c
close(s)
return 0;
}
```

#### Optimization: Enable Port Reuse

When a TCP connection is closed, the port doesn't immediately become available again. Instead, it enters a **TIME_WAIT** state for a short period. This delay ensures that delayed packets from the closed connection don't interfere with new connections.
Without **SO_REUSEADDR**, attempting to bind a new socket to the same port during **TIME_WAIT** results in a "Address already in use: error, preventing the server from starting.
Instead, with **SO_REUSEADDR** the server is more robust and easier to restart.

```c
int opt = 1;
if (setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
    perror("setsockopt");
    close(s);
    return 1;
}
```

### Putting it all together - Full code

```c
// tcp-server.c
#include <arpa/inet.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <unistd.h>
#include <errno.h>

#define PORT 8181
#define BUF_SIZE 512

int main() {
    int s, c;
    socklen_t addrlen;
    struct sockaddr_in srv, cli;
    char buf[BUF_SIZE];
    const char *data = "httpd v1.0\n";

    // Create socket
    s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        perror("socket");
        return 1;
    }

    // Allow port reuse
    int opt = 1;
    if (setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
        perror("setsockopt");
        close(s);
        return 1;
    }

    // Configure server address
    memset(&srv, 0, sizeof(srv));
    srv.sin_family = AF_INET;
    srv.sin_addr.s_addr = INADDR_ANY;
    srv.sin_port = htons(PORT);

    // Bind socket
    if (bind(s, (struct sockaddr *)&srv, sizeof(srv)) < 0) {
        perror("bind");
        close(s);
        return 1;
    }

    // Listen for connections
    if (listen(s, 5) < 0) {
        perror("listen");
        close(s);
        return 1;
    }
    printf("Listening on 0.0.0.0:%d\n", PORT);

    // Main loop to handle clients
    while (1) {
        addrlen = sizeof(cli);
        c = accept(s, (struct sockaddr *)&cli, &addrlen);
        if (c < 0) {
            perror("accept");
            continue;
        }
        printf("Client connected from %s:%d\n", inet_ntoa(cli.sin_addr), ntohs(cli.sin_port));

        // Read from client
        ssize_t n = read(c, buf, BUF_SIZE - 1);
        if (n < 0) {
            perror("read");
            close(c);
            continue;
        }
        buf[n] = '\0';
        printf("Received: %s\n", buf);

        // Send response
        if (write(c, data, strlen(data)) != strlen(data)) {
            perror("write");
        }

        close(c);
    }

    close(s);
    return 0;
}

```

