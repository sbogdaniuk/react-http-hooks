import { sleep } from '../../../utils'

import { TMutationFunc } from '../../../hooks/http/useMutation'

export const onSubmit = <Values, Data = any>(
  addComment: TMutationFunc<Values, Data>,
) => async (values: Values) => {
  console.log(111, 'Start submit', values)
  await sleep(1000)

  const payload = await addComment({ data: values })

  console.log(999, 'End submit', payload)
}
