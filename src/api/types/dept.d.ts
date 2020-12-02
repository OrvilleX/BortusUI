
/**
 * 查询、导出部门数据包
 */
export interface IDeptQueryData {
    name?: string
    enabled?: boolean
    pid?: number
    pidIsNull?: number
    createTime?: string[]
}

/**
 * 新增、修改部门数据包
 */
export interface IDeptData {
    id?: number
    roles?: object[]
    deptSort?: number
    name?: string
    enabled?: boolean
    pid?: number
    subCount?: number
}