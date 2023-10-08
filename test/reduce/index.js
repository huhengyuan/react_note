const dataContent = {
    status: 0,
    manager: "em_001",
    placeId: "em_p_001",
    ownOrgId: "org_001",
    factory: "郴州一厂",
    useOrgId: "org_002",
    useEmployeeId: "em_002"
}

let obj = Object.keys(dataContent).reduce((acc, key, index, array) => {
    if(dataContent[key] === 0){
        delete dataContent[key]
    }
    return acc;
}, {})