package com.BokKey.BokKey.api.store.dto;

import com.BokKey.BokKey.api.store.domain.Region;
import com.BokKey.BokKey.api.store.domain.Store;

public record StoreSimpleResponse(
        Long storeId,
        String name,
        String area,
        String address,
        boolean isLive,
        String province,
        String city
) {
    public static StoreSimpleResponse from(Store store) {
        Region region = store.getRegion();

        String province = region != null ? region.getProvince() : null;
        String city = region != null ? region.getCity() : null;

        return new StoreSimpleResponse(
                store.getId(),
                store.getName(),
                store.getArea(),
                store.getAddress(),
                store.isLive(),
                province,
                city
        );
    }
}
