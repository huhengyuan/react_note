CREATE DEFINER = `supoin` @`%` PROCEDURE `p_save_report_month_year_statistics`() begin
insert into `tenant_report_month_year_statistics` (
        `tenantId`,
        `year`,
        `month`,
        `ownOrgName`,
        `billType`,
        `source`,
        `qty`,
        `createTime`,
        `createPerson`,
        remarks
    ) -- 1. 当月进厂设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'inFactory' as billType,
    'inFactory' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月进厂设备数量' as remarks
from tenant_bill_in_factory_detail
where inFactoryDate is not null
    and date_format(inFactoryDate, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 2. 当月验收完成的设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'accept' as billType,
    'accepted' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月验收完成设备数量' as remarks
from tenant_bill_acceptance_detail
where endTime is not null
    and endTime <> ''
    and date_format(endTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 3. 待验收：当月累计待验收设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'accept' as billType,
    'needAccept' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月待验收设备数量' as remarks
from tenant_bill_acceptance_detail
where endTime is null
group by tenantId,
    ownOrgName
union
-- 4. 超期未验收：当月超期未验收设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'accept' as billType,
    'notAccept' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月超期未验收设备数量' as remarks
from tenant_bill_acceptance_detail
where endTime is null
    and planTime is not null
    and planTime <> ''
    and date_format(planTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 5. 当月完成维护的设备数量
select a.tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    a.ownOrgName,
    'maintain' as billType,
    'maintained' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月完成维护的设备数量' as remarks
from (
        select tenantId,
            assetId,
            ownOrgName,
            max(maintainTime),
            period
        from v_bill_maintain_detail
        where status = '在用'
            and maintainTime is not null
            and maintainTime <> ''
            and date_format(maintainTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
        group by tenantId,
            assetId
    ) a
group by tenantId,
    ownOrgName
union
-- 6. 当月过期维护设备数据, 要确保：最新的维护记录的维护时间+维护周期 < 当月1号
select a.tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    a.ownOrgName,
    'maintain' as billType,
    'maintainOutDate' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月过期维护设备数据' as remarks
from (
        select tenantId,
            assetId,
            ownOrgName,
            max(maintainTime) as maintainTime,
            period
        from v_bill_maintain_detail
        where status = '在用'
            and maintainTime is not null
            and maintainTime <> ''
            and date_format(maintainTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
        group by tenantId,
            assetId
    ) a
where DATE_ADD(a.maintainTime, INTERVAL + a.period day) < date_add(curdate(), interval - day(curdate()) + 1 day)
group by tenantId,
    ownOrgName
union
-- 7. 当月完成计量的设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'measure' as billType,
    'measuredForAsset' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月完成计量的设备数量' as remarks
from v_bill_measure_detail
where status = '在用'
    and correctTime is not null
    and correctTime <> ''
    and date_format(correctTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 8. 当月过期计量的设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'measure' as billType,
    'measureOutDateForAsset' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月过期计量的设备数量' as remarks
from v_bill_measure_detail
where status = '在用'
    and correctTime is not null
    and correctTime <> ''
    and date_format(
        DATE_ADD(correctTime, INTERVAL + period month),
        '%Y-%m'
    ) = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 9. 当月故障总次数
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'repair' as billType,
    'repairTimes' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月故障总次数' as remarks
from tenant_bill_repair_detail
where startTime is not null
    and date_format(startTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 10. 当月台账总的设备数
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'base' as billType,
    'baseAssets' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月台账总的设备数' as remarks
from tenant_asset
group by tenantId,
    ownOrgName
union
-- 11. 当月维修完成的内修数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'repair' as billType,
    'repairedIn' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月维修完成的内修数量' as remarks
from tenant_bill_repair_detail
where repairPosition = '内修'
    and startTime is not null
    and endTime is not null
    and date_format(endTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 12. 当月维修完成的外修数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'repair' as billType,
    'repairedOut' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月维修完成的外修数量' as remarks
from tenant_bill_repair_detail
where repairPosition = '外修'
    and startTime is not null
    and endTime is not null
    and date_format(endTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 13. 当月累计的维修中的内修数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'repair' as billType,
    'repairingIn' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月累计的维修中的内修数量' as remarks
from tenant_bill_repair_detail
where repairPosition = '内修'
    and endTime is null
group by tenantId,
    ownOrgName
union
-- 14. 当月累计的维修中的外修数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'repair' as billType,
    'repairingOut' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月累计的维修中的外修数量' as remarks
from tenant_bill_repair_detail
where repairPosition = '外修'
    and endTime is null
group by tenantId,
    ownOrgName
union
-- 15. 当月的提报闲置设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    applyOrgName as ownOrgName,
    'unuse' as billType,
    'unuse' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月的提报闲置设备数量' as remarks
from v_bill_unuse_detail
where createTime is not null
    and date_format(createTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    applyOrgName
union
-- 16. 当月闲置的资产净值
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    applyOrgName as ownOrgName,
    'unuse' as billType,
    'unuseOldNetValue' as source,
    REPLACE (
        format(
            sum(
                IF(
                    (
                        (
                            `initialValue` -(
                                (`initialValue` / `durableYears`) * timestampdiff(MONTH, `inFactoryDate`, now())
                            )
                        ) > (`initialValue` * 0.05)
                    ),
                    (
                        `initialValue` - (
                            (`initialValue` / `durableYears`) * timestampdiff(MONTH, `inFactoryDate`, now())
                        )
                    ),
                    (`initialValue` * 0.05)
                )
            ),
            2
        ),
        ',',
        ''
    ) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月闲置的资产净值' as remarks
from v_bill_unuse_detail
where createTime is not null
    and date_format(createTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    applyOrgName
union
-- 17. 当月出厂设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    applyOrgName as ownOrgName,
    'leaveFactory' as billType,
    'leaveFactory' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月出厂设备数量' as remarks
from v_bill_leave_factory_detail
where leaveTime is not null
    and leaveTime <> ''
    and date_format(leaveTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    applyOrgName
union
-- 18. 当月报废设备数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'scrap' as billType,
    'scrap' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月报废设备数量' as remarks
from tenant_asset_scrap
where createTime is not null
    and date_format(createTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 19. 当月报废的资产净值
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    ownOrgName,
    'scrap' as billType,
    'scrapOldNetValue' as source,
    REPLACE (
        format(
            sum(
                IF(
                    (
                        (
                            `initialValue` -(
                                (`initialValue` / `durableYears`) * timestampdiff(MONTH, `inFactoryDate`, now())
                            )
                        ) > (`initialValue` * 0.05)
                    ),
                    (
                        `initialValue` - (
                            (`initialValue` / `durableYears`) * timestampdiff(MONTH, `inFactoryDate`, now())
                        )
                    ),
                    (`initialValue` * 0.05)
                )
            ),
            2
        ),
        ',',
        ''
    ) as qty,
    now() as createTime,
    'sys' as createPerson,
    '当月报废的资产净值' as remarks
from tenant_asset_scrap
where createTime is not null
    and date_format(createTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName;
end