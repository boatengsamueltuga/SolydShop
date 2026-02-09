# Backend – E-Commerce Application

This is the backend service for a full-stack e-commerce application.  
It is built with **Spring Boot** and provides REST APIs for the frontend.

## Tech Stack
- Java
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- Maven
- MySQL / PostgreSQL

## Project Structure
- `controller` – REST API endpoints
- `service` – Business logic
- `repositories` – Data access layer
- `model` – JPA entities
- `payload` – DTOs (request/response)
- `security` – Authentication and authorization
- `config` – Application configuration
- `projectexceptions` – Global exception handling

## How to Run

### Prerequisites
- Java 17+ (or your configured version)
- Maven
- Database configured

### Run Command
```bash
./mvnw spring-boot:run

### The application will start on:

http://localhost:8080

### Application settings are located in:

src/main/resources/application.properties