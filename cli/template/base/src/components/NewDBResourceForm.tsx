import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { useInsertDBResource } from '../api/useResource'
import log from '../lib/logger'

export const NewDBResourceForm = () => {
  const queryClient = useQueryClient()
  const insertResource = useInsertDBResource()

  const form = useForm({
    defaultValues: {
      title: '',
      body: '',
      user_id: 1,
    },
    onSubmit: async ({ value }) => {
      insertResource.mutate(value, {
        onSuccess: (result) => {
          log.info('Resource added successfully', result)
          queryClient.invalidateQueries({ queryKey: ['resources'] })
          form.reset()
        },
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="container"
      style={{ gap: '0.5rem' }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => (!value ? 'Title is required' : undefined),
        }}
        children={(field) => (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Title"
            className="input"
          />
        )}
      />
      <form.Field
        name="body"
        validators={{
          onChange: ({ value }) => (!value ? 'Body is required' : undefined),
        }}
        children={(field) => (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Body"
            className="input"
          />
        )}
      />
      <form.Field
        name="user_id"
        validators={{
          onChange: ({ value }) => (!value ? 'User ID is required' : undefined),
        }}
        children={(field) => (
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(parseInt(e.target.value, 10))}
            placeholder="User ID"
            className="input"
          />
        )}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            className="btn btn-gradient"
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Adding...' : 'Add Resource'}
          </button>
        )}
      />
      {insertResource.isError && (
        <p style={{ color: 'red' }}>Error: {insertResource.error.message}</p>
      )}
    </form>
  )
}
