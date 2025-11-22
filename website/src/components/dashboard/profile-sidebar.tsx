import * as Dailp from "src/graphql/dailp"
import { EditButton } from "./edit-profile-sidebar"
import * as css from "./profile-sidebar.css"

export const ProfileSidebar = () => {
  const [{ data, fetching, error }] = Dailp.useCurrentUserQuery()
  const user = data?.currentUser

  // Loading state
  if (fetching) {
    return (
      <div className={css.loadingState}>
        <div className={css.avatarSkeleton}></div>
        <div className={css.textSkeleton}></div>
      </div>
    )
  }

  // Error state
  if (error || !user) {
    return (
      <div className={css.errorState}>
        <p>Unable to load profile</p>
      </div>
    )
  }

  // Format member since date
  const memberSince = user.createdAt
    ? `${user.createdAt.month}/${user.createdAt.year}`
    : null
  return (
    <>
      {/* Avatar */}
      <div className={css.avatarContainer}>
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.displayName}'s profile`}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatarPlaceholder}>
            {user.displayName?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={css.userInfo}>
        <h2 className={css.displayName}>{user.displayName}</h2>

        <br />
        {user.role && <p className={css.role}>Role: {user.role}</p>}

        {user.bio && (
          <>
            <p className={css.bioLabel}>Bio: </p>
            <p className={css.bio}>{user.bio}</p>
          </>
        )}

        {/* Details */}
        <div className={css.details}>
          {user.organization && (
            <div className={css.detailItem}>
              <span className={css.detailIcon}>🏢</span>
              <span className={css.detailText}>{user.organization}</span>
            </div>
          )}

          {user.location && (
            <div className={css.detailItem}>
              <span className={css.detailIcon}>📍</span>
              <span className={css.detailText}>{user.location}</span>
            </div>
          )}

          {memberSince && (
            <div className={css.detailItem}>
              <span className={css.detailIcon}>📅</span>
              <span className={css.detailText}>Member since {memberSince}</span>
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        <EditButton />
      </div>
    </>
  )
}
