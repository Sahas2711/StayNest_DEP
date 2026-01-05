# ===============================
# Stage 1: Build the application
# ===============================
FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

# Copy everything
COPY . .

# Use Maven Wrapper (important for consistency)
RUN ./mvnw clean package -DskipTests

# ===============================
# Stage 2: Run the application
# ===============================
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy only the built JAR
COPY --from=build /app/target/StayNest-0.0.1-SNAPSHOT.jar app.jar

# Render injects PORT dynamically
EXPOSE 8080

# Run Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
