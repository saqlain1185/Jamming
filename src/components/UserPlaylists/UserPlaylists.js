import React from 'react'
import "./UserPlaylists.js"
const UserPlaylists = ({ playlists,onSelect ,onCreateNewPlaylist }) => {
  return (
    <div className='Userplaylists'>
      <h2>your playlists</h2>
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.id} onClick={() => onSelect(playlist)} >
            {playlist.name}
          </li>
        ))}
      </ul>
      <button className='new-playlist' onClick={onCreateNewPlaylist}>New PLAYLIST</button>
    </div>
  )
}

export default UserPlaylists




