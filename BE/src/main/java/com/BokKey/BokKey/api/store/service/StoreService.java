package com.BokKey.BokKey.api.store.service;

import com.BokKey.BokKey.api.store.StoreRepository;
import com.BokKey.BokKey.api.store.domain.Store;
import com.BokKey.BokKey.api.store.dto.StoreDetailResponse;
import com.BokKey.BokKey.api.store.dto.StoreSimpleResponse;
import com.BokKey.BokKey.global.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    // 지역(시/군/구) 기반 검색
    public List<StoreSimpleResponse> findByDistrict(String district) {
        return storeRepository.findByRegion_CityContaining(district)
                .stream()
                .map(StoreSimpleResponse::from)
                .toList();
    }

    //  전체 지역명(예: 서울특별시 강남구) 검색
    public List<StoreSimpleResponse> findByAreaName(String areaName) {
        return storeRepository.findByRegion_AreaNameContaining(areaName)
                .stream()
                .map(StoreSimpleResponse::from)
                .toList();
    }

    // 실시간 운영 중인 가게 조회
    public List<StoreSimpleResponse> findLiveStores(boolean now) {
        return storeRepository.findByIsLive(now)
                .stream()
                .map(StoreSimpleResponse::from)
                .toList();
    }

    //  지원 대상(예: 아동, 노인, 장애인) 필터
    public List<StoreSimpleResponse> findByTargetType(String type) {
        return storeRepository.findByTargets_DistrictContaining(type)
                .stream()
                .map(StoreSimpleResponse::from)
                .toList();
    }

    // 카테고리 필터(예: 무료급식소, 복지관 등)
    public List<StoreSimpleResponse> findByCategory(String category) {
        return storeRepository.findByCategories_NameContaining(category)
                .stream()
                .map(StoreSimpleResponse::from)
                .toList();
    }

    // 가게 상세 조회
    public StoreDetailResponse getDetail(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new NotFoundException("해당 가게를 찾을 수 없습니다."));
        return StoreDetailResponse.from(store);
    }

    //  이름 검색
    public List<StoreSimpleResponse> searchByName(String name) {
        return storeRepository.findByNameContaining(name)
                .stream()
                .map(StoreSimpleResponse::from)
                .toList();
    }
}
