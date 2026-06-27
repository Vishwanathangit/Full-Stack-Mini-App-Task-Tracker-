FROM eclipse-temurin:21-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the packaged jar file into the container
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Define environment variables with default values
ENV JWT_SECRET=your-super-secret-key-change-this-in-production
ENV JWT_EXPIRATION=86400000
ENV CORS_ALLOWED_ORIGINS=http://localhost:5173
ENV DB_PATH=tasktracker.db

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
