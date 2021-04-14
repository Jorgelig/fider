import "./VoteCounter.scss"

import React, { useState } from "react"
import { Post, PostStatus } from "@fider/models"
import { actions, device, classSet } from "@fider/services"
import { SignInModal } from "@fider/components"
import { useFider } from "@fider/hooks"
import FaCaretUp from "@fider/assets/images/fa-caretup.svg"

interface VoteCounterProps {
  post: Post
}

export const VoteCounter = (props: VoteCounterProps) => {
  const fider = useFider()
  const [hasVoted, setHasVoted] = useState(props.post.hasVoted)
  const [votesCount, setVotesCount] = useState(props.post.votesCount)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const voteOrUndo = async () => {
    if (!fider.session.isAuthenticated) {
      setIsSignInModalOpen(true)
      return
    }

    const action = hasVoted ? actions.removeVote : actions.addVote

    const response = await action(props.post.number)
    if (response.ok) {
      setVotesCount(votesCount + (hasVoted ? -1 : 1))
      setHasVoted(!hasVoted)
    }
  }

  const hideModal = () => setIsSignInModalOpen(false)

  const status = PostStatus.Get(props.post.status)

  const className = classSet({
    "m-voted": !status.closed && hasVoted,
    "m-disabled": status.closed,
    "no-touch": !device.isTouch(),
  })

  const vote = (
    <button className={className} onClick={voteOrUndo}>
      <FaCaretUp height="16" width="16" />
      {votesCount}
    </button>
  )

  const disabled = (
    <button className={className}>
      <FaCaretUp height="16" width="16" />
      {votesCount}
    </button>
  )

  return (
    <>
      <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
      <div className="c-vote-counter">{status.closed ? disabled : vote}</div>
    </>
  )
}
