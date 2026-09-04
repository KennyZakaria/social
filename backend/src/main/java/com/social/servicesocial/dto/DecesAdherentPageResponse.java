package com.social.servicesocial.dto;

import java.util.List;

public record DecesAdherentPageResponse(
        List<DecesAdherentResponse> content,
        int number,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean empty
) {}