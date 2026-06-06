package net.planificateureventcampus.DTOs;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseDTO<T> {

    private boolean success;
    private String message;
    private T data;
    private String error;
    private int statusCode;
    private LocalDateTime timestamp;


    public static <T> ApiResponseDTO<T> success(T data, String message) {
        ApiResponseDTO<T> response = new ApiResponseDTO<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        response.setStatusCode(200);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    public static <T> ApiResponseDTO<T> success(T data) {
        return success(data, "Opération réussie");
    }

    public static <T> ApiResponseDTO<T> success(String message) {
        return success(null, message);
    }

    public static <T> ApiResponseDTO<T> error(String message, int statusCode) {
        ApiResponseDTO<T> response = new ApiResponseDTO<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setError(message);
        response.setStatusCode(statusCode);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    public static <T> ApiResponseDTO<T> error(String message) {
        return error(message, 400);
    }

    public static <T> ApiResponseDTO<T> unauthorized(String message) {
        return error(message, 401);
    }

    public static <T> ApiResponseDTO<T> forbidden(String message) {
        return error(message, 403);
    }

    public static <T> ApiResponseDTO<T> notFound(String message) {
        return error(message, 404);
    }
}
