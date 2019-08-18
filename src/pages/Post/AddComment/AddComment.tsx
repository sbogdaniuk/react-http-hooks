import React from 'react'
import { Form, Field } from 'react-final-form'

import { onSubmit } from './onSubmit'
import { useHttpPost } from '../../../hooks'
import { endpoints } from '../../../constants'

interface IValues {
  name?: string
  email?: string
  comment?: string
}

export const AddComment = () => {
  const [addComment] = useHttpPost<IValues>({
    endpoint: endpoints.comments,
  })

  return (
    <Form onSubmit={onSubmit<IValues>(addComment)}>
      {({ handleSubmit, submitting, pristine, invalid }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Field name="name" type="text">
              {({ input }) => (
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    {...input}
                    className="form-control"
                    id="name"
                    placeholder="John"
                  />
                </div>
              )}
            </Field>
            <Field name="email" type="email">
              {({ input }) => (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    {...input}
                    className="form-control"
                    id="email"
                    placeholder="john@email.com"
                  />
                </div>
              )}
            </Field>
            <Field name="comment">
              {({ input }) => (
                <div className="form-group">
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    {...input}
                    rows={3}
                    className="form-control"
                    id="comment"
                    placeholder="Please leave some comment"
                  />
                </div>
              )}
            </Field>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || pristine || invalid}
            >
              Submit
            </button>
          </form>
        )
      }}
    </Form>
  )
}
