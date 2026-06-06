package net.planificateureventcampus.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", "Erreur de validation");
    response.put("errors", errors);
    response.put("status", 400);
    response.put("timestamp", LocalDateTime.now());

    return ResponseEntity.badRequest().body(response);
  }


  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", ex.getMessage());
    response.put("status", 400);
    response.put("timestamp", LocalDateTime.now());
    return ResponseEntity.badRequest().body(response);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", "Email ou mot de passe incorrect");
    response.put("status", 401);
    response.put("timestamp", LocalDateTime.now());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", "Vous n'avez pas les droits nécessaires");
    response.put("status", 403);
    response.put("timestamp", LocalDateTime.now());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("message", "Une erreur interne est survenue");
    response.put("error", ex.getMessage());
    response.put("status", 500);
    response.put("timestamp", LocalDateTime.now());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}
