
export interface Pageable {
    page?: number
    size?: number
    sort?: string
}

export interface PageableBody<D> {
    readonly content: D[]
    readonly totalElements: number
}
