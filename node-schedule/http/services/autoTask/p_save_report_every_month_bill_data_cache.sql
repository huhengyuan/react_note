CREATE DEFINER = `supoin` @`%` PROCEDURE `p_save_report_every_month_bill_data_cache`() begin
insert into `tenant_report_every_month_bill_data_cache` (
        `tenantId`,
        `year`,
        `month`,
        `dimension`,
        `dValue`,
        `billType`,
        `source`,
        `qty`,
        `createTime`,
        `createPerson`
    ) -- 注意：以下都是在下个月计算上个月的数据，然后再保存：
    -- 1.1 台账资产 - 计算每个部门每个月的资产
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'base' as billType,
    'baseAssets' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_asset
where ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    ownOrgName
union
-- 1.2 台账资产 - 每个月每个厂商的设备数量 
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'manufacturers' as dimension,
    manufacturers as dValue,
    'base' as billType,
    'baseAssets' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_asset
where manufacturers is not null
    and manufacturers <> ''
group by tenantId,
    manufacturers
union
-- 2.1 设备维修（部门 - 故障数量） - 每个月每个部门的故障数量
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'repaire' as billType,
    'repairTimes' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_repair_detail
where startTime is not null
    and date_format(startTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
    and ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    ownOrgName
union
-- 2.2 设备维修（部门 - 完成内修） - 每个月每个部门的 完成维修-内修 的数量 
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'repaire' as billType,
    'repairedIn' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_repair_detail
where startTime is not null
    and endTime is not null
    and endTime <> ''
    and date_format(endTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
    and ownOrgName is not null
    and ownOrgName <> ''
    and repairPosition = '内修'
group by tenantId,
    ownOrgName
union
-- 2.3 设备维修（部门 - 完成外修） - 每个月每个部门的 完成维修-外修 的数量 
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'repaire' as billType,
    'repairedOut' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_repair_detail
where startTime is not null
    and endTime is not null
    and endTime <> ''
    and date_format(endTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
    and ownOrgName is not null
    and ownOrgName <> ''
    and repairPosition = '外修'
group by tenantId,
    ownOrgName
union
-- 2.4 设备维修（部门 - 维修中数量） - 每个月每个部门的维修中的数量 
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'repaire' as billType,
    'repairing' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_repair_detail
where startTime is not null
    and date_format(startTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
    and endTime is null
    and ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    ownOrgName
union
-- 2.5 设备维修（厂商-故障类别） - 每个月每个厂商的故障类别的设备数量 
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'manufacturers' as dimension,
    manufacturers as dValue,
    'repaire' as billType,
    faultPhenomenon as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_repair_detail
where startTime is not null
    and date_format(startTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
    and endTime is null
    and ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    manufacturers,
    faultPhenomenon
union
-- 3.1 设备验收(新增) - 每个月每个部门的新增设备，即验收发起日期为本月
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'accept' as billType,
    'acceptNew' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_acceptance_detail
where startTime is not null
    and startTime <> ''
    and date_format(startTime, '%Y-%m') = date_format(
        date_sub(CURRENT_DATE, interval 1 month),
        '%Y-%m'
    )
    and ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    ownOrgName
union
-- 3.2 设备验收(完成) - 每个月每个部门的完成验收的设备，即验收完成日期为本月
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'accept' as billType,
    'accepted' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_acceptance_detail
where endTime is not null
    and endTime <> ''
    and date_format(endTime, '%Y-%m') = date_format(
        date_sub(CURRENT_DATE, interval 1 month),
        '%Y-%m'
    )
    and ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    ownOrgName
union
-- 3.3 设备验收(累计待验收) - 每个月每个部门的累计待验收数据
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'accept' as billType,
    'needAccept' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_acceptance_detail
where endTime is null
    and ownOrgName is not null
    and ownOrgName <> ''
group by tenantId,
    ownOrgName
union
-- 3.4. 设备验收(超期未验收) - 计算本月超期未验收数据
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'accept' as billType,
    'notAccept' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_bill_acceptance_detail
where endTime is null
    and ownOrgName is not null
    and ownOrgName <> ''
    and planTime is not null
    and planTime <> ''
    AND planTime < DATE_SUB(curdate(), interval day(curdate()) - 1 day)
group by tenantId,
    ownOrgName
union
-- 4.1 设备维护 - 计算每个部门每个月的当月#维护设备数据
select a.tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    a.ownOrgName as dValue,
    'maintain' as billType,
    'maintained' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from (
        select tenantId,
            assetId,
            ownOrgName,
            max(maintainTime),
            period
        from v_bill_maintain_detail
        where status = '在用'
            and ownOrgName is not null
            and ownOrgName <> ''
            and maintainTime is not null
            and maintainTime <> ''
            and date_format(maintainTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
        group by tenantId,
            assetId
    ) a
group by tenantId,
    ownOrgName
union
-- 4.2 设备维护 - 计算每个部门每个月的当月#过期维护设备数据，维护的周期为天
select a.tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    a.ownOrgName as dValue,
    'maintain' as billType,
    'maintainOutDate' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from (
        select tenantId,
            assetId,
            ownOrgName,
            max(maintainTime) as maintainTime,
            period
        from v_bill_maintain_detail
        where status = '在用'
            and ownOrgName is not null
            and ownOrgName <> ''
            and maintainTime is not null
            and maintainTime <> ''
            and date_format(maintainTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
        group by tenantId,
            assetId
    ) a
where DATE_ADD(a.maintainTime, INTERVAL + a.period day) < DATE_SUB(curdate(), interval day(curdate()) - 1 day)
group by tenantId,
    ownOrgName
union
-- 注意：计量的数据是更新的。
-- 5.1 设备计量：每个部门当月#完成计量的设备数量，计量周期为月
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'measure' as billType,
    'measuredForAsset' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from v_bill_measure_detail
where status = '在用'
    and ownOrgName is not null
    and ownOrgName <> ''
    and correctTime is not null
    and correctTime <> ''
    and date_format(correctTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 5.2 设备计量：计算每个部门当月#过期计量的设备数量，计量周期为月
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'measure' as billType,
    'measureOutDateForAsset' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from v_bill_measure_detail
where status = '在用'
    and ownOrgName is not null
    and ownOrgName <> ''
    and correctTime is not null
    and correctTime <> ''
    and date_format(
        DATE_ADD(correctTime, INTERVAL + period month),
        '%Y-%m'
    ) = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 6.1 物料计量：每个部门当月#完成计量的物料数量，计量周期为月
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'measure' as billType,
    'measuredForMaterial' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_asset_material
where status = '在用'
    and ownOrgName is not null
    and ownOrgName <> ''
    and correctTime is not null
    and correctTime <> ''
    and date_format(correctTime, '%Y-%m') = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName
union
-- 6.2 物料计量：计算每个部门当月#过期计量的物料数量，计量周期为月
select tenantId,
    date_format(date_sub(CURDATE(), interval 1 month), '%Y') as year,
    date_format(date_sub(CURDATE(), interval 1 month), '%m') as month,
    'ownOrgName' as dimension,
    ownOrgName as dValue,
    'measure' as billType,
    'measureOutDateForMaterial' as source,
    count(*) as qty,
    now() as createTime,
    'sys' as createPerson
from tenant_asset_material
where status = '在用'
    and ownOrgName is not null
    and ownOrgName <> ''
    and correctTime is not null
    and correctTime <> ''
    and date_format(
        DATE_ADD(correctTime, INTERVAL + period month),
        '%Y-%m'
    ) = date_format(date_sub(CURDATE(), interval 1 month), '%Y-%m')
group by tenantId,
    ownOrgName;
end