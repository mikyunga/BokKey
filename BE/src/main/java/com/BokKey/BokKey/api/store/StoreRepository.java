package com.BokKey.BokKey.api.store;

import com.BokKey.BokKey.api.store.domain.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {

    List<Store> findByNameContaining(String name);

    List<Store> findByIsLive(boolean isLive);

    // 지역 정보 기반
    List<Store> findByRegion_CityContaining(String city);
    List<Store> findByRegion_AreaNameContaining(String areaName);

    // 카테고리, 대상
    List<Store> findByCategories_NameContaining(String category);
    List<Store> findByTargets_DistrictContaining(String target);
}