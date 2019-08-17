export type UpdateData = (prevData: any, nextProps: { data: any }) => any

export const defaultUpdateData: UpdateData = (a, { data }) => data

export const initialState = {
  loading: undefined,
  data: undefined,
  error: undefined,
  headers: undefined,
}
