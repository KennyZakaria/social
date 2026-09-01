package mutuelle_backend.dto;

public record LoginResponse(

    String token,

    Long id,

    String username,

    String role,

    String section

) {}