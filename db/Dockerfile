# Use the official PostgreSQL image from Docker Hub
FROM postgres:13-alpine

# Set environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=static_web_hosting

# Copy the initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# Run PostgreSQL
CMD ["postgres"]
