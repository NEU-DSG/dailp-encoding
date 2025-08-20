import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUser, useUserRole } from "src/auth"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { uploadCollectionCoverToS3 } from "./utils"

interface NewEditedCollectionForm {
  title: string
  description: string
  thumbnail: File | null
}

const NewEditedCollectionPage = () => {
  const userRole = useUserRole()

  // Show loading state while determining user role
  if (userRole === undefined) {
    return (
      <Layout>
        <Helmet title="Loading..." />
        <main>
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    )
  }

  // Check if user has permission to create edited collections
  if (userRole !== UserRole.Editor && userRole !== UserRole.Admin) {
    return (
      <Layout>
        <Helmet title="Access Denied" />
        <main>
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h1>Access Denied</h1>
            <p>
              You need Editor permissions to create edited collections. Please
              contact an administrator if you believe you should have access.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Return to Home
            </button>
          </div>
        </main>
      </Layout>
    )
  }

  const [formData, setFormData] = useState<NewEditedCollectionForm>({
    title: "",
    description: "",
    thumbnail: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, addEditedCollection] = Dailp.useAddEditedCollectionMutation()
  const { user } = useUser()

  const handleEditedCollectionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.thumbnail) {
        setError("Please select a cover image to upload.")
        return
      }
      console.log("Submitting mutation with input:", {
        title: formData.title,
        description: formData.description,
      })

      const uploadResult = await uploadCollectionCoverToS3(
        user!,
        formData.thumbnail
      )

      const result = await addEditedCollection({
        input: {
          title: formData.title,
          description: formData.description,
          thumbnailUrl: uploadResult.resourceURL,
        },
      })

      console.log("Mutation result:", result)
      console.log("Result data:", result.data)
      console.log("Result error:", result.error)
      console.log("Result extensions:", result.extensions)

      if (result.error) {
        setError(`GraphQL Error: ${result.error.message}`)
        return
      }

      if (result.data?.createEditedCollection) {
        console.log(
          "Successfully created collection with ID:",
          result.data.createEditedCollection
        )
        // Navigate to the new collection or show success message
        navigate(`/collections/${result.data.createEditedCollection}`)
      } else {
        console.log("No data returned from mutation")
        setError("No data returned from mutation")
      }
    } catch (err) {
      console.error("Exception during mutation:", err)
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTextInputChange = (
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()
  console.log(dailp?.allEditedCollections)

  return (
    <Layout>
      <Helmet title="New edited collection" />
      <main>
        <h1>Create new edited collection</h1>

        {/* Debug information */}

        {error && (
          <div
            style={{
              color: "red",
              background: "#ffe6e6",
              padding: "10px",
              border: "1px solid #ff9999",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            Error: {error}
          </div>
        )}

        <form onSubmit={handleEditedCollectionSubmit}>
          <label htmlFor="title">Edited Collection Title:</label>
          <br />
          <input
            id="title"
            placeholder="Edited Collection Name"
            value={formData.title}
            onChange={(e) => handleTextInputChange("title", e.target.value)}
            required
          />
          <br />

          <div>
            <label htmlFor="description">Description:</label>
            <br />
            <textarea
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                handleTextInputChange("description", e.target.value)
              }
              rows={6}
              cols={50}
              required
              disabled={isSubmitting}
            />
          </div>
          <br />
          <label htmlFor="thumbnail">Collection Cover:</label>
          <br />
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0] ?? null
              setFormData((prev) => ({ ...prev, thumbnail: file }))
            }}
          />
          <br />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Document..." : "Create Document"}
          </button>
        </form>
      </main>
    </Layout>
  )
}

export const Page = NewEditedCollectionPage
