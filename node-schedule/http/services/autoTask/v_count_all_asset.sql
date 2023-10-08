SELECT row_number() OVER () AS `id`,
    `x`.`tenantId` AS `tenantId`,
    `x`.`dimension` AS `dimension`,
    `x`.`dValue` AS `dValue`,
    `x`.`qty` AS `qty`,
    `x`.`oldNetValue` AS `oldNetValue`,
    now() AS `createTime`,
    'sys' AS `createPerson`,
    now() AS `updateTime`,
    'sys' AS `updatePerson`,
    '' AS `remarks`,
    '' AS `isDelete`
FROM (
        SELECT `tenant_asset`.`tenantId` AS `tenantId`,
            'ownOrgName' AS `dimension`,
            `tenant_asset`.`ownOrgName` AS `dValue`,
            count(0) AS `qty`,
            REPLACE (
                format(
                    sum(
                        IF (
                            (
                                (
                                    `tenant_asset`.`initialValue` - (
                                        (
                                            `tenant_asset`.`initialValue` / `tenant_asset`.`durableYears`
                                        ) * timestampdiff(MONTH, `tenant_asset`.`inFactoryDate`, now())
                                    )
                                ) > (`tenant_asset`.`initialValue` * 0.05)
                            ),
(
                                `tenant_asset`.`initialValue` - (
                                    (
                                        `tenant_asset`.`initialValue` / `tenant_asset`.`durableYears`
                                    ) * timestampdiff(MONTH, `tenant_asset`.`inFactoryDate`, now())
                                )
                            ),
(
                                `tenant_asset`.`initialValue` * 0.05
                            )
                        )
                    ),
                    2
                ),
                ',',
                ''
            ) AS `oldNetValue`
        FROM `tenant_asset`
        WHERE (
                (`tenant_asset`.`className` = '正式设备')
                AND (`tenant_asset`.`ownOrgName` IS NOT NULL)
                AND (`tenant_asset`.`ownOrgName` <> '')
            )
        GROUP BY `tenant_asset`.`tenantId`,
            `tenant_asset`.`ownOrgName`
        UNION
        SELECT `tenant_asset`.`tenantId` AS `tenantId`,
            'manufacturers' AS `dimension`,
            `tenant_asset`.`manufacturers` AS `dValue`,
            count(0) AS `qty`,
            REPLACE (
                format(
                    sum(
                        IF (
                            (
                                (
                                    `tenant_asset`.`initialValue` - (
                                        (
                                            `tenant_asset`.`initialValue` / `tenant_asset`.`durableYears`
                                        ) * timestampdiff(MONTH, `tenant_asset`.`inFactoryDate`, now())
                                    )
                                ) > (`tenant_asset`.`initialValue` * 0.05)
                            ),
(
                                `tenant_asset`.`initialValue` - (
                                    (
                                        `tenant_asset`.`initialValue` / `tenant_asset`.`durableYears`
                                    ) * timestampdiff(MONTH, `tenant_asset`.`inFactoryDate`, now())
                                )
                            ),
(
                                `tenant_asset`.`initialValue` * 0.05
                            )
                        )
                    ),
                    2
                ),
                ',',
                ''
            ) AS `oldNetValue`
        FROM `tenant_asset`
        WHERE (
                (`tenant_asset`.`className` = '正式设备')
                AND (`tenant_asset`.`manufacturers` IS NOT NULL)
                AND (`tenant_asset`.`manufacturers` <> '')
            )
        GROUP BY `tenant_asset`.`tenantId`,
            `tenant_asset`.`manufacturers`
        UNION
        SELECT `tenant_asset`.`tenantId` AS `tenantId`,
            'infactoryDate' AS `dimension`,
            YEAR (`tenant_asset`.`inFactoryDate`) AS `level`,
            count(0) AS `qty`,
            REPLACE (
                format(
                    sum(
                        IF (
                            (
                                (
                                    `tenant_asset`.`initialValue` - (
                                        (
                                            `tenant_asset`.`initialValue` / `tenant_asset`.`durableYears`
                                        ) * timestampdiff(
                                            MONTH,
                                            `tenant_asset`.`inFactoryDate`,
                                            now()
                                        )
                                    )
                                ) > (`tenant_asset`.`initialValue` * 0.05)
                            ),
(
                                `tenant_asset`.`initialValue` - (
                                    (
                                        `tenant_asset`.`initialValue` / `tenant_asset`.`durableYears`
                                    ) * timestampdiff(
                                        MONTH,
                                        `tenant_asset`.`inFactoryDate`,
                                        now()
                                    )
                                )
                            ),
(
                                `tenant_asset`.`initialValue` * 0.05
                            )
                        )
                    ),
                    
                    2
                ),
                ',',
                ''
            ) AS `oldNetValue`
        FROM `tenant_asset`
        WHERE (
                (`tenant_asset`.`className` = '正式设备')
                AND (`tenant_asset`.`inFactoryDate` IS NOT NULL)
            )
        GROUP BY `tenant_asset`.`tenantId`,
            YEAR (`tenant_asset`.`inFactoryDate`)
    ) `x`