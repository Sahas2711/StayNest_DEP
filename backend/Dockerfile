# Stage 1: Build the Spring Boot JAR
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the JAR
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (Render expects this)
EXPOSE 8080

# Default command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
