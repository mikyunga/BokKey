package com.BokKey.BokKey.api.store.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // 기존 area 문자열(프론트에서 바로 쓰기용)
    private String area;

    private String address;

    private String phone;

    private String openHours;

    private boolean isLive;

    private boolean isDelivery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToMany
    @JoinTable(
            name = "store_target",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "target_id")
    )
    private List<Target> targets = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "store_meal_type",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "meal_type_id")
    )
    private List<MealType> mealTypes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "store_category",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();
}