import { sleep } from '../../../utils'

export const onSubmit = (mutation: (values: any) => Promise<void>) => async (
  values: any,
) => {
  console.log(111, 'Start submit', values)
  await sleep(1000)

  await mutation(values)

  console.log(999, 'End submit')
}
