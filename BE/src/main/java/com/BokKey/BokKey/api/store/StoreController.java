package com.BokKey.BokKey.api.store;

import com.BokKey.BokKey.api.store.dto.StoreDetailResponse;
import com.BokKey.BokKey.api.store.dto.StoreSimpleResponse;
import com.BokKey.BokKey.api.store.service.StoreService;
import com.BokKey.BokKey.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    // 지역 필터 (ex. /stores/filter/district?district=서울)
    @GetMapping("/filter/district")
    public ResponseEntity<ApiResponse<List<StoreSimpleResponse>>> filterByDistrict(
            @RequestParam(required = false) String areaName,
            @RequestParam(required = false) String district
    ) {
        List<StoreSimpleResponse> result;

        if (areaName != null && !areaName.isBlank()) {
            result = storeService.findByAreaName(areaName);
        } else if (district != null && !district.isBlank()) {
            result = storeService.findByDistrict(district);
        } else {
            throw new IllegalArgumentException("areaName 또는 district 중 하나는 필수입니다.");
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }


    // 실시간 영업여부 필터
    @GetMapping("/status/live")
    public ResponseEntity<ApiResponse<List<StoreSimpleResponse>>> liveStores(@RequestParam boolean now) {
        List<StoreSimpleResponse> result = storeService.findLiveStores(now);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 카테고리(복지관 등) 필터
    @GetMapping("/filter/category")
    public ResponseEntity<ApiResponse<List<StoreSimpleResponse>>> filterByCategory(@RequestParam String category) {
        List<StoreSimpleResponse> result = storeService.findByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 상세 조회
    @GetMapping("/{storeId}/detail")
    public ResponseEntity<ApiResponse<StoreDetailResponse>> getDetail(@PathVariable Long storeId) {
        StoreDetailResponse detail = storeService.getDetail(storeId);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    // 이름 검색
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StoreSimpleResponse>>> searchByName(@RequestParam String name) {
        List<StoreSimpleResponse> result = storeService.searchByName(name);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
