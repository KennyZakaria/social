package mutuelle_backend.dto;

import java.util.List;

public record AdherentPageResponse(

        List<AdherentResponse> content,

        int number,

        int size,

        long totalElements,

        int totalPages,

        boolean first,

        boolean last,

        boolean empty

) {
}