import { UpdateData } from '../../global'

export const defaultUpdateData: UpdateData = (a, { data }) => data

export const initialState = {
  loading: undefined,
  data: undefined,
  error: undefined,
  headers: undefined,
}
