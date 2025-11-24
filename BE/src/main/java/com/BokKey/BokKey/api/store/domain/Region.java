package com.BokKey.BokKey.api.store.domain;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 시/도 (예: 서울특별시, 경기도)
    private String province;

    // 시/군/구 (예: 강남구, 수원시)
    private String city;

    // areaName 전체 이름이 있다면 (예: 서울특별시 강남구)
    private String areaName;
}
