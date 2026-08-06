FROM gradle:8.7-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY src ./src
RUN sed -i 's/\r$//' gradlew
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/envie
ENV SPRING_DATASOURCE_USERNAME=test_user
ENV SPRING_DATASOURCE_PASSWORD=pass1
ENV ENVIE_UPLOAD_DIR=/app/uploads

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
