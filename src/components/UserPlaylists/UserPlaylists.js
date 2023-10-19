import React from 'react';
import './UserPlaylists.css';

function UserPlaylists({ playlists, onSelect, onCreateNewPlaylist }) {
  return (
    <div className="UserPlaylists">
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.id} onClick={() => onSelect(playlist)}>
            {playlist.name}
          </li>
        ))}
      </ul>
      <button className="new-playlist" onClick={onCreateNewPlaylist}>NEW PLAYLIST</button>
    </div>
  );
}

export default UserPlaylists;