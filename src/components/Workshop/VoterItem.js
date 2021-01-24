import React from 'react'

export const VoterItem = ({ ranking, name, details, votes, setVoteOpen }) => {
  return (
    <tr>
      <td>{ranking}</td>
      <td>{name}</td>
      <td className="hidden-sm">
        <div className="voter-table__details">
          <p className="voter-table__details-inner">{details}</p>
        </div>
      </td>
      <td>{votes} GLF</td>
      <td>
        <button
            disabled
            style={{ backgroundColor: "#4a4a4a" }}
          type="button"
          className="btn btn--vote"
          data-modal="vote"
          onClick={setVoteOpen}
        >
          Vote
        </button>
      </td>
    </tr>
  )
}
