# Simple hosting solution

Simple hosting solution, storing static files on minio bucket, serving to browser with nginx

## Technologies Used

- **Backend**: Flask, PostgreSQL, SQLAlchemy
- **Frontend**: Tailwind CSS, Django
- **Storage**: MinIO
- **Proxy Server**: NGINX
- **Other Tools**: Docker, Docker Compose

## How to Run

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Set Up Environment Variables:**

   Each service requires an `.env` file for configuration. You can generate these from `.env.example` files provided.

   ```bash
   # For PostgreSQL
   cp db/.env.example db/.env

   # For MinIO
   cp minio/.env.example minio/.env

   # For Server
   cp server/.env.example server/.env
   ```

   Edit these `.env` files with your specific configuration details.

3. **Build and Start the Docker Containers:**

   ```bash
   docker-compose up -d --build
   ```

   This command will build and start all services defined in `docker-compose.yml`, including MinIO, PostgreSQL, server, NGINX, etc.

4. **Accessing Services:**

   - **Admin panel:** Available at `http://localhost:5000`
   - **MinIO:** Access MinIO UI at `http://localhost:9000` (login with `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`)

5. **Stopping the Application:**

   ```bash
   docker-compose down
   ```

   This command stops and removes the Docker containers, networks, and volumes created by `docker-compose up`.
