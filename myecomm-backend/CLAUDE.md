# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
# Build
./mvnw clean install

# Run the application (starts on http://localhost:8080)
./mvnw spring-boot:run

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=ClassName

# Run a single test method
./mvnw test -Dtest=ClassName#methodName

# Skip tests during build
./mvnw clean install -DskipTests
```

Swagger UI is available at `http://localhost:8080/swagger-ui/` when the app is running.

## Prerequisites

- Java 21
- Maven (wrapper included: `mvnw` / `mvnw.cmd`)
- PostgreSQL running on `localhost:5432` with a database named `ecommerce`
- `STRIPE_SECRET_KEY` environment variable set for payment features

## Architecture

Spring Boot 3.5.3 e-commerce REST API using a layered architecture:

```
Controller → Service (interface) → ServiceImpl → Repository → PostgreSQL
```

**Source root:** `src/main/java/com/ecommerce/sb_ecom/`

| Layer | Package | Purpose |
|---|---|---|
| Controllers | `controller/` | REST endpoints, request validation |
| Services | `service/` | Business logic (interface + impl pattern) |
| Repositories | `repositories/` | Spring Data JPA interfaces |
| Entities | `model/` | JPA entity classes (Lombok-annotated) |
| DTOs | `payload/` | Request/response objects |
| Security | `security/` | JWT auth, Spring Security config, filters |
| Config | `config/` | App beans, Swagger, CORS, constants |
| Exceptions | `projectexceptions/` | Global exception handler + custom exceptions |

## Key Patterns

- **DTO mapping** uses ModelMapper (bean in `AppConfig`). Entities are never exposed directly in API responses.
- **Pagination defaults** are in `AppConstants`: page size 10, page number 0, sort varies by entity.
- **JWT authentication** is stateless — tokens are issued as both cookies (`springBootEcom`) and in the response body. `AuthTokenFilter` extracts tokens from cookies or the `Authorization: Bearer` header.
- **Role-based access**: `ROLE_USER`, `ROLE_SELLER`, `ROLE_ADMIN`. Route security is configured in `WebSecurityConfig`.
- **Exception handling**: `MyGlobalExceptionHandler` (`@RestControllerAdvice`) catches `ResourceNotFoundException`, `APIException`, and validation errors.
- **Image uploads** are stored on the local filesystem under `images/` and served via a resource handler configured in `WebMvcConfig`.

## API Route Security

| Path pattern | Access |
|---|---|
| `/api/auth/**` | Public |
| `/api/public/**` | Public |
| `/api/admin/**` | ROLE_ADMIN |
| `/api/seller/**` | ROLE_ADMIN or ROLE_SELLER |
| `/swagger-ui/**`, `/v3/api-docs/**` | Public |

## Database

PostgreSQL with Hibernate `ddl-auto=update`. Key entity relationships:

- User ↔ Cart (1:1), User → Address (1:M), User ↔ Role (M:M)
- Product → Category (M:1), Product → User/seller (M:1)
- Cart → CartItem (1:M), CartItem → Product (M:1)
- Order → OrderItem (1:M), Order → Payment (1:1), Order → Address (M:1)

Roles and seed users are auto-created on startup via a `CommandLineRunner` in `WebSecurityConfig`.

## CORS

Configured to allow origins: `localhost:3000`, `localhost:5173`, and the `frontend.url` property.
