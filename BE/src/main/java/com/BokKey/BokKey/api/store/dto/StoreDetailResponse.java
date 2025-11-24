package com.BokKey.BokKey.api.store.dto;

import com.BokKey.BokKey.api.store.domain.Region;
import com.BokKey.BokKey.api.store.domain.Store;

public record StoreDetailResponse(
        Long storeId,
        String name,
        String address,
        String phone,
        String openHours,
        boolean isFavorite,
        String areaName,      // 기존 area
        String province,      // 시/도
        String city           // 시/군/구
) {
    public static StoreDetailResponse from(Store store) {
        Region region = store.getRegion();

        String province = region != null ? region.getProvince() : null;
        String city = region != null ? region.getCity() : null;

        return new StoreDetailResponse(
                store.getId(),
                store.getName(),
                store.getAddress(),
                store.getPhone(),
                store.getOpenHours(),
                false,
                store.getArea(),
                province,
                city
        );
    }
}
