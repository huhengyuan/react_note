create view `v_user_list` as
select 
a.*,
b.tenantName,
c.orgName,
d.employeeName
from tenant_user a
join tenant b on a.tenantId=b.tenantId
join tenant_org c on a.tenantId=c.tenantId and a.orgId=c.orgId
join tenant_employee d on a.tenantId=d.tenantId and a.orgId=d.orgId and a.employeeId=d.employeeId


create view `v_user_page` as
select 
a.*,
b.tenantName,
c.orgName,
d.employeeName,
e.pageName,
e.pageDesc,
e.parentId,
e.level,
e.order
from tenant_user_page a 
join tenant b on a.tenantId=b.tenantId
join tenant_org c on a.tenantId=c.tenantId and a.orgId=c.orgId
join v_user_list d on a.tenantId = d.tenantId and a.orgId=d.orgId and a.userId=d.userId
join tenant_page e on a.tenantId=e.tenantId and a.pageId=e.pageId
