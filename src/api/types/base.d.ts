
export interface IPageable {
    page?: number
    size?: number
    sort?: string
}

export interface IPageableBody<D> {
    readonly content: D[]
    readonly totalElements: number
}