export interface TableState {
  hovering_col_i?: number
  hovering_border?: number
  moving_border?: number
  moving_last_x?: number
}

export interface ColumnState {
  width?: number
  enough_width?: number
  hover?: boolean
}

export interface BorderState {
  hover?: boolean
  moving?: boolean
  moving_last_x?: number
}
